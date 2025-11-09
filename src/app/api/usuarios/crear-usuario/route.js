// src/app/api/usuarios/crear-usuario/route.js

//Endpoint para crear un nuevo usuario
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";
import Vivienda from "@/modelos/Vivienda";
// El uso de Condomino y bcrypt está implícito si ya se usaba antes
// import Condomino from "@/modelos/Condomino"; 
// import bcrypt from "bcrypt"; 

export async function POST(request) {
  try {
    await conectarBaseDeDatos();
    const { usuario, contraseña, vivienda, correoElectronico } = await request.json();
    
    // 1. Verificar si el nombre de usuario (idVivienda) ya existe
    const usuarioExistente = await Usuario.findOne({ usuario });
    if (usuarioExistente) {
      return new Response(
        JSON.stringify({ mensaje: "El nombre de usuario ya está en uso." }),
        { status: 400 }
      );
    }
    
    // 2. Verificar que la vivienda exista
    const viviendaExistente = await Vivienda.findById(vivienda);
    if (!viviendaExistente) {
      return new Response(
        JSON.stringify({ mensaje: "La vivienda no existe." }),
        { status: 400 }
      );
    }

    // 3. Verificar si la vivienda ya tiene un usuario asociado
    const usuarioViviendaExistente = await Usuario.findOne({ vivienda });
    if (usuarioViviendaExistente) {
      return new Response(
        JSON.stringify({ mensaje: "La vivienda ya tiene un usuario asociado." }),
        { status: 400 }
      );
    }

    // 4. Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      usuario,
      contraseña,
      tipoUsuario: "vivienda",
      vivienda: viviendaExistente._id,
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
