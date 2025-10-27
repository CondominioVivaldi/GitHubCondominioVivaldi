import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Condomino from "@/modelos/Condomino";
import Mongoose from "mongoose";

export async function GET(req, params) {
  try {
    const data = await params.params;
    const id = data.id;

    const { searchParams } = new URL(req.url);

    await conectarBaseDeDatos();

    let query = {
      _id: new Mongoose.Types.ObjectId(id),
    };

    const condominos = await Condomino.find(query).select(
      "nombreCompleto numeroDocumento tipoDocumento fechaEntrada fechaSalida activo fechaNacimiento correoElectronico numeroTelefono",
    );

    console.log(condominos);

    const found = condominos.at(0);

    console.log("FOUND!!!", found);

    return NextResponse.json({
      success: true,
      found,
    });
  } catch (error) {
    console.error("Error en GET /api/condominos:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
