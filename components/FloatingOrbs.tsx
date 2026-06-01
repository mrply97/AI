'use client'

import { motion } from 'framer-motion'

// Diamond ornaments at different Z depths — closer ones move most on tilt
const gems = [
  { x: '76%', y: '18%', z: 90,  size: 7,  delay: 0.0, dur: 7.0 },
  { x: '83%', y: '42%', z: 70,  size: 5,  delay: 1.1, dur: 9.2 },
  { x: '70%', y: '68%', z: 80,  size: 6,  delay: 2.0, dur: 8.0 },
  { x: '91%', y: '28%', z: 50,  size: 4,  delay: 0.6, dur: 6.5 },
  { x: '88%', y: '75%', z: 60,  size: 4,  delay: 1.8, dur: 7.8 },
  { x: '10%', y: '75%', z: 40,  size: 3,  delay: 0.3, dur: 8.5 },
  { x: '6%',  y: '40%', z: 30,  size: 3,  delay: 1.4, dur: 9.8 },
]

// Thin horizontal accent lines
const lines = [
  { x: '65%', y: '12%', z: 55, w: 40, delay: 2.2 },
  { x: '68%', y: '85%', z: 35, w: 28, delay: 3.0 },
]

const APPEAR_AFTER = 8 // seconds — after the headline finishes

export default function FloatingOrbs() {
  return (
    <div className="orbs-layer" aria-hidden="true">
      {gems.map((g, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: g.x,
            top:  g.y,
            transform: `translateZ(${g.z}px)`,
            width: g.size,
            height: g.size,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.55, 0.35, 0.55],
            y: [0, -10, 0, -6, 0],
          }}
          transition={{
            duration: g.dur,
            delay: APPEAR_AFTER + g.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg viewBox="0 0 10 10" style={{ width: '100%', overflow: 'visible' }}>
            <rect
              x="5" y="0.5" width="6" height="6"
              transform="rotate(45 5 5)"
              fill="none"
              stroke="var(--gold-lt)"
              strokeWidth="0.8"
            />
          </svg>
        </motion.div>
      ))}

      {lines.map((l, i) => (
        <motion.div
          key={`line-${i}`}
          style={{
            position: 'absolute',
            left: l.x,
            top:  l.y,
            transform: `translateZ(${l.z}px)`,
            width: l.w,
            height: 1,
            background: 'linear-gradient(90deg, var(--gold-lt), transparent)',
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.5, 0.3, 0.5], scaleX: 1 }}
          transition={{
            duration: 1.2,
            delay: APPEAR_AFTER + l.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
