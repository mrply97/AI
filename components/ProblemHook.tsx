'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const hooks = [
  'A hospital has 200+ cooperation agreements.',
  'Each interpreted differently by accounting.',
  'One clause. Thousands in exposure.',
]

const INTERVAL = 1900

export default function ProblemHook() {
  const [index, setIndex] = useState(0)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (settled) return
    if (index >= hooks.length - 1) {
      const t = setTimeout(() => setSettled(true), INTERVAL)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setIndex((i) => i + 1), INTERVAL)
    return () => clearTimeout(t)
  }, [index, settled])

  return (
    <motion.div
      className="problem-hook"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
    >
      <span className="hook-bar" />
      <div style={{ position: 'relative', overflow: 'hidden', minWidth: 0 }}>
        <AnimatePresence mode="wait">
          {!settled ? (
            <motion.span
              key={index}
              className="hook-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{ display: 'block' }}
            >
              {hooks[index]}
            </motion.span>
          ) : (
            <motion.span
              key="settled"
              className="hook-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'block', color: 'var(--ink-mute)', letterSpacing: '0.22em' }}
            >
              Research &amp; Development — 2026
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
