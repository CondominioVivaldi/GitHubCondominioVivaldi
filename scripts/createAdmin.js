// Crea un usuario administrador y lo agrega MongoDB

import dotenv from "dotenv"; //Importa dotenv primero
dotenv.config({ path: ".env.local" });
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
