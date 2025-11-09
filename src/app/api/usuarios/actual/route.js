//  src/app/api/usuarios/actual/route.js

import { NextResponse } from "next/server";
import { verificarToken } from "@/lib/auth";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";
import Vivienda from "@/modelos/Vivienda";

// Asegura que esta función sea la exportación nombrada, como requiere Next.js App Router
export async function GET(req) {
  try {
    // Obtener el token desde la cookie
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No se encontró token." },
        { status: 401 }
      );
    }

    // Verificar el token y obtener el payload (que tiene el ID de usuario)
    const payload = await verificarToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: "Token inválido o expirado." },
        { status: 401 }
      );
    }

    await conectarBaseDeDatos();

    // Buscar al usuario logueado para obtener su nombre de usuario
    const usuarioLogueado = await Usuario.findById(payload.id).select(
      "usuario tipoUsuario"
    );

    if (!usuarioLogueado) {
      return NextResponse.json(
        { success: false, message: "Usuario del token no encontrado en BD." },
        { status: 404 }
      );
    }

    const nombreUsuario = usuarioLogueado.usuario;

    // Buscar la vivienda usando el nombre de usuario ("usuario" == "idVivienda")
    // Nota: El ID de la vivienda de MongoDB no es el ID del usuario.
    const vivienda = await Vivienda.findOne({ idVivienda: nombreUsuario });

    if (!vivienda) {
      // Si no hay vivienda asociada, devolvemos success: true, pero sin viviendaId/condominoId
      return NextResponse.json({
        success: true,
        usuario: {
          id: usuarioLogueado._id,
          usuario: usuarioLogueado.usuario, // Esto es el idVivienda que usará el frontend
          tipoUsuario: usuarioLogueado.tipoUsuario,
        },
        message: "Usuario encontrado, pero no se encontró vivienda asociada.",
      });
    }

    // Buscar al "Propietario" en el array "condominosVinculados"
    const condominosVinculados = vivienda.condominosVinculados || [];

    const propietario = condominosVinculados.find(
      (c) => c.tipoInquilino === "Propietario"
    );

    // Extraer el ID del condómino (será null si no se encontró un Propietario)
    const condominoId = propietario ? propietario.condominoId : null;

    // Devolver los datos del usuario + las referencias necesarias
    return NextResponse.json({
      success: true,
      usuario: {
        id: usuarioLogueado._id,
        usuario: usuarioLogueado.usuario, // ID de vivienda (ej: "vivienda001")
        tipoUsuario: usuarioLogueado.tipoUsuario,
        viviendaId: vivienda._id, // El ID de MongoDB de la vivienda
        condominoId: condominoId,
      },
    });
  } catch (error) {
    console.error("Error en /api/usuarios/actual:", error);
    // Aseguramos que si hay un error en el servidor, devolvemos un JSON válido (con status 500)
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}