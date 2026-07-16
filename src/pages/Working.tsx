import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useAppStore } from '../stores/appStore'
import { 
  Zap, 
  ArrowLeft, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Database,
  Flame,
  Binary
} from 'lucide-react'

export default function Working() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)

  useEffect(() => {
    setPageTitle('How It Works')
  }, [setPageTitle])

  return (
    <div className="relative flex flex-col min-h-screen bg-[#08090a] text-[#f1f5f9] selection:bg-[#06b6d4]/20 selection:text-[#06b6d4] overflow-hidden font-sans">
      
      {/* Premium ambient glows */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[50%] right-[5%] w-[35vw] h-[35vw] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#08090a]/80 border-b border-[rgba(255,255,255,0.06)]">
        <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#f1f5f9] hover:opacity-90 transition-opacity">
              <Zap className="w-5 h-5 text-[#06b6d4] fill-[#06b6d4]/20" /> ZeroLocal
            </Link>
          </div>
          <Link 
            to="/" 
            className="text-xs font-semibold px-3 py-1.5 bg-[#111317] hover:bg-[#1e293b]/50 text-[#94a3b8] hover:text-[#f1f5f9] border border-[rgba(255,255,255,0.06)] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back Home
          </Link>
        </nav>
      </header>

      {/* 2. Main Content */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col space-y-16">
        
        {/* Title Block */}
        <section className="space-y-4">
          <div className="text-[10px] font-mono tracking-[0.2em] text-[#06b6d4] uppercase font-bold">
            Architecture & Concept
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none text-[#f1f5f9]">
            How does <span className="bg-gradient-to-r from-[#00f2fe] to-[#06b6d4] bg-clip-text text-transparent italic font-serif">ZeroLocal</span> work?
          </h1>
          <p className="text-[#94a3b8] text-base sm:text-lg leading-relaxed max-w-3xl">
            ZeroLocal is a completely decentralized, serverless AI platform designed to run LLMs directly on your device's hardware within a sandboxed web page. Here is a technical breakdown of the engine, runtime modules, and optimization layers.
          </p>
        </section>

        {/* Conceptual Core Diagram */}
        <section className="bg-[#111317]/50 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="text-xl font-bold flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#06b6d4]" /> The Client-Side Pipeline Flow
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 text-center text-xs font-mono">
            {/* Step 1 */}
            <div className="bg-[#08090a] border border-[rgba(255,255,255,0.04)] rounded-xl p-4 flex flex-col items-center space-y-3 justify-start">
              <span className="w-6 h-6 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold">1</span>
              <Database className="w-5 h-5 text-[#06b6d4]" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">Cache Weights</p>
                <p className="text-[10px] text-slate-500 leading-normal">Downloads ONNX weights and stores them in browser cache storage.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="bg-[#08090a] border border-[rgba(255,255,255,0.04)] rounded-xl p-4 flex flex-col items-center space-y-3 justify-start">
              <span className="w-6 h-6 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold">2</span>
              <Cpu className="w-5 h-5 text-[#06b6d4]" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">Web Worker</p>
                <p className="text-[10px] text-slate-500 leading-normal">Initializes model inside a background thread to prevent UI freezing.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="bg-[#08090a] border border-[rgba(255,255,255,0.04)] rounded-xl p-4 flex flex-col items-center space-y-3 justify-start">
              <span className="w-6 h-6 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold">3</span>
              <Binary className="w-5 h-5 text-[#06b6d4]" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">WebGPU WGSL</p>
                <p className="text-[10px] text-slate-500 leading-normal">Compiles shader kernels directly on your GPU for native execution.</p>
              </div>
            </div>
            {/* Step 4 */}
            <div className="bg-[#08090a] border border-[rgba(255,255,255,0.04)] rounded-xl p-4 flex flex-col items-center space-y-3 justify-start">
              <span className="w-6 h-6 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold">4</span>
              <Flame className="w-5 h-5 text-[#06b6d4]" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">KV Caching</p>
                <p className="text-[10px] text-slate-500 leading-normal">Stores historical key/values in GPU buffers for sub-second generation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Concept Explanations */}
        <section className="space-y-12">
          
          {/* Section 1: Privacy Concept */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <ShieldCheck className="w-5 h-5 text-[#06b6d4]" /> Concept: Total Privacy Sandboxing
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Traditional AI chatbots act as proxy channels. Every prompt you type is transmitted over public networks to external data centers, processed, and logged in databases. 
            </p>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              <strong>ZeroLocal operates on a Zero-Network architecture.</strong> Once the model's ONNX weights are loaded into your browser's persistent cache, you can disconnect your computer from the internet entirely. The page stays fully operational. The browser's native security sandbox isolates all memory, assuring that no prompts, context history, or model outputs ever leave your host machine.
            </p>
          </div>

          {/* Section 2: WebGPU Acceleration */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <Cpu className="w-5 h-5 text-[#06b6d4]" /> Technology: WebGPU Shader Pipelines
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Historically, running LLMs in browsers was limited by sluggish CPU execution or slow WebGL workarounds. WebGPU gives modern browsers low-overhead, direct access to your system graphics card's compute cores (e.g. Intel Iris, AMD Radeon, Nvidia GeForce, or Apple M-series chips).
            </p>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              We compile neural network operations into WGSL (WebGPU Shading Language) shader kernels. Instead of using CPU threads, tensor multiplication, attention modules, and projection layers are parallelized across thousands of GPU cores simultaneously, enabling desktop-grade inference speeds inside a web tab.
            </p>
          </div>

          {/* Section 3: Web Workers and Multi-threading */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <Layers className="w-5 h-5 text-[#06b6d4]" /> Multi-Threading: Web Worker Thread Isolation
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Large language models require intensive mathematical computation. If run on the browser's main thread, the user interface would freeze during token generation, causing lagging keystrokes and choppy scrolling.
            </p>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              ZeroLocal solves this by spinning up a separate **Web Worker thread** (`llm.worker.ts`). All model downloads, shader compilation, and token generation run isolated in the background. Keystrokes, navigation, and custom CSS animations on the main thread remain buttery smooth at 60fps.
            </p>
          </div>

          {/* Section 4: Optimization Techniques */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <Flame className="w-5 h-5 text-[#06b6d4]" /> Speed Optimizations
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#94a3b8]">
              <li>
                <strong>Dynamic KV caching (`past_key_values`)</strong>: Instead of re-evaluating the entire chat history for every new token generated, we store the historical keys and values in WebGPU buffers. This makes generation speeds constant, regardless of context length.
              </li>
              <li>
                <strong>Greedy Generation (`do_sample: false`)</strong>: Disabling multinomial sampling bypasses CPU-intensive logit sorting, raising processing speed from 5 TPS up to **14+ TPS**.
              </li>
              <li>
                <strong>1-Token Shader Warmup</strong>: During the model load progress bar, the system automatically triggers a single-token generation run. This pre-compiles all WGSL pipelines so that when you send your first message, generation starts instantly.
              </li>
            </ul>
          </div>

        </section>

        {/* Footer Actions */}
        <section className="text-center pt-8 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="px-6 py-3 bg-[#06b6d4] hover:bg-[#0891b2] text-[#08090a] font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 duration-200 cursor-pointer"
            >
              Start Local Chat
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-[#111317] border border-[rgba(255,255,255,0.06)] hover:bg-[#1e293b]/50 text-[#94a3b8] hover:text-[#f1f5f9] rounded-lg transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </section>

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] py-8 bg-[#08090a] text-center text-xs text-[#64748b] w-full mt-auto relative z-10">
        <p>© 2026 ZeroLocal AI. All rights reserved.</p>
      </footer>
    </div>
  )
}
