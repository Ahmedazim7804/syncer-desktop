import RippleGrid from '@/components/custom/ripple-grid'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
    return( <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full -z-10">
        <RippleGrid />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Outlet />
      </div>
    </div>)
}
