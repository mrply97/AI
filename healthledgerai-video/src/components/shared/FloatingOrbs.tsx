import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../constants/colors";

const orbs = [
  { color: COLORS.gold, size: 480, x: 15, y: 10, speedX: 0.3, speedY: 0.2, blur: 80 },
  { color: COLORS.sage, size: 360, x: 75, y: 65, speedX: -0.2, speedY: 0.35, blur: 70 },
  { color: COLORS.blush, size: 300, x: 50, y: 80, speedX: 0.25, speedY: -0.3, blur: 60 },
];

export const FloatingOrbs: React.FC<{ opacity?: number }> = ({ opacity = 0.35 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {orbs.map((orb, i) => {
        const driftX = Math.sin(t * orb.speedX + i * 2.1) * 8;
        const driftY = Math.cos(t * orb.speedY + i * 1.7) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${orb.x + driftX}%`,
              top: `${orb.y + driftY}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: orb.color,
              opacity,
              filter: `blur(${orb.blur}px)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
