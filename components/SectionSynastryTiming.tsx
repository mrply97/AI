'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────

type WindowType = 'encounter' | 'deepening' | 'reflection' | 'commitment'

interface CrossingWindow {
  period: string
  month: string
  type: WindowType
  headline: string
  mechanism: string
  aActivation: string
  bActivation: string
  detail: string
  intensity: 1 | 2 | 3   // 3 = both charts lit simultaneously
}

// ── Palette ───────────────────────────────────────────────────────────────

const W_COLOR: Record<WindowType, string> = {
  encounter:  '#7A9E8A',
  deepening:  '#C9AA7C',
  reflection: '#8A7AAA',
  commitment: '#A06055',
}

const W_LABEL: Record<WindowType, string> = {
  encounter:  'Encounter',
  deepening:  'Deepening',
  reflection: 'Reflection',
  commitment: 'Commitment',
}

// ── How crossing synastry works ───────────────────────────────────────────
//
// A crossing synastry activation = a 2026 transit planet lands on a contact
// point that exists in BOTH charts simultaneously, firing the natal aspect
// from the outside. The tighter the natal synastry orb, the more potent the
// transit trigger.
//
// Key synastry axes targeted:
//   Axis 1: B Mars 74° ☌ A Ascendant 73°  (orb 1.09°) → "recognition/chemistry"
//   Axis 2: B Moon 215° ☍ A Venus 35°     (orb 0.10°) → "soul mirror / love"
//   Axis 3: B Venus 202° / B Sun 206°      → "B's relationship activation zone"
// ─────────────────────────────────────────────────────────────────────────

