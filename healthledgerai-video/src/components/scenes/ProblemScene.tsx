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
import { ShaderBGLight } from "../shared/ShaderBG";
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
        background: `linear-gradient(160deg, ${COLORS.cream} 0%, ${COLORS.ivory} 100%)`,
        padding: "72px 110px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ShaderBGLight opacity={0.12} />
      <GrainOverlay opacity={0.035} />

      <SlideHeader
        label="The Problem"
        labelColor="#C0392B"
        titleSize={54}
        marginBottom={24}
        title={
          <>
            Private clinics lose money on billing
            <br />
            errors <span style={{ color: "#C0392B", fontWeight: 600 }}>they cannot see</span>
          </>
        }
      />

      {/* Intro */}
      <p
        style={{
          fontFamily: FONTS.sans,
          fontSize: 21,
          color: COLORS.inkSoft,
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
            accentColor="#C0392B"
          />
        ))}
      </div>

      {/* Closing emphasis */}
      <p
        style={{
          fontFamily: FONTS.sans,
          fontSize: 19,
          color: COLORS.inkMute,
          margin: 0,
          lineHeight: 1.5,
          fontWeight: 300,
          opacity: closeOpacity,
        }}
      >
        These are not hypothetical. In a dataset of{" "}
        <span style={{ color: COLORS.ink, fontWeight: 600 }}>506 invoices</span> modelled on private
        clinic billing data, the prototype detected{" "}
        <span style={{ color: "#C0392B", fontWeight: 600 }}>70 alerts across 8 error types.</span>
      </p>
    </AbsoluteFill>
  );
};
