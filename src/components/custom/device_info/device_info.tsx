import { Button } from "@/components/ui/button";
import React from "react";
import { useEffect, useRef } from "react";
import { MdSignalWifi3Bar, MdWifiOff } from "react-icons/md";
import { MdSignalWifiOff } from "react-icons/md";
import { PiCellSignalFullFill } from "react-icons/pi";
import { PiBatteryChargingDuotone } from "react-icons/pi";
import { MdDoNotDisturbOn } from "react-icons/md";
import { MdOutlineBluetooth } from "react-icons/md";
import { FaVolumeHigh } from "react-icons/fa6";
import { IoPhonePortraitOutline } from "react-icons/io5";
import useImage from "use-image";

export default function DeviceInfo() {
    return (
        <div className="flex flex-col justify-center text-stone-200 self-center py-4 px-4 gap-4">
            <div className="flex flex-row justify-start gap-6">
                <img src="./src/assets/group2.svg" alt="wallpaper"></img>
                <div className="flex flex-col justify-start align-top pt-4 gap-2">
                    <p className="font-bold">Galaxy A52</p>

                    <div className="flex flex-row gap-2">
                        <MdSignalWifi3Bar className="text-2xl" />
                        <PiCellSignalFullFill className="text-2xl" />
                        <PiBatteryChargingDuotone className="text-2xl" />
                        <span className="text-sm self-center">98%</span>
                    </div>

                    <div className="flex flex-row items-center justify-center gap-4 -ml-4">
                        <div className="bg-green-700 rounded-full w-4 aspect-square shadow-[0_0_20px_3px_#16a34a]"></div>
                        <p className="font-semibold text-sm">Connected</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-2 w-full justify-start">
                <Button className="w-16">
                    <MdDoNotDisturbOn className="text-3xl" />
                </Button>
                <Button className="w-16 bg-sky-600">
                    <MdOutlineBluetooth className="text-3xl" />
                </Button>
                <Button className="w-16">
                    <FaVolumeHigh className="text-3xl" />
                </Button>
                <Button className="w-16">
                    <MdWifiOff className="text-3xl" />
                </Button>
            </div>
        </div>
    );
}
