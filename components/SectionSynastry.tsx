'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────

type AspectQuality = 'magnetic' | 'transformative' | 'supportive' | 'tense'

interface SynastryAspect {
  b: string          // Person B planet
  aspect: string     // symbol
  a: string          // Person A planet
  orb: number
  quality: AspectQuality
  headline: string
  detail: string
}

interface Theme {
  title: string
  quality: AspectQuality
  body: string
}

// ── Palette ───────────────────────────────────────────────────────────────

const Q_COLOR: Record<AspectQuality, string> = {
  magnetic:      '#7A9E8A',
  supportive:    '#C9AA7C',
  transformative:'#8A5A8A',
  tense:         '#B07050',
}

const Q_LABEL: Record<AspectQuality, string> = {
  magnetic:      'Magnetic',
  supportive:    'Supportive',
  transformative:'Transformative',
  tense:         'Tension',
}

// ── Person B natal positions ──────────────────────────────────────────────
// Extracted from Astro-Seek chart (approx. 1990s birth)

const PERSON_B: { name: string; symbol: string; deg: number; sign: string; signDeg: number }[] = [
  { name: 'Sun',     symbol: '☉', deg: 205.80, sign: 'Libra',       signDeg: 25 },
  { name: 'Moon',    symbol: '☽', deg: 214.87, sign: 'Scorpio',     signDeg:  4 },
  { name: 'Mercury', symbol: '☿', deg: 203.92, sign: 'Libra',       signDeg: 23 },
  { name: 'Venus',   symbol: '♀', deg: 202.42, sign: 'Libra',       signDeg: 22 },
  { name: 'Mars',    symbol: '♂', deg:  74.53, sign: 'Gemini',      signDeg: 14 },
  { name: 'Jupiter', symbol: '♃', deg: 130.90, sign: 'Leo',         signDeg: 10 },
  { name: 'Saturn',  symbol: '♄', deg: 289.27, sign: 'Capricorn',   signDeg: 19 },
  { name: 'Uranus',  symbol: '♅', deg: 276.10, sign: 'Capricorn',   signDeg:  6 },
  { name: 'Neptune', symbol: '♆', deg: 281.97, sign: 'Capricorn',   signDeg: 11 },
  { name: 'Pluto',   symbol: '♇', deg: 226.83, sign: 'Scorpio',     signDeg: 16 },
]

// ── Key synastry aspects (B → A, tightest orb first) ─────────────────────

const ASPECTS: SynastryAspect[] = [
  {
    b: '☽ Moon',   aspect: '☍', a: '♀ Venus',
    orb: 0.10, quality: 'magnetic',
    headline: 'Moon opposite Venus — soul mirror',
    detail: 'This is the rarest of romantic signatures: their Moon lands exactly opposite your Venus, a 0.1° orb. They instinctively mirror your emotional needs in love; you feel seen without having to explain yourself. There is strong pull toward idealisation — keep it grounded.',
  },
  {
    b: '♇ Pluto',  aspect: '✶', a: '♂ Mars',
    orb: 0.27, quality: 'transformative',
    headline: 'Pluto sextile Mars — deep magnetism',
    detail: 'Their Pluto sextiles your Mars with near-perfect precision. Sexual intensity and mutual obsession are themes. You activate each other\'s drive; they transform how you use your willpower. This aspect survives long separations intact.',
  },
  {
    b: '♆ Neptune', aspect: '☐', a: '♄ Saturn',
    orb: 0.81, quality: 'tense',
    headline: 'Neptune square Saturn — illusion vs. structure',
    detail: 'Their Neptune squares your Saturn: their idealism meets your need for realism and security. This can dissolve your boundaries over time or inspire you to dream bigger. The tension is a creative friction — best navigated with honesty about expectations.',
  },
  {
    b: '♂ Mars',   aspect: '☌', a: '↑ Ascendant',
    orb: 1.09, quality: 'magnetic',
    headline: 'Mars conjunct Ascendant — physical chemistry',
    detail: 'Their Mars sits directly on your rising sign. The attraction is immediate and physical; they project energy and assertion directly onto your first house persona. Passion, directness, and vitality characterise the dynamic from the first meeting.',
  },
  {
    b: '♇ Pluto',  aspect: '☐', a: '♃ Jupiter',
    orb: 1.28, quality: 'transformative',
    headline: 'Pluto square Jupiter — expanded transformation',
    detail: 'Their Pluto challenges your Jupiter\'s philosophical worldview. Over time, contact with them will uproot beliefs you thought permanent. The result is a deeper, more honest philosophy of life -- painful at first, profound in retrospect.',
  },
  {
    b: '♅ Uranus', aspect: '△', a: '♀ Venus',
    orb: 1.33, quality: 'magnetic',
    headline: 'Uranus trine Venus — liberation in love',
    detail: 'Their Uranus forms a flowing trine to your Venus. This is the "exciting stranger" energy -- they free you from habitual patterns in how you love and what you find beautiful. The relationship rarely feels routine; spontaneity keeps attraction alive.',
  },
  {
    b: '♂ Mars',   aspect: '✶', a: '♄ Saturn',
    orb: 1.75, quality: 'supportive',
    headline: 'Mars sextile Saturn — disciplined drive',
    detail: 'Their Mars sextiles your Saturn: they motivate you toward your long-term goals and you give their ambitions structure and focus. A quietly productive dynamic that builds tangible things together -- projects, plans, shared commitments.',
  },
  {
    b: '♃ Jupiter', aspect: '△', a: '♄ Saturn',
    orb: 1.88, quality: 'supportive',
    headline: 'Jupiter trine Saturn — long-term foundation',
    detail: 'Their Jupiter trines your Saturn, the classic indicator of lasting partnership. Expansion and responsibility balance each other. There is a feeling that this connection can grow into something stable over years, not just months.',
  },
  {
    b: '☉ Sun',    aspect: '☍', a: '☉ Sun',
    orb: 4.40, quality: 'tense',
    headline: 'Sun opposite Sun — complementary poles',
    detail: 'Your suns are in opposition (Taurus vs. Libra): you balance each other with different energies but can also clash in fundamental values. The key is learning that the difference is the point -- neither needs to change, but both need to stretch.',
  },
  {
    b: '☽ Moon',   aspect: '☍', a: '☉ Sun',
    orb: 4.67, quality: 'magnetic',
    headline: 'Moon opposite Sun — emotional resonance',
    detail: 'Their Moon opposes your Sun (a looser echo of a Full Moon synastry). They feel the pull of your solar vitality; you feel nourished by their emotional world. Classic across-the-room recognition energy.',
  },
]

