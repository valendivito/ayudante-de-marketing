# MDRACING · Intro + Outro para tutoriales

Piezas animadas hechas con [Remotion](https://remotion.dev) para los tutoriales
MDRACING: una **intro** (~7 s) que abre y un **outro** (~5,5 s) que cierra los
Shorts con un llamado a la acción.

Estética **negra cinematográfica**: fondo negro, el logo cromado con barrido de
brillo, texto grande y acentos en rojo de marca `#e10600`.

## Videos renderizados

En [`renders/`](./renders):

| Archivo | Formato | Uso |
| --- | --- | --- |
| `mdracing-intro-vertical.mp4` | 1080×1920 (9:16) | Intro · Reels · TikTok · Shorts |
| `mdracing-intro-horizontal.mp4` | 1920×1080 (16:9) | Intro del tutorial en YouTube |
| `mdracing-outro-vertical.mp4` | 1080×1920 (9:16) | Cierre de Shorts (CTA a redes) |
| `mdracing-outro-horizontal.mp4` | 1920×1080 (16:9) | Cierre de video en YouTube |

Todos: H.264, 30 fps.

## Guion

**Intro** (~7 s)
1. **Reveal del logo** MDRACING (cromado, con destello y brillo que barre el metal).
2. **Texto grande**: *TUTORIAL DE INSTALACIÓN* / **FUNDAS PARA ASIENTOS**.
3. **Cierre de marca**: `mdracingfundas.com` + `@mdracingfundas`.

**Outro** (~5,5 s) — reutilizable para cualquier tutorial
1. **CTA grande**: *SEGUINOS EN REDES* / **PARA MÁS TUTORIALES**.
2. Usuario `@mdracingfundas` + `Instagram · TikTok · YouTube` + la web.

Sin barra de texto, sin sellos, sin frases de relleno.

## Editar los textos (2 formas)

Todo vive en **[`src/content.ts`](./src/content.ts)**: `defaultContent` (intro) y
`defaultOutro` (outro).

**A mano:** cambiá el texto entre comillas y renderizá:

```bash
npm run render:all       # intro + outro, los 4 MP4
npm run render:intro     # solo intro
npm run render:outro     # solo outro
```

**Visual (Remotion Studio):**

```bash
npm start
```

Editás los campos en la barra lateral derecha y se ve en vivo (gracias al
`schema` de Zod en `src/Root.tsx`).

## Requisitos y uso

- Node.js 18+
- El render usa un navegador headless. En este entorno:

  ```bash
  export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
  ```

  En una máquina propia podés omitirlo (Remotion descarga su propio Chrome).

```bash
npm install
npm start                 # preview en vivo
npm run render:all        # exporta los 2 MP4 a out/
```

## Otras personalizaciones

- **Logo**: oficial, en `public/logo.png`. Para cambiarlo, reemplazá ese archivo
  (fondo transparente, misma proporción ~3.44:1).
- **Colores / tipografías**: `src/theme.ts`.
- **Duración y ritmo**: `DURATION` en `src/Root.tsx` y los tramos de cada escena
  en `src/Intro.tsx` (frames a 30 fps).

## Estructura

```
src/
  index.ts / Root.tsx     registro + compositions (vertical / horizontal)
  Intro.tsx               guion (fondo + 3 escenas)
  content.ts              TEXTOS editables + schema Zod
  theme.ts                colores y tipografías
  fonts.ts / util.ts      carga de fuentes local · helpers
  components/             Background, Logo (con brillo), TopLogo, Racing
  scenes/                 HeroScene, TitleScene, CierreScene
public/                   logo.png + fonts/
```

---

Hecho con Remotion. La skill oficial quedó instalada en `.agents/skills`
(`npx skills add remotion-dev/skills`).
