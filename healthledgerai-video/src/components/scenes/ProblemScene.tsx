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
import { ShaderBGLight } from "../shared/ShaderBG";
import { LiquidGlassCard } from "../shared/LiquidGlassCard";
import { GrainOverlay } from "../shared/GrainOverlay";

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  const titleSpring = spring({ frame, fps, delay: 12, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const statSpring = spring({ frame, fps, delay: 28, config: { damping: 8, mass: 0.5 } });
  const statScale = interpolate(statSpring, [0, 1], [0.7, 1]);
  const statOpacity = interpolate(statSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const card1Spring = spring({ frame, fps, delay: 50, config: SPRING_SNAPPY });
  const card1X = interpolate(card1Spring, [0, 1], [-80, 0]);
  const card1Opacity = interpolate(card1Spring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const card2Spring = spring({ frame, fps, delay: 68, config: SPRING_SNAPPY });
  const card2X = interpolate(card2Spring, [0, 1], [80, 0]);
  const card2Opacity = interpolate(card2Spring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.cream} 0%, ${COLORS.ivory} 100%)`,
        padding: "80px 100px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ShaderBGLight opacity={0.14} />
      <GrainOverlay opacity={0.035} />

      {/* Label */}
      <div style={{ opacity: labelOpacity, marginBottom: 12 }}>
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: COLORS.gold,
            fontWeight: 500,
          }}
        >
          The Challenge
        </span>
      </div>

      {/* Title */}
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
            fontSize: 68,
            fontWeight: 300,
            color: COLORS.ink,
            margin: 0,
            lineHeight: 1.08,
          }}
        >
          Healthcare billing is{" "}
          <span style={{ color: "#C0392B", fontWeight: 600 }}>broken</span>
        </h2>
      </div>

      {/* Big stat — centrepiece */}
      <div
        style={{
          transform: `scale(${statScale})`,
          opacity: statOpacity,
          alignSelf: "flex-start",
          marginBottom: 48,
        }}
      >
        <LiquidGlassCard accentColor="#C0392B" style={{ padding: "28px 40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span
              style={{
                fontFamily: "serif",
                fontSize: 80,
                fontWeight: 700,
                color: "#C0392B",
                lineHeight: 1,
              }}
            >
              3–10%
            </span>
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 20,
                color: COLORS.inkSoft,
                maxWidth: 280,
                lineHeight: 1.4,
                fontWeight: 300,
              }}
            >
              of healthcare revenue lost
              <br />
              to fraud &amp; billing errors
            </span>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Two problem cards — big, readable */}
      <div style={{ display: "flex", gap: 28 }}>
        <div
          style={{
            flex: 1,
            transform: `translateX(${card1X}px)`,
            opacity: card1Opacity,
          }}
        >
          <LiquidGlassCard
            accentColor="#C0392B"
            style={{
              borderTop: "4px solid #C0392B",
              borderRadius: "4px 4px 24px 24px",
              padding: "32px 36px",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h3
              style={{
                fontFamily: "serif",
                fontSize: 28,
                color: COLORS.ink,
                margin: "0 0 12px",
                fontWeight: 600,
              }}
            >
              Upcoding &amp; Phantom Bills
            </h3>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: 18,
                color: COLORS.inkSoft,
                margin: 0,
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              Inflated procedure codes and invoices for services never rendered drain insurer budgets undetected
            </p>
          </LiquidGlassCard>
        </div>

        <div
          style={{
            flex: 1,
            transform: `translateX(${card2X}px)`,
            opacity: card2Opacity,
          }}
        >
          <LiquidGlassCard
            accentColor="#E67E22"
            style={{
              borderTop: "4px solid #E67E22",
              borderRadius: "4px 4px 24px 24px",
              padding: "32px 36px",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔀</div>
            <h3
              style={{
                fontFamily: "serif",
                fontSize: 28,
                color: COLORS.ink,
                margin: "0 0 12px",
                fontWeight: 600,
              }}
            >
              Unbundling &amp; Identity Fraud
            </h3>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: 18,
                color: COLORS.inkSoft,
                margin: 0,
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              Split procedure codes bypass bundle pricing, while duplicate patient IDs open the door to systematic fraud
            </p>
          </LiquidGlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};
