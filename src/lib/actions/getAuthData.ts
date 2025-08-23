import { AuthData, Token } from "../interfaces/auth";
import useStore from "./useStore";
import { StoreKeys } from "../constants";
import { useEffect, useState } from "react";

let authInfoCache: AuthData | undefined = undefined;

export function getAuthInfoSync() {
    if (authInfoCache) {
        return authInfoCache;
    }

    throw new Error("Token not found, are you sure you are in logged in?");
}

export default function useGetAuthInfo() {
    const { getStore, setStore } = useStore(StoreKeys.AUTH);
    const [fetchingData, setFetchingData] = useState(true);
    const [auth, setAuth] = useState<AuthData | undefined>(undefined);

    async function refetchAuthData() {

        if (authInfoCache) {
            setAuth(authInfoCache);
            setFetchingData(false);
            return;
        }

        setFetchingData(true);
        const token = await getStore<Token>('token');
        const serverUrl = await getStore<string>('serverUrl');
        if (!token || !token.access_token || !token.refresh_token || !serverUrl) {
            setFetchingData(false);
        } else {
            setAuth({
                token,
                serverUrl
            });
            authInfoCache = {
                token,
                serverUrl
            };
            setFetchingData(false);
        }
    }

    async function setToken(token: Token) {
        await setStore('token', token);
        authInfoCache = {
            ...auth!,
            token,
        };
        setAuth((prev) => ({ ...prev!, token}));
    }

    async function setAuthData(token: Token, serverUrl: string) {
        await setStore('token', token);
        await setStore('serverUrl', serverUrl);
        authInfoCache = {
            token,
            serverUrl
        };
    }

    useEffect(() => {
        if (!auth) {
            refetchAuthData()
        }
    }, []);

    return { fetchingData, data: auth, refetchAuthData, setToken, setAuthData };
}