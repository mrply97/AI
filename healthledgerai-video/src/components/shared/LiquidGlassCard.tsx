import React from "react";
import { COLORS } from "../../constants/colors";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  dark?: boolean;
  accentColor?: string;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  dark = false,
  accentColor,
}) => {
  const base = dark
    ? {
        background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: `
          0 8px 40px rgba(0,0,0,0.35),
          inset 0 1px 0 rgba(255,255,255,0.15),
          inset 0 -1px 0 rgba(0,0,0,0.2)
          ${accentColor ? `, 0 0 0 1px ${accentColor}30` : ""}
        `,
      }
    : {
        background: "linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.45) 100%)",
        border: "1px solid rgba(255,255,255,0.60)",
        boxShadow: `
          0 8px 40px rgba(30,26,20,0.10),
          inset 0 1px 0 rgba(255,255,255,0.85),
          inset 0 -1px 0 rgba(30,26,20,0.06)
          ${accentColor ? `, 0 0 0 1.5px ${accentColor}50` : ""}
        `,
      };

  return (
    <div
      style={{
        borderRadius: 24,
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
        padding: "32px 36px",
        ...base,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Accent bar variant for numbered steps
export const LiquidGlassStep: React.FC<{
  number: string;
  text: string;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ number, text, dark = false, style }) => (
  <LiquidGlassCard dark={dark} accentColor={COLORS.gold} style={{ ...style, padding: "24px 32px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <span
        style={{
          fontFamily: "serif",
          fontSize: 44,
          fontWeight: 700,
          color: COLORS.gold,
          lineHeight: 1,
          minWidth: 56,
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily: "sans-serif",
          fontSize: 22,
          color: dark ? COLORS.cream : COLORS.ink,
          lineHeight: 1.4,
          fontWeight: 400,
        }}
      >
        {text}
      </span>
    </div>
  </LiquidGlassCard>
);
