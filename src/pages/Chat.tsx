import { useEffect, useRef, useState, useCallback } from 'react'
import { useChatStore } from '../stores/chat'
import { useAppStore } from '../stores/appStore'
import { 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react'

// Custom SVGs from the reference template
function SendIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 12L12 4M6 4H12V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.5 6.5H1.75V3.75M2.2 6.2A5.8 5.8 0 1 1 3.6 11.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="4.25"
        y="4.25"
        width="7.5"
        height="7.5"
        rx="1.8"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Chat() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)
  
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
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef(true)

  // Set page title
  useEffect(() => {
    setPageTitle('Chat')
  }, [setPageTitle])

  // Focus input on load
  useEffect(() => {
    if (modelReady) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [modelReady])

  // Auto-scroll handler
  const handleMessagesScroll = useCallback(() => {
    const container = messagesRef.current
    if (!container) return

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight
    autoScrollRef.current = distanceFromBottom < 96
  }, [])

  useEffect(() => {
    if (!autoScrollRef.current) return

    const container = messagesRef.current
    if (!container) return

    const id = requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: generating || activeStreamingText ? 'auto' : 'smooth',
      })
    })

    return () => cancelAnimationFrame(id)
  }, [messages, activeStreamingText, generating])

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

  const clearChatAndExit = () => {
    clearChat()
    useChatStore.setState({ modelReady: false })
  }

  const suggestedPrompts = [
    "Who are you?",
    "Write a short poem about AI.",
    "What is the capital of France?",
    "Solve x^2 - 5x + 6 = 0."
  ]

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0e] text-[#ebe5d8] overflow-hidden font-sans dark-playground">
      
      {/* STAGE 1: Model Selection */}
      {!modelReady && !modelLoading && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto max-w-4xl mx-auto w-full">
          <div className="text-center space-y-3 mb-10">
            <div className="text-xs font-mono tracking-[0.2em] text-[#807a6f] uppercase">Choose a model</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#ebe5d8]">
              Load <span className="font-serif italic text-[#ffb84d]">locally.</span>
            </h2>
            <p className="text-sm text-[#807a6f] max-w-md mx-auto leading-relaxed">
              Each Bonsai model runs entirely in your browser via WebGPU. Pick a size — smaller loads faster, larger reasons better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {models.map((m) => (
              <div
                key={m.id}
                className={`group relative border rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col space-y-2.5 select-none ${
                  selectedModel.id === m.id 
                    ? "border-[#ffb84d] bg-[#181816] text-[#ebe5d8]" 
                    : m.comingSoon 
                      ? "border-[rgba(235,229,216,0.05)] bg-[#181816]/30 text-[#807a6f] cursor-not-allowed opacity-50" 
                      : "border-[rgba(235,229,216,0.1)] bg-[#181816]/60 text-[#b8b2a6] hover:border-[rgba(235,229,216,0.25)] hover:text-[#ebe5d8]"
                }`}
                onClick={() => !m.comingSoon && setSelectedModel(m)}
              >
                {m.comingSoon && (
                  <div className="absolute top-2.5 right-2.5 text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 bg-[#ffb84d]/10 text-[#ffb84d] border border-[#ffb84d]/20 rounded">
                    Coming soon
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold tracking-tight">{m.params || '—'}</span>
                  <span className="text-[10px] font-mono text-[#807a6f]">{m.size || '—'}</span>
                </div>
                <div className="text-sm font-semibold text-[#ebe5d8]">{m.name}</div>
                <div className="text-xs text-[#807a6f] leading-relaxed flex-1">{m.blurb}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 mt-10">
            <button
              className="px-6 py-2.5 bg-[#ffb84d] hover:bg-[#ffa726] text-[#0f0f0e] font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              onClick={loadModel}
            >
              Load {selectedModel.name}
              <span className="font-mono font-bold">→</span>
            </button>
            <div className="text-[10px] font-mono text-[#807a6f] tracking-wider">No data leaves your device</div>
          </div>
        </div>
      )}

      {/* STAGE 2: Progress Loading */}
      {modelLoading && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-[rgba(235,229,216,0.1)] bg-[#181816] rounded-xl p-8 flex flex-col items-center text-center shadow-2xl">
            <div
              className="h-9 w-9 overflow-hidden opacity-90 [clip-path:polygon(50%_4%,100%_100%,0%_100%)] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.3),transparent_28%),linear-gradient(180deg,#ffb84d_0%,#ff7a5c_42%,#b67be8_100%)] drop-shadow-[0_0_18px_rgba(255,184,77,0.18)] mb-7 animate-spin [animation-duration:8s]"
            />
            <div className="text-[10px] font-mono tracking-[0.1em] text-[#807a6f] uppercase mb-1">
              Initializing WebGPU Pipeline
            </div>
            <h3 className="text-xl font-semibold text-[#ebe5d8] mb-6">
              {selectedModel.name.split(" ")[0]}{" "}
              <span className="italic font-serif text-[#ffb84d]">
                {selectedModel.name.split(" ").slice(1).join(" ")}
              </span>
            </h3>
            <div className="w-full bg-[rgba(235,229,216,0.05)] h-1 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-[#ffb84d] h-full transition-all duration-300" 
                style={{ width: `${modelLoadingProgress}%` }} 
              />
            </div>
            <div className="w-full flex justify-between text-[11px] font-mono text-[#807a6f]">
              <span className="truncate max-w-[80%]">{modelLoadingStatusText}</span>
              <span className="text-[#ffb84d] font-bold">{Math.round(modelLoadingProgress)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: Active Chat Playground */}
      {modelReady && (
        <div className="flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full border-x border-[rgba(235,229,216,0.1)] bg-[#121211]">
          {/* Header Bar */}
          <div className="flex-shrink-0 flex items-center justify-between border-b border-[rgba(235,229,216,0.1)] px-6 py-4 bg-[#121211] z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={clearChatAndExit} 
                className="p-1.5 hover:bg-[#181816] rounded border border-transparent hover:border-[rgba(235,229,216,0.1)] text-[#807a6f] hover:text-[#ebe5d8] transition-all cursor-pointer"
                title="Back to Selection"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-md font-bold text-[#ebe5d8] tracking-tight">
                The <span className="font-serif italic text-[#ffb84d]">playground.</span>
              </h2>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 bg-[#181816] border border-[rgba(235,229,216,0.1)] text-[#b8b2a6] rounded-md">
                <span className="text-[#807a6f] lowercase">model</span> {selectedModel.name}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 bg-[#181816] border border-[rgba(235,229,216,0.1)] text-[#b8b2a6] rounded-md">
                <span className="text-[#807a6f] lowercase">size</span> {selectedModel.size || '—'}
              </span>
            </div>
          </div>

          {/* Chat Window Panel */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#0f0f0e]">
            {/* Top Bar of the Chat Window */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-[#181816] border-b border-[rgba(235,229,216,0.1)] text-xs text-[#807a6f] font-mono">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-1 tracking-wider uppercase text-[10px]">Bonsai WebGPU</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#ebe5d8] font-bold">{generating || activeStreamingText ? (tps !== null ? tps.toFixed(1) : '···') : '—'}</span>
                <span className="text-[10px]">Tokens / sec</span>
              </div>
            </div>

            {/* Scrollable messages container */}
            <div 
              ref={messagesRef}
              onScroll={handleMessagesScroll}
              className="flex-1 overflow-y-auto px-6 py-8 space-y-6"
            >
              {error && (
                <div className="max-w-3xl mx-auto bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 flex items-start gap-3 text-rose-300 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Inference Error</p>
                    <p className="text-xs leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {messages.length === 0 && !activeStreamingText && !generating ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12 text-center h-full">
                  <div className="h-9 w-9 overflow-hidden opacity-90 [clip-path:polygon(50%_4%,100%_100%,0%_100%)] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.3),transparent_28%),linear-gradient(180deg,#ffb84d_0%,#ff7a5c_42%,#b67be8_100%)] drop-shadow-[0_0_18px_rgba(255,184,77,0.18)]" />
                  <div className="space-y-1">
                    <div className="text-3xl tracking-tight text-[#ebe5d8] font-serif italic">
                      How can I help you?
                    </div>
                    <div className="text-[10px] font-mono tracking-[0.2em] text-[#807a6f] uppercase">
                      Talk to a 1-bit model
                    </div>
                  </div>
                  <div className="grid w-full max-w-[540px] grid-cols-1 gap-2.5 sm:grid-cols-2 mt-4">
                    {suggestedPrompts.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="rounded-md border border-[rgba(235,229,216,0.1)] bg-[#181816] px-4 py-3 text-left text-xs leading-normal text-[#b8b2a6] hover:border-[rgba(235,229,216,0.25)] hover:bg-[rgba(235,229,216,0.015)] hover:text-[#ebe5d8] transition-all duration-200 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col space-y-1 ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <span className={`text-[10px] font-mono tracking-wider uppercase ${
                        msg.role === 'user' ? 'text-[#807a6f]' : 'text-[#ffb84d]'
                      }`}>
                        {msg.role === 'user' ? 'You' : selectedModel.name}
                      </span>
                      <div className={`px-4 py-2.5 text-sm rounded-xl max-w-[85%] whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-[#ffb84d]/10 border border-[#ffb84d]/25 text-[#ebe5d8] rounded-tr-none shadow-md'
                          : 'bg-[#181816]/60 border border-[rgba(235,229,216,0.1)] text-[#ebe5d8] rounded-tl-none shadow-md'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Active Stream Bubble */}
                  {activeStreamingText && (
                    <div className="flex flex-col space-y-1 items-start">
                      <span className="text-[10px] font-mono text-[#ffb84d] tracking-wider uppercase">
                        {selectedModel.name}
                      </span>
                      <div className="bg-[#181816]/60 border border-[rgba(235,229,216,0.1)] text-[#ebe5d8] rounded-xl rounded-tl-none px-4 py-2.5 text-sm max-w-[85%] whitespace-pre-wrap relative shadow-md">
                        {activeStreamingText}
                        <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#ffb84d] animate-pulse align-middle" />
                      </div>
                    </div>
                  )}

                  {/* Generating thinking state */}
                  {generating && !activeStreamingText && (
                    <div className="flex flex-col space-y-1 items-start">
                      <span className="text-[10px] font-mono text-[#ffb84d] tracking-wider uppercase">
                        {selectedModel.name}
                      </span>
                      <div className="bg-[#181816]/60 border border-[rgba(235,229,216,0.1)] rounded-xl rounded-tl-none px-4 py-2.5 text-xs text-[#807a6f] flex items-center gap-2 shadow-md">
                        <span>thinking</span>
                        <span className="flex gap-1 font-mono font-bold text-[#ffb84d]/60">
                          <span className="animate-bit-0">1</span>
                          <span className="animate-bit-1">0</span>
                          <span className="animate-bit-2">1</span>
                          <span className="animate-bit-3">1</span>
                          <span className="animate-bit-4">0</span>
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Composer Input Area */}
            <div className="flex-shrink-0 border-t border-[rgba(235,229,216,0.1)] bg-[#181816] p-4 flex items-center gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the 1-bit model anything…"
                rows={1}
                className="flex-1 bg-transparent border-0 outline-none focus:ring-0 p-1 text-sm text-[#ebe5d8] resize-none max-h-24 min-h-[32px] leading-relaxed placeholder-[#807a6f]"
              />
              
              {generating || activeStreamingText ? (
                <button 
                  onClick={abortGeneration} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/10 border border-rose-500/25 hover:bg-rose-600/20 text-rose-400 text-xs font-mono font-semibold rounded transition-all cursor-pointer"
                >
                  Stop
                  <span className="text-rose-400">
                    <StopIcon />
                  </span>
                </button>
              ) : !input.trim() ? (
                <button 
                  onClick={clearChat} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121211] border border-[rgba(235,229,216,0.1)] hover:bg-[#1f1f1d] text-[#b8b2a6] text-xs font-mono font-semibold rounded transition-all cursor-pointer"
                >
                  Reset
                  <span className="text-[#807a6f]">
                    <ResetIcon />
                  </span>
                </button>
              ) : (
                <button 
                  onClick={handleSend} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffb84d]/10 border border-[#ffb84d]/25 hover:bg-[#ffb84d]/20 text-[#ffb84d] text-xs font-mono font-semibold rounded transition-all cursor-pointer"
                >
                  Send
                  <span className="text-[#ffb84d]">
                    <SendIcon />
                  </span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
