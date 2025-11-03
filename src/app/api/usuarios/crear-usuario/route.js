// src/app/api/usuarios/crear-usuario/route.js

//Endpoint para crear un nuevo usuario
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";
import Vivienda from "@/modelos/Vivienda";
import Condomino from "@/modelos/Condomino";
import bcrypt from "bcrypt";
export async function POST(request) {
  try {
    await conectarBaseDeDatos();
    const { usuario, contraseña, vivienda, correoElectronico } = await request.json();
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ usuario });
    if (usuarioExistente) {
      return new Response(
        JSON.stringify({ mensaje: "El nombre de usuario ya está en uso." }),
        { status: 400 }
      );
    }
    // Verificar si la vivienda ya tiene un usuario asociado
    const viviendaExistente = await Vivienda.findById(vivienda);
    if (!viviendaExistente) {
      return new Response(
        JSON.stringify({ mensaje: "La vivienda no existe." }),
        { status: 400 }
      );
    }
    const usuarioViviendaExistente = await Usuario.findOne({ vivienda });
    if (usuarioViviendaExistente) {
      return new Response(
        JSON.stringify({ mensaje: "La vivienda ya tiene un usuario asociado." }),
        { status: 400 }
      );
    }
    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      usuario,
      contraseña,
      tipoUsuario: "vivienda",
      vivienda,
      correoElectronico: correoElectronico
    });
    await nuevoUsuario.save();
    return new Response(
      JSON.stringify({ mensaje: "Usuario creado exitosamente." }),
      { status: 201 }
    );
  }
  catch (error) {
    console.error("Error al crear el usuario:", error);
    return new Response(
      JSON.stringify({ mensaje: "Error interno del servidor." }),
      { status: 500 }
    );
  }
}