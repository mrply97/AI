import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";

// Load fonts at module scope (import has side effects).
import "./constants/fonts";

import { SCENE_DURATIONS } from "./constants/timing";
import { CoverScene } from "./components/scenes/CoverScene";
import { ProblemScene } from "./components/scenes/ProblemScene";
import { SolutionScene } from "./components/scenes/SolutionScene";
import { DemoResultsScene } from "./components/scenes/DemoResultsScene";
import { RelevanceScene } from "./components/scenes/RelevanceScene";
import { AskingScene } from "./components/scenes/AskingScene";
import { AboutScene } from "./components/scenes/AboutScene";

const scenes = [
  { component: CoverScene, duration: SCENE_DURATIONS.cover },
  { component: ProblemScene, duration: SCENE_DURATIONS.problem },
  { component: SolutionScene, duration: SCENE_DURATIONS.solution },
  { component: DemoResultsScene, duration: SCENE_DURATIONS.demo },
  { component: RelevanceScene, duration: SCENE_DURATIONS.relevance },
  { component: AskingScene, duration: SCENE_DURATIONS.asking },
  { component: AboutScene, duration: SCENE_DURATIONS.about },
];

export const HealthLedgerVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  let cumulativeFrames = 0;
  return (
    <AbsoluteFill>
      {scenes.map(({ component: Scene, duration }, i) => {
        const from = cumulativeFrames;
        const durationInFrames = duration * fps;
        cumulativeFrames += durationInFrames;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={durationInFrames}
            premountFor={fps}
          >
            <Scene />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
