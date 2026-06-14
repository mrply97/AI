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

const stats = [
  { value: "11", label: "Detectors", sub: "automated checks" },
  { value: "506", label: "Invoices", sub: "analysed in seconds" },
  { value: "70", label: "Alerts", sub: "flagged instantly" },
];

const steps = [
  { n: "01", text: "Load XLSX/CSV billing export" },
  { n: "02", text: "Run 11 compliance detectors" },
  { n: "03", text: "Ranked alert report generated" },
  { n: "04", text: "Action prescribed per finding" },
];

export const SolutionScene: React.FC = () => {
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
            color: COLORS.sage,
          }}
        >
          The Solution
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          marginBottom: 36,
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
          HealthLedgerAI catches what{" "}
          <span style={{ color: COLORS.sage, fontWeight: 600 }}>humans miss</span>
        </h2>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 20, marginBottom: 36 }}>
        {stats.map((s, i) => {
          const statSpring = spring({ frame, fps, delay: 15 + i * 10, config: SPRING_BOUNCY });
          const statScale = interpolate(statSpring, [0, 1], [0.6, 1]);
          const statOpacity = interpolate(statSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={s.label}
              style={{
                transform: `scale(${statScale})`,
                opacity: statOpacity,
                flex: 1,
                padding: "24px 20px",
                background: `linear-gradient(135deg, ${COLORS.sage}18, ${COLORS.sageLt}10)`,
                border: `1px solid ${COLORS.sage}30`,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "serif",
                  fontSize: 52,
                  fontWeight: 700,
                  color: COLORS.sage,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: COLORS.ink,
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 12,
                  color: COLORS.inkMute,
                  marginTop: 2,
                }}
              >
                {s.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {steps.map((step, i) => {
          const stepSpring = spring({ frame, fps, delay: 35 + i * 10, config: SPRING_SNAPPY });
          const stepX = interpolate(stepSpring, [0, 1], [50, 0]);
          const stepOpacity = interpolate(stepSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={step.n}
              style={{
                transform: `translateX(${stepX}px)`,
                opacity: stepOpacity,
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "14px 20px",
                background: COLORS.white,
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(30,26,20,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.gold,
                  minWidth: 36,
                }}
              >
                {step.n}
              </span>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 16,
                  color: COLORS.inkSoft,
                }}
              >
                {step.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
