import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoSend } from "react-icons/io5";

export const Route = createFileRoute("/_homescreen/clipboard")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="w-full h-full flex justify-center flex-col">
            <div className="flex flex-row gap-2">
                <Input placeholder="Send Text" />
                <Button>
                    <IoSend />
                </Button>
            </div>
        </div>
    );
}
