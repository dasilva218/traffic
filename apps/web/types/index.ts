import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type roles = {
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    role: string;
    title: string;
    text: string;
    cta: string;
    primary: boolean;
}

export type Position = {
    id_position?: string;
    latitude: number;
    longitude: number;
    created_at?: string;
    updated_at?: string;
    accuracy?: number;
}