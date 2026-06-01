'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { calcNatal, calcTransits, calcAspects, type PlanetPos, type AspectInfo } from '@/lib/astro'

// ── Pre-computed data (server-safe constants) ─────────────────────────────

// Birth: April 20, 1997 09:00 EEST = 06:00 UTC | Thessaloniki (40.64°N, 22.94°E)
const NATAL = calcNatal(1997, 4, 20, 6, 40.6401, 22.9444)

// Current: June 1, 2026 12:00 UTC
const TRANSITS = calcTransits(2026, 6, 1, 12)

const ASPECTS = calcAspects(NATAL, TRANSITS)

// ── Helpers ───────────────────────────────────────────────────────────────

const SIGN_SYMBOLS: Record<string, string> = {
  Aries:'♈', Taurus:'♉', Gemini:'♊', Cancer:'♋', Leo:'♌', Virgo:'♍',
  Libra:'♎', Scorpio:'♏', Sagittarius:'♐', Capricorn:'♑', Aquarius:'♒', Pisces:'♓',
}

const ASPECT_GLYPH: Record<string, string> = {
  Conjunction:'☌', Opposition:'☍', Trine:'△', Square:'□', Sextile:'✶',
}

const ASPECT_COLOR: Record<string, string> = {
  Conjunction: 'var(--gold)',
  Opposition:  'var(--blush)',
  Trine:       'var(--sage)',
  Square:      '#B06050',
  Sextile:     'var(--sage-lt)',
}

function formatPos(p: PlanetPos) {
  return `${p.signDeg}°${String(p.signMin).padStart(2,'0')}′ ${p.sign}`
}

function PlanetRow({ p, color }: { p: PlanetPos; color?: string }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '28px 1fr auto',
      alignItems: 'center',
      gap: 10,
      padding: '10px 0',
      borderBottom: '1px solid rgba(160,133,88,0.1)',
    }}>
      <span style={{ fontSize: 18, color: color ?? 'var(--gold)', fontFamily: 'serif', textAlign: 'center' }}>
        {p.symbol}
      </span>
      <span style={{ fontFamily: 'var(--f-serif)', fontSize: 15, color: 'var(--ink)' }}>
        {p.name}
      </span>
      <span style={{ fontSize: 12, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
        {SIGN_SYMBOLS[p.sign]} {formatPos(p)}
      </span>
    </div>
  )
}

function AspectCard({ a, i }: { a: AspectInfo; i: number }) {
  const color = ASPECT_COLOR[a.aspect] ?? 'var(--gold)'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.04, ease: 'easeOut' }}
      style={{
        padding: '20px 22px',
        border: `1px solid ${color}35`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 2,
        background: `${color}08`,
        marginBottom: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 18, color, fontFamily: 'serif' }}>{ASPECT_GLYPH[a.aspect]}</span>
        <span style={{ fontFamily: 'var(--f-serif)', fontSize: 17, color: 'var(--ink)', fontWeight: 400 }}>
          {a.transitPlanet} {a.aspect} natal {a.natalPlanet}
        </span>
        <span style={{
          fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
          color, padding: '3px 8px', border: `1px solid ${color}50`, borderRadius: 1,
          marginLeft: 'auto',
        }}>
          {a.orb}° orb
        </span>
      </div>
      {/* Interpretation */}
      <p style={{ fontSize: 13.5, fontWeight: 300, color: 'var(--ink-soft)', lineHeight: 1.72, margin: 0 }}>
        {a.interpretation}
      </p>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────

export default function SectionTransits() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const personalNatal  = NATAL.filter(p => ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Ascendant','MC'].includes(p.name))
  const outerNatal     = NATAL.filter(p => ['Uranus','Neptune','Pluto'].includes(p.name))
  const personalTransits = TRANSITS.filter(p => ['Sun','Moon','Mercury','Venus','Mars'].includes(p.name))
  const socialTransits   = TRANSITS.filter(p => ['Jupiter','Saturn'].includes(p.name))
  const outerTransits    = TRANSITS.filter(p => ['Uranus','Neptune','Pluto'].includes(p.name))

  // Show only the most impactful aspects (tight orb or major)
  const keyAspects = ASPECTS.filter(a =>
    (a.quality === 'major' && a.orb <= 6) || (a.quality === 'minor' && a.orb <= 3)
  )

  return (
    <section
      ref={ref}
      style={{
        padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px)',
        background: 'var(--cream)',
        position: 'relative',
      }}
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}
      >
        <span style={{ width: 32, height: 1, background: 'var(--gold)', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500 }}>
          Natal Chart & Transits
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(32px,4.5vw,52px)',
          fontWeight: 400,
          color: 'var(--ink)',
          lineHeight: 1.1,
          marginBottom: 6,
          letterSpacing: '-0.01em',
        }}
      >
        April 20, 1997 · Thessaloniki
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.18 }}
        style={{ fontSize: 13, color: 'var(--ink-mute)', letterSpacing: '0.08em', marginBottom: 'clamp(40px,6vw,72px)' }}
      >
        09:00 EEST · 40°38′N 22°56′E · Transits for June 1, 2026
      </motion.p>

      {/* Two-column grid */}
      <div className="transits-layout">

        {/* Left: Natal + Transit positions */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.22 }}
        >
          {/* Natal chart */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              Natal Chart
            </div>
            {personalNatal.map(p  => <PlanetRow key={p.name} p={p} />)}
            {outerNatal.map(p     => <PlanetRow key={p.name} p={p} color="var(--ink-mute)" />)}
          </div>

          {/* Current transits */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: 16 }}>
              Current Transits · Jun 1, 2026
            </div>
            {personalTransits.map(p  => <PlanetRow key={p.name} p={p} color="var(--sage)" />)}
            {socialTransits.map(p    => <PlanetRow key={p.name} p={p} color="var(--sage-lt)" />)}
            {outerTransits.map(p     => <PlanetRow key={p.name} p={p} color="var(--ink-mute)" />)}
          </div>
        </motion.div>

        {/* Right: Active aspects */}
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--blush)', marginBottom: 20 }}>
            Active Aspects & Interpretations
          </div>
          {keyAspects.length === 0 && (
            <p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>No aspects within tight orb right now.</p>
          )}
          {keyAspects.map((a, i) => <AspectCard key={`${a.transitPlanet}-${a.natalPlanet}-${a.aspect}`} a={a} i={i} />)}
        </div>

      </div>
    </section>
  )
}
