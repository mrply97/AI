import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

interface DetailBulletProps {
  term: string;
  description: string;
  delay: number;
  accentColor?: string;
  dark?: boolean;
}

// Arrow-style bullet matching the PDF: bold term — description, with a divider.
export const DetailBullet: React.FC<DetailBulletProps> = ({
  term,
  description,
  delay,
  accentColor = COLORS.gold,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame, fps, delay, config: { damping: 18, mass: 0.4 } });
  const x = interpolate(sp, [0, 1], [-50, 0]);
  const opacity = interpolate(sp, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity,
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        paddingBottom: 20,
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "rgba(30,26,20,0.10)"}`,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.sans,
          fontSize: 28,
          color: accentColor,
          lineHeight: 1,
          marginTop: 4,
          flexShrink: 0,
        }}
      >
        →
      </span>
      <p
        style={{
          fontFamily: FONTS.sans,
          fontSize: 22,
          color: dark ? `${COLORS.cream}D0` : COLORS.inkSoft,
          margin: 0,
          lineHeight: 1.5,
          fontWeight: 300,
        }}
      >
        <span
          style={{
            fontWeight: 600,
            color: dark ? COLORS.cream : COLORS.ink,
          }}
        >
          {term}
        </span>
        {"  —  "}
        {description}
      </p>
    </div>
  );
};
