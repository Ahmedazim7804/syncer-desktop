import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/providers/auth-context'
import { LoadingComponent } from '@/components/custom/loading-component'

export const Route = createFileRoute('/me')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingComponent />
  }

  return <div>
    <h1>Me</h1>
    <pre>{JSON.stringify(user, null, 2)}</pre>
  </div>
}