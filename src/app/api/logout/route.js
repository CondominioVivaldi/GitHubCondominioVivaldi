// src/app/api/logout/route.js
// Cierra la sesión del usuario eliminando la cookie del token JWT

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Sesión cerrada." });
  response.cookies.set("token", "", { path: "/", maxAge: 0 });
  return response;
}
