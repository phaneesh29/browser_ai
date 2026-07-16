import { useEffect, useState } from 'react'
import { useAppStore } from '../stores/appStore'

export default function Home() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)
  const { webGpuSupported, gpuName } = useAppStore()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setPageTitle('Home')
  }, [setPageTitle])

  const copyCode = () => {
    navigator.clipboard.writeText(`import { BrowserAI } from '@browser-ai/core';

// Initialize WebGPU connection
const model = await BrowserAI.load('llama-3-8b');

// Complete private client-side inference
const response = await model.generate('Define client-side intelligence.');
console.log(response);`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-24">
      {/* 1. Hero Section */}
      <section className="text-center pt-8 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Enterprise Private Inference
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-slate-900">
          Client-Side AI Engines <br />
          <span className="text-blue-600">Powered by WebGPU.</span>
        </h1>

        <p className="mt-6 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Deploy and run large language models directly in your browser. Zero host costs, complete data privacy, and native client hardware performance.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#diagnostics"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Check Device Compatibility
          </a>
          <a
            href="#integration"
            className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            View Developer SDK
          </a>
        </div>
      </section>

      {/* 2. Core Corporate Value Props */}
      <section id="features" className="max-w-5xl mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Enterprise Core Capabilities</h2>
          <p className="text-slate-500 mt-2">Scale client intelligence securely without API costs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-2xl font-bold mb-4">01</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Absolute Compliance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No server traffic. Sensitive documents and user interactions are processed inside the client web sandbox, complying with strict regulatory rules.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-2xl font-bold mb-4">02</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Eliminated Server Overhead</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Offset cloud VRAM GPU hosts. By running foundation models directly on the client's WebGPU processor, you scale to millions of users at zero incremental server fees.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-2xl font-bold mb-4">03</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Offline Capability</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Once downloaded to the secure client browser cache, models run perfectly without internet access. Zero network latency, zero connectivity constraints.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Real Device Compatibility Section */}
      <section id="diagnostics" className="max-w-5xl mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Device Hardware Verification</h2>
          <p className="text-slate-500 mt-2">Checking local WebGPU capability for your client browser.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Diagnostic Status Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Status & Drivers</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600 text-sm">WebGPU Support</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  webGpuSupported ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {webGpuSupported ? 'Active' : 'Not Supported'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600 text-sm">GPU Adapter Name</span>
                <span className="text-xs font-semibold text-slate-900 max-w-[180px] truncate" title={gpuName}>
                  {gpuName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 text-sm">Shader Engine Compatibility</span>
                <span className="text-xs font-semibold text-slate-900">WGSL v1.0 Standard</span>
              </div>
            </div>
          </div>

          {/* Model Profile Specs */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Recommended Specifications</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Quantization Method</span>
                <span className="text-xs font-mono font-semibold text-slate-900">4-bit (INT4 quantized)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Recommended System RAM</span>
                <span className="text-xs font-mono font-semibold text-slate-900">8 GB minimum</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 text-sm">VRAM Allocation</span>
                <span className="text-xs font-mono font-semibold text-slate-900">~1.5 GB for 8B models</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Real Code Implementation Block */}
      <section id="integration" className="max-w-4xl mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Developer Integration</h2>
          <p className="text-slate-500 mt-2">Initialize models on target clients with standard JavaScript.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed shadow-sm relative group">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            </div>
            <button
              onClick={copyCode}
              className="text-[10px] text-slate-500 hover:text-white uppercase tracking-wider font-semibold bg-slate-800/40 px-2.5 py-1 rounded transition-colors"
            >
              {copied ? 'Copied ✓' : 'Copy Code'}
            </button>
          </div>
          <pre className="overflow-x-auto text-left">
{`import { BrowserAI } from '@browser-ai/core';

// Initialize WebGPU connection
const model = await BrowserAI.load('llama-3-8b');

// Complete private client-side inference
const response = await model.generate('Define client-side intelligence.');
console.log(response);`}
          </pre>
        </div>
      </section>

      {/* 5. Corporate Footer */}
      <footer className="border-t border-slate-200 pt-8 max-w-5xl mx-auto px-4 text-center text-xs text-slate-500">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#features" className="hover:text-slate-900 transition-colors">Product</a>
          <a href="#diagnostics" className="hover:text-slate-900 transition-colors">Diagnostics</a>
          <a href="#integration" className="hover:text-slate-900 transition-colors">Docs</a>
        </div>
        <p>© 2026 BrowserAI Technologies, Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}
