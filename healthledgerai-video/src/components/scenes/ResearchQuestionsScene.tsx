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
import { ShaderBG } from "../shared/ShaderBG";
import { LiquidGlassCard } from "../shared/LiquidGlassCard";
import { GrainOverlay } from "../shared/GrainOverlay";

const columns = [
  {
    title: "Your Current System",
    color: COLORS.sageLt,
    borderColor: COLORS.sage,
    questions: [
      "What software manages billing today?",
      "How are EOPYY submissions currently handled?",
      "Who reviews invoices before submission?",
    ],
  },
  {
    title: "Validating the Problem",
    color: "#E57373",
    borderColor: "#C0392B",
    questions: [
      "Have duplicate invoices ever reached payers?",
      "Have EOPYY audits flagged anomalies?",
      "How often do billed amounts exceed agreed rates?",
    ],
  },
  {
    title: "IVF Billing Specifics",
    color: "#F0C060",
    borderColor: "#D4A017",
    questions: [
      "How is embryo cryostorage billed over time?",
      "How are partial-cycle cancellations handled?",
      "★  Could Embryolab provide a Letter of Intent?",
    ],
  },
];

export const ResearchQuestionsScene: React.FC = () => {
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
        background: COLORS.ink,
        padding: "72px 80px",
        flexDirection: "column",
      }}
    >
      <ShaderBG
        color1="#A08558"
        color2="#1E1A14"
        color3="#4A6B5A"
        intensity={0.55}
        speed={0.5}
      />
      <GrainOverlay opacity={0.04} />

      <div style={{ opacity: labelOpacity, marginBottom: 10 }}>
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: COLORS.goldLt,
          }}
        >
          Research Questions
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          marginBottom: 40,
        }}
      >
        <h2
          style={{
            fontFamily: "serif",
            fontSize: 58,
            fontWeight: 300,
            color: COLORS.cream,
            margin: 0,
            lineHeight: 1.08,
          }}
        >
          What I want to{" "}
          <span
            style={{
              background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLt})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
            }}
          >
            learn from you
          </span>
        </h2>
      </div>

      {/* Three columns */}
      <div style={{ display: "flex", gap: 24, flex: 1 }}>
        {columns.map((col, ci) => {
          const colSpring = spring({ frame, fps, delay: 30 + ci * 15, config: SPRING_SNAPPY });
          const colY = interpolate(colSpring, [0, 1], [50, 0]);
          const colOpacity = interpolate(colSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div
              key={col.title}
              style={{
                flex: 1,
                transform: `translateY(${colY}px)`,
                opacity: colOpacity,
              }}
            >
              <LiquidGlassCard
                dark
                accentColor={col.borderColor}
                style={{
                  height: "100%",
                  padding: "28px 26px",
                  borderTop: `3px solid ${col.borderColor}`,
                  borderRadius: "0 0 24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                <h3
                  style={{
                    fontFamily: "serif",
                    fontSize: 22,
                    color: col.color,
                    margin: "0 0 20px",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {col.title}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {col.questions.map((q, qi) => {
                    const qSpring = spring({
                      frame,
                      fps,
                      delay: 45 + ci * 15 + qi * 12,
                      config: { damping: 200 },
                    });
                    const qOpacity = interpolate(qSpring, [0, 1], [0, 1]);
                    const isLast = qi === col.questions.length - 1 && ci === 2;
                    return (
                      <div
                        key={qi}
                        style={{
                          opacity: qOpacity,
                          padding: isLast ? "12px 14px" : "0",
                          background: isLast ? `${col.borderColor}20` : "transparent",
                          border: isLast ? `1px solid ${col.borderColor}50` : "none",
                          borderRadius: isLast ? 12 : 0,
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "sans-serif",
                            fontSize: 17,
                            color: isLast ? col.color : `${COLORS.cream}CC`,
                            margin: 0,
                            lineHeight: 1.55,
                            fontWeight: isLast ? 600 : 300,
                          }}
                        >
                          {q}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </LiquidGlassCard>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
