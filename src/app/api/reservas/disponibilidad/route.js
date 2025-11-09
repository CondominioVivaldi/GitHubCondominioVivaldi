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
    
    // Se valida que la autenticación sea exitosa (200) y que el usuario sea administrador
    if (authResult.status !== 200 || authResult.type !== "administrador") {
        return NextResponse.json({ message: "No autorizado o privilegios insuficientes." }, { status: 403 }); 
    }
    
    const { searchParams } = new URL(request.url);
    const amenidadId = searchParams.get("amenidadId");
    
    // El frontend actualmente está codificado para Enero 2025 ('2025-01')
    const currentYearMonth = "2025-01"; 

    if (!amenidadId) {
      return NextResponse.json({ message: "El ID de la amenidad es obligatorio." }, { status: 400 });
    }

    await conectarBaseDeDatos();

    // 4. Buscar reservas para el rango de fechas del mes y la amenidad
    const qReservas = await Reserva.find({
      amenidadId: amenidadId,
      date: {
        $gte: `${currentYearMonth}-01`, 
        $lte: `${currentYearMonth}-31`, 
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