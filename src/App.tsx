import { useEffect } from 'react'
import { Outlet } from '@tanstack/react-router'
import { useAppStore } from './stores/appStore'
import './App.css'

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
    <div className="app-container">
      <header className="app-header">
        <nav className="app-nav">
          <div className="brand-section">
            <span className="app-logo">⚡ Browser AI</span>
            {webGpuSupported !== null && (
              <span className={`webgpu-badge ${webGpuSupported ? 'supported' : 'unsupported'}`}>
                <span className="badge-dot pulse"></span>
                WebGPU {webGpuSupported ? 'Active' : 'Unavailable'}
              </span>
            )}
          </div>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default App
