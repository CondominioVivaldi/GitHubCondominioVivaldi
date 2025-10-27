// src/app/api/login/route.js
// Maneja el inicio de sesión de usuarios y genera un token JWT

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";
import { generarToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { usuario, contraseña } = await req.json();

    if (!usuario || !contraseña) {
      return NextResponse.json({ success: false, message: "Faltan credenciales." }, { status: 400 });
    }

    await conectarBaseDeDatos();

    // Buscar el usuario (puede ser administrador o vivienda)
    const user = await Usuario.findOne({ usuario });

    // Si no se encuentra el usuario
    if (!user) {
      return NextResponse.json({ success: false, message: "Usuario o contraseña incorrectos." }, { status: 401 });
    }

    // Validar la contraseña
    const contraseñaValida = await user.compararContraseña(contraseña);
    if (!contraseñaValida) {
      return NextResponse.json({ success: false, message: "Usuario o contraseña incorrectos." }, { status: 401 });
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return NextResponse.json({ success: false, message: "El usuario no está activo." }, { status: 403 });
    }

    // Generar token JWT
    const token = await generarToken(user);
    console.log("Token completo generado:", token);

    // Crear respuesta con cookie segura
    const respuesta = NextResponse.json({
      success: true,
      tipoUsuario: user.tipoUsuario, // 'administrador' o 'vivienda'
      usuario: user.usuario,
      message: "Inicio de sesión exitoso."
    });

    respuesta.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 // 1 hora
    });

    console.log("Cookie 'token' configurada correctamente");

    return respuesta;

  } catch (error) {
    console.error("Error en /api/login:", error);
    return NextResponse.json({ success: false, message: "Error interno del servidor." }, { status: 500 });
  }
}