import AxiosInterceptor from "@/axios_interceptor";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
    component: () => (
        <AxiosInterceptor>
            <div className="w-[100vw] h-[100vh] flex flex-1 flex-col">
                <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                    <div className="p-2 flex gap-2">
                        <Link to="/clipboard" className="[&.active]:font-bold">
                            Home
                        </Link>
                        <Link to="/login" className="[&.active]:font-bold">
                            Login
                        </Link>
                        <ModeToggle />
                    </div>
                    <hr />
                    <Outlet />
                </ThemeProvider>
                <TanStackRouterDevtools />
            </div>
        </AxiosInterceptor>
    ),
});
