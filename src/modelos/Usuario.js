// src/modelos/Usuario.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UsuarioSchema = new mongoose.Schema({
  
  usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    set: function(v) {
      return v.replace(/\s+/g, '');
    }
  },
  correoElectronico: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    set: function(v) {
      return v.replace(/\s+/g, '');
    },
    validate: {
      validator: function(v) {
        // Regex para validación de correo
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Formato de correo electrónico inválido"
    }
  },
  contraseña: {
    type: String,
    required: true
  },
  tipoUsuario: {
    type: String,
    enum: ["vivienda", "administrador"],
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  vivienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vivienda",
    required: function() {
      return this.tipoUsuario === "vivienda";
    }
  }
}, {
  timestamps: true,
  collection: "usuarios"
});

// Middleware para hashear la contraseña antes de guardar
UsuarioSchema.pre("save", async function(next) {
  if (!this.isModified("contraseña")) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UsuarioSchema.methods.compararContraseña = async function(contraseña) {
  return await bcrypt.compare(contraseña, this.contraseña);
};

// Índice redundante porque ya existe unique
// UsuarioSchema.index({ usuario: 1 });

// Evitar duplicación del modelo en hot-reload
export default mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);