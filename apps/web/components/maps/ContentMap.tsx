"use client"

import MapCanvas from "./MapCanvas";
import { Position } from "@/types";

export default function ContentMap({ userPosition }: { userPosition?: Position | null }) {
    return (
        <MapCanvas userPosition={userPosition} />
    );
}