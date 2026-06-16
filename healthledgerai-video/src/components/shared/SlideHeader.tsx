import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

interface SlideHeaderProps {
  label: string;
  labelColor?: string;
  title: React.ReactNode;
  subtitle?: string;
  dark?: boolean;
  titleSize?: number;
  marginBottom?: number;
}

export const SlideHeader: React.FC<SlideHeaderProps> = ({
  label,
  labelColor = COLORS.gold,
  title,
  subtitle,
  dark = true,
  titleSize = 56,
  marginBottom = 36,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({ frame, fps, delay: 4, config: { damping: 200 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  const titleSpring = spring({ frame, fps, delay: 10, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [36, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subSpring = spring({ frame, fps, delay: 20, config: { damping: 200 } });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);

  return (
    <div style={{ marginBottom }}>
      <div style={{ opacity: labelOpacity, marginBottom: 14 }}>
        <span
          style={{
            fontFamily: FONTS.sans,
            fontSize: 13,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: labelColor,
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </div>

      <h2
        style={{
          fontFamily: FONTS.sans,
          fontSize: titleSize,
          fontWeight: 650,
          letterSpacing: "-0.015em",
          color: dark ? COLORS.cream : COLORS.ink,
          margin: 0,
          lineHeight: 1.04,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          style={{
            fontFamily: FONTS.serif,
            fontStyle: "italic",
            fontSize: 26,
            color: dark ? COLORS.inkMute : COLORS.inkSoft,
            margin: "12px 0 0",
            opacity: subOpacity,
            fontWeight: 400,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
