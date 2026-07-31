import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { Intro } from "./Intro";

const FPS = 30;
const DURATION = 240; // 8 segundos

// Dos formatos listos para publicar:
//  - Vertical 1080x1920 -> Reels / TikTok / Shorts
//  - Horizontal 1920x1080 -> intro del tutorial en YouTube
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IntroVertical"
        component={Intro}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="IntroHorizontal"
        component={Intro}
        durationInFrames={DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
