'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────

type PhaseType = 'test' | 'bloom' | 'peak' | 'depth' | 'approach'

interface Phase2027 {
  period: string
  month: string
  type: PhaseType
  headline: string
  transits: string[]
  aCrossing: string
  bCrossing: string
  intensity: 1 | 2 | 3
  detail: string
}

interface LongArc {
  title: string
  body: string
  color: string
}

// ── Palette ───────────────────────────────────────────────────────────────

const P_COLOR: Record<PhaseType, string> = {
  test:     '#B07050',
  bloom:    '#C9AA7C',
  peak:     '#7A9E8A',
  depth:    '#8A7AAA',
  approach: '#70A8A8',
}

const P_LABEL: Record<PhaseType, string> = {
  test:     'Structural Test',
  bloom:    'Bloom',
  peak:     'Peak Crossing',
  depth:    'Depth',
  approach: 'Uranus Approach',
}

// ── Data — precise dates from VSOP87 ephemeris ────────────────────────────
//
// Natal A: Venus 34.77° (Taurus 5°), Moon 180.69° (Libra 1°), Saturn 12.78° (Aries 13°),
//          Ascendant 73.44° (Gemini 13°)
// Natal B: Moon 214.87° (Scorpio 5°), Mars 74.53° (Gemini 14°), Venus 202.42° (Libra 22°)
//
// Key synastry axes:
//   Axis I  — B Mars 74° ☌ A ASC 73° (orb 1.09°)  — recognition/chemistry
//   Axis II — B Moon 215° ☍ A Venus 35° (orb 0.10°) — soul mirror

const LONG_ARCS: LongArc[] = [
  {
    title: 'Saturn Return echo (Jan – Apr 2027)',
    color: '#B07050',
    body: 'Transit Saturn reaches A\'s natal Saturn (12°47\' Aries) exactly on Feb 25, 2027 — the climax of the Saturn Return cycle that began in 2025. Whatever commitment was made in December 2026 is immediately subjected to Saturn\'s audit: is it real, durable, and built on honest foundations? This is not punishment. Saturn rewards what is genuine and dissolves what is not.',
  },
  {
    title: 'Uranus approaching Axis I — the whole of 2027',
    color: '#70A8A8',
    body: 'Uranus moves from Gemini 2° to Gemini 10° across 2027, ending the year only 3–4° from the synastry Mars-ASC axis (Gemini 13–14°). This creates a year-long background current of restlessness, authenticity hunger, and "is this connection free enough to breathe?" energy. Uranus will conjunct both A\'s Ascendant and B\'s natal Mars exactly in July–November 2028. The 2027 approach is the pressure that precedes the breakthrough.',
  },
  {
    title: 'No Venus retrograde in 2027',
    color: '#C9AA7C',
    body: 'Unlike 2026\'s Venus Rx pause in October, 2027 has no retrograde. Venus moves forward continuously, meaning there is no enforced period of reflection or delay in love matters. The year rewards momentum and initiative more than patience. Whatever momentum builds in early 2027 has no planetary braking system.',
  },
]

