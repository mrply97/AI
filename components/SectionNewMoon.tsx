'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Data ──────────────────────────────────────────────────────────────────
//
// New Moon: June 15 2026, 03h UTC — 24°03' Gemini (84.06°)
// House:    1st (Gemini = 1st for Gemini rising)
// Key NM aspects to natal A:
//   Trine A Jupiter 318° (orb 5.95°) — husband significator
//   Trine A MC      319° (orb 5.18°) — career/public life
//
// Sky at the New Moon:
//   Saturn 13°19' Aries = sextile A ASC 13°26' Gemini at 0.07° — near-exact
//   Saturn first pass through A natal Saturn 12°47' (Saturn Return, first crossing)
//   Uranus 2°52' Gemini — already in 1st house with the New Moon
//   Jupiter 26°51' Cancer — still in 2nd house (self-worth active)
//
// Arc endpoint: Uranus reaches 24° Gemini in 2032 — the exact New Moon seed degree.
// Jupiter Return: Jupiter back in Aquarius 2032-2033, approaching natal 18° Aquarius.
// ─────────────────────────────────────────────────────────────────────────

interface Milestone {
  year: string
  period: string
  title: string
  planet: string
  planetColor: string
  house: string
  houseTheme: string
  body: string
  isMarker?: boolean
}

