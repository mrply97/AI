'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const PLANETS = [
  {
    symbol: '☉', name: 'Sun',     rules: 'Leo',            element: 'Fire',
    keywords: ['Identity', 'Vitality', 'Will'],
    color: '#C9AA7C', orbitR: 0,   period: 0,   size: 13, startAngle: 0,
  },
  {
    symbol: '☽', name: 'Moon',    rules: 'Cancer',         element: 'Water',
    keywords: ['Emotion', 'Intuition', 'Soul'],
    color: '#D4CBB8', orbitR: 38,  period: 2.7, size: 7,  startAngle: 48,
  },
  {
    symbol: '☿', name: 'Mercury', rules: 'Gemini · Virgo', element: 'Air',
    keywords: ['Mind', 'Voice', 'Wit'],
    color: '#B09070', orbitR: 60,  period: 4.5, size: 6,  startAngle: 96,
  },
  {
    symbol: '♀', name: 'Venus',   rules: 'Taurus · Libra', element: 'Earth',
    keywords: ['Love', 'Beauty', 'Harmony'],
    color: '#D4A9A0', orbitR: 82,  period: 6.5, size: 8,  startAngle: 144,
  },
  {
    symbol: '♂', name: 'Mars',    rules: 'Aries',          element: 'Fire',
    keywords: ['Action', 'Desire', 'Courage'],
    color: '#C06050', orbitR: 106, period: 9,   size: 7,  startAngle: 192,
  },
  {
    symbol: '♃', name: 'Jupiter', rules: 'Sagittarius',    element: 'Fire',
    keywords: ['Expansion', 'Wisdom', 'Fortune'],
    color: '#9A8A60', orbitR: 132, period: 14,  size: 10, startAngle: 240,
  },
  {
    symbol: '♄', name: 'Saturn',  rules: 'Capricorn',      element: 'Earth',
    keywords: ['Discipline', 'Karma', 'Structure'],
    color: '#8A9080', orbitR: 158, period: 20,  size: 9,  startAngle: 288,
  },
  {
    symbol: '♅', name: 'Uranus',  rules: 'Aquarius',       element: 'Air',
    keywords: ['Innovation', 'Revolution', 'Freedom'],
    color: '#70A8A8', orbitR: 183, period: 32,  size: 8,  startAngle: 336,
  },
  {
    symbol: '♆', name: 'Neptune', rules: 'Pisces',         element: 'Water',
    keywords: ['Dreams', 'Mysticism', 'Dissolution'],
    color: '#5A70A0', orbitR: 206, period: 45,  size: 8,  startAngle: 20,
  },
  {
    symbol: '♇', name: 'Pluto',   rules: 'Scorpio',        element: 'Water',
    keywords: ['Transformation', 'Power', 'Rebirth'],
    color: '#8A5A8A', orbitR: 228, period: 65,  size: 6,  startAngle: 68,
  },
];

const CX = 256, CY = 256;

export default function SectionAstrology() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState<string | null>(null);

  const toggle = (name: string) => setActive(prev => (prev === name ? null : name));

  return (
    <section
      ref={ref}
      style={{
        padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px)',
        background: 'var(--ivory)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}
      >
        <span style={{ display: 'inline-block', width: 32, height: 1, background: 'var(--sage)', flexShrink: 0 }} />
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sage)', fontWeight: 500 }}>
          Celestial Bodies
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(36px,5vw,58px)',
          fontWeight: 400,
          color: 'var(--ink)',
          lineHeight: 1.1,
          marginBottom: 'clamp(48px,7vw,80px)',
          letterSpacing: '-0.01em',
        }}
      >
        The ten planets.
      </motion.h2>

      {/* Orrery + Planet grid */}
      <div className="astrology-layout">

        {/* Animated SVG orrery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          style={{ width: '100%' }}
        >
          <svg viewBox="0 0 512 512" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <radialGradient id="astro-sky" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(160,133,88,0.08)" />
                <stop offset="100%" stopColor="rgba(160,133,88,0)" />
              </radialGradient>
              <filter id="astro-sun-glow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="astro-planet-glow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Sky wash */}
            <circle cx={CX} cy={CY} r={254} fill="url(#astro-sky)" />

            {/* Orbit rings */}
            {PLANETS.filter(p => p.orbitR > 0).map(p => (
              <circle
                key={`ring-${p.name}`}
                cx={CX} cy={CY} r={p.orbitR}
                fill="none"
                stroke={active === p.name ? 'rgba(160,133,88,0.38)' : 'rgba(160,133,88,0.13)'}
                strokeWidth={active === p.name ? 0.9 : 0.5}
              />
            ))}

            {/* Sun */}
            <circle
              cx={CX} cy={CY} r={PLANETS[0].size}
              fill={PLANETS[0].color}
              filter="url(#astro-sun-glow)"
              style={{ cursor: 'pointer' }}
              onClick={() => toggle('Sun')}
              opacity={active && active !== 'Sun' ? 0.55 : 1}
            />

            {/* Orbiting planets */}
            {PLANETS.filter(p => p.orbitR > 0).map(p => (
              <motion.g
                key={p.name}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
                initial={{ rotate: p.startAngle }}
                animate={{ rotate: p.startAngle + 360 }}
                transition={{ duration: p.period * 10, repeat: Infinity, ease: 'linear' }}
              >
                {/* Invisible large hitbox for easier clicking */}
                <circle
                  cx={CX + p.orbitR} cy={CY}
                  r={p.size + 7}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggle(p.name)}
                />
                <circle
                  cx={CX + p.orbitR} cy={CY}
                  r={p.size}
                  fill={p.color}
                  opacity={active && active !== p.name ? 0.3 : 0.85}
                  filter="url(#astro-planet-glow)"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggle(p.name)}
                />
              </motion.g>
            ))}
          </svg>
        </motion.div>

        {/* Planet cards */}
        <div className="planet-grid">
          {PLANETS.map((planet, i) => (
            <motion.div
              key={planet.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.3 + i * 0.055 }}
              onClick={() => toggle(planet.name)}
              style={{
                padding: '16px 18px',
                border: `1px solid ${active === planet.name ? planet.color + '70' : 'rgba(160,133,88,0.2)'}`,
                borderRadius: 2,
                background: active === planet.name ? `${planet.color}0E` : 'rgba(244,239,228,0.55)',
                backdropFilter: 'blur(4px)',
                cursor: 'pointer',
                transition: 'border-color 0.25s, background 0.25s',
                position: 'relative',
              }}
            >
              {/* Symbol + element row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 22, color: planet.color, fontFamily: 'serif', lineHeight: 1 }}>
                  {planet.symbol}
                </span>
                <span style={{ fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', paddingTop: 3 }}>
                  {planet.element}
                </span>
              </div>

              {/* Name */}
              <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18, fontWeight: 400, color: 'var(--ink)', marginBottom: 2 }}>
                {planet.name}
              </div>

              {/* Rulership */}
              <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
                Rules {planet.rules}
              </div>

              {/* Keywords */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {planet.keywords.map(kw => (
                  <span
                    key={kw}
                    style={{
                      fontSize: 8,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-soft)',
                      padding: '3px 7px',
                      border: '1px solid rgba(160,133,88,0.18)',
                      borderRadius: 1,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
