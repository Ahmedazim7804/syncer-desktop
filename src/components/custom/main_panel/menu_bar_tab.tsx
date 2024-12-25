import React, { ReactNode } from "react";
import { IconType } from "react-icons/lib";

export default function MenuBarTab({
    icon: Icon,
    label,
}: {
    icon: IconType;
    label: String;
}) {
    return (
        <div className="flex flex-row cursor-pointer gap-1 items-center justify-center underline-animation">
            <Icon className="text-xl" />
            <p>{label}</p>
        </div>
    );
}
