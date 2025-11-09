// src/app/api/reservas/agregar-vivienda/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reserva from "@/modelos/Reserva";
import { verificarAutenticacion } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * Crea una reserva hecha directamente por un usuario tipo vivienda.
 * El usuario vivienda solo puede reservar para sí mismo.
 */
export async function POST(request) {
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
    if (authResult.status !== 200 || authResult.type !== "vivienda") {
      return NextResponse.json(
        { message: "No autorizado. Solo usuarios tipo vivienda pueden usar este endpoint." },
        { status: 403 }
      );
    }

    // 3. Extraer y validar datos
    const { amenidadId, date, hourId, hourTime, userId, userName } = await request.json();
    if (!amenidadId || !date || !hourId || !hourTime || !userId || !userName) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios para crear la reserva." },
        { status: 400 }
      );
    }

    // 4. Validación adicional: el userId debe coincidir con el usuario autenticado
    if (userId !== authResult.userId) {
      return NextResponse.json(
        { message: "No autorizado. Solo puedes crear reservas para tu propio usuario." },
        { status: 403 }
      );
    }

    await conectarBaseDeDatos();

    // 5. Evitar doble reserva en el mismo horario
    const existingReservation = await Reserva.findOne({
      amenidadId,
      date,
      hourId,
    });
    if (existingReservation) {
      return NextResponse.json(
        { message: "La hora seleccionada ya está reservada." },
        { status: 409 }
      );
    }

    // 6. Crear nueva reserva
    // Nota: reservedByAdminId se usa aquí para cumplir con el esquema, 
    // aunque semánticamente no es un admin (es el mismo usuario vivienda)
    const newReserva = new Reserva({
      amenidadId,
      date,
      hourId,
      hourTime,
      userId,
      userName,
      reservedByAdminId: userId, // Usar el mismo userId para cumplir con el esquema
      status: "confirmed",
      createdAt: new Date(),
    });

    await newReserva.save();

    return NextResponse.json(
      { message: "Reserva creada exitosamente.", reserva: newReserva },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/reservas/agregar-vivienda:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al guardar la reserva." },
      { status: 500 }
    );
  }
}