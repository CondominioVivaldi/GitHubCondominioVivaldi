import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Vivienda from "@/modelos/Vivienda";

export async function POST(req) {
  try {
    const {
      idVivienda,
      direccion,
      modeloCasa,
      cantidadPersonas,
      condominosVinculados
    } = await req.json();

    if (!idVivienda || !direccion || !cantidadPersonas) {
      return NextResponse.json(
        { success: false, message: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    await conectarBaseDeDatos();

    const nuevaVivienda = new Vivienda({
      idVivienda,
      direccion,
      modeloCasa: modeloCasa || null,
      cantidadPersonas: parseInt(cantidadPersonas),
      condominosVinculados: condominosVinculados || []
    });

    await nuevaVivienda.save();

    return NextResponse.json(
      {
        success: true,
        message: "Vivienda agregada exitosamente.",
        vivienda: nuevaVivienda
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error en /api/viviendas:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Ya existe una vivienda con ese ID"
        },
        { status: 400 }
      );
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          message: messages.join(", ")
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await conectarBaseDeDatos();

    const viviendas = await Vivienda.find({})
      .populate('condominosVinculados.condominoId', 'nombreCompleto numeroDocumento')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      viviendas
    });

  } catch (error) {
    console.error("Error en GET /api/viviendas:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
