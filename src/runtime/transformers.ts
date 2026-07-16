import type { ModelConfig, Message, WorkerMessage } from '../types'

class LlmRuntimeManager {
  private worker: Worker | null = null
  private onReadyResolver: (() => void) | null = null
  private onReadyRejecter: ((err: Error) => void) | null = null
  private onChunkCallback: ((text: string, tps?: number) => void) | null = null
  private onResultResolver: ((result: any) => void) | null = null
  private onResultRejecter: ((err: Error) => void) | null = null
  
  private onProgressCallback: ((data: any) => void) | null = null
  private onStatusCallback: ((msg: string) => void) | null = null

  private getWorker() {
    if (!this.worker) {
      this.worker = new Worker(
        new URL('../worker/llm.worker.ts', import.meta.url),
        { type: 'module' }
      )
      this.worker.addEventListener('message', this.handleWorkerMessage.bind(this))
    }
    return this.worker
  }

  private handleWorkerMessage(event: MessageEvent<WorkerMessage>) {
    const { type, data, message, tps } = event.data

    switch (type) {
      case 'status':
        if (this.onStatusCallback) {
          this.onStatusCallback(message || '')
        }
        break
      case 'progress':
        if (this.onProgressCallback) {
          this.onProgressCallback(data)
        }
        break
      case 'ready':
        if (this.onReadyResolver) {
          this.onReadyResolver()
          this.onReadyResolver = null
          this.onReadyRejecter = null
        }
        break
      case 'chunk':
        if (this.onChunkCallback) {
          this.onChunkCallback(data, tps)
        }
        break
      case 'result':
        if (this.onResultResolver) {
          this.onResultResolver(data)
          this.onResultResolver = null
          this.onResultRejecter = null
        }
        break
      case 'error':
        const err = new Error(message || 'Unknown worker error')
        if (this.onReadyRejecter) {
          this.onReadyRejecter(err)
          this.onReadyResolver = null
          this.onReadyRejecter = null
        }
        if (this.onResultRejecter) {
          this.onResultRejecter(err)
          this.onResultResolver = null
          this.onResultRejecter = null
        }
        break
    }
  }

  public loadModel(
    model: ModelConfig,
    onStatus: (msg: string) => void,
    onProgress: (data: any) => void
  ): Promise<void> {
    this.onStatusCallback = onStatus
    this.onProgressCallback = onProgress

    return new Promise<void>((resolve, reject) => {
      this.onReadyResolver = resolve
      this.onReadyRejecter = reject
      this.getWorker().postMessage({ type: 'load', model })
    })
  }

  public generate(
    messages: Message[],
    onChunk: (text: string, tps?: number) => void,
    maxTokens = 1024,
    temperature = 0.7,
    doSample = false
  ): Promise<any> {
    this.onChunkCallback = onChunk

    return new Promise<any>((resolve, reject) => {
      this.onResultResolver = resolve
      this.onResultRejecter = reject
      this.getWorker().postMessage({
        type: 'generate',
        messages,
        maxTokens,
        temperature,
        doSample,
      })
    })
  }

  public abort(): void {
    this.getWorker().postMessage({ type: 'abort' })
  }
}

export const llmRuntime = new LlmRuntimeManager()
