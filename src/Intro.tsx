import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./theme";
import { IntroProps } from "./content";
import { Background } from "./components/Background";
import { TopLogo } from "./components/TopLogo";
import { SpeedLines, SpeedSwipe } from "./components/Racing";
import { HeroScene } from "./scenes/HeroScene";
import { TitleScene } from "./scenes/TitleScene";
import { CierreScene } from "./scenes/CierreScene";

// Guion (30 fps, 216 frames = 7.2 s):
//   0.0-2.4s  Reveal del logo
//   2.2-5.0s  Texto grande (tutorial / fundas para asientos)
//   4.8-7.2s  Cierre de marca (web + usuario)
const HERO = { from: 0, dur: 72 };
const TITLE = { from: 66, dur: 84 };
const CIERRE = { from: 144, dur: 72 };

export const Intro: React.FC<IntroProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Background />
      <SpeedLines start={2} end={24} />

      <Sequence from={HERO.from} durationInFrames={HERO.dur}>
        <HeroScene duration={HERO.dur} />
      </Sequence>
      <Sequence from={TITLE.from} durationInFrames={TITLE.dur}>
        <TitleScene duration={TITLE.dur} line1={props.titleLine1} line2={props.titleLine2} />
      </Sequence>
      <Sequence from={CIERRE.from} durationInFrames={CIERRE.dur}>
        <CierreScene website={props.website} handle={props.handle} />
      </Sequence>

      {/* rafaga roja de transicion hacia el cierre */}
      <SpeedSwipe start={136} end={166} />

      <TopLogo appearAt={56} />
    </AbsoluteFill>
  );
};
