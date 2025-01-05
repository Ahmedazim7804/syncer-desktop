import React from "react";
import { FaClipboard } from "react-icons/fa";
import MenuBarTab from "./menu_bar_tab";
import { BiSolidMessageAltDetail } from "react-icons/bi";
import { IoCallSharp } from "react-icons/io5";
import { FaMusic } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MenuBar() {
    return (
        <div className="flex flex-row gap-8 pt-8 px-4 pb-4 bg-background-secondary">
            <MenuBarTab icon={FaClipboard} label={"Clipboard"} />
            <MenuBarTab icon={BiSolidMessageAltDetail} label={"Messages"} />
            <MenuBarTab icon={IoCallSharp} label={"Calls"} />
            <MenuBarTab icon={FaMusic} label={"Music"} />

            <div className="flex flex-row ml-auto gap-6">
                <IoIosMore className="text-xl" />
                <IoIosSettings className="text-xl" />
            </div>
        </div>
    );
}
