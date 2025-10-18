import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import Amenidad from "@/models/Amenidad";

const uploadDir = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  await fs.mkdir(uploadDir, { recursive: true });
}

export async function GET() {
  await connectToDatabase();
  const list = await Amenidad.find().sort({ createdAt: -1 });
  return NextResponse.json(list);
}

export async function POST(req) {
  await ensureUploadDir();
  await connectToDatabase();

  const formData = await req.formData();
  const nombre = formData.get("nombre");
  const requiereReserva = formData.get("requiereReserva");
  const tiempoMaximo = formData.get("tiempoMaximo");
  const imagen = formData.get("imagen");

  if (!nombre || !requiereReserva || !tiempoMaximo || !imagen) {
    return NextResponse.json(
      { error: "Todos los campos son obligatorios." },
      { status: 400 }
    );
  }

  // Guardar imagen en /public/uploads
  const arrayBuffer = await imagen.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = (imagen.name?.split(".").pop() || "jpg").toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  // Crear y guardar en MongoDB
  const nueva = await Amenidad.create({
    nombre,
    requiereReserva,
    tiempoMaximo,
    imagenUrl: `/uploads/${filename}`,
  });

  return NextResponse.json(
    { message: "Amenidad guardada en MongoDB", amenidad: nueva },
    { status: 201 }
  );
}