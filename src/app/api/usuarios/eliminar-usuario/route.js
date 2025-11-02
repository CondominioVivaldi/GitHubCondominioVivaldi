//Endpoint para eliminar un usuario por su ID de vivienda
import { NextResponse } from "next/server";
import {conectarBaseDeDatos} from "@/lib/mongodb";
import UsuarioVivienda from "@/modelos/UsuarioVivienda";

export async function DELETE(request) {
  try {
    await conectarBaseDeDatos();
    const { viviendaId } = await request.json();
    const usuarioEliminado = await UsuarioVivienda.findOneAndDelete({ viviendaId });
    if (!usuarioEliminado) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Usuario eliminado exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return NextResponse.json(
      { error: "Error al eliminar el usuario." },
      { status: 500 }
    );
  }
}