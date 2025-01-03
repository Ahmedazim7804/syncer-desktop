import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
    component: () => (
        <>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <div className="p-2 flex gap-2">
                    <Link to="/clipboard" className="[&.active]:font-bold">
                        Home
                    </Link>{" "}
                    <Link to="/clipboard" className="[&.active]:font-bold">
                        About
                    </Link>
                    <ModeToggle />
                </div>
                <hr />
                <Outlet />
            </ThemeProvider>
            <TanStackRouterDevtools />
        </>
    ),
});
