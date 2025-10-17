import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { usuario, contraseña } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ usuario });
    if (!user || user.contraseña !== contraseña) {
      return new Response(
        JSON.stringify({ message: "Usuario o contraseña incorrectos" }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Inicio de sesión exitoso",
        tipoUsuario: user.tipoUsuario,
        nombre: user.usuario,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en login:", error);
    return new Response(
      JSON.stringify({ message: "Error en el servidor", error: error.message }),
      { status: 500 }
    );
  }
}