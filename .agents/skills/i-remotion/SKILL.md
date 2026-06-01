---
name: i-remotion
description: "Comprehensive Remotion video production skill for creating, organizing, and rendering promo video libraries at scale. Use when building Remotion compositions, designing multi-scene animated videos, creating reusable component systems, registering compositions in Root.tsx, batch rendering videos, or working on any Remotion project. Covers: (1) Project structure and composition registration, (2) Scene-based video architecture with spring animations, (3) Shared component libraries, (4) Responsive vertical/landscape dual-format videos, (5) Batch rendering workflows, (6) TitleScreen and branding patterns, (7) Constants-driven data for video content. Triggers on any Remotion, promo video, or animated marketing content task. Builds on remotion-best-practices with production-tested patterns."
---

# i-remotion

Production-tested patterns for building Remotion video libraries at scale. Use alongside `/remotion-best-practices` for API-level details.

## Core Architecture

### Project Structure

```
promo-videos/src/
  index.ts                    # registerRoot(RemotionRoot)
  Root.tsx                    # Composition registry
  constants/
    timing.ts                 # FPS, spring configs
    colors.ts                 # Color palette
    [domain].ts               # Content data arrays
  components/
    shared/                   # Reusable primitives (15-20 components)
    [category]/               # Video components grouped by theme
```

### Composition Registration (Root.tsx)

Use a data-driven array to avoid repetition:

```tsx
const VIDEOS = [
  ["comp-id", ComponentRef, durationSeconds],
] as const;

<Folder name="Category">
  <Folder name="Vertical">
    {VIDEOS.map(([id, Comp, dur]) => (
      <Composition key={`${id}-v`} id={`${id}-vertical`}
        component={Comp} durationInFrames={dur * FPS}
        fps={FPS} width={1080} height={1920} />
    ))}
  </Folder>
  <Folder name="Landscape">
    {VIDEOS.map(([id, Comp, dur]) => (
      <Composition key={`${id}-l`} id={`${id}-landscape`}
        component={Comp} durationInFrames={dur * FPS}
        fps={FPS} width={1920} height={1080} />
    ))}
  </Folder>
</Folder>
```

### Video Component Pattern

See [references/video-pattern.md](references/video-pattern.md) for complete template.

Key rules:
1. Module-scope font loading (loadLobster, loadRoboto) OUTSIDE component
2. Scene components as inner React.FC with frame-range comments
3. `isVertical = height > width` for responsive layout
4. Named export matching filename
5. Background + Sequence per scene with `premountFor={fps}`
6. Springs from timing.ts, colors from colors.ts

## Animation System

See [references/animations.md](references/animations.md) for all patterns with code.

Spring configs: `SPRING_SMOOTH` (damping:200), `SPRING_BOUNCY` (damping:8, mass:0.5), `SPRING_SNAPPY` (damping:15, mass:0.3).

## Scene Design Rules

1. No dead time - every frame has motion or reveals
2. 5-6 scenes per 15-20s video with fast cuts
3. 1s title + content scenes + CTA - always start/end with branding
4. `premountFor={fps}` on every Sequence
5. SPRING_BOUNCY for element entrances
6. Stagger list items by 6-10 frames
7. TypewriterText at 30-40 chars/sec

## Batch Rendering

**CRITICAL: Always render when the plan says to. Components are NOT the deliverable - .mp4 files ARE.**

See [references/rendering.md](references/rendering.md) for batch scripts.

```bash
bunx remotion render <composition-id> <output-path>
```

## Team Parallelization

For 10+ videos, parallelize by category:
1. Create foundation (constants + shared components) first
2. Spawn agents per category (3-8 videos each)
3. Each agent reads reference video + constants, builds assigned videos
4. Lead updates Root.tsx after all complete
5. Lead renders all compositions to .mp4
