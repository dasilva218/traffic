'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const context = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocketContext = () => useContext(context);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

    useEffect(() => {
        const socketInstance = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

        const handleConnect = () => {
            console.log("Socket connected:", socketInstance.id);
            setIsConnected(true);
            socketInstance.emit("connect-to-traffic");
        };

        const handleDisconnect = () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        };

        socketInstance.on("connect", handleConnect);
        socketInstance.on("disconnect", handleDisconnect);

        setSocket(socketInstance);

        return () => {
            socketInstance.off("connect", handleConnect);
            socketInstance.off("disconnect", handleDisconnect);
            socketInstance.disconnect();
        };
    }, [SOCKET_URL]);

    return (
        <context.Provider value={{ socket, isConnected }}>
            {children}
        </context.Provider>
    );
}