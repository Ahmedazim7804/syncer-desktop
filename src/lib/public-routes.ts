import { FileRouteTypes } from "@/routeTree.gen"

export const PUBLIC_ROUTES: FileRouteTypes['fullPaths'][] = [
  "/login",
]

export const NEED_SIDEBAR: FileRouteTypes['fullPaths'][] = [
  "/devices",
  "/devices/$deviceId"
]

// Type-safe utility functions
export const isPublicRoute = (pathname: string): pathname is FileRouteTypes['fullPaths'] => {
  return PUBLIC_ROUTES.includes(pathname as FileRouteTypes['fullPaths'])
}

export const needsSidebar = (pathname: string): pathname is FileRouteTypes['fullPaths'] => {
  return NEED_SIDEBAR.includes(pathname as FileRouteTypes['fullPaths'])
}

// Type-safe route checking with routeId
export const needsSidebarByRouteId = (routeId: string): boolean => {
  return NEED_SIDEBAR.includes(routeId as FileRouteTypes['fullPaths'])
} 