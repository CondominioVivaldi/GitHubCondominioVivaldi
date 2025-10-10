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
