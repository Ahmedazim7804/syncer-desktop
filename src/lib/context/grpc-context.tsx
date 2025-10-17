import { Channel, invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { getAuthInfoSync } from "../actions/getAuthData";
import { ServerMessage } from "../interfaces/syncer";

type GrpcContextType = {
    isReachable: boolean,
    getIsReachable: () => Promise<boolean>
    startStream: () => void
    streamMessages: ServerMessage[]
}

const GrpcContext = createContext<GrpcContextType | null>(null)

export function GrpcProvider({ children }: { children: ReactNode }) {
    const [isReachable, setIsReachable] = useState(false)
    const [streamMessages, setStreamMessages] = useState<ServerMessage[]>([])

    const channel = new Channel<any>()
    channel.onmessage = (event) => {

        setStreamMessages(prev => [...prev, event])

        // setStreamMessages(prev => [...prev, {
        //     id: event.id,
        //     senderId: event.senderId,
        //     createdAt: event.createdAt,
        //     type: event.type,
        //     clipboard: event.clipboard,
        //     connectedDevices: event.connectedDevices,
        //     genericText: event.genericText,
        // }])
    }

    const getIsReachable = useCallback(async () => {
        const res = await invoke('is_reachable') as boolean
        setIsReachable(res)
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
        getIsReachable()
    }, [])

    // --------------------------------------------------

    return (
        <GrpcContext.Provider value={{
            isReachable,
            getIsReachable,
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