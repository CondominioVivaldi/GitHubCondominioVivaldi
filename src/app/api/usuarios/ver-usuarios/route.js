//Endpoint para ver todos los usuarios vivienda
import { NextResponse } from 'next/server';
import { conectarBaseDeDatos } from '@/lib/mongodb';
import UsuarioVivienda from '@/modelos/UsuarioVivienda';
export async function GET() {
  try {
    await conectarBaseDeDatos();
    const usuariosVivienda = await UsuarioVivienda.find({}).populate('usuario');
    return NextResponse.json(
      {
        success: true,
        usuariosVivienda: usuariosVivienda
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