"use client"

import ContentMap from "@/components/maps/ContentMap";
import { useSocketContext } from "@/context/useSocket";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Radio, TriangleAlert, Compass } from "lucide-react";

export default function PageCarte() {
    const { isConnected } = useSocketContext();

    return (
        <main className="flex-1 flex flex-col relative h-[calc(100vh-65px)] min-h-[500px]">
            {/* Top header bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-card/70 border-b border-border backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                        <Compass className="size-4" />
                        Carte du Trafic · Libreville
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-l border-border pl-3">
                        <span className={`size-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                        {isConnected ? "Flux direct actif" : "Connexion en cours"}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/signaler">
                        <Button size="sm" className="font-mono text-[11px] uppercase tracking-wider bg-primary text-primary-foreground font-bold hover:bg-primary/90">
                            <TriangleAlert className="mr-1.5 size-3.5" />
                            Signaler un bouchon
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Interactive Live Map */}
            <div className="flex-1 relative w-full h-full">
                <ContentMap />
            </div>
        </main>
    );
}
