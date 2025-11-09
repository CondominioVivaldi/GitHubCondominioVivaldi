// src/modelos/Vivienda.js

import mongoose from "mongoose";

const ViviendaSchema = new mongoose.Schema({
  
  idVivienda: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    set: function(v) {
      return v.replace(/\s+/g, '').toLowerCase();
    }
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  modeloCasa: {
    type: String,
    required: false,
    trim: true,
    default: null
  },
  cantidadPersonas: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        // Debe ser un número entero positivo
        return Number.isInteger(v) && v > 0;
      },
      message: "La cantidad de personas debe ser un número entero positivo"
    }
  },
  condominosVinculados: {
    type: [{
      condominoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Condomino",
        required: true
      },
      tipoInquilino: {
        type: String,
        enum: ["Propietario", "Arrendatario", "Ocupante"],
        required: true
      }
    }],
    default: [],
    validate: {
      validator: function(v) {
        // Validar que no haya condóminos duplicados
        const ids = v.map(item => item.condominoId.toString());
        return ids.length === new Set(ids).size;
      },
      message: "No se puede vincular el mismo condómino más de una vez"
    }
  }
}, {
  timestamps: true,
  collection: "viviendas"
});

// No crear esto porque es redundante porque existe unique
// ViviendaSchema.index({ idVivienda: 1 });

// Índice para búsquedas por condóminos vinculados
ViviendaSchema.index({ "condominosVinculados.condominoId": 1 });

// Evitar duplicación del modelo en hot-reload
export default mongoose.models.Vivienda || mongoose.model("Vivienda", ViviendaSchema);