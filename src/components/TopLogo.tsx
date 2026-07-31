import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Logo } from "./Logo";
import { lerp, useScale } from "../util";

// Logo chico arriba, presente desde que termina el reveal del hero.
export const TopLogo: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const p = lerp(frame, [appearAt, appearAt + 16], [0, 1], Easing.out(Easing.cubic));

  return (
    <div
      style={{
        position: "absolute",
        top: 96 * s,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * -18 * s}px)`,
      }}
    >
      <Logo height={82 * s} />
    </div>
  );
};
