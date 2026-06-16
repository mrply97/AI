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
  twinklePhase: number
  twinkleSpeed: number
  isGlint: boolean
}

// Phase timings, ms
const ORB_GROW_END = 1100 // ball grows in the center
const EXPLODE_END = 1900 // it bursts outward into particles
const HOLD_END = 2700 // particles drift / twinkle
const FADE_END = 3500 // overlay dissolves into the page

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
      dist: Math.max(w, h) * (0.18 + Math.random() * 0.46),
      size: 1.2 + Math.random() * 2.6,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.004 + Math.random() * 0.006,
      isGlint: Math.random() < 0.14,
    }))

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const easeOutBack = (t: number) => {
      const c1 = 1.7
      const c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }
    const easeInQuad = (t: number) => t * t

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

      if (elapsed <= ORB_GROW_END) {
        // ── Phase 1: a solid ball forms at the center and grows ──
        const t = elapsed / ORB_GROW_END
        const grow = easeOutBack(Math.min(1, t))
        const wobbleX = Math.sin(elapsed * 0.006) * 5 * (1 - t)
        const wobbleY = Math.cos(elapsed * 0.007) * 5 * (1 - t)
        const radius = Math.max(0, 4 + grow * 46)

        const glow = ctx.createRadialGradient(cx + wobbleX, cy + wobbleY, 0, cx + wobbleX, cy + wobbleY, radius * 2.2)
        glow.addColorStop(0, 'rgba(160,133,88,0.9)')
        glow.addColorStop(0.45, 'rgba(191,169,128,0.5)')
        glow.addColorStop(1, 'rgba(191,169,128,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx + wobbleX, cy + wobbleY, radius * 2.2, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = 'rgba(160,133,88,0.92)'
        ctx.arc(cx + wobbleX, cy + wobbleY, radius, 0, Math.PI * 2)
        ctx.fill()
      } else if (elapsed <= EXPLODE_END) {
        // ── Phase 2: the ball bursts outward into particles ──
        const t = (elapsed - ORB_GROW_END) / (EXPLODE_END - ORB_GROW_END)
        const burst = easeOutCubic(Math.min(1, t))
        const shrink = 1 - easeInQuad(Math.min(1, t))

        if (shrink > 0.02) {
          const radius = 50 * shrink
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2)
          glow.addColorStop(0, `rgba(160,133,88,${0.9 * shrink})`)
          glow.addColorStop(1, 'rgba(191,169,128,0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(cx, cy, radius * 2, 0, Math.PI * 2)
          ctx.fill()
        }

        for (const p of particles) {
          const r = p.dist * burst
          p.x = cx + Math.cos(p.angle) * r
          p.y = cy + Math.sin(p.angle) * r

          const sizeT = 0.5 + 0.7 * burst
          const alpha = Math.max(0, 1 - burst * 0.25)
          const [cr, cg, cb] = p.color
          ctx.beginPath()
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`
          ctx.shadowColor = `rgba(${cr},${cg},${cb},${alpha * 0.6})`
          ctx.shadowBlur = p.isGlint ? 7 : 2
          ctx.arc(p.x, p.y, p.size * sizeT, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.shadowBlur = 0
      } else {
        // ── Phase 3: settle, drift gently, twinkle like glitter ──
        const driftElapsed = elapsed - EXPLODE_END
        for (const p of particles) {
          const wobble = Math.sin(driftElapsed * 0.0018 + p.angle * 3) * 6
          p.x = cx + Math.cos(p.angle) * p.dist + wobble
          p.y = cy + Math.sin(p.angle) * p.dist + Math.cos(driftElapsed * 0.0016 + p.angle * 3) * 6

          const twinkle = 0.5 + 0.5 * Math.sin(elapsed * p.twinkleSpeed + p.twinklePhase)
          const alpha = 0.55 + twinkle * 0.3
          const [cr, cg, cb] = p.color
          ctx.beginPath()
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`
          ctx.shadowColor = `rgba(${cr},${cg},${cb},${alpha * 0.5})`
          ctx.shadowBlur = p.isGlint ? 6 : 2
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()

          if (p.isGlint) {
            const glintAlpha = (twinkle - 0.55) * 1.8
            if (glintAlpha > 0) {
              ctx.strokeStyle = `rgba(244,239,228,${Math.min(0.9, glintAlpha)})`
              ctx.lineWidth = 0.6
              const gs = p.size * 2.8
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
