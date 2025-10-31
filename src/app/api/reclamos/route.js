import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reclamo from "@/modelos/Reclamo";

export async function GET(req) {
  await conectarBaseDeDatos();
  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado");

  const filtro = estado ? { estado } : {};
  const reclamos = await Reclamo.find(filtro)
    .populate("creadoPor", "usuario") // muestra datos del usuario
    .sort({ createdAt: -1 });

  return NextResponse.json(reclamos);
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
    const nuevo = await Reclamo.create({ titulo, descripcion, creadoPor });
    return NextResponse.json(
      { message: "Reclamo creado correctamente", reclamo: nuevo },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error al crear reclamo:", error);
    return NextResponse.json(
      { error: "Error interno al crear reclamo." },
      { status: 500 }
    );
  }
}