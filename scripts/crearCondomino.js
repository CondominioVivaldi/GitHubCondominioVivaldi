// scripts/crearCondomino.js

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { conectarBaseDeDatos, desconectarBaseDeDatos } from "../src/lib/mongodb.js";
import Condomino from "../src/modelos/Condomino.js";

async function crearCondominos() {
  try {
    await conectarBaseDeDatos();
    
    // Condómino 1
    const condomino1 = new Condomino({
      tipoDocumento: "DPI",
      numeroDocumento: "1234567890123",
      nombreCompleto: "Nombre Completo Prueba Uno",
      fechaNacimiento: new Date("1985-03-15"),
      correoElectronico: "condomino1@prueba.com",
      numeroTelefono: "12345678",
      fechaEntrada: new Date("2024-01-15"),
      activo: true
    });
    
    await condomino1.save();
    console.log("✓ Condómino 1 creado:", condomino1.nombreCompleto);
    console.log("  ID:", condomino1._id);
    
    // Condómino 2
    const condomino2 = new Condomino({
      tipoDocumento: "DPI",
      numeroDocumento: "9876543210987",
      nombreCompleto: "Nombre Completo Prueba Dos",
      fechaNacimiento: new Date("1990-07-22"),
      correoElectronico: "condomino2@prueba.com",
      numeroTelefono: "87654321",
      fechaEntrada: new Date("2024-02-10"),
      activo: true
    });
    
    await condomino2.save();
    console.log("✓ Condómino 2 creado:", condomino2.nombreCompleto);
    console.log("  ID:", condomino2._id);
    
    console.log("\n✓ Ambos condóminos creados exitosamente");
    
  } catch (error) {
    console.error("Error al crear condóminos:", error);
  } finally {
    await desconectarBaseDeDatos();
  }
}

crearCondominos();