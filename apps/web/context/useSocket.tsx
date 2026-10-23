'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const context = createContext<{ socket: Socket | null }>({ socket: null, });

export const useSocketContext = () => useContext(context);

export function SocketProvider({ children }: { children: React.ReactNode }) {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const URL_WEB_SOCKET = "ws://localhost:8080"

    useEffect(() => {
        const initializeSocket = io(URL_WEB_SOCKET)
        setSocket(initializeSocket)

        initializeSocket.emit('connect-to-traffic')

        const handleConnect = () => {
            setIsConnected(true)
        }

        const handleDisconnect = () => {
            setIsConnected(false)
        }

        initializeSocket.on('connect-to-traffic', handleConnect)
        initializeSocket.on('disconnect', handleDisconnect)

        return () => {
            initializeSocket.off('connect-to-traffic', handleConnect)
            initializeSocket.off('disconnect', handleDisconnect)
        }

    }, [])

    return (
        <context.Provider value={{ socket }}>
            {children}
        </context.Provider>
    )
}