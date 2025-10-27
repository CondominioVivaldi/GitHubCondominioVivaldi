// src/middleware.js
// Middleware actualizado para redirigir basado en autenticación

import { NextResponse } from "next/server";
import { verificarToken } from "@/lib/auth";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const ruta = req.nextUrl.pathname;
  const urlInicioSesion = new URL("/inicioDeSesion", req.url);

  console.log("Middleware ejecutándose en:", ruta);

  // --- 1. Lógica para usuarios CON token ---
  if (token) {
    const decoded = await verificarToken(token);

    if (decoded) {
      console.log("Usuario autenticado:", decoded.usuario, "Tipo:", decoded.tipoUsuario);

      // Si el usuario logueado intenta ir a la raíz (/) o a /inicioDeSesion,
      // redirigir a su dashboard correspondiente.
      if (ruta === "/" || ruta.startsWith("/inicioDeSesion")) {
        let dashboardUrl = "/inicioDeSesion";

        if (decoded.tipoUsuario === "administrador") {
          dashboardUrl = "/usuarioAdministrador/inicio";
        } else if (decoded.tipoUsuario === "vivienda") {
          dashboardUrl = "/usuarioVivienda/inicio";
        }

        console.log(`Redirigiendo usuario logueado a: ${dashboardUrl}`);
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }

      // Protección de rutas según tipo de usuario
      if (ruta.startsWith("/usuarioAdministrador") && decoded.tipoUsuario !== "administrador") {
        console.warn("Acceso denegado: no es administrador");
        return NextResponse.redirect(urlInicioSesion);
      }

      if (ruta.startsWith("/usuarioVivienda") && decoded.tipoUsuario !== "vivienda") {
        console.warn("Acceso denegado: no es vivienda");
        return NextResponse.redirect(urlInicioSesion);
      }

      // Si el usuario está logueado y tiene permisos, continuar.
      return NextResponse.next();
    }
  }

  // --- 2. Lógica para usuarios SIN token (o token inválido) ---
  console.log("No hay token válido.");

  // Si no hay token y el usuario intenta acceder a rutas protegidas,
  // redirigir a inicioDeSesion.
  if (ruta.startsWith("/usuarioAdministrador") || ruta.startsWith("/usuarioVivienda")) {
    console.warn("No hay token, redirigiendo a login...");
    return NextResponse.redirect(urlInicioSesion);
  }

  // Si no hay token y el usuario accede a /, /inicioDeSesion, o APIs,
  // permitir el acceso.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|Xmenu.png|file.svg|globe.svg|window.svg).*)',
  ],
};
