//Enpoint para craer un nuevo usuario vivienda
import { NextResponse } from "next/server";
import {conectarBaseDeDatos} from "@/lib/mongodb";
import UsuarioVivienda from "@/modelos/UsuarioVivienda";
export async function POST(request) {
  try {
    await conectarBaseDeDatos();
    const { usuario, contraseña, confirmarContraseña } = await request.json();

    if (!usuario || !contraseña || !confirmarContraseña) {
      return NextResponse.json(
        {
          success: false,
          message: "Todos los campos son obligatorios."
        },
        { status: 400 }
      );
    }
    if (contraseña !== confirmarContraseña) {
      return NextResponse.json(
        {
          success: false,
          message: "Las contraseñas no coinciden."
        },
        { status: 400 }
      );
    }
    const nuevoUsuarioVivienda = new UsuarioVivienda({
      usuario,
      contraseña,
      tipoUsuario: "vivienda"
    });;
    await nuevoUsuarioVivienda.save();
    return NextResponse.json(
      {
        success: true,
        message: "Usuario vivienda creado exitosamente."
      },
      { status: 201 }
    );
  }
  catch (error) {
    console.error("Error en /api/usuarios/crear-usuario:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al crear el usuario vivienda."
      },
      { status: 500 }
    );
  }
}