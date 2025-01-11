import { load } from "@tauri-apps/plugin-store";

const store = await load("store.json", { autoSave: true });

export function useTauriStore() {
    async function getValue<T>(key: string): Promise<T | null> {
        const val = await store.get<T>(key);

        if (!val) {
            return null;
        }

        return val;
    }

    async function setValue<T>(key: string, value: T): Promise<boolean> {
        try {
            await store.set(key, value);
            return await saveStore();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function removeValue(key: string): Promise<boolean> {
        try {
            store.delete(key);
            saveStore();
            return await saveStore();
        } catch (e) {
            return false;
        }
    }

    async function saveStore(): Promise<boolean> {
        try {
            store.save();
        } catch (e) {
            console.log(e);
            return false;
        }

        return true;
    }

    return { getValue, setValue, removeValue };
}
