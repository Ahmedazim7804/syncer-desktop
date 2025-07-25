import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircleIcon, XIcon } from "lucide-react";

export default function NotificationItem() {
    return (
        <Card className="gap-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircleIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Messages</span>
                    <span className="text-xs text-muted-foreground">03:55</span>
                    <XIcon className="w-4 h-4 ml-auto" />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
                <span className="text-md font-medium">Mayank Jain</span>
                <span className="text-xs text-muted-foreground">This is a test message</span>
            </CardContent>

        </Card>
    )
}