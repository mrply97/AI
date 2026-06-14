import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";

// Module-scope font loading — MUST be outside any component
loadCormorant("normal", { weights: ["300", "400", "600", "700"], subsets: ["latin"] });
loadJost("normal", { weights: ["300", "400", "600", "700"], subsets: ["latin"] });

import { FPS, SCENE_DURATIONS } from "./constants/timing";
import { CoverScene } from "./components/scenes/CoverScene";
import { ProblemScene } from "./components/scenes/ProblemScene";
import { SolutionScene } from "./components/scenes/SolutionScene";
import { DemoNumbersScene } from "./components/scenes/DemoNumbersScene";
import { DemoResultsScene } from "./components/scenes/DemoResultsScene";
import { WhyEmbryolabScene } from "./components/scenes/WhyEmbryolabScene";
import { ResearchQuestionsScene } from "./components/scenes/ResearchQuestionsScene";
import { AboutScene } from "./components/scenes/AboutScene";

const scenes = [
  { component: CoverScene, duration: SCENE_DURATIONS.cover },
  { component: ProblemScene, duration: SCENE_DURATIONS.problem },
  { component: SolutionScene, duration: SCENE_DURATIONS.solution },
  { component: DemoNumbersScene, duration: SCENE_DURATIONS.demoNumbers },
  { component: DemoResultsScene, duration: SCENE_DURATIONS.demoAlerts },
  { component: WhyEmbryolabScene, duration: SCENE_DURATIONS.whyIVF },
  { component: ResearchQuestionsScene, duration: SCENE_DURATIONS.research },
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