// ── Year-long theme comparison ─────────────────────────────────────────────

const THEMES: Theme[] = [
  {
    title: 'The synastry amplifies your 2026 Venus transformation',
    quality: 'transformative',
    body: 'Transit Pluto is squaring your natal Venus all of 2026, and the synastry holds their Pluto squaring your Jupiter and their Uranus trining your Venus. The year is not just a transit event -- this connection is structurally wired to shake and liberate your relationship patterns. Expect genuine reinvention of what love means to you.',
  },
  {
    title: 'July peak is written in both charts',
    quality: 'magnetic',
    body: 'Your July 2026 peak (Mars transiting your Ascendant, Venus direct after June shadow) aligns perfectly with the natal B Mars conjunct your Ascendant. When transits re-activate natal contact points, the intensity multiplies. July 8--28 is the highest-resonance window of the year for this connection.',
  },
  {
    title: 'October Venus Rx pause is a test, not an ending',
    quality: 'tense',
    body: 'The Neptune square Saturn in synastry means illusion vs. structure is an ongoing theme. During Venus retrograde (Oct 4 -- Nov 15) this theme peaks: romantic ideals come under scrutiny. Use the pause to clarify what is real. The Moon opposite Venus exactness (0.1°) means the emotional bond survives -- but only if the conversation is honest.',
  },
  {
    title: 'December surge is supported by natal foundation',
    quality: 'supportive',
    body: 'The natal Jupiter trine Saturn and Mars sextile Saturn provide long-term structural support. The December 2026 peak (Mars trine Venus transit) lands on top of a chart built for sustained commitment. If the relationship has weathered October, December is when it deepens into something lasting.',
  },
]

// ── Sub-components ────────────────────────────────────────────────────────

function PlanetBadge({ planet }: { planet: typeof PERSON_B[0] }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 14px',
      border: '1px solid rgba(160,133,88,0.2)',
      borderRadius: '3px',
      background: 'rgba(244,239,228,0.5)',
    }}>
      <span style={{ fontSize: '18px', lineHeight: 1 }}>{planet.symbol}</span>
      <div>
        <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', color: 'var(--ink-soft)' }}>
          {planet.name}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--ink-mute)', letterSpacing: '0.04em' }}>
          {planet.signDeg}° {planet.sign}
        </div>
      </div>
    </div>
  )
}

function AspectCard({ asp, i }: { asp: SynastryAspect; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const col = Q_COLOR[asp.quality]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
      style={{
        borderLeft: `2px solid ${col}`,
        paddingLeft: '16px',
        paddingTop: '14px',
        paddingBottom: '14px',
        paddingRight: '16px',
        background: 'rgba(244,239,228,0.45)',
        borderRadius: '0 4px 4px 0',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--f-serif)',
            fontSize: '15px',
            letterSpacing: '0.06em',
            color: 'var(--ink)',
          }}>
            {asp.b} <span style={{ color: col }}>{asp.aspect}</span> {asp.a}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 400,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: col,
            border: `1px solid ${col}40`,
            padding: '3px 8px',
            borderRadius: '10px',
          }}>{Q_LABEL[asp.quality]}</span>
          <span style={{ fontSize: '10px', color: 'var(--ink-mute)' }}>{asp.orb.toFixed(2)}°</span>
        </div>
      </div>
      <div style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.06em',
        color: 'var(--ink-soft)',
        marginBottom: '6px',
      }}>{asp.headline}</div>
      <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--ink-soft)' }}>{asp.detail}</div>
    </motion.div>
  )
}

