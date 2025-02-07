import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import { useAccessToken } from "./hooks/useAuthentication";
import { getLastUrlSegment, publicRoutes } from "./utils";
import { useAppData } from "./context/app_data_context";

const instance = axios.create();

export default function AxiosInterceptor({
    children,
}: {
    children: React.ReactNode;
}) {
    // AXIOS INTERCEPTOR
    const token = useAccessToken();
    const navigate = useNavigate();
    const [isSet, setIsSet] = useState(false);

    const { contextFns } = useAppData();

    useEffect(() => {
        instance.interceptors.request.use(async (config) => {
            // config.baseURL =
            //     (await contextFns.getServerUrl()) ?? "http://localhost:8000/";

            const baseURL = await contextFns.getServerUrl();

            if (baseURL) {
                config.url = new URL(config.url!, baseURL).href;
            }

            const subUrl = getLastUrlSegment(config.url!);

            if (!token && !publicRoutes.includes(subUrl!)) {
                navigate({
                    to: "/login",
                });
            }

            config.headers.Authorization = `Bearer ${token}`;

            return config;
        });

        setIsSet(true);
    });

    return isSet && children;
}

export { instance, AxiosInterceptor };
