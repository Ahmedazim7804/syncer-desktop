import * as React from "react";
import { AiOutlineCloudSync } from "react-icons/ai";

import { cn } from "@/lib/utils";

const Banner = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex flex-row justify-center items-center gap-2 bg-pattern h-fit py-2 w-full",
            className
        )}
        {...props}
    >
        <AiOutlineCloudSync className="text-6xl text-primary" />
        <span className="text-4xl">Syncer</span>
    </div>
));
Banner.displayName = "Banner";

export { Banner };
