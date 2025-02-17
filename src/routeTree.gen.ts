/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as HomescreenImport } from './routes/_homescreen'
import { Route as HomescreenClipboardImport } from './routes/_homescreen/clipboard'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const HomescreenRoute = HomescreenImport.update({
  id: '/_homescreen',
  getParentRoute: () => rootRoute,
} as any)

const HomescreenClipboardRoute = HomescreenClipboardImport.update({
  id: '/clipboard',
  path: '/clipboard',
  getParentRoute: () => HomescreenRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_homescreen': {
      id: '/_homescreen'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof HomescreenImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_homescreen/clipboard': {
      id: '/_homescreen/clipboard'
      path: '/clipboard'
      fullPath: '/clipboard'
      preLoaderRoute: typeof HomescreenClipboardImport
      parentRoute: typeof HomescreenImport
    }
  }
}

// Create and export the route tree

interface HomescreenRouteChildren {
  HomescreenClipboardRoute: typeof HomescreenClipboardRoute
}

const HomescreenRouteChildren: HomescreenRouteChildren = {
  HomescreenClipboardRoute: HomescreenClipboardRoute,
}

const HomescreenRouteWithChildren = HomescreenRoute._addFileChildren(
  HomescreenRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof HomescreenRouteWithChildren
  '/login': typeof LoginRoute
  '/clipboard': typeof HomescreenClipboardRoute
}

export interface FileRoutesByTo {
  '': typeof HomescreenRouteWithChildren
  '/login': typeof LoginRoute
  '/clipboard': typeof HomescreenClipboardRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_homescreen': typeof HomescreenRouteWithChildren
  '/login': typeof LoginRoute
  '/_homescreen/clipboard': typeof HomescreenClipboardRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/login' | '/clipboard'
  fileRoutesByTo: FileRoutesByTo
  to: '' | '/login' | '/clipboard'
  id: '__root__' | '/_homescreen' | '/login' | '/_homescreen/clipboard'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  HomescreenRoute: typeof HomescreenRouteWithChildren
  LoginRoute: typeof LoginRoute
}

const rootRouteChildren: RootRouteChildren = {
  HomescreenRoute: HomescreenRouteWithChildren,
  LoginRoute: LoginRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_homescreen",
        "/login"
      ]
    },
    "/_homescreen": {
      "filePath": "_homescreen.tsx",
      "children": [
        "/_homescreen/clipboard"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_homescreen/clipboard": {
      "filePath": "_homescreen/clipboard.tsx",
      "parent": "/_homescreen"
    }
  }
}
ROUTE_MANIFEST_END */
