import { LazyStore } from "@tauri-apps/plugin-store";
import { useCallback } from "react";
import { StoreKeys } from "../constants";


const storeMap = new Map<string, LazyStore>();

function getStoreInstance(storeName: string): LazyStore {
    if (!storeMap.has(storeName)) {
        storeMap.set(storeName, new LazyStore(storeName, {
            defaults: {

            },
            autoSave: true,
        }));
    }
    return storeMap.get(storeName)!;
}


export default function useStore(storeName: StoreKeys) {
    const store: LazyStore = getStoreInstance(storeName);

    const getStore = useCallback(async <T,>(key: string): Promise<T | undefined> => {
        await store.init();
        const data = await store.get<T>(key);
        return data ?? undefined;
    }, [store]);

    const setStore = useCallback(async <T,>(key: string, data: T) => {
        await store.set(key, data);
        await store.save();
    }, [store]);

    return { getStore, setStore };
}