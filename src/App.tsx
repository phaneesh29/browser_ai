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
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600/10 selection:text-blue-700">
      {/* Header / Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">⚡</span> BrowserAI
            </span>
            {webGpuSupported !== null && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider border ${
                webGpuSupported 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-current ${webGpuSupported ? 'animate-pulse' : ''}`}></span>
                WebGPU {webGpuSupported ? 'Available' : 'Unavailable'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#diagnostics" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Diagnostics</a>
            <a href="#integration" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Developers</a>
            <a 
              href="https://github.com" 
              className="text-xs font-semibold px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col box-border">
        <Outlet />
      </main>
    </div>
  )
}

export default App
