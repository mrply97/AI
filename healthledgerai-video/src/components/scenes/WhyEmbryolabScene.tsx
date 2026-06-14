import React from "react";
import {
  AbsoluteFill,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../constants/colors";
import { SPRING_SNAPPY } from "../../constants/timing";
import { FloatingOrbs } from "../shared/FloatingOrbs";
import { GrainOverlay } from "../shared/GrainOverlay";

const points = [
  {
    icon: "🧬",
    title: "IVF = Complex Billing",
    detail:
      "Multi-stage protocols, sperm/egg processing, embryo storage — each a billing surface for errors",
  },
  {
    icon: "🏥",
    title: "Private Clinic Risk",
    detail:
      "Out-of-network billing, surprise charges, and insurer disputes create daily compliance pressure",
  },
  {
    icon: "📋",
    title: "Regulatory Exposure",
    detail:
      "EOPYY audits and Greek health law violations carry significant financial and reputational risk",
  },
  {
    icon: "🔍",
    title: "Manual Audit Gap",
    detail:
      "Your current manual review can be augmented — HealthLedgerAI flags anomalies before submission",
  },
];

export const WhyEmbryolabScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEntrance = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const headlineY = interpolate(headlineEntrance, [0, 1], [30, 0]);
  const headlineOpacity = interpolate(headlineEntrance, [0, 1], [0, 1]);

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
            color: COLORS.blush,
          }}
        >
          Why Embryolab
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
            color: COLORS.ink,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          IVF clinics face{" "}
          <span style={{ color: COLORS.sage, fontWeight: 600 }}>unique</span> billing challenges
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
        {points.map((p, i) => {
          const ptSpring = spring({ frame, fps, delay: 18 + i * 12, config: SPRING_SNAPPY });
          const ptX = interpolate(ptSpring, [0, 1], [i % 2 === 0 ? -60 : 60, 0]);
          const ptOpacity = interpolate(ptSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={p.title}
              style={{
                transform: `translateX(${ptX}px)`,
                opacity: ptOpacity,
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "18px 24px",
                background: COLORS.white,
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(30,26,20,0.06)",
              }}
            >
              <span style={{ fontSize: 32, minWidth: 48, textAlign: "center" }}>{p.icon}</span>
              <div>
                <h3
                  style={{
                    fontFamily: "serif",
                    fontSize: 20,
                    color: COLORS.ink,
                    margin: "0 0 4px",
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
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
