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
    setVramUsage(1200) // Base model weight footprint in VRAM (simulated q4 quantization)

    setTimeout(() => {
      // Step 2: Prompt Ingestion / Prefill
      setPipelineStage('ingest')
      setProgress(50)
      setVramUsage(1350) // weights + input buffer

      setTimeout(() => {
        // Step 3: Autoregressive decoding
        setPipelineStage('decode')
        setProgress(100)
        
        let currentCharIndex = 0
        const interval = setInterval(() => {
          if (currentCharIndex < fullResponse.length) {
            // Read character by character
            const nextChars = fullResponse.slice(0, currentCharIndex + 4)
            setResponseText(nextChars)
            currentCharIndex += 4
            
            // Randomly wiggle metrics to make it look alive
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
    <div>
      <div className="page-intro">
        <h1>On-Device Neural Acceleration</h1>
        <p>
          Running LLMs directly inside your browser sandbox. Fully private, cost-free inference powered by WebGPU.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Left Side: Playground & Console */}
        <div className="glass-card">
          <div className="model-header-row">
            <div className="model-name-title">
              🧠 Llama-3-8B-Instruct
              <span className="model-badge">INT4 quantized</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="model-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                4.54 GB
              </span>
            </div>
          </div>

          <div className="playground-input-group">
            <textarea
              className="playground-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isRunning}
              placeholder="Enter a prompt to run locally..."
            />
            <div className="playground-actions">
              <button
                className="btn btn-secondary"
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
                className="btn btn-primary"
                onClick={runWebGPUBenchmark}
                disabled={isRunning}
              >
                {isRunning ? 'Inferencing...' : 'Run WebGPU Inference'}
              </button>
            </div>
          </div>

          <div className="output-console" ref={outputRef}>
            {responseText ? (
              <>
                {responseText}
                {isRunning && <span className="cursor-blink"></span>}
              </>
            ) : (
              <div className="output-placeholder">
                Waiting for inference trigger... Click "Run WebGPU Inference" to start.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Performance Monitor & WebGPU Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Metrics */}
          <div className="glass-card">
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Hardware Monitor
            </h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">Inference Speed</span>
                <span className="metric-value">
                  {speed || '—'}
                  {speed > 0 && <span className="metric-unit"> T/s</span>}
                </span>
              </div>
              <div className="metric-card">
                <span className="metric-label">VRAM Usage</span>
                <span className="metric-value">
                  {vramUsage ? (vramUsage / 1024).toFixed(2) : '—'}
                  {vramUsage > 0 && <span className="metric-unit"> GB</span>}
                </span>
              </div>
            </div>

            <div className="pipeline-container">
              <div className="pipeline-title">
                <span>GPU Compute Pipeline</span>
                <span style={{ color: isRunning ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {pipelineStage.toUpperCase()}
                </span>
              </div>
              <div className="pipeline-flow">
                <div className={`pipeline-step ${pipelineStage === 'compile' ? 'active' : ''}`}>
                  <div className="step-icon">🛠️</div>
                  <div className="step-name">WGSL</div>
                  <div className="step-status">Compile</div>
                </div>
                <div className="pipeline-arrow">➔</div>
                <div className={`pipeline-step ${pipelineStage === 'ingest' ? 'active' : ''}`}>
                  <div className="step-icon">📥</div>
                  <div className="step-name">Prefill</div>
                  <div className="step-status">KV Cache</div>
                </div>
                <div className="pipeline-arrow">➔</div>
                <div className={`pipeline-step ${pipelineStage === 'decode' ? 'active' : ''}`}>
                  <div className="step-icon">🔄</div>
                  <div className="step-name">Decode</div>
                  <div className="step-status">{tokensGenerated} Toks</div>
                </div>
              </div>

              {isRunning && (
                <div className="loader-container">
                  <div className="progress-bar-wrapper">
                    <div className="progress-bar animated" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WebGPU Device Adapter details */}
          <div className="glass-card">
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Device Profile
            </h3>
            <div className="device-info-list">
              <div className="device-info-item">
                <span className="info-label">API Version</span>
                <span className="info-value" style={{ color: webGpuSupported ? 'var(--success)' : 'var(--error)' }}>
                  WebGPU v1.0
                </span>
              </div>
              <div className="device-info-item">
                <span className="info-label">Hardware Adapter</span>
                <span className="info-value" style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {gpuName}
                </span>
              </div>
              <div className="device-info-item">
                <span className="info-label">Driver Architecture</span>
                <span className="info-value">WGSL Shaders</span>
              </div>
              <div className="device-info-item">
                <span className="info-label">Host Browser</span>
                <span className="info-value">Chrome Sandbox</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
