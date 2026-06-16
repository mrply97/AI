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
    term: "Duplicate invoices",
    description:
      "the same procedure billed twice to the same insurer, often months apart. Insurers eventually detect these and claw back payments with penalties.",
  },
  {
    term: "Upcoding",
    description:
      "a procedure billed above its allowed maximum rate under EOPYY or insurer tariffs. A common audit trigger that puts EOPYY contracts at risk.",
  },
  {
    term: "Phantom billing",
    description:
      "an invoice raised for a date when the patient has no recorded appointment. Can indicate a data-entry error or, in an audit, look like fraud.",
  },
  {
    term: "Unbundling",
    description:
      "procedure components that should be billed as one bundled code are billed individually at a higher combined total.",
  },
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introSpring = spring({ frame, fps, delay: 28, config: { damping: 200 } });
  const introOpacity = interpolate(introSpring, [0, 1], [0, 1]);

  const closeSpring = spring({ frame, fps, delay: 120, config: { damping: 200 } });
  const closeOpacity = interpolate(closeSpring, [0, 1], [0, 1]);

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
        colorA="#C0392B"
        colorB={COLORS.goldLt}
        focalX={78}
        focalY={30}
        maxRadius={34}
        count={70}
        speed={0.6}
        opacity={0.6}
      />
      <GrainOverlay opacity={0.04} />

      <SlideHeader
        label="The Problem"
        labelColor="#E0594A"
        dark
        titleSize={54}
        marginBottom={24}
        title={
          <>
            Private clinics lose money on billing
            <br />
            errors <span style={{ color: "#E0594A", fontWeight: 700 }}>they cannot see</span>
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
          maxWidth: 1100,
          fontWeight: 300,
          opacity: introOpacity,
        }}
      >
        Every private clinic in Greece processes hundreds of invoices per month — to EOPYY, to
        private insurers, and directly to patients. Hidden inside that volume are systematic errors
        that go undetected because no one has time to check them manually.
      </p>

      {/* Bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
        {bullets.map((b, i) => (
          <DetailBullet
            key={b.term}
            term={b.term}
            description={b.description}
            delay={42 + i * 18}
            accentColor="#E0594A"
            dark
          />
        ))}
      </div>

      {/* Closing emphasis */}
      <p
        style={{
          fontFamily: FONTS.sans,
          fontSize: 19,
          color: `${COLORS.cream}90`,
          margin: 0,
          lineHeight: 1.5,
          fontWeight: 300,
          opacity: closeOpacity,
        }}
      >
        These are not hypothetical. In a dataset of{" "}
        <span style={{ color: COLORS.cream, fontWeight: 600 }}>506 invoices</span> modelled on private
        clinic billing data, the prototype detected{" "}
        <span style={{ color: "#E0594A", fontWeight: 600 }}>70 alerts across 8 error types.</span>
      </p>
    </AbsoluteFill>
  );
};
