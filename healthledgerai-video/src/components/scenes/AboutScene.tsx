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

const credentials = [
  { icon: "🎓", text: "AI Engineer · Active learning roadmap 2026–27" },
  { icon: "🏥", text: "Healthcare billing domain expertise · Greece & Cyprus" },
  { icon: "🇪🇺", text: "EIC Pre-Accelerator candidate · Target 2027" },
  { icon: "🔒", text: "GDPR-first design · NDA provided on request" },
];

export const AboutScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEntrance = spring({ frame, fps, delay: 8, config: { damping: 200 } });
  const leftY = interpolate(leftEntrance, [0, 1], [40, 0]);
  const leftOpacity = interpolate(leftEntrance, [0, 1], [0, 1]);

  const avatarSpring = spring({ frame, fps, delay: 5, config: SPRING_BOUNCY });
  const avatarScale = interpolate(avatarSpring, [0, 1], [0.5, 1]);
  const avatarOpacity = interpolate(avatarSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.ink} 0%, #2A2318 60%, #1A1208 100%)`,
        padding: "60px 80px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <FloatingOrbs opacity={0.35} />
      <ParticleField count={25} color={COLORS.goldLt} />
      <GrainOverlay opacity={0.05} />

      <div style={{ display: "flex", gap: 60, alignItems: "center", flex: 1 }}>
        {/* Left: bio */}
        <div
          style={{
            flex: 1,
            transform: `translateY(${leftY}px)`,
            opacity: leftOpacity,
          }}
        >
          {/* Avatar placeholder */}
          <div
            style={{
              transform: `scale(${avatarScale})`,
              opacity: avatarOpacity,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.sage})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              boxShadow: `0 0 40px ${COLORS.gold}40`,
              fontSize: 36,
            }}
          >
            👩‍💻
          </div>

          <h2
            style={{
              fontFamily: "serif",
              fontSize: 42,
              fontWeight: 600,
              color: COLORS.cream,
              margin: "0 0 6px",
              lineHeight: 1.1,
            }}
          >
            Maria Polychroniadou
          </h2>

          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 15,
              color: COLORS.gold,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              margin: "0 0 20px",
            }}
          >
            Founder · HealthLedgerAI
          </p>

          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 16,
              color: COLORS.inkMute,
              lineHeight: 1.7,
              margin: "0 0 28px",
              maxWidth: 420,
            }}
          >
            Building AI-powered billing compliance tools for private healthcare in
            Greece and Cyprus. Targeting EIC Pre-Accelerator 2027.
          </p>

          <div
            style={{
              padding: "12px 20px",
              background: `${COLORS.gold}15`,
              border: `1px solid ${COLORS.gold}30`,
              borderRadius: 10,
              fontFamily: "sans-serif",
              fontSize: 14,
              color: COLORS.goldLt,
            }}
          >
            healthledgerai.com
          </div>
        </div>

        {/* Right: credentials */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {credentials.map((c, i) => {
            const credSpring = spring({ frame, fps, delay: 20 + i * 12, config: SPRING_SNAPPY });
            const credX = interpolate(credSpring, [0, 1], [60, 0]);
            const credOpacity = interpolate(credSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
            return (
              <div
                key={i}
                style={{
                  transform: `translateX(${credX}px)`,
                  opacity: credOpacity,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "18px 22px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                }}
              >
                <span style={{ fontSize: 24, minWidth: 36, textAlign: "center" }}>{c.icon}</span>
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 15,
                    color: COLORS.cream,
                    lineHeight: 1.4,
                  }}
                >
                  {c.text}
                </span>
              </div>
            );
          })}

          {/* Closing line */}
          <div
            style={{
              marginTop: 8,
              opacity: interpolate(
                spring({ frame, fps, delay: 65, config: { damping: 200 } }),
                [0, 1],
                [0, 1]
              ),
              fontFamily: "serif",
              fontSize: 22,
              color: COLORS.gold,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            "Thank you for your time."
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
