import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reserva from "@/modelos/Reserva"; 

export async function DELETE(req) {
  try {
    const {
      _id
    } = await req.json();

    await conectarBaseDeDatos();

    // actualizar la vivienda existente
    await Reserva.findByIdAndDelete(_id)

    return NextResponse.json(
      {
        success: true,
        message: "Resevar cancelada exitosamente.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error en /api/reservas:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Error interno del servidor." },
      { status: 500 }
    );
  }
}