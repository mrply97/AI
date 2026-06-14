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
import { SPRING_SNAPPY } from "../../constants/timing";
import { ShaderBG } from "../shared/ShaderBG";
import { SlideHeader } from "../shared/SlideHeader";
import { LiquidGlassCard } from "../shared/LiquidGlassCard";
import { GrainOverlay } from "../shared/GrainOverlay";

const questions = [
  "Do the billing errors this prototype detects reflect real problems you encounter in your billing process?",
  "Are there error types I have missed that are common in fertility-clinic billing in Greece?",
  "Would a tool like this — even at prototype stage — be useful to your billing or administration team?",
  "Would you provide a short written statement that you reviewed this prototype as part of a research validation? (Voluntary, for my doctoral record only.)",
];

export const AskingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introSpring = spring({ frame, fps, delay: 26, config: { damping: 200 } });
  const introOpacity = interpolate(introSpring, [0, 1], [0, 1]);

  const ndaSpring = spring({ frame, fps, delay: 38, config: { damping: 200 } });
  const ndaOpacity = interpolate(ndaSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        padding: "64px 100px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ShaderBG color1="#A08558" color2="#1E1A14" color3="#4A6B5A" intensity={0.55} speed={0.5} />
      <GrainOverlay opacity={0.04} />

      <SlideHeader
        label="What I Am Asking For"
        labelColor={COLORS.goldLt}
        dark
        titleSize={56}
        marginBottom={20}
        title={
          <>
            20 minutes and your{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLt})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
              }}
            >
              honest opinion
            </span>
          </>
        }
      />

      {/* Intro */}
      <p
        style={{
          fontFamily: FONTS.sans,
          fontSize: 20,
          color: `${COLORS.cream}C0`,
          margin: "0 0 16px",
          lineHeight: 1.6,
          maxWidth: 1150,
          fontWeight: 300,
          opacity: introOpacity,
        }}
      >
        I am a doctoral researcher, not a salesperson. HealthLedgerAI is a research prototype I am
        developing as part of my PhD on billing compliance in private healthcare. I am here to learn
        from practitioners — not to sell a product.
      </p>

      {/* NDA note */}
      <div
        style={{
          opacity: ndaOpacity,
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <span style={{ fontSize: 18 }}>🔒</span>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 16,
            color: COLORS.goldLt,
            margin: 0,
            lineHeight: 1.5,
            fontWeight: 300,
          }}
        >
          A Non-Disclosure Agreement is signed before this material is shown — everything shared in
          both directions stays protected within it.
        </p>
      </div>

      {/* Questions — 2×2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {questions.map((q, i) => {
          const sp = spring({ frame, fps, delay: 50 + i * 16, config: SPRING_SNAPPY });
          const y = interpolate(sp, [0, 1], [36, 0]);
          const opacity = interpolate(sp, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ transform: `translateY(${y}px)`, opacity }}>
              <LiquidGlassCard dark accentColor={COLORS.gold} style={{ padding: "24px 28px", height: "100%" }}>
                <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontFamily: FONTS.serif,
                      fontSize: 40,
                      fontWeight: 700,
                      color: COLORS.gold,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <p
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 18,
                      color: COLORS.cream,
                      margin: 0,
                      lineHeight: 1.5,
                      fontWeight: 300,
                    }}
                  >
                    {q}
                  </p>
                </div>
              </LiquidGlassCard>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
