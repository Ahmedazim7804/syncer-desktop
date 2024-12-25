import React from "react";
import DeviceInfo from "../device_info/device_info";
import NotificationsWidget from "../notifications/notifications";
import { Separator } from "@/components/ui/separator";

export default function Sidepanel() {
    return (
        <div className="h-full md:w-[40%] lg:w-[20%] justify-start items-center flex flex-col gap-2 bg-stone-900 py-8">
            <DeviceInfo />
            <Separator className="bg-stone-700 w-3/4 h-0.5 rounded-full" />
            <NotificationsWidget />
        </div>
    );
}
