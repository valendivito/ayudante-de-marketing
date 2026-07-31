import { Config } from "@remotion/cli/config";

// Salida en H.264 / MP4, compatible con Instagram, TikTok y YouTube.
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);

// Usamos el Chromium ya instalado en el entorno (Playwright) para evitar
// descargar Chrome Headless Shell. Se puede sobreescribir con la variable
// de entorno REMOTION_BROWSER_EXECUTABLE.
const browserFromEnv = process.env.REMOTION_BROWSER_EXECUTABLE;
if (browserFromEnv) {
  Config.setBrowserExecutable(browserFromEnv);
}
