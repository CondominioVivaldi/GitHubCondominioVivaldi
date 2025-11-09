// src/modelos/Reserva.js

import mongoose from "mongoose";

const ReservaSchema = new mongoose.Schema(
  {
    // ID de la amenidad reservada (referencia a la colección Amenidad)
    amenidadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenidad",
      required: [true, "El ID de la amenidad es obligatorio."],
    },
    // Fecha en formato 'YYYY-MM-DD'
    date: {
      type: String, 
      required: [true, "La fecha de la reserva es obligatoria."],
    },
    // ID del horario (Ej: 'h8', 'h15')
    hourId: {
      type: String, 
      required: [true, "El ID del horario es obligatorio."],
    },
    // Hora en formato legible (Ej: '08:00 - 09:00')
    hourTime: {
        type: String,
        required: [true, "La hora de inicio/fin es obligatoria."],
    },
    // ID del usuario condómino que utiliza la reserva
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", 
      required: [true, "El ID del usuario que reserva es obligatorio."],
    },
    // Nombre del usuario condómino que utiliza la reserva
    userName: {
        type: String,
        required: [true, "El nombre del usuario que reserva es obligatorio."],
    },
    // ID del usuario administrador que creó la reserva (se obtiene del token JWT)
    reservedByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El ID del administrador que creó la reserva es obligatorio."],
    },
  },
  { 
    timestamps: true,
    // Aseguramos que la colección se llame 'reservas' si el modelo es 'Reserva'
    collection: 'reservas' 
  } 
);

// Índice compuesto único para prevenir que una amenidad se reserve a la misma hora/día
ReservaSchema.index({ amenidadId: 1, date: 1, hourId: 1 }, { unique: true });

// Utilizamos la lógica estándar para evitar redefinir el modelo en hot-reload
const Reserva =
  mongoose.models.Reserva || mongoose.model("Reserva", ReservaSchema);

export default Reserva;