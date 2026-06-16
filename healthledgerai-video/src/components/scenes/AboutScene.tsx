import React from "react";
import {
  AbsoluteFill,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SPRING_SNAPPY } from "../../constants/timing";
import { ParticleVortex } from "../shared/ParticleVortex";
import { LiquidGlassCard } from "../shared/LiquidGlassCard";
import { LiquidLogo } from "../shared/LiquidLogo";
import { GrainOverlay } from "../shared/GrainOverlay";

const academic = [
  "BSc International Management",
  "MSc Accounting & Finance",
  "PhD candidate — AI & billing compliance in private healthcare (Greece & Cyprus)",
  "Erasmus for Young Entrepreneurs — Thessaloniki, 2026",
];

const product = [
  "Pre-launch research prototype",
  "11 billing-error detectors built and tested",
  "Applied to EIT Jumpstarter 2026",
  "Target: EIC Pre-Accelerator 2027",
];

export const AboutScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, delay: 5, config: { damping: 8, mass: 0.5 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });

  const headSpring = spring({ frame, fps, delay: 14, config: { damping: 200 } });
  const headY = interpolate(headSpring, [0, 1], [30, 0]);
  const headOpacity = interpolate(headSpring, [0, 1], [0, 1]);

  const footSpring = spring({ frame, fps, delay: 95, config: { damping: 200 } });
  const footOpacity = interpolate(footSpring, [0, 1], [0, 1]);

  const Column: React.FC<{ title: string; items: string[]; baseDelay: number }> = ({
    title,
    items,
    baseDelay,
  }) => (
    <div style={{ flex: 1 }}>
      <h3
        style={{
          fontFamily: FONTS.sans,
          fontSize: 16,
          color: COLORS.goldLt,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          margin: "0 0 22px",
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((it, i) => {
          const sp = spring({ frame, fps, delay: baseDelay + i * 12, config: SPRING_SNAPPY });
          const x = interpolate(sp, [0, 1], [40, 0]);
          const opacity = interpolate(sp, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ transform: `translateX(${x}px)`, opacity }}>
              <LiquidGlassCard dark style={{ padding: "16px 22px" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ color: COLORS.gold, fontSize: 16, marginTop: 2 }}>·</span>
                  <span
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 17,
                      color: COLORS.cream,
                      lineHeight: 1.45,
                      fontWeight: 300,
                    }}
                  >
                    {it}
                  </span>
                </div>
              </LiquidGlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        padding: "64px 100px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ParticleVortex
        colorA={COLORS.goldLt}
        colorB={COLORS.sageLt}
        focalX={20}
        focalY={20}
        maxRadius={30}
        count={60}
        speed={0.5}
        opacity={0.5}
      />
      <GrainOverlay opacity={0.04} />

      {/* Header */}
      <div
        style={{
          transform: `translateY(${headY}px)`,
          opacity: headOpacity,
          marginBottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div style={{ transform: `scale(${logoScale})`, opacity: logoOpacity }}>
          <LiquidLogo size={72} />
        </div>
        <div>
          <span
            style={{
              fontFamily: FONTS.sans,
              fontSize: 13,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.gold,
              fontWeight: 500,
            }}
          >
            About the Researcher
          </span>
          <h2
            style={{
              fontFamily: FONTS.serif,
              fontSize: 56,
              fontWeight: 600,
              color: COLORS.cream,
              margin: "4px 0 2px",
              lineHeight: 1.05,
            }}
          >
            Maria Polychroniadou
          </h2>
          <p
            style={{
              fontFamily: FONTS.serif,
              fontStyle: "italic",
              fontSize: 22,
              color: COLORS.inkMute,
              margin: 0,
              fontWeight: 400,
            }}
          >
            PhD Researcher · HealthLedgerAI Founder
          </p>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: "flex", gap: 40, marginBottom: 32 }}>
        <Column title="Academic Background" items={academic} baseDelay={28} />
        <Column title="HealthLedgerAI" items={product} baseDelay={40} />
      </div>

      {/* Footer */}
      <div style={{ opacity: footOpacity, textAlign: "center" }}>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 17,
            color: COLORS.goldLt,
            margin: "0 0 6px",
            fontWeight: 400,
          }}
        >
          healthledgerai.com · info@healthledgerai.com
        </p>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 13,
            color: `${COLORS.cream}60`,
            margin: 0,
            fontWeight: 300,
          }}
        >
          All information in this presentation is covered by the NDA signed prior to this meeting.
        </p>
      </div>
    </AbsoluteFill>
  );
};
