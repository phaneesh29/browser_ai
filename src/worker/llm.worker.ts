import { 
  pipeline, 
  env, 
  TextStreamer, 
  DynamicCache, 
  InterruptableStoppingCriteria 
} from '@huggingface/transformers'
import type { WorkerAction } from '../types'

// Configure environment for browser
env.useBrowserCache = true
env.allowLocalModels = false

let generator: any = null
let currentModelId: string | null = null

const stopping_criteria = new InterruptableStoppingCriteria()
let past_key_values_cache: any = null

function disposePastKeyValues() {
  if (past_key_values_cache) {
    try {
      past_key_values_cache.dispose()
    } catch {
      // Ignore dispose failures
    }
    past_key_values_cache = null
  }
}

self.addEventListener('message', async (event: MessageEvent<WorkerAction>) => {
  const action = event.data

  if (action.type === 'load') {
    try {
      const { model } = action
      if (generator && currentModelId === model.id) {
        self.postMessage({ type: 'ready', message: `Model ${model.name} is already loaded.` })
        return
      }

      // Dispose old cache if changing models
      disposePastKeyValues()

      self.postMessage({ type: 'status', message: `Downloading ${model.name}...` })

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

      self.postMessage({ type: 'status', message: 'Compiling WebGPU shaders & optimizing model...' })

      // Pre-compile shaders with a warm-up token generation
      const warmupInputs = generator.tokenizer("a")
      await generator.model.generate({ ...warmupInputs, max_new_tokens: 1 })

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

    stopping_criteria.reset()
    const { messages, maxTokens = 1024, temperature = 0.7, doSample = false } = action

    // Limit context to the last 5 messages
    const contextMessages = messages.slice(-5)

    // If we have sliced off older messages, the attention prefix shifts,
    // so we must reset the KV cache to prevent mismatch crashes.
    if (messages.length > 5) {
      disposePastKeyValues()
    }

    let startTime: number | null = null
    let tokenCount = 0
    let tps = 0

    // Initialize or reuse DynamicCache for KV caching
    if (!past_key_values_cache) {
      past_key_values_cache = new DynamicCache()
    }

    try {
      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (text: string) => {
          self.postMessage({ type: 'chunk', data: text, tps })
        },
        token_callback_function: () => {
          if (startTime === null) {
            startTime = performance.now()
          }
          tokenCount++
          if (tokenCount > 1 && startTime !== null) {
            const elapsed = (performance.now() - startTime) / 1000
            tps = elapsed > 0 ? tokenCount / elapsed : 0
          }
        }
      })

      self.postMessage({ type: 'status', message: 'Generating response...' })

      const response = await generator(contextMessages, {
        max_new_tokens: maxTokens,
        temperature: doSample ? temperature : undefined,
        do_sample: doSample,
        streamer: streamer,
        stopping_criteria: stopping_criteria,
        past_key_values: past_key_values_cache,
      })

      self.postMessage({ type: 'result', data: response })
    } catch (error: any) {
      self.postMessage({ type: 'error', message: `Generation failed: ${error.message || error}` })
    }
  } else if (action.type === 'abort') {
    stopping_criteria.interrupt()
    self.postMessage({ type: 'status', message: 'Generation interrupted.' })
  } else if (action.type === 'reset') {
    disposePastKeyValues()
    stopping_criteria.reset()
    self.postMessage({ type: 'status', message: 'Cache reset.' })
  }
})
