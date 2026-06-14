import React from "react";
import {
  AbsoluteFill,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../constants/colors";
import { SPRING_BOUNCY } from "../../constants/timing";
import { ShaderBG } from "../shared/ShaderBG";
import { GrainOverlay } from "../shared/GrainOverlay";

export const DemoNumbersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  const n1Spring = spring({ frame, fps, delay: 18, config: SPRING_BOUNCY });
  const n1Scale = interpolate(n1Spring, [0, 1], [0.5, 1]);
  const n1Opacity = interpolate(n1Spring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const arrowSpring = spring({ frame, fps, delay: 40, config: { damping: 200 } });
  const arrowOpacity = interpolate(arrowSpring, [0, 1], [0, 1]);

  const n2Spring = spring({ frame, fps, delay: 55, config: SPRING_BOUNCY });
  const n2Scale = interpolate(n2Spring, [0, 1], [0.5, 1]);
  const n2Opacity = interpolate(n2Spring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const statsSpring = spring({ frame, fps, delay: 85, config: { damping: 200 } });
  const statsY = interpolate(statsSpring, [0, 1], [30, 0]);
  const statsOpacity = interpolate(statsSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <ShaderBG
        color1="#A08558"
        color2="#1E1A14"
        color3="#4A6B5A"
        intensity={0.65}
        speed={0.6}
      />
      <GrainOverlay opacity={0.05} />

      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 80,
          opacity: labelOpacity,
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 13,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: COLORS.goldLt,
          }}
        >
          Live Demo · Results
        </span>
      </div>

      {/* Main number flow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 48,
          marginBottom: 60,
        }}
      >
        {/* Input count */}
        <div
          style={{
            transform: `scale(${n1Scale})`,
            opacity: n1Opacity,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 120,
              fontWeight: 700,
              color: COLORS.cream,
              lineHeight: 1,
            }}
          >
            506
          </div>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 20,
              color: COLORS.inkMute,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Invoices analysed
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            opacity: arrowOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg width="64" height="24" viewBox="0 0 64 24">
            <path
              d="M0 12 H56 M44 4 L56 12 L44 20"
              stroke={COLORS.gold}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 13,
              color: `${COLORS.gold}80`,
              letterSpacing: "0.08em",
            }}
          >
            AI detected
          </span>
        </div>

        {/* Alert count */}
        <div
          style={{
            transform: `scale(${n2Scale})`,
            opacity: n2Opacity,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 120,
              fontWeight: 700,
              color: "#C0392B",
              lineHeight: 1,
            }}
          >
            70
          </div>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 20,
              color: COLORS.inkMute,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Alerts flagged
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div
        style={{
          transform: `translateY(${statsY}px)`,
          opacity: statsOpacity,
          display: "flex",
          gap: 32,
        }}
      >
        {[
          { count: "53", label: "HIGH RISK", color: "#C0392B" },
          { count: "17", label: "MEDIUM RISK", color: "#E67E22" },
          { count: "11", label: "DETECTORS", color: COLORS.gold },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: "20px 32px",
              borderRadius: 16,
              background: `${s.color}18`,
              border: `1px solid ${s.color}35`,
              textAlign: "center",
              minWidth: 160,
            }}
          >
            <div
              style={{
                fontFamily: "serif",
                fontSize: 48,
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
                fontSize: 13,
                color: `${s.color}90`,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
