import { useMutation } from "@tanstack/react-query";
import { getAccessTokenWithPasswordApiV1AuthLoginPostMutation } from "../api/gen/@tanstack/react-query.gen";
import { useRouter } from "@tanstack/react-router";

export default function useLogin() {
    const router = useRouter();
    const { isPending, mutateAsync: loginAsync } = useMutation({
        ...getAccessTokenWithPasswordApiV1AuthLoginPostMutation(),
        onSuccess(data, variables, context) {
            router.navigate({ to: "/" });
        },
    });

    return {
        isPending,
        loginAsync,
    }
}