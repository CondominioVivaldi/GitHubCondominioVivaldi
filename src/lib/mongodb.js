// Conexión a MongoDB usando Mongoose
import mongoose from "mongoose";

// 'isConnected' sigue aquí por compatibilidad con tu función 'desconectarBaseDeDatos',
// pero la lógica principal usará 'readyState'.
let isConnected = false;

export async function conectarBaseDeDatos() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("No está definida la variable MONGODB_URI.");
    throw new Error("No está definida la variable MONGODB_URI.");
  }

  // --- INICIO DE LA MODIFICACIÓN ---
  // Revisar el estado de la conexión de Mongoose para prevenir conexiones múltiples
  // 1 = connected (conectado)
  // 2 = connecting (conectando)

  // Si ya está conectado (1), salimos.
  if (mongoose.connection.readyState === 1) {
    console.log("Ya existe una conexión activa a MongoDB (readyState 1).");
    isConnected = true; // Sincronizamos tu bandera
    return;
  }

  // Si está en proceso de conexión (2), esperamos a que termine
  // en lugar de intentar conectar de nuevo (esto previene la condición de carrera).
  if (mongoose.connection.readyState === 2) {
    console.log("Conexión en progreso (readyState 2)... esperando.");
    // Esperamos a que el evento 'open' (conexión exitosa) se dispare
    await new Promise(resolve => mongoose.connection.once('open', () => {
        console.log("Conexión (en espera) completada.");
        resolve();
    }));
    isConnected = true; // Sincronizamos tu bandera
    return;
  }
  // --- FIN DE LA MODIFICACIÓN ---

  // Si Mongoose está desconectado (0) o desconectándose (3),
  // procedemos a conectar.
  try {
    // Base de datos creada en MongoDB Atlas
    const db = await mongoose.connect(uri, {
      dbName: "bdCondominioVivaldi"
    });
    
    isConnected = true;
    console.log(`Conectado correctamente a MongoDB Atlas`);
    console.log(`Base de datos: ${db.connection.name}`);
  } catch (error) {
    isConnected = false; // Aseguramos que la bandera esté correcta si falla
    console.error("Error al conectar con MongoDB Atlas:", error);
    throw error;
  }
}

// Función para desconectar (útil en scripts)
// Esta función no necesita cambios, ya que depende de tu bandera 'isConnected'.
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