import { Channel, invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useGetAuthToken from "../hooks/useGetAuthToken";

type GrpcContextType = {
    isConnected: boolean,
    getIsConnected: () => Promise<boolean>
    startStream: () => void
    streamMessages: ServerMessage[]
}

const GrpcContext = createContext<GrpcContextType | null>(null)

export function GrpcProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false)
    const [streamMessages, setStreamMessages] = useState<ServerMessage[]>([])

    const channel = new Channel<ServerMessage>()
    channel.onmessage = (event) => {

        setStreamMessages(prev => [...prev, {
            id: event.id,
            senderId: event.senderId,
            createdAt: event.createdAt,
            type: event.type,
            payload: {
                content: (event.payload as any).Clipboard.text
            },
        }])
    }

    const getIsConnected = useCallback(async () => {
        const res = await invoke('is_connected') as boolean
        setIsConnected(res)
        return res
    }, [])

    const startStream = useCallback(() => {
        // const token = useGetAuthToken()
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTU0MTM2NDYsImlkIjoiMzM1ZjQwZTctYTdhMC00MTU0LTk0YzItZDJmOWI4MDIyMDZmIiwiZGV2aWNlIjoiYWphamFqIn0.LuQi7WqlxVPVkghE66Vv8nBkPchzE3HFTM6tAgb59tM"
        console.log(token)
        invoke('stream_messages', {
            onEvent: channel,
            token: token,
        })
    }, [])

    // ------------------ Use Effects ------------------
    useEffect(() => {
        getIsConnected()
    }, [getIsConnected])

    // --------------------------------------------------

    return (
        <GrpcContext.Provider value={{
            isConnected,
            getIsConnected,
            startStream,
            streamMessages,
        }}>
            {children}
        </GrpcContext.Provider>
    )
}

export const useGrpcContext = () => {
    const context = useContext(GrpcContext)
    if (!context) {
        throw new Error('useGrpcContext must be used within a GrpcProvider')
    }
    return context
}