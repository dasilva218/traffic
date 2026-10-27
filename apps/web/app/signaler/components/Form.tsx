"use client"

import { Button } from "@/components/ui/button";
import useGeolocation from "@/hooks/useGeolocation";
import { useSocketContext } from "@/context/useSocket";
import { Position } from "@/types";
import { LocateFixedIcon, MapPin, Send, Radio, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const LIBREVILLE_PRESETS = [
    { name: "Carrefour Léon Mba", lat: 0.3924, lng: 9.4537 },
    { name: "Carrefour SNI Owendo", lat: 0.3015, lng: 9.5032 },
    { name: "Rond-point Nzeng-Ayong", lat: 0.4285, lng: 9.4891 },
    { name: "Marché Mont-Bouët", lat: 0.3980, lng: 9.4520 },
    { name: "PK8 Gare Routière", lat: 0.3850, lng: 9.4780 },
    { name: "Carrefour Charbonnages", lat: 0.4350, lng: 9.4620 },
];

export default function ReportForm({
    onPositionChange,
}: {
    onPositionChange?: (pos: Position) => void;
}) {
    const { fix, isPending, isSending, startTracking, tracking, addPosition, setFix } = useGeolocation();
    const { isConnected } = useSocketContext();

    const [latitude, setLatitude] = useState<string>("0.3924");
    const [longitude, setLongitude] = useState<string>("9.4537");
    const [activePreset, setActivePreset] = useState<string | null>("Carrefour Léon Mba");

    // Quand la position GPS change
    useEffect(() => {
        if (fix.latitude !== 0 && fix.longitude !== 0) {
            setLatitude(fix.latitude.toFixed(6));
            setLongitude(fix.longitude.toFixed(6));
            setActivePreset(null);
            onPositionChange?.(fix);
        }
    }, [fix, onPositionChange]);

    const handleSelectPreset = (preset: { name: string; lat: number; lng: number }) => {
        setActivePreset(preset.name);
        setLatitude(preset.lat.toString());
        setLongitude(preset.lng.toString());
        const pos = { latitude: preset.lat, longitude: preset.lng };
        setFix(pos);
        onPositionChange?.(pos);
    };

    const handleCoordChange = (latVal: string, lngVal: string) => {
        setLatitude(latVal);
        setLongitude(lngVal);
        setActivePreset(null);
        const latNum = parseFloat(latVal);
        const lngNum = parseFloat(lngVal);
        if (!isNaN(latNum) && !isNaN(lngNum)) {
            onPositionChange?.({ latitude: latNum, longitude: lngNum });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const latNum = parseFloat(latitude);
        const lngNum = parseFloat(longitude);

        if (isNaN(latNum) || isNaN(lngNum)) {
            return;
        }

        await addPosition({ latitude: latNum, longitude: lngNum });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 border-b border-border p-4 md:p-6 lg:border-b-0 lg:border-r bg-card/40"
        >
            <Header />

            {/* Statut de synchronisation temps réel */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-sm border border-border/80 bg-background/50 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                    <Radio className={`size-3.5 ${isConnected ? "text-emerald-500 animate-pulse" : "text-amber-500"}`} />
                    <span className="text-muted-foreground uppercase tracking-wider">Serveur temps réel</span>
                </div>
                <span className={`font-semibold ${isConnected ? "text-emerald-400" : "text-amber-400"}`}>
                    {isConnected ? "Connecté en direct" : "En cours de connexion..."}
                </span>
            </div>

            {/* Option 1: Géolocalisation GPS */}
            <section
                aria-labelledby="geo-title"
                className="flex flex-col gap-3 rounded-sm border border-border p-4 bg-background/30"
            >
                <div className="flex items-start justify-between gap-3">
                    <h2 id="geo-title" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                        <LocateFixedIcon className="size-3.5" aria-hidden="true" />
                        1. Localisation automatique GPS
                    </h2>

                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                        <span className="pulse-dot size-2 rounded-full bg-primary" aria-hidden="true" />
                        {tracking ? "Suivi actif" : "Inactif"}
                    </span>
                </div>

                <Button
                    disabled={isPending || isSending}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={startTracking}
                    className="w-full justify-center font-mono text-xs cursor-pointer"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Détection de la position...
                        </>
                    ) : (
                        <>
                            <MapPin className="mr-2 h-4 w-4 text-primary" />
                            Utiliser ma position actuelle (GPS)
                        </>
                    )}
                </Button>
            </section>

            {/* Option 2: Points chauds de Libreville */}
            <section className="flex flex-col gap-2.5 rounded-sm border border-border p-4 bg-background/30">
                <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                    <Sparkles className="size-3.5" />
                    2. Ou choisir un carrefour fréquent
                </h2>
                <div className="grid grid-cols-2 gap-2">
                    {LIBREVILLE_PRESETS.map((p) => {
                        const isSelected = activePreset === p.name;
                        return (
                            <button
                                key={p.name}
                                type="button"
                                onClick={() => handleSelectPreset(p)}
                                className={`text-left px-2.5 py-2 rounded-sm border text-xs transition-colors flex flex-col gap-0.5 cursor-pointer ${isSelected
                                        ? "border-primary bg-primary/10 text-primary font-medium"
                                        : "border-border hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <span className="font-sans font-medium line-clamp-1">{p.name}</span>
                                <span className="font-mono text-[9px] opacity-75">{p.lat}, {p.lng}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Coordonnées manuelles */}
            <section className="flex flex-col gap-2.5 rounded-sm border border-border p-4 bg-background/30">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    3. Coordonnées exactes à signaler
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <span className="text-[10px] font-mono text-muted-foreground block mb-1">Latitude</span>
                        <input
                            type="number"
                            step="any"
                            value={latitude}
                            onChange={(e) => handleCoordChange(e.target.value, longitude)}
                            className="w-full rounded-sm border border-input bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="0.3924"
                            required
                        />
                    </div>
                    <div>
                        <span className="text-[10px] font-mono text-muted-foreground block mb-1">Longitude</span>
                        <input
                            type="number"
                            step="any"
                            value={longitude}
                            onChange={(e) => handleCoordChange(latitude, e.target.value)}
                            className="w-full rounded-sm border border-input bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="9.4537"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Bouton de soumission */}
            <Button
                disabled={isSending}
                type="submit"
                size="lg"
                className="w-full font-mono text-xs uppercase tracking-wider py-5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg"
            >
                {isSending ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Transmission en direct...
                    </>
                ) : (
                    <>
                        <Send className="mr-2 size-4" />
                        Signaler ce trafic en direct
                    </>
                )}
            </Button>
            <p className="text-center font-mono text-[10px] text-muted-foreground">
                Apparaît instantanément sur la carte sans rechargement de page.
            </p>
        </form>
    );
}

function Header() {
    return (
        <header className="flex flex-col gap-1.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Acteur 01 · Signaleur</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Déclarer un embouteillage</h1>
            <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
                Transmettez les coordonnées d&apos;un ralentissement. La carte de tous les utilisateurs se met à jour en temps réel.
            </p>
        </header>
    );
}