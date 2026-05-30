'use client'

import { useEffect, useRef } from 'react'

// r,g,b tuples from the brand palette
const PALETTE: [number, number, number][] = [
  [160, 133,  88],  // gold
  [201, 170, 124],  // gold-lt
  [ 74, 107,  90],  // sage
  [122, 158, 138],  // sage-lt
  [212, 169, 160],  // blush (rare)
]

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  alpha: number
  color: [number, number, number]
  phase: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    particles: [] as Particle[],
    mouse: { x: -9999, y: -9999 },
    raf: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const st = stateRef.current

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      init()
    }

    function init() {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 9500), 120)
      st.particles = Array.from({ length: count }, (_, i) => {
        const big = Math.random() < 0.12
        return {
          x:     Math.random() * canvas.width,
          y:     Math.random() * canvas.height,
          vx:    (Math.random() - 0.5) * 0.4,
          vy:    (Math.random() - 0.5) * 0.4,
          size:  big ? Math.random() * 2 + 2.2 : Math.random() * 1.4 + 0.4,
          alpha: big ? Math.random() * 0.5 + 0.25 : Math.random() * 0.35 + 0.1,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          phase: (i / count) * Math.PI * 2,
        }
      })
    }

    const CONNECT_DIST = 130
    const MOUSE_RADIUS = 180
    let t = 0

    function draw() {
      t += 0.008
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { particles, mouse } = st

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse attraction — pulls particles toward cursor
        const mdx  = mouse.x - p.x
        const mdy  = mouse.y - p.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)

        if (mdist < MOUSE_RADIUS && mdist > 1) {
          const pull = ((MOUSE_RADIUS - mdist) / MOUSE_RADIUS) ** 1.8 * 0.014
          p.vx += (mdx / mdist) * pull
          p.vy += (mdy / mdist) * pull
        }

        // Organic drift (Lissajous-like)
        p.vx += Math.sin(t * 0.9 + p.phase) * 0.005
        p.vy += Math.cos(t * 0.7 + p.phase * 1.4) * 0.004

        // Damping
        p.vx *= 0.955
        p.vy *= 0.955

        p.x += p.vx
        p.y += p.vy

        // Soft bounce at edges
        if (p.x < 0)            { p.x = 0;            p.vx *= -0.4 }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -0.4 }
        if (p.y < 0)            { p.y = 0;            p.vy *= -0.4 }
        if (p.y > canvas.height){ p.y = canvas.height; p.vy *= -0.4 }

        // Particle glow
        const alpha = p.alpha * (0.82 + 0.18 * Math.sin(t * 1.6 + p.phase))
        const [r, g, b] = p.color

        // Soft glow corona
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        grd.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Solid core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(alpha * 1.6, 0.9)})`
        ctx.fill()

        // Constellation lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECT_DIST) {
            const lineAlpha = (1 - d / CONNECT_DIST) * 0.14
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(160,133,88,${lineAlpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }

        // Lines to cursor — brighten near mouse
        if (mdist < MOUSE_RADIUS) {
          const lineAlpha = (1 - mdist / MOUSE_RADIUS) ** 1.5 * 0.45
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(160,133,88,${lineAlpha})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      st.raf = requestAnimationFrame(draw)
    }

    function onMouseMove(e: MouseEvent) {
      st.mouse.x = e.clientX
      st.mouse.y = e.clientY
    }
    function onMouseLeave() {
      st.mouse.x = -9999
      st.mouse.y = -9999
    }

    resize()
    draw()

    window.addEventListener('resize',       resize)
    window.addEventListener('mousemove',    onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(st.raf)
      window.removeEventListener('resize',       resize)
      window.removeEventListener('mousemove',    onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
