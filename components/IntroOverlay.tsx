'use client'

import { useEffect, useRef, useState } from 'react'

// Warm beige/stone tones — kept darker than the cream backdrop for contrast
const PALETTE: [number, number, number][] = [
  [160, 133, 88], // gold
  [201, 170, 124], // gold-lt
  [138, 128, 112], // ink-mute (stone grey-beige)
  [191, 169, 128], // warm stone tan
  [122, 158, 138], // sage-lt, used sparingly
]

interface Particle {
  x: number
  y: number
  angle: number
  dist: number
  size: number
  color: [number, number, number]
  delay: number
  twinklePhase: number
  twinkleSpeed: number
  isGlint: boolean
}

// Phase timings, ms — bloom grows from a point, holds with glitter, then fades to reveal the page
const GROW_END = 1700
const HOLD_END = 2500
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
    const count = Math.min(Math.floor((w * h) / 5500), 240)

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: cx,
      y: cy,
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * Math.max(w, h) * 0.62,
      size: 1.2 + Math.random() * 2.6,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      delay: Math.random() * 500,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.004 + Math.random() * 0.006,
      isGlint: Math.random() < 0.12,
    }))

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

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

      const growT = easeOutCubic(Math.min(1, Math.max(0, elapsed - 0) / GROW_END))

      for (const p of particles) {
        const local = Math.max(0, Math.min(1, (elapsed - p.delay) / (GROW_END - p.delay)))
        const eased = easeOutCubic(local)
        const r = p.dist * eased
        const wobble = Math.sin(elapsed * 0.003 + p.angle * 3) * 4 * eased
        p.x = cx + Math.cos(p.angle) * r + wobble
        p.y = cy + Math.sin(p.angle) * r + Math.cos(elapsed * 0.0026 + p.angle * 3) * 4 * eased

        const sizeT = 0.15 + 0.85 * eased
        const twinkle = 0.55 + 0.45 * Math.sin(elapsed * p.twinkleSpeed + p.twinklePhase)
        const alpha = Math.max(0, eased) * twinkle * 0.85

        const [cr, cg, cb] = p.color
        ctx.beginPath()
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`
        ctx.shadowColor = `rgba(${cr},${cg},${cb},${alpha * 0.5})`
        ctx.shadowBlur = p.isGlint ? 6 : 2
        ctx.arc(p.x, p.y, p.size * sizeT, 0, Math.PI * 2)
        ctx.fill()

        if (p.isGlint && eased > 0.4) {
          const glintAlpha = (twinkle - 0.6) * 1.6 * eased
          if (glintAlpha > 0) {
            ctx.strokeStyle = `rgba(244,239,228,${Math.min(0.9, glintAlpha)})`
            ctx.lineWidth = 0.6
            const gs = p.size * sizeT * 2.6
            ctx.beginPath()
            ctx.moveTo(p.x - gs, p.y)
            ctx.lineTo(p.x + gs, p.y)
            ctx.moveTo(p.x, p.y - gs)
            ctx.lineTo(p.x, p.y + gs)
            ctx.stroke()
          }
        }
      }
      ctx.shadowBlur = 0

      // central stone-toned bloom that grows from a point
      if (growT > 0) {
        const radius = 6 + growT * 64
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        glow.addColorStop(0, `rgba(160,133,88,${0.4 * growT})`)
        glow.addColorStop(0.55, `rgba(191,169,128,${0.16 * growT})`)
        glow.addColorStop(1, 'rgba(191,169,128,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()

        const bloomT = easeInOutQuad(growT)
        const ringSize = 6 + bloomT * 5
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(elapsed * 0.0006 + Math.PI / 4)
        ctx.strokeStyle = `rgba(160,133,88,${0.75 * bloomT})`
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
        background: 'var(--cream)',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
