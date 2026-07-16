import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useAppStore } from '../stores/appStore'
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  FolderLock, 
  Settings, 
  Sliders, 
  Code2 
} from 'lucide-react'

// Self-contained SVG for GitHub logo to prevent compiler export discrepancies
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

export default function Home() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)
  const { webGpuSupported, gpuName, setWebGpuStatus } = useAppStore()

  const repoUrl = 'https://github.com/phaneesh29/browser_ai'

  // Diagnostic WebGPU check on mount
  useEffect(() => {
    setPageTitle('Home')
    
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
  }, [setPageTitle, setWebGpuStatus])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600/10 selection:text-blue-700">
      {/* 1. Header / Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600 fill-blue-600/20" /> BrowserAI
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
            <a href="#privacy" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#diagnostics" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Hardware</a>
            <a href="#opensource" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Source Code</a>
            <a 
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </nav>
      </header>

      {/* 2. Main Content Wrapper */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col box-border space-y-24">
        
        {/* Hero Section */}
        <section className="text-center pt-8 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Total Data Isolation
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-slate-900">
            Absolute Client-Side Privacy. <br />
            <span className="text-blue-600">No Messages Leave Your Computer.</span>
          </h1>

          <p className="mt-6 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Run large language models locally inside your browser cache. Secure sandboxed execution guarantees zero data leakage, zero subscription costs, and no third-party hosts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white/20" /> Start Local Chat
            </Link>
            <a
              href="#diagnostics"
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Verify Hardware Support
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <GithubIcon className="w-4 h-4 text-slate-700" /> View GitHub Project
            </a>
          </div>
        </section>

        {/* Privacy & Compliance Section */}
        <section id="privacy" className="max-w-5xl mx-auto px-4 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Guaranteed Compliance by Architecture</h2>
            <p className="text-slate-500 mt-2">Zero network request design means absolute compliance with regulations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Zero Network Traffic</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All data remains locked inside browser memory. Prompts and generation histories do not travel over internet routes, completely mitigating remote interception.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <Cpu className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Local GPU Processing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Inference compute is run entirely on your own local device adapter. Zero data caching or model usage telemetry is reported back to external nodes.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <FolderLock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sandboxed Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Leverages native browser sandbox environment layers. Isolates data completely from host filesystem operations and other running application tabs.
              </p>
            </div>
          </div>
        </section>

        {/* Compatibility Diagnostics */}
        <section id="diagnostics" className="max-w-5xl mx-auto px-4 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Device Hardware Verification</h2>
            <p className="text-slate-500 mt-2">Identify local WebGPU capability for model acceleration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Diagnostic Status Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">System Details</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 text-sm">WebGPU Support</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    webGpuSupported ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {webGpuSupported ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 text-sm">Hardware Adapter</span>
                  <span className="text-xs font-semibold text-slate-900 max-w-[180px] truncate" title={gpuName}>
                    {gpuName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 text-sm">Shader Engine</span>
                  <span className="text-xs font-semibold text-slate-900">WGSL Pipeline Native</span>
                </div>
              </div>
            </div>

            {/* Spec Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recommended Requirements</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 text-sm">Quantization Method</span>
                  <span className="text-xs font-mono font-semibold text-slate-900">4-bit (INT4 quantized)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 text-sm">System RAM</span>
                  <span className="text-xs font-mono font-semibold text-slate-900">8 GB minimum</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 text-sm">VRAM Footprint</span>
                  <span className="text-xs font-mono font-semibold text-slate-900">~1.5 GB memory</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Contribution Section */}
        <section id="opensource" className="max-w-4xl mx-auto px-4 scroll-mt-24 text-center">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm max-w-3xl mx-auto">
            <Code2 className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">100% Open Source</h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto leading-relaxed">
              We believe in public auditability. Inspect our codebase, contribute logic, and review local data confinement strategies directly on our GitHub repository.
            </p>
            <div className="mt-8">
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all shadow-sm"
              >
                <GithubIcon className="w-4 h-4" /> Browse Code on GitHub
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white text-center text-xs text-slate-500 w-full mt-auto">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
          <a href="#diagnostics" className="hover:text-slate-900 transition-colors">Hardware compatibility</a>
          <a href="#opensource" className="hover:text-slate-900 transition-colors">Source Code</a>
        </div>
        <p>© 2026 BrowserAI Technologies, Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}
