export const FPS = 30;

export const SPRING_SMOOTH = { damping: 200 };
export const SPRING_BOUNCY = { damping: 8, mass: 0.5 };
export const SPRING_SNAPPY = { damping: 15, mass: 0.3 };

// Scene durations in seconds — mirrors the 7-section detailed PDF.
// Dense slides get long durations so each staggered point is readable.
export const SCENE_DURATIONS = {
  cover: 8,
  problem: 18,
  solution: 15,
  demo: 19,
  relevance: 18,
  asking: 17,
  about: 10,
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
