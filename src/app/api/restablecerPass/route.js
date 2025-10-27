// src/app/api/restablecerPass/route.js
// Recibe el token y la nueva contraseña, valida el token, busca el usuario y actualiza la contraseña con hash.

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";

export async function POST(req) {
  try {
    await conectarBaseDeDatos();
    const { token, nuevaContrasena } = await req.json();

    if (!token || !nuevaContrasena) {
      return NextResponse.json({ ok: false, error: "Datos incompletos" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.CONTRASENNA_JWT);
    } catch (error) {
      return NextResponse.json({ ok: false, error: "Token inválido o expirado" });
    }

    const userFound = await Usuario.findOne({ usuario: payload.usuario });
    if (!userFound) {
      return NextResponse.json({ ok: false, error: "Usuario no encontrado" });
    }

    // Actualizar la contraseña (el hash se hace automáticamente por el pre-save middleware)
    userFound.contraseña = nuevaContrasena;
    await userFound.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en restablecerPass:", error);
    return NextResponse.json({ ok: false, error: "Error del servidor" });
  }
}