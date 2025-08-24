import { client } from "@/lib/api/gen/client.gen";
import { getAuthInfoSync } from "./actions/getAuthData";

export function setupClient() {
    client.setConfig({
        withCredentials: true,
    });

    client.instance.interceptors.request.use((config) => {
        try {
            const authInfo = getAuthInfoSync();
            const serverUrl = authInfo?.serverUrl;
            const token = authInfo?.token?.access_token;

            if (!config.baseURL && serverUrl) {
                config.baseURL = serverUrl;
            }
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (_) {
        }

        return config;
    });

    client.instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.log('Token expired, will attempt refresh');
            }
            return Promise.reject(error);
        }
    );
}       
