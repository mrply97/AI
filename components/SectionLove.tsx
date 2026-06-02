'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────

type Quality = 'peak' | 'flow' | 'caution' | 'pause'

interface LoveEvent {
  date: string
  label: string
  quality: Quality
  detail: string
}

interface MonthData {
  month: string
  rating: Quality
  headline: string
  events: LoveEvent[]
}

// ── Colour palette ────────────────────────────────────────────────────────

const Q_COLOR: Record<Quality, string> = {
  peak:    '#7A9E8A',   // sage
  flow:    '#C9AA7C',   // gold
  caution: '#B87040',   // amber
  pause:   '#8A5A8A',   // plum
}

const Q_LABEL: Record<Quality, string> = {
  peak:    'Peak',
  flow:    'Flowing',
  caution: 'Caution',
  pause:   'Step Back',
}

const Q_BG: Record<Quality, string> = {
  peak:    'rgba(122,158,138,0.07)',
  flow:    'rgba(201,170,124,0.07)',
  caution: 'rgba(184,112,64,0.06)',
  pause:   'rgba(138,90,138,0.07)',
}

// ── Data ──────────────────────────────────────────────────────────────────

const BACKDROP = [
  {
    symbol: '♇',
    title: 'Pluto ☐ natal Venus · all year',
    quality: 'caution' as Quality,
    text: "The deepest undercurrent of 2026's love life. Pluto in Aquarius squaring your natal Taurus Venus pulls at the roots of what you value, what you attract, and where you give your power away. Every romantic encounter this year carries a Plutonian charge — intensity, depth, and the potential for obsession or transformation. This is not a year for casual love. Connections formed now tend to be revealing and permanent.",
  },
  {
    symbol: '♆',
    title: 'Neptune ☍ natal Moon · all year',
    quality: 'caution' as Quality,
    text: "Neptune in Aries opposing your Libra Moon dissolves the emotional clarity you need to read partners accurately. You feel more, receive more, and are more easily enchanted — but also more susceptible to projecting ideals onto real people. Verify what you sense before you trust it. The boundary between love and fantasy is thinner than usual all year.",
  },
  {
    symbol: '♄',
    title: 'Saturn Return · all year, exact Sep 15',
    quality: 'flow' as Quality,
    text: "Saturn returning to its natal position means you are in the middle of a complete re-evaluation of what you want from partnership. Relationships that don't match your authentic direction become increasingly difficult to sustain. This is not a punishment — it's a clarification. By year's end you will know with more precision what you actually need from love.",
  },
]

const VENUS_RETRO = {
  start:  'Oct 4',
  end:    'Nov 15',
  sign:   'Scorpio → Libra',
  shadow: 'Sep 8',
  text:   "Venus stations retrograde at 8° Scorpio on October 4 and turns direct at 22° Libra on November 15. During this 41-day window: do not start new romantic relationships, do not make long-term commitments, do not make major financial decisions tied to love. Old relationships, old attractions, and unresolved emotional patterns resurface — deliberately. This is a window for reviewing, not initiating. The retrograde shadow begins September 8, so the energy shifts noticeably before the official station.",
}

