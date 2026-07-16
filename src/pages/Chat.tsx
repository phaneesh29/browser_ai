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
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="8" y1="12" x2="8" y2="4" />
      <polyline points="4 8 8 4 12 8" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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


function CopyIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.5" />
      <path d="M3.5 10.5V5a1.5 1.5 0 0 1 1.5-1.5h5.5" />
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

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click outside listener for custom dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    <div className="flex flex-col h-screen bg-[#08090a] text-[#f1f5f9] overflow-hidden font-sans dark-playground">
      
      {/* STAGE 1: Loading Progress */}
      {modelLoading && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-[rgba(255,255,255,0.06)] bg-[#111317] rounded-xl p-8 flex flex-col items-center text-center shadow-2xl">
            
            {/* Custom spinner instead of Prism logo */}
            <div className="relative w-10 h-10 mb-7 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-[rgba(6,182,212,0.1)] rounded-full animate-spin [animation-duration:1.5s]" />
              <div className="absolute w-10 h-10 border-t-2 border-l-2 border-[#06b6d4] rounded-full animate-spin [animation-duration:0.8s]" />
            </div>

            <div className="text-[10px] font-mono tracking-[0.1em] text-[#64748b] uppercase mb-1">
              Initializing WebGPU Pipeline
            </div>
            <h3 className="text-xl font-semibold text-[#f1f5f9] mb-6">
              {selectedModel.name.split(" ")[0]}{" "}
              <span className="italic font-serif text-[#06b6d4]">
                {selectedModel.name.split(" ").slice(1).join(" ")}
              </span>
            </h3>
            <div className="w-full bg-[rgba(255,255,255,0.03)] h-1 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-[#06b6d4] h-full transition-all duration-300" 
                style={{ width: `${modelLoadingProgress}%` }} 
              />
            </div>
            <div className="w-full flex justify-between text-[11px] font-mono text-[#64748b]">
              <span className="truncate max-w-[80%]">{modelLoadingStatusText}</span>
              <span className="text-[#06b6d4] font-bold">{Math.round(modelLoadingProgress)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: Active Chat Playground */}
      {modelReady && (
        <div className="flex-1 flex flex-col overflow-hidden w-full bg-[#08090a]">
          {/* Header Bar */}
          <div className="flex-shrink-0 flex items-center justify-between border-b border-[rgba(255,255,255,0.03)] px-6 py-3 bg-[#08090a] z-10">
            <div className="flex items-center gap-2">
              <Link 
                to="/" 
                className="p-1.5 hover:bg-[#111317] rounded text-[#64748b] hover:text-[#f1f5f9] transition-all cursor-pointer flex items-center justify-center mr-1"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              
              {/* Dropdown for Model Selection on the Left */}
              <div className="relative flex items-center" ref={dropdownRef}>
                <button
                  id="chat-model-dropdown-trigger"
                  onClick={() => !generating && setDropdownOpen(!dropdownOpen)}
                  disabled={generating}
                  className="text-md font-bold bg-transparent text-[#f1f5f9] hover:bg-[#111317] px-2 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer focus:outline-none disabled:cursor-not-allowed select-none"
                >
                  {selectedModel.name}
                  <span className="text-[#64748b]">
                    <svg className={`w-3.5 h-3.5 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-[#111317] border border-[rgba(255,255,255,0.06)] rounded-xl py-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 text-[9px] font-mono font-bold tracking-wider text-[#64748b] uppercase border-b border-[rgba(255,255,255,0.03)] mb-1">
                      Available Models
                    </div>
                    {models.map((m) => (
                      <button
                        key={m.id}
                        id={`chat-model-option-${m.id}`}
                        onClick={() => {
                          setSelectedModel(m)
                          useChatStore.setState({ modelReady: false })
                          setDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          selectedModel.id === m.id
                            ? 'bg-[#06b6d4]/10 text-[#06b6d4] font-semibold'
                            : 'text-[#f1f5f9] hover:bg-[rgba(255,255,255,0.03)]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-[13px]">{m.name}</span>
                          <span className="text-[10px] text-[#64748b] font-mono mt-0.5">{m.size} · Local GPU</span>
                        </div>
                        {selectedModel.id === m.id && (
                          <span className="text-[#06b6d4] font-bold text-sm">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Right: Tokens per second indicator & Clear Conversation */}
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button 
                  onClick={clearChat}
                  className="p-1.5 hover:bg-[#111317] rounded border border-transparent hover:border-[rgba(255,255,255,0.06)] text-[#64748b] hover:text-[#f1f5f9] transition-all cursor-pointer flex items-center justify-center"
                  title="Clear conversation"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              {(generating || activeStreamingText) && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/25 animate-pulse">
                  {tps !== null ? `${tps.toFixed(1)} tok/s` : '···'}
                </span>
              )}
              <span className="text-[10px] font-mono text-[#64748b] tracking-wide">WebGPU Sandbox</span>
            </div>
          </div>

          {/* Chat Window Panel */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#08090a]">
            
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
                <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center h-full max-w-2xl mx-auto w-full">
                  <div className="space-y-1.5 mb-2">
                    <div className="text-3xl tracking-tight text-[#f1f5f9] font-bold">
                      How can I help you?
                    </div>
                  </div>
                  <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 mt-4">
                    {suggestedPrompts.map((s, idx) => (
                      <button
                        key={s}
                        id={`chat-suggested-prompt-${idx}`}
                        onClick={() => sendMessage(s)}
                        className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[#111317] px-4 py-3 text-left text-xs leading-normal text-[#94a3b8] hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.015)] hover:text-[#f1f5f9] transition-all duration-200 cursor-pointer"
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
                        <div className="bg-[#111317] border border-[rgba(255,255,255,0.06)] text-[#f1f5f9] rounded-full px-4.5 py-2 text-sm whitespace-pre-wrap max-w-[85%] shadow-md">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="text-sm text-[#f1f5f9] leading-relaxed">
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
                          <div className="flex gap-2.5 text-[#64748b] mt-3 pl-1">
                            <button 
                              onClick={() => navigator.clipboard.writeText(msg.content)} 
                              className="p-1 hover:text-[#f1f5f9] transition-colors cursor-pointer" 
                              title="Copy response"
                            >
                              <CopyIcon />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Active Stream Bubble */}
                  {activeStreamingText && (
                    <div className="flex flex-col space-y-2 items-start w-full">
                      <div className="w-full">
                        <div className="text-sm text-[#f1f5f9] leading-relaxed relative">
                          <Streamdown
                            className="streamdown-content"
                            plugins={STREAMDOWN_PLUGINS}
                            controls={false}
                            parseIncompleteMarkdown
                          >
                            {activeStreamingText}
                          </Streamdown>
                          <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#06b6d4] animate-pulse align-middle" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generating thinking state */}
                  {generating && !activeStreamingText && (
                    <div className="flex flex-col space-y-2 items-start w-full">
                      <div className="text-xs text-[#64748b] flex items-center gap-2">
                        <span>thinking</span>
                        <span className="flex gap-1 font-mono font-bold text-[#06b6d4]/60">
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
            <div className="flex-shrink-0 bg-[#08090a] px-4 pb-6 pt-2">
              <div className="max-w-2xl mx-auto w-full bg-[#111317] border border-[rgba(255,255,255,0.06)] rounded-full pl-6 pr-2 py-2 flex items-center gap-3 shadow-md focus-within:border-[#06b6d4]/50 focus-within:ring-2 focus-within:ring-[#06b6d4]/10 transition-all">
                
                {/* Input Textarea */}
                <textarea
                  ref={inputRef}
                  value={input}
                  id="chat-input-textarea"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything"
                  rows={1}
                  className="flex-1 bg-transparent border-0 outline-none focus:ring-0 p-1 text-sm text-[#f1f5f9] resize-none max-h-24 min-h-[36px] py-2 placeholder-[#64748b] leading-relaxed"
                />
                
                {/* Send / Stop button */}
                {generating || activeStreamingText ? (
                  <button 
                    onClick={abortGeneration} 
                    id="chat-abort-generation-btn"
                    className="w-8 h-8 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-600/20 text-rose-400 rounded-full transition-all cursor-pointer flex items-center justify-center flex-shrink-0 shadow"
                    title="Stop generation"
                  >
                    <StopIcon />
                  </button>
                ) : (
                  <button 
                    onClick={handleSend} 
                    id="chat-send-message-btn"
                    disabled={!input.trim()}
                    className={`w-8 h-8 rounded-full transition-all flex items-center justify-center flex-shrink-0 shadow ${
                      input.trim() 
                        ? 'bg-[#06b6d4] hover:bg-[#0891b2] text-[#08090a] cursor-pointer' 
                        : 'bg-[rgba(255,255,255,0.03)] text-[#64748b] cursor-not-allowed'
                    }`}
                    title="Send message"
                  >
                    <SendIcon />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-center text-slate-500 mt-2.5">
                ZeroLocal can make mistakes. Runs locally in your browser sandbox.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