const MILESTONES: Milestone[] = [
  {
    year: '2026',
    period: 'June 15',
    title: 'The Seed — New Moon 24° Gemini',
    planet: '☉☽',
    planetColor: '#C9AA7C',
    house: '1st house',
    houseTheme: 'Identity · Self · New Beginnings',
    isMarker: true,
    body: 'The New Moon lands at 24°03\' Gemini in your 1st house — your rising sign, your face to the world. At the exact same moment, Saturn forms a sextile to your Ascendant at 0.07° orb, offering structural support for whatever identity you choose to plant. The New Moon simultaneously trines your natal Jupiter (husband significator) and MC (career/public life). This is not a generic new moon. It is landing precisely at the intersection of self, love, and life purpose. Six days earlier, Venus conjunct Jupiter filled your 2nd house with self-worth. Now you plant from a full cup.',
  },
  {
    year: '2026',
    period: 'Dec 24',
    title: 'First Fruition — Full Moon in Cancer',
    planet: '☽',
    planetColor: '#7A9E8A',
    house: '2nd house',
    houseTheme: 'First harvest · Material confirmation',
    body: 'The Full Moon that echoes this New Moon falls on December 24 — the same window as the December synastry declaration peak (Mars trine your Venus, Venus conjunct B Moon). The emotional seed planted in June becomes visible as external reality. What you imagined for yourself in June begins to take concrete form: in the relationship, in finances, in how others see you.',
  },
  {
    year: '2027',
    period: 'Feb 25',
    title: 'Saturn Return — The Foundation Test',
    planet: '♄',
    planetColor: '#8A9080',
    house: '11th house',
    houseTheme: 'Structure · Authenticity · What is truly yours',
    body: 'Transit Saturn returns to your natal Saturn (12°47\' Aries) exactly. Everything set in motion in June 2026 — every intention, every relationship, every direction — is audited by Saturn\'s unsparing honesty. What is built on genuine desire survives and strengthens. What is built on fear or expectation dissolves. The natal Jupiter trine Saturn in your chart (and in the synastry) means the foundations you\'ve chosen are architecturally sound. This is the test that proves it.',
  },
  {
    year: '2027',
    period: 'Sep onwards',
    title: 'Jupiter in Virgo — The Home Foundation',
    planet: '♃',
    planetColor: '#9A8A60',
    house: '4th house',
    houseTheme: 'Home · Family · Roots · Private world',
    body: 'Jupiter moves into Virgo — your 4th house of home, family, and psychological foundations. The external expansion of 2026 (finances, communication) turns inward: creating a home life that genuinely supports who you are becoming. Virgo Jupiter in the 4th refines and perfects the domestic environment. If the relationship is moving toward permanence, this is when shared home intentions solidify.',
  },
  {
    year: '2028',
    period: 'Jul – Nov',
    title: 'Uranus conjunct your Ascendant — The Liberation Peak',
    planet: '♅',
    planetColor: '#70A8A8',
    house: '1st house',
    houseTheme: 'Identity · Freedom · Breakthrough',
    isMarker: true,
    body: 'The most personally significant transit of this entire arc. Uranus reaches your exact Ascendant degree (13°26\' Gemini) and stations there for four months — a once-in-84-year event at your rising sign. The person you set the intention to become in June 2026 fully arrives. Others will notice: something about you has fundamentally changed in ways that cannot be explained by ordinary effort. This is also the peak activation of the synastry\'s B Mars conjunct A ASC contact (74° ≈ 73.44°). The external recognition of who you are — personally and in the relationship — reaches its highest point.',
  },
  {
    year: '2029',
    period: 'Jun onwards',
    title: 'Jupiter in Libra — The Joy and Romance House',
    planet: '♃',
    planetColor: '#9A8A60',
    house: '5th house',
    houseTheme: 'Romance · Creativity · Children · Pure joy',
    body: 'Jupiter enters Libra — your 5th house of love affairs, creative expression, joy, and children. This is Jupiter in the house that rules what makes life worth living. After the structural tests of 2027 and the liberation peak of 2028, 2029 delivers the reward: genuine, light-hearted joy. Creative projects find audiences. Romantic life is generous and warm. If children are part of the dream, this is the most fertility-blessed year in the arc.',
  },
  {
    year: '2030',
    period: 'Jul & 2031 Apr',
    title: 'Neptune sextile your Ascendant — The Spiritual Identity',
    planet: '♆',
    planetColor: '#5A70A0',
    house: '1st house',
    houseTheme: 'Vision · Spiritual opening · Embodied dream',
    body: 'Neptune forms an exact sextile to your Ascendant at 0.06° orb — near-zero precision — in July 2030 and again in April 2031. Neptune sextiling the Ascendant is the moment your inner vision and outer appearance merge. The dream you planted in June 2026 begins to have a quality that others can sense without being told. Creative, spiritual, and healing capacities in your identity are accessible in a way they never were before. This is not illusion — Neptune sextile is a gentle, flowing gift, not a dissolution.',
  },
  {
    year: '2031',
    period: 'Jun onwards',
    title: 'Jupiter in Sagittarius — The Marriage House',
    planet: '♃',
    planetColor: '#9A8A60',
    house: '7th house',
    houseTheme: 'Partnership · Marriage · Committed relationship',
    isMarker: true,
    body: 'Jupiter moves into Sagittarius — your 7th house of partnership and marriage. This is the most direct astrological window for formal commitment in the entire 2026–2033 arc. Jupiter in the 7th house expands, blesses, and opens doors in the domain of long-term relationships. Combined with everything built since 2026 — the synastry foundation, the 2027 structural test, the 2028 liberation, the 2029 joy — 2031 is when the relationship fully steps into its public, formalised form.',
  },
  {
    year: '2032',
    period: 'Jan – Aug',
    title: 'Uranus reaches 24° Gemini — The Seed Degree',
    planet: '♅',
    planetColor: '#70A8A8',
    house: '1st house',
    houseTheme: 'Full circle · Completion of liberation arc',
    isMarker: true,
    body: 'Uranus arrives at 24°35\' Gemini — the exact degree of the New Moon you planted on June 15, 2026. This is not a coincidence; it is the chart completing its own arc. What was seeded as an intention in 2026 now receives the full Uranian breakthrough treatment. The liberation that began when Uranus entered your 1st house in 2025 culminates here, at the precise degree where the dream was planted. By August 2032, Uranus reaches 29° Gemini — the final degree of your 1st house. The revolution of self is complete.',
  },
  {
    year: '2033',
    period: 'Full year',
    title: 'Jupiter Return — The First Cycle Closes',
    planet: '♃',
    planetColor: '#C9AA7C',
    house: '9th house',
    houseTheme: 'Philosophy · Expansion · Wisdom · Jupiter Return',
    isMarker: true,
    body: 'Jupiter returns to Aquarius — your natal Jupiter sign — for the first time since birth, approaching your natal 18°07\' Aquarius. A Jupiter Return is the 12-year completion: the expansion that began in June 2026 (when the New Moon trined this very Jupiter) comes full circle. What you dreamed is now your philosophy of life, not just your aspiration. The husband significator Jupiter in its natal home, aligned with the MC, says: the life built through this arc — identity, relationship, career, home — is recognisably the life you chose on that June morning in 2026.',
  },
]

