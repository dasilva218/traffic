"use client"

import ContentMap from "@/components/maps/ContentMap";
import ReportForm from "./components/Form";
import { useState } from "react";
import { Position } from "@/types";

export default function PageSignaler() {
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

    return (
        <main className="flex-1 flex flex-col lg:grid lg:grid-cols-[minmax(0,440px)_1fr] min-h-[calc(100vh-65px)]">
            <ReportForm onPositionChange={setSelectedPosition} />
            <div className="flex-1 min-h-[480px] lg:min-h-full h-full relative">
                <ContentMap userPosition={selectedPosition} />
            </div>
        </main>
    );
}