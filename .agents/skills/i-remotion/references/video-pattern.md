# Video Component Template

Complete template for a Remotion promo video component.

```tsx
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont as loadLobster } from "@remotion/google-fonts/Lobster";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
// Import shared components relative to file location
import { GradientBackground } from "../../shared/GradientBackground";
import { ParticleField } from "../../shared/ParticleField";
import { LogoReveal } from "../../shared/LogoReveal";
import { CTAButton } from "../../shared/CTAButton";
import { TitleScreen } from "../shared/TitleScreen";
import { COLORS } from "../../../constants/colors";
import { SPRING_BOUNCY, SPRING_SNAPPY, FPS } from "../../../constants/timing";

// Module-scope font loading - MUST be outside any component
const { fontFamily: lobster } = loadLobster();
const { fontFamily: roboto } = loadRoboto("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

// Scene 1: Title (0-1s, frames 0-30)
// Use TitleScreen component as first scene in every video

// Scene 2: Main Content (1-5s, frames 30-150)
const MainContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  const entrance = spring({
    frame,
    fps,
    config: SPRING_BOUNCY,
  });

  const scale = interpolate(entrance, [0, 1], [0.3, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: isVertical ? 40 : 60,
      }}
    >
      <div style={{ transform: `scale(${scale})` }}>
        {/* Content here */}
      </div>
    </AbsoluteFill>
  );
};

// Scene N: CTA (last 2s)
const CTAScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <LogoReveal size={56} />
      <CTAButton text="Call to Action" subtitle="play.elizapets.com" />
    </AbsoluteFill>
  );
};

// Main composition - named export matching filename
export const VideoName: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Background layer */}
      <GradientBackground colors={["#2E5E34", "#3A7D44", "#2E7D32"]} />
      <ParticleField count={20} color={COLORS.gold} speed={0.8} />

      {/* Scene 1: Title (1 second) */}
      <Sequence durationInFrames={1 * fps} premountFor={fps}>
        <TitleScreen
          title="Video Title"
          subtitle="Short description"
          accentColor={COLORS.gold}
        />
      </Sequence>

      {/* Scene 2: Main Content */}
      <Sequence from={1 * fps} durationInFrames={4 * fps} premountFor={fps}>
        <MainContent />
      </Sequence>

      {/* Scene N: CTA (last 2s) */}
      <Sequence from={13 * fps} durationInFrames={2 * fps} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
```

## Import Path Guide

Paths depend on nesting depth:

| Video Location | Shared Components | TitleScreen | Constants |
|---|---|---|---|
| `category/Video.tsx` | `../shared/X` | `./shared/TitleScreen` | `../../constants/X` |
| `category/sub/Video.tsx` | `../../shared/X` | `../shared/TitleScreen` | `../../../constants/X` |
| `category/sub/sub2/Video.tsx` | `../../../shared/X` | `../../shared/TitleScreen` | `../../../../constants/X` |

## Shared Components Available

- GradientBackground, ParticleField, MapBackground
- PetSprite, NeopetsPanel, LogoReveal, CTAButton
- TypewriterText, SpeechBubble, TerminalBlock
- AnimatedCounter, StatBar, HPBar, DamageNumber
- BookIcon, NeoTokenIcon
- TitleScreen (in showcase/shared/)

## Responsive Layout

```tsx
const isVertical = height > width;

// Common responsive values
const fontSize = isVertical ? 34 : 36;
const cols = isVertical ? 2 : 4;
const rows = isVertical ? 4 : 2;
const padding = isVertical ? 40 : 60;
const gap = isVertical ? 20 : 16;
const spriteSize = isVertical ? 140 : 120;
```
