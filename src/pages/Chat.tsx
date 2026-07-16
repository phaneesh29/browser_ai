import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useChatStore } from '../stores/chat'
import { useAppStore } from '../stores/appStore'
import { DigitCanvas } from '../components'
import { 
  ArrowLeft, 
  Send, 
  Square, 
  Trash2, 
  Bot, 
  User, 
  Sparkles, 
  Cpu, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'

export default function Chat() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)
  const { webGpuSupported, gpuName } = useAppStore()
  
  const {
    messages,
    models,
    selectedModel,
    modelLoading,
    modelLoadingProgress,
    modelLoadingStatusText,
    modelReady,
    generating,
    error,
    activeStreamingText,
    tps,
    setSelectedModel,
    loadModel,
    sendMessage,
    abortGeneration,
    clearChat
  } = useChatStore()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Set page title
  useEffect(() => {
    setPageTitle('Chat')
  }, [setPageTitle])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeStreamingText])

  const handleSend = async () => {
    if (!input.trim() || generating) return
    const textToSend = input
    setInput('')
    await sendMessage(textToSend)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedPrompts = [
    "Write a short, engaging poem about artificial intelligence running in a browser.",
    "Explain the concept of quantum computing to a 10-year-old child.",
    "Write a simple Python script to fetch the current weather from an API.",
    "Draft a professional email requesting a project deadline extension."
  ]

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      {/* 1-Bit Matrix Glistening Background Canvas */}
      <DigitCanvas />

      {/* Top Header */}
      <header className="flex-shrink-0 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-md font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 fill-blue-500/10" /> Local WebGPU Chat
            </h1>
            <span className="text-xs text-slate-400">1-Bit Sandbox Execution</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {generating && tps !== null && (
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 flex items-center gap-1 animate-pulse">
              {tps.toFixed(1)} tok/s
            </span>
          )}
          {webGpuSupported !== null && (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider border ${
              webGpuSupported 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60' 
                : 'bg-rose-950/40 text-rose-400 border-rose-800/60'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-current ${webGpuSupported ? 'animate-pulse' : ''}`}></span>
              WebGPU {webGpuSupported ? 'Available' : 'Unavailable'}
            </span>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden z-10">
        
        {/* Left Control / Configuration Panel */}
        <aside className="w-80 border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col p-6 space-y-6 overflow-y-auto hidden md:flex">
          
          {/* Model Selection */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model Configuration</h2>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Active Model</label>
              <select
                value={selectedModel.id}
                onChange={(e) => {
                  const m = models.find((x) => x.id === e.target.value)
                  if (m) setSelectedModel(m)
                }}
                disabled={modelLoading || generating}
                className="w-full text-sm rounded-lg border border-slate-800 p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 disabled:bg-slate-950 disabled:text-slate-600 transition-all"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.comingSoon}>
                    {m.name} {m.comingSoon ? '(Coming Soon)' : `(${m.dtype})`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Model Card Metadata */}
            <div className="bg-slate-950/40 border border-slate-800/50 rounded-lg p-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Footprint</span>
                <span className="font-semibold text-slate-200">{selectedModel.size || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Parameters</span>
                <span className="font-semibold text-slate-200">{selectedModel.params || '—'}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed border-t border-slate-800/50">
                {selectedModel.blurb}
              </p>
            </div>
          </div>

          {/* Model Loading / Ready Card */}
          <div className="border border-slate-850 rounded-xl p-4 bg-slate-950/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Status</span>
              {modelReady ? (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                  Not Loaded
                </span>
              )}
            </div>

            {!modelReady && !modelLoading && (
              <button
                onClick={loadModel}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4" /> Load Model (WebGPU)
              </button>
            )}

            {modelLoading && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                    Fetching weights...
                  </span>
                  <span>{modelLoadingProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${modelLoadingProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 truncate" title={modelLoadingStatusText}>
                  {modelLoadingStatusText}
                </p>
              </div>
            )}

            {modelReady && (
              <div className="space-y-1.5 text-xs text-slate-400">
                <p className="leading-relaxed">
                  Weights compiled into WebGPU shaders inside browser cache. Inference is fully local and offline.
                </p>
              </div>
            )}
          </div>

          {/* System Hardware */}
          <div className="space-y-3 pt-4 border-t border-slate-800/60">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Device Hardware</h2>
            <div className="bg-slate-950/40 rounded-lg p-3 border border-slate-800/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">GPU Device</span>
                <span className="font-semibold text-slate-200 text-right max-w-[120px] truncate" title={gpuName}>{gpuName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Runtime Engine</span>
                <span className="font-semibold text-slate-200">ONNX WebGPU</span>
              </div>
            </div>
          </div>

          {/* Reset / Actions */}
          <div className="flex-1 flex items-end">
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="w-full py-2 border border-slate-800 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Conversation
            </button>
          </div>
        </aside>

        {/* Chat Feed Panel */}
        <section className="flex-1 flex flex-col bg-transparent overflow-hidden relative">
          
          {/* Mobile Model load notification / banner */}
          {!modelReady && (
            <div className="md:hidden flex-shrink-0 bg-blue-950/60 backdrop-blur-md border-b border-blue-900/60 p-4 flex flex-col space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-300">Model {selectedModel.name} requires loading</span>
                {modelLoading && <span className="font-semibold text-blue-400">{modelLoadingProgress}%</span>}
              </div>
              {modelLoading ? (
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${modelLoadingProgress}%` }}
                  />
                </div>
              ) : (
                <button
                  onClick={loadModel}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold transition-all shadow-md cursor-pointer"
                >
                  Load Model (WebGPU)
                </button>
              )}
            </div>
          )}

          {/* Feed Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
            
            {error && (
              <div className="max-w-3xl mx-auto bg-rose-950/30 border border-rose-900/40 rounded-xl p-4 flex items-start gap-3 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Inference Error</p>
                  <p className="text-xs leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {messages.length === 0 && !activeStreamingText && (
              <div className="max-w-2xl mx-auto text-center py-12 space-y-8">
                <div className="inline-flex p-4 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
                  <Bot className="w-10 h-10 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
                    Talk to {selectedModel.name}
                  </h2>
                  <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                    This model is running entirely inside your browser sandbox. Give it a prompt below to see WebGPU text generation in action.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-4 text-left">
                  {suggestedPrompts.map((promptText, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(promptText)}
                      className="p-3.5 bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 rounded-xl text-xs text-slate-400 hover:text-slate-100 hover:bg-blue-950/10 transition-all text-left shadow-md cursor-pointer"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Chat Messages */}
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div 
                  key={i}
                  className={`flex gap-4 items-start ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Assistant Icon */}
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] rounded-2xl px-4.5 py-3 text-sm shadow-md leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600/90 text-white font-medium rounded-tr-none'
                      : 'bg-slate-900/85 border border-slate-800/80 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                  }`}>
                    {msg.content}
                  </div>

                  {/* User Icon */}
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                      <User className="w-4.5 h-4.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Active Stream Bubble */}
              {activeStreamingText && (
                <div className="flex gap-4 items-start justify-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4.5 py-3 text-sm shadow-md leading-relaxed bg-slate-900/85 border border-slate-800/80 text-slate-200 rounded-tl-none whitespace-pre-wrap">
                    {activeStreamingText}
                    <span className="inline-block w-1.5 h-3.5 ml-1 bg-blue-400 animate-pulse align-middle" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

          </div>

          {/* Bottom Input Area */}
          <div className="flex-shrink-0 bg-slate-900/60 border-t border-slate-800/80 p-4 md:p-6 backdrop-blur-md">
            <div className="max-w-3xl mx-auto flex items-end gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  !modelReady
                    ? `Click "Load Model" to initialize ${selectedModel.name}...`
                    : "Type a prompt to run locally..."
                }
                rows={1}
                className="flex-1 bg-transparent border-0 outline-none focus:ring-0 p-2 text-sm text-slate-100 resize-none max-h-32 min-h-[40px] leading-relaxed placeholder-slate-500"
              />
              
              {generating ? (
                <button
                  onClick={abortGeneration}
                  className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all shadow-md cursor-pointer"
                  title="Stop generation"
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-xl transition-all shadow-md cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-2.5">
              Powered by Transformers.js v3 & WebGPU. Runs locally in your browser sandbox.
            </p>
          </div>

        </section>

      </div>
    </div>
  )
}
