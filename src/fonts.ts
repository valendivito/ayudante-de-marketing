import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Cargamos las tipografias localmente (public/fonts) para que el render sea
// determinista y no dependa de la red del navegador headless.

type FaceSpec = {
  family: string;
  file: string;
  weight: string;
  style?: string;
};

const FACES: FaceSpec[] = [
  { family: "Barlow Condensed", file: "BarlowCondensed-SemiBold.ttf", weight: "600" },
  { family: "Barlow Condensed", file: "BarlowCondensed-Bold.ttf", weight: "700" },
  { family: "Barlow Condensed", file: "BarlowCondensed-ExtraBold.ttf", weight: "800" },
  { family: "Barlow Condensed", file: "BarlowCondensed-Black.ttf", weight: "900" },
  { family: "Barlow", file: "Barlow-Regular.ttf", weight: "400" },
  { family: "Barlow", file: "Barlow-Medium.ttf", weight: "500" },
  { family: "Barlow", file: "Barlow-SemiBold.ttf", weight: "600" },
  { family: "Barlow", file: "Barlow-Bold.ttf", weight: "700" },
  { family: "Great Vibes", file: "GreatVibes-Regular.ttf", weight: "400" },
];

if (typeof document !== "undefined" && typeof FontFace !== "undefined") {
  const handle = delayRender("Cargando tipografias MDRACING");
  Promise.all(
    FACES.map(async (spec) => {
      const face = new FontFace(spec.family, `url(${staticFile(`fonts/${spec.file}`)})`, {
        weight: spec.weight,
        style: spec.style ?? "normal",
      });
      await face.load();
      (document.fonts as FontFaceSet).add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
}
