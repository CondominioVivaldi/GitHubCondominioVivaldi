// src/app/api/solicitarRestablecerPass/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";
import { enviarCorreoRestablecerPass } from "@/lib/enviarCorreoRestablecerPass";

export async function POST(req) {
  try {
    await conectarBaseDeDatos();
    const { usuario } = await req.json();

    if (!usuario) {
      return NextResponse.json({ ok: false, error: "Usuario no proporcionado" });
    }

    const userFound = await Usuario.findOne({ usuario });

    if (!userFound) {
      return NextResponse.json({ ok: false });
    }

    // Enviar el correo
    const enviado = await enviarCorreoRestablecerPass(
      userFound.usuario,
      userFound.correoElectronico
    );

    if (!enviado) {
      return NextResponse.json({
        ok: false,
        error: "Error al enviar el correo",
      });
    }

    return NextResponse.json({
      ok: true,
      correo: userFound.correoElectronico,
    });
  } catch (error) {
    console.error("Error en solicitarRestablecerPass:", error);
    return NextResponse.json({ ok: false, error: "Error del servidor" });
  }
}
