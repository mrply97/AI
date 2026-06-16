'use client'

import { useEffect, useRef, useState } from 'react'

const PALETTE: [number, number, number][] = [
  [160, 133, 88], // gold
  [201, 170, 124], // gold-lt
  [122, 158, 138], // sage-lt
  [212, 169, 160], // blush
  [244, 239, 228], // cream
]

interface Particle {
  x: number
  y: number
  startX: number
  startY: number
  angle: number
  dist: number
  size: number
  color: [number, number, number]
  delay: number
}

// Phase timings, ms
const STORM_END = 1100
const CONVERGE_END = 2200
const HOLD_END = 2550
const FADE_END = 3400

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
    const count = Math.min(Math.floor((w * h) / 6000), 220)

    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * Math.max(w, h) * 0.6
      const startAngle = Math.random() * Math.PI * 2
      const startDist = Math.max(w, h) * (0.5 + Math.random() * 0.6)
      return {
        x: cx + Math.cos(startAngle) * startDist,
        y: cy + Math.sin(startAngle) * startDist,
        startX: cx + Math.cos(startAngle) * startDist,
        startY: cy + Math.sin(startAngle) * startDist,
        angle,
        dist,
        size: 1 + Math.random() * 2.2,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        delay: Math.random() * 250,
      }
    })

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

    let raf: number
    const start = performance.now()

    const render = (now: number) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, w, h)

      // ink backdrop with faint ambient glow at center
      ctx.fillStyle = '#1E1A14'
      ctx.fillRect(0, 0, w, h)

      let overlayOpacity = 1
      if (elapsed > HOLD_END) {
        overlayOpacity = 1 - Math.min(1, (elapsed - HOLD_END) / (FADE_END - HOLD_END))
      }
      root.style.opacity = String(overlayOpacity)

      // converge progress, per-particle staggered
      for (const p of particles) {
        let t: number
        if (elapsed < STORM_END) {
          // storming — drift loosely near start position
          const local = Math.max(0, elapsed - p.delay) / STORM_END
          const wobble = Math.sin((elapsed + p.delay) * 0.01) * 14
          p.x = p.startX + wobble
          p.y = p.startY + Math.cos((elapsed + p.delay) * 0.012) * 14
          t = 0
          void local
        } else if (elapsed < CONVERGE_END) {
          t = easeOutCubic(Math.min(1, (elapsed - STORM_END) / (CONVERGE_END - STORM_END)))
          const targetX = cx + Math.cos(p.angle) * p.dist * 0.06
          const targetY = cy + Math.sin(p.angle) * p.dist * 0.06
          p.x = p.startX + (targetX - p.startX) * t
          p.y = p.startY + (targetY - p.startY) * t
        } else {
          const breathe = Math.sin(elapsed * 0.006 + p.angle) * 3
          p.x = cx + Math.cos(p.angle) * (p.dist * 0.06 + breathe)
          p.y = cy + Math.sin(p.angle) * (p.dist * 0.06 + breathe)
        }

        const [r, g, b] = p.color
        const alpha = elapsed < STORM_END ? 0.35 : 0.7
        ctx.beginPath()
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // central glow that blooms as particles converge
      const bloomT = easeInOutQuad(
        Math.min(1, Math.max(0, (elapsed - STORM_END) / (CONVERGE_END - STORM_END)))
      )
      if (bloomT > 0) {
        const radius = 8 + bloomT * 70
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        glow.addColorStop(0, `rgba(201,170,124,${0.55 * bloomT})`)
        glow.addColorStop(0.5, `rgba(122,158,138,${0.18 * bloomT})`)
        glow.addColorStop(1, 'rgba(122,158,138,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()

        // thin rotating diamond ring, echoing the brand's divider motif
        const ringSize = 6 + bloomT * 5
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(elapsed * 0.0006 + Math.PI / 4)
        ctx.strokeStyle = `rgba(244,239,228,${0.8 * bloomT})`
        ctx.lineWidth = 1
        ctx.strokeRect(-ringSize, -ringSize, ringSize * 2, ringSize * 2)
        ctx.restore()
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
        background: 'var(--ink)',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
