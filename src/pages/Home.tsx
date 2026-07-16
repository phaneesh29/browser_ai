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
    <div className="relative flex flex-col min-h-screen bg-[#08090a] text-[#f1f5f9] selection:bg-[#06b6d4]/20 selection:text-[#06b6d4] overflow-hidden">
      
      {/* Premium ambient glows */}
      <div className="absolute top-[10%] left-[10%] w-[35vw] h-[35vw] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-[50%] right-[10%] w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 1. Header / Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#08090a]/80 border-b border-[rgba(255,255,255,0.06)]">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-[#f1f5f9] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#06b6d4] fill-[#06b6d4]/20" /> Bonsai Local
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">Privacy</a>
            <a href="#diagnostics" className="text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">Hardware</a>
            <a href="#opensource" className="text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">Source Code</a>
            <a 
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-4 py-2 bg-[#111317] hover:bg-[#1e293b]/50 text-[#f1f5f9] border border-[rgba(255,255,255,0.06)] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </nav>
      </header>

      {/* 2. Main Content Wrapper */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col box-border space-y-24">
        
        {/* Hero Section */}
        <section className="text-center pt-8 max-w-4xl mx-auto px-4">
          
          {/* WebGPU Status Badge instead of Total Data Isolation */}
          {webGpuSupported !== null && (
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium mb-6 transition-all duration-300 ${
              webGpuSupported 
                ? 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20 shadow-[0_0_12px_rgba(6,182,212,0.05)]' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-current ${webGpuSupported ? 'animate-pulse' : ''}`}></span>
              WebGPU {webGpuSupported ? 'Available' : 'Unavailable'}
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-[#f1f5f9]">
            Absolute Client-Side Privacy. <br />
            <span className="bg-gradient-to-r from-[#00f2fe] via-[#06b6d4] to-indigo-400 bg-clip-text text-transparent italic font-serif leading-normal">
              No Messages Leave Your Computer.
            </span>
          </h1>

          <p className="mt-6 text-[#94a3b8] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Run large language models locally inside your browser cache. Secure sandboxed execution guarantees zero data leakage, zero subscription costs, and no third-party hosts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="px-6 py-3 bg-[#06b6d4] hover:bg-[#0891b2] text-[#08090a] font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-[#08090a]/25 animate-pulse" /> Start Local Chat
            </Link>
            <a
              href="#diagnostics"
              className="px-6 py-3 bg-[#111317] border border-[rgba(255,255,255,0.06)] hover:bg-[#1e293b]/50 text-[#94a3b8] hover:text-[#f1f5f9] hover:-translate-y-0.5 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Verify Hardware Support
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#111317] border border-[rgba(255,255,255,0.06)] hover:bg-[#1e293b]/50 text-[#94a3b8] hover:text-[#f1f5f9] hover:-translate-y-0.5 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <GithubIcon className="w-4 h-4 text-[#94a3b8] group-hover:text-[#f1f5f9]" /> View GitHub Project
            </a>
          </div>
        </section>

        {/* Privacy & Compliance Section */}
        <section id="privacy" className="max-w-5xl mx-auto px-4 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f1f5f9]">Guaranteed Compliance by Architecture</h2>
            <p className="text-[#64748b] mt-2">Zero network request design means absolute compliance with regulations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111317]/60 border border-[rgba(255,255,255,0.06)] rounded-xl p-6 shadow-md hover:border-[rgba(255,255,255,0.12)] hover:shadow-[0_0_24px_rgba(6,182,212,0.04)] hover:-translate-y-0.5 transition-all duration-300">
              <ShieldCheck className="w-8 h-8 text-[#06b6d4] mb-4" />
              <h3 className="text-lg font-bold text-[#f1f5f9] mb-2">Zero Network Traffic</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                All data remains locked inside browser memory. Prompts and generation histories do not travel over internet routes, completely mitigating remote interception.
              </p>
            </div>

            <div className="bg-[#111317]/60 border border-[rgba(255,255,255,0.06)] rounded-xl p-6 shadow-md hover:border-[rgba(255,255,255,0.12)] hover:shadow-[0_0_24px_rgba(6,182,212,0.04)] hover:-translate-y-0.5 transition-all duration-300">
              <Cpu className="w-8 h-8 text-[#06b6d4] mb-4" />
              <h3 className="text-lg font-bold text-[#f1f5f9] mb-2">Local GPU Processing</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Inference compute is run entirely on your own local device adapter. Zero data caching or model usage telemetry is reported back to external nodes.
              </p>
            </div>

            <div className="bg-[#111317]/60 border border-[rgba(255,255,255,0.06)] rounded-xl p-6 shadow-md hover:border-[rgba(255,255,255,0.12)] hover:shadow-[0_0_24px_rgba(6,182,212,0.04)] hover:-translate-y-0.5 transition-all duration-300">
              <FolderLock className="w-8 h-8 text-[#06b6d4] mb-4" />
              <h3 className="text-lg font-bold text-[#f1f5f9] mb-2">Sandboxed Security</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Leverages native browser sandbox environment layers. Isolates data completely from host filesystem operations and other running application tabs.
              </p>
            </div>
          </div>
        </section>

        {/* Compatibility Diagnostics */}
        <section id="diagnostics" className="max-w-5xl mx-auto px-4 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f1f5f9]">Device Hardware Verification</h2>
            <p className="text-[#64748b] mt-2">Identify local WebGPU capability for model acceleration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Diagnostic Status Card */}
            <div className="bg-[#111317]/60 border border-[rgba(255,255,255,0.06)] rounded-xl p-6 shadow-md hover:border-[rgba(255,255,255,0.1)] hover:shadow-[0_0_24px_rgba(6,182,212,0.04)] transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-[#06b6d4]" />
                <h3 className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-wider">System Details</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-[#94a3b8] text-sm">WebGPU Support</span>
                  <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                    webGpuSupported ? 'bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {webGpuSupported ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-[#94a3b8] text-sm">Hardware Adapter</span>
                  <span className="text-xs font-semibold text-[#f1f5f9] max-w-[180px] truncate" title={gpuName}>
                    {gpuName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#94a3b8] text-sm">Shader Engine</span>
                  <span className="text-xs font-semibold text-[#f1f5f9]">WGSL Pipeline Native</span>
                </div>
              </div>
            </div>

            {/* Spec Card */}
            <div className="bg-[#111317]/60 border border-[rgba(255,255,255,0.06)] rounded-xl p-6 shadow-md hover:border-[rgba(255,255,255,0.1)] hover:shadow-[0_0_24px_rgba(6,182,212,0.04)] transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5 text-[#06b6d4]" />
                <h3 className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-wider">Recommended Requirements</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-[#94a3b8] text-sm">Quantization Method</span>
                  <span className="text-xs font-mono font-semibold text-[#f1f5f9]">1-bit (INT1 quantized)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-[#94a3b8] text-sm">System RAM</span>
                  <span className="text-xs font-mono font-semibold text-[#f1f5f9]">8 GB minimum</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#94a3b8] text-sm">VRAM Footprint</span>
                  <span className="text-xs font-mono font-semibold text-[#f1f5f9]">~300 MB memory</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Contribution Section */}
        <section id="opensource" className="max-w-4xl mx-auto px-4 scroll-mt-24 text-center">
          <div className="bg-[#111317]/60 border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 shadow-md max-w-3xl mx-auto hover:border-[rgba(255,255,255,0.12)] transition-all duration-300">
            <Code2 className="w-8 h-8 text-[#06b6d4] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f1f5f9]">100% Open Source</h2>
            <p className="text-[#94a3b8] mt-2 max-w-xl mx-auto leading-relaxed">
              We believe in public auditability. Inspect our codebase, contribute logic, and review local data confinement strategies directly on our GitHub repository.
            </p>
            <div className="mt-8">
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#06b6d4] hover:bg-[#0891b2] text-[#08090a] font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] duration-200 cursor-pointer"
              >
                <GithubIcon className="w-4 h-4" /> Browse Code on GitHub
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] py-8 bg-[#08090a] text-center text-xs text-[#64748b] w-full mt-auto relative z-10">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#privacy" className="hover:text-[#f1f5f9] transition-colors">Privacy Policy</a>
          <a href="#diagnostics" className="hover:text-[#f1f5f9] transition-colors">Hardware compatibility</a>
          <a href="#opensource" className="hover:text-[#f1f5f9] transition-colors">Source Code</a>
        </div>
        <p>© 2026 Bonsai Local AI. All rights reserved.</p>
      </footer>
    </div>
  )
}