// ── Sky snapshot at the New Moon ─────────────────────────────────────────

const SKY_PLANETS = [
  { name: 'New Moon', pos: '24°03\' Gemini', note: '1st house — identity seed', highlight: true },
  { name: 'Uranus',   pos: '2°52\' Gemini',  note: '1st house — liberation already present' },
  { name: 'Saturn',   pos: '13°19\' Aries',  note: 'sextile A ASC at 0.07° — structural support' },
  { name: 'Jupiter',  pos: '26°51\' Cancer', note: '2nd house — self-worth still expanding' },
  { name: 'Venus',    pos: '1°57\' Leo',     note: '3rd house — love energy moving forward' },
  { name: 'Mars',     pos: '20°08\' Taurus', note: 'approaching natal Sun — vitality rising' },
  { name: 'Pluto',    pos: '4°47\' Aquarius',note: '9th house — deep belief transformation' },
  { name: 'Neptune',  pos: '4°17\' Aries',   note: '11th house — social vision dissolving/rebuilding' },
]

const NM_ASPECTS = [
  { asp: '△ Trine', target: 'A Jupiter (18°07\' Aquarius)', orb: '5.95°', meaning: 'New beginning trines husband significator' },
  { asp: '△ Trine', target: 'A MC (18°53\' Aquarius)', orb: '5.18°', meaning: 'New beginning trines career/public life axis' },
  { asp: '✶ Sextile', target: 'A ASC by Saturn (13°26\' Gem)', orb: '0.07°', meaning: 'Saturn sextile ASC at New Moon moment — structural support' },
]

// ── Sub-components ────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
      <span style={{ height: '1px', width: '32px', background: 'var(--gold-lt)', flexShrink: 0 }} />
      <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
        {text}
      </span>
    </div>
  )
}

