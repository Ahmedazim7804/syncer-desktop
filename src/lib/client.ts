import { client } from "@/lib/api/gen/client.gen";
import { getAuthInfoSync } from "./actions/getAuthData";

export function setupClient() {
    client.setConfig({
        baseURL: "http://localhost:8000",
        withCredentials: true,
    })

    client.instance.interceptors.request.use((config) => {
        try {
            const authInfo = getAuthInfoSync()
            const token = authInfo?.token
            const serverUrl = authInfo?.serverUrl

            if (config.baseURL === undefined) {
                config.baseURL = serverUrl
            }
            
            if (token) {
                config.headers.Authorization = `Bearer ${token.access_token}`
            }
        } catch (_) {}

        return config
    })

    // client.instance.interceptors.request.use((response) => {
    //     logger.info(`Request`, `${response.method} ${response.url} | ${response.headers['Authorization'] ?? 'No Authorization'}`)
    //     logger.debug(`RequestData:`, `${JSON.stringify(response.data)}`)

    //     return response
    // }, (error) => {
    //     return Promise.reject(error)
    // })

    // client.instance.interceptors.response.use((response) => {
    //     logger.info(`Response`, `${response.status} ${response.config.method} ${response.config.url}`)
    //     logger.debug(`ResponseData`, `${JSON.stringify(response.data)}`)

    //     return response
    // }, (error) => {
    //     logger.error(`Error`, `${error.response.status} ${error.response.config.method} ${error.response.config.url} | ${error.response.headers['Authorization'] ?? 'No Authorization'}`)

    //     return Promise.reject(error)
    // })

}       
