//Endpoint para agregar un nuevo condomino a la base de datos

import { connectToDatabase } from "@/lib/mongodb";
import Condomino from "@/models/Condomino";
export async function POST(request) {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    // Obtener datos del cuerpo de la solicitud
    const data = await request.json();
    // Crear un nuevo documento de condomino
    const nuevoCondomino = new Condomino(data);
    // Guardar el nuevo condomino en la base de datos
    await nuevoCondomino.save();
    return new Response(
      JSON.stringify({ ok: true, condomino: nuevoCondomino }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500 }
    );
  }
}