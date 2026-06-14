import React from "react";
import { Composition } from "remotion";
import { HealthLedgerVideo } from "./HealthLedgerVideo";
import { FPS, TOTAL_DURATION } from "./constants/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Landscape 1920×1080 */}
      <Composition
        id="healthledgerai-landscape"
        component={HealthLedgerVideo}
        durationInFrames={TOTAL_DURATION * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
