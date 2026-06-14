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
import { ShaderBG } from "../shared/ShaderBG";
import { LiquidLogo } from "../shared/LiquidLogo";
import { GrainOverlay } from "../shared/GrainOverlay";

export const CoverScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, delay: 8, config: SPRING_BOUNCY });
  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });

  const nameSpring = spring({ frame, fps, delay: 22, config: { damping: 200 } });
  const nameY = interpolate(nameSpring, [0, 1], [40, 0]);
  const nameOpacity = interpolate(nameSpring, [0, 1], [0, 1]);

  const titleSpring = spring({ frame, fps, delay: 35, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const taglineSpring = spring({ frame, fps, delay: 50, config: { damping: 200 } });
  const taglineOpacity = interpolate(taglineSpring, [0, 1], [0, 1]);

  const footerSpring = spring({ frame, fps, delay: 65, config: SPRING_SNAPPY });
  const footerOpacity = interpolate(footerSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <ShaderBG
        color1="#C9AA7C"
        color2="#1E1A14"
        color3="#4A6B5A"
        intensity={0.75}
        speed={0.8}
      />
      <GrainOverlay opacity={0.04} />

      {/* Logo mark */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          marginBottom: 36,
        }}
      >
        <LiquidLogo size={96} />
      </div>

      {/* Brand name */}
      <div
        style={{
          transform: `translateY(${nameY}px)`,
          opacity: nameOpacity,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 16,
            color: COLORS.goldLt,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 400,
          }}
        >
          HealthLedgerAI
        </span>
      </div>

      {/* Main headline */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textAlign: "center",
          marginBottom: 28,
          padding: "0 120px",
        }}
      >
        <h1
          style={{
            fontFamily: "serif",
            fontSize: 88,
            fontWeight: 300,
            color: COLORS.cream,
            margin: "0 0 8px",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Billing Compliance
        </h1>
        <h1
          style={{
            fontFamily: "serif",
            fontSize: 88,
            fontWeight: 600,
            background: `linear-gradient(90deg, ${COLORS.gold} 0%, ${COLORS.goldLt} 50%, ${COLORS.gold} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          Intelligence
        </h1>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          textAlign: "center",
          marginBottom: 56,
        }}
      >
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: 24,
            color: COLORS.inkMute,
            margin: 0,
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          AI-powered fraud detection for private clinics in Greece
        </p>
      </div>

      {/* Footer attribution */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          opacity: footerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 1,
            background: `${COLORS.gold}60`,
          }}
        />
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 14,
            color: `${COLORS.gold}90`,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Presented to Embryolab Fertility Clinic · Thessaloniki
        </span>
        <div
          style={{
            width: 40,
            height: 1,
            background: `${COLORS.gold}60`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
