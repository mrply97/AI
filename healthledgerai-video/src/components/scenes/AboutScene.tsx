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
import { ShaderBG } from "../shared/ShaderBG";
import { LiquidGlassCard } from "../shared/LiquidGlassCard";
import { LiquidLogo } from "../shared/LiquidLogo";
import { GrainOverlay } from "../shared/GrainOverlay";

const credentials = [
  { icon: "🎓", text: "AI Engineer · Active learning roadmap 2026–27" },
  { icon: "🏥", text: "Healthcare billing expertise · Greece & Cyprus" },
  { icon: "🇪🇺", text: "EIC Pre-Accelerator candidate 2027" },
  { icon: "🔒", text: "GDPR-first design · NDA available on request" },
];

export const AboutScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, delay: 5, config: SPRING_BOUNCY });
  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });

  const leftSpring = spring({ frame, fps, delay: 15, config: { damping: 200 } });
  const leftY = interpolate(leftSpring, [0, 1], [40, 0]);
  const leftOpacity = interpolate(leftSpring, [0, 1], [0, 1]);

  const quoteSpring = spring({ frame, fps, delay: 80, config: { damping: 200 } });
  const quoteOpacity = interpolate(quoteSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        padding: "72px 100px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ShaderBG
        color1="#C9AA7C"
        color2="#1E1A14"
        color3="#7A9E8A"
        intensity={0.65}
        speed={0.6}
      />
      <GrainOverlay opacity={0.04} />

      <div style={{ display: "flex", gap: 72, alignItems: "center" }}>
        {/* Left — bio */}
        <div
          style={{
            flex: 1,
            transform: `translateY(${leftY}px)`,
            opacity: leftOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              marginBottom: 32,
              display: "inline-block",
            }}
          >
            <LiquidLogo size={88} />
          </div>

          <h2
            style={{
              fontFamily: "serif",
              fontSize: 52,
              fontWeight: 600,
              color: COLORS.cream,
              margin: "0 0 8px",
              lineHeight: 1.1,
            }}
          >
            Maria Polychroniadou
          </h2>

          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 16,
              color: COLORS.gold,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "0 0 28px",
              fontWeight: 400,
            }}
          >
            Founder · HealthLedgerAI
          </p>

          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 20,
              color: `${COLORS.cream}80`,
              lineHeight: 1.7,
              margin: "0 0 36px",
              fontWeight: 300,
            }}
          >
            Building AI-powered billing compliance tools
            <br />for private healthcare in Greece and Cyprus.
          </p>

          <div
            style={{
              padding: "14px 24px",
              background: `${COLORS.gold}18`,
              border: `1px solid ${COLORS.gold}35`,
              borderRadius: 12,
              fontFamily: "sans-serif",
              fontSize: 16,
              color: COLORS.goldLt,
              display: "inline-block",
            }}
          >
            healthledgerai.com
          </div>
        </div>

        {/* Right — credentials */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
          {credentials.map((c, i) => {
            const credSpring = spring({ frame, fps, delay: 28 + i * 14, config: SPRING_SNAPPY });
            const credX = interpolate(credSpring, [0, 1], [70, 0]);
            const credOpacity = interpolate(credSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
            return (
              <div
                key={i}
                style={{
                  transform: `translateX(${credX}px)`,
                  opacity: credOpacity,
                }}
              >
                <LiquidGlassCard dark style={{ padding: "20px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{c.icon}</span>
                    <span
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: 18,
                        color: COLORS.cream,
                        lineHeight: 1.4,
                        fontWeight: 300,
                      }}
                    >
                      {c.text}
                    </span>
                  </div>
                </LiquidGlassCard>
              </div>
            );
          })}

          {/* Closing quote */}
          <div
            style={{
              opacity: quoteOpacity,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "serif",
                fontSize: 26,
                color: COLORS.gold,
                fontStyle: "italic",
              }}
            >
              "Thank you for your time."
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
