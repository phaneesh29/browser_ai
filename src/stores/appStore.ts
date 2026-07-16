import { create } from 'zustand'

interface AppState {
  /** Current page title for display purposes */
  pageTitle: string
  setPageTitle: (title: string) => void

  /** WebGPU support detection state */
  webGpuSupported: boolean | null
  gpuName: string
  setWebGpuStatus: (supported: boolean, gpuName: string) => void

  /** Sidebar open/closed state */
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  pageTitle: 'Home',
  setPageTitle: (title) => set({ pageTitle: title }),

  webGpuSupported: null,
  gpuName: 'Checking...',
  setWebGpuStatus: (supported, gpuName) => set({ webGpuSupported: supported, gpuName }),

  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
