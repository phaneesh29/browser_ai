import { create } from 'zustand'
import type { Message, ModelConfig } from '../types'
import { MODELS } from '../models/registry'
import { llmRuntime } from '../runtime/transformers'

interface ChatState {
  messages: Message[]
  models: ModelConfig[]
  selectedModel: ModelConfig
  modelLoading: boolean
  modelLoadingProgress: number // 0-100
  modelLoadingStatusText: string
  modelReady: boolean
  generating: boolean
  error: string | null
  activeStreamingText: string

  // Actions
  setSelectedModel: (model: ModelConfig) => void
  loadModel: () => Promise<void>
  sendMessage: (content: string) => Promise<void>
  abortGeneration: () => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  models: MODELS,
  selectedModel: MODELS[0],
  modelLoading: false,
  modelLoadingProgress: 0,
  modelLoadingStatusText: '',
  modelReady: false,
  generating: false,
  error: null,
  activeStreamingText: '',

  setSelectedModel: (model) => {
    const currentSelected = get().selectedModel
    if (currentSelected.id !== model.id) {
      set({ 
        selectedModel: model, 
        modelReady: false,
        error: null,
        modelLoadingProgress: 0,
        modelLoadingStatusText: ''
      })
    }
  },

  loadModel: async () => {
    const { selectedModel, modelLoading, modelReady } = get()
    if (modelLoading || modelReady) return

    set({ 
      modelLoading: true, 
      error: null, 
      modelLoadingProgress: 0, 
      modelLoadingStatusText: 'Initializing model...' 
    })

    try {
      const fileProgresses: Record<string, number> = {}

      await llmRuntime.loadModel(
        selectedModel,
        (statusText) => {
          set({ modelLoadingStatusText: statusText })
        },
        (progressData) => {
          if (progressData.file) {
            fileProgresses[progressData.file] = progressData.progress
            
            const files = Object.values(fileProgresses)
            const avgProgress = files.reduce((a, b) => a + b, 0) / files.length
            
            // Format short name of downloading file
            const fileName = progressData.file.split('/').pop() || 'file'
            set({ 
              modelLoadingProgress: Math.round(avgProgress),
              modelLoadingStatusText: `Fetching: ${fileName} (${Math.round(progressData.progress)}%)`
            })
          }
        }
      )

      set({ 
        modelLoading: false, 
        modelReady: true, 
        modelLoadingProgress: 100, 
        modelLoadingStatusText: 'Loaded' 
      })
    } catch (err: any) {
      set({ 
        modelLoading: false, 
        modelReady: false, 
        error: err.message || 'Failed to load model.' 
      })
    }
  },

  sendMessage: async (content) => {
    const { messages, modelReady, generating } = get()
    if (generating || !content.trim()) return

    // Ensure model is loaded
    if (!modelReady) {
      await get().loadModel()
      if (!get().modelReady) return
    }

    const userMessage: Message = { role: 'user', content }
    const updatedMessages = [...messages, userMessage]
    
    set({
      messages: updatedMessages,
      generating: true,
      error: null,
      activeStreamingText: ''
    })

    try {
      await llmRuntime.generate(
        updatedMessages,
        (chunk) => {
          set((state) => ({
            activeStreamingText: state.activeStreamingText + chunk
          }))
        }
      )

      const assistantMessage: Message = {
        role: 'assistant',
        content: get().activeStreamingText
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        generating: false,
        activeStreamingText: ''
      }))
    } catch (err: any) {
      if (err.message === 'ABORT_GENERATION' || err.message?.includes('ABORT_GENERATION')) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: get().activeStreamingText
        }
        set((state) => ({
          messages: [...state.messages, assistantMessage],
          generating: false,
          activeStreamingText: ''
        }))
      } else {
        set({
          generating: false,
          error: err.message || 'An error occurred during generation.'
        })
      }
    }
  },

  abortGeneration: () => {
    llmRuntime.abort()
  },

  clearChat: () => {
    set({ messages: [], activeStreamingText: '', error: null })
  }
}))
