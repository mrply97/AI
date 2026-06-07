'use client'

import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProblemHook from '@/components/ProblemHook'
import Botanical from '@/components/Botanical'
import HeroScene from '@/components/HeroScene'
import FloatingOrbs from '@/components/FloatingOrbs'
import ParticleField from '@/components/ParticleField'
import CustomCursor from '@/components/CustomCursor'
import Marquee from '@/components/Marquee'
import SectionHow from '@/components/SectionHow'
import SectionAstrology from '@/components/SectionAstrology'
import SectionTimeline from '@/components/SectionTimeline'
import SectionLove from '@/components/SectionLove'
import SectionSynastry from '@/components/SectionSynastry'
import SectionSynastryTiming from '@/components/SectionSynastryTiming'
import SectionSynastry2027 from '@/components/SectionSynastry2027'
import SectionNewMoon from '@/components/SectionNewMoon'
import SectionContact from '@/components/SectionContact'

// astronomia VSOP87 data requires client-side evaluation only
const SectionTransits = dynamic(() => import('@/components/SectionTransits'), { ssr: false })

const PILLARS = [
  'Cooperation Agreement Mapping',
  'Accounting Compliance',
  'Hospital-Specific AI',
  'On-Site Methodology',
]

const LINES: { text: string; cls?: string }[][] = [
  [{ text: 'The' }, { text: 'intelligence', cls: 'word-italic-sage' }],
  [{ text: 'healthcare' }, { text: 'accounting' }],
  [{ text: 'has been' }, { text: 'waiting for.', cls: 'word-italic-gold' }],
]

const wordVariant = {
  hidden: { opacity: 0, rotateX: -90, y: 8, transformOrigin: 'center top' },
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
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
})

const CONTENT_START = 7.5

export default function Home() {
  // Botanical drifts up as you scroll past the hero
  const { scrollY } = useScroll()
  const botanicalScrollY = useTransform(scrollY, [0, 700], ['0%', '-22%'])

  let wordIdx = 0

  return (
    <>
      <CustomCursor />
      <ParticleField />

      {/* ── HERO — 3D tilt scene ── */}
      <HeroScene>
        <div className="layer-ambient" aria-hidden="true" />
        <Botanical scrollY={botanicalScrollY} />
        <FloatingOrbs />

        <div className="scene-content">
          <motion.nav variants={fadeUp(0.1)} initial="hidden" animate="visible">
            <a className="logo" href="#">
              <span className="logo-dot" />
              <span className="logo-text">HealthLedger AI</span>
            </a>
            <span className="nav-tag">Healthcare Accounting Intelligence</span>
          </motion.nav>

          <ProblemHook />

          <section className="hero">
            {/* 3D word-flip headline */}
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
                    hidden:  { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {p}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="scroll-hint"
              variants={fadeUp(CONTENT_START + 0.65)}
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
        </div>
      </HeroScene>

      {/* ── MARQUEE ticker ── */}
      <Marquee />

      {/* ── HOW IT WORKS ── */}
      <SectionHow />

      {/* ── ASTROLOGY PLANETS ── */}
      <SectionAstrology />

      {/* ── NATAL CHART & TRANSITS ── */}
      <SectionTransits />

      {/* ── TRANSIT TIMELINE Jun–Dec 2026 ── */}
      <SectionTimeline />

      {/* ── LOVE & RELATIONSHIP TRANSITS ── */}
      <SectionLove />

      {/* ── SYNASTRY ── */}
      <SectionSynastry />

      {/* ── CROSSING SYNASTRY TIMING ── */}
      <SectionSynastryTiming />

      {/* ── SYNASTRY 2027 FORECAST ── */}
      <SectionSynastry2027 />

      {/* ── NEW MOON IN GEMINI — life arc to 2033 ── */}
      <SectionNewMoon />

      {/* ── CONTACT / WAITLIST ── */}
      <SectionContact />

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <span className="footer-copy">© 2026 HealthLedger AI &nbsp;·&nbsp; All rights reserved</span>
        <span className="footer-tag">Something important is being built.</span>
      </footer>
    </>
  )
}
