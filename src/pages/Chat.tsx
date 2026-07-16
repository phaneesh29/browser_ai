import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useChatStore } from '../stores/chat'
import { useAppStore } from '../stores/appStore'
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
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Top Header */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-md font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 fill-blue-600/10" /> Local WebGPU Chat
            </h1>
            <span className="text-xs text-slate-500">Local Sandbox Execution</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Control / Configuration Panel */}
        <aside className="w-80 border-r border-slate-200/80 bg-white flex flex-col p-6 space-y-6 overflow-y-auto hidden md:flex">
          {/* Model Selection */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Model Configuration</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Active Model</label>
              <select
                value={selectedModel.id}
                onChange={(e) => {
                  const m = models.find((x) => x.id === e.target.value)
                  if (m) setSelectedModel(m)
                }}
                disabled={modelLoading || generating}
                className="w-full text-sm rounded-lg border border-slate-200 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 disabled:bg-slate-50 disabled:text-slate-400"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.dtype})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Model repository: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] select-all break-all">{selectedModel.repo}</code>
            </p>
          </div>

          {/* Model Loading / Ready Card */}
          <div className="border border-slate-200/85 rounded-xl p-4 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Status</span>
              {modelReady ? (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                  Not Loaded
                </span>
              )}
            </div>

            {!modelReady && !modelLoading && (
              <button
                onClick={loadModel}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4" /> Load Model (WebGPU)
              </button>
            )}

            {modelLoading && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                    Fetching model weights...
                  </span>
                  <span>{modelLoadingProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${modelLoadingProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 truncate" title={modelLoadingStatusText}>
                  {modelLoadingStatusText}
                </p>
              </div>
            )}

            {modelReady && (
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-500 leading-relaxed">
                  The model weights are fully loaded into your local browser cache and compiled into WebGPU shaders. Next prompts will infer instantly.
                </p>
              </div>
            )}
          </div>

          {/* System Hardware */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Hardware</h2>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">GPU Device</span>
                <span className="font-semibold text-slate-800 text-right max-w-[120px] truncate" title={gpuName}>{gpuName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Runtime Engine</span>
                <span className="font-semibold text-slate-800">ONNX WebGPU</span>
              </div>
            </div>
          </div>

          {/* Reset / Actions */}
          <div className="flex-1 flex items-end">
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:hover:bg-white"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Conversation
            </button>
          </div>
        </aside>

        {/* Chat Feed Panel */}
        <section className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
          
          {/* Mobile Model load notification / banner */}
          {!modelReady && (
            <div className="md:hidden flex-shrink-0 bg-blue-50 border-b border-blue-100 p-4 flex flex-col space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-900">Model {selectedModel.name} requires loading</span>
                {modelLoading && <span className="font-semibold text-blue-700">{modelLoadingProgress}%</span>}
              </div>
              {modelLoading ? (
                <div className="w-full bg-blue-200 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${modelLoadingProgress}%` }}
                  />
                </div>
              ) : (
                <button
                  onClick={loadModel}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-all shadow-sm"
                >
                  Load Model (WebGPU)
                </button>
              )}
            </div>
          )}

          {/* Feed Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
            
            {error && (
              <div className="max-w-3xl mx-auto bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Inference Error</p>
                  <p className="text-xs leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {messages.length === 0 && !activeStreamingText && (
              <div className="max-w-2xl mx-auto text-center py-12 space-y-8">
                <div className="inline-flex p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                  <Bot className="w-10 h-10 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
                    Talk to Bonsai 1.7B
                  </h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                    This model is running entirely inside your browser sandbox. Give it a prompt below to see WebGPU text generation in action.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-4 text-left">
                  {suggestedPrompts.map((promptText, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(promptText)}
                      className="p-3.5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-xs text-slate-600 hover:text-slate-900 transition-all text-left shadow-sm hover:shadow-md cursor-pointer hover:bg-blue-50/10"
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
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] rounded-2xl px-4.5 py-3 text-sm shadow-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap'
                  }`}>
                    {msg.content}
                  </div>

                  {/* User Icon */}
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <User className="w-4.5 h-4.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Active Stream Bubble */}
              {activeStreamingText && (
                <div className="flex gap-4 items-start justify-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4.5 py-3 text-sm shadow-sm leading-relaxed bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap">
                    {activeStreamingText}
                    <span className="inline-block w-1.5 h-3.5 ml-1 bg-blue-600 animate-pulse align-middle" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

          </div>

          {/* Bottom Input Area */}
          <div className="flex-shrink-0 bg-white border-t border-slate-200/80 p-4 md:p-6">
            <div className="max-w-3xl mx-auto flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
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
                className="flex-1 bg-transparent border-0 outline-none focus:ring-0 p-2 text-sm text-slate-800 resize-none max-h-32 min-h-[40px] leading-relaxed"
              />
              
              {generating ? (
                <button
                  onClick={abortGeneration}
                  className="p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all shadow-sm hover:shadow"
                  title="Stop generation"
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl transition-all shadow-sm hover:shadow"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2.5">
              Powered by Transformers.js v3 & WebGPU. Runs locally in your browser sandbox.
            </p>
          </div>

        </section>

      </div>
    </div>
  )
}
