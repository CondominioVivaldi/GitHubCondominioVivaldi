// src/app/api/reservas/eliminar/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reserva from "@/modelos/Reserva";
import { verificarAutenticacion } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * Elimina una o varias reservas.
 * Administradores pueden eliminar cualquier reserva.
 * Usuarios de vivienda solo pueden eliminar sus propias reservas.
 * * Body:
 * - reservaIds: Array de IDs de reservas a eliminar
 */
export async function DELETE(request) {
  try {
    // 1. Obtener token desde header o cookie
    const cookieStore = cookies();
    const cookieToken = cookieStore.get("token")?.value;
    const headersList = request.headers;
    const token = headersList.get("authorization")?.startsWith("Bearer ")
      ? headersList.get("authorization").substring(7)
      : cookieToken || null;

    // 2. Verificar autenticación
    const authResult = await verificarAutenticacion(token);
    if (authResult.status !== 200) {
      return NextResponse.json(
        { message: authResult.message || "No autenticado." },
        { status: authResult.status }
      );
    }
    
    // Gracias a la corrección en auth.js, ahora tenemos 'type' y 'usuario' (string)
    const tipoUsuario = authResult.type;
    const usuarioSesion = authResult.usuario; // Nombre de usuario del token

    // 3. Obtener los IDs de las reservas a eliminar
    const { reservaIds } = await request.json();

    if (!reservaIds || !Array.isArray(reservaIds) || reservaIds.length === 0) {
      return NextResponse.json(
        { message: "Debe proporcionar un array de IDs de reservas a eliminar." },
        { status: 400 }
      );
    }

    await conectarBaseDeDatos();
    
    // 4. Determinar el filtro de eliminación
    let filtroEliminacion = {
      _id: { $in: reservaIds }
    };

    if (tipoUsuario === "vivienda") {
      // SI ES USUARIO VIVIENDA, SÓLO PUEDE ELIMINAR SUS PROPIAS RESERVAS
      // Añadimos el filtro para asegurar que el 'userName' de la reserva sea el de la sesión
      filtroEliminacion.userName = usuarioSesion;
      // Esto previene que un usuario de vivienda elimine una reserva pasando el ID de otro.
    }
    // Si es administrador, el filtro queda solo por _id, permitiendo eliminar cualquier reserva.

    // 5. Eliminar las reservas
    const resultado = await Reserva.deleteMany(filtroEliminacion);

    if (resultado.deletedCount === 0) {
      let message = "No se encontraron reservas con los IDs proporcionados.";
      if (tipoUsuario === "vivienda") {
          message = "No se encontraron sus reservas con los IDs proporcionados o no tiene permiso para eliminarlas.";
      }
      return NextResponse.json(
        { message: message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${resultado.deletedCount} reserva(s) eliminada(s) exitosamente.`,
      deletedCount: resultado.deletedCount,
    });

  } catch (error) {
    console.error("Error en DELETE /api/reservas/eliminar:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al eliminar reservas." },
      { status: 500 }
    );
  }
}