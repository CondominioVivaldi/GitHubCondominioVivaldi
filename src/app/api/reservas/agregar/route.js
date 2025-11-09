// src/app/api/reservas/agregar/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reserva from "@/modelos/Reserva";
import { verificarAutenticacion } from "@/lib/auth";
import { cookies } from "next/headers";

// Forzar la ruta a ser dinámica para evitar el warning de `cookies()` en Next.js
export const dynamic = 'force-dynamic';

/**
 * Maneja la creación de una nueva reserva.
 * @param {Request} request La solicitud Next.js con los datos de la reserva.
 * @returns {NextResponse} Resultado de la operación.
 */
export async function POST(request) {
  try {
    // 1. Obtener la cookie de manera "síncrona" y el header de la solicitud
    const cookieStore = cookies();
    const cookieToken = cookieStore.get('token')?.value; 
    const headersList = request.headers;

    // 2. Extraer el token: Priorizar Header (Bearer), si no existe, usar el valor de la cookie.
    const token = headersList.get('authorization')?.startsWith('Bearer ') 
        ? headersList.get('authorization').substring(7) 
        : cookieToken || null;

    // 3. Verificar autenticación
    const authResult = await verificarAutenticacion(token); 
    
    // Se valida que la autenticación sea exitosa (200) y que el usuario sea administrador
    if (authResult.status !== 200 || authResult.type !== "administrador") {
        return NextResponse.json({ message: "No autorizado o privilegios insuficientes." }, { status: 403 }); 
    }

    // 4. Extraer datos de la reserva y validar
    const { amenidadId, date, hourId, hourTime, userId, userName } = await request.json();

    if (!amenidadId || !date || !hourId || !hourTime || !userId || !userName) {
      return NextResponse.json({ message: "Faltan campos obligatorios para crear la reserva." }, { status: 400 });
    }

    await conectarBaseDeDatos();

    // 5. Doble chequeo de disponibilidad (Importante para evitar reservas simultáneas)
    const existingReservation = await Reserva.findOne({
      amenidadId: amenidadId,
      date: date,
      hourId: hourId,
    });

    if (existingReservation) {
      return NextResponse.json({ message: "La hora seleccionada ya está reservada." }, { status: 409 });
    }

    // 6. Crear la nueva reserva
    const newReserva = new Reserva({
      amenidadId,
      date,
      hourId,
      hourTime,
      userId, 
      userName,
      reservedByAdminId: authResult.userId, 
      reservedByAdminName: authResult.user, 
      status: 'confirmed', 
      createdAt: new Date(),
    });

    await newReserva.save();

    return NextResponse.json({ message: "Reserva creada exitosamente.", reserva: newReserva }, { status: 201 });

  } catch (error) {
    console.error("Error en POST /api/reservas/agregar:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al guardar la reserva." },
      { status: 500 }
    );
  }
}