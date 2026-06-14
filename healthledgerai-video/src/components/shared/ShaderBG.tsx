import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../constants/colors";

interface ShaderBGProps {
  color1?: string;
  color2?: string;
  color3?: string;
  intensity?: number;  // 0-1, controls blob size/opacity
  speed?: number;
}

// Animated mesh gradient — ShaderGradient-inspired effect using CSS radial gradients.
// Each "orb" drifts on independent sine/cosine paths giving a smooth, organic look.
export const ShaderBG: React.FC<ShaderBGProps> = ({
  color1 = COLORS.gold,
  color2 = COLORS.ink,
  color3 = COLORS.sage,
  intensity = 0.7,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps) * speed;

  const x1 = 15 + 22 * Math.sin(t * 0.31);
  const y1 = 12 + 18 * Math.cos(t * 0.24);
  const x2 = 78 + 16 * Math.cos(t * 0.28);
  const y2 = 70 + 20 * Math.sin(t * 0.19);
  const x3 = 50 + 25 * Math.sin(t * 0.22 + 1.2);
  const y3 = 85 + 10 * Math.cos(t * 0.35 + 0.8);
  const x4 = 85 + 12 * Math.cos(t * 0.18 + 2.1);
  const y4 = 25 + 22 * Math.sin(t * 0.27 + 0.5);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: color2,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 55% 50% at ${x1}% ${y1}%, ${color1}${Math.round(intensity * 200).toString(16).padStart(2, "0")} 0%, transparent 70%),
            radial-gradient(ellipse 50% 45% at ${x2}% ${y2}%, ${color3}${Math.round(intensity * 180).toString(16).padStart(2, "0")} 0%, transparent 65%),
            radial-gradient(ellipse 40% 38% at ${x3}% ${y3}%, ${color1}${Math.round(intensity * 140).toString(16).padStart(2, "0")} 0%, transparent 60%),
            radial-gradient(ellipse 35% 32% at ${x4}% ${y4}%, ${color3}${Math.round(intensity * 120).toString(16).padStart(2, "0")} 0%, transparent 55%)
          `,
        }}
      />
    </AbsoluteFill>
  );
};

// Lighter overlay for cream/ivory slides
export const ShaderBGLight: React.FC<{ opacity?: number }> = ({ opacity = 0.18 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const x1 = 18 + 20 * Math.sin(t * 0.25);
  const y1 = 14 + 18 * Math.cos(t * 0.18);
  const x2 = 76 + 18 * Math.cos(t * 0.32);
  const y2 = 68 + 22 * Math.sin(t * 0.27);
  const x3 = 52 + 28 * Math.sin(t * 0.15 + 2);
  const y3 = 88 + 10 * Math.cos(t * 0.22 + 1);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        background: `
          radial-gradient(ellipse 50% 42% at ${x1}% ${y1}%, ${COLORS.gold} 0%, transparent 68%),
          radial-gradient(ellipse 44% 38% at ${x2}% ${y2}%, ${COLORS.sage} 0%, transparent 62%),
          radial-gradient(ellipse 38% 32% at ${x3}% ${y3}%, ${COLORS.blush} 0%, transparent 58%)
        `,
      }}
    />
  );
};
