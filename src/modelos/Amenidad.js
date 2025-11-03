import mongoose from "mongoose";

const AmenidadSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    requiereReserva: {
      type: String,
      enum: ["sí", "no"],
      required: true,
    },
    tiempoMaximo: {
      type: String,
      required: true,
      trim: true,
    },
    imagenUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: false,
    collection: "amenidades",
  },
);

export default mongoose.models.Amenidad ||
  mongoose.model("Amenidad", AmenidadSchema);
