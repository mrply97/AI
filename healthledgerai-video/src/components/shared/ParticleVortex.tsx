import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../constants/colors";

interface VortexParticle {
  angle: number;
  radiusFactor: number;
  speed: number;
  size: number;
  opacity: number;
  phase: number;
  dir: 1 | -1;
}

interface ParticleVortexProps {
  count?: number;
  colorA?: string;
  colorB?: string;
  focalX?: number; // % of width
  focalY?: number; // % of height
  maxRadius?: number; // % of min(width, height)
  speed?: number;
  connectLines?: boolean;
  opacity?: number;
}

// Dramatic swirl/vortex hero visual — particles orbit a focal point on
// independent elliptical paths, with faint constellation lines between
// neighbours. Same seeded-random determinism as ParticleField, scaled up
// for a single-focus "hero moment" rather than ambient background dust.
export const ParticleVortex: React.FC<ParticleVortexProps> = ({
  count = 90,
  colorA = COLORS.goldLt,
  colorB = COLORS.sageLt,
  focalX = 50,
  focalY = 46,
  maxRadius = 38,
  speed = 1,
  connectLines = true,
  opacity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = (frame / fps) * speed;

  const particles = useMemo<VortexParticle[]>(() => {
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      angle: rng(i * 3.1) * Math.PI * 2,
      radiusFactor: 0.15 + rng(i * 5.7) * 0.85,
      speed: 0.2 + rng(i * 2.3) * 0.5,
      size: 1.2 + rng(i * 6.9) * 2.6,
      opacity: 0.35 + rng(i * 4.1) * 0.55,
      phase: rng(i * 8.3) * Math.PI * 2,
      dir: i % 2 === 0 ? 1 : -1,
    }));
  }, [count]);

  const minDim = Math.min(width, height);
  const cx = (focalX / 100) * width;
  const cy = (focalY / 100) * height;

  const points = particles.map((p) => {
    const swirl = p.angle + t * p.speed * p.dir;
    const breathe = 0.85 + 0.15 * Math.sin(t * 0.4 + p.phase);
    const r = p.radiusFactor * (maxRadius / 100) * minDim * breathe;
    const x = cx + Math.cos(swirl) * r;
    const y = cy + Math.sin(swirl) * r * 0.7;
    const twinkle = 0.5 + 0.5 * Math.sin(t * 1.6 + p.phase);
    return { x, y, size: p.size, opacity: p.opacity * twinkle };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="vortex-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colorA} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colorA} stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={minDim * 0.22} fill="url(#vortex-glow)" />

        {connectLines &&
          points.map((p, i) => {
            const next = points[(i + 7) % points.length];
            const dx = p.x - next.x;
            const dy = p.y - next.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const threshold = minDim * 0.2;
            if (dist > threshold) return null;
            const lineOpacity = (1 - dist / threshold) * 0.18;
            return (
              <line
                key={`l-${i}`}
                x1={p.x}
                y1={p.y}
                x2={next.x}
                y2={next.y}
                stroke={colorB}
                strokeWidth={0.6}
                opacity={lineOpacity}
              />
            );
          })}

        {points.map((p, i) => (
          <circle
            key={`p-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={i % 3 === 0 ? colorB : colorA}
            opacity={p.opacity}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
