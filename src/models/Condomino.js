//Modelo de datos del condomino (mongoose)
import mongoose from "mongoose";
const CondominoSchema = new mongoose.Schema({
    tipoDocumento: { type: String, enum: ["DPI", "Pasaporte"], required: true },
    numeroDocumento: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    correoElectronico: { type: String, required: true, unique: true },
    numeroTelefono: { type: String, required: true },
    fechaEntrada: { type: Date, required: true },
    fechaSalida: { type: Date },
}, { timestamps: true });

// Evitar recompilación del modelo en desarrollo
delete mongoose.models.Condomino;

// Si el modelo ya fue creado (por recarga en desarrollo), reutilizarlo
export default mongoose.models.Condomino || mongoose.model("Condomino", CondominoSchema);