const MONTHS: MonthData[] = [
  {
    month: 'June',
    rating: 'caution',
    headline: "Pluto peaks, old patterns surface",
    events: [
      { date: 'Jun 14', label: 'Venus ✶ natal Moon', quality: 'flow',    detail: "Brief sweet spot — heart opens easily, warmth flows. Good for a genuine conversation or a first move." },
      { date: 'Jun 16', label: 'Pluto ☐ natal Venus — exact', quality: 'caution', detail: "The year's most intense day for love. Power dynamics, obsessive feelings, or a relationship revelation. Stay conscious." },
      { date: 'Jun 18', label: 'Venus ☐ natal Venus', quality: 'caution', detail: "Desires and self-worth feel under pressure. What you want and what you believe you deserve may conflict." },
      { date: 'Jun 25', label: 'Venus ✶ Ascendant', quality: 'flow',    detail: "Brief charm window — you're attractive and socially at ease. Good for meeting people." },
      { date: 'Jun 29', label: 'Venus ☍ natal Jupiter', quality: 'caution', detail: "Over-idealization. Someone may seem perfect right now. They're not. Enjoy without over-investing." },
    ],
  },
  {
    month: 'July',
    rating: 'peak',
    headline: "The year's best window — magnetic and warm",
    events: [
      { date: 'Jun 30–Jul 6', label: 'Mars △ natal Moon', quality: 'peak',    detail: "Emotional boldness. You act on feelings without overthinking. Passion and warmth are both available." },
      { date: 'Jul 3–17',     label: 'Jupiter ✶ natal Moon', quality: 'peak', detail: "Sustained emotional warmth and generosity. Connections deepen naturally. The best two weeks of the year for nurturing a relationship or making yourself emotionally available." },
      { date: 'Jul 10–18',    label: 'Venus △ natal Venus', quality: 'peak',  detail: "Desires flow beautifully. You feel attractive, at ease in your own skin. An excellent window to put yourself forward romantically." },
      { date: 'Jul 8–28',     label: 'Mars ☌ Ascendant', quality: 'peak',     detail: "Peak magnetism. You project confidence, directness, and physical presence. Others notice you. Initiate — this window doesn't repeat." },
      { date: 'Jul 22',       label: 'Jupiter ☐ natal Venus', quality: 'caution', detail: "Counterpoint: over-idealization peaks alongside the beauty. Romantic optimism is real but check the foundations before committing." },
    ],
  },
  {
    month: 'August',
    rating: 'flow',
    headline: "Deep warmth and sustained confidence",
    events: [
      { date: 'Aug 1–14',   label: 'Venus ☌ natal Moon', quality: 'peak',  detail: "Venus sitting on your natal Moon is one of the most tender, emotionally receptive windows of the year. Deep connection and emotional honesty come naturally. Perfect for first real conversations." },
      { date: 'Aug 12',     label: 'Mars ☐ natal Moon', quality: 'caution', detail: "A brief irritable day — feelings push against actions. Avoid reactive arguments; the friction passes in days." },
      { date: 'Aug 15–23',  label: 'Mars ✶ natal Venus', quality: 'flow',   detail: "Desire expresses cleanly. Attractive, warm energy. Good for creative romance." },
      { date: 'Aug 16–26',  label: 'Venus △ Ascendant', quality: 'flow',    detail: "Easy charm and attractiveness. Others are drawn to your presence." },
      { date: 'Aug 17–Sep 14', label: 'Jupiter ✶ Ascendant', quality: 'peak', detail: "The longest sustained confidence window of the year. You are expansive, warm, and socially magnetic. New connections open through your presence. If there's someone you've been hesitating with, August is the time." },
    ],
  },
  {
    month: 'September',
    rating: 'caution',
    headline: "Reality check — assess, don't initiate",
    events: [
      { date: 'Sep 5–Oct 15', label: 'Saturn ✶ Ascendant', quality: 'flow',    detail: "Saturn's grounding influence steadies your self-presentation. Good for assessing whether a connection is real and lasting." },
      { date: 'Sep 8',        label: 'Venus retrograde shadow begins', quality: 'caution', detail: "Old attractions start to resurface. Feelings from the past re-enter. Begin paying attention to what's returning." },
      { date: 'Sep 15',       label: 'Saturn Return exact', quality: 'caution', detail: "Your 29-year life audit peaks. Clarity arrives about what you actually need from partnership. Relationships that don't fit your real path feel impossible to sustain." },
      { date: 'Sep 23–Nov 7', label: 'Jupiter ☍ natal Jupiter', quality: 'caution', detail: "Beliefs about relationships are being tested. Over-optimism and over-commitment are both risks. A reality check arrives — relationships or romantic ideas built on fantasy start to show cracks." },
      { date: 'Sep 25–Oct 4', label: 'Mars ✶ natal Moon', quality: 'flow',    detail: "A brief window of emotional ease and initiative. A good moment to have an honest conversation before the retrograde." },
    ],
  },
  {
    month: 'October',
    rating: 'pause',
    headline: "Venus retrograde — revisit, don't begin",
    events: [
      { date: 'Oct 4',        label: '♀ STATIONS RETROGRADE · 8° Scorpio', quality: 'pause', detail: "Venus turns retrograde. From now until November 15: do not start new relationships, avoid confessions or proposals, do not mistake retrograde-revived feelings for a signal to act. This is a review period." },
      { date: 'Oct 6–15',     label: 'Mars ☐ natal Venus', quality: 'pause', detail: "Desire frustrated. Wanting something you can't have, or tension over control in a relationship. Express needs clearly; avoid possessive reactions." },
      { date: 'Oct 17',       label: 'Venus ☍ natal Venus (Retro) — exact', quality: 'pause', detail: "The Venus retrograde's peak impact on your love life. A pivotal moment of reflection: what do you truly value? What have you been settling for? What do you actually want?" },
      { date: 'Oct 22',       label: 'Mars ✶ Ascendant', quality: 'flow',    detail: "Brief surge of physical confidence. Acts well outwardly, but keep major romantic decisions paused until Venus is direct." },
      { date: 'Oct 31',       label: 'Mars ☍ natal Jupiter', quality: 'caution', detail: "Ambition and desire push against limits. Stay grounded; overreach in romantic pursuit is likely." },
    ],
  },
  {
    month: 'November',
    rating: 'flow',
    headline: "Clearing — Venus direct, confidence returns",
    events: [
      { date: 'Nov 7',        label: 'Jupiter opp natal Jupiter ends', quality: 'flow',    detail: "The belief-testing period lifts. Clarity about what you want from relationships starts returning." },
      { date: 'Nov 15',       label: '♀ STATIONS DIRECT · 22° Libra', quality: 'flow',    detail: "Venus turns direct. The fog lifts. What became clear during the retrograde can now be acted on. Allow a few days for the energy to resume forward momentum." },
      { date: 'Nov 26–Dec 10',label: 'Mars △ natal Sun', quality: 'peak',    detail: "Confidence, vitality, and initiative surge. You're ready to act on what the retrograde showed you." },
    ],
  },
  {
    month: 'December',
    rating: 'peak',
    headline: "Warmth and clarity — best romantic close",
    events: [
      { date: 'Dec 9–31',  label: 'Mars △ natal Venus', quality: 'peak',    detail: "The year closes with genuine romantic warmth. Desire and affection flow without friction. Excellent for deepening a real connection, reconciliation, or expressing love that's been waiting." },
      { date: 'Dec 13',    label: 'Neptune ☍ Moon exact', quality: 'caution', detail: "Neptune's exact hit brings beautiful sensitivity and empathy — but keep one foot in reality. Romantic feelings are heightened but not always accurate." },
      { date: 'Dec 22–31', label: 'Venus ☐ natal Jupiter', quality: 'flow',  detail: "Joyful, generous close to the year. Some excess is possible but the overall energy is celebratory and warm." },
    ],
  },
]

