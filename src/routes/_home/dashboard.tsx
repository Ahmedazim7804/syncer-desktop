import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col w-screen h-screen">
      asasjfklfksjaf slakfj slakfj asfj lksajf lksajf lksajflk
    </div>
  )
}
