// src/app/api/usuarios/eliminar-usuario/route.js

//Endpoint para eliminar un usuario por su vivienda
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";
import Vivienda from "@/modelos/Vivienda";
export async function DELETE(request) {
  try {
    await conectarBaseDeDatos();
    const { idVivienda } = await request.json();
    // Buscar la vivienda por idVivienda
    const vivienda = await Vivienda.findOne({ idVivienda });
    if (!vivienda) {
      return new Response(
        JSON.stringify({ mensaje: "La vivienda no existe." }),
        { status: 400 }
      );
    }
    // Eliminar el usuario asociado a la vivienda
    const resultadoEliminacion = await Usuario.deleteOne({ vivienda: vivienda._id });
    if (resultadoEliminacion.deletedCount === 0) {
      return new Response(
        JSON.stringify({ mensaje: "No se encontró un usuario asociado a la vivienda." }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({ mensaje: "Usuario eliminado exitosamente." }),
      { status: 200 }
    );
  }
  catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return new Response(
      JSON.stringify({ mensaje: "Error interno del servidor." }),
      { status: 500 }
    );
  }
}