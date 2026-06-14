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

const alerts = [
  {
    code: "D2",
    name: "Upcoding",
    risk: "HIGH",
    detail: "Billed €850 for procedure max €620",
    color: "#C0392B",
  },
  {
    code: "D4",
    name: "Phantom Billing",
    risk: "HIGH",
    detail: "No appointment on invoice date",
    color: "#C0392B",
  },
  {
    code: "D5",
    name: "Unbundling",
    risk: "HIGH",
    detail: "IVF components billed separately",
    color: "#E67E22",
  },
  {
    code: "D8",
    name: "Identity Collision",
    risk: "HIGH",
    detail: "Two patient IDs, same name & DOB",
    color: "#C0392B",
  },
];

export const DemoResultsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEntrance = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const headlineY = interpolate(headlineEntrance, [0, 1], [30, 0]);
  const headlineOpacity = interpolate(headlineEntrance, [0, 1], [0, 1]);

  const barEntrance = spring({ frame, fps, delay: 18, config: SPRING_BOUNCY });
  const barScale = interpolate(barEntrance, [0, 1], [0.8, 1]);
  const barOpacity = interpolate(barEntrance, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

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
            color: COLORS.gold,
          }}
        >
          Live Demo
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          marginBottom: 28,
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
          506 invoices →{" "}
          <span style={{ color: COLORS.red, fontWeight: 600 }}>70 alerts</span>
        </h2>
      </div>

      {/* Summary bar */}
      <div
        style={{
          transform: `scale(${barScale})`,
          opacity: barOpacity,
          display: "flex",
          gap: 16,
          marginBottom: 28,
          padding: "16px 24px",
          background: COLORS.white,
          borderRadius: 14,
          boxShadow: "0 4px 20px rgba(30,26,20,0.08)",
          alignItems: "center",
        }}
      >
        {[
          { count: "53", label: "HIGH", color: COLORS.red },
          { count: "17", label: "MEDIUM", color: COLORS.amber },
          { count: "70", label: "TOTAL", color: COLORS.gold },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              textAlign: "center",
              borderRight: s.label !== "TOTAL" ? `1px solid ${COLORS.cream}` : "none",
            }}
          >
            <div
              style={{
                fontFamily: "serif",
                fontSize: 40,
                fontWeight: 700,
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.count}
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 12,
                color: COLORS.inkMute,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Alert cards */}
      <div style={{ display: "flex", gap: 16, flex: 1 }}>
        {alerts.map((a, i) => {
          const cardSpring = spring({ frame, fps, delay: 28 + i * 10, config: SPRING_SNAPPY });
          const cardY = interpolate(cardSpring, [0, 1], [40, 0]);
          const cardOpacity = interpolate(cardSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={a.code}
              style={{
                transform: `translateY(${cardY}px)`,
                opacity: cardOpacity,
                flex: 1,
                padding: "18px 16px",
                background: COLORS.white,
                borderRadius: 14,
                borderLeft: `4px solid ${a.color}`,
                boxShadow: "0 4px 20px rgba(30,26,20,0.07)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: COLORS.white,
                    background: a.color,
                    padding: "2px 8px",
                    borderRadius: 100,
                    letterSpacing: "0.05em",
                  }}
                >
                  {a.code}
                </span>
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 10,
                    color: a.color,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {a.risk}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "serif",
                  fontSize: 17,
                  color: COLORS.ink,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {a.name}
              </div>
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 13,
                  color: COLORS.inkSoft,
                  lineHeight: 1.4,
                }}
              >
                {a.detail}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
