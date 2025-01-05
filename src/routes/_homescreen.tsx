import MenuBar from "@/components/custom/main_panel/menu_bar";
import Sidepanel from "@/components/custom/sidepanel/sidepanel";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_homescreen")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex flex-row h-full w-full">
            <Sidepanel />
            <div className="flex flex-col h-full w-full">
                <MenuBar />
                <div className="m-8 flex flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
