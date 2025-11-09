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
 * * Query params:
 * - userName: Nombre del usuario a buscar. Obligatorio.
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

    // 2. Verificar autenticación y obtener información del usuario
    const authResult = await verificarAutenticacion(token);
    if (authResult.status !== 200) {
      return NextResponse.json(
        { message: authResult.message || "No autenticado." },
        { status: authResult.status }
      );
    }

    // Gracias a la corrección en auth.js, ahora tenemos 'type' y 'usuario' (string)
    const tipoUsuario = authResult.type;
    const usuarioSesion = authResult.usuario; 

    // 3. Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName") || "";
    const fechaInicio = searchParams.get("fechaInicio") || "";
    const fechaFin = searchParams.get("fechaFin") || "";

    // 4. Validar que los filtros de fecha y usuario existan
    if (!userName || !fechaInicio || !fechaFin) {
      return NextResponse.json(
        { message: "Debe proporcionar userName, fechaInicio y fechaFin para buscar." },
        { status: 400 }
      );
    }
    
    // 5. Aplicar lógica de autorización según el tipo de usuario
    let filtro = {
      date: {
        $gte: fechaInicio,
        $lte: fechaFin,
      },
    };

    if (tipoUsuario === "administrador") {
      // Si el administrador busca "todos", no aplicamos filtro de usuario
      if (userName.toLowerCase() !== "todos") {
        filtro.userName = userName; // Filtra por el usuario especificado
      }
      // Si es "todos", no agregamos filtro de userName
    } else if (tipoUsuario === "vivienda") {
      // Un usuario de vivienda SOLO puede ver sus propias reservas
      if (userName !== usuarioSesion) {
         // Esta validación es clave para la seguridad: el usuario de vivienda no puede consultar otro userName
         return NextResponse.json(
           { message: "No autorizado. Solo puede ver sus propias reservas." },
           { status: 403 }
         );
      }
      filtro.userName = usuarioSesion; // Filtra forzosamente por su propio usuario
    } else {
        // En caso de un tipo de usuario desconocido
        return NextResponse.json(
          { message: "Tipo de usuario no soportado." },
          { status: 403 }
        );
    }


    await conectarBaseDeDatos();

    // 6. Buscar reservas con el filtro
    const reservas = await Reserva.find(filtro)
      .sort({ date: 1, hourId: 1 }) // Ordenar por fecha y hora
      .lean();

    // 7. Obtener los nombres de las amenidades (lógica optimizada)
    const amenidadIds = [...new Set(reservas.map(r => r.amenidadId.toString()))];
    
    const amenidades = await Amenidad.find({
      _id: { $in: amenidadIds }
    }).select("_id nombre").lean();

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