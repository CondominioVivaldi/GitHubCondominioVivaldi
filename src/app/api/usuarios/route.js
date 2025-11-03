// src/app/api/usuarios/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";

export async function GET(req) {
  try {
    await conectarBaseDeDatos();

    const usuarios = await Usuario.find({})
      .select("usuario correoElectronico tipoUsuario activo")
      .sort({ usuario: 1 });

    return NextResponse.json({
      success: true,
      usuarios
    });

  } catch (error) {
    console.error("Error en GET /api/usuarios:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await conectarBaseDeDatos();

    const { usuario, nuevaContrasena } = await req.json();

    if (!usuario || !nuevaContrasena) {
      return NextResponse.json(
        { success: false, message: "Usuario y nueva contraseña son requeridos." },
        { status: 400 }
      );
    }

    const userFound = await Usuario.findOne({ usuario });
    if (!userFound) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    userFound.contraseña = nuevaContrasena;
    await userFound.save();

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente."
    });

  } catch (error) {
    console.error("Error en PATCH /api/usuarios:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
