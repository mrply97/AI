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

const steps = [
  { n: "01", text: "Upload your billing export (XLSX or CSV)" },
  { n: "02", text: "11 compliance detectors run automatically" },
  { n: "03", text: "Ranked alert report — action prescribed per finding" },
];

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  const titleSpring = spring({ frame, fps, delay: 12, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subtitleSpring = spring({ frame, fps, delay: 28, config: { damping: 200 } });
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);

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
            color: COLORS.sage,
            fontWeight: 500,
          }}
        >
          The Solution
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          marginBottom: 16,
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
          HealthLedgerAI catches{" "}
          <span style={{ color: COLORS.sage, fontWeight: 600 }}>what humans miss</span>
        </h2>
      </div>

      <div
        style={{
          opacity: subtitleOpacity,
          marginBottom: 52,
        }}
      >
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: 22,
            color: COLORS.inkMute,
            margin: 0,
            fontWeight: 300,
          }}
        >
          Three steps. Seconds, not hours.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {steps.map((step, i) => {
          const stepSpring = spring({ frame, fps, delay: 45 + i * 18, config: SPRING_SNAPPY });
          const stepX = interpolate(stepSpring, [0, 1], [-60, 0]);
          const stepOpacity = interpolate(stepSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={step.n}
              style={{
                transform: `translateX(${stepX}px)`,
                opacity: stepOpacity,
              }}
            >
              <LiquidGlassCard accentColor={COLORS.gold} style={{ padding: "28px 36px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <span
                    style={{
                      fontFamily: "serif",
                      fontSize: 52,
                      fontWeight: 700,
                      color: COLORS.gold,
                      lineHeight: 1,
                      minWidth: 64,
                    }}
                  >
                    {step.n}
                  </span>
                  <span
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: 24,
                      color: COLORS.ink,
                      lineHeight: 1.35,
                      fontWeight: 400,
                    }}
                  >
                    {step.text}
                  </span>
                </div>
              </LiquidGlassCard>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
