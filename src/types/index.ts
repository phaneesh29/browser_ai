export interface ModelConfig {
  id: string
  name: string
  repo: string
  dtype: string
  params?: string
  size?: string
  blurb?: string
}

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type WorkerActionType = 'load' | 'generate' | 'abort'

export interface WorkerLoadPayload {
  type: 'load'
  model: ModelConfig
}

export interface WorkerGeneratePayload {
  type: 'generate'
  messages: Message[]
  maxTokens?: number
  temperature?: number
}

export interface WorkerAbortPayload {
  type: 'abort'
}

export type WorkerAction = WorkerLoadPayload | WorkerGeneratePayload | WorkerAbortPayload

export type WorkerMessageType = 'status' | 'progress' | 'ready' | 'chunk' | 'result' | 'error'

export interface WorkerMessage {
  type: WorkerMessageType
  data?: any
  message?: string
  tps?: number
}
