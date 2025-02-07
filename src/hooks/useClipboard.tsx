import { instance } from "@/axios_interceptor";
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

function addClipboard(content: string): Promise<AxiosResponse> {
    return instance.post("/api/v1/clipboard/add", {
        content,
    });
}

function getClipboard(): Promise<Array<string>> {
    return instance
        .get("http://localhost:8000/api/v1/clipboard/all")
        .then((res) => {
            return res.data;
        });
}

function useClipboard() {
    const queryClient = useQueryClient();

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
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["getClipboard"],
            });
        },
    });

    const { isPending: isPendingClipboardData, data: clipboardData } = useQuery(
        {
            queryFn: getClipboard,
            queryKey: ["getClipboard"],
            retry: 0,
        }
    );

    return {
        isPendingClipboardData,
        clipboardData,
        isPendingAddClipboard,
        mutateAddClipboard,
        mutateAsyncAddClipboard,
    };
}

export { useClipboard };
