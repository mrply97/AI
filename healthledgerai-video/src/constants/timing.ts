export const FPS = 30;

export const SPRING_SMOOTH = { damping: 200 };
export const SPRING_BOUNCY = { damping: 8, mass: 0.5 };
export const SPRING_SNAPPY = { damping: 15, mass: 0.3 };

// Scene durations in seconds
export const SCENE_DURATIONS = {
  cover: 5,
  problem: 7,
  solution: 7,
  demo: 7,
  whyEmbryo: 6,
  research: 8,
  ask: 6,
  about: 6,
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
