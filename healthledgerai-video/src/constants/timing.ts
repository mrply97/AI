export const FPS = 30;

export const SPRING_SMOOTH = { damping: 200 };
export const SPRING_BOUNCY = { damping: 8, mass: 0.5 };
export const SPRING_SNAPPY = { damping: 15, mass: 0.3 };

// Scene durations in seconds — longer for readability
export const SCENE_DURATIONS = {
  cover: 8,
  problem: 12,
  solution: 12,
  demoNumbers: 10,
  demoAlerts: 12,
  whyIVF: 10,
  research: 14,
  about: 8,
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
