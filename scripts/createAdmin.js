//Importa dotenv primero, ANTES de cualquier otro import
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// Luego los demás imports
import { connectToDatabase } from "../src/lib/mongodb.js";
import User from "../src/models/User.js";

async function crearAdmin() {
  await connectToDatabase();

  const existeAdmin = await User.findOne({ tipoUsuario: "admin" });
  if (existeAdmin) {
    console.log("✅ Ya existe un usuario administrador.");
    process.exit(0);
  }

  const nuevoAdmin = new User({
    usuario: "administrador",
    correo: "condominioVivaldiG2@gmail.com",
    contraseña: "admin1234",
    tipoUsuario: "admin"
  });

  await nuevoAdmin.save();
  console.log("✅ Usuario administrador creado con éxito.");
  process.exit(0);
}

crearAdmin();