import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./theme";
import { Background } from "./components/Background";
import { TopMarquee } from "./components/TopMarquee";
import { BrandFrame } from "./components/BrandFrame";
import { SpeedLines, SpeedSwipe } from "./components/Racing";
import { HeroScene } from "./scenes/HeroScene";
import { TitleScene } from "./scenes/TitleScene";
import { PillsScene } from "./scenes/PillsScene";
import { CtaScene } from "./scenes/CtaScene";

// Guion (30 fps, 240 frames = 8 s):
//   0.0-2.6s  Isologo (hero)
//   2.4-5.4s  Titulo del tutorial
//   5.2-7.4s  Sellos de confianza
//   7.0-8.0s  Cierre + CTA
const HERO = { from: 0, dur: 78 };
const TITLE = { from: 72, dur: 90 };
const PILLS = { from: 156, dur: 66 };
const CTA = { from: 210, dur: 30 };

export const Intro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <Background />
      <SpeedLines start={2} end={24} />

      <Sequence from={HERO.from} durationInFrames={HERO.dur}>
        <HeroScene duration={HERO.dur} />
      </Sequence>
      <Sequence from={TITLE.from} durationInFrames={TITLE.dur}>
        <TitleScene duration={TITLE.dur} />
      </Sequence>
      <Sequence from={PILLS.from} durationInFrames={PILLS.dur}>
        <PillsScene duration={PILLS.dur} />
      </Sequence>
      <Sequence from={CTA.from} durationInFrames={CTA.dur}>
        <CtaScene />
      </Sequence>

      {/* rafaga roja de transicion hacia el cierre */}
      <SpeedSwipe start={200} end={230} />

      <BrandFrame appearAt={60} />
      <TopMarquee />
    </AbsoluteFill>
  );
};
