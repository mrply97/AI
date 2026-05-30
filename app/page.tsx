'use client'

import { motion } from 'framer-motion'
import ProblemHook from '@/components/ProblemHook'
import Botanical from '@/components/Botanical'

const PILLARS = [
  'Cooperation Agreement Mapping',
  'Accounting Compliance',
  'Hospital-Specific AI',
  'On-Site Methodology',
]

// Headline word tokens: [text, className?]
const HEADLINE: [string, string?][] = [
  ['The'],
  ['intelligence', 'word-italic-sage'],
  // line break handled via block display below
  ['healthcare'],
  ['accounting'],
  ['has been'],
  ['waiting for.', 'word-italic-gold'],
]

const wordVariant = {
  hidden: { opacity: 0, y: 28, rotateX: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
      // start after hook cycling (~hooks * INTERVAL + buffer)
      delay: 6.2 + i * 0.09,
    },
  }),
}

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
  },
})

export default function Home() {
  // Headline lines: words grouped by visual line
  const lines: [string, string?][][] = [
    [HEADLINE[0], HEADLINE[1]],
    [HEADLINE[2], HEADLINE[3]],
    [HEADLINE[4], HEADLINE[5]],
  ]

  // Global word index for stagger
  let wordIdx = 0

  // Content fades after headline finishes (~6.2 + 6*0.09 + 0.75 ≈ 7.5s)
  const CONTENT_START = 7.5

  return (
    <>
      <Botanical />

      <div className="wrapper">
        {/* Nav */}
        <motion.nav
          variants={fadeUp(0.1)}
          initial="hidden"
          animate="visible"
        >
          <a className="logo" href="#">
            <span className="logo-dot" />
            <span className="logo-text">HealthLedger AI</span>
          </a>
          <span className="nav-tag">Healthcare Accounting Intelligence</span>
        </motion.nav>

        {/* Problem hook — cycles through pain points, settles into eyebrow */}
        <ProblemHook />

        {/* Hero */}
        <section className="hero">

          {/* Kinetic headline */}
          <h1 className="headline">
            {lines.map((line, li) => (
              <span key={li} style={{ display: 'block' }}>
                {line.map(([text, cls]) => {
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

          {/* Subtext */}
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

          {/* Ornament */}
          <motion.div
            className="divider"
            variants={fadeUp(CONTENT_START + 0.12)}
            initial="hidden"
            animate="visible"
          >
            <span className="divider-line" />
            <span className="divider-diamond" />
          </motion.div>

          {/* Pillars */}
          <motion.div
            className="pillars"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07, delayChildren: CONTENT_START + 0.22 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {PILLARS.map((p) => (
              <motion.span
                key={p}
                className="pillar"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {p}
              </motion.span>
            ))}
          </motion.div>

          {/* Contact */}
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

          {/* Scroll hint */}
          <motion.div
            className="scroll-hint"
            variants={fadeUp(CONTENT_START + 0.7)}
            initial="hidden"
            animate="visible"
          >
            <span className="scroll-hint-label">Scroll</span>
            <motion.span
              className="scroll-hint-bar"
              animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

        </section>

        {/* Footer */}
        <motion.footer
          variants={fadeUp(CONTENT_START + 0.85)}
          initial="hidden"
          animate="visible"
        >
          <span className="footer-copy">© 2026 HealthLedger AI &nbsp;·&nbsp; All rights reserved</span>
          <span className="footer-tag">Something important is being built.</span>
        </motion.footer>
      </div>
    </>
  )
}
