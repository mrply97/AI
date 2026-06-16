'use client'

import { useEffect, useRef, useState } from 'react'

// Brand palette — the particle swarm cycles through these instead of neon pink/green/blue
const PALETTE: [number, number, number][] = [
  [160, 133, 88], // gold
  [201, 170, 124], // gold-lt
  [74, 107, 90], // sage
  [122, 158, 138], // sage-lt
  [212, 169, 160], // blush
]

interface Particle {
  // unit-sphere position, rotated each frame
  bx: number
  by: number
  bz: number
  size: number
  colorIdx: number
  twinklePhase: number
}

// Phase timings, ms
const GROW_END = 1400 // dense swarm pops into existence in the center
const HOLD_END = 3300 // it breathes, rotates and cycles through brand colors
const FADE_END = 4200 // overlay dissolves into the page

const CAM_DIST = 260
const FOCAL = 320

export default function IntroOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const cx = w / 2
    const cy = h / 2
    const baseRadius = Math.min(w, h) * 0.16
    const count = Math.min(Math.floor((w * h) / 2400), 850)

    const particles: Particle[] = Array.from({ length: count }, () => {
      // uniform random point inside a unit sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.cbrt(Math.random())
      return {
        bx: r * Math.sin(phi) * Math.cos(theta),
        by: r * Math.sin(phi) * Math.sin(theta),
        bz: r * Math.cos(phi),
        size: 0.9 + Math.random() * 1.8,
        colorIdx: Math.floor(Math.random() * PALETTE.length),
        twinklePhase: Math.random() * Math.PI * 2,
      }
    })

    const easeOutBack = (t: number) => {
      const c1 = 1.6
      const c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    let raf: number
    const start = performance.now()

    const render = (now: number) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#F4EFE4'
      ctx.fillRect(0, 0, w, h)

      let overlayOpacity = 1
      if (elapsed > HOLD_END) {
        overlayOpacity = 1 - Math.min(1, (elapsed - HOLD_END) / (FADE_END - HOLD_END))
      }
      root.style.opacity = String(overlayOpacity)

      const growT = Math.min(1, elapsed / GROW_END)
      const popScale = easeOutBack(growT)
      const breathe = elapsed > GROW_END ? 1 + Math.sin(elapsed * 0.0016) * 0.08 : 1
      const dispersal = elapsed > HOLD_END ? easeOutCubic(Math.min(1, (elapsed - HOLD_END) / (FADE_END - HOLD_END))) : 0
      const radius = baseRadius * popScale * breathe * (1 + dispersal * 0.9)

      const rotY = elapsed * 0.00055
      const rotX = Math.sin(elapsed * 0.00035) * 0.35
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      // a color wave sweeps through the palette so the whole swarm cycles tones, like the reference
      const wavePos = (elapsed * 0.00045) % PALETTE.length

      // depth-sort so far particles draw first
      const projected = particles.map((p) => {
        // rotate around Y then X
        const x1 = p.bx * cosY - p.bz * sinY
        const z1 = p.bx * sinY + p.bz * cosY
        const y1 = p.by * cosX - z1 * sinX
        const z2 = p.by * sinX + z1 * cosX

        const z = z2 * radius + CAM_DIST
        const scale2D = FOCAL / z
        const sx = cx + x1 * radius * scale2D
        const sy = cy + y1 * radius * scale2D
        return { p, sx, sy, scale2D, z2 }
      })
      projected.sort((a, b) => a.z2 - b.z2)

      for (const { p, sx, sy, scale2D } of projected) {
        const depthAlpha = Math.max(0.12, Math.min(1, scale2D * 1.15))
        const twinkle = 0.6 + 0.4 * Math.sin(elapsed * 0.005 + p.twinklePhase)
        const colorWave = 0.35 + 0.65 * Math.max(0, 1 - Math.min(Math.abs(p.colorIdx - wavePos), PALETTE.length - Math.abs(p.colorIdx - wavePos)))
        const alpha = Math.min(1, growT) * depthAlpha * twinkle * (0.45 + colorWave * 0.7) * (1 - dispersal * 0.85)
        if (alpha <= 0.02) continue

        const [r, g, b] = PALETTE[p.colorIdx]
        const size = p.size * scale2D * (1 + colorWave * 0.6)
        ctx.beginPath()
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        if (colorWave > 0.75) {
          ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 0.6})`
          ctx.shadowBlur = 5
        } else {
          ctx.shadowBlur = 0
        }
        ctx.arc(sx, sy, Math.max(0.3, size), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      // soft core glow, brightest where the wave currently peaks
      if (growT > 0) {
        const [r, g, b] = PALETTE[Math.round(wavePos) % PALETTE.length]
        const glowR = radius * 1.3
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
        glow.addColorStop(0, `rgba(${r},${g},${b},${0.22 * growT * (1 - dispersal)})`)
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
        ctx.fill()
      }

      if (elapsed < FADE_END) {
        raf = requestAnimationFrame(render)
      } else {
        setDone(true)
      }
    }

    raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (done) return null

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        pointerEvents: 'none',
        background: 'var(--cream)',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
