// src/app/api/reservas/eliminar/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reserva from "@/modelos/Reserva";
import { verificarAutenticacion } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * Elimina una o varias reservas.
 * Solo administradores pueden eliminar reservas.
 * 
 * Body:
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
    if (authResult.status !== 200 || authResult.type !== "administrador") {
      return NextResponse.json(
        { message: "No autorizado. Solo administradores pueden eliminar reservas." },
        { status: 403 }
      );
    }

    // 3. Obtener los IDs de las reservas a eliminar
    const { reservaIds } = await request.json();

    if (!reservaIds || !Array.isArray(reservaIds) || reservaIds.length === 0) {
      return NextResponse.json(
        { message: "Debe proporcionar un array de IDs de reservas a eliminar." },
        { status: 400 }
      );
    }

    await conectarBaseDeDatos();

    // 4. Eliminar las reservas
    const resultado = await Reserva.deleteMany({
      _id: { $in: reservaIds }
    });

    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        { message: "No se encontraron reservas con los IDs proporcionados." },
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