// ── Sub-components ────────────────────────────────────────────────────────

function RatingChip({ q }: { q: Quality }) {
  return (
    <span style={{
      fontSize: 8,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: Q_COLOR[q],
      padding: '3px 10px',
      border: `1px solid ${Q_COLOR[q]}60`,
      borderRadius: 1,
      background: Q_BG[q],
      fontWeight: 500,
    }}>
      {Q_LABEL[q]}
    </span>
  )
}

function EventRow({ ev, i }: { ev: LoveEvent; i: number }) {
  const c = Q_COLOR[ev.quality]
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
      style={{
        display: 'grid',
        gridTemplateColumns: '110px 1fr',
        gap: 14,
        padding: '12px 0',
        borderBottom: '1px solid rgba(160,133,88,0.08)',
        alignItems: 'start',
      }}
    >
      <div>
        <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--f-serif)', marginBottom: 4 }}>{ev.date}</div>
        <RatingChip q={ev.quality} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink)', marginBottom: 5, fontFamily: 'var(--f-serif)' }}>{ev.label}</div>
        <div style={{ fontSize: 12.5, fontWeight: 300, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{ev.detail}</div>
      </div>
    </motion.div>
  )
}

function MonthCard({ m, idx }: { m: MonthData; idx: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const c = Q_COLOR[m.rating]
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: 'easeOut', delay: idx * 0.05 }}
      style={{
        border: `1px solid ${c}30`,
        borderTop: `3px solid ${c}`,
        borderRadius: 2,
        padding: '24px 24px 16px',
        background: Q_BG[m.rating],
        marginBottom: 24,
      }}
    >
      {/* Month header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--f-serif)', fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 400, color: 'var(--ink)' }}>
          {m.month}
        </span>
        <RatingChip q={m.rating} />
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--ink-mute)', fontStyle: 'italic', marginBottom: 20, lineHeight: 1.5 }}>
        {m.headline}
      </p>
      {/* Events */}
      <div>
        {m.events.map((ev, i) => <EventRow key={ev.date + ev.label} ev={ev} i={i} />)}
      </div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────

