'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import ProblemHook from '@/components/ProblemHook'
import Botanical from '@/components/Botanical'
import HeroScene from '@/components/HeroScene'
import FloatingOrbs from '@/components/FloatingOrbs'
import ParticleField from '@/components/ParticleField'

const PILLARS = [
  'Cooperation Agreement Mapping',
  'Accounting Compliance',
  'Hospital-Specific AI',
  'On-Site Methodology',
]

// ── 3D word-flip reveal: each word rotates in on the X axis from above ──
const wordVariant = {
  hidden: {
    opacity: 0,
    rotateX: -90,
    y: 8,
    transformOrigin: 'center top',
  },
  visible: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      delay: 6.2 + i * 0.11,
      opacity: { duration: 0.25, delay: 6.2 + i * 0.11 },
    },
  }),
}

const fadeUp = (delay: number) => ({
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
})

// Headline words grouped into visual lines
const LINES: { text: string; cls?: string }[][] = [
  [{ text: 'The' }, { text: 'intelligence', cls: 'word-italic-sage' }],
  [{ text: 'healthcare' }, { text: 'accounting' }],
  [{ text: 'has been' }, { text: 'waiting for.', cls: 'word-italic-gold' }],
]

const CONTENT_START = 7.5

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null)

  // Scroll-driven parallax: botanical drifts up slower than content
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end start'],
  })
  const botanicalScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '-28%'])

  let wordIdx = 0

  return (
    <div ref={pageRef}>
      {/* Canvas particle field — sits behind the 3D scene */}
      <ParticleField />

      <HeroScene>

        {/* ── Layer -3: Ambient deep glow (furthest back) ── */}
        <div className="layer-ambient" aria-hidden="true" />

        {/* ── Layer -2: Botanical illustration ── */}
        <Botanical scrollY={botanicalScrollY} />

        {/* ── Layer +2: Floating gold ornaments (closest) ── */}
        <FloatingOrbs />

        {/* ── Layer 0: All visible content ── */}
        <div className="scene-content">

          {/* Nav */}
          <motion.nav variants={fadeUp(0.1)} initial="hidden" animate="visible">
            <a className="logo" href="#">
              <span className="logo-dot" />
              <span className="logo-text">HealthLedger AI</span>
            </a>
            <span className="nav-tag">Healthcare Accounting Intelligence</span>
          </motion.nav>

          {/* Problem hook → eyebrow */}
          <ProblemHook />

          {/* Hero */}
          <section className="hero">

            {/* ── 3D headline: words flip in from rotateX -90 → 0 ── */}
            <h1
              className="headline"
              style={{ transformStyle: 'preserve-3d', perspective: '600px' }}
            >
              {LINES.map((line, li) => (
                <span key={li} style={{ display: 'block' }}>
                  {line.map(({ text, cls }) => {
                    const idx = wordIdx++
                    return (
                      <motion.span
                        key={text}
                        className={`word ${cls ?? ''}`}
                        variants={wordVariant}
                        initial="hidden"
                        animate="visible"
                        custom={idx}
                      >
                        {text}
                      </motion.span>
                    )
                  })}
                </span>
              ))}
            </h1>

            <motion.p
              className="subtext"
              variants={fadeUp(CONTENT_START)}
              initial="hidden"
              animate="visible"
            >
              AI-powered compliance built specifically for hospital accounting departments.
              Custom-trained on your cooperation agreements. Grounded in doctoral research.
              Built from the inside — through on-site immersion.
            </motion.p>

            <motion.div
              className="divider"
              variants={fadeUp(CONTENT_START + 0.12)}
              initial="hidden"
              animate="visible"
            >
              <span className="divider-line" />
              <span className="divider-diamond" />
            </motion.div>

            <motion.div
              className="pillars"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.07, delayChildren: CONTENT_START + 0.22 },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {PILLARS.map((p) => (
                <motion.span
                  key={p}
                  className="pillar"
                  variants={{
                    hidden:   { opacity: 0, y: 14 },
                    visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {p}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="contact-section"
              variants={fadeUp(CONTENT_START + 0.55)}
              initial="hidden"
              animate="visible"
            >
              <p className="contact-label">Get in touch</p>
              <a className="contact-link" href="mailto:info@healthledgerai.com">
                info@healthledgerai.com
              </a>
            </motion.div>

            <motion.div
              className="scroll-hint"
              variants={fadeUp(CONTENT_START + 0.7)}
              initial="hidden"
              animate="visible"
            >
              <span className="scroll-hint-label">Scroll</span>
              <motion.span
                className="scroll-hint-bar"
                animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

          </section>

          <motion.footer
            variants={fadeUp(CONTENT_START + 0.85)}
            initial="hidden"
            animate="visible"
          >
            <span className="footer-copy">© 2026 HealthLedger AI &nbsp;·&nbsp; All rights reserved</span>
            <span className="footer-tag">Something important is being built.</span>
          </motion.footer>

        </div>
      </HeroScene>
    </div>
  )
}
