//Esquema Mongoose para usuarios

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  tipoUsuario: { type: String, enum: ["admin", "vivienda"], required: true },
}, { timestamps: true });

// Si el modelo ya fue creado (por recarga en desarrollo), reutilizarlo
export default mongoose.models.User || mongoose.model("User", UserSchema);