const WINDOWS: CrossingWindow[] = [
  {
    period: 'Jun 20 – Jul 5',
    month:  'June',
    type:   'encounter',
    intensity: 1,
    headline: 'Pre-field opens',
    mechanism: 'Venus at ~Gemini 25–29° approaches the synastry Mars-ASC cluster (Gemini 13–14°)',
    aActivation: 'Venus approaching A\'s Ascendant lowers social guard; first-impression energy is warm and receptive',
    bActivation: 'Venus approaching B\'s natal Mars (Gemini 14°) stirs desire and outward initiative',
    detail: 'Neither chart is fully activated yet, but the approach puts both people in a subtly heightened social state — the kind where you are more likely to notice someone new, or re-notice someone already known. Shared environments (events, circles, online) feel unusually generative.',
  },
  {
    period: 'Jul 8 – Jul 28',
    month:  'July',
    type:   'encounter',
    intensity: 3,
    headline: 'Dual ignition — the recognition window',
    mechanism: 'Transit Mars at Gemini 13–14° (73–74°) lands on both charts at the same moment',
    aActivation: 'Mars conjunct A\'s Ascendant (73°): projection of magnetism and physical presence; others register you as exceptionally direct and alive',
    bActivation: 'Mars conjunct B\'s natal Mars (74°): surge of initiative, drive, and desire to act — the exact natal Mars that is already on your Ascendant in synastry',
    detail: 'This is the strongest crossing activation of the year. The planet of action and chemistry transits the precise degree where B\'s Mars already sits on A\'s Ascendant natally — a natal orb of 1.09°. One transit is hitting two chart points simultaneously. Whatever space they share during this window carries an almost electric quality of recognition. The question is not whether attraction is felt — it is — but whether the circumstances allow it to surface. Any shared context in this window, from a party to a group chat, carries outsized significance.',
  },
  {
    period: 'Aug 17 – Sep 14',
    month:  'August',
    type:   'encounter',
    intensity: 2,
    headline: 'The social expansion window',
    mechanism: 'Jupiter sextile A\'s Ascendant (73°), harmonising with the Mars-ASC synastry zone',
    aActivation: 'Jupiter opens social and environmental doors; first impressions are benevolent and expansive; confidence peaks',
    bActivation: 'Jupiter at ~120° forms a sextile to B\'s natal Mars (74°) — the same synastry hotspot — bringing ease and opportunity around B\'s Gemini-zone drive',
    detail: 'Where July\'s Mars activation was electric and urgent, August–September\'s Jupiter activation is warm and door-opening. Shared environments feel abundant rather than charged. This is the window most suited to low-pressure meeting: mutual friends, professional crossover, group social settings, travel. The synastry\'s Mars-ASC axis is being held by Jupiter\'s expansion rather than Mars\'s urgency — easier to step into, less likely to overwhelm. A natural "how did we end up at the same place again" window.',
  },
  {
    period: 'Sep 8 – Oct 3',
    month:  'September',
    type:   'deepening',
    intensity: 2,
    headline: 'B\'s entire love axis activates',
    mechanism: 'Transit Venus moves through Libra 22° → Scorpio 4°, crossing B\'s natal Venus (202°), Sun (206°), and Moon (215°) in sequence — the full synastry axis endpoint',
    aActivation: 'As Venus approaches opposition to A\'s natal Venus (35°), A\'s desire and relationship awareness is heightened from across the zodiac',
    bActivation: 'Venus transiting B\'s entire Libra-Scorpio stellium: B feels unusually magnetic, relationship-ready, and emotionally open — the receptive "yes" state',
    detail: 'This is the window where the soul-mirror axis (B Moon ☍ A Venus, 0.1° orb) begins to light up from B\'s side. As Venus crosses B\'s Venus, then Sun, then Moon in slow succession, B moves through a natural readiness arc — first in values, then in identity, then in emotional availability. A would feel this as an inexplicable pull toward something unresolved. If they are already in contact, this is when conversation deepens. If not, shared environments during this window tend to feel charged with unspoken recognition.',
  },
  {
    period: 'Oct 4',
    month:  'October',
    type:   'reflection',
    intensity: 3,
    headline: 'Venus retrograde stations on the exact synastry axis',
    mechanism: 'Venus stations retrograde at Scorpio 21° (211°) — within 4° of B\'s Moon (215°) and forming a near-exact opposition to A\'s Venus (35°)',
    aActivation: 'Venus opposition to A\'s natal Venus: the soul-mirror relationship is held up as a question — what do I actually value here, and is it real?',
    bActivation: 'Venus stationing on B\'s natal Moon: the deepest emotional needs come to the surface involuntarily; attachment and vulnerability become difficult to avoid',
    detail: 'This is the most extraordinary transit intersection of the year for this pair. Venus does not station retrograde randomly at 211° — it stations within 4° of the exact natal Moon that forms the 0.1° opposition to A\'s Venus. Both charts are simultaneously activated: A\'s love axis is interrogated from outside, B\'s emotional core is exposed from within. This is not a meeting window. It is the window where the connection must be faced honestly — what it is, what it isn\'t, and what both people actually want from it. The retrograde asks: is this real, or an idea of something real? The answer reached here determines December.',
  },
  {
    period: 'Nov 15 – Dec 7',
    month:  'November',
    type:   'deepening',
    intensity: 2,
    headline: 'Venus direct stations on B\'s natal Venus — clarity returns',
    mechanism: 'Venus stations direct at Libra 22° (202°) — exactly on B\'s natal Venus',
    aActivation: 'Venus begins moving forward again: the fog lifts on A\'s relationship thinking; what was uncertain clarifies into decision',
    bActivation: 'Venus direct on B\'s natal Venus: B\'s relational capacity is renewed with greater self-knowledge; commitment and authentic feeling become possible again after the October audit',
    detail: 'After the Venus retrograde test, the direct station on B\'s natal Venus is the chart\'s way of saying: start again, but wiser. B\'s relationship nature is re-engaged not with the pre-retrograde idealism but with real clarity. For A, the opposition to Venus that was retrograde is now moving forward — action and forward momentum return. This is not yet the declaration window, but it is the window where both people would feel ready to have it.',
  },
  {
    period: 'Dec 8 – Dec 31',
    month:  'December',
    type:   'commitment',
    intensity: 3,
    headline: 'Double axis ignition — the declaration window',
    mechanism: 'Transit Mars trine A\'s Venus (35°) from Virgo 5° (155°) while transit Venus re-crosses B\'s Moon (215°)',
    aActivation: 'Mars trine A\'s Venus: the strongest action-oriented activation of A\'s love axis all year — courage, initiative, and desire to declare or act on what is felt',
    bActivation: 'Venus re-conjuncting B\'s Moon (215°): the exact natal Moon that is the other pole of the soul-mirror opposition; emotional openness and receptivity are at maximum',
    detail: 'Two separate transit planets are activating the two endpoints of the synastry\'s defining axis (B Moon 215° ☍ A Venus 35°, orb 0.10°) simultaneously from different angles. This does not happen by accident, and it does not happen again this year. Mars gives A the courage to act; Venus gives B the emotional openness to receive. If the October reflection was honest and the November clarity was used, December is when the relationship either steps into a new form — or the decision to do so becomes explicit. The natal Jupiter trine Saturn contact between the charts (long-term foundation) holds this window steady: whatever is decided here has structural durability.',
  },
]

