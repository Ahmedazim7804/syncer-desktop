import { client } from "@/lib/api/gen/client.gen";
import logger from "@/lib/logger";

export function setupClient() {
    client.setConfig({
        baseURL: "http://localhost:8000",
        withCredentials: true,
        // auth: useGetAuthToken() ?? "",
    })

    // client.instance.interceptors.request.use((config) => {
    //     const token = useGetAuthToken()
    //     if (token) {
    //         config.headers.Authorization = `Bearer ${token}`
    //     }
    //     return config
    // })

    client.instance.interceptors.request.use((response) => {
        logger.info(`Request`, `${response.method} ${response.url} | ${response.headers['Authorization'] ?? 'No Authorization'}`)
        logger.debug(`RequestData:`, `${JSON.stringify(response.data)}`)

        return response
    }, (error) => {
        return Promise.reject(error)
    })

    client.instance.interceptors.response.use((response) => {
        logger.info(`Response`, `${response.status} ${response.config.method} ${response.config.url}`)
        logger.debug(`ResponseData`, `${JSON.stringify(response.data)}`)

        return response
    }, (error) => {
        logger.error(`Error`, `${error.response.status} ${error.response.config.method} ${error.response.config.url} | ${error.response.headers['Authorization'] ?? 'No Authorization'}`)

        return Promise.reject(error)
    })

}       
