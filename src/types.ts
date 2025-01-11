export type AppData = {
    serverUrl: string | null;
    username: string | null;
};

export type AppDataFn = {
    setServerUrl: (serverUrl: string) => void;
    setUsername: (username: string) => void;
    getServerUrl: () => Promise<string | null>;
    getUsername: () => Promise<string | null>;
};

export type ContextValue<T, S> = {
    data: T;
    contextFns: S;
};

export type AppDataWithFn = ContextValue<AppData, AppDataFn>;
