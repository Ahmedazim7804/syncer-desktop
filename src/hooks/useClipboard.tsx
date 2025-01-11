import { instance } from "@/axios_interceptor";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

function addClipboard(content: string): Promise<AxiosResponse> {
    return instance.post("/clipboard/add", {
        content,
    });
}

function useClipboard() {
    const {
        isPending: isPendingAddClipboard,
        mutate: mutateAddClipboard,
        mutateAsync: mutateAsyncAddClipboard,
    } = useMutation({
        mutationFn: addClipboard,
        mutationKey: ["addClipboard"],
        onSettled(data, error, variables, context) {
            console.log(data, error, variables, context);
        },
    });

    return {
        isPendingAddClipboard,
        mutateAddClipboard,
        mutateAsyncAddClipboard,
    };
}

export { useClipboard };
