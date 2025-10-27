// scripts/crearVivienda.js

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { conectarBaseDeDatos, desconectarBaseDeDatos } from "../src/lib/mongodb.js";
import Condomino from "../src/modelos/Condomino.js";
import Vivienda from "../src/modelos/Vivienda.js";

async function crearVivienda() {
  try {
    await conectarBaseDeDatos();
    
    // Buscar los condóminos por nombre
    const condomino1 = await Condomino.findOne({ nombreCompleto: "Nombre Completo Prueba Uno" });
    const condomino2 = await Condomino.findOne({ nombreCompleto: "Nombre Completo Prueba Dos" });
    
    if (!condomino1 || !condomino2) {
      throw new Error("No se encontraron los condóminos. Ejecuta primero crearCondomino.js");
    }
    
    console.log("✓ Condóminos encontrados:");
    console.log("  - Condómino 1:", condomino1.nombreCompleto, "ID:", condomino1._id);
    console.log("  - Condómino 2:", condomino2.nombreCompleto, "ID:", condomino2._id);
    
    // Crear la vivienda
    const vivienda = new Vivienda({
      idVivienda: "vivienda001",
      direccion: "Calle Principal #123, Zona 10",
      modeloCasa: "Modelo A",
      cantidadPersonas: 2,
      condominosVinculados: [
        {
          condominoId: condomino1._id,
          tipoInquilino: "Propietario"
        },
        {
          condominoId: condomino2._id,
          tipoInquilino: "Arrendatario"
        }
      ]
    });
    
    await vivienda.save();
    console.log("\n✓ Vivienda creada exitosamente:");
    console.log("  ID Vivienda:", vivienda.idVivienda);
    console.log("  Dirección:", vivienda.direccion);
    console.log("  Condóminos vinculados:", vivienda.condominosVinculados.length);
    
  } catch (error) {
    console.error("Error al crear vivienda:", error);
  } finally {
    await desconectarBaseDeDatos();
  }
}

crearVivienda();