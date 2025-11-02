// src/modelos/UsuarioVivienda.js

import mongoose from "mongoose";
const UsuarioViviendaSchema = new mongoose.Schema({
    viviendaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Vivienda",
    unique: true
    },
    contraseña:{
    type: String,
    required: true
    },
    tipoUsuario:{
    type: String,
    enum: ["vivienda"],
    required: true
    }
});

export default mongoose.models.UsuarioVivienda || mongoose.model("UsuarioVivienda", UsuarioViviendaSchema);



