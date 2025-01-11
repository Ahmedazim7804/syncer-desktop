import { useTauriStore } from "@/hooks/useTauriStore";
import { AppData, AppDataWithFn } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

const AppDataContext = createContext<AppDataWithFn>({
    data: {
        serverUrl: null,
        username: null,
    },
    contextFns: {
        setServerUrl: () => {},
        setUsername: () => {},
        getServerUrl: async () => null,
        getUsername: async () => null,
    },
});

function AppDataProvider({ children }: { children: React.ReactNode }) {
    const [serverUrl, _setServerUrl] = useState<string | null>(null);
    const [username, _setUsername] = useState<string | null>(null);

    const tauriStore = useTauriStore();

    useEffect(() => {
        (async () => {
            let serverUrl = await getServerUrl();
            let username = await getUsername();

            _setServerUrl(serverUrl);
            _setUsername(username);
        })();
    });

    async function getServerUrl(): Promise<string | null> {
        if (serverUrl !== null) {
            return serverUrl;
        }
        return await tauriStore.getValue<string>("serverUrl");
    }

    async function getUsername(): Promise<string | null> {
        if (username !== null) {
            return username;
        }
        return await tauriStore.getValue<string>("username");
    }

    async function setServerUrl(serverUrl: string) {
        _setServerUrl(serverUrl);

        let status = await tauriStore.setValue<string>("serverUrl", serverUrl);

        if (!status) {
            throw new Error("Failed to save server url");
        }
    }

    async function setUsername(username: string) {
        _setUsername(username);

        console.log(username);

        let status = await tauriStore.setValue<string>("username", username);

        if (!status) {
            throw new Error("Failed to save username");
        }
    }

    return (
        <AppDataContext.Provider
            value={{
                data: { serverUrl, username },
                contextFns: {
                    setServerUrl,
                    setUsername,
                    getServerUrl,
                    getUsername,
                },
            }}
        >
            {children}
        </AppDataContext.Provider>
    );
}

function useAppData(): AppDataWithFn {
    const value = useContext(AppDataContext);

    if (value === null || value === undefined) {
        throw new Error("useAppData must be used within a AppDataProvider");
    }

    return value as AppDataWithFn;
}

function useAppDataValue(): AppData {
    const value = useContext(AppDataContext);

    if (value === null || value === undefined) {
        throw new Error("useAppData must be used within a AppDataProvider");
    }

    return value.data;
}

export { AppDataProvider, useAppData, useAppDataValue };
