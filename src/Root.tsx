import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { Intro } from "./Intro";
import { Outro } from "./Outro";
import { introSchema, defaultContent, outroSchema, defaultOutro } from "./content";

const FPS = 30;
const INTRO_DURATION = 216; // 7.2 s
const OUTRO_DURATION = 165; // 5.5 s

// Formatos: Vertical 1080x1920 (Reels/TikTok/Shorts) y Horizontal 1920x1080
// (YouTube). Los textos se editan en la barra lateral de Remotion Studio
// (gracias al `schema`) o a mano en src/content.ts.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IntroVertical"
        component={Intro}
        durationInFrames={INTRO_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        schema={introSchema}
        defaultProps={defaultContent}
      />
      <Composition
        id="IntroHorizontal"
        component={Intro}
        durationInFrames={INTRO_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        schema={introSchema}
        defaultProps={defaultContent}
      />
      <Composition
        id="OutroVertical"
        component={Outro}
        durationInFrames={OUTRO_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        schema={outroSchema}
        defaultProps={defaultOutro}
      />
      <Composition
        id="OutroHorizontal"
        component={Outro}
        durationInFrames={OUTRO_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        schema={outroSchema}
        defaultProps={defaultOutro}
      />
    </>
  );
};
