import { useMutation } from "@tanstack/react-query";
import { getAccessTokenWithPasswordApiV1AuthLoginPostMutation, getAccessTokenWithRefreshTokenApiV1AuthRefreshPostMutation} from "../api/gen/@tanstack/react-query.gen";
import { useState } from "react";
import { GetAccessTokenWithPasswordApiV1AuthLoginPostResponse } from "../api/gen";

export default function useLogin(onLoginSuccess?: (responseData: GetAccessTokenWithPasswordApiV1AuthLoginPostResponse) => Promise<void>)  {
    const [waiting, setWaiting] = useState(false);

    const { isPending, mutateAsync: loginAsync, data, error } = useMutation({
        ...getAccessTokenWithPasswordApiV1AuthLoginPostMutation(),
        onMutate: () => {
            setWaiting(true);
        },
        onSuccess: async (responseData, __, ___) => {
            await onLoginSuccess?.(responseData);
            setWaiting(false);
        },
        onError: () => {
            setWaiting(false);
        },
    });

    return {
        data,
        isPending: isPending || waiting,
        loginAsync,
        error,
    }
}

export function useRefreshToken() {
    const { isPending, mutateAsync: refreshTokenAsync, data, error } = useMutation({
        ...getAccessTokenWithRefreshTokenApiV1AuthRefreshPostMutation(),
    });

    return {
        isPending,
        refreshTokenAsync,
        data,
        error,
    }
}
