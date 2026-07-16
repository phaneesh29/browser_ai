import { create } from 'zustand'

interface AppState {
  /** Current page title for display purposes */
  pageTitle: string
  setPageTitle: (title: string) => void

  /** Sidebar open/closed state */
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  pageTitle: 'Home',
  setPageTitle: (title) => set({ pageTitle: title }),

  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
