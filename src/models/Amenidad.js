import mongoose from "mongoose";

const AmenidadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  requiereReserva: { type: String, enum: ["sí", "no"], required: true },
  tiempoMaximo: { type: String },
  imagenUrl: { type: String },
});

export default mongoose.models.Amenidad || mongoose.model("Amenidad", AmenidadSchema);