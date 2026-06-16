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
  // unit-sphere position, used as the outward-flight direction once exploded
  bx: number
  by: number
  bz: number
  size: number
  colorIdx: number
  twinklePhase: number
}

interface Spot {
  // a patch of "terrain" on the planet's surface, in spherical coords
  lat: number
  lon: number
  size: number
  colorIdx: number
}

// Explosion timeline, ms — starts the moment the user scrolls
const POP_END = 480 // ball kicks up in size
const BURST_END = 1500 // surface tears into the particle swarm, flying outward
const FADE_END = 2200 // overlay dissolves into the page

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
    const baseRadius = Math.min(w, h) * 0.13

    const spots: Spot[] = Array.from({ length: 26 }, () => ({
      lat: Math.acos(2 * Math.random() - 1) - Math.PI / 2,
      lon: Math.random() * Math.PI * 2,
      size: 0.12 + Math.random() * 0.22,
      colorIdx: Math.floor(Math.random() * PALETTE.length),
    }))

    const count = Math.min(Math.floor((w * h) / 2400), 850)
    const particles: Particle[] = Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      return {
        bx: Math.sin(phi) * Math.cos(theta),
        by: Math.sin(phi) * Math.sin(theta),
        bz: Math.cos(phi),
        size: 0.9 + Math.random() * 1.8,
        colorIdx: Math.floor(Math.random() * PALETTE.length),
        twinklePhase: Math.random() * Math.PI * 2,
      }
    })

    const easeOutBack = (t: number) => {
      const c1 = 1.7
      const c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const easeInQuad = (t: number) => t * t

    let raf: number
    let exploding = false
    let explodeStart = 0
    let idleScrollY = window.scrollY

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
      ctx.fillStyle = '#F4EFE4'
      ctx.fillRect(0, 0, w, h)

      // gentle slow spin + breathing while waiting for the user to scroll
      const rotY = idleElapsed * 0.00025
      const breathe = 1 + Math.sin(idleElapsed * 0.0011) * 0.035

      if (!exploding) {
        root.style.opacity = '1'
        const radius = baseRadius * breathe

        const planetGrad = ctx.createRadialGradient(
          cx - radius * 0.35, cy - radius * 0.35, radius * 0.1,
          cx, cy, radius * 1.05,
        )
        planetGrad.addColorStop(0, '#E4D2AE')
        planetGrad.addColorStop(0.55, '#C9AA7C')
        planetGrad.addColorStop(1, '#7A6B4A')
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fillStyle = planetGrad
        ctx.fill()

        // terrain patches, rotating around the visible face
        for (const s of spots) {
          const lon = s.lon + rotY
          const x = Math.cos(s.lat) * Math.sin(lon)
          const z = Math.cos(s.lat) * Math.cos(lon)
          const y = Math.sin(s.lat)
          if (z < -0.15) continue
          const fScale = Math.max(0.15, z)
          const sx = cx + x * radius
          const sy = cy + y * radius
          const [r, g, b] = PALETTE[s.colorIdx]
          ctx.beginPath()
          ctx.fillStyle = `rgba(${r},${g},${b},${0.35 * fScale})`
          ctx.ellipse(sx, sy, s.size * radius * fScale, s.size * radius * fScale * 0.7, 0, 0, Math.PI * 2)
          ctx.fill()
        }

        // thin terminator shadow on the far edge for a sphere feel
        const shade = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius)
        shade.addColorStop(0, 'rgba(30,26,20,0)')
        shade.addColorStop(1, 'rgba(30,26,20,0.22)')
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fillStyle = shade
        ctx.fill()

        // soft ambient glow
        const glowR = radius * 1.6
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
        glow.addColorStop(0, 'rgba(160,133,88,0.18)')
        glow.addColorStop(1, 'rgba(160,133,88,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
        ctx.fill()

        raf = requestAnimationFrame(render)
        return
      }

      // ── exploding ──
      const elapsed = Math.max(0, now - explodeStart)
      const popT = Math.max(0, Math.min(1, elapsed / POP_END))
      const popScale = easeOutBack(popT)
      const burstT = elapsed > POP_END ? Math.max(0, Math.min(1, (elapsed - POP_END) / (BURST_END - POP_END))) : 0
      const burstEase = easeOutCubic(burstT)
      const fadeT = elapsed > BURST_END ? Math.max(0, Math.min(1, (elapsed - BURST_END) / (FADE_END - BURST_END))) : 0

      root.style.opacity = String(1 - easeInQuad(fadeT))

      const coreRadius = Math.max(0, baseRadius * breathe * popScale * (1 - burstEase * 0.6))
      const flightRadius = baseRadius * (1 + burstEase * 7)

      if (burstT < 1) {
        const grad = ctx.createRadialGradient(
          cx - coreRadius * 0.35, cy - coreRadius * 0.35, coreRadius * 0.1,
          cx, cy, coreRadius * 1.05,
        )
        grad.addColorStop(0, '#E4D2AE')
        grad.addColorStop(0.55, '#C9AA7C')
        grad.addColorStop(1, '#7A6B4A')
        ctx.beginPath()
        ctx.arc(cx, cy, Math.max(0, coreRadius), 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.globalAlpha = 1 - burstEase
        ctx.fill()
        ctx.globalAlpha = 1
      }

      for (const p of particles) {
        const dist = burstEase
        const sx = cx + p.bx * flightRadius * dist
        const sy = cy + p.by * flightRadius * dist
        const depthAlpha = 0.55 + 0.45 * p.bz
        const twinkle = 0.6 + 0.4 * Math.sin(elapsed * 0.006 + p.twinklePhase)
        const alpha = Math.min(1, dist * 2.2) * depthAlpha * twinkle * (1 - fadeT)
        if (alpha <= 0.02) continue

        const [r, g, b] = PALETTE[p.colorIdx]
        const size = p.size * (0.6 + dist * 1.1)
        ctx.beginPath()
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.arc(sx, sy, Math.max(0.3, size), 0, Math.PI * 2)
        ctx.fill()
      }

      if (elapsed < FADE_END) {
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
        background: 'var(--cream)',
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
        <span className="scroll-hint-label">Scroll</span>
        <span className="scroll-hint-bar" />
      </div>
    </div>
  )
}
