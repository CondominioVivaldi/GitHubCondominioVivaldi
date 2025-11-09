// src/modelos/Condomino.js

import mongoose from "mongoose";

const CondominoSchema = new mongoose.Schema({
  
  tipoDocumento: {
    type: String,
    enum: ["DPI", "Pasaporte"],
    required: true
  },
  numeroDocumento: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    set: function(v) {
      return v.replace(/\s+/g, '');
    },
    validate: {
      validator: function(v) {
        // Validar que sea 13 o 9 dígitos (después de eliminar espacios)
        const sinEspacios = v.replace(/\s+/g, '');
        return /^\d{9}$|^\d{13}$/.test(sinEspacios);
      },
      message: "DPI son 13 dígitos y Pasaporte 9 dígitos"
    }
  },
  nombreCompleto: {
    type: String,
    required: true,
    trim: true
  },
  fechaNacimiento: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v < new Date();
      },
      message: "La fecha de nacimiento debe ser una fecha pasada"
    }
  },
  correoElectronico: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    set: function(v) {
      return v.replace(/\s+/g, '');
    },
    validate: {
      validator: function(v) {
        // Regex más robusta para validación de correo
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Formato de correo electrónico inválido"
    }
  },
  numeroTelefono: {
    type: String,
    required: true,
    trim: true,
    set: function(v) {
      return v.replace(/\s+/g, '');
    }
  },
  fechaEntrada: {
    type: Date,
    required: true
  },
  fechaSalida: {
    type: Date,
    default: null,
    validate: {
      validator: function(v) {
        if (v === null || v === undefined) return true;
        return v > this.fechaEntrada;
      },
      message: "La fecha de salida debe ser posterior a la fecha de entrada"
    }
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: "condominos"
});

// Evitar duplicación del modelo en hot-reload
export default mongoose.models.Condomino || mongoose.model("Condomino", CondominoSchema);
