import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Sin DASHBOARD_PASSWORD seteada, la app queda abierta (uso local).
 * Con ella seteada, pide Basic Auth en todas las rutas, incluida la API,
 * para no dejar el dashboard expuesto a cualquiera en internet.
 */
export function proxy(request: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return NextResponse.next();

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf-8");
    const suppliedPassword = decoded.slice(decoded.indexOf(":") + 1);
    if (suppliedPassword === password) {
      return NextResponse.next();
    }
  }

  return new Response("Autenticación requerida.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Ayudante de Marketing"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
