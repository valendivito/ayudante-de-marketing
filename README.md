# MDRACING · Intro tutorial de instalación de fundas

Intro animado de **8 segundos** hecho con [Remotion](https://remotion.dev) para
usar como cortina de apertura del tutorial de instalación de fundas MDRACING.

Identidad de marca: **rojo `#d10000` / blanco / negro**, tipografías Barlow
Condensed + Barlow, isologo "MD" rojo metalizado + "Racing" script cromado,
fondo claro con grilla sutil y barra roja tipo marquee (igual que la web y los
carruseles de redes).

## Videos renderizados

Ya exportados en [`renders/`](./renders):

| Archivo | Formato | Uso |
| --- | --- | --- |
| `mdracing-intro-vertical.mp4` | 1080×1920 (9:16) | Reels · TikTok · YouTube Shorts |
| `mdracing-intro-horizontal.mp4` | 1920×1080 (16:9) | Intro del tutorial en YouTube |

Ambos: H.264, 30 fps, 8 s.

## Guion (8 s)

1. **0.0–2.6s** — Reveal del isologo MDRACING + etiqueta "Tutorial de instalación".
2. **2.4–5.4s** — Título: *Instalá tus fundas* · **PASO A PASO** · "Cortadas para tu auto".
3. **5.2–7.4s** — Sellos de confianza: *Corte a medida · Fábrica directa · 25 años de oficio*.
4. **7.0–8.0s** — Cierre: *Dale, arrancamos* + `@mdracingfundas`.

Barra roja superior con marquee y `mdracingfundas.com` al pie durante todo el video.

## Requisitos

- Node.js 18+
- El render usa un navegador headless. En este entorno se apunta al Chromium ya
  instalado con la variable de entorno:

  ```bash
  export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
  ```

  En una máquina propia podés omitirla y Remotion descarga su propio Chrome.

## Uso

```bash
npm install

# Previsualizar y editar en vivo (Remotion Studio)
npm start

# Renderizar
npm run render:vertical     # -> out/mdracing-intro-vertical.mp4
npm run render:horizontal   # -> out/mdracing-intro-horizontal.mp4
npm run render:all
```

## Estructura

```
src/
  index.ts              registerRoot
  Root.tsx              compositions IntroVertical / IntroHorizontal
  Intro.tsx             guion (capas persistentes + secuencias)
  theme.ts              colores y tipografías de marca
  fonts.ts              carga local de fuentes (public/fonts)
  util.ts               helpers de escala e interpolación
  components/           Background, TopMarquee, BrandFrame, Logo, Racing, UI
  scenes/               HeroScene, TitleScene, PillsScene, CtaScene
public/fonts/           Barlow Condensed, Barlow, Great Vibes (.ttf)
```

## Personalización rápida

- **Textos / colores**: `src/theme.ts` y cada escena en `src/scenes/`.
- **Duración**: `DURATION` en `src/Root.tsx` (frames a 30 fps).
- **Logo real**: dejá el PNG en `public/` y reemplazá `LogoLockup`
  (`src/components/Logo.tsx`) por un `<Img src={staticFile("logo.png")} />`.
  El logo actual es una recreación tipográfica, no el asset oficial.

---

Hecho con Remotion. La skill oficial de Remotion quedó instalada en `.agents/skills`
(`npx skills add remotion-dev/skills`) para futuras ediciones.
