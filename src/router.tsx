import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import App from './App'
import Home from './pages/Home'

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

// Build the route tree with only the landing page
const routeTree = rootRoute.addChildren([
  indexRoute,
])

// Create and export the router
export const router = createRouter({ routeTree })

// Type-safe declaration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
