import { Channel, invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { getAuthInfoSync } from "../actions/getAuthData";

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
        const authInfo = getAuthInfoSync()
        invoke('stream_messages', {
            onEvent: channel,
            token: authInfo.token.access_token,
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