// ── Sub-components ────────────────────────────────────────────────────────

function IntensityDots({ n }: { n: 1 | 2 | 3 }) {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1,2,3].map(i => (
        <span key={i} style={{
          width: i <= n ? '6px' : '4px',
          height: i <= n ? '6px' : '4px',
          borderRadius: '50%',
          background: i <= n ? 'currentColor' : 'transparent',
          border: '1px solid currentColor',
          opacity: i <= n ? 1 : 0.35,
          transition: 'all 0.2s',
        }} />
      ))}
    </div>
  )
}

function WindowCard({ w, i }: { w: CrossingWindow; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const col = W_COLOR[w.type]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
      style={{
        marginBottom: '20px',
        borderRadius: '4px',
        overflow: 'hidden',
        border: `1px solid ${w.intensity === 3 ? col + '55' : 'rgba(160,133,88,0.15)'}`,
        background: w.intensity === 3
          ? `linear-gradient(135deg, ${col}08 0%, rgba(244,239,228,0.4) 100%)`
          : 'rgba(244,239,228,0.35)',
      }}
    >
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px 12px',
        borderBottom: `1px solid ${col}25`,
        background: w.intensity === 3 ? `${col}10` : 'transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: 'var(--f-serif)',
            fontSize: '13px',
            color: 'var(--ink-mute)',
            fontStyle: 'italic',
            minWidth: '130px',
          }}>{w.period}</span>
          <div style={{ width: '1px', height: '14px', background: 'rgba(160,133,88,0.2)' }} />
          <span style={{
            fontFamily: 'var(--f-serif)',
            fontSize: '16px',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.2,
          }}>{w.headline}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ color: col }}>
            <IntensityDots n={w.intensity} />
          </div>
          <span style={{
            fontSize: '9px',
            fontWeight: 400,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: col,
            border: `1px solid ${col}45`,
            padding: '3px 8px',
            borderRadius: '10px',
          }}>{W_LABEL[w.type]}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 18px 16px' }}>
        {/* Mechanism */}
        <div style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.04em',
          color: col,
          marginBottom: '10px',
        }}>{w.mechanism}</div>

        {/* A / B activation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '12px',
        }}>
          {[
            { label: 'Your chart (A)', text: w.aActivation },
            { label: 'Their chart (B)', text: w.bActivation },
          ].map(({ label, text }) => (
            <div key={label} style={{
              padding: '10px 12px',
              background: 'rgba(244,239,228,0.6)',
              borderRadius: '3px',
              border: '1px solid rgba(160,133,88,0.12)',
            }}>
              <div style={{
                fontSize: '9px',
                fontWeight: 400,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
                marginBottom: '5px',
              }}>{label}</div>
              <div style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--ink-soft)' }}>{text}</div>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        <div style={{
          fontSize: '13px',
          lineHeight: 1.75,
          color: 'var(--ink-soft)',
          paddingTop: '4px',
          borderTop: '1px solid rgba(160,133,88,0.1)',
        }}>{w.detail}</div>
      </div>
    </motion.div>
  )
}

// ── Axis diagram ──────────────────────────────────────────────────────────

function AxisDiagram() {
  return (
    <div style={{
      padding: '20px 22px',
      border: '1px solid rgba(160,133,88,0.2)',
      borderRadius: '4px',
      background: 'rgba(244,239,228,0.45)',
      marginBottom: '32px',
    }}>
      <div style={{
        fontSize: '9px',
        fontWeight: 400,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--ink-mute)',
        marginBottom: '16px',
      }}>The two synastry axes being triggered in 2026</div>

      {/* Axis 1 */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'var(--f-serif)', fontSize: '14px', color: '#7A9E8A' }}>
            Axis I — Recognition
          </span>
          <span style={{ fontSize: '10px', color: 'var(--ink-mute)' }}>orb 1.09°</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>B Mars ♂ Gemini 14°</span>
          <span style={{ color: '#7A9E8A', fontSize: '16px' }}>☌</span>
          <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>A Ascendant ↑ Gemini 13°</span>
          <span style={{ fontSize: '10px', color: 'var(--ink-mute)', marginLeft: '4px' }}>→ triggered by transit Mars Jul & Jupiter Aug</span>
        </div>
      </div>

      {/* Axis 2 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'var(--f-serif)', fontSize: '14px', color: '#C9AA7C' }}>
            Axis II — Soul Mirror
          </span>
          <span style={{ fontSize: '10px', color: 'var(--ink-mute)' }}>orb 0.10° — exact</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>B Moon ☽ Scorpio 5°</span>
          <span style={{ color: '#C9AA7C', fontSize: '16px' }}>☍</span>
          <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>A Venus ♀ Taurus 5°</span>
          <span style={{ fontSize: '10px', color: 'var(--ink-mute)', marginLeft: '4px' }}>→ triggered by Venus Rx Oct &amp; Mars △ Dec</span>
        </div>
      </div>
    </div>
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

// ── Month strip ───────────────────────────────────────────────────────────

const MONTHS_ORDER = ['June','July','August','September','October','November','December']

// ── Main section ─────────────────────────────────────────────────────────

export default function SectionSynastryTiming() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  const grouped = MONTHS_ORDER.reduce<Record<string, CrossingWindow[]>>((acc, m) => {
    acc[m] = WINDOWS.filter(w => w.month === m)
    return acc
  }, {})

  // global card index for stagger delay
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
        style={{ marginBottom: 'clamp(32px, 5vw, 48px)', maxWidth: '720px' }}
      >
        <SectionLabel text="Crossing Synastry · 2026 Timing" />
        <h2 style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(34px, 5vw, 58px)',
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          color: 'var(--ink)',
          marginBottom: '20px',
        }}>
          When the transits fire both charts at once.
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 1.5vw, 15px)',
          lineHeight: 1.78,
          color: 'var(--ink-soft)',
          fontWeight: 300,
          maxWidth: '580px',
        }}>
          A crossing synastry activation occurs when a 2026 transit planet lands on a contact
          point that exists in both charts simultaneously — triggering the natal aspect from the
          outside. Three dots indicate both charts lit at once; those windows carry the most weight.
        </p>
      </motion.div>

      {/* Intensity legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}
      >
        {([1,2,3] as const).map(n => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ color: 'var(--gold)' }}><IntensityDots n={n} /></div>
            <span style={{ fontSize: '11px', color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>
              {n === 1 ? 'One chart active' : n === 2 ? 'Both charts approached' : 'Both charts exact'}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Axis diagram */}
      <AxisDiagram />

      {/* Month-by-month windows */}
      {MONTHS_ORDER.map(month => {
        const windows = grouped[month]
        if (!windows.length) return null
        return (
          <div key={month} style={{ marginBottom: '36px' }}>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '14px',
              }}
            >
              <span style={{
                fontFamily: 'var(--f-serif)',
                fontSize: 'clamp(18px, 2.2vw, 22px)',
                fontWeight: 300,
                color: 'var(--ink)',
                letterSpacing: '0.02em',
              }}>{month}</span>
              <span style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(160,133,88,0.2), transparent)' }} />
            </motion.div>
            {windows.map(w => {
              const idx = cardIdx++
              return <WindowCard key={w.period} w={w} i={idx % 4} />
            })}
          </div>
        )
      })}

      {/* Bottom synthesis */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{
          marginTop: '8px',
          padding: '26px 28px',
          border: '1px solid rgba(160,133,88,0.25)',
          borderRadius: '4px',
          background: 'rgba(74,107,90,0.03)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--gold), var(--sage-lt), transparent)',
        }} />
        <div style={{
          fontSize: '9px',
          fontWeight: 400,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '10px',
        }}>Year Arc Summary</div>
        <div style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'var(--ink)',
          lineHeight: 1.5,
          marginBottom: '14px',
        }}>
          July opens the door. October asks if you mean it. December answers.
        </div>
        <div style={{ fontSize: '13.5px', lineHeight: 1.8, color: 'var(--ink-soft)' }}>
          The year has three crossing activation peaks — July (recognition), October (mirror),
          December (action). The chart does not give you three of these; most years give you one
          or none. The same two synastry axes are triggered each time, building on each other:
          first the chemistry is felt (Mars-ASC, July), then the love is acknowledged (Moon-Venus,
          October), then the intention is declared (both axes simultaneously, December).
          The architecture of this year is unusual. It is written like a progression, not like
          a coincidence.
        </div>
      </motion.div>
    </section>
  )
}
