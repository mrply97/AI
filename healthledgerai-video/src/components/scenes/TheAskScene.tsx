import React from "react";
import {
  AbsoluteFill,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../constants/colors";
import { SPRING_SNAPPY, SPRING_BOUNCY } from "../../constants/timing";
import { FloatingOrbs } from "../shared/FloatingOrbs";
import { ParticleField } from "../shared/ParticleField";
import { GrainOverlay } from "../shared/GrainOverlay";

const asks = [
  {
    n: "01",
    text: "30-minute meeting with billing or admin team",
    highlight: false,
  },
  {
    n: "02",
    text: "Show you the live demo on your own data",
    highlight: false,
  },
  {
    n: "03",
    text: "Answer 10 research questions about your workflow",
    highlight: false,
  },
  {
    n: "04",
    text: "Letter of Intent if the tool proves useful",
    highlight: true,
  },
];

export const TheAskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEntrance = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const headlineY = interpolate(headlineEntrance, [0, 1], [30, 0]);
  const headlineOpacity = interpolate(headlineEntrance, [0, 1], [0, 1]);

  const glowPulse = 0.6 + Math.sin((frame / fps) * Math.PI * 2 * 0.8) * 0.4;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.ink} 0%, #2A2318 60%, #1A1208 100%)`,
        padding: "60px 80px",
        flexDirection: "column",
      }}
    >
      <FloatingOrbs opacity={0.35} />
      <ParticleField count={30} color={COLORS.gold} />
      <GrainOverlay opacity={0.05} />

      <div
        style={{
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLORS.goldLt,
          }}
        >
          The Ask
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          marginBottom: 40,
        }}
      >
        <h2
          style={{
            fontFamily: "serif",
            fontSize: 54,
            fontWeight: 300,
            color: COLORS.cream,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          What I'm asking{" "}
          <span
            style={{
              background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLt})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
            }}
          >
            Embryolab
          </span>
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {asks.map((ask, i) => {
          const askSpring = spring({ frame, fps, delay: 20 + i * 12, config: SPRING_SNAPPY });
          const askX = interpolate(askSpring, [0, 1], [-80, 0]);
          const askOpacity = interpolate(askSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={ask.n}
              style={{
                transform: `translateX(${askX}px)`,
                opacity: askOpacity,
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "20px 28px",
                background: ask.highlight
                  ? `linear-gradient(90deg, ${COLORS.gold}22, ${COLORS.goldLt}15)`
                  : "rgba(255,255,255,0.06)",
                borderRadius: 16,
                border: ask.highlight
                  ? `1px solid ${COLORS.gold}60`
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: ask.highlight
                  ? `0 0 ${30 * glowPulse}px ${COLORS.gold}30`
                  : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: ask.highlight ? COLORS.gold : COLORS.inkMute,
                  minWidth: 40,
                }}
              >
                {ask.n}
              </span>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 18,
                  color: ask.highlight ? COLORS.goldLt : COLORS.cream,
                  fontWeight: ask.highlight ? 600 : 400,
                  lineHeight: 1.3,
                }}
              >
                {ask.text}
              </span>
              {ask.highlight && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: COLORS.gold,
                    background: `${COLORS.gold}20`,
                    padding: "4px 12px",
                    borderRadius: 100,
                    border: `1px solid ${COLORS.gold}40`,
                    whiteSpace: "nowrap",
                  }}
                >
                  KEY ASK
                </span>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
