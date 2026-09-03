import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "./theme";
import { OutroProps } from "./content";
import { Background } from "./components/Background";
import { TopLogo } from "./components/TopLogo";
import { SpeedLines } from "./components/Racing";
import { OutroScene } from "./scenes/OutroScene";
import { lerp, useScale } from "./util";

// Web al pie, presente sobre el final.
const Footer: React.FC<{ website: string; appearAt: number }> = ({ website, appearAt }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const p = lerp(frame, [appearAt, appearAt + 16], [0, 1], Easing.out(Easing.cubic));
  return (
    <div
      style={{
        position: "absolute",
        bottom: 74 * s,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14 * s,
        opacity: p,
        transform: `translateY(${(1 - p) * 16 * s}px)`,
      }}
    >
      <span style={{ width: 9 * s, height: 9 * s, borderRadius: 999, background: COLORS.red }} />
      <span
        style={{
          fontFamily: FONT.body,
          fontWeight: 700,
          fontSize: 30 * s,
          letterSpacing: 1 * s,
          color: COLORS.text,
        }}
      >
        {website}
      </span>
      <span style={{ width: 9 * s, height: 9 * s, borderRadius: 999, background: COLORS.red }} />
    </div>
  );
};

// Outro (~5.5 s) para cerrar Shorts con llamado a la accion.
export const Outro: React.FC<OutroProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Background />
      <SpeedLines start={2} end={24} />
      <TopLogo appearAt={4} />
      <OutroScene
        eyebrow={props.eyebrow}
        ctaLine1={props.ctaLine1}
        ctaLine2={props.ctaLine2}
        handle={props.handle}
        platforms={props.platforms}
      />
      <Footer website={props.website} appearAt={40} />
    </AbsoluteFill>
  );
};
