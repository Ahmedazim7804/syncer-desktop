import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import {
    RouterProvider,
    createRouter,
    useNavigate,
} from "@tanstack/react-router";
import "./index.css";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import axios from "axios";
import { useAccessToken } from "./hooks/useAuthentication";
import { getLastUrlSegment, publicRoutes } from "./utils";
import AxiosInterceptor from "./axios_interceptor";
import { AppDataProvider } from "./context/app_data_context";

const router = createRouter({
    routeTree,
});

// QueryClient
const queryClient = new QueryClient();

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <AppDataProvider>
                    <RouterProvider router={router} />
                </AppDataProvider>
            </QueryClientProvider>
        </React.StrictMode>
    );
}
