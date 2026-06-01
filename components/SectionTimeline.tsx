'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────

interface TransitEvent {
  tp: string        // transiting planet
  np: string        // natal planet
  asp: string       // aspect name
  exactDate: string
  startDate: string
  endDate: string
  orb: number
  interp: string
}

// ── Colour + glyph maps ───────────────────────────────────────────────────

const PLANET_COLOR: Record<string, string> = {
  Mars:    '#C06050',
  Jupiter: '#9A8A60',
  Saturn:  '#8A9080',
  Uranus:  '#70A8A8',
  Neptune: '#5A70A0',
  Pluto:   '#8A5A8A',
}

const PLANET_SYMBOL: Record<string, string> = {
  Mars:'♂', Jupiter:'♃', Saturn:'♄', Uranus:'♅', Neptune:'♆', Pluto:'♇',
}

const NATAL_SYMBOL: Record<string, string> = {
  Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂',
  Jupiter:'♃', Saturn:'♄', Ascendant:'↑', MC:'⊕',
}

const ASPECT_GLYPH: Record<string, string> = {
  Conjunction:'☌', Opposition:'☍', Trine:'△', Square:'□', Sextile:'✶',
}

// ── Computed transit data (Jun 1 – Dec 31 2026) ───────────────────────────

const BACKGROUND: TransitEvent[] = [
  {
    tp:'Pluto', np:'Venus', asp:'Square',
    exactDate:'Jun 16', startDate:'Jun 1', endDate:'Dec 31', orb:0.00,
    interp:"Pluto square natal Venus is a multi-year transformation of relationships, values, and self-worth. Power dynamics, obsessive attractions, and the collapse of what no longer serves you are themes that run beneath the entire second half of 2026. What you desire and what you're worth to yourself are both being reinvented.",
  },
  {
    tp:'Saturn', np:'Saturn', asp:'Conjunction',
    exactDate:'Sep 15', startDate:'Jun 1', endDate:'Dec 31', orb:0.00,
    interp:"The Saturn Return peaks in September, but its weight is felt all year. You are completing a full life cycle — 29 years of absorbed structures, inherited beliefs, and borrowed identities. What is truly yours stays. What isn't, falls. Career direction, long-term commitments, and how you hold authority over your own life are all in the audit.",
  },
  {
    tp:'Neptune', np:'Moon', asp:'Opposition',
    exactDate:'Dec 13', startDate:'Jun 1', endDate:'Dec 31', orb:0.92,
    interp:"Neptune in Aries opposing your natal Libra Moon is a slow dissolving of emotional boundaries. Relationships feel idealized or confused; you're more psychically open than usual but also more susceptible to being drained or misled. Trust clear evidence over beautiful possibilities.",
  },
]

