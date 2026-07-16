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
  {
    id: "bonsai-4b",
    name: "Bonsai 4B",
    repo: "onnx-community/Bonsai-4B-ONNX",
    dtype: "q1",
    params: "4B",
    size: "584 MB",
    blurb: "The sweet spot. Strong reasoning at on-device latency.",
    comingSoon: true,
  },
  {
    id: "bonsai-8b",
    name: "Bonsai 8B",
    repo: "onnx-community/Bonsai-8B-ONNX",
    dtype: "q1",
    params: "8B",
    size: "1.2 GB",
    blurb: "Datacenter-grade reasoning, in your browser tab.",
    comingSoon: true,
  },
]
