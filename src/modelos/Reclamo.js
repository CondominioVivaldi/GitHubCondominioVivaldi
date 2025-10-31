import mongoose from "mongoose";

const ReclamoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    estado: {
      type: String,
      enum: ["Sin leer", "En proceso", "Finalizado"], // estados definidos
      default: "Sin leer", // al crear siempre inicia como "sin leer"
    },
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaResolucion: { type: Date },
    respuestaAdmin: { type: String },
  },
  { timestamps: true } // agrega createdAt y updatedAt automáticamente
);

export default mongoose.models.Reclamo || mongoose.model("Reclamo", ReclamoSchema);