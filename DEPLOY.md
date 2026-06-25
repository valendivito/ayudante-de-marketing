# Deploy gratis, sin tarjeta (Render + Supabase)

Esta guía deja el dashboard accesible desde cualquier PC, con HTTPS y pidiendo
una contraseña para entrar, usando dos servicios gratuitos que **no piden
tarjeta de crédito en ningún paso**:

- **Render**: corre la app (Docker, con ffmpeg/yt-dlp incluidos). Gratis, pero
  si nadie la usa 15 minutos se "duerme" y tarda ~1 minuto en responder la
  próxima vez que entrás.
- **Supabase**: guarda los datos (la base con los videos y sus análisis), para
  que no se pierdan cada vez que Render reinicia el contenedor. Si pasás una
  semana entera sin usar el dashboard, Supabase pausa el proyecto solo; no se
  pierde nada, pero hay que entrar a reactivarlo con un clic.

## 1. Crear la base de datos en Supabase

1. Entrá a [supabase.com](https://supabase.com) → **Start your project** →
   registrate con GitHub, Google o email (no pide tarjeta).
2. **New project**: elegí un nombre, una **contraseña para la base** (anotala,
   la vas a necesitar en el paso 3) y una región (cualquiera cercana). Dale
   **Create new project** y esperá 1-2 minutos a que termine de levantar.
3. Una vez listo, en el menú izquierdo: **Project Settings** (el ícono de
   tuerca) → **Database**.
4. Buscá **Connection string** → pestaña **Session pooler** → copiá la URI
   completa. Se ve así:
   ```
   postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-xxxx.pooler.supabase.com:5432/postgres
   ```
5. Reemplazá `[YOUR-PASSWORD]` por la contraseña que pusiste en el paso 2.
   Guardá este string completo, lo vas a pegar en Render en el paso siguiente.

> Usamos específicamente "Session pooler" (no "Direct connection") porque
> Render no siempre soporta IPv6, y el pooler funciona también por IPv4.

## 2. Subir el código a GitHub

Si todavía no lo hiciste, el código de este proyecto tiene que estar en un
repo de GitHub (puede ser privado). Render se conecta directo a GitHub.

## 3. Crear el servicio en Render

1. Entrá a [render.com](https://render.com) → **Get Started** → registrate
   con GitHub (así te deja elegir el repo directo, no pide tarjeta).
2. **New** → **Web Service**.
3. Conectá tu cuenta de GitHub si no lo hiciste y elegí el repo
   `ayudante-de-marketing`.
4. Render va a detectar el `Dockerfile` solo. Completá:
   - **Name**: el que quieras (define la URL: `https://<name>.onrender.com`).
   - **Instance Type**: **Free**.
5. Bajá hasta **Environment Variables** y agregá:
   - `ANTHROPIC_API_KEY`: tu key de [console.anthropic.com](https://console.anthropic.com).
   - `DATABASE_URL`: el string que copiaste de Supabase en el paso 1.
   - `DASHBOARD_PASSWORD`: una contraseña que vos elijas. Sin esto, cualquiera
     en internet que encuentre tu URL puede usar el dashboard y gastar tu
     cuota de Anthropic.
   - Opcional: `GROQ_API_KEY` u `OPENAI_API_KEY` para transcripción de videos
     sin subtítulos.
6. **Create Web Service**. Render hace el build de la imagen Docker (tarda
   unos 5 minutos la primera vez) y la deja corriendo.

## 4. Usar el dashboard

Cuando termine el deploy, Render te muestra la URL arriba de todo, algo como
`https://ayudante-de-marketing.onrender.com`. Entrá ahí desde cualquier PC: el
navegador te va a pedir usuario (cualquiera) y contraseña (la que pusiste en
`DASHBOARD_PASSWORD`).

Si no la usás en 15 minutos y volvés a entrar, la primera carga tarda ~1
minuto (Render la está "despertando"). Es normal.

## Mantenimiento

- **Actualizar el código**: cada vez que hagas `git push` a la rama conectada,
  Render vuelve a buildear y desplegar solo.
- **Ver logs**: en la página del servicio en Render, pestaña **Logs**.
- **Si pasás una semana sin usar el dashboard**: Supabase pausa el proyecto.
  Entrá a [supabase.com](https://supabase.com/dashboard), abrí el proyecto y
  apretá **Restore project** (tarda ~1 minuto). Los datos quedan intactos.