const EVENTS: TransitEvent[] = [
  // June
  {
    tp:'Mars', np:'Mars', asp:'Trine',
    exactDate:'Jun 11', startDate:'Jun 5', endDate:'Jun 17', orb:0.03,
    interp:"Physical momentum and confidence are high. Sustained effort comes naturally — good window for starting a project, physical training, or anything requiring directed energy.",
  },
  {
    tp:'Mars', np:'Jupiter', asp:'Square',
    exactDate:'Jun 12', startDate:'Jun 6', endDate:'Jun 19', orb:0.25,
    interp:"Impulsive overreach. Your ambitions feel urgent but reality may push back. Frustration is possible if you overextend. Use the energy strategically rather than scattering it.",
  },
  {
    tp:'Mars', np:'MC', asp:'Square',
    exactDate:'Jun 13', startDate:'Jun 7', endDate:'Jun 20', orb:0.29,
    interp:"Career friction. Pressure builds around your public reputation or professional direction. A confrontation or forcing moment — things that were simmering come to the surface.",
  },
  {
    tp:'Mars', np:'Moon', asp:'Trine',
    exactDate:'Jun 30', startDate:'Jun 23', endDate:'Jul 6', orb:0.16,
    interp:"Emotional energy flows into action. You're socially magnetic, warm, and able to act decisively on feelings. Good for connection, creative work, or anything requiring emotional boldness.",
  },
  // July
  {
    tp:'Jupiter', np:'Sun', asp:'Square',
    exactDate:'Jul 1', startDate:'Jun 7', endDate:'Jul 24', orb:0.03,
    interp:"Jupiter square natal Sun is a growth-challenge: your sense of self is being pushed to expand beyond comfortable limits. Overconfidence is the main risk, but so is missed opportunity if you play too small. Aim high, but verify the foundations.",
  },
  {
    tp:'Jupiter', np:'Moon', asp:'Sextile',
    exactDate:'Jul 3', startDate:'Jun 20', endDate:'Jul 17', orb:0.09,
    interp:"Emotional ease and social warmth. The heart opens. Travel, learning, and meaningful connections come easily. A good window for nurturing relationships or healing old emotional patterns.",
  },
  {
    tp:'Mars', np:'Saturn', asp:'Sextile',
    exactDate:'Jul 17', startDate:'Jul 13', endDate:'Jul 21', orb:0.02,
    interp:"Disciplined action. Mars and Saturn cooperate: drive meets structure. A focused, productive window — commitments made now are realistic and durable.",
  },
  {
    tp:'Mars', np:'Ascendant', asp:'Conjunction',
    exactDate:'Jul 18', startDate:'Jul 8', endDate:'Jul 28', orb:0.06,
    interp:"Mars conjunct your Ascendant is a surge of presence and assertiveness. You step forward boldly. Others notice your drive. This is a peak initiative window — start something important.",
  },
  {
    tp:'Jupiter', np:'Venus', asp:'Square',
    exactDate:'Jul 22', startDate:'Jun 30', endDate:'Aug 13', orb:0.02,
    interp:"Expansion in love, creativity, and finances — but with possible excess. Romantic optimism peaks; beautiful experiences are available, but beware overpromising or overspending. The feeling of abundance is real, the need for discernment is equally real.",
  },
  {
    tp:'Mars', np:'Mars', asp:'Square',
    exactDate:'Jul 23', startDate:'Jul 16', endDate:'Jul 30', orb:0.16,
    interp:"A restless, combative edge. Internal frustration or conflict with others over direction and will. Channel into decisive action rather than reactive argument.",
  },
  {
    tp:'Mars', np:'Jupiter', asp:'Trine',
    exactDate:'Jul 25', startDate:'Jul 18', endDate:'Aug 1', orb:0.20,
    interp:"Confidence and opportunity flow together. Optimism is grounded in real momentum. Good for expanding, pitching, or taking a well-prepared risk.",
  },
  {
    tp:'Mars', np:'MC', asp:'Trine',
    exactDate:'Jul 26', startDate:'Jul 19', endDate:'Aug 2', orb:0.12,
    interp:"Career energy peaks positively. Initiatives in your professional life gain traction. Your drive aligns with your public direction — act on professional ambitions.",
  },
  // August
  {
    tp:'Jupiter', np:'Mercury', asp:'Square',
    exactDate:'Aug 7', startDate:'Jul 16', endDate:'Aug 30', orb:0.06,
    interp:"Thinking big, sometimes too big. Jupiter presses natal Mercury — ideas multiply faster than you can execute. Contracts, negotiations, and communications need extra scrutiny. Don't commit to more than you can deliver.",
  },
  {
    tp:'Mars', np:'Moon', asp:'Square',
    exactDate:'Aug 12', startDate:'Aug 5', endDate:'Aug 20', orb:0.26,
    interp:"Emotional irritability. Feelings push against actions; needs feel urgent. Avoid reactive decisions in close relationships — the intensity passes quickly.",
  },
  {
    tp:'Mars', np:'Sun', asp:'Sextile',
    exactDate:'Aug 12', startDate:'Aug 8', endDate:'Aug 16', orb:0.23,
    interp:"Vitality flows. A clean, positive energy boost — good for physical exertion, self-promotion, or any initiative that requires you to show up with confidence.",
  },
  {
    tp:'Mars', np:'Venus', asp:'Sextile',
    exactDate:'Aug 19', startDate:'Aug 15', endDate:'Aug 23', orb:0.26,
    interp:"Creative and romantic ease. Desire expresses smoothly. Attractive energy, good for connecting with others, artistic work, or enjoying beauty.",
  },
  {
    tp:'Mars', np:'Mercury', asp:'Sextile',
    exactDate:'Aug 24', startDate:'Aug 20', endDate:'Aug 28', orb:0.07,
    interp:"Sharp, quick thinking and communication. Ideas translate into action without friction. Good for writing, negotiating, or any mental work requiring drive.",
  },
  {
    tp:'Jupiter', np:'Saturn', asp:'Trine',
    exactDate:'Aug 28', startDate:'Aug 5', endDate:'Sep 21', orb:0.08,
    interp:"Jupiter trining your natal Saturn is one of the most constructive aspects of the year. Ambition meets structure — real progress on long-term goals is possible. Formalize plans, sign important agreements, take concrete steps toward a serious life commitment.",
  },
  {
    tp:'Jupiter', np:'Ascendant', asp:'Sextile',
    exactDate:'Aug 31', startDate:'Aug 17', endDate:'Sep 14', orb:0.05,
    interp:"Confidence and social ease. New connections and opportunities open up through your presence. A good window for job applications, social expansion, or putting yourself in new rooms.",
  },
  {
    tp:'Mars', np:'Saturn', asp:'Square',
    exactDate:'Aug 31', startDate:'Aug 24', endDate:'Sep 7', orb:0.02,
    interp:"Mars meets Saturn in friction. Effort feels blocked or redirected. Patience is required — this is not a time to force. Adjust your approach rather than pushing harder.",
  },
  // September
  {
    tp:'Saturn', np:'Ascendant', asp:'Sextile',
    exactDate:'Sep 5', startDate:'Jun 1', endDate:'Oct 15', orb:0.00,
    interp:"Saturn sextile your Ascendant supports restructuring how you present yourself to the world. A grounding, stabilizing energy for your identity. Slow, mature steps toward who you're becoming.",
  },
  {
    tp:'Mars', np:'Mars', asp:'Sextile',
    exactDate:'Sep 7', startDate:'Sep 3', endDate:'Sep 11', orb:0.08,
    interp:"Brief surge of physical energy and initiative. A clean action window — start, advance, or commit to something requiring direct effort.",
  },
  {
    tp:'Jupiter', np:'Jupiter', asp:'Opposition',
    exactDate:'Sep 23', startDate:'Aug 20', endDate:'Nov 7', orb:0.01,
    interp:"Jupiter opposes your natal Jupiter — a life-expansion reality check. Where have you overextended or under-committed in the last six years? Beliefs and philosophical frameworks are being tested. Truth-seeking is rewarded; inflation and self-deception are exposed.",
  },
  {
    tp:'Jupiter', np:'MC', asp:'Opposition',
    exactDate:'Sep 27', startDate:'Aug 24', endDate:'Nov 16', orb:0.01,
    interp:"Jupiter opposes your Midheaven: a significant career and public life inflection. Recognition arrives, but so does scrutiny. Opportunities in your professional direction can feel both expansive and destabilizing — a chance to reassess your path at a high level.",
  },
  {
    tp:'Mars', np:'Sun', asp:'Square',
    exactDate:'Sep 28', startDate:'Sep 21', endDate:'Oct 7', orb:0.27,
    interp:"Will and identity are under pressure. You may feel blocked or in conflict with authority, or your own desires may clash. Act with clarity, not ego.",
  },
  {
    tp:'Mars', np:'Moon', asp:'Sextile',
    exactDate:'Sep 29', startDate:'Sep 25', endDate:'Oct 4', orb:0.17,
    interp:"Emotional confidence and social ease. Feelings and actions are in sync — a brief but pleasant window for connection, creativity, and nurturing.",
  },
  // October
  {
    tp:'Mars', np:'Venus', asp:'Square',
    exactDate:'Oct 6', startDate:'Sep 28', endDate:'Oct 15', orb:0.19,
    interp:"Desire and frustration. Romantic or financial pressure; wanting something you can't quite have, or tension in close relationships. Avoid possessive or reactive behaviour — channel the tension into honest conversation.",
  },
  {
    tp:'Mars', np:'Mercury', asp:'Square',
    exactDate:'Oct 13', startDate:'Oct 4', endDate:'Oct 21', orb:0.18,
    interp:"Sharp tongue, argumentative edge. Communication pressure — things said in haste cause friction. Decisions made here may need revision. Slow down before committing words or agreements.",
  },
  {
    tp:'Mars', np:'Saturn', asp:'Trine',
    exactDate:'Oct 21', startDate:'Oct 12', endDate:'Oct 30', orb:0.12,
    interp:"Drive and discipline work together again. A strong practical window for executing plans that require sustained, methodical effort. Build, consolidate, deliver.",
  },
  {
    tp:'Mars', np:'Ascendant', asp:'Sextile',
    exactDate:'Oct 22', startDate:'Oct 17', endDate:'Oct 27', orb:0.00,
    interp:"Renewed initiative and confident presence. You move through the world with purpose. A brief but productive window for self-promotion, physical activity, or stepping forward in any area.",
  },
  {
    tp:'Mars', np:'Jupiter', asp:'Opposition',
    exactDate:'Oct 31', startDate:'Oct 18', endDate:'Nov 14', orb:0.01,
    interp:"Mars opposes natal Jupiter: tension between ambition and action. Your reach may exceed your grasp, or you push against systems larger than you. Channel the frustration into focused, strategic effort rather than scattered battles.",
  },
  {
    tp:'Mars', np:'MC', asp:'Opposition',
    exactDate:'Nov 2', startDate:'Oct 20', endDate:'Nov 16', orb:0.25,
    interp:"Career pressure from an opposing force — a boss, partner, or competing priority. A clarifying moment: what you're building professionally is being tested against external reality.",
  },
  // November
  {
    tp:'Mars', np:'Sun', asp:'Trine',
    exactDate:'Nov 26', startDate:'Nov 15', endDate:'Dec 10', orb:0.19,
    interp:"Mars trine natal Sun is one of the strongest action-windows of the year. Physical energy, confidence, and will align with your identity. Initiate, launch, and lead. Excellent for any project requiring long-term commitment.",
  },
  // December
  {
    tp:'Mars', np:'Venus', asp:'Trine',
    exactDate:'Dec 9', startDate:'Nov 26', endDate:'Dec 31', orb:0.07,
    interp:"Creative flow and relational warmth close out the year. Love, beauty, and desire feel abundant and uncomplicated. A good window for reconciliation, artistic projects, or deepening a meaningful relationship.",
  },
  {
    tp:'Mars', np:'Mercury', asp:'Trine',
    exactDate:'Dec 23', startDate:'Dec 5', endDate:'Dec 31', orb:0.07,
    interp:"Ideas flow into action cleanly. Writing, speaking, planning — mental and physical energy coordinate well. An excellent close to the year for capturing insights and setting intentions.",
  },
]

