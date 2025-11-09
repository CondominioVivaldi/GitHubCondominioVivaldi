// src/app/api/reservas/verActivas/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reserva from "@/modelos/Reserva";
import Amenidad from "@/modelos/Amenidad";
import { verificarAutenticacion } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * Obtiene las reservas activas con filtros opcionales.
 * Solo administradores pueden ver todas las reservas.
 * 
 * Query params:
 * - userName: Nombre del usuario o "Todos" para ver todas las reservas
 * - fechaInicio: Fecha de inicio del rango (formato YYYY-MM-DD)
 * - fechaFin: Fecha de fin del rango (formato YYYY-MM-DD)
 */
export async function GET(request) {
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
        { message: "No autorizado. Solo administradores pueden acceder." },
        { status: 403 }
      );
    }

    // 3. Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName") || "";
    const fechaInicio = searchParams.get("fechaInicio") || "";
    const fechaFin = searchParams.get("fechaFin") || "";

    // 4. Validar que ambos filtros estén presentes
    if (!userName || !fechaInicio || !fechaFin) {
      return NextResponse.json(
        { message: "Debe proporcionar userName, fechaInicio y fechaFin para buscar." },
        { status: 400 }
      );
    }

    await conectarBaseDeDatos();

    // 5. Construir filtro de búsqueda
    const filtro = {
      date: {
        $gte: fechaInicio,
        $lte: fechaFin,
      },
    };

    // Si no es "Todos", filtrar por userName específico
    if (userName.toLowerCase() !== "todos") {
      filtro.userName = userName;
    }

    // 6. Buscar reservas con el filtro
    const reservas = await Reserva.find(filtro)
      .sort({ date: 1, hourId: 1 }) // Ordenar por fecha y hora
      .lean();

    // 7. Obtener los nombres de las amenidades
    // Extraer todos los amenidadId únicos
    const amenidadIds = [...new Set(reservas.map(r => r.amenidadId.toString()))];
    
    // Buscar todas las amenidades en una sola consulta
    const amenidades = await Amenidad.find({
      _id: { $in: amenidadIds }
    }).select("_id nombre").lean();

    // Crear un mapa para acceso rápido
    const amenidadMap = amenidades.reduce((acc, amenidad) => {
      acc[amenidad._id.toString()] = amenidad.nombre;
      return acc;
    }, {});

    // 8. Enriquecer las reservas con el nombre de la amenidad
    const reservasEnriquecidas = reservas.map(reserva => ({
      _id: reserva._id,
      date: reserva.date,
      hourTime: reserva.hourTime,
      userName: reserva.userName,
      amenidadNombre: amenidadMap[reserva.amenidadId.toString()] || "Amenidad no encontrada",
    }));

    return NextResponse.json({
      success: true,
      reservas: reservasEnriquecidas,
    });

  } catch (error) {
    console.error("Error en GET /api/reservas/verActivas:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al obtener reservas." },
      { status: 500 }
    );
  }
}