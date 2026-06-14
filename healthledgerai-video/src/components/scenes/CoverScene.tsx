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
import { SPRING_BOUNCY, SPRING_SNAPPY } from "../../constants/timing";
import { ShaderBG } from "../shared/ShaderBG";
import { LiquidLogo } from "../shared/LiquidLogo";
import { GrainOverlay } from "../shared/GrainOverlay";

export const CoverScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, delay: 6, config: SPRING_BOUNCY });
  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });

  const tagSpring = spring({ frame, fps, delay: 18, config: SPRING_SNAPPY });
  const tagOpacity = interpolate(tagSpring, [0, 1], [0, 1]);

  const titleSpring = spring({ frame, fps, delay: 28, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subSpring = spring({ frame, fps, delay: 44, config: { damping: 200 } });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);

  const dividerSpring = spring({ frame, fps, delay: 56, config: { damping: 200 } });
  const dividerW = interpolate(dividerSpring, [0, 1], [0, 160]);

  const footSpring = spring({ frame, fps, delay: 66, config: { damping: 200 } });
  const footOpacity = interpolate(footSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <ShaderBG color1="#C9AA7C" color2="#1E1A14" color3="#4A6B5A" intensity={0.7} speed={0.8} />
      <GrainOverlay opacity={0.04} />

      {/* Logo + wordmark */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <LiquidLogo size={64} />
        <span
          style={{
            fontFamily: FONTS.serif,
            fontSize: 30,
            color: COLORS.cream,
            letterSpacing: "0.02em",
            fontWeight: 500,
          }}
        >
          HealthLedger AI
        </span>
      </div>

      {/* Confidential tag */}
      <div
        style={{
          opacity: tagOpacity,
          padding: "8px 22px",
          background: `${COLORS.sage}25`,
          border: `1px solid ${COLORS.sage}40`,
          borderRadius: 4,
          marginBottom: 36,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.sans,
            fontSize: 13,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: COLORS.sageLt,
            fontWeight: 500,
          }}
        >
          Confidential · Research Prototype · June 2026
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textAlign: "center",
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            fontFamily: FONTS.serif,
            fontSize: 92,
            fontWeight: 400,
            color: COLORS.cream,
            margin: 0,
            lineHeight: 1.04,
            letterSpacing: "-0.01em",
          }}
        >
          Billing Compliance
          <br />
          for Private Clinics
        </h1>
      </div>

      {/* Italic subtitle */}
      <div
        style={{
          opacity: subOpacity,
          textAlign: "center",
          maxWidth: 760,
          marginBottom: 32,
        }}
      >
        <p
          style={{
            fontFamily: FONTS.serif,
            fontStyle: "italic",
            fontSize: 27,
            color: COLORS.inkMute,
            margin: 0,
            lineHeight: 1.45,
            fontWeight: 400,
          }}
        >
          A research prototype for detecting billing errors in private healthcare — tested on real data
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          width: dividerW,
          height: 1,
          background: `${COLORS.gold}70`,
          marginBottom: 32,
        }}
      />

      {/* Footer attribution */}
      <div style={{ opacity: footOpacity, textAlign: "center" }}>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 17,
            color: `${COLORS.cream}99`,
            margin: "0 0 8px",
            fontWeight: 300,
          }}
        >
          Presented to Embryolab Fertility Clinic, Thessaloniki
        </p>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 15,
            color: `${COLORS.cream}70`,
            margin: 0,
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          Maria Polychroniadou · PhD Researcher · HealthLedgerAI
        </p>
      </div>
    </AbsoluteFill>
  );
};
