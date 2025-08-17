import { useMutation } from "@tanstack/react-query";
import { getAccessTokenWithPasswordApiV1AuthLoginPostMutation, getAccessTokenWithRefreshTokenApiV1AuthRefreshPostMutation, getAccessTokenWithRefreshTokenApiV1AuthRefreshPostOptions } from "../api/gen/@tanstack/react-query.gen";
import { useRouter } from "@tanstack/react-router";
import { getAccessTokenWithRefreshTokenApiV1AuthRefreshPost } from "../api/gen";

export default function useLogin() {
    const router = useRouter();
    const { isPending, mutateAsync: loginAsync, data, error } = useMutation({
        ...getAccessTokenWithPasswordApiV1AuthLoginPostMutation(),
        onSuccess(data, variables, context) {
            router.navigate({ to: "/" });
        },
    });

    return {
        data,
        isPending,
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
