import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Amenidad from "@/modelos/Amenidad";

export async function GET(req) {
  try {
    await conectarBaseDeDatos();

    const amenidades = await Amenidad.find({});

    console.log("TEST!!!", amenidades);

    const conReserva = amenidades.filter(
      (amenidad) => amenidad.requiereReserva === "sí",
    );
    const sinReserva = amenidades.filter(
      (amenidad) => amenidad.requiereReserva === "no",
    );

    return NextResponse.json({
      success: true,
      conReserva,
      sinReserva,
    });
  } catch (error) {
    console.error("Error en GET /api/amenidades:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
