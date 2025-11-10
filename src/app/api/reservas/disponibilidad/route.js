// src/app/api/reservas/disponibilidad/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reserva from "@/modelos/Reserva";
import { verificarAutenticacion } from "@/lib/auth"; 
import { cookies } from "next/headers"; 

// Forzar la ruta a ser dinámica para evitar el warning de `cookies()` en Next.js
export const dynamic = 'force-dynamic';

/**
 * Maneja la obtención de las reservas existentes para una amenidad y mes específico.
 * Retorna un mapa de disponibilidad para el calendario.
 *
 * Query Params:
 * - amenidadId: ID de la amenidad (obligatorio)
 * - year: Año a consultar (ej: 2025)
 * - month: Mes a consultar (1-12)
 *
 * @param {Request} request La solicitud Next.js.
 * @returns {NextResponse} Un objeto con las reservas existentes, agrupadas por fecha.
 */
export async function GET(request) {
  try {
    // 1. Obtener la cookie de manera "síncrona" y el header de la solicitud
    const cookieStore = cookies();
    const cookieToken = cookieStore.get('token')?.value; 
    const headersList = request.headers;

    // 2. Extraer el token: Priorizar Header (Bearer), si no existe, usar el valor de la cookie.
    const token = headersList.get('authorization')?.startsWith('Bearer ') 
        ? headersList.get('authorization').substring(7) 
        : cookieToken || null;
    
    // 3. Verificar autenticación pasando el token string
    const authResult = await verificarAutenticacion(token); 
    
    // Se valida que la autenticación sea exitosa (200) y que el usuario sea administrador o vivienda
    if (authResult.status !== 200 || (authResult.type !== "administrador" && authResult.type !== "vivienda")) {
        return NextResponse.json({ message: "No autorizado o privilegios insuficientes." }, { status: 403 }); 
    }
    
    const { searchParams } = new URL(request.url);
    const amenidadId = searchParams.get("amenidadId");
    
    // --- INICIO DE LA CORRECCIÓN ---
    // Leer 'year' y 'month' de los parámetros de consulta
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month"); // El frontend envía 1-12

    if (!amenidadId) {
      return NextResponse.json({ message: "El ID de la amenidad es obligatorio." }, { status: 400 });
    }

    // Si no se proveen, usar el mes y año actual por defecto
    const now = new Date();
    const year = parseInt(yearParam) || now.getFullYear();
    // monthParam es 1-indexado (1-12). getMonth() es 0-indexado (0-11).
    const month = parseInt(monthParam) || (now.getMonth() + 1);

    // Calcular el primer y último día del mes para la consulta
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    
    // new Date(year, month, 0) nos da el último día del mes anterior.
    // Como 'month' es 1-indexado, new Date(year, month, 0) 
    // nos da el último día del mes 'month' (porque el 2do param es 0-indexado).
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;
    
    // --- FIN DE LA CORRECCIÓN ---

    await conectarBaseDeDatos();

    // 4. Buscar reservas para el rango de fechas del mes y la amenidad
    const qReservas = await Reserva.find({
      amenidadId: amenidadId,
      date: {
        $gte: startDate, // Usar fecha de inicio calculada
        $lte: endDate,   // Usar fecha de fin calculada
      },
    }).select("date hourId -_id")
    .lean(); 
    
    // 5. Mapear los resultados a un objeto de disponibilidad
    const availabilityMap = qReservas.reduce((acc, reserva) => {
        const { date, hourId } = reserva;
        
        acc[date] = acc[date] || [];
        if (!acc[date].includes(hourId)) {
            acc[date].push(hourId);
        }
        return acc;
    }, {});
    
    return NextResponse.json(availabilityMap);
  } catch (error) {
    console.error("Error en GET /api/reservas/disponibilidad:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al obtener disponibilidad." },
      { status: 500 }
    );
  }
}