// src/app/api/reservas/verActivas/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb"; // Ajusta la ruta a tu archivo de conexión
import Reserva from "@/modelos/Reserva"; // Ajusta la ruta a tu modelo
import Amenidad from "@/modelos/Amenidad";
import Vivienda from "@/modelos/Vivienda";


// GET /api/ver-reservas-activas?viviendaId=123&fechaInicio=2025-10-20&fechaFin=2025-10-25
export async function GET(request) {
  try {
    await conectarBaseDeDatos();

    // Obtener los parámetros de consulta
    const { searchParams } = new URL(request.url);

    console.log("SEARCH PARAMS!!!!", searchParams)

    const viviendaId = searchParams.get("viviendaId");
    const fechaInicio = searchParams.get("fechaInicio");
    const fechaFin = searchParams.get("fechaFin");

    // Construir filtro dinámico
    const filtro = {};

    const vivienda = await Vivienda.findOne({ idVivienda: viviendaId })

    console.log("VIVIENDA ENCONTRADA!!!", vivienda)


    if (viviendaId) {
      filtro.vivienda = vivienda._id;
    }



    if (fechaInicio && fechaFin) {
      // Filtrar entre dos fechas (inclusive)
      filtro.fechaReserva = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    } else if (fechaInicio) {
      filtro.fechaReserva = { $gte: new Date(fechaInicio) };
    } else if (fechaFin) {
      filtro.fechaReserva = { $lte: new Date(fechaFin) };
    }

    // 🔍 Filtrar solo reservas activas si tu esquema tiene un campo "estado"
    // filtro.estado = "activa";

    console.log("📦 Filtro aplicado:", filtro);


    // Buscar reservas con las relaciones necesarias
    const reservas = await Reserva.find(filtro)
      .populate("amenidad")
      .populate("vivienda")
      .lean();

    return NextResponse.json({ reservas }, { status: 200 });
  } catch (error) {
    console.error("❌ Error al obtener reservas:", error);
    return NextResponse.json(
      { error: "Error al obtener reservas activas." },
      { status: 404 }
    );
  }
}
