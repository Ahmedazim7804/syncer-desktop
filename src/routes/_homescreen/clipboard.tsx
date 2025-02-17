import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoClipboard, IoRemove, IoSend } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCross } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useClipboard } from "@/hooks/useClipboard";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/_homescreen/clipboard")({
    component: RouteComponent,
});

function RouteComponent() {
    const {
        isPendingAddClipboard: isPending,
        mutateAsyncAddClipboard,
        clipboardData,
        isPendingClipboardData,
    } = useClipboard();
    const inputRef = useRef<HTMLInputElement>(null);

    function handleAddClipboard() {
        const val = inputRef.current?.value;

        if (!val) {
            return;
        }

        mutateAsyncAddClipboard(val);
    }

    return (
        <div className="w-full h-full flex justify-center flex-col">
            <div className="flex flex-row gap-2">
                <Input ref={inputRef} placeholder="Send Text" />
                <Button onClick={handleAddClipboard}>
                    {isPending ? (
                        <div className="spinner w-6 h-6"></div>
                    ) : (
                        <IoSend />
                    )}
                </Button>
            </div>
            <Card className="my-8">
                <CardHeader>
                    <CardTitle>Received Text</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col">
                    {isPendingClipboardData ? (
                        <div className="spinner w-8 h-8 self-center bg-primary"></div>
                    ) : (
                        clipboardData?.map((text, index) => (
                            <ReceivedTextTile
                                text={text}
                                index={index + 1}
                                key={index}
                            />
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function ReceivedTextTile({ text, index }: { text: string; index: number }) {
    return (
        <div className="flex flex-row">
            <span className="font-bold self-end mr-2">{index}.</span>
            <span className="text-ellipsis w-[100%] overflow-hidden text-nowrap self-end">
                {text}
            </span>
            <div className="flex flex-row">
                <Button variant={"ghost"}>
                    <IoClipboard />
                </Button>
                <Button variant={"ghost"}>
                    <MdCancel />
                </Button>
            </div>
        </div>
    );
}
