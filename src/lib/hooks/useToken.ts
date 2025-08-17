import { Token } from "../interfaces/token";
import useStore from "./useStore";
import { StoreKeys } from "../constants";
import { useEffect, useState } from "react";

let tokenCache: Token | undefined = undefined;

export function getTokenSync() {
    if (tokenCache) {
        return tokenCache;
    }

    throw new Error("Token not found, are you sure you are in logged in?");
}

export default function useGetToken() {
    const { getStore, setStore } = useStore(StoreKeys.TOKEN);
    const [fetchingToken, setFetchingToken] = useState(true);
    const [token, setTokenVariable] = useState<Token | undefined>(undefined);

    async function refetchToken() {
        setFetchingToken(true);
        const token = await getStore<Token>('token');
        if (!token || !token.access_token || !token.refresh_token) {
            setFetchingToken(false);
        } else {
            setTokenVariable(token);
            tokenCache = token;
            setFetchingToken(false);
        }
    }

    async function setToken(token: Token) {
        await setStore('token', token);
        tokenCache = token;
        setTokenVariable(token);
    }

    useEffect(() => {
        refetchToken();
    }, []);

    return { fetchingToken, token, refetchToken, setToken };
}