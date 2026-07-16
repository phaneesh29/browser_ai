import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import App from './App'
import Home from './pages/Home'
import Working from './pages/Working'
import Models from './pages/Models'
import Chat from './pages/Chat'

// Root route — renders the shared layout (App shell)
const rootRoute = createRootRoute({
  component: App,
})

// Child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const workingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/working',
  component: Working,
})

const modelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/models',
  component: Models,
})

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: Chat,
})

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  workingRoute,
  modelsRoute,
  chatRoute,
])

// Create and export the router
export const router = createRouter({ routeTree })

// Type-safe declaration for useRouter / useNavigate etc.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
