import { Channel, invoke } from "@tauri-apps/api/core";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useGetAuthInfo, { getAuthInfoSync } from "../actions/getAuthData";
import { DeviceInfo, MessageType, ServerMessage } from "../interfaces/syncer";
import { start } from "repl";
import { useAuth } from "./auth-context";

const serverMessageChannel = new Channel<ServerMessage>();
let isStreamStarted = false;

type GrpcContextType = {
  isReachable: boolean;
  getIsReachable: () => Promise<boolean>;
  streamMessages: ServerMessage[];
  devices: DeviceInfo[];
};

const GrpcContext = createContext<GrpcContextType | null>(null);

export function GrpcProvider({ children }: { children: ReactNode }) {
  const [isReachable, setIsReachable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [streamMessages, setStreamMessages] = useState<ServerMessage[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<DeviceInfo[]>([]);
  const { isLoggedIn } = useAuth();
  const { data: authData } = useGetAuthInfo();
  const connectChannel = useRef<Channel<boolean>>(new Channel<boolean>());

  async function connect() {
    if (isConnected) return;
    try {
      const res = await invoke<boolean>("connect", {
        token: authData?.token.access_token,
      });
      if (res === true) {
        setIsConnected(true);
      }
    } catch (error) {
      setIsConnected(false);
      throw error;
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return;
    startStream();
    connect();
  }, [isLoggedIn, authData?.token.access_token]);

  serverMessageChannel.onmessage = (event) => {
    console.log("HELLO serverMessageChannel: {:?}", event);
    switch (event.type) {
      case MessageType.CONNECTED_DEVICES:
        setConnectedDevices(event.ConnectedDevices?.devices || []);
        break;
      default:
        setStreamMessages((prev) => [...prev, event]);
        break;
    }
  };

  const getIsReachable = useCallback(async () => {
    const res = (await invoke("is_reachable")) as boolean;
    setIsReachable(res);
    return res;
  }, []);

  const startStream = useCallback(async () => {
    if (isStreamStarted) return;
    const authInfo = getAuthInfoSync();
    try {
      await invoke("stream_messages", {
        onEvent: serverMessageChannel,
        token: authInfo.token.access_token,
      });
      isStreamStarted = true;
    } catch (error) {
      isStreamStarted = false;
      throw error;
    }
  }, []);

  // ------------------ Use Effects ------------------
  useEffect(() => {
    getIsReachable();
  }, []);

  // --------------------------------------------------

  return (
    <GrpcContext.Provider
      value={{
        isReachable,
        getIsReachable,
        streamMessages,
        devices: connectedDevices,
      }}
    >
      {children}
    </GrpcContext.Provider>
  );
}

export const useGrpcContext = () => {
  const context = useContext(GrpcContext);
  if (!context) {
    throw new Error("useGrpcContext must be used within a GrpcProvider");
  }
  return context;
};
