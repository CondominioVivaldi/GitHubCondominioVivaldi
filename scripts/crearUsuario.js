// scripts/crearUsuario.js
// Crea administrador y usuario tipo vivienda

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { conectarBaseDeDatos, desconectarBaseDeDatos } from "../src/lib/mongodb.js";
import Vivienda from "../src/modelos/Vivienda.js";
import Usuario from "../src/modelos/Usuario.js";

async function crearUsuarioAdministrador() {
  try {
    console.log("\n=== CREANDO USUARIO ADMINISTRADOR ===\n");
    
    // Verificar si ya existe un administrador
    const existeAdministrador = await Usuario.findOne({ tipoUsuario: "administrador" });
    
    if (existeAdministrador) {
      console.log("✓ Ya existe un usuario administrador.");
      console.log("  Usuario:", existeAdministrador.usuario);
      console.log("  Correo:", existeAdministrador.correoElectronico);
      return;
    }

    // Crear nuevo administrador
    const nuevoAdministrador = new Usuario({
      usuario: "admin1",
      correoElectronico: "condominioVivaldiG2@gmail.com",
      contraseña: "admin1",
      tipoUsuario: "administrador"
    });

    await nuevoAdministrador.save();
    
    console.log("✓ Usuario administrador creado exitosamente:");
    console.log("  Usuario:", nuevoAdministrador.usuario);
    console.log("  Correo:", nuevoAdministrador.correoElectronico);
    console.log("  Tipo:", nuevoAdministrador.tipoUsuario);
    console.log("  Contraseña hasheada:", nuevoAdministrador.contraseña.substring(0, 20) + "...");
    console.log("  Creado:", nuevoAdministrador.createdAt);
    
  } catch (error) {
    console.error("✗ Error al crear usuario administrador:", error.message);
  }
}

async function crearUsuarioVivienda() {
  try {
    console.log("\n=== CREANDO USUARIO TIPO VIVIENDA ===\n");
    
    // Buscar la vivienda creada
    const vivienda = await Vivienda.findOne({ idVivienda: "vivienda001" });
    
    if (!vivienda) {
      console.log("✗ No se encontró la vivienda con idVivienda: vivienda001");
      console.log("  Ejecuta primero crearVivienda.js");
      return;
    }
    
    console.log("✓ Vivienda encontrada:");
    console.log("  ID Vivienda:", vivienda.idVivienda);
    console.log("  Dirección:", vivienda.direccion);
    
    // Verificar si ya existe el usuario
    const existeUsuario = await Usuario.findOne({ usuario: vivienda.idVivienda });
    
    if (existeUsuario) {
      console.log("\n✓ Ya existe un usuario para esta vivienda:");
      console.log("  Usuario:", existeUsuario.usuario);
      console.log("  Correo:", existeUsuario.correoElectronico);
      return;
    }
    
    // Crear el usuario tipo vivienda
    const usuario = new Usuario({
      usuario: vivienda.idVivienda,
      correoElectronico: "vivienda001@correo.com",
      contraseña: "vivienda001",
      tipoUsuario: "vivienda",
      vivienda: vivienda._id
    });
    
    await usuario.save();
    console.log("\n✓ Usuario tipo vivienda creado exitosamente:");
    console.log("  Usuario:", usuario.usuario);
    console.log("  Correo:", usuario.correoElectronico);
    console.log("  Tipo:", usuario.tipoUsuario);
    console.log("  Vivienda ID:", usuario.vivienda);
    console.log("  Contraseña hasheada:", usuario.contraseña.substring(0, 20) + "...");
    
  } catch (error) {
    console.error("✗ Error al crear usuario tipo vivienda:", error.message);
  }
}

async function main() {
  try {
    await conectarBaseDeDatos();
    
    // Crear ambos tipos de usuarios
    await crearUsuarioAdministrador();
    await crearUsuarioVivienda();
    
    console.log("\n=== PROCESO COMPLETADO ===\n");
    
  } catch (error) {
    console.error("✗ Error general:", error.message);
  } finally {
    await desconectarBaseDeDatos();
  }
}

main();