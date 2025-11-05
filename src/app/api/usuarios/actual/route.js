//  src/app/api/usuarios/actual/route.js

import { NextResponse } from "next/server";
import { verificarToken } from "@/lib/auth";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";
import Vivienda from "@/modelos/Vivienda"; // <-- Importamos el modelo Vivienda

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

    // 2️⃣ Verificar el token y obtener el payload (que tiene el ID de usuario)
    const payload = await verificarToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: "Token inválido o expirado." },
        { status: 401 }
      );
    }

    await conectarBaseDeDatos();

    // 3️⃣ Buscar al usuario logueado para obtener su nombre de usuario
    const usuarioLogueado = await Usuario.findById(payload.id).select(
      "usuario tipoUsuario"
    );

    if (!usuarioLogueado) {
      return NextResponse.json(
        { success: false, message: "Usuario del token no encontrado en BD." },
        { status: 404 }
      );
    }

    const nombreUsuario = usuarioLogueado.usuario; // Ej: "Apto101"

    // 4️⃣ Buscar la vivienda usando el nombre de usuario ("usuario" == "idVivienda")
    const vivienda = await Vivienda.findOne({ idVivienda: nombreUsuario });

    if (!vivienda) {
      // No se encontró una vivienda que coincida con el usuario
      return NextResponse.json({
        success: true,
        usuario: {
          id: usuarioLogueado._id,
          usuario: usuarioLogueado.usuario,
          tipoUsuario: usuarioLogueado.tipoUsuario,
          condominoId: null, // No hay vivienda, por lo tanto no hay condómino
        },
        message: "Usuario encontrado, pero no se encontró vivienda asociada.",
      });
    }

    // 5️⃣ Buscar al "Propietario" en el array "condominosVinculados"
    const condominosVinculados = vivienda.condominosVinculados || [];

    const propietario = condominosVinculados.find(
      (c) => c.tipoInquilino === "Propietario"
    );

    // 6️⃣ Extraer el ID del condómino (será null si no se encontró un Propietario)
    const condominoId = propietario ? propietario.condominoId : null;

    // 7️⃣ Devolver los datos del usuario + el condominoId (sea null o un ID)
    return NextResponse.json({
      success: true,
      usuario: {
        id: usuarioLogueado._id,
        usuario: usuarioLogueado.usuario,
        tipoUsuario: usuarioLogueado.tipoUsuario,
        viviendaId: vivienda._id,
        condominoId: condominoId, // Esto es lo que el frontend necesita
      },
    });
  } catch (error) {
    console.error("Error en /api/usuarios/actual:", error);
    // Manejo de error si el modelo Vivienda no se importó correctamente
    if (error.message.includes("Schema hasn't been registered")) {
      console.error(
        "Asegúrate de importar el modelo Vivienda en este archivo."
      );
    }
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}