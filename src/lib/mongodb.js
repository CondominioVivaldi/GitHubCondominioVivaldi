// src/lib/mongodb.js

import mongoose from "mongoose";

// Constante para la URI (se asume que se define en .env.local)
const URI = process.env.MONGODB_URI;

// --- Implementación del Patrón de Caché Global para Next.js ---
// Esta es la parte crítica que asegura que la conexión sea un singleton.
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Bandera de estado original (mantenida por compatibilidad con tu sistema)
let isConnected = false; 

/**
 * Función para conectar o reutilizar la conexión existente.
 * @returns {Promise<mongoose.Connection>} La conexión activa a MongoDB.
 */
export async function conectarBaseDeDatos() {
  const uri = URI;

  if (!uri) {
    console.error("No está definida la variable MONGODB_URI.");
    throw new Error("No está definida la variable MONGODB_URI.");
  }
  
  // 1. FAST EXIT: Si la conexión ya está en caché o ya existe por Mongoose (readyState 1)
  if (cached.conn || mongoose.connection.readyState === 1) {
    cached.conn = cached.conn || mongoose.connection; // Aseguramos que el caché esté lleno
    console.log("Ya existe una conexión activa a MongoDB (REUTILIZADA).");
    isConnected = true; 
    return cached.conn; // Retorna la conexión existente
  }

  // 2. CREAR/REUTILIZAR PROMESA: Si no hay promesa en caché, la creamos
  if (!cached.promise) {
    console.log("Creando nueva promesa de conexión...");
    
    const opts = {
      dbName: "bdCondominioVivaldi",
      // Otras opciones de configuración pueden ir aquí
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`Conectado correctamente a MongoDB Atlas`);
      console.log(`Base de datos: ${mongooseInstance.connection.name}`);
      return mongooseInstance;
    });
  }
  
  // 3. ESPERAR PROMESA: Esperamos a que la promesa (nueva o existente) se resuelva.
  try {
    cached.conn = await cached.promise;
    isConnected = true;
    return cached.conn;
  } catch (error) {
    cached.promise = null; 
    isConnected = false; 
    console.error("Error al conectar con MongoDB Atlas:", error);
    throw error;
  }
}

// Función para desconectar (mantenida por compatibilidad)
export async function desconectarBaseDeDatos() {
    // Verifica si la conexión está marcada como activa o si Mongoose lo indica
    if (!isConnected && mongoose.connection.readyState !== 1) {
        return;
    }
    
    try {
        await mongoose.disconnect();
        // Limpiar el caché solo si la desconexión fue exitosa
        if (global.mongoose) {
             global.mongoose.conn = null;
             global.mongoose.promise = null;
        }
        isConnected = false;
        console.log("Desconectado de MongoDB Atlas");
    } catch (error) {
        console.error("Error al desconectar de MongoDB Atlas:", error);
        throw error;
    }
}