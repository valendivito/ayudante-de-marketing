# Deploy gratis y siempre encendido (Oracle Cloud Always Free)

Esta guía deja el dashboard corriendo 24/7 en una VM gratis para siempre (no es
trial), con HTTPS automático y pidiendo una contraseña para entrar — así podés
abrirlo desde cualquier PC con solo un navegador.

## 1. Crear la VM en Oracle Cloud

1. Creá una cuenta en [Oracle Cloud](https://www.oracle.com/cloud/free/) (pide
   tarjeta para verificar identidad, pero el tier "Always Free" no te cobra).
2. **Create a VM instance** con estas opciones:
   - **Image**: Ubuntu 24.04 (o la versión LTS más nueva disponible).
   - **Shape**: `VM.Standard.A1.Flex` (Ampere/ARM) — es la que da más recursos
     gratis. Asignale **2 OCPU / 12 GB RAM** (alcanza de sobra y queda dentro
     del límite gratuito de 4 OCPU / 24 GB total).
   - Dejá que te genere un par de claves SSH y **descargá la clave privada**
     (la vas a necesitar para conectarte).
3. Una vez creada, anotá la **IP pública** de la instancia.

## 2. Abrir los puertos 80 y 443

Hay **dos firewalls** en Oracle, hay que abrir el puerto en los dos:

- **Security List / Network Security Group** (en la consola web, dentro del
  detalle de la VM → "Subnet" → "Security Lists"): agregá reglas de ingreso
  para `0.0.0.0/0`, puerto `80` y `443` (TCP).
- **Firewall del sistema operativo** (por SSH, ver paso 3): Ubuntu en Oracle
  viene con `iptables` bloqueando todo lo que no sea el puerto 22 por default.

## 3. Conectarte e instalar Docker

```bash
ssh -i tu-clave-privada.key ubuntu@<IP_PUBLICA>

# abrir 80/443 en el firewall del sistema
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save 2>/dev/null || sudo iptables-save | sudo tee /etc/iptables/rules.v4

# instalar Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
exit
```

Volvé a conectarte por SSH para que el grupo `docker` tome efecto.

## 4. Bajar el código y configurar

Si el repo es privado, generá un [token de acceso personal de GitHub](https://github.com/settings/tokens)
(solo permiso de lectura) y usalo en el clone:

```bash
git clone https://<tu-token>@github.com/valendivito/ayudante-de-marketing.git
cd ayudante-de-marketing
cp .env.example .env
nano .env
```

Completá en `.env`:

- `ANTHROPIC_API_KEY`: tu key de [console.anthropic.com](https://console.anthropic.com).
- `DASHBOARD_PASSWORD`: una contraseña que vos elijas (sin esto, cualquiera en
  internet que encuentre la URL puede usar el dashboard y gastar tu cuota de
  Anthropic).
- `PUBLIC_HOSTNAME`: tu IP pública con el truco de [sslip.io](https://sslip.io)
  para tener HTTPS sin comprar un dominio, ej: `123.45.67.89.sslip.io`
  (reemplazá por la IP real de tu VM, con puntos).
- Opcional: `GROQ_API_KEY` u `OPENAI_API_KEY` para transcripción de videos sin
  subtítulos.

## 5. Levantar todo

```bash
docker compose up -d --build
```

Esto levanta dos contenedores: la app (Next.js + ffmpeg + yt-dlp) y Caddy, que
le pide automáticamente un certificado HTTPS a Let's Encrypt para tu
`PUBLIC_HOSTNAME` y hace de proxy hacia la app.

Entrá desde cualquier PC a `https://<tu PUBLIC_HOSTNAME>`. El navegador te va
a pedir usuario (cualquiera) y contraseña (la que pusiste en
`DASHBOARD_PASSWORD`).

## Mantenimiento

```bash
docker compose logs -f app     # ver logs de la app
docker compose ps              # ver estado de los contenedores

# actualizar a la última versión del código
git pull
docker compose up -d --build
```

Los datos (base de videos, archivos subidos) viven en el volumen Docker
`app-storage` y sobreviven a reinicios y actualizaciones.
