import { useEffect, useRef } from 'react'

interface DigitCell {
  x: number
  y: number
  val: string
  nextFlip: number
  phase: number
}

interface ColorWave {
  nx: number
  ny: number
  pos: number
  endPos: number
  direction: number
  speed: number
  color: [number, number, number]
  bandWidth: number
  startedAt: number
  flippedSet: Set<number>
}

export default function DigitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false })
  const cellsRef = useRef<DigitCell[]>([])
  const wavesRef = useRef<ColorWave[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1

    const CELL_W = 16
    const CELL_H = 22

    const PRISM: [number, number, number][] = [
      [255, 122, 92],   // Coral Red
      [255, 184, 77],   // Amber Gold
      [196, 217, 46],   // Lime Green
      [77, 208, 196],   // Turquoise Blue
      [124, 142, 232],  // Royal Slate
      [182, 123, 232],  // Purple Violet
    ]

    const setupCells = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      const cols = Math.ceil(w / CELL_W)
      const rows = Math.ceil(h / CELL_H)
      const cells: DigitCell[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({
            x: c * CELL_W + CELL_W / 2,
            y: r * CELL_H + CELL_H / 2 + 6,
            val: Math.random() > 0.5 ? '1' : '0',
            nextFlip: performance.now() + Math.random() * 8000 + 3000,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }
      cellsRef.current = cells
    }

    const handleResize = () => {
      setupCells()
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.inside = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.inside = false
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }

    setupCells()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    let waveColorIdx = 0
    const spawnWave = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const angle = (Math.random() - 0.5) * (Math.PI / 3) + Math.PI / 2
      const nx = Math.cos(angle)
      const ny = Math.sin(angle)
      const dots = [0, w * nx, h * ny, w * nx + h * ny]
      const minDot = Math.min(...dots)
      const maxDot = Math.max(...dots)
      const direction = Math.random() > 0.5 ? 1 : -1
      const startPos = direction > 0 ? minDot - 200 : maxDot + 200
      const endPos = direction > 0 ? maxDot + 200 : minDot - 200
      const speed = 220 + Math.random() * 140
      const color = PRISM[waveColorIdx % PRISM.length]
      waveColorIdx++
      
      wavesRef.current.push({
        nx,
        ny,
        pos: startPos,
        endPos,
        direction,
        speed,
        color,
        bandWidth: 110,
        startedAt: performance.now(),
        flippedSet: new Set(),
      })
    }

    let nextWaveAt = performance.now() + 2200
    let lastT = performance.now()

    const render = (now: number) => {
      const dt = Math.min(now - lastT, 64)
      lastT = now

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      ctx.font = "11px 'JetBrains Mono', monospace"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'

      if (now > nextWaveAt) {
        spawnWave()
        nextWaveAt = now + 5500 + Math.random() * 3500
      }

      const activeWaves: ColorWave[] = []
      for (const wv of wavesRef.current) {
        wv.pos += wv.direction * wv.speed * (dt / 1000)
        const stillOnscreen =
          (wv.direction > 0 && wv.pos < wv.endPos) ||
          (wv.direction < 0 && wv.pos > wv.endPos)
        if (stillOnscreen) activeWaves.push(wv)
      }
      wavesRef.current = activeWaves

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const LENS_R = 160
      const LENS_R2 = LENS_R * LENS_R

      const cells = cellsRef.current
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]

        if (now > cell.nextFlip) {
          cell.val = cell.val === '1' ? '0' : '1'
          cell.nextFlip = now + 4000 + Math.random() * 9000
        }

        const pulse = 0.5 + 0.5 * Math.sin(now * 0.0006 + cell.phase)
        let opacity = 0.02 + pulse * 0.015

        let r = 200, g = 200, b = 210 // subtle slate fallback
        let waveBoost = 0
        let tintR = 0, tintG = 0, tintB = 0, tintW = 0

        for (const wv of activeWaves) {
          const cellPos = cell.x * wv.nx + cell.y * wv.ny
          const d = cellPos - wv.pos
          const ad = Math.abs(d)
          if (ad < wv.bandWidth) {
            const sigma = 30
            const glow = Math.exp(-(d * d) / (2 * sigma * sigma))
            const crest = Math.max(0, 1 - ad / wv.bandWidth)
            const intensity = glow * 0.85 + crest * 0.15

            waveBoost += intensity * 0.85
            tintR += wv.color[0] * intensity
            tintG += wv.color[1] * intensity
            tintB += wv.color[2] * intensity
            tintW += intensity

            if (glow > 0.85 && !wv.flippedSet.has(i) && Math.random() < 0.18) {
              cell.val = cell.val === '1' ? '0' : '1'
              wv.flippedSet.add(i)
            }
          }
        }

        let lensFalloff = 0
        if (mouseRef.current.inside) {
          const dx = cell.x - mx
          const dy = cell.y - my
          const d2 = dx * dx + dy * dy
          if (d2 < LENS_R2) {
            lensFalloff = 1 - Math.sqrt(d2) / LENS_R
          }
        }
        if (lensFalloff > 0) {
          opacity = Math.max(opacity, 0.08 + lensFalloff * 0.4)
        }

        if (waveBoost > 0) {
          opacity = Math.min(0.95, opacity + waveBoost)
          if (tintW > 0) {
            const tintMix = Math.min(1, waveBoost * 1.2)
            const tr = tintR / tintW
            const tg = tintG / tintW
            const tb = tintB / tintW
            r = r * (1 - tintMix) + tr * tintMix
            g = g * (1 - tintMix) + tg * tintMix
            b = b * (1 - tintMix) + tb * tintMix
          }
        }

        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${opacity})`
        ctx.fillText(cell.val, cell.x, cell.y)
      }

      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ mixBlendMode: 'plus-lighter' }}
    />
  )
}
