// src/app/api/reclamos/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reclamo from "@/modelos/Reclamo";

export async function GET(req) {
  await conectarBaseDeDatos();
  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado");
  const creadoPor = searchParams.get("creadoPor"); //nuevo parámetro

  let filtro = {};

  //Estado: pendientes = Sin leer + En proceso
  if (estado === "pendientes") {
    filtro.estado = { $in: ["Nuevo", "En proceso"] };
  } else if (estado) {
    filtro.estado = estado;
  }

  //Si viene el ID del usuario, filtramos por él
  if (creadoPor) {
    filtro.creadoPor = creadoPor;
  }

  const reclamos = await Reclamo.find(filtro)
    .populate("creadoPor", "usuario")
    .sort({ createdAt: -1 });

  return NextResponse.json({ success: true, reclamos });
}

export async function POST(req) {
  await conectarBaseDeDatos();
  const body = await req.json();
  const { titulo, descripcion, creadoPor } = body;

  if (!titulo || !descripcion || !creadoPor) {
    return NextResponse.json(
      { error: "Todos los campos son obligatorios." },
      { status: 400 }
    );
  }

  try {
    // 👇 Se crea con estado por defecto "Sin leer" (lo define tu modelo)
    const nuevo = await Reclamo.create({ titulo, descripcion, creadoPor });
    return NextResponse.json(
      { message: "Reclamo creado correctamente", reclamo: nuevo },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear reclamo:", error);
    return NextResponse.json(
      { error: "Error interno al crear reclamo." },
      { status: 500 }
    );
  }
}

// 👇 Nuevo: actualizar estado de un reclamo
export async function PUT(req) {
  await conectarBaseDeDatos();
  const body = await req.json();
  const { id, estado, mensaje, autor } = body;

  if (!id) {
    return NextResponse.json({ error: "El ID del reclamo es obligatorio." }, { status: 400 });
  }

  const updateFields = {};
  if (estado) updateFields.estado = estado;
  if (estado === "Finalizado") updateFields.fechaResolucion = new Date();

  try {
    const actualizado = await Reclamo.findByIdAndUpdate(
      id,
      {
        $set: updateFields,
        $push: mensaje && autor
          ? { conversacion: { autor, mensaje, fecha: new Date() } }
          : {},
      },
      { new: true } // ✅ devuelve el documento actualizado
    )
      .populate("creadoPor", "usuario")
      .populate("vivienda", "numero");

    if (!actualizado) {
      return NextResponse.json({ error: "Reclamo no encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Reclamo actualizado correctamente",
      reclamo: actualizado,
    });
  } catch (error) {
    console.error("Error al actualizar reclamo:", error);
    return NextResponse.json({ error: "Error interno al actualizar reclamo." }, { status: 500 });
  }
  
}