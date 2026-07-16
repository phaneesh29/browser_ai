import { useEffect } from 'react'
import { Outlet } from '@tanstack/react-router'
import { useAppStore } from './stores/appStore'

function App() {
  const { webGpuSupported, setWebGpuStatus } = useAppStore()

  useEffect(() => {
    async function checkWebGPU() {
      if (!navigator.gpu) {
        setWebGpuStatus(false, 'Unsupported (No navigator.gpu)')
        return
      }
      try {
        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter) {
          setWebGpuStatus(false, 'Unsupported (No GPU adapter found)')
          return
        }
        let infoName = 'WebGPU Compatible Device'
        const anyAdapter = adapter as any
        if (typeof anyAdapter.requestAdapterInfo === 'function') {
          try {
            const info = await anyAdapter.requestAdapterInfo()
            infoName = info.description || info.device || `${info.vendor} GPU`
          } catch {
            // Ignore if requestAdapterInfo is restricted/fails
          }
        }
        setWebGpuStatus(true, infoName)
      } catch (err) {
        setWebGpuStatus(false, `Error: ${err instanceof Error ? err.message : err}`)
      }
    }
    checkWebGPU()
  }, [setWebGpuStatus])

  return (
    <div className="flex flex-col min-h-screen bg-radial from-[#1c1d30] via-[#090a0f] to-[#090a0f]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#121420]/70 border-b border-[#252a45]">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
              ⚡ Browser AI
            </span>
            {webGpuSupported !== null && (
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider border ${
                webGpuSupported 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor] animate-pulse-dot"></span>
                WebGPU {webGpuSupported ? 'Active' : 'Unavailable'}
              </span>
            )}
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col box-border">
        <Outlet />
      </main>
    </div>
  )
}

export default App
