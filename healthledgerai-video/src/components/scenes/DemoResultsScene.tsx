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

const alerts = [
  {
    code: "D2",
    name: "Upcoding",
    risk: "HIGH",
    color: "#C0392B",
    finding: "Billed €850 for procedure max-allowed €620",
    action: "Withhold payment · request clinical justification",
  },
  {
    code: "D4",
    name: "Phantom Billing",
    risk: "HIGH",
    color: "#C0392B",
    finding: "Invoice dated 14 Aug — no appointment found for patient on that date",
    action: "Verify physical presence · do not pay without confirmation",
  },
];

export const DemoResultsScene: React.FC = () => {
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
      <ShaderBGLight opacity={0.12} />
      <GrainOverlay opacity={0.035} />

      <div style={{ opacity: labelOpacity, marginBottom: 12 }}>
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#C0392B",
            fontWeight: 500,
          }}
        >
          Alert Examples
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          marginBottom: 52,
        }}
      >
        <h2
          style={{
            fontFamily: "serif",
            fontSize: 64,
            fontWeight: 300,
            color: COLORS.ink,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Real findings.{" "}
          <span style={{ color: "#C0392B", fontWeight: 600 }}>Clear actions.</span>
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {alerts.map((a, i) => {
          const cardSpring = spring({ frame, fps, delay: 32 + i * 22, config: SPRING_SNAPPY });
          const cardY = interpolate(cardSpring, [0, 1], [50, 0]);
          const cardOpacity = interpolate(cardSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={a.code}
              style={{
                transform: `translateY(${cardY}px)`,
                opacity: cardOpacity,
              }}
            >
              <LiquidGlassCard
                accentColor={a.color}
                style={{
                  borderLeft: `5px solid ${a.color}`,
                  borderRadius: "0 24px 24px 0",
                  padding: "28px 36px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 28 }}>
                  {/* Badge */}
                  <div style={{ flexShrink: 0 }}>
                    <div
                      style={{
                        padding: "6px 16px",
                        borderRadius: 100,
                        background: a.color,
                        fontFamily: "sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: COLORS.white,
                        letterSpacing: "0.05em",
                        marginBottom: 8,
                      }}
                    >
                      {a.code}
                    </div>
                    <div
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: 12,
                        color: a.color,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        paddingLeft: 4,
                      }}
                    >
                      {a.risk}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: "serif",
                        fontSize: 28,
                        color: COLORS.ink,
                        margin: "0 0 12px",
                        fontWeight: 600,
                      }}
                    >
                      {a.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: 19,
                        color: COLORS.inkSoft,
                        margin: "0 0 14px",
                        lineHeight: 1.5,
                        fontWeight: 300,
                      }}
                    >
                      {a.finding}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 16px",
                        background: `${a.color}10`,
                        borderRadius: 10,
                        border: `1px solid ${a.color}25`,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>→</span>
                      <span
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: 16,
                          color: a.color,
                          fontWeight: 500,
                        }}
                      >
                        {a.action}
                      </span>
                    </div>
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
