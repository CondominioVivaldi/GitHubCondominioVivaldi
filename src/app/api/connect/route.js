//Endpoint para probar conexión a MongoDB

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    // Contar cuántos usuarios existen (prueba de lectura)
    const totalUsuarios = await User.countDocuments();

    return new Response(
      JSON.stringify({ ok: true, totalUsuarios }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500 }
    );
  }
}