function ThemeCard({ theme, i }: { theme: Theme; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const col = Q_COLOR[theme.quality]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
      style={{
        borderLeft: `2px solid ${col}`,
        paddingLeft: '16px',
        paddingTop: '14px',
        paddingBottom: '14px',
        paddingRight: '14px',
        background: 'rgba(244,239,228,0.4)',
        borderRadius: '0 4px 4px 0',
        marginBottom: '16px',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
      }}>
        <span style={{
          fontSize: '9px',
          fontWeight: 400,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: col,
          border: `1px solid ${col}40`,
          padding: '3px 8px',
          borderRadius: '10px',
        }}>{Q_LABEL[theme.quality]}</span>
      </div>
      <div style={{
        fontFamily: 'var(--f-serif)',
        fontSize: '16px',
        fontWeight: 400,
        color: 'var(--ink)',
        marginBottom: '8px',
        lineHeight: 1.35,
      }}>{theme.title}</div>
      <div style={{ fontSize: '13px', lineHeight: 1.72, color: 'var(--ink-soft)' }}>{theme.body}</div>
    </motion.div>
  )
}

// ── Section label (reused pattern) ───────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
      <span style={{ height: '1px', width: '32px', background: 'var(--gold-lt)', flexShrink: 0 }} />
      <span style={{
        fontSize: '10px',
        fontWeight: 400,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
      }}>{text}</span>
    </div>
  )
}

// ── Main section ─────────────────────────────────────────────────────────

export default function SectionSynastry() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section style={{
      padding: 'clamp(64px, 10vh, 120px) clamp(24px, 6vw, 80px)',
      borderTop: '1px solid rgba(160,133,88,0.12)',
      position: 'relative',
    }}>
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 'clamp(40px, 6vw, 64px)', maxWidth: '680px' }}
      >
        <SectionLabel text="Synastry Reading" />
        <h2 style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(36px, 5vw, 60px)',
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          color: 'var(--ink)',
          marginBottom: '20px',
        }}>
          The charts that found each other.
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 1.5vw, 15px)',
          lineHeight: 1.78,
          color: 'var(--ink-soft)',
          fontWeight: 300,
          maxWidth: '540px',
        }}>
          Cross-chart analysis between your natal placements and the provided chart.
          Orbs under 2° are considered high-precision contacts — the tighter the orb,
          the more persistently the theme runs through the connection.
        </p>
      </motion.div>

      {/* Person B positions */}
      <div style={{ marginBottom: 'clamp(40px, 5vw, 56px)' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 400,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
          marginBottom: '14px',
        }}>Their natal positions</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '8px',
        }}>
          {PERSON_B.map(p => <PlanetBadge key={p.name} planet={p} />)}
        </div>
      </div>

      {/* Two-column: aspects + year themes */}
      <div className="synastry-layout">
        {/* Left: cross-chart aspects */}
        <div>
          <div style={{
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            marginBottom: '20px',
          }}>Cross-chart aspects · their planets → yours</div>
          {ASPECTS.map((asp, i) => <AspectCard key={i} asp={asp} i={i} />)}
        </div>

        {/* Right: year themes comparison */}
        <div>
          <div style={{
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            marginBottom: '20px',
          }}>How synastry maps to your 2026 love transits</div>
          {THEMES.map((t, i) => <ThemeCard key={i} theme={t} i={i} />)}

          {/* Verdict */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{
              marginTop: '32px',
              padding: '24px 28px',
              border: '1px solid rgba(160,133,88,0.3)',
              borderRadius: '4px',
              background: 'rgba(74,107,90,0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, var(--sage), var(--gold-lt), transparent)',
            }} />
            <div style={{
              fontSize: '9px',
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--sage)',
              marginBottom: '10px',
            }}>Compatibility Verdict · 2026</div>
            <div style={{
              fontFamily: 'var(--f-serif)',
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'var(--ink)',
              lineHeight: 1.55,
              marginBottom: '12px',
            }}>
              Yes — the synastry mirrors your 2026 love themes almost exactly.
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.78, color: 'var(--ink-soft)' }}>
              The Moon opposite Venus at 0.1° is a once-in-a-lifetime precision contact
              that echoes everything 2026 Pluto is asking you to transform: what you
              value in love, and whether you will let it be truly seen. Their Mars on
              your Ascendant and Uranus trine your Venus keep the attraction electric
              and liberating. The Neptune--Saturn tension is the real test — it asks
              both of you to choose clarity over comfort. The charts say yes.
              Your 2026 transits say the timing is now.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
