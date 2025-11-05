// src/app/api/condominos/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Condomino from "@/modelos/Condomino";

export async function POST(req) {
  try {
    const {
      tipoDocumento,
      numeroDocumento,
      nombreCompleto,
      fechaNacimiento,
      correoElectronico,
      numeroTelefono,
      fechaEntrada,
      fechaSalida,
    } = await req.json();

    if (
      !tipoDocumento ||
      !numeroDocumento ||
      !nombreCompleto ||
      !fechaNacimiento ||
      !correoElectronico ||
      !numeroTelefono ||
      !fechaEntrada
    ) {
      return NextResponse.json(
        { success: false, message: "Faltan campos requeridos." },
        { status: 400 },
      );
    }

    await conectarBaseDeDatos();

    const nuevoCondomino = new Condomino({
      tipoDocumento,
      numeroDocumento,
      nombreCompleto,
      fechaNacimiento: new Date(fechaNacimiento),
      correoElectronico,
      numeroTelefono,
      fechaEntrada: new Date(fechaEntrada),
      fechaSalida: fechaSalida ? new Date(fechaSalida) : null,
    });

    await nuevoCondomino.save();

    return NextResponse.json(
      {
        success: true,
        message: "Condomino agregado exitosamente.",
        condomino: nuevoCondomino,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error en /api/condominos:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return NextResponse.json(
        {
          success: false,
          message: `Ya existe un condomino con ${field}: ${value}`,
        },
        { status: 400 },
      );
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: messages.join(", "),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const criterio = searchParams.get("criterio");
    const busqueda = searchParams.get("busqueda");

    await conectarBaseDeDatos();

    let query = {};

    if (criterio && busqueda) {
      switch (criterio) {
        case "ID":
          if (busqueda.match(/^[0-9a-fA-F]{24}$/i)) {
            query._id = busqueda;
          } else {
            query.numeroDocumento = { $regex: busqueda, $options: "i" };
          }
          break;
        case "Nombre":
          query.nombreCompleto = { $regex: busqueda, $options: "i" };
          break;
        case "Todos":
          query.$or = [
            { nombreCompleto: { $regex: busqueda, $options: "i" } },
            { numeroDocumento: { $regex: busqueda, $options: "i" } },
          ];
          break;
      }
    }

    const condominos = await Condomino.find(query)
      .sort({ createdAt: -1 })
      .select(
        "nombreCompleto numeroDocumento tipoDocumento fechaEntrada fechaSalida activo",
      );

    return NextResponse.json({
      success: true,
      condominos,
    });
  } catch (error) {
    console.error("Error en GET /api/condominos:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
