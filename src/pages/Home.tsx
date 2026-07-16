import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '../stores/appStore'

type PipelineStage = 'idle' | 'compile' | 'ingest' | 'decode'

export default function Home() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)
  const { webGpuSupported, gpuName } = useAppStore()

  // State for interactive demo
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle')
  const [prompt, setPrompt] = useState('Write a tagline for a local in-browser WebGPU AI library.')
  const [responseText, setResponseText] = useState('')
  const [speed, setSpeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [vramUsage, setVramUsage] = useState(0)
  const [tokensGenerated, setTokensGenerated] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const outputRef = useRef<HTMLDivElement>(null)
  const demoSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPageTitle('Home')
  }, [setPageTitle])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [responseText])

  const scrollToDemo = () => {
    demoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const runDemo = () => {
    if (isRunning) return
    setIsRunning(true)
    setResponseText('')
    setTokensGenerated(0)
    setSpeed(0)
    setProgress(0)
    setVramUsage(0)

    const fullResponse = `⚡ Browser AI WebGPU Inference Engine
[WGSL Pipeline] Shader compilation completed (15ms)
[Buffer Config] Allocated 1,434 MB on local WebGPU adapter.
[IndexedDB] Loaded Llama-3-8B-Quantized weights.

[Decoded Output]
"Run private, hardware-accelerated AI models locally inside your browser tab. Zero setups, zero servers, zero lag."

[Metrics]
- Time to first token: 85ms
- Average Speed: 46.2 tokens/sec
- Status: Success`

    setPipelineStage('compile')
    setProgress(20)
    setVramUsage(1024)

    setTimeout(() => {
      setPipelineStage('ingest')
      setProgress(60)
      setVramUsage(1280)

      setTimeout(() => {
        setPipelineStage('decode')
        setProgress(100)
        
        let charIndex = 0
        const interval = setInterval(() => {
          if (charIndex < fullResponse.length) {
            const chunk = fullResponse.slice(0, charIndex + 4)
            setResponseText(chunk)
            charIndex += 4
            setSpeed(Number((42 + Math.random() * 6).toFixed(1)))
            setTokensGenerated(Math.min(22, Math.floor(charIndex / 16)))
            setVramUsage(Math.floor(1380 + Math.random() * 20))
          } else {
            clearInterval(interval)
            setPipelineStage('idle')
            setIsRunning(false)
            setSpeed(46.2)
            setTokensGenerated(22)
            setVramUsage(1434)
          }
        }, 20)
      }, 600)
    }, 400)
  }

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center text-center pt-16 sm:pt-24 max-w-4xl mx-auto px-4">
        {/* Glow effect background */}
        <div className="absolute top-0 -z-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl opacity-80 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-300 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          Next-Gen Browser Computing
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white via-gray-100 to-gray-500 bg-clip-text text-transparent">
          Run Large Language Models <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
            Locally in Your Browser.
          </span>
        </h1>

        <p className="mt-6 text-gray-400 text-base sm:text-xl max-w-2xl leading-relaxed">
          Zero servers. Zero API costs. Native performance powered directly by on-device hardware acceleration using WebGPU.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <button
            onClick={scrollToDemo}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/35 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Try Live Demo
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-100 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            SDK Documentation
          </a>
        </div>
      </section>

      {/* 2. Feature Cards Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Why WebGPU Local Inference?</h2>
          <p className="text-gray-400 mt-2">Ditch the cloud servers and bring computing to the edge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121420]/40 border border-[#252a45] rounded-2xl p-6 hover:border-indigo-500/20 transition-all group">
            <div className="text-2xl mb-4 p-2 bg-indigo-500/5 rounded-lg w-fit group-hover:bg-indigo-500/10 transition-colors">🔒</div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">100% Privacy</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              No network requests. Your prompts, inputs, and generated replies never leave the client browser environment.
            </p>
          </div>

          <div className="bg-[#121420]/40 border border-[#252a45] rounded-2xl p-6 hover:border-indigo-500/20 transition-all group">
            <div className="text-2xl mb-4 p-2 bg-indigo-500/5 rounded-lg w-fit group-hover:bg-indigo-500/10 transition-colors">💰</div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Zero Cloud Costs</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Eliminate expensive host routing and API fees. Compute runs entirely on your users' native local GPU hardware.
            </p>
          </div>

          <div className="bg-[#121420]/40 border border-[#252a45] rounded-2xl p-6 hover:border-indigo-500/20 transition-all group">
            <div className="text-2xl mb-4 p-2 bg-indigo-500/5 rounded-lg w-fit group-hover:bg-indigo-500/10 transition-colors">⚡</div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Native Performance</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Unlock modern generation speeds (40+ tokens/sec) using optimized WGSL shaders and 4-bit model quantizations.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Live Interactive Demo Playground */}
      <section ref={demoSectionRef} className="max-w-5xl mx-auto px-4 scroll-mt-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Interactive Playground</h2>
          <p className="text-gray-400 mt-2">Test real-time compiled WebGPU generation streams below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Playground panel */}
          <div className="lg:col-span-2 bg-[#121420]/45 border border-[#252a45] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-200">Llama-3-8B (Quantized)</span>
                <span className="text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded">
                  4.54 GB footprint
                </span>
              </div>
              <textarea
                className="w-full min-h-[90px] bg-black/40 border border-[#252a45] rounded-xl p-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all resize-y"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isRunning}
              />
              <div className="flex justify-end gap-3 mt-3">
                <button
                  className="px-4 py-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 disabled:opacity-40 transition-all"
                  onClick={() => setResponseText('')}
                  disabled={isRunning}
                >
                  Clear Console
                </button>
                <button
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-md disabled:opacity-50"
                  onClick={runDemo}
                  disabled={isRunning}
                >
                  {isRunning ? 'Running WebGPU Pipeline...' : 'Run WebGPU Inference'}
                </button>
              </div>
            </div>

            <div 
              ref={outputRef}
              className="mt-6 bg-black/50 border border-[#252a45] rounded-xl p-4 min-h-[140px] max-h-[220px] overflow-y-auto font-mono text-xs text-indigo-200/90 leading-relaxed whitespace-pre-wrap relative"
            >
              {responseText ? (
                <>
                  {responseText}
                  {isRunning && <span className="inline-block w-1.5 h-3.5 bg-indigo-400 ml-1 animate-pulse"></span>}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-center p-4">
                  Output will print stream telemetry here...
                </div>
              )}
            </div>
          </div>

          {/* Diagnostics / Hardware Monitor */}
          <div className="space-y-6">
            <div className="bg-[#121420]/45 border border-[#252a45] rounded-2xl p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Hardware Monitor</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/2 border border-white/5 p-3 rounded-xl">
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Avg Speed</div>
                  <div className="text-base font-bold font-mono text-white mt-1">
                    {speed || '—'}
                    {speed > 0 && <span className="text-[10px] text-gray-400 font-normal"> T/s</span>}
                  </div>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-xl">
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">VRAM Allocated</div>
                  <div className="text-base font-bold font-mono text-white mt-1">
                    {vramUsage ? (vramUsage / 1024).toFixed(2) : '—'}
                    {vramUsage > 0 && <span className="text-[10px] text-gray-400 font-normal"> GB</span>}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs pb-4 border-b border-white/5">
                <span className="text-gray-400">Tokens Generated</span>
                <span className="font-mono font-semibold text-indigo-300">{tokensGenerated} tokens</span>
              </div>

              {/* Progress bar */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                  <span>Engine State</span>
                  <span className={isRunning ? 'text-indigo-400' : 'text-gray-500'}>{pipelineStage}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-[#121420]/45 border border-[#252a45] rounded-2xl p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Browser Profile</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">WebGPU Status</span>
                  <span className={`font-semibold ${webGpuSupported ? 'text-emerald-400' : 'text-red-400'}`}>
                    {webGpuSupported ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">GPU Device</span>
                  <span className="font-semibold text-gray-200 max-w-[120px] truncate" title={gpuName}>{gpuName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">WGSL Pipeline</span>
                  <span className="font-semibold text-gray-200">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Code Block Integration Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Integrate in Minutes</h2>
          <p className="text-gray-400 mt-2">Just standard JavaScript. No headers, no compiled backend required.</p>
        </div>

        <div className="bg-black/45 border border-[#252a45] rounded-2xl p-6 font-mono text-xs sm:text-sm text-indigo-200/90 leading-relaxed overflow-x-auto shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">example-usage.js</span>
          </div>
          <pre>
{`import { BrowserAI } from '@browser-ai/core';

// 1. Initialise the engine and fetch model weights
const engine = await BrowserAI.load('llama-3-8b-instruct');

// 2. Perform lightning-fast, private offline generation
const stream = await engine.generate({
  prompt: 'Design a space colony tagline.',
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}`}
          </pre>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-[#252a45]/60 pt-8 max-w-5xl mx-auto px-4 text-center text-xs text-gray-500">
        <p>© 2026 Browser AI Technologies, Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}
