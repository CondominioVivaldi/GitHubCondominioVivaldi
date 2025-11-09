// src/app/api/usuarios/buscar/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Usuario from "@/modelos/Usuario";

/**
 * Maneja la búsqueda de usuarios para autocompletar.
 * Busca usuarios cuyo nombre de 'usuario' comience con el término proporcionado.
 *
 * @param {Request} request La solicitud Next.js.
 * @returns {NextResponse} Una lista de usuarios que coinciden, limitada a 10.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term");

    // Si el término es muy corto o no existe, no buscamos.
    if (!term || term.length < 2) {
      return NextResponse.json([]);
    }

    await conectarBaseDeDatos();

    // Crear la expresión regular para buscar usuarios que COMIENCEN con el término (case-insensitive)
    // ^${term} -> significa "que comience con el término"
    // 'i' -> significa "ignorar mayúsculas/minúsculas"
    const regex = new RegExp(`^${term}`, "i");

    // **MODIFICACIÓN:** Usar el operador $regex explícitamente para asegurar la búsqueda por prefijo
    const usuarios = await Usuario.find({
      usuario: { $regex: regex }, // Garantiza que todos los usuarios que inician con 'term' sean devueltos
    })
      .select("usuario _id") // Solo necesitamos el nombre de usuario y su ID
      .limit(10) // Limitar los resultados a 10 para un autocompletado rápido
      .lean(); // .lean() para un objeto JS plano y más rápido

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error en GET /api/usuarios/buscar:", error);
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}