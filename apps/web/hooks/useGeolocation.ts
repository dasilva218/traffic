"use client"
import { Position } from "@/types";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function useGeolocation() {
    const [tracking, setIsTracking] = useState<boolean>(false)
    const [fix, setFix] = useState<Position>({ latitude: 0, longitude: 0 });
    const [isPending, startTransition] = useTransition()

    /*--- gestion des evènements ---*/

    // démarre le suivi
    async function startTracking() {
        startTransition(() => {
            setIsTracking(true)
            if (!navigator.geolocation) {
                toast.error("votre navigateur ne supporte pas la géolocalisation", { position: "top-center" });
                return;
            }
            navigator.geolocation.getCurrentPosition(
                getPosition,
                showError,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5000, // Mettre à jour toutes les 5 secondes
                },
            );

        })
    }

    // Recuperation de la position
    async function getPosition(position: GeolocationPosition) {
        const { latitude, longitude } = position.coords;
        await addPosition({ latitude, longitude });
        setFix({ latitude: latitude, longitude: longitude });

    }

    const addPosition = async ({ latitude, longitude }: Position) => {
        try {
            const response = await fetch("http://localhost:4000/api/traffics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ latitude, longitude }),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(
                    data?.message || `Erreur HTTP ${response.status}`
                );
            }
            toast.success(data?.message, { position: "top-center" });
        } catch (error) {
            toast.error("Erreur lors de l'envoi de la position", { position: "top-center" });
        }

    }
    // Gestion des erreurs
    function showError(error: GeolocationPositionError) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                toast.error("Autorisation refusée", { position: "top-center" })
                break;
            case error.POSITION_UNAVAILABLE:
                toast.error("Position indisponible", { position: "top-center" })
                break;
            case error.TIMEOUT:
                toast.error("Délai dépassé pour récupérer la position", { position: "top-center" })
                break;
            default:
                toast.error("Une erreur inconnue s'est produite.", { position: "top-center" })
                break;
        }
    }

    return {
        startTracking,
        isPending,
        tracking,
        fix
    }
}