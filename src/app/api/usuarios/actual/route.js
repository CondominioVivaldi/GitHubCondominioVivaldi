//  src/app/api/usuarios/actual/route.js

import { NextResponse } from "next/server";
import { verificarToken } from "@/lib/auth";

export async function GET(req) {
  try {
    // 1️⃣ Obtener el token desde la cookie
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No se encontró token." },
        { status: 401 }
      );
    }

    // 2️⃣ Verificar el token y obtener el payload
    const payload = await verificarToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Token inválido o expirado." },
        { status: 401 }
      );
    }

    // 3️⃣ Devolver los datos del usuario autenticado
    return NextResponse.json({
      success: true,
      usuario: {
        id: payload.id,
        usuario: payload.usuario,
        tipoUsuario: payload.tipoUsuario,
      },
    });
  } catch (error) {
    console.error("Error en /api/usuarios/actual:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
