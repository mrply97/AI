'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const FADE_UP = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

export default function SectionContact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href =
      'mailto:info@healthledgerai.com?subject=Research%20Program%20Interest&body=Hello%2C%20I%27d%20like%20to%20learn%20more%20about%20HealthLedger%20AI.';
  };

  return (
    <section
      ref={ref}
      className="section-contact"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 96px)',
        background: 'var(--ivory)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-2%',
          bottom: 0,
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(120px, 20vw, 260px)',
          fontWeight: 400,
          color: 'var(--gold)',
          opacity: 0.04,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '-0.03em',
        }}
      >
        HL·AI
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 620 }}>
        {/* Headline */}
        <motion.h2
          {...FADE_UP(0)}
          animate={inView ? FADE_UP(0).animate : FADE_UP(0).initial}
          style={{
            fontFamily: 'var(--f-serif)',
            fontSize: 'clamp(44px, 7vw, 72px)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            marginBottom: 28,
          }}
        >
          Join the research.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          {...FADE_UP(0.15)}
          animate={inView ? FADE_UP(0.15).animate : FADE_UP(0.15).initial}
          style={{
            fontFamily: 'var(--f-sans)',
            fontSize: 'clamp(15px, 1.6vw, 17px)',
            fontWeight: 300,
            color: 'var(--ink-soft)',
            lineHeight: 1.75,
            marginBottom: 40,
            maxWidth: 520,
          }}
        >
          HealthLedger AI is in active R&D with select hospital accounting
          departments. If you work in healthcare finance, we&apos;d like to hear
          from you.
        </motion.p>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          {...FADE_UP(0.28)}
          animate={inView ? FADE_UP(0.28).animate : FADE_UP(0.28).initial}
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 24,
          }}
        >
          <input
            type="email"
            className="waitlist-input"
            placeholder="your@hospital.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: '1 1 220px',
              minWidth: 0,
              padding: '14px 18px',
              background: 'transparent',
              border: '1px solid rgba(160,133,88,0.35)',
              borderRadius: 2,
              fontFamily: 'var(--f-sans)',
              fontSize: 14,
              fontWeight: 400,
              color: 'var(--ink)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(160,133,88,0.75)')
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(160,133,88,0.35)')
            }
          />

          <button
            type="submit"
            className="waitlist-btn"
            style={{
              flexShrink: 0,
              padding: '14px 28px',
              background: 'var(--gold)',
              border: 'none',
              borderRadius: 2,
              fontFamily: 'var(--f-sans)',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--cream)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'var(--gold-lt)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'var(--gold)')
            }
          >
            Request Access
          </button>
        </motion.form>

        {/* Footnote */}
        <motion.p
          {...FADE_UP(0.4)}
          animate={inView ? FADE_UP(0.4).animate : FADE_UP(0.4).initial}
          style={{
            fontFamily: 'var(--f-sans)',
            fontSize: 10,
            fontVariant: 'small-caps',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            margin: 0,
          }}
        >
          No commitment · Research phase · Free to join
        </motion.p>
      </div>
    </section>
  );
}
