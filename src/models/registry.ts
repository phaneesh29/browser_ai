import type { ModelConfig } from '../types'

export const MODELS: ModelConfig[] = [
  {
    id: "llama-3.2-1b",
    name: "Llama 3.2 1B",
    repo: "onnx-community/Llama-3.2-1B-Instruct",
    dtype: "q4",
    params: "1.2B",
    size: "620 MB",
    blurb: "Meta's highly polished lightweight model. Great instruction following.",
  },
  {
    id: "phi-4-mini",
    name: "Phi-4 Mini 3.8B",
    repo: "onnx-community/Phi-4-mini-instruct-ONNX-GQA",
    dtype: "q4",
    params: "3.8B",
    size: "2.2 GB",
    blurb: "Microsoft's 2026 state-of-the-art small model. Superb logic and scientific reasoning.",
  },
  {
    id: "bonsai-1.7b",
    name: "Bonsai 1.7B",
    repo: "onnx-community/Bonsai-1.7B-ONNX",
    dtype: "q1",
    params: "1.7B",
    size: "290 MB",
    blurb: "Pocket-class. Built for wearables and always-on agents.",
  },
  {
    id: "gemma-4-e2b",
    name: "Gemma 4 Edge 2.3B",
    repo: "onnx-community/gemma-4-E2B-it-ONNX",
    dtype: "q4",
    params: "2.3B Effective (5.1B Total)",
    size: "1.5 GB",
    blurb: "Google's 2026 multimodal edge model. Features PLE architecture and 128K context window.",
  },
]
