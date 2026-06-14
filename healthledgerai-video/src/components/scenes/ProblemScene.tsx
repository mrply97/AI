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
import { GrainOverlay } from "../shared/GrainOverlay";

const problems = [
  {
    icon: "⚠",
    title: "Manual Review Fails",
    detail: "Billing auditors catch < 5% of errors",
    color: "#C0392B",
  },
  {
    icon: "💸",
    title: "Upcoding & Phantom Bills",
    detail: "Inflated procedures drain insurer budgets",
    color: "#E67E22",
  },
  {
    icon: "🔀",
    title: "Unbundling Schemes",
    detail: "Split codes bypass bundle pricing rules",
    color: "#C0392B",
  },
  {
    icon: "🆔",
    title: "Identity Collisions",
    detail: "Duplicate patient IDs enable fraud",
    color: "#E67E22",
  },
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEntrance = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const headlineY = interpolate(headlineEntrance, [0, 1], [30, 0]);
  const headlineOpacity = interpolate(headlineEntrance, [0, 1], [0, 1]);

  const statEntrance = spring({ frame, fps, delay: 15, config: SPRING_BOUNCY });
  const statScale = interpolate(statEntrance, [0, 1], [0.7, 1]);
  const statOpacity = interpolate(statEntrance, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.cream} 0%, ${COLORS.ivory} 100%)`,
        padding: "60px 80px",
        flexDirection: "column",
      }}
    >
      <FloatingOrbs opacity={0.15} />
      <GrainOverlay opacity={0.04} />

      {/* Section label */}
      <div
        style={{
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLORS.gold,
          }}
        >
          The Challenge
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontFamily: "serif",
            fontSize: 54,
            fontWeight: 300,
            color: COLORS.ink,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Healthcare billing is{" "}
          <span style={{ color: COLORS.red, fontWeight: 600 }}>broken</span>
        </h2>
      </div>

      {/* Big stat */}
      <div
        style={{
          transform: `scale(${statScale})`,
          opacity: statOpacity,
          marginBottom: 40,
          padding: "16px 28px",
          background: `${COLORS.red}12`,
          border: `1px solid ${COLORS.red}30`,
          borderRadius: 12,
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "baseline",
          gap: 10,
        }}
      >
        <span
          style={{
            fontFamily: "serif",
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.red,
          }}
        >
          3–10%
        </span>
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 16,
            color: COLORS.inkSoft,
            maxWidth: 260,
            lineHeight: 1.4,
          }}
        >
          of healthcare revenue lost to billing fraud &amp; errors globally
        </span>
      </div>

      {/* Problem cards */}
      <div style={{ display: "flex", gap: 20, flex: 1 }}>
        {problems.map((p, i) => {
          const cardEntrance = spring({ frame, fps, delay: 25 + i * 10, config: SPRING_SNAPPY });
          const cardX = interpolate(cardEntrance, [0, 1], [-60, 0]);
          const cardOpacity = interpolate(cardEntrance, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={p.title}
              style={{
                transform: `translateX(${cardX}px)`,
                opacity: cardOpacity,
                flex: 1,
                padding: "24px 20px",
                background: COLORS.white,
                borderRadius: 16,
                borderTop: `4px solid ${p.color}`,
                boxShadow: "0 4px 24px rgba(30,26,20,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 28 }}>{p.icon}</span>
              <h3
                style={{
                  fontFamily: "serif",
                  fontSize: 20,
                  color: COLORS.ink,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 14,
                  color: COLORS.inkSoft,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {p.detail}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
