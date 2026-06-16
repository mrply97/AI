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
import { ParticleVortex } from "../shared/ParticleVortex";
import { SlideHeader } from "../shared/SlideHeader";
import { DetailBullet } from "../shared/DetailBullet";
import { GrainOverlay } from "../shared/GrainOverlay";

const bullets = [
  {
    term: "EOPYY + private insurers simultaneously",
    description:
      "IVF is covered by EOPYY up to 3 cycles for women under 50. Clinics bill two different systems with different rules for the same patient — mixed billing increases the risk of errors.",
  },
  {
    term: "High procedure values",
    description:
      "IVF cycle costs range from €3,000–€6,000. A single upcoding or duplicate billing error at this scale represents significant financial exposure.",
  },
  {
    term: "Multi-step billing sequences",
    description:
      "each cycle involves 8–12 separate billing events. Date mismatches and duplicate entries are common in high-volume, multi-step billing.",
  },
  {
    term: "ISO certification environment",
    description:
      "Embryolab is ISO 9001:2015 and EN 15224 certified — it already operates to documented process standards. A billing compliance tool fits naturally into that framework.",
  },
];

export const RelevanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introSpring = spring({ frame, fps, delay: 28, config: { damping: 200 } });
  const introOpacity = interpolate(introSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        padding: "72px 110px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ParticleVortex
        colorA={COLORS.blush}
        colorB={COLORS.sageLt}
        focalX={75}
        focalY={75}
        maxRadius={36}
        count={75}
        speed={0.6}
        opacity={0.6}
      />
      <GrainOverlay opacity={0.04} />

      <SlideHeader
        label="Relevance to Embryolab"
        labelColor={COLORS.blush}
        dark
        titleSize={56}
        marginBottom={24}
        title={
          <>
            Why fertility clinics are a{" "}
            <span style={{ color: COLORS.sageLt, fontWeight: 700 }}>natural fit</span>
          </>
        }
      />

      {/* Intro */}
      <p
        style={{
          fontFamily: FONTS.sans,
          fontSize: 21,
          color: `${COLORS.cream}C0`,
          margin: "0 0 32px",
          lineHeight: 1.6,
          maxWidth: 1120,
          fontWeight: 300,
          opacity: introOpacity,
        }}
      >
        Fertility clinics operate in one of the most billing-intensive environments in private
        healthcare. A single IVF cycle generates multiple billing events — consultations, laboratory
        procedures, medications, anaesthesia, embryology services — each with different tariff rules.
      </p>

      {/* Bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {bullets.map((b, i) => (
          <DetailBullet
            key={b.term}
            term={b.term}
            description={b.description}
            delay={42 + i * 18}
            accentColor={COLORS.sageLt}
            dark
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
