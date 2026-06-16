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
import { SPRING_BOUNCY } from "../../constants/timing";
import { ParticleVortex } from "../shared/ParticleVortex";
import { SlideHeader } from "../shared/SlideHeader";
import { LiquidGlassCard } from "../shared/LiquidGlassCard";
import { GrainOverlay } from "../shared/GrainOverlay";

const stats = [
  { value: "11", label: "Detectors running\nin parallel" },
  { value: "506", label: "Invoices analysed\nin the test" },
  { value: "70", label: "Alerts flagged\nautomatically" },
];

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introSpring = spring({ frame, fps, delay: 26, config: { damping: 200 } });
  const introOpacity = interpolate(introSpring, [0, 1], [0, 1]);

  const cardsSpring = spring({ frame, fps, delay: 110, config: { damping: 200 } });
  const cardsY = interpolate(cardsSpring, [0, 1], [30, 0]);
  const cardsOpacity = interpolate(cardsSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        padding: "72px 110px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ParticleVortex
        colorA={COLORS.sageLt}
        colorB={COLORS.goldLt}
        focalX={22}
        focalY={70}
        maxRadius={36}
        count={80}
        speed={0.6}
        opacity={0.6}
      />
      <GrainOverlay opacity={0.04} />

      <SlideHeader
        label="The Solution"
        labelColor={COLORS.sageLt}
        dark
        titleSize={64}
        marginBottom={18}
        title={<span style={{ fontWeight: 700 }}>HealthLedgerAI</span>}
        subtitle="Automated billing compliance detection — in seconds, not weeks"
      />

      {/* Intro */}
      <p
        style={{
          fontFamily: FONTS.sans,
          fontSize: 21,
          color: `${COLORS.cream}C0`,
          margin: "0 0 36px",
          lineHeight: 1.6,
          maxWidth: 1120,
          fontWeight: 300,
          opacity: introOpacity,
        }}
      >
        A Python-based prototype that reads a clinic's billing data — invoices, appointments,
        procedure rates, insurer networks — and automatically flags anomalies before they reach an
        insurer, before an audit, and before a payment is made that must be reversed.
      </p>

      {/* Stat boxes */}
      <div style={{ display: "flex", gap: 28, marginBottom: 36 }}>
        {stats.map((s, i) => {
          const sp = spring({ frame, fps, delay: 50 + i * 14, config: SPRING_BOUNCY });
          const scale = interpolate(sp, [0, 1], [0.6, 1]);
          const opacity = interpolate(sp, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={s.value} style={{ flex: 1, transform: `scale(${scale})`, opacity }}>
              <LiquidGlassCard dark accentColor={COLORS.sageLt} style={{ textAlign: "center", padding: "32px 24px" }}>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 76,
                    fontWeight: 700,
                    color: COLORS.sageLt,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 15,
                    color: `${COLORS.cream}B0`,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.4,
                    whiteSpace: "pre-line",
                  }}
                >
                  {s.label}
                </div>
              </LiquidGlassCard>
            </div>
          );
        })}
      </div>

      {/* What it reads / produces */}
      <div
        style={{
          display: "flex",
          gap: 28,
          transform: `translateY(${cardsY}px)`,
          opacity: cardsOpacity,
        }}
      >
        {[
          {
            title: "What it reads",
            body:
              "Invoice records · Patient records · Appointment records · Procedure rate tables · Bundle rules · Insurer network lists",
          },
          {
            title: "What it produces",
            body:
              "A plain Excel report — All Alerts, HIGH Priority and MEDIUM Priority tabs — ready to hand to the billing team. No special software needed.",
          },
        ].map((c) => (
          <div key={c.title} style={{ flex: 1 }}>
            <LiquidGlassCard dark accentColor={COLORS.gold} style={{ padding: "26px 30px", height: "100%" }}>
              <h3
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 23,
                  color: COLORS.cream,
                  margin: "0 0 12px",
                  fontWeight: 600,
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 18,
                  color: `${COLORS.cream}B0`,
                  margin: 0,
                  lineHeight: 1.55,
                  fontWeight: 300,
                }}
              >
                {c.body}
              </p>
            </LiquidGlassCard>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
