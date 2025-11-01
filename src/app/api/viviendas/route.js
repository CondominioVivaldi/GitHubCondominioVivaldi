// src/app/api/viviendas/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Vivienda from "@/modelos/Vivienda";

// 📌 Crear nueva vivienda
export async function POST(req) {
  try {
    const {
      idVivienda,
      direccion,
      modeloCasa,
      cantidadPersonas,
      condominosVinculados,
    } = await req.json();

    // Validar campos obligatorios
    if (!idVivienda || !direccion || !cantidadPersonas) {
      return NextResponse.json(
        { success: false, message: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    await conectarBaseDeDatos();

    // 🔍 Validar que el idVivienda no exista
    const viviendaExistente = await Vivienda.findOne({ idVivienda: idVivienda.trim() });
    if (viviendaExistente) {
      return NextResponse.json(
        { success: false, message: "Ya existe una vivienda con ese ID." },
        { status: 400 }
      );
    }

    // 🏗️ Crear la nueva vivienda
    const nuevaVivienda = new Vivienda({
      idVivienda: idVivienda.trim(),
      direccion: direccion.trim(),
      modeloCasa: modeloCasa || null,
      cantidadPersonas: parseInt(cantidadPersonas),
      condominosVinculados: condominosVinculados || [],
    });

    await nuevaVivienda.save();

    return NextResponse.json(
      {
        success: true,
        message: "Vivienda agregada exitosamente.",
        vivienda: nuevaVivienda,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en /api/viviendas (POST):", error);

    // 🧱 Error por índice duplicado en Mongo
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Ya existe una vivienda con ese ID." },
        { status: 400 }
      );
    }

    // 🧩 Error de validación
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

// 📋 Obtener viviendas o verificar si un ID ya existe
export async function GET(req) {
  try {
    await conectarBaseDeDatos();

    const { searchParams } = new URL(req.url);
    const idVivienda = searchParams.get("idVivienda");

    // 🔍 Si viene idVivienda, verificar existencia
    if (idVivienda) {
      const vivienda = await Vivienda.findOne({ idVivienda: idVivienda.trim() })
        .populate("condominosVinculados.condominoId", "nombreCompleto numeroDocumento");

      if (vivienda) {
        return NextResponse.json({ success: true, vivienda });
      }

      return NextResponse.json({ success: false, message: "No existe una vivienda con ese ID." });
    }

    // 🏘️ Si no se especifica idVivienda, devolver todas las viviendas
    const viviendas = await Vivienda.find({})
      .populate("condominosVinculados.condominoId", "nombreCompleto numeroDocumento")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      viviendas,
    });
  } catch (error) {
    console.error("Error en GET /api/viviendas:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
