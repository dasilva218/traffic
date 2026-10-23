"use client"
import { Position } from "@/types";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function useGeolocation() {
    const [tracking, setIsTracking] = useState<boolean>(false);
    const [fix, setFix] = useState<Position>({ latitude: 0, longitude: 0 });
    const [isPending, startTransition] = useTransition();
    const [isSending, setIsSending] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

    // démarre le suivi GPS
    async function startTracking() {
        startTransition(() => {
            setIsTracking(true);
            if (typeof window === "undefined" || !navigator.geolocation) {
                toast.error("Votre navigateur ne supporte pas la géolocalisation", { position: "top-center" });
                return;
            }
            navigator.geolocation.getCurrentPosition(
                getPosition,
                showError,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5000,
                },
            );
        });
    }

    // Récupération de la position GPS
    async function getPosition(position: GeolocationPosition) {
        const { latitude, longitude } = position.coords;
        setFix({ latitude, longitude });
        await addPosition({ latitude, longitude });
    }

    // Envoi d'une position de trafic à l'API
    const addPosition = async ({ latitude, longitude }: Position) => {
        setIsSending(true);
        try {
            const response = await fetch(`${API_URL}/traffics`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || `Erreur HTTP ${response.status}`);
            }

            toast.success(data?.message || "Signalement de trafic envoyé avec succès !", {
                position: "top-center",
            });
            return data;
        } catch (error: any) {
            console.error("Erreur addPosition:", error);
            toast.error(error?.message || "Erreur lors de l'envoi du trafic", {
                position: "top-center",
            });
            throw error;
        } finally {
            setIsSending(false);
        }
    };

    // Gestion des erreurs GPS
    function showError(error: GeolocationPositionError) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                toast.error("Autorisation de localisation refusée par votre navigateur", { position: "top-center" });
                break;
            case error.POSITION_UNAVAILABLE:
                toast.error("Position GPS indisponible actuellement", { position: "top-center" });
                break;
            case error.TIMEOUT:
                toast.error("Délai dépassé pour récupérer votre position", { position: "top-center" });
                break;
            default:
                toast.error("Une erreur inconnue s'est produite lors de la géolocalisation.", { position: "top-center" });
                break;
        }
    }

    return {
        startTracking,
        addPosition,
        setFix,
        isPending,
        isSending,
        tracking,
        fix,
    };
}