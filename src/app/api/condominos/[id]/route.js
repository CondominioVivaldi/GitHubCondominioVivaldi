// src/app/api/condominos/[id]/route.js
import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Condomino from "@/modelos/Condomino";
import mongoose from "mongoose";

// 🔹 GET: Obtener condómino por ID
export async function GET(req, { params }) {
  try {
    const { id } = await params; //const { id } = params no funciona
    await conectarBaseDeDatos();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID de condómino inválido." },
        { status: 400 }
      );
    }

    const condomino = await Condomino.findById(new mongoose.Types.ObjectId(id));

    if (!condomino) {
      return NextResponse.json(
        {
          success: false,
          message: `No se encontró el condómino con ID: ${id}.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, found: condomino }, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/condominos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

// 🔹 PUT: Actualizar condómino
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();
    const {
      tipoDocumento,
      nombreCompleto,
      fechaNacimiento,
      numeroTelefono,
      fechaEntrada,
      fechaSalida,
    } = data;

    if (
      !tipoDocumento ||
      !nombreCompleto ||
      !fechaNacimiento ||
      !numeroTelefono ||
      !fechaEntrada
    ) {
      return NextResponse.json(
        { success: false, message: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    await conectarBaseDeDatos();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID de condómino inválido." },
        { status: 400 }
      );
    }

    const condomino = await Condomino.findById(new mongoose.Types.ObjectId(id));
    if (!condomino) {
      return NextResponse.json(
        { success: false, message: "Condómino no encontrado." },
        { status: 404 }
      );
    }

    condomino.tipoDocumento = tipoDocumento;
    condomino.nombreCompleto = nombreCompleto;
    condomino.fechaNacimiento = new Date(fechaNacimiento);
    condomino.numeroTelefono = numeroTelefono;
    condomino.fechaEntrada = new Date(fechaEntrada);
    condomino.fechaSalida = fechaSalida ? new Date(fechaSalida) : null;

    await condomino.save();

    return NextResponse.json({
      success: true,
      message: "Condómino actualizado exitosamente.",
      condomino,
    });
  } catch (error) {
    console.error("Error en PUT /api/condominos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

// 🔹 DELETE: Eliminar condómino
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await conectarBaseDeDatos();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID de condómino inválido." },
        { status: 400 }
      );
    }

    const eliminado = await Condomino.findByIdAndDelete(
      new mongoose.Types.ObjectId(id)
    );

    if (!eliminado) {
      return NextResponse.json(
        { success: false, message: "Condómino no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Condómino eliminado exitosamente.",
    });
  } catch (error) {
    console.error("Error en DELETE /api/condominos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
