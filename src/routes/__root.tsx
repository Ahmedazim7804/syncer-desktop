import * as React from 'react'
import { Navigate, Outlet, createRootRoute, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider, useAuth } from '@/lib/context/auth-context'
import { PUBLIC_ROUTES } from '@/lib/public-routes'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import SidebarComponent from '@/components/custom/sidebar/sidebar'
import Navbar from '@/components/custom/navbar'
import { GrpcProvider } from '@/lib/context/grpc-context'
import { Loader2 } from 'lucide-react'

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
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()
  const isPublicRoute = PUBLIC_ROUTES.includes(router.state.location.pathname)
  
  if (isPublicRoute) {
    return children
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
            <h3 className="text-lg font-semibold text-foreground">Loading...</h3>
            <p className="text-sm text-muted-foreground">Please wait while we set things up</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }
  
  return (
    <SidebarProvider>
      <SidebarComponent className='w-sm relative shadow-none'/>
      <SidebarInset className='overflow-hidden max-w-full'>
      <div className='flex flex-col flex-1 border-0'>
        <Navbar/>
        <div className='flex flex-col flex-1 p-4'>
          <GrpcProvider> 
            {children}
          </GrpcProvider>
        </div>
      </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


    