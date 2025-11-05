// src/app/api/viviendas/buscar-viviendas/route.js

//Endpoint para obtener todas las viviendas
import { NextResponse } from 'next/server';
import { conectarBaseDeDatos } from '@/lib/mongodb';
import Vivienda from '@/modelos/Vivienda';
export async function GET() {
  try {
    await conectarBaseDeDatos();
    const viviendas = await Vivienda.find({});
    return NextResponse.json(
      {
        success: true,
        viviendas: viviendas
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en /api/viviendas/buscar-viviendas:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener las viviendas.'
      },
      { status: 500 }
    );
    }
}