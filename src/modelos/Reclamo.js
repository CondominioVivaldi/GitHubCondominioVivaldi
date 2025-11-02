import mongoose from "mongoose";

const ReclamoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    estado: {
      type: String,
      enum: ["Sin leer", "En proceso", "Finalizado"],
      default: "Sin leer",
    },
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    vivienda: { type: mongoose.Schema.Types.ObjectId, ref: "Vivienda" }, // ✅ nuevo campo
    fechaCreacion: { type: Date, default: Date.now },
    fechaResolucion: { type: Date },
    conversacion: [
      {
        autor: { type: String, enum: ["usuario", "admin"], required: true },
        mensaje: { type: String, required: true },
        fecha: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Reclamo || mongoose.model("Reclamo", ReclamoSchema);