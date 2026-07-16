import { pipeline, env, TextStreamer } from '@huggingface/transformers'
import type { WorkerAction } from '../types'

// Configure environment for browser
env.allowLocalModels = false

let generator: any = null
let currentModelId: string | null = null
let abortRequested = false

self.addEventListener('message', async (event: MessageEvent<WorkerAction>) => {
  const action = event.data

  if (action.type === 'load') {
    try {
      const { model } = action
      if (generator && currentModelId === model.id) {
        self.postMessage({ type: 'ready', message: `Model ${model.name} is already loaded.` })
        return
      }

      self.postMessage({ type: 'status', message: `Initializing ${model.name}...` })

      generator = await pipeline('text-generation', model.repo, {
        device: 'webgpu',
        dtype: (model.dtype || 'q4') as any,
        progress_callback: (progressData: any) => {
          if (progressData.status === 'progress') {
            self.postMessage({
              type: 'progress',
              data: {
                file: progressData.file,
                progress: progressData.progress,
                loaded: progressData.loaded,
                total: progressData.total,
              },
            })
          }
        },
      })

      currentModelId = model.id
      self.postMessage({ type: 'ready', message: `Model ${model.name} loaded and ready.` })
    } catch (error: any) {
      self.postMessage({ type: 'error', message: `Failed to load model: ${error.message || error}` })
    }
  } else if (action.type === 'generate') {
    if (!generator) {
      self.postMessage({ type: 'error', message: 'No model is currently loaded.' })
      return
    }

    abortRequested = false
    const { messages, maxTokens = 512, temperature = 0.7 } = action

    try {
      let startTime = performance.now()
      let tokenCount = 0

      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (text: string) => {
          if (abortRequested) {
            throw new Error('ABORT_GENERATION')
          }
          tokenCount++
          const elapsed = (performance.now() - startTime) / 1000
          const tps = elapsed > 0 ? tokenCount / elapsed : 0
          self.postMessage({ type: 'chunk', data: text, tps })
        },
      })

      const response = await generator(messages, {
        max_new_tokens: maxTokens,
        temperature: temperature,
        streamer: streamer,
      })

      self.postMessage({ type: 'result', data: response })
    } catch (error: any) {
      if (error.message === 'ABORT_GENERATION') {
        self.postMessage({ type: 'status', message: 'Generation cancelled.' })
      } else {
        self.postMessage({ type: 'error', message: `Generation failed: ${error.message || error}` })
      }
    }
  } else if (action.type === 'abort') {
    abortRequested = true
  }
})
