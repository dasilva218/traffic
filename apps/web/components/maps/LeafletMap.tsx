'use client';

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSocketContext } from "@/context/useSocket";
import { useEffect, useState } from "react";
import { Position } from "@/types";
import { createCustomIcon } from "@/lib";

export const LIBREVILLE_CENTER: [number, number] = [0.4162, 9.4673];

function MapController({ center }: { center?: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.flyTo(center, 14, { duration: 1.2 });
        }
    }, [center, map]);
    return null;
}

export default function LeafletMap({ userPosition }: { userPosition?: Position | null }) {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const { socket, isConnected } = useSocketContext();

    // 1. Fetch initial positions from API
    useEffect(() => {
        let isMounted = true;
        const fetchInitialTraffic = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
                const res = await fetch(`${apiUrl}/traffics`);
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && Array.isArray(data)) {
                        setPositions(data);
                    }
                }
            } catch (err) {
                console.error("Erreur lors de la récupération initiale du trafic:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchInitialTraffic();

        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Real-time updates via WebSocket
    useEffect(() => {
        if (!socket) return;

        // Ask for latest data if connected
        socket.emit("connect-to-traffic");

        const handleNewTraffic = (data: Position[] | Position) => {
            console.log("Événement 'new-traffic' reçu en temps réel:", data);
            if (Array.isArray(data)) {
                setPositions(data);
            } else if (data && typeof data === "object") {
                setPositions((prev) => {
                    if (data.id_position && prev.some((p) => p.id_position === data.id_position)) {
                        return prev;
                    }
                    return [data, ...prev];
                });
            }
        };

        socket.on("new-traffic", handleNewTraffic);

        return () => {
            socket.off("new-traffic", handleNewTraffic);
        };
    }, [socket]);

    const activeCenter: [number, number] = userPosition?.latitude && userPosition?.longitude
        ? [userPosition.latitude, userPosition.longitude]
        : LIBREVILLE_CENTER;

    return (
        <div className="relative w-full h-full min-h-[420px] bg-[#14171f] overflow-hidden select-none">
            {/* Live real-time status overlay */}
            <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-3 py-1.5 backdrop-blur-md shadow-md text-xs font-mono">
                <span className={`size-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <span className="text-foreground font-medium">
                    {isConnected ? "Temps réel actif" : "Connexion au flux..."}
                </span>
                <span className="text-muted-foreground border-l border-border/60 pl-2">
                    {loading ? "..." : `${positions.length} signalement${positions.length > 1 ? "s" : ""}`}
                </span>
            </div>

            <MapContainer
                zoomControl={true}
                center={activeCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userPosition?.latitude && userPosition?.longitude ? (
                    <MapController center={[userPosition.latitude, userPosition.longitude]} />
                ) : null}

                {/* User's current position marker if available */}
                {userPosition?.latitude && userPosition?.longitude && (
                    <Marker
                        position={[userPosition.latitude, userPosition.longitude]}
                        icon={createCustomIcon("EN_COURS")}
                    >
                        <Popup>
                            <div className="text-xs font-sans text-neutral-900">
                                <strong className="text-emerald-600 block text-sm">Votre position</strong>
                                <p className="font-mono text-[11px] mt-1">
                                    {userPosition.latitude.toFixed(4)}, {userPosition.longitude.toFixed(4)}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Traffic incidents */}
                {positions.map((item, index) => {
                    const key = item.id_position || `${item.latitude}-${item.longitude}-${index}`;
                    return (
                        <Marker
                            key={key}
                            position={[item.latitude, item.longitude]}
                            icon={createCustomIcon("SIGNALER")}
                        >
                            <Popup>
                                <div className="text-xs font-sans text-neutral-900 p-1">
                                    <div className="flex items-center gap-1.5 text-red-600 font-bold mb-1">
                                        <span className="size-2 rounded-full bg-red-600 inline-block animate-ping" />
                                        <span>Incident / Bouchon</span>
                                    </div>
                                    <p className="font-mono text-[11px] text-neutral-700">
                                        <strong>Coordonnées:</strong> {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                                    </p>
                                    {item.created_at && (
                                        <p className="text-[10px] text-neutral-500 mt-1">
                                            Signalé le : {new Date(item.created_at).toLocaleDateString("fr-FR")} à{" "}
                                            {new Date(item.created_at).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}