const PHASES: Phase2027[] = [
  {
    period: 'Feb 8 – 13',
    month:  'February',
    type:   'test',
    intensity: 2,
    headline: 'Mars trine Venus — passion inside the Saturn audit',
    transits: ['Mars △ A Venus (34.77°) from Virgo 5° (154°)', 'Saturn at A Saturn (12.78°) Feb 25'],
    aCrossing: 'Mars trine A Venus: desire and forward momentum in love; courage to act on feeling',
    bCrossing: 'Mars moving through Virgo activates no B natal point directly — this is primarily A\'s activation, but the Mars energy channels outward toward B',
    detail: 'The Saturn Return peaks two weeks after this Mars-Venus trine, making February\'s opening a critical window: the chart offers a surge of relational courage right before Saturn\'s structural audit arrives. The question Mars is asking — "do you want this, and will you act on it?" — is the same question Saturn will be asking for the rest of the month. The two transits reinforce each other: desire needs a foundation, and the foundation needs desire to be worth building.',
  },
  {
    period: 'Feb 25',
    month:  'February',
    type:   'test',
    intensity: 2,
    headline: 'Saturn Return exact — the foundation is weighed',
    transits: ['Saturn ☌ A Saturn (12.78° Aries) — exact', 'Saturn Return climax (~29th year)'],
    aCrossing: 'Saturn Return at A Saturn: life structures built on authentic choice survive; anything built on avoidance or compromise is revealed as insufficient',
    bCrossing: 'No direct B activation — this is A\'s inner audit. But B is the subject: the relationship sits on the scales. Does it align with who A is becoming, or does it belong to who A was?',
    detail: 'The Saturn Return is one of the most significant personal transits in a lifetime, occurring roughly every 29 years. At this exact degree, Saturn asks: what have you built that is truly yours, and what have you been carrying out of habit or fear? A relationship entered in 2026 — especially one declared in December — will be tested here for structural honesty. Relationships with real depth and mutual authenticity tend to deepen at Saturn Returns. Relationships based on excitement alone tend to dissolve. The natal synastry holds a Jupiter trine Saturn contact (B Jupiter △ A Saturn, orb 1.88°) — this is precisely the contact that says the connection has the structural template to endure.',
  },
  {
    period: 'May 17 – 27',
    month:  'May',
    type:   'bloom',
    intensity: 2,
    headline: 'Venus on Venus + Mars trine Venus — pure love energy',
    transits: ['Venus ☌ A Venus (34.77°) — May 17', 'Mars △ A Venus (34.77°) — May 22–27'],
    aCrossing: 'Venus on A\'s natal Venus (annual blessing): softness, beauty, receptivity, the desire to give and receive love fully',
    bCrossing: 'Mars at ~154° approaches opposition to B\'s natal Venus (202°) — B\'s relational desire is stirred from the outside',
    detail: 'Two Venus activations within 10 days: Venus conjuncting A\'s natal Venus (the annual sweetest day for A\'s love life) followed immediately by Mars trining it from Virgo. The double-activation in May makes this the warmest purely romantic window of the year. No pressure, no tests — just the quality of wanting and being wanted. If December 2026 established the relationship and February 2027 proved its foundation, May is when it simply feels good to be in it.',
  },
  {
    period: 'Aug 16 – 26',
    month:  'August',
    type:   'bloom',
    intensity: 2,
    headline: 'Jupiter trine Venus — abundance and expansion',
    transits: ['Jupiter △ A Venus (34.77°) from Virgo 25° — exact Aug 21', 'Jupiter entering Virgo Aug/Sep 2027'],
    aCrossing: 'Jupiter trine A Venus: the warmest, most generous love energy of the year — expansion, appreciation, social recognition, the desire to celebrate the relationship openly',
    bCrossing: 'Jupiter at 155° is sextile B natal Mars (74°) within 3° — the synastry Mars-ASC zone receives a benevolent, door-opening influence from Jupiter; B\'s initiative and confidence peak',
    detail: 'Jupiter trine Venus is among the most universally positive relationship transits available. Abundance flows into the love life — generosity, warmth, the impulse to share the relationship with the world. The fact that this simultaneously activates B\'s natal Mars (through sextile) means both people are energised and outward-facing. This is the natural window for making the relationship visible: introducing to family or friends, taking a significant trip together, or any form of social acknowledgement that says "this is real." Jupiter does not force — it opens doors and asks you to walk through them.',
  },
  {
    period: 'Sep 5 – 10',
    month:  'September',
    type:   'peak',
    intensity: 3,
    headline: 'Mars conjunct B Moon / opposes A Venus — dual axis crossing',
    transits: [
      'Mars ☌ B Moon (214.87°) — Sep 7',
      'Mars ☍ A Venus (34.77°) — Sep 7 (same transit, same degree)',
    ],
    aCrossing: 'Mars opposing A natal Venus: desire activated with urgency and directness — A feels summoned toward action in love; passivity becomes impossible',
    bCrossing: 'Mars conjuncting B natal Moon: B\'s emotional core is ignited; feelings that have been internalised surface with sudden intensity and need to be expressed',
    detail: 'This is the year\'s most potent crossing activation. Mars at Scorpio 5° (214.87°) sits simultaneously on B\'s natal Moon AND in direct opposition to A\'s natal Venus — which are themselves 0.10° apart in natal opposition. One transit is hitting both endpoints of the defining synastry axis at the exact same moment. In 2026, the soul-mirror axis was activated by Venus Rx stationing and then by Mars trine (from the softer 120° angle). In September 2027, Mars activates it in direct opposition — more urgent, more confrontational, more impossible to ignore. This is not a gentle moment. It is a moment for honest emotional conversation: what this connection means, where it is going, and whether both people are fully present in it. Whatever is unspoken between them will surface here, for better or worse.',
  },
  {
    period: 'Sep 12 – 14',
    month:  'September',
    type:   'depth',
    intensity: 2,
    headline: 'Venus conjunct A Moon — emotional tenderness follows',
    transits: ['Venus ☌ A Moon (180.69° Libra 1°) — exact Sep 13'],
    aCrossing: 'Venus on A\'s natal Moon: emotional warmth, receptivity, and vulnerability come easily; A is unusually open to being seen and cared for',
    bCrossing: 'Venus at Libra 1° is moving toward B\'s natal Venus (Libra 22°) — B\'s relational quality is softened and receptive',
    detail: 'Coming immediately after the intense Mars activation of Sep 5–10, this Venus-Moon transit acts as the tender resolution. If the Mars crossing opened something raw, Venus on the Moon offers the language to hold it. The sequence — Mars forces the conversation, Venus provides the context for it — mirrors the deeper synastry: B\'s Mars conjuncts A\'s Ascendant (direct, physical), while B\'s Moon opposes A\'s Venus (emotional, receptive). September 2027 recreates this synastry dynamic in transit form over nine days.',
  },
  {
    period: 'Oct 8 – 11',
    month:  'October',
    type:   'depth',
    intensity: 2,
    headline: 'Venus conjunct B Moon — the mirror holds',
    transits: ['Venus ☌ B Moon (214.87° Scorpio 5°) — exact Oct 9'],
    aCrossing: 'Venus at 215° is simultaneously opposing A\'s natal Venus (35°) — A\'s desire nature is activated from the outside, as if the relationship is reflecting beauty back',
    bCrossing: 'Venus conjuncting B\'s natal Moon: B\'s deepest emotional needs feel met and validated — the receptive, nurturing quality of B\'s Scorpio Moon is opened',
    detail: 'In 2026, Venus stationed retrograde near this exact degree (211°), creating a suspended, reflective moment. In 2027, Venus passes through the same zone moving direct and forward — the energy is resolved, not suspended. Where October 2026 asked "is this real?", October 2027 answers with quiet certainty. The soul-mirror axis (B Moon ☍ A Venus) is touched from B\'s side, just as in the September transit it was touched from the opposition side. The relationship in October 2027 has a quality of settled recognition — not the excitement of novelty, but the deeper satisfaction of being genuinely known.',
  },
  {
    period: 'Dec 2027 – Jul 2028',
    month:  'December',
    type:   'approach',
    intensity: 3,
    headline: 'Uranus at Gemini 8° — the liberation arc begins',
    transits: [
      'Uranus at Gemini 8° (68°) by Dec 2027 — 5° from A ASC and B natal Mars',
      'Uranus reaches exact 73–74° in Jul–Nov 2028',
    ],
    aCrossing: 'Uranus approaching A\'s Ascendant: increasing desire for authentic self-expression; conventional social roles feel restrictive; the relationship must give A room to evolve and surprise',
    bCrossing: 'Uranus approaching B\'s natal Mars (74°): disruption to how B initiates and pursues; the drive becomes less predictable, more free; old patterns of action no longer satisfy',
    detail: 'By end of 2027, Uranus is close enough to the synastry axis that both people can feel the charge building. This is not yet the conjunction — that arrives in summer 2028, when Uranus spends July through November directly on 73–74°, firing B\'s natal Mars and A\'s Ascendant simultaneously for months. But 2027 is the year the approach becomes palpable. Relationships that are authentic, flexible, and built on genuine freedom (rather than dependency or possessiveness) will thrive in this Uranian approach. Those built on comfort, routine, or the fear of being alone will feel the disruption keenly. The natal Uranus trine Venus in synastry (B Uranus △ A Venus, orb 1.33°) suggests the connection has the electrical, liberating quality Uranus favors. The 2028 conjunction is not a threat — it is the moment the relationship sheds whatever habit it has accumulated and is asked to be genuinely new again.',
  },
]

