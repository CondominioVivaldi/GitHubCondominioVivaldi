/*import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase() {
  // Usa Atlas si existe, sino usa la base local
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/condimino";

  if (isConnected) {
    console.log("🟢 Ya existe una conexión activa a MongoDB.");
    return;
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ Conectado correctamente a MongoDB:", uri.includes("127.0.0.1") ? "LOCAL" : "ATLAS");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
    throw error;
  }
}
*/
import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("⚠️ No está definida la variable MONGODB_URI.");
    throw new Error("⚠️ No está definida la variable MONGODB_URI.");
  }

  if (isConnected) {
    console.log("Ya existe una conexión activa a MongoDB.");
    return;
  }

  try {
    const db = await mongoose.connect(uri);
    isConnected = true;
    console.log("✅ Conectado correctamente a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB Atlas:", error);
    throw error;
  }
}