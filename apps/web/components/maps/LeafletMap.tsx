'use client';

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSocketContext } from "@/context/useSocket";
import { useEffect, useState } from "react";
import { Position } from "@/types";
import { createCustomIcon } from "@/lib";



export const LIBREVILLE_CENTER: [number, number] = [0.4162, 9.4673]

export default function LeafletMap() {
    const [positions, setPositions] = useState<Position[]>([])
    const { socket } = useSocketContext()


    useEffect(() => {
        if (!socket) return
        socket.on("connect", () => {
            console.log("Connected to server");
        })
        socket.on("new-traffic", (data) => {
            setPositions(data)
        })
    }, [socket])

    console.log(positions);

    return (
        <div className="relative w-full h-full min-h-128 bg-[#1a1a1a] overflow-hidden select-none" >
            <MapContainer
                zoomControl={false}
                center={LIBREVILLE_CENTER}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* <Marker position={LIBREVILLE_CENTER} icon={createCustomIcon()}>
                    <Popup>Centre</Popup>
                </Marker> */}

                {positions?.map((item, key) => (
                    <Marker key={key} position={[item.latitude, item.longitude]}
                        icon={createCustomIcon()}
                    ></Marker>
                ))}

            </MapContainer>
        </div>
    );
}