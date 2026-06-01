# Animation Patterns

## Spring Configs

```ts
// constants/timing.ts
export const FPS = 30;
export const SPRING_SMOOTH = { damping: 200 };          // Slow, smooth transitions
export const SPRING_BOUNCY = { damping: 8, mass: 0.5 }; // Bouncy entrance
export const SPRING_SNAPPY = { damping: 15, mass: 0.3 }; // Quick, snappy
export const SCENE_FADE = 0.5;
```

## Entrance Animations

```tsx
// Scale entrance
const entrance = spring({ frame, fps, delay: 10, config: SPRING_BOUNCY });
const scale = interpolate(entrance, [0, 1], [0.3, 1]);
const opacity = interpolate(entrance, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

// Slide from side
const slideEntrance = spring({ frame, fps, delay: 5, config: SPRING_SNAPPY });
const slideX = interpolate(slideEntrance, [0, 1], [-300, 0]);

// Fade in with translateY
const fadeEntrance = spring({ frame, fps, delay: 12, config: { damping: 200 } });
const y = interpolate(fadeEntrance, [0, 1], [40, 0]);
const fadeOpacity = interpolate(fadeEntrance, [0, 1], [0, 1]);
```

## Staggered List Animations

```tsx
items.map((item, i) => {
  const entrance = spring({
    frame, fps,
    delay: i * 8,  // 8 frames between each item
    config: SPRING_SNAPPY,
  });

  // Alternating slide direction
  const slideX = interpolate(
    entrance, [0, 1],
    [i % 2 === 0 ? -300 : 300, 0]
  );
  const opacity = interpolate(entrance, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ transform: `translateX(${slideX}px)`, opacity }}>
      {item.label}
    </div>
  );
});
```

## Pulsing / Glow Effects

```tsx
const phase = (frame / fps) * Math.PI * 2;

// Pulsing glow on box
const glowIntensity = 10 + Math.sin(phase) * 8;
style={{ boxShadow: `0 0 ${glowIntensity}px ${color}` }}

// Pulsing scale
const pulseScale = 1 + Math.sin(phase * 1.5) * 0.03;
style={{ transform: `scale(${pulseScale})` }}

// Blinking cursor (for typewriter)
const cursorOpacity = Math.sin(phase * 2) > 0 ? 1 : 0;
```

## Battle / Action Animations

```tsx
// Screen shake
const shakeIntensity = interpolate(frame, [startFrame, startFrame + 10], [1, 0], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});
const shakeX = Math.sin(frame * 0.8) * 4 * shakeIntensity;
const shakeY = Math.cos(frame * 1.1) * 3 * shakeIntensity;

// Attack lunge
const lungeProgress = spring({ frame, fps, delay: attackFrame, config: SPRING_SNAPPY });
const lungeX = interpolate(lungeProgress, [0, 0.5, 1], [0, 80, 0]);

// Knockback
const knockback = spring({ frame, fps, delay: hitFrame, config: SPRING_BOUNCY });
const knockX = interpolate(knockback, [0, 1], [-40, 0]);

// Damage number float-up
const dmgProgress = spring({ frame, fps, delay: hitFrame, config: SPRING_BOUNCY });
const dmgY = interpolate(dmgProgress, [0, 1], [0, -60]);
const dmgOpacity = interpolate(dmgProgress, [0, 0.8, 1], [0, 1, 0]);

// Death spin
const spinProgress = spring({ frame, fps, delay: koFrame, config: SPRING_SMOOTH });
const rotation = interpolate(spinProgress, [0, 1], [0, 720]);
const deathScale = interpolate(spinProgress, [0, 1], [1, 0]);
```

## Idle / Ambient Animations

```tsx
// Bob (floating up/down)
const bob = Math.sin((frame / fps) * Math.PI * 2 * 3) * 2; // 3Hz, 2px
style={{ transform: `translateY(${bob}px)` }}

// Walking bob (faster, bigger)
const walkBob = Math.sin((frame / fps) * Math.PI * 2 * 12) * 3; // 12Hz, 3px

// Slow rotation
const rotation = (frame / fps) * 30; // 30 degrees per second

// Particle rise
const particleY = initialY - (frame * speed);
const particleX = initialX + Math.sin(frame * 0.05) * 20;
```

## Timing Helpers

```tsx
// Linear interpolation over frame range
const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// Check if element should be visible
const isVisible = frame >= showFrame;

// Calculate which item in a sequence is active
const activeIndex = Math.min(Math.floor(frame / fps), items.length - 1);
```

## Counter Animation

```tsx
// AnimatedCounter: tween from 0 to target
const progress = spring({ frame, fps, delay: startDelay, config: SPRING_SMOOTH });
const value = Math.round(interpolate(progress, [0, 1], [0, targetValue]));
```
