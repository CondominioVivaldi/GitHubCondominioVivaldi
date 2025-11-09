//Enpoint para ver el usuario activo de la sesión
// src/app/api/usuarios/ver-usuario-activo/route.js
import { connectToDatabase } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const session = await getSession(request);
        if (!session || !session.userId) {
            return NextResponse.json({ message: "No autenticado" }, { status: 401 });
        }
        await connectToDatabase();
        const usuario = await Usuario.findById(session.userId).select("-contraseña").lean();
        if (!usuario) {
            return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }
        return NextResponse.json(usuario, { status: 200 });
    } catch (error) {
        console.error("Error al obtener el usuario activo:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}