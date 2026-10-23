"use client"

import dynamic from "next/dynamic"
import { Position } from "@/types"

const TrafficMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full min-h-[420px] items-center justify-center bg-secondary/40">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
                Chargement de la carte…
            </span>
        </div>
    ),
})

export default function MapCanvas({ userPosition }: { userPosition?: Position | null }) {
    return <TrafficMap userPosition={userPosition} />
}

