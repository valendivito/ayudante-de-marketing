# Ayudante de Marketing

Dashboard para analizar videos y generar contenido para redes sociales: guiones con
estructura viral (hook 0-2s, retención justificada, CTA final), captions, descripción
de publicación con hashtags, corrección de errores y un análisis completo de potencial
viral (transcripción, contexto visual y motivos concretos).

Mandás un video (por URL o subiendo el archivo) y la app lo procesa en background:
descarga (si es URL), extracción de frames, transcripción y análisis con Claude.

## Requisitos del sistema

- Node.js 22+
- [`ffmpeg`/`ffprobe`](https://ffmpeg.org/) en el `PATH`
- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) en el `PATH` (solo necesario para videos por URL)

## Setup

```bash
npm install
cp .env.example .env
```

Completá `.env`:

- `ANTHROPIC_API_KEY` (requerida): se usa para el análisis del video con Claude.
- `ANTHROPIC_MODEL` (opcional): default `claude-sonnet-4-6`.
- `GROQ_API_KEY` / `OPENAI_API_KEY` (opcionales): transcripción por Whisper para
  videos sin subtítulos (por ejemplo, archivos subidos). Si no configurás ninguna,
  el análisis sigue funcionando pero sin transcripción.
- `DATABASE_PATH`, `WORK_DIR`, `UPLOAD_DIR` (opcionales): por default cuelgan de
  `./storage`.

## Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). Desde ahí podés mandar una URL
de video o subir un archivo, y vas a ver el estado actualizarse en vivo (en cola →
descargando → extrayendo frames → transcribiendo → analizando → completado/error).
Al entrar al detalle de un video completado vas a ver el análisis completo: gancho
inicial, retención, errores a corregir, guion sugerido, captions, contexto visual,
descripción y transcripción.

## Otros comandos

```bash
npm run build   # build de producción
npm run start   # levanta el build de producción
npm run lint     # eslint
```

## Almacenamiento

`storage/` (gitignored) guarda la base SQLite, los archivos subidos y los frames
extraídos durante el procesamiento de cada video (se limpian al terminar).
