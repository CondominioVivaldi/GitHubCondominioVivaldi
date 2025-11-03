//Esquema mongoose para las reservas de áreas comunes en el condominio
import mongoose from "mongoose";
const ReservaSchema = new mongoose.Schema({
    amenidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenidad",
        required: true,
    },
    vivienda: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vivienda",
        required: true,
    },
    fechaReserva: {
        type: Date,
        required: true,
    },
    horaInicio: {
        type: String,
        required: true,
    },
});

export default mongoose.models.Reserva || mongoose.model("Reserva", ReservaSchema);
