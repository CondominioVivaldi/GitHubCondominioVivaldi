// src/app/api/usuarios/ver-usuarios/route.js

import { NextResponse } from 'next/server';
import { conectarBaseDeDatos } from '@/lib/mongodb';
import Usuario from '@/modelos/Usuario'; // Importamos el modelo correcto
import Vivienda from '@/modelos/Vivienda'; // Necesario para la población
export async function GET() {
  try {
    await conectarBaseDeDatos();

    // Buscar usuarios de tipo 'vivienda' y popular el campo 'vivienda'
    const usuariosVivienda = await Usuario.find({ tipoUsuario: 'vivienda' })
      .populate({
        path: 'vivienda',
        model: Vivienda,
        select: 'idVivienda' // Solo necesitamos el idVivienda
      })
      .exec();

    // Mapear el resultado para que el frontend obtenga solo la información relevante
    const usuariosConIdVivienda = usuariosVivienda
      .filter(usuario => usuario.vivienda && usuario.vivienda.idVivienda) // Asegurarse de que la vivienda existe
      .map(usuario => ({
        _id: usuario._id,
        idVivienda: usuario.vivienda.idVivienda,
      }));
      
    return NextResponse.json(
      {
        success: true,
        usuariosConIdVivienda: usuariosConIdVivienda // Nombre de la propiedad más claro
      },
      { status: 200 }
    );
  }
    catch (error) {
    console.error('Error en /api/usuarios/ver-usuarios:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener los usuarios vivienda.'
      },
      { status: 500 }
    );
    }
}
