import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { token, password } = await req.json();

    // Buscar usuario con token válido
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Token inválido o expirado" }),
        { status: 400 }
      );
    }

    // Guardar nueva contraseña en texto plano
    user.contraseña = password;

    // Limpiar token para que no se reutilice
    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    await user.save();

    return new Response(
      JSON.stringify({ message: "Contraseña actualizada correctamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en reset-password:", error);
    return new Response(
      JSON.stringify({ message: "Error en el servidor", error: error.message }),
      { status: 500 }
    );
  }
}
/*
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { token, password } = await req.json();

    // Buscar usuario con token válido
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Token inválido o expirado" }),
        { status: 400 }
      );
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    user.contraseña = hashedPassword;

    // Limpiar token para que no se reutilice
    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    await user.save();

    return new Response(
      JSON.stringify({ message: "Contraseña actualizada correctamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en reset-password:", error);
    return new Response(
      JSON.stringify({ message: "Error en el servidor", error: error.message }),
      { status: 500 }
    );
  }
}
  */