// ── Sub-components ────────────────────────────────────────────────────────

function IntensityDots({ n, color }: { n: 1|2|3; color: string }) {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', color }}>
      {([1,2,3] as const).map(i => (
        <span key={i} style={{
          width: i <= n ? '6px' : '4px',
          height: i <= n ? '6px' : '4px',
          borderRadius: '50%',
          background: i <= n ? 'currentColor' : 'transparent',
          border: '1px solid currentColor',
          opacity: i <= n ? 1 : 0.3,
        }} />
      ))}
    </div>
  )
}

function PhaseCard({ phase, i }: { phase: Phase2027; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const col = P_COLOR[phase.type]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.07 }}
      style={{
        marginBottom: '18px',
        borderRadius: '4px',
        overflow: 'hidden',
        border: `1px solid ${phase.intensity === 3 ? col + '60' : 'rgba(160,133,88,0.15)'}`,
        background: phase.intensity === 3
          ? `linear-gradient(135deg, ${col}0A 0%, rgba(244,239,228,0.45) 100%)`
          : 'rgba(244,239,228,0.35)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 18px 11px',
        borderBottom: `1px solid ${col}22`,
        background: phase.intensity === 3 ? `${col}0D` : 'transparent',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: 'var(--f-serif)',
            fontSize: '13px',
            fontStyle: 'italic',
            color: 'var(--ink-mute)',
            minWidth: '110px',
          }}>{phase.period}</span>
          <div style={{ width: '1px', height: '14px', background: 'rgba(160,133,88,0.2)' }} />
          <span style={{
            fontFamily: 'var(--f-serif)',
            fontSize: '15px',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.25,
          }}>{phase.headline}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IntensityDots n={phase.intensity} color={col} />
          <span style={{
            fontSize: '9px',
            fontWeight: 400,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: col,
            border: `1px solid ${col}40`,
            padding: '3px 8px',
            borderRadius: '10px',
          }}>{P_LABEL[phase.type]}</span>
        </div>
      </div>

      {/* Transits */}
      <div style={{ padding: '10px 18px 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {phase.transits.map((t, ti) => (
          <span key={ti} style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: col,
            background: `${col}14`,
            padding: '3px 10px',
            borderRadius: '2px',
          }}>{t}</span>
        ))}
      </div>

      {/* A / B crossing */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        padding: '10px 18px',
      }}>
        {[
          { label: 'Your chart (A)', text: phase.aCrossing },
          { label: 'Their chart (B)', text: phase.bCrossing },
        ].map(({ label, text }) => (
          <div key={label} style={{
            padding: '9px 12px',
            background: 'rgba(244,239,228,0.7)',
            borderRadius: '3px',
            border: '1px solid rgba(160,133,88,0.11)',
          }}>
            <div style={{
              fontSize: '9px',
              fontWeight: 400,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
              marginBottom: '4px',
            }}>{label}</div>
            <div style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--ink-soft)' }}>{text}</div>
          </div>
        ))}
      </div>

      {/* Detail */}
      <div style={{
        padding: '0 18px 16px',
        fontSize: '13px',
        lineHeight: 1.75,
        color: 'var(--ink-soft)',
        borderTop: '1px solid rgba(160,133,88,0.08)',
        paddingTop: '10px',
        marginTop: '-2px',
      }}>{phase.detail}</div>
    </motion.div>
  )
}

