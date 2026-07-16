import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { useChatStore } from '../stores/chat'
import { useAppStore } from '../stores/appStore'
import { Streamdown } from 'streamdown'
import { code } from '@streamdown/code'
import { mermaid } from '@streamdown/mermaid'
import { createMathPlugin } from '@streamdown/math'
import { cjk } from '@streamdown/cjk'
import 'streamdown/styles.css'
import 'katex/dist/katex.min.css'
import { 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react'

const math = createMathPlugin({ singleDollarTextMath: true })
const STREAMDOWN_PLUGINS = { code, mermaid, math, cjk }

// Custom SVG Icons
function SendIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="14" />
      <polyline points="7 10 12 5 17 10" />
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

function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="3" x2="8" y2="13" />
      <line x1="3" y1="8" x2="13" y2="8" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2a2.5 2.5 0 0 0-2.5 2.5v3a2.5 2.5 0 0 0 5 0V4.5A2.5 2.5 0 0 0 8 2z" />
      <path d="M3.5 7a4.5 4.5 0 0 0 9 0" />
      <line x1="8" y1="11.5" x2="8" y2="14" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.5" />
      <path d="M3.5 10.5V5a1.5 1.5 0 0 1 1.5-1.5h5.5" />
    </svg>
  )
}

function ThumbsUpIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 4.5V2.25a1.25 1.25 0 0 0-2.5 0v2.25H4.25a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6.5a1.25 1.25 0 0 0 1.25-1.25V5.75A1.25 1.25 0 0 0 10.75 4.5H9.5z" />
      <path d="M5.75 13.25V7.25" />
    </svg>
  )
}

function ThumbsDownIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 11.5v2.25a1.25 1.25 0 0 0 2.5 0V11.5h2.75a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H5.25A1.25 1.25 0 0 0 4 4.75v6A1.25 1.25 0 0 0 5.25 12H6.5z" />
      <path d="M10.25 2.75v6" />
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

  // Automatically start loading model if not loaded/loading
  useEffect(() => {
    if (!modelReady && !modelLoading) {
      loadModel()
    }
  }, [modelReady, modelLoading, loadModel])

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

  const suggestedPrompts = [
    "Who are you?",
    "Write a short poem about AI.",
    "What is the capital of France?",
    "Solve x^2 - 5x + 6 = 0."
  ]

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0e] text-[#ebe5d8] overflow-hidden font-sans dark-playground">
      
      {/* STAGE 1: Loading Progress */}
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

      {/* STAGE 2: Active Chat Playground */}
      {modelReady && (
        <div className="flex-1 flex flex-col overflow-hidden w-full bg-[#0f0f0e]">
          {/* Header Bar */}
          <div className="flex-shrink-0 flex items-center justify-between border-b border-[rgba(235,229,216,0.05)] px-6 py-3 bg-[#0f0f0e] z-10">
            <div className="flex items-center gap-2">
              <Link 
                to="/" 
                className="p-1.5 hover:bg-[#181816] rounded text-[#807a6f] hover:text-[#ebe5d8] transition-all cursor-pointer flex items-center justify-center mr-1"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              
              {/* Dropdown for Model Selection on the Left */}
              <div className="relative flex items-center">
                <select
                  value={selectedModel.id}
                  onChange={(e) => {
                    const m = models.find((x) => x.id === e.target.value)
                    if (m) {
                      setSelectedModel(m)
                      useChatStore.setState({ modelReady: false })
                    }
                  }}
                  disabled={generating}
                  className="text-md font-bold bg-transparent text-[#ebe5d8] border-none outline-none cursor-pointer focus:ring-0 appearance-none pr-6 font-sans"
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#121211] text-xs text-[#ebe5d8]">
                      {m.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#807a6f]">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Top Right: Tokens per second indicator & Clear Conversation */}
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button 
                  onClick={clearChat}
                  className="p-1.5 hover:bg-[#181816] rounded border border-transparent hover:border-[rgba(235,229,216,0.1)] text-[#807a6f] hover:text-[#ebe5d8] transition-all cursor-pointer flex items-center justify-center"
                  title="Clear conversation"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              {(generating || activeStreamingText) && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ffb84d]/10 text-[#ffb84d] border border-[#ffb84d]/25 animate-pulse">
                  {tps !== null ? `${tps.toFixed(1)} tok/s` : '···'}
                </span>
              )}
              <span className="text-[10px] font-mono text-[#807a6f] tracking-wide">WebGPU Sandbox</span>
            </div>
          </div>

          {/* Chat Window Panel */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#0f0f0e]">
            
            {/* Scrollable messages container */}
            <div 
              ref={messagesRef}
              onScroll={handleMessagesScroll}
              className="flex-1 overflow-y-auto px-6 py-8 space-y-6"
            >
              {error && (
                <div className="max-w-2xl mx-auto bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 flex items-start gap-3 text-rose-300 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Inference Error</p>
                    <p className="text-xs leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {messages.length === 0 && !activeStreamingText && !generating ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12 text-center h-full max-w-2xl mx-auto w-full">
                  <div className="h-9 w-9 overflow-hidden opacity-90 [clip-path:polygon(50%_4%,100%_100%,0%_100%)] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.3),transparent_28%),linear-gradient(180deg,#ffb84d_0%,#ff7a5c_42%,#b67be8_100%)] drop-shadow-[0_0_18px_rgba(255,184,77,0.18)]" />
                  <div className="space-y-1">
                    <div className="text-3xl tracking-tight text-[#ebe5d8] font-serif italic">
                      How can I help you?
                    </div>
                    <div className="text-[10px] font-mono tracking-[0.2em] text-[#807a6f] uppercase">
                      Talk to a 1-bit model
                    </div>
                  </div>
                  <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 mt-4">
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
                <div className="max-w-2xl mx-auto space-y-8 w-full flex flex-col">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col space-y-2 ${
                        msg.role === 'user' ? 'items-end' : 'items-start w-full'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <div className="bg-[#181816] border border-[rgba(235,229,216,0.1)] text-[#ebe5d8] rounded-full px-4.5 py-2 text-sm whitespace-pre-wrap max-w-[85%] shadow-md">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="text-sm text-[#ebe5d8] leading-relaxed">
                            <Streamdown
                              className="streamdown-content"
                              plugins={STREAMDOWN_PLUGINS}
                              controls={false}
                              parseIncompleteMarkdown
                            >
                              {msg.content}
                            </Streamdown>
                          </div>
                          {/* Response Actions Row */}
                          <div className="flex gap-2.5 text-[#807a6f] mt-3 pl-1">
                            <button 
                              onClick={() => navigator.clipboard.writeText(msg.content)} 
                              className="p-1 hover:text-[#ebe5d8] transition-colors cursor-pointer" 
                              title="Copy response"
                            >
                              <CopyIcon />
                            </button>
                            <button className="p-1 hover:text-[#ebe5d8] transition-colors cursor-pointer" title="Good response"><ThumbsUpIcon /></button>
                            <button className="p-1 hover:text-[#ebe5d8] transition-colors cursor-pointer" title="Bad response"><ThumbsDownIcon /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Active Stream Bubble */}
                  {activeStreamingText && (
                    <div className="flex flex-col space-y-2 items-start w-full">
                      <div className="w-full">
                        <div className="text-sm text-[#ebe5d8] leading-relaxed relative">
                          <Streamdown
                            className="streamdown-content"
                            plugins={STREAMDOWN_PLUGINS}
                            controls={false}
                            parseIncompleteMarkdown
                          >
                            {activeStreamingText}
                          </Streamdown>
                          <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#ffb84d] animate-pulse align-middle" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generating thinking state */}
                  {generating && !activeStreamingText && (
                    <div className="flex flex-col space-y-2 items-start w-full">
                      <div className="text-xs text-[#807a6f] flex items-center gap-2">
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
            <div className="flex-shrink-0 bg-[#0f0f0e] px-4 pb-6 pt-2">
              <div className="max-w-2xl mx-auto w-full bg-[#181816] border border-[rgba(235,229,216,0.1)] rounded-full px-4 py-2 flex items-center gap-3 shadow-md focus-within:border-[#ffb84d]/50 focus-within:ring-2 focus-within:ring-[#ffb84d]/10 transition-all">
                
                {/* Plus button at left */}
                <button className="p-2 text-[#807a6f] hover:text-[#ebe5d8] hover:bg-[#121211] rounded-full transition-colors cursor-pointer" title="Add attachment">
                  <PlusIcon />
                </button>

                {/* Input Textarea */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything"
                  rows={1}
                  className="flex-1 bg-transparent border-0 outline-none focus:ring-0 p-1 text-sm text-[#ebe5d8] resize-none max-h-24 min-h-[36px] py-2 placeholder-[#807a6f] leading-relaxed"
                />
                
                {/* Voice button */}
                <button className="p-2 text-[#807a6f] hover:text-[#ebe5d8] hover:bg-[#121211] rounded-full transition-colors cursor-pointer" title="Voice input">
                  <MicIcon />
                </button>

                {/* Send / Stop button */}
                {generating || activeStreamingText ? (
                  <button 
                    onClick={abortGeneration} 
                    className="p-2.5 bg-rose-600 hover:bg-rose-500 text-[#0f0f0e] rounded-full transition-all cursor-pointer flex items-center justify-center shadow"
                    title="Stop generation"
                  >
                    <StopIcon />
                  </button>
                ) : (
                  <button 
                    onClick={handleSend} 
                    disabled={!input.trim()}
                    className="p-2.5 bg-[#ffb84d] hover:bg-[#ffa726] disabled:bg-[#ffb84d]/20 disabled:text-[#0f0f0e]/30 text-[#0f0f0e] rounded-full transition-all cursor-pointer flex items-center justify-center shadow"
                    title="Send message"
                  >
                    <SendIcon />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-center text-slate-500 mt-2.5">
                Bonsai can make mistakes. Runs locally in your browser sandbox.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
