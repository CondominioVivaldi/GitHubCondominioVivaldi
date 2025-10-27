// src/lib/mongodb.js
// Conexión a MongoDB usando Mongoose

import mongoose from "mongoose";

let isConnected = false;

export async function conectarBaseDeDatos() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("No está definida la variable MONGODB_URI.");
    throw new Error("No está definida la variable MONGODB_URI.");
  }

  if (isConnected) {
    console.log("Ya existe una conexión activa a MongoDB.");
    return;
  }

  try {
    // Base de datos creada en MongoDB Atlas
    const db = await mongoose.connect(uri, {
      dbName: "bdCondominioVivaldi"
    });
    
    isConnected = true;
    console.log(`Conectado correctamente a MongoDB Atlas`);
    console.log(`Base de datos: ${db.connection.name}`);
  } catch (error) {
    console.error("Error al conectar con MongoDB Atlas:", error);
    throw error;
  }
}

// Función para desconectar (útil en scripts)
export async function desconectarBaseDeDatos() {
  if (!isConnected) {
    return;
  }
  
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("Desconectado de MongoDB Atlas");
  } catch (error) {
    console.error("Error al desconectar de MongoDB Atlas:", error);
    throw error;
  }
}
