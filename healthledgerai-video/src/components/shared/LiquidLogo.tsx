import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../constants/colors";

export const LiquidLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Liquid displacement: slowly morphing turbulence seed
  const seed = Math.floor(t * 4) % 100;
  const bf = 0.025 + 0.005 * Math.sin(t * 0.5);

  const filterId = `liquid-logo-${frame}`;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLt} 45%, ${COLORS.sage})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 ${size * 0.5}px ${COLORS.gold}50, 0 4px 20px rgba(0,0,0,0.4)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Liquid shimmer overlay */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={bf}
              numOctaves="4"
              seed={seed}
            />
            <feDisplacementMap
              in="SourceGraphic"
              xChannelSelector="R"
              yChannelSelector="G"
              scale={size * 0.08}
            />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(255,255,255,0.18)"
          filter={`url(#${filterId})`}
          rx={size * 0.22}
        />
      </svg>

      {/* Icon */}
      <svg
        width={size * 0.45}
        height={size * 0.45}
        viewBox="0 0 24 24"
        fill="none"
        style={{ position: "relative", zIndex: 1 }}
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill={COLORS.ink} opacity="0.9" />
        <path
          d="M2 17l10 5 10-5"
          stroke={COLORS.ink}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M2 12l10 5 10-5"
          stroke={COLORS.ink}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};
