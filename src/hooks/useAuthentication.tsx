import { instance } from "@/axios_interceptor";
import { useAppData } from "@/context/app_data_context";
import { loginSchema } from "@/schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";

function login(values: z.infer<typeof loginSchema>): Promise<AxiosResponse> {
    console.log(values.username);

    const loginUrl = new URL("/login", values.serverUrl).href;
    const formData = new FormData();

    formData.append("username", values.username);
    formData.append("password", values.password);

    return instance.post(loginUrl, formData);
}

function useLogin() {
    const navigate = useNavigate();
    const { contextFns: appDataFn } = useAppData();

    const { mutate, mutateAsync, isPending } = useMutation({
        mutationFn: login,
        mutationKey: ["login"],
        onSuccess: async (response, { username, serverUrl }) => {
            localStorage.setItem("access_token", response.data.access_token);

            console.log(response);

            await appDataFn.setUsername(username);
            await appDataFn.setServerUrl(serverUrl);

            navigate({
                to: "/clipboard",
            });
        },
    });

    return { mutate, mutateAsync, isPending };
}

function useAccessToken(): string | null {
    return localStorage.getItem("access_token");
}

export { useLogin, useAccessToken };