function ArcCard({ arc, i }: { arc: LongArc; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -14 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
      style={{
        borderLeft: `2px solid ${arc.color}`,
        paddingLeft: '14px',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingRight: '12px',
        background: 'rgba(244,239,228,0.4)',
        borderRadius: '0 4px 4px 0',
        marginBottom: '14px',
      }}
    >
      <div style={{
        fontFamily: 'var(--f-serif)',
        fontSize: '15px',
        fontWeight: 400,
        color: 'var(--ink)',
        marginBottom: '7px',
        lineHeight: 1.35,
      }}>{arc.title}</div>
      <div style={{ fontSize: '13px', lineHeight: 1.72, color: 'var(--ink-soft)' }}>{arc.body}</div>
    </motion.div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────

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

// ── Month grouping ────────────────────────────────────────────────────────

const MONTH_ORDER = ['January','February','March','April','May','June','July','August','September','October','November','December']

// ── Main section ─────────────────────────────────────────────────────────

export default function SectionSynastry2027() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  const grouped = MONTH_ORDER.reduce<Record<string, Phase2027[]>>((acc, m) => {
    acc[m] = PHASES.filter(p => p.month === m)
    return acc
  }, {})

  let cardIdx = 0

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
        style={{ marginBottom: 'clamp(32px, 5vw, 48px)', maxWidth: '740px' }}
      >
        <SectionLabel text="Synastry · 2027 Forecast" />
        <h2 style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(34px, 5vw, 58px)',
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          color: 'var(--ink)',
          marginBottom: '20px',
        }}>
          The year that tests what was built.
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 1.5vw, 15px)',
          lineHeight: 1.78,
          color: 'var(--ink-soft)',
          fontWeight: 300,
          maxWidth: '580px',
        }}>
          2027 opens with Saturn auditing whatever was declared in December 2026.
          The charts show continuation — and strengthening — but through a different
          kind of gate: structural honesty rather than electric attraction. Uranus
          approaches the synastry axis all year. The crossing activations shift from
          encounter and recognition to depth and permanence.
        </p>
      </motion.div>

      {/* Layout: long arcs left, timeline right */}
      <div className="synastry-layout">
        {/* Left: year-long arcs */}
        <div>
          <div style={{
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            marginBottom: '20px',
          }}>Year-long themes</div>
          {LONG_ARCS.map((a, i) => <ArcCard key={i} arc={a} i={i} />)}

          {/* 2027 vs 2026 contrast */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{
              marginTop: '8px',
              padding: '18px 20px',
              border: '1px solid rgba(160,133,88,0.2)',
              borderRadius: '4px',
              background: 'rgba(244,239,228,0.4)',
            }}
          >
            <div style={{
              fontSize: '9px',
              fontWeight: 400,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
              marginBottom: '10px',
            }}>2026 vs 2027 character</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { year: '2026', desc: 'Electric recognition. Venus Rx test. Declaration.' },
                { year: '2027', desc: 'Structural honesty. Emotional depth. Permanence.' },
              ].map(({ year, desc }) => (
                <div key={year} style={{
                  padding: '10px 12px',
                  background: 'rgba(244,239,228,0.7)',
                  borderRadius: '3px',
                }}>
                  <div style={{
                    fontFamily: 'var(--f-serif)',
                    fontSize: '18px',
                    color: 'var(--gold)',
                    marginBottom: '4px',
                  }}>{year}</div>
                  <div style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: month-by-month phases */}
        <div>
          <div style={{
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            marginBottom: '20px',
          }}>Month-by-month crossing activations</div>
          {MONTH_ORDER.map(month => {
            const phases = grouped[month]
            if (!phases.length) return null
            return (
              <div key={month} style={{ marginBottom: '28px' }}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--f-serif)',
                    fontSize: 'clamp(17px, 2vw, 21px)',
                    fontWeight: 300,
                    color: 'var(--ink)',
                    letterSpacing: '0.02em',
                  }}>{month}</span>
                  <span style={{
                    height: '1px',
                    flex: 1,
                    background: 'linear-gradient(90deg, rgba(160,133,88,0.18), transparent)',
                  }} />
                </motion.div>
                {phases.map(p => {
                  const idx = cardIdx++
                  return <PhaseCard key={p.period} phase={p} i={idx} />
                })}
              </div>
            )
          })}

          {/* Verdict */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{
              marginTop: '8px',
              padding: '24px 28px',
              border: '1px solid rgba(160,133,88,0.28)',
              borderRadius: '4px',
              background: 'rgba(74,107,90,0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, #70A8A8, var(--gold-lt), transparent)',
            }} />
            <div style={{
              fontSize: '9px',
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#70A8A8',
              marginBottom: '10px',
            }}>2027 Synastry Verdict</div>
            <div style={{
              fontFamily: 'var(--f-serif)',
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'var(--ink)',
              lineHeight: 1.5,
              marginBottom: '12px',
            }}>
              Yes — but through depth, not excitement.
            </div>
            <div style={{ fontSize: '13.5px', lineHeight: 1.8, color: 'var(--ink-soft)' }}>
              The synastry does not fade in 2027 — it matures. Saturn tests it in February,
              passion re-ignites it in May and August, and September delivers the year's
              most intense crossing activation: Mars hitting both endpoints of the 0.10° soul-mirror
              axis simultaneously. October and December are quieter but deeply confirming.
              The year-long Uranus approach is the chart saying: by 2028, this relationship
              will need to be genuinely free and authentic to survive what arrives.
              The natal Uranus trine Venus in synastry (B Uranus △ A Venus, 1.33° orb)
              suggests it already has that quality built in. 2027 is the year it proves it.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
