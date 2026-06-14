import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../constants/colors";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  phase: number;
}

export const ParticleField: React.FC<{ count?: number; color?: string }> = ({
  count = 40,
  color = COLORS.gold,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const particles = useMemo<Particle[]>(() => {
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      x: rng(i * 3.7) * 100,
      y: rng(i * 2.3) * 100,
      vx: (rng(i * 1.1) - 0.5) * 0.8,
      vy: (rng(i * 4.9) - 0.5) * 0.6,
      size: 1 + rng(i * 7.1) * 2.5,
      opacity: 0.3 + rng(i * 5.3) * 0.5,
      phase: rng(i * 6.7) * Math.PI * 2,
    }));
  }, [count]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {particles.map((p, i) => {
          const px = ((p.x + p.vx * t * 15) % 100 + 100) % 100;
          const py = ((p.y + p.vy * t * 15) % 100 + 100) % 100;
          const twinkle = 0.4 + Math.sin(t * 2 + p.phase) * 0.3;
          return (
            <circle
              key={i}
              cx={`${px}%`}
              cy={`${py}%`}
              r={p.size}
              fill={color}
              opacity={p.opacity * twinkle}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
