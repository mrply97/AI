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
import { ShaderBGLight } from "../shared/ShaderBG";
import { LiquidGlassCard } from "../shared/LiquidGlassCard";
import { GrainOverlay } from "../shared/GrainOverlay";

const points = [
  {
    icon: "🧬",
    title: "IVF billing is uniquely complex",
    detail:
      "Multi-stage protocols, sperm/egg processing, cryostorage, partial-cycle cancellations — each step is a potential billing error that manual review misses",
    color: COLORS.sage,
  },
  {
    icon: "🏥",
    title: "Private clinics face regulatory exposure",
    detail:
      "EOPYY audits, surprise billing violations, out-of-network claims — HealthLedgerAI flags anomalies before they reach the insurer",
    color: COLORS.gold,
  },
];

export const WhyEmbryolabScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  const titleSpring = spring({ frame, fps, delay: 12, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.cream} 0%, ${COLORS.ivory} 100%)`,
        padding: "80px 100px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ShaderBGLight opacity={0.13} />
      <GrainOverlay opacity={0.035} />

      <div style={{ opacity: labelOpacity, marginBottom: 12 }}>
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: COLORS.blush,
            fontWeight: 500,
          }}
        >
          Why IVF Clinics
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          marginBottom: 56,
        }}
      >
        <h2
          style={{
            fontFamily: "serif",
            fontSize: 68,
            fontWeight: 300,
            color: COLORS.ink,
            margin: 0,
            lineHeight: 1.08,
          }}
        >
          Embryolab faces billing risks{" "}
          <span style={{ color: COLORS.sage, fontWeight: 600 }}>every single day</span>
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28, flex: 1 }}>
        {points.map((p, i) => {
          const cardSpring = spring({ frame, fps, delay: 35 + i * 25, config: SPRING_SNAPPY });
          const cardX = interpolate(cardSpring, [0, 1], [i % 2 === 0 ? -70 : 70, 0]);
          const cardOpacity = interpolate(cardSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={p.title}
              style={{
                transform: `translateX(${cardX}px)`,
                opacity: cardOpacity,
              }}
            >
              <LiquidGlassCard accentColor={p.color} style={{ padding: "32px 40px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 28 }}>
                  <span
                    style={{
                      fontSize: 48,
                      lineHeight: 1,
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  >
                    {p.icon}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "serif",
                        fontSize: 30,
                        color: COLORS.ink,
                        margin: "0 0 14px",
                        fontWeight: 600,
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: 20,
                        color: COLORS.inkSoft,
                        margin: 0,
                        lineHeight: 1.6,
                        fontWeight: 300,
                      }}
                    >
                      {p.detail}
                    </p>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
