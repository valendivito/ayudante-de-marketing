import React from "react";
import { useCurrentFrame } from "remotion";
import { Easing } from "remotion";
import { COLORS, FONT } from "../theme";
import { Logo } from "./Logo";
import { lerp, useScale } from "../util";

// Marco de marca persistente: logo chico arriba y la web abajo. Aparece
// una vez que el logo hero termina su presentacion.
export const BrandFrame: React.FC<{ appearAt: number; website: string }> = ({ appearAt, website }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const p = lerp(frame, [appearAt, appearAt + 16], [0, 1], Easing.out(Easing.cubic));

  return (
    <>
      {/* logo chico bajo la barra roja */}
      <div
        style={{
          position: "absolute",
          top: 100 * s,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: p,
          transform: `translateY(${(1 - p) * -18 * s}px)`,
        }}
      >
        <Logo height={78 * s} />
      </div>

      {/* web al pie */}
      <div
        style={{
          position: "absolute",
          bottom: 70 * s,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14 * s,
          opacity: p,
          transform: `translateY(${(1 - p) * 18 * s}px)`,
        }}
      >
        <span style={{ width: 9 * s, height: 9 * s, borderRadius: 999, background: COLORS.red }} />
        <span
          style={{
            fontFamily: FONT.body,
            fontWeight: 700,
            fontSize: 30 * s,
            letterSpacing: 1 * s,
            color: COLORS.ink,
          }}
        >
          {website}
        </span>
        <span style={{ width: 9 * s, height: 9 * s, borderRadius: 999, background: COLORS.red }} />
      </div>
    </>
  );
};
