import MenuBar from "@/components/custom/main_panel/menu_bar";
import Sidepanel from "@/components/custom/sidepanel/sidepanel";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_homescreen")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex flex-row h-[100vh] w-[100vw] align">
            <Sidepanel />
            <div className="flex flex-col h-full w-full">
                <MenuBar />
                <div className="m-4 flex">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
