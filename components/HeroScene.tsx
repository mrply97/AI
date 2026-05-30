'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function HeroScene({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 70, damping: 18, mass: 0.4,
  })
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), {
    stiffness: 70, damping: 18, mass: 0.4,
  })

  function onMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - r.left) / r.width - 0.5)
    rawY.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="scene-root"
    >
      <motion.div
        className="scene-tilt"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
