import { BatteryFullIcon, BluetoothIcon, Flashlight, Link, Navigation, WifiIcon } from "lucide-react";

export default function PhoneInfo() {
    return (
        <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg">Redmi Note 13 Pro 5G</span>
            <span className="text-xs sm:text-sm text-muted-foreground">Garnet</span>
            <div className="flex items-center gap-2 pt-1 sm:pt-2">
                <BatteryFullIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                <span className="text-muted-foreground text-xs sm:text-sm">80%</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 pt-1 sm:pt-2">
                <WifiIcon className="w-5 h-5 text-muted-foreground stroke-[2.5px]" />
                <BluetoothIcon className="w-5 h-5 text-muted-foreground stroke-[2.5px]" />
                <Link className="w-5 h-5 text-muted-foreground stroke-[2.5px]" />
                <Navigation className="w-5 h-5 text-muted-foreground stroke-[2.5px]" />
                <Flashlight className="w-5 h-5 text-muted-foreground stroke-[2.5px]" />
            </div>
        </div>
    )
}
