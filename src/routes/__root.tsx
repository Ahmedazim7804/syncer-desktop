import * as React from 'react'
import { Navigate, Outlet, createRootRoute, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider, useAuth } from '@/lib/providers/auth-context'
import { PUBLIC_ROUTES } from '@/lib/public-routes'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="h-[100vh] w-[100vw]">
      <AuthProvider>
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      </AuthProvider>
      <TanStackRouterDevtools />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  if (PUBLIC_ROUTES.includes(router.state.location.pathname)) {
    return children;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}


    