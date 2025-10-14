import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { sendResetEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { usuario } = await req.json();

    const user = await User.findOne({ usuario });
    if (!user) {
      return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 });
    }

    // Generar token simple (no seguro, solo para pruebas)
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000; // 1 hora
    await user.save();

    await sendResetEmail(user.correo, token);

    return new Response(JSON.stringify({ message: "Correo enviado" }), { status: 200 });
  } catch (error) {
    console.error("❌ Error en recuperación:", error);
    return new Response(JSON.stringify({ message: "Error en el servidor" }), { status: 500 });
  }
}
/* import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { sendResetEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { usuario } = await req.json();

    const user = await User.findOne({ usuario });
    if (!user) {
      return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000; // 1 hora
    await user.save();

    await sendResetEmail(user.correo, token);

    return new Response(JSON.stringify({ message: "Correo enviado" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error en el servidor" }), { status: 500 });
  }
}
  */