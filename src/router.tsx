import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import App from './App'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Working from './pages/Working'

// Root route — renders the shared layout (App shell)
const rootRoute = createRootRoute({
  component: App,
})

// Landing page route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

// Chat interface route
const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: Chat,
})

// How It Works page route
const workingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/working',
  component: Working,
})

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  chatRoute,
  workingRoute,
])

// Create and export the router
export const router = createRouter({ routeTree })

// Type-safe declaration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
