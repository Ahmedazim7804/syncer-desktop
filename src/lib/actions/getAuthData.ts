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
        try {
            const token = await getStore<Token>('token');
            const serverUrl = await getStore<string>('serverUrl');
            
            if (!token || !token.access_token || !token.refresh_token || !serverUrl) {
                setAuth(undefined);
                authInfoCache = undefined;
            } else {
                const authData = { token, serverUrl };
                setAuth(authData);
                authInfoCache = authData;
            }
        } catch (error) {
            console.error('Failed to fetch auth data:', error);
            setAuth(undefined);
            authInfoCache = undefined;
        } finally {
            setFetchingData(false);
        }
    }

    async function setToken(token: Token) {
        if (!auth?.serverUrl) {
            throw new Error('Cannot set token without server URL');
        }
        
        await setStore('token', token);
        const newAuthData = { ...auth, token };
        authInfoCache = newAuthData;
        setAuth(newAuthData);
    }

    async function setAuthData(token: Token, serverUrl: string) {
        await setStore('token', token);
        await setStore('serverUrl', serverUrl);
        const newAuthData = { token, serverUrl };
        authInfoCache = newAuthData;
        setAuth(newAuthData);
    }

    async function clearAuthData() {
        await setStore('token', { access_token: '', refresh_token: '' });
        await setStore('serverUrl', '');
        authInfoCache = undefined;
        setAuth(undefined);
    }

    useEffect(() => {
        if (!auth) {
            refetchAuthData();
        }
    }, []);

    return { 
        fetchingData, 
        data: auth, 
        refetchAuthData, 
        setToken, 
        setAuthData,
        clearAuthData 
    };
}