'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    title: 'Agreement Ingestion',
    body: 'We map every clause in your cooperation agreements — identifying accounting obligations, revenue thresholds, and compliance triggers specific to your hospital network.',
  },
  {
    num: '02',
    title: 'Domain Training',
    body: 'The AI learns the accounting language of your institution: your chart of accounts, internal naming conventions, and the interpretations your finance team relies on.',
  },
  {
    num: '03',
    title: 'Live Compliance',
    body: 'Real-time guidance at the point of decision. When an accounting question touches a cooperation agreement, the answer is immediate — and traceable to the source clause.',
  },
];

function DiamondAccent() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        opacity: 0.55,
      }}
    >
      <rect
        x="5"
        y="0.5"
        width="6.36"
        height="6.36"
        rx="0.5"
        transform="rotate(45 5 5)"
        stroke="var(--gold)"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function SectionHow() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="section-how"
      style={{
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 96px)',
        background: 'var(--cream)',
        position: 'relative',
      }}
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 32,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 32,
            height: 1,
            background: 'var(--gold)',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--f-sans)',
            fontSize: 10,
            fontVariant: 'small-caps',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            fontWeight: 500,
          }}
        >
          The Method
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        className="section-headline"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        style={{
          fontFamily: 'var(--f-serif)',
          fontSize: 'clamp(36px, 5vw, 58px)',
          fontWeight: 400,
          color: 'var(--ink)',
          lineHeight: 1.1,
          marginBottom: 'clamp(48px, 7vw, 80px)',
          letterSpacing: '-0.01em',
        }}
      >
        How it works.
      </motion.h2>

      {/* Steps grid */}
      <div
        className="steps-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'clamp(32px, 4vw, 56px)',
        }}
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            className="step-card"
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.65,
              ease: 'easeOut',
              delay: 0.2 + i * 0.13,
            }}
            style={{
              position: 'relative',
              borderBottom: '1px solid rgba(160,133,88,0.2)',
              paddingBottom: 32,
              paddingTop: 4,
            }}
          >
            <DiamondAccent />

            <div
              className="step-num"
              style={{
                fontFamily: 'var(--f-sans)',
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 20,
              }}
            >
              {step.num}
            </div>

            <h3
              className="step-title"
              style={{
                fontFamily: 'var(--f-serif)',
                fontSize: 'clamp(22px, 2.5vw, 28px)',
                fontWeight: 400,
                color: 'var(--ink)',
                lineHeight: 1.2,
                marginBottom: 16,
                letterSpacing: '-0.01em',
              }}
            >
              {step.title}
            </h3>

            <p
              className="step-body"
              style={{
                fontFamily: 'var(--f-sans)',
                fontSize: 15,
                fontWeight: 300,
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {step.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