const MONTHS = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── Sub-components ────────────────────────────────────────────────────────

function EventCard({ ev, i, bg = false }: { ev: TransitEvent; i: number; bg?: boolean }) {
  const color = PLANET_COLOR[ev.tp] ?? 'var(--gold)'
  const inView = useInView(useRef<HTMLDivElement>(null), { once: true })

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: i * 0.04, ease: 'easeOut' }}
      style={{
        display: 'grid',
        gridTemplateColumns: bg ? '120px 1fr' : '100px 1fr',
        gap: '14px',
        padding: '16px 0',
        borderBottom: '1px solid rgba(160,133,88,0.1)',
        alignItems: 'start',
      }}
    >
      {/* Date col */}
      <div style={{ paddingTop: 2 }}>
        <div style={{
          fontSize: 13,
          fontFamily: 'var(--f-serif)',
          color: 'var(--ink)',
          fontWeight: 400,
          marginBottom: 4,
        }}>
          {ev.exactDate}
        </div>
        <div style={{
          fontSize: 9,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
          lineHeight: 1.5,
        }}>
          {ev.startDate !== ev.exactDate || ev.endDate !== ev.exactDate
            ? `${ev.startDate} – ${ev.endDate}`
            : ''}
        </div>
      </div>

      {/* Content col */}
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16, color, fontFamily: 'serif' }}>{PLANET_SYMBOL[ev.tp]}</span>
          <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color, fontWeight: 500 }}>
            {ev.tp}
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{ASPECT_GLYPH[ev.asp]}</span>
          <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
            natal {NATAL_SYMBOL[ev.np]} {ev.np}
          </span>
          <span style={{
            fontSize: 8, letterSpacing: '0.1em',
            color: 'var(--ink-mute)',
            padding: '2px 6px',
            border: '1px solid rgba(160,133,88,0.2)',
            borderRadius: 1,
            marginLeft: 'auto',
          }}>
            {ev.asp}
          </span>
        </div>
        {/* Interpretation */}
        <p style={{
          fontSize: 13,
          fontWeight: 300,
          color: 'var(--ink-soft)',
          lineHeight: 1.72,
          margin: 0,
        }}>
          {ev.interp}
        </p>
      </div>
    </motion.div>
  )
}

