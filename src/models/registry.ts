import type { ModelConfig } from '../types'

export const MODELS: ModelConfig[] = [
  {
    id: "bonsai-1.7b",
    name: "Bonsai 1.7B",
    repo: "onnx-community/Bonsai-1.7B-ONNX",
    dtype: "q1",
    params: "1.7B",
    size: "290 MB",
    blurb: "Pocket-class. Built for wearables and always-on agents.",
  },
]
