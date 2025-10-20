import { useMatches, useRouter } from "@tanstack/react-router"
import { useMemo } from "react"
import { isPublicRoute, needsSidebarByRouteId } from "@/lib/public-routes"

export function useRouteInfo() {
  const router = useRouter()
  const matches = useMatches()
  const currentPath = router.state.location.pathname

  const routeInfo = useMemo(() => {
    const isPublic = isPublicRoute(currentPath)
    const needSidebar = needsSidebarByRouteId(matches[matches.length - 1].routeId)
    return { isPublic, needSidebar }
  }, [currentPath, matches])

  return routeInfo;
}