export default function SectionLove() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

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
        <span style={{ width: 32, height: 1, background: 'var(--blush)', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--blush)', fontWeight: 500 }}>
          Love & Relationships
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
        Love weather, 2026.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.18 }}
        style={{ fontSize: 13, color: 'var(--ink-mute)', letterSpacing: '0.06em', marginBottom: 'clamp(40px,6vw,72px)' }}
      >
        Venus, Moon, Ascendant, and 7th-house transits · Jun – Dec 2026
      </motion.p>

      <div className="love-layout">

        {/* Left column: backdrop + Venus retro */}
        <div>

          {/* Year backdrop */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 16 }}>
              Year-long Backdrop
            </div>
            {BACKDROP.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                style={{
                  padding: '18px 20px',
                  border: `1px solid ${Q_COLOR[b.quality]}35`,
                  borderLeft: `3px solid ${Q_COLOR[b.quality]}`,
                  borderRadius: 2,
                  background: Q_BG[b.quality],
                  marginBottom: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 16, color: Q_COLOR[b.quality], fontFamily: 'serif' }}>{b.symbol}</span>
                  <span style={{ fontFamily: 'var(--f-serif)', fontSize: 14, color: 'var(--ink)' }}>{b.title}</span>
                </div>
                <p style={{ fontSize: 12.5, fontWeight: 300, color: 'var(--ink-soft)', lineHeight: 1.72, margin: 0 }}>{b.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Venus retrograde warning */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{
              padding: '22px 22px 18px',
              border: '1px solid rgba(138,90,138,0.4)',
              borderTop: '3px solid #8A5A8A',
              borderRadius: 2,
              background: 'rgba(138,90,138,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 18, color: '#8A5A8A', fontFamily: 'serif' }}>♀</span>
              <span style={{ fontFamily: 'var(--f-serif)', fontSize: 16, color: 'var(--ink)' }}>Venus Retrograde</span>
              <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A5A8A', padding: '3px 8px', border: '1px solid #8A5A8A50', borderRadius: 1 }}>
                {VENUS_RETRO.start} – {VENUS_RETRO.end}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[
                ['Sign', VENUS_RETRO.sign],
                ['Shadow from', VENUS_RETRO.shadow],
                ['Stations Retro', VENUS_RETRO.start],
                ['Stations Direct', VENUS_RETRO.end],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink)', fontFamily: 'var(--f-serif)' }}>{val}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12.5, fontWeight: 300, color: 'var(--ink-soft)', lineHeight: 1.72, margin: 0 }}>{VENUS_RETRO.text}</p>
          </motion.div>

          {/* Quick reference */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ marginTop: 32 }}
          >
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 14 }}>
              Quick Reference
            </div>
            {[
              { q: 'peak'    as Quality, label: 'Peak windows',  dates: 'Jul 8–28 · Jul 3–17 · Aug 1–14 · Aug 17–Sep 14 · Dec 9–31' },
              { q: 'flow'    as Quality, label: 'Flowing',        dates: 'Jun 14 · Jul 10–18 · Aug 15–26 · Nov 15+' },
              { q: 'caution' as Quality, label: 'Caution',        dates: 'Jun 16 · Sep 8–23 · Oct 6–15' },
              { q: 'pause'   as Quality, label: 'Step back',      dates: 'Oct 4 – Nov 15 (Venus Rx)' },
            ].map(item => (
              <div key={item.q} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: Q_COLOR[item.q], flexShrink: 0, marginTop: 3 }} />
                <div>
                  <span style={{ fontSize: 10, fontWeight: 500, color: Q_COLOR[item.q], textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8 }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{item.dates}</span>
                </div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Right column: month-by-month */}
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
            Month by Month
          </div>
          {MONTHS.map((m, i) => <MonthCard key={m.month} m={m} idx={i} />)}
        </div>

      </div>
    </section>
  )
}