function MilestoneCard({ m, i }: { m: Milestone; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.06 }}
      style={{ display: 'flex', gap: '20px', marginBottom: '28px' }}
    >
      {/* Timeline spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '48px' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.06 + 0.1 }}
          style={{
            width: m.isMarker ? '44px' : '34px',
            height: m.isMarker ? '44px' : '34px',
            borderRadius: '50%',
            background: m.isMarker ? m.planetColor : 'rgba(244,239,228,0.8)',
            border: `2px solid ${m.planetColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: m.isMarker ? '16px' : '14px',
            flexShrink: 0,
            boxShadow: m.isMarker ? `0 0 0 4px ${m.planetColor}20` : 'none',
          }}
        >
          <span style={{ color: m.isMarker ? 'white' : m.planetColor }}>{m.planet}</span>
        </motion.div>
        {i < MILESTONES.length - 1 && (
          <div style={{
            width: '1px',
            flex: 1,
            minHeight: '24px',
            background: `linear-gradient(180deg, ${m.planetColor}40, rgba(160,133,88,0.1))`,
            marginTop: '4px',
          }} />
        )}
      </div>

      {/* Card */}
      <div style={{
        flex: 1,
        paddingBottom: '20px',
        borderBottom: i < MILESTONES.length - 1 ? '1px solid rgba(160,133,88,0.08)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span style={{
            fontFamily: 'var(--f-serif)',
            fontSize: 'clamp(20px, 2.5vw, 26px)',
            fontWeight: 300,
            color: m.planetColor,
            lineHeight: 1,
          }}>{m.year}</span>
          <span style={{ fontSize: '12px', color: 'var(--ink-mute)', fontStyle: 'italic', fontFamily: 'var(--f-serif)' }}>
            {m.period}
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(15px, 1.8vw, 18px)',
          fontWeight: 400,
          color: 'var(--ink)',
          marginBottom: '6px',
          lineHeight: 1.3,
        }}>{m.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 400,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: m.planetColor,
            border: `1px solid ${m.planetColor}40`,
            padding: '3px 8px',
            borderRadius: '10px',
          }}>{m.house}</span>
          <span style={{ fontSize: '11px', color: 'var(--ink-mute)', fontStyle: 'italic' }}>{m.houseTheme}</span>
        </div>
        <div style={{ fontSize: '13.5px', lineHeight: 1.75, color: 'var(--ink-soft)' }}>{m.body}</div>
      </div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────