function MonthBlock({ month, events, i }: { month: string; events: TransitEvent[]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  if (events.length === 0) return null
  return (
    <div ref={ref} style={{ marginBottom: 52 }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
          paddingBottom: 12,
          borderBottom: '1px solid rgba(160,133,88,0.2)',
        }}
      >
        <span style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 400,
          color: 'var(--ink)',
          letterSpacing: '-0.01em',
        }}>
          {month}
        </span>
        <span style={{
          fontSize: 9,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
        }}>
          2026
        </span>
        <span style={{
          fontSize: 9,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
          padding: '3px 10px',
          border: '1px solid rgba(160,133,88,0.2)',
          borderRadius: 1,
        }}>
          {events.length} {events.length === 1 ? 'transit' : 'transits'}
        </span>
      </motion.div>
      <div>
        {events.map((ev, j) => <EventCard key={`${ev.tp}-${ev.np}-${ev.asp}-${ev.exactDate}`} ev={ev} i={j} />)}
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────

export default function SectionTimeline() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const byMonth = MONTHS.reduce<Record<string, TransitEvent[]>>((acc, m) => {
    acc[m] = EVENTS.filter(ev => ev.exactDate.startsWith(m))
    return acc
  }, {} as Record<string, TransitEvent[]>)

  return (
    <section
      ref={ref}
      style={{
        padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px)',
        background: 'var(--ivory)',
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
        <span style={{ width: 32, height: 1, background: 'var(--sage)', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sage)', fontWeight: 500 }}>
          Transit Timeline
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
        June – December 2026
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ fontSize: 13, color: 'var(--ink-mute)', letterSpacing: '0.06em', marginBottom: 'clamp(40px,6vw,72px)' }}
      >
        38 exact transit peaks across 7 months · outer planets only (Mars through Pluto)
      </motion.p>

      {/* Layout: background + timeline */}
      <div className="timeline-layout">

        {/* Left: ongoing background themes */}
        <div>
          <div style={{
            fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--blush)', marginBottom: 20,
          }}>
            Background Themes · All Period
          </div>
          <div style={{
            border: '1px solid rgba(212,169,160,0.3)',
            borderRadius: 2,
            padding: '0 20px',
            background: 'rgba(212,169,160,0.04)',
          }}>
            {BACKGROUND.map((ev, i) => <EventCard key={ev.tp + ev.np} ev={ev} i={i} bg />)}
          </div>
        </div>

        {/* Right: month-by-month */}
        <div>
          <div style={{
            fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 20,
          }}>
            Month by Month
          </div>
          {MONTHS.map((m, i) => (
            <MonthBlock key={m} month={m} events={byMonth[m] ?? []} i={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
