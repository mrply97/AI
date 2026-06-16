'use client'

import { useEffect, useRef, useState } from 'react'

// Diamond / silver glitter — cool whites instead of brand gold/sage/blush
const PALETTE: [number, number, number][] = [
  [255, 255, 255], // pure white
  [228, 234, 242], // silver-white
  [200, 212, 226], // light steel
  [255, 250, 245], // warm glint
  [180, 196, 214], // cool silver
]

const BG = '#15120E'

interface Particle {
  // unit-sphere position, used both for the idle cloud and the outward-flight direction
  bx: number
  by: number
  bz: number
  size: number
  colorIdx: number
  twinklePhase: number
  isGlint: boolean
  sparklePhase: number
  sparkleSpeed: number
}

// Explosion timeline, ms — starts the moment the user scrolls
const BURST_END = 2600 // dense swarm tears outward, slowly
const HOLD_END = 3400 // scattered glitter lingers on the dark backdrop
const FADE_END = 4600 // only then does the dark overlay dissolve into the page

const SCROLL_TRIGGER_PX = 12

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

    const count = Math.min(Math.floor((w * h) / 2200), 950)
    const particles: Particle[] = Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.cbrt(Math.random()) // dense fill, not just the shell
      return {
        bx: r * Math.sin(phi) * Math.cos(theta),
        by: r * Math.sin(phi) * Math.sin(theta),
        bz: r * Math.cos(phi),
        size: 0.8 + Math.random() * 1.7,
        colorIdx: Math.floor(Math.random() * PALETTE.length),
        twinklePhase: Math.random() * Math.PI * 2,
        isGlint: Math.random() < 0.16,
        sparklePhase: Math.random() * Math.PI * 2,
        sparkleSpeed: 0.0035 + Math.random() * 0.004,
      }
    })

    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const easeInQuad = (t: number) => t * t

    let raf: number
    let exploding = false
    let explodeStart = 0
    const idleScrollY = window.scrollY

    const onScroll = () => {
      if (exploding) return
      if (Math.abs(window.scrollY - idleScrollY) > SCROLL_TRIGGER_PX) {
        exploding = true
        explodeStart = performance.now()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const start = performance.now()

    const render = (now: number) => {
      const idleElapsed = now - start
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, w, h)

      const rotY = idleElapsed * 0.00035
      const rotX = Math.sin(idleElapsed * 0.00022) * 0.3
      const breathe = 1 + Math.sin(idleElapsed * 0.0011) * 0.05
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      let burstEase = 0
      let fadeT = 0
      let elapsed = 0
      if (exploding) {
        elapsed = Math.max(0, now - explodeStart)
        const burstT = Math.max(0, Math.min(1, elapsed / BURST_END))
        burstEase = easeInOutCubic(burstT)
        // the dark backdrop holds solid through the burst and the lingering glitter, fading out only at the very end
        fadeT = elapsed > HOLD_END ? Math.max(0, Math.min(1, (elapsed - HOLD_END) / (FADE_END - HOLD_END))) : 0
        root.style.opacity = String(1 - easeInQuad(fadeT))
      } else {
        root.style.opacity = '1'
      }

      const radius = baseRadius * breathe * (1 + burstEase * 8)

      const projected = particles.map((p) => {
        const x1 = p.bx * cosY - p.bz * sinY
        const z1 = p.bx * sinY + p.bz * cosY
        const y1 = p.by * cosX - z1 * sinX
        const z2 = p.by * sinX + z1 * cosX
        const sx = cx + x1 * radius
        const sy = cy + y1 * radius
        return { p, sx, sy, z2 }
      })
      projected.sort((a, b) => a.z2 - b.z2)

      for (const { p, sx, sy, z2 } of projected) {
        const depthAlpha = 0.45 + 0.55 * ((z2 + 1) / 2)
        const twinkle = 0.55 + 0.45 * Math.sin(idleElapsed * 0.005 + p.twinklePhase)
        let alpha = depthAlpha * twinkle * (1 - fadeT * 1.05)
        let size = p.size

        if (p.isGlint) {
          const sparkle = Math.pow(Math.max(0, Math.sin(idleElapsed * p.sparkleSpeed + p.sparklePhase)), 8)
          alpha = Math.min(1, alpha + sparkle * 0.9)
          size = p.size * (1 + sparkle * 1.8)
        }
        if (exploding) alpha *= 0.6 + 0.4 * burstEase
        if (alpha <= 0.02) continue

        const [r, g, b] = PALETTE[p.colorIdx]
        ctx.beginPath()
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        if (p.isGlint && alpha > 0.5) {
          ctx.shadowColor = `rgba(255,255,255,${alpha * 0.7})`
          ctx.shadowBlur = 6
        } else {
          ctx.shadowBlur = 0
        }
        ctx.arc(sx, sy, Math.max(0.3, size), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      // soft silver core glow
      const glowR = radius * 1.2
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, glowR))
      glow.addColorStop(0, `rgba(255,255,255,${0.16 * (1 - fadeT)})`)
      glow.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, Math.max(1, glowR), 0, Math.PI * 2)
      ctx.fill()

      if (!exploding || elapsed < FADE_END) {
        raf = requestAnimationFrame(render)
      } else {
        setDone(true)
      }
    }

    raf = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
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
        background: '#15120E',
      }}
    >
      <canvas ref={canvasRef} />
      <div
        className="scroll-hint"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '8%',
          transform: 'translateX(-50%)',
        }}
      >
        <span className="scroll-hint-label" style={{ color: 'rgba(228,234,242,0.55)' }}>Scroll</span>
        <span className="scroll-hint-bar" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.6), transparent)' }} />
      </div>
    </div>
  )
}
