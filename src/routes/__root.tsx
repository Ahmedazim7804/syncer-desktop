import * as React from "react";
import {
  Navigate,
  Outlet,
  createRootRoute,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthProvider, useAuth } from "@/lib/context/auth-context";
import { PUBLIC_ROUTES, NEED_SIDEBAR } from "@/lib/public-routes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SidebarComponent from "@/components/custom/sidebar/sidebar";
import Navbar from "@/components/custom/navbar";
import { GrpcProvider } from "@/lib/context/grpc-context";
import { Loader2, AlertCircle, RefreshCw, LogOut } from "lucide-react";
import { AuthErrors } from "@/lib/interfaces/errors";
import { Button } from "@/components/ui/button";

export const Route = createRootRoute({
  component: RootComponent,
});

function ErrorScreen({ error }: { error: AuthErrors }) {
  const { logout, refetchUser } = useAuth();
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await refetchUser();
    } finally {
      setIsRetrying(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getErrorMessage = () => {
    switch (error) {
      case AuthErrors.CONNECTION_ERROR:
        return {
          title: "Connection Error",
          description:
            "Unable to connect to the server. Please check your internet connection and try again.",
        };
      case AuthErrors.UNKNOWN_ERROR:
        return {
          title: "Something Went Wrong",
          description:
            "An unexpected error occurred. Please try again or contact support if the problem persists.",
        };
      default:
        return {
          title: "Error",
          description: "An error occurred. Please try again.",
        };
    }
  };

  const { title, description } = getErrorMessage();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-6 max-w-md mx-auto p-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-destructive/5 animate-pulse"></div>
        </div>

        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex-1"
            variant="default"
          >
            {isRetrying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </Button>

          <Button onClick={handleLogout} variant="outline" className="flex-1">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  return (
    <div className="h-[100vh] w-[100vw]">
      <AuthProvider>
        <GrpcProvider>
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        </GrpcProvider>
      </AuthProvider>
      <TanStackRouterDevtools />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading, error } = useAuth();
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.includes(router.state.location.pathname);

  console.log(`isLoggedIn: ${isLoggedIn}, loading: ${loading}`);

  if (isPublicRoute) {
    return children;
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
            </div>
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary opacity-20 animate-ping"></div>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Loading...
            </h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we set things up
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    error === AuthErrors.CONNECTION_ERROR ||
    error === AuthErrors.UNKNOWN_ERROR
  ) {
    return <ErrorScreen error={error} />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return !NEED_SIDEBAR.includes(router.state.location.pathname) ? (
    children
  ) : (
    <SidebarProvider>
      <SidebarComponent className="w-sm relative shadow-none" />
      <SidebarInset className="overflow-hidden max-w-full">
        <div className="flex flex-col flex-1 border-0">
          <Navbar />
          <div className="flex flex-col flex-1 p-4">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
