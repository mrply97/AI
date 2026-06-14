import React from "react";
import {
  AbsoluteFill,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../constants/colors";
import { SPRING_BOUNCY, SPRING_SNAPPY } from "../../constants/timing";
import { FloatingOrbs } from "../shared/FloatingOrbs";
import { ParticleField } from "../shared/ParticleField";
import { GrainOverlay } from "../shared/GrainOverlay";

const chips = ["Billing Compliance", "Greek Healthcare", "AI-Powered", "EIC 2027"];

export const CoverScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({ frame, fps, delay: 5, config: SPRING_BOUNCY });
  const titleEntrance = spring({ frame, fps, delay: 15, config: { damping: 200 } });
  const subtitleEntrance = spring({ frame, fps, delay: 25, config: { damping: 200 } });

  const logoScale = interpolate(logoEntrance, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(logoEntrance, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const titleY = interpolate(titleEntrance, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);

  const subtitleY = interpolate(subtitleEntrance, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(subtitleEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.ink} 0%, #2A2318 50%, #1A1208 100%)`,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <FloatingOrbs opacity={0.4} />
      <ParticleField count={50} color={COLORS.goldLt} />
      <GrainOverlay opacity={0.05} />

      {/* Logo mark */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLt})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 30px ${COLORS.gold}60`,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill={COLORS.ink} opacity="0.9" />
            <path d="M2 17l10 5 10-5" stroke={COLORS.ink} strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M2 12l10 5 10-5" stroke={COLORS.ink} strokeWidth="2" fill="none" opacity="0.5" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "serif",
            fontSize: 22,
            color: COLORS.goldLt,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          HealthLedgerAI
        </span>
      </div>

      {/* Main title */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        <h1
          style={{
            fontFamily: "serif",
            fontSize: 72,
            fontWeight: 300,
            color: COLORS.cream,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          Billing Compliance
        </h1>
        <h1
          style={{
            fontFamily: "serif",
            fontSize: 72,
            fontWeight: 600,
            background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLt}, ${COLORS.gold})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Intelligence
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleOpacity,
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: 20,
            color: COLORS.inkMute,
            margin: 0,
            letterSpacing: "0.04em",
            fontWeight: 300,
          }}
        >
          AI-powered fraud detection for private clinics in Greece
        </p>
      </div>

      {/* Floating chips */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {chips.map((chip, i) => {
          const chipSpring = spring({ frame, fps, delay: 35 + i * 8, config: SPRING_SNAPPY });
          const chipY = interpolate(chipSpring, [0, 1], [20, 0]);
          const chipOpacity = interpolate(chipSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={chip}
              style={{
                transform: `translateY(${chipY}px)`,
                opacity: chipOpacity,
                padding: "8px 18px",
                borderRadius: 100,
                border: `1px solid ${COLORS.gold}40`,
                background: `${COLORS.gold}15`,
                fontFamily: "sans-serif",
                fontSize: 13,
                color: COLORS.goldLt,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {chip}
            </div>
          );
        })}
      </div>

      {/* Bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: subtitleOpacity * 0.6,
          fontFamily: "sans-serif",
          fontSize: 13,
          color: COLORS.inkMute,
          letterSpacing: "0.06em",
        }}
      >
        Presented to Embryolab Fertility Clinic · Thessaloniki
      </div>
    </AbsoluteFill>
  );
};