export default function SectionNewMoon() {
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
        style={{ marginBottom: 'clamp(40px, 6vw, 56px)', maxWidth: '760px' }}
      >
        <SectionLabel text="New Moon · 15 June 2026" />
        <h2 style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(36px, 5.5vw, 64px)',
          fontWeight: 300,
          lineHeight: 1.05,
          letterSpacing: '-0.015em',
          color: 'var(--ink)',
          marginBottom: '20px',
        }}>
          Plant the seed.<br />
          <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Watch it become your life.</span>
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 1.5vw, 15px)',
          lineHeight: 1.8,
          color: 'var(--ink-soft)',
          fontWeight: 300,
          maxWidth: '600px',
        }}>
          The New Moon at 24°03\' Gemini falls in your 1st house — your rising sign, your self.
          At the same moment Saturn sextiles your Ascendant at 0.07° orb, and the Moon trines
          both your natal Jupiter (husband significator) and MC. The intention you plant on June 15
          unfolds across a precise 7-year arc: Uranus will reach this exact degree in 2032,
          and Jupiter returns to its natal sign in 2033. This is not a monthly cycle. It is a life cycle.
        </p>
      </motion.div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 380px) 1fr',
        gap: 'clamp(32px, 5vw, 64px)',
        alignItems: 'start',
      }} className="new-moon-layout">

        {/* Left: sky snapshot + aspects */}
        <div style={{ position: 'sticky', top: '80px' }}>
          {/* New Moon glyph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #EDE7D8 0%, #1E1A14 45%)',
              boxShadow: '0 0 0 8px rgba(160,133,88,0.1), 0 0 32px rgba(160,133,88,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '28px', color: 'rgba(244,239,228,0.6)' }}>☽</span>
          </motion.div>

          {/* NM data */}
          <div style={{
            padding: '18px 20px',
            border: '1px solid rgba(160,133,88,0.2)',
            borderRadius: '4px',
            background: 'rgba(244,239,228,0.45)',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: '12px' }}>
              New Moon chart · Jun 15 2026 · 03h UTC
            </div>
            {SKY_PLANETS.map(p => (
              <div key={p.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '8px',
                padding: '5px 0',
                borderBottom: '1px solid rgba(160,133,88,0.07)',
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: p.highlight ? 600 : 400,
                  color: p.highlight ? 'var(--gold)' : 'var(--ink-soft)',
                  minWidth: '72px',
                }}>{p.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--ink)', fontFamily: 'var(--f-serif)' }}>{p.pos}</span>
              </div>
            ))}
          </div>

          {/* Aspects */}
          <div style={{
            padding: '16px 18px',
            border: '1px solid rgba(74,107,90,0.2)',
            borderRadius: '4px',
            background: 'rgba(74,107,90,0.04)',
          }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '12px' }}>
              New Moon → natal A
            </div>
            {NM_ASPECTS.map((a,i) => (
              <div key={i} style={{ marginBottom: i < NM_ASPECTS.length-1 ? '10px' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--sage)', fontWeight: 500 }}>{a.asp}</span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{a.target}</span>
                  <span style={{ fontSize: '10px', color: 'var(--ink-mute)', marginLeft: 'auto' }}>{a.orb}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-mute)', fontStyle: 'italic' }}>{a.meaning}</div>
              </div>
            ))}
          </div>

          {/* Uranus arc note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              marginTop: '16px',
              padding: '14px 16px',
              border: '1px solid rgba(112,168,168,0.25)',
              borderRadius: '4px',
              background: 'rgba(112,168,168,0.04)',
            }}
          >
            <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#70A8A8', marginBottom: '8px' }}>
              The Uranus Arc
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--ink-soft)' }}>
              Uranus enters Gemini 2025 → crosses your Ascendant (13°26\') in 2028 → reaches the New Moon\'s exact seed degree (24°03\') in 2032 → exits your 1st house into Cancer in 2032.
            </div>
            <div style={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              {[
                { y:'2026', deg:'2°54\'', pct: 0 },
                { y:'2028', deg:'13°26\'', pct: 47 },
                { y:'2030', deg:'15°32\'', pct: 54 },
                { y:'2032', deg:'24°35\'', pct: 95 },
              ].map(({ y, deg, pct }) => (
                <div key={y} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: '#70A8A8', minWidth: '32px' }}>{y}</span>
                  <div style={{
                    height: '3px',
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #70A8A840, #70A8A8)',
                    borderRadius: '2px',
                    transition: 'width 0.5s',
                  }} />
                  <span style={{ fontSize: '10px', color: 'var(--ink-mute)' }}>♅ {deg}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: milestone timeline */}
        <div>
          <div style={{
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            marginBottom: '28px',
          }}>The arc · 2026 – 2033</div>
          {MILESTONES.map((m, i) => <MilestoneCard key={i} m={m} i={i} />)}

          {/* How to use the New Moon */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{
              padding: '26px 28px',
              border: '1px solid rgba(160,133,88,0.25)',
              borderRadius: '4px',
              background: 'rgba(244,239,228,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, var(--gold), var(--sage-lt), transparent)',
            }} />
            <div style={{
              fontSize: '9px', fontWeight: 400, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px',
            }}>How to use this New Moon · June 15, 03h UTC</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                { area: 'Identity', q: 'Who am I choosing to become by 2033? What version of myself do I refuse to abandon?' },
                { area: 'Love', q: 'What do I want from a partnership — how do I want to be loved and seen? (NM trines Jupiter, your husband significator)' },
                { area: 'Career', q: 'What public achievement or recognition aligns with who I truly am? (NM trines MC)' },
                { area: 'Freedom', q: 'What patterns, roles, or identities am I finally willing to release? (Uranus already in 1st house)' },
              ].map(({ area, q }) => (
                <div key={area} style={{
                  padding: '12px 14px',
                  background: 'rgba(244,239,228,0.7)',
                  borderRadius: '3px',
                  border: '1px solid rgba(160,133,88,0.12)',
                }}>
                  <div style={{
                    fontSize: '9px', fontWeight: 500, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px',
                  }}>{area}</div>
                  <div style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--ink-soft)', fontStyle: 'italic' }}>{q}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '13px', lineHeight: 1.78, color: 'var(--ink-soft)' }}>
              The New Moon window is 48 hours: June 14–16. Write your intentions by hand.
              Be specific. The chart is trining your husband significator and MC simultaneously —
              intentions planted at this crossing point travel on two rails at once.
              You are not wishing. You are setting coordinates.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
