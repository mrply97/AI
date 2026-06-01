'use client';

const MARQUEE_TEXT =
  'Cooperation Agreements · Accounting Compliance · Hospital Finance · AI-Powered Intelligence · On-Site Research · Healthcare Accounting · Doctoral Research · Revenue Compliance · ';

export default function Marquee() {
  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee-scroll 30s linear infinite;
          will-change: transform;
        }
        .marquee-text {
          display: inline;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-mute);
          font-family: var(--f-sans);
        }
      `}</style>

      <div
        style={{
          overflow: 'hidden',
          borderTop: '1px solid rgba(160,133,88,0.18)',
          borderBottom: '1px solid rgba(160,133,88,0.18)',
          padding: '14px 0',
        }}
      >
        <div className="marquee-track">
          <span className="marquee-text">{MARQUEE_TEXT}</span>
          <span className="marquee-text">{MARQUEE_TEXT}</span>
        </div>
      </div>
    </>
  );
}
