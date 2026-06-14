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

const columns = [
  {
    title: "Your System",
    color: COLORS.sage,
    bg: `${COLORS.sage}15`,
    border: `${COLORS.sage}40`,
    questions: [
      "What software manages billing today?",
      "How are EOPYY submissions handled?",
      "Who reviews invoices before submission?",
    ],
  },
  {
    title: "Validating the Problem",
    color: COLORS.red,
    bg: `${COLORS.red}10`,
    border: `${COLORS.red}30`,
    questions: [
      "Have duplicate invoices reached payers?",
      "Have EOPYY audits flagged anomalies?",
      "How often do amounts exceed agreed rates?",
    ],
  },
  {
    title: "IVF Billing Specifics",
    color: COLORS.amber,
    bg: `${COLORS.amber}12`,
    border: `${COLORS.amber}35`,
    questions: [
      "How is embryo storage billed over time?",
      "How are partial-cycle cancellations handled?",
      "★  Would a signed Letter of Intent be possible?",
    ],
  },
];

export const ResearchQuestionsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEntrance = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const headlineY = interpolate(headlineEntrance, [0, 1], [30, 0]);
  const headlineOpacity = interpolate(headlineEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.cream} 0%, ${COLORS.ivory} 100%)`,
        padding: "50px 80px",
        flexDirection: "column",
      }}
    >
      <FloatingOrbs opacity={0.13} />
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
            color: COLORS.gold,
          }}
        >
          Research Questions
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontFamily: "serif",
            fontSize: 48,
            fontWeight: 300,
            color: COLORS.ink,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          What I need to{" "}
          <span style={{ color: COLORS.gold, fontWeight: 600 }}>learn from you</span>
        </h2>
      </div>

      <div style={{ display: "flex", gap: 20, flex: 1 }}>
        {columns.map((col, ci) => {
          const colSpring = spring({ frame, fps, delay: 18 + ci * 12, config: SPRING_SNAPPY });
          const colY = interpolate(colSpring, [0, 1], [40, 0]);
          const colOpacity = interpolate(colSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={col.title}
              style={{
                transform: `translateY(${colY}px)`,
                opacity: colOpacity,
                flex: 1,
                padding: "22px 20px",
                background: col.bg,
                border: `1px solid ${col.border}`,
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <h3
                style={{
                  fontFamily: "serif",
                  fontSize: 20,
                  color: col.color,
                  margin: 0,
                  fontWeight: 700,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${col.border}`,
                }}
              >
                {col.title}
              </h3>
              {col.questions.map((q, qi) => {
                const qSpring = spring({
                  frame,
                  fps,
                  delay: 28 + ci * 12 + qi * 8,
                  config: SPRING_SNAPPY,
                });
                const qOpacity = interpolate(qSpring, [0, 1], [0, 1]);
                const isLast = qi === col.questions.length - 1 && ci === 2;
                return (
                  <div
                    key={qi}
                    style={{
                      opacity: qOpacity,
                      fontFamily: "sans-serif",
                      fontSize: 14,
                      color: isLast ? col.color : COLORS.inkSoft,
                      lineHeight: 1.5,
                      fontWeight: isLast ? 600 : 400,
                      padding: isLast ? "8px 10px" : 0,
                      background: isLast ? `${col.color}18` : "transparent",
                      borderRadius: isLast ? 8 : 0,
                      border: isLast ? `1px solid ${col.color}40` : "none",
                    }}
                  >
                    {q}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
