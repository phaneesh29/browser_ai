import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '../stores/appStore'

type PipelineStage = 'idle' | 'compile' | 'ingest' | 'decode'

export default function Home() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)
  const { webGpuSupported, gpuName } = useAppStore()

  // State for simulated WebGPU generation
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle')
  const [prompt, setPrompt] = useState('Write a concise tagline for an in-browser AI engine.')
  const [responseText, setResponseText] = useState('')
  const [speed, setSpeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [vramUsage, setVramUsage] = useState(0) // in MB
  const [tokensGenerated, setTokensGenerated] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPageTitle('Home')
  }, [setPageTitle])

  // Scroll console output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [responseText])

  const runWebGPUBenchmark = () => {
    if (isRunning) return
    setIsRunning(true)
    setResponseText('')
    setTokensGenerated(0)
    setSpeed(0)
    setProgress(0)
    setVramUsage(0)

    const fullResponse = `⚡ Browser AI WebGPU Engine v1.0.0
[WebGPU Pipeline Initiated]
Initializing WGSL shader bindings... Done (12ms)
Allocating memory buffers for KV cache... Done (34ms)
Model loaded from Local IndexedDB Cache: Llama-3-8B-Instruct-Q4 (4.54 GB)

[Processing Input Prompt]
Tokens: 11
Processing prompt tokens using GPU compute queue... (Prefill speed: 310.4 tok/s)

[Autoregressive Decode phase]
"Browser AI: Unleashing desktop-grade neural intelligence directly inside your web client, powered by zero-install local WebGPU compute."

[Execution Complete]
- Total generation time: 2.12s
- Tokens generated: 26
- Avg Speed: 42.8 tok/s
- KV Cache peak memory: 184 MB`

    // Step 1: Compile/Init (WGSL Shaders)
    setPipelineStage('compile')
    setProgress(15)
    setVramUsage(1200) // Base weight footprint

    setTimeout(() => {
      // Step 2: Prompt Ingestion / Prefill
      setPipelineStage('ingest')
      setProgress(50)
      setVramUsage(1350)

      setTimeout(() => {
        // Step 3: Autoregressive decoding
        setPipelineStage('decode')
        setProgress(100)
        
        let currentCharIndex = 0
        const interval = setInterval(() => {
          if (currentCharIndex < fullResponse.length) {
            const nextChars = fullResponse.slice(0, currentCharIndex + 4)
            setResponseText(nextChars)
            currentCharIndex += 4
            
            setSpeed(Number((38 + Math.random() * 8).toFixed(1)))
            setTokensGenerated(Math.min(26, Math.floor(currentCharIndex / 16)))
            setVramUsage(Math.floor(1420 + Math.random() * 15))
          } else {
            clearInterval(interval)
            setPipelineStage('idle')
            setIsRunning(false)
            setSpeed(42.8)
            setTokensGenerated(26)
            setVramUsage(1434)
          }
        }, 30)
      }, 700)
    }, 500)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-indigo-200 bg-clip-text text-transparent">
          On-Device Neural Acceleration
        </h1>
        <p className="text-gray-400 text-base sm:text-lg mt-2 max-w-2xl">
          Running LLMs directly inside your browser sandbox. Fully private, cost-free inference powered by WebGPU.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Playground & Console (Takes 2/3 cols on lg screens) */}
        <div className="lg:col-span-2 bg-[#1a1d2e] border border-[#252a45] rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_4px_30px_rgba(99,102,241,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                🧠 Llama-3-8B-Instruct
                <span className="text-[11px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
                  INT4 quantized
                </span>
              </div>
              <span className="text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                4.54 GB cached
              </span>
            </div>

            <div className="space-y-4">
              <textarea
                className="w-full min-h-[100px] bg-black/30 border border-[#252a45] rounded-xl p-4 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 resize-y transition-colors"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isRunning}
                placeholder="Enter a prompt to run locally..."
              />
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-white/5 text-gray-200 border border-[#252a45] rounded-xl text-sm font-semibold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={isRunning}
                  onClick={() => {
                    setResponseText('')
                    setSpeed(0)
                    setTokensGenerated(0)
                    setVramUsage(0)
                  }}
                >
                  Clear Console
                </button>
                <button
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  onClick={runWebGPUBenchmark}
                  disabled={isRunning}
                >
                  {isRunning ? 'Inferencing...' : 'Run WebGPU Inference'}
                </button>
              </div>
            </div>
          </div>

          <div 
            ref={outputRef}
            className="mt-6 bg-black/40 border border-[#252a45] rounded-xl p-5 min-h-[160px] max-h-[300px] overflow-y-auto font-mono text-sm leading-relaxed text-indigo-100/90 whitespace-pre-wrap relative"
          >
            {responseText ? (
              <>
                {responseText}
                {isRunning && <span className="inline-block w-1.5 h-4 bg-indigo-400 ml-1 animate-pulse"></span>}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm p-4">
                Waiting for inference trigger... Click "Run WebGPU Inference" to start.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Performance Monitor & WebGPU Config (Takes 1/3 col) */}
        <div className="space-y-6">
          {/* Active Metrics */}
          <div className="bg-[#1a1d2e] border border-[#252a45] rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_4px_30px_rgba(99,102,241,0.05)]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Hardware Monitor
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/2 border border-white/5 p-4 rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Speed</span>
                <span className="text-lg font-bold font-mono text-gray-100">
                  {speed || '—'}
                  {speed > 0 && <span className="text-xs font-normal text-gray-400 ml-0.5"> T/s</span>}
                </span>
              </div>
              <div className="bg-white/2 border border-white/5 p-4 rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">VRAM Footprint</span>
                <span className="text-lg font-bold font-mono text-gray-100">
                  {vramUsage ? (vramUsage / 1024).toFixed(2) : '—'}
                  {vramUsage > 0 && <span className="text-xs font-normal text-gray-400 ml-0.5"> GB</span>}
                </span>
              </div>
            </div>

            <div className="bg-black/20 border border-[#252a45] rounded-xl p-5">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400 uppercase mb-4">
                <span>GPU Compute Pipeline</span>
                <span className={isRunning ? 'text-indigo-400' : 'text-gray-500'}>
                  {pipelineStage}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1">
                {/* Step 1 */}
                <div className={`flex-1 text-center p-2 rounded-lg border transition-all ${
                  pipelineStage === 'compile' 
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200' 
                    : 'bg-white/2 border-transparent text-gray-500'
                }`}>
                  <div className="text-base mb-0.5">🛠️</div>
                  <div className="text-[10px] font-bold">WGSL</div>
                  <div className="text-[8px] opacity-75 font-mono">Compile</div>
                </div>

                <span className="text-gray-600 text-xs font-bold">➔</span>

                {/* Step 2 */}
                <div className={`flex-1 text-center p-2 rounded-lg border transition-all ${
                  pipelineStage === 'ingest' 
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200' 
                    : 'bg-white/2 border-transparent text-gray-500'
                }`}>
                  <div className="text-base mb-0.5">📥</div>
                  <div className="text-[10px] font-bold">Prefill</div>
                  <div className="text-[8px] opacity-75 font-mono">KV Cache</div>
                </div>

                <span className="text-gray-600 text-xs font-bold">➔</span>

                {/* Step 3 */}
                <div className={`flex-1 text-center p-2 rounded-lg border transition-all ${
                  pipelineStage === 'decode' 
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200' 
                    : 'bg-white/2 border-transparent text-gray-500'
                }`}>
                  <div className="text-base mb-0.5">🔄</div>
                  <div className="text-[10px] font-bold">Decode</div>
                  <div className="text-[8px] opacity-75 font-mono">{tokensGenerated} Toks</div>
                </div>
              </div>

              {isRunning && (
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500 rounded-full transition-all duration-300 bg-[length:200%_100%] animate-pulse" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WebGPU Device Adapter details */}
          <div className="bg-[#1a1d2e] border border-[#252a45] rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_4px_30px_rgba(99,102,241,0.05)]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Device Profile
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between pb-3 border-b border-white/5">
                <span className="text-gray-400">API Version</span>
                <span className={`font-mono font-semibold ${webGpuSupported ? 'text-emerald-400' : 'text-red-400'}`}>
                  WebGPU v1.0
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-white/5">
                <span className="text-gray-400">Hardware Adapter</span>
                <span className="font-mono font-semibold text-gray-200 max-w-[150px] truncate" title={gpuName}>
                  {gpuName}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-white/5">
                <span className="text-gray-400">Shader Engine</span>
                <span className="font-mono font-semibold text-gray-200">WGSL Pipeline</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Host Environment</span>
                <span className="font-mono font-semibold text-gray-200">Browser Sandbox</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
