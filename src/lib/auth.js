// src/lib/auth.js

// Crear y verificar tokens JWT compatible con Edge Runtime usando jose

import { SignJWT, jwtVerify } from "jose";
// NOTA: 'headers' ya NO se importa ni se usa aquí.

const SECRET = new TextEncoder().encode(
  process.env.CONTRASENNA_JWT || "clave_ultra_segura_123"
);

// Genera un JWT con 1 hora de duración
export async function generarToken(usuario) {
  const token = await new SignJWT({
    id: usuario._id.toString(),
    tipoUsuario: usuario.tipoUsuario,
    usuario: usuario.usuario,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // 1 hora
    .sign(SECRET);

  console.log("Token generado exitosamente");
  return token;
}

// Verifica y decodifica el token (Edge-compatible)
export async function verificarToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    console.log("Token válido para usuario:", payload.usuario);
    return payload;
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    return null;
  }
}

/**
 * Función centralizada para verificar la autenticación y permisos en rutas API.
 * * @param {string | null} token El string del token JWT (o null si no existe).
 * @returns {object} { status, userId, type }
 */
export async function verificarAutenticacion(token) {
    if (!token) {
        return { status: 401, message: "Token no proporcionado." };
    }
    
    // 1. Verificar el token
    const payload = await verificarToken(token);

    if (!payload) {
        return { status: 401, message: "Token inválido o expirado." };
    }
    
    // 2. Devolver los datos del usuario autenticado
    return { 
        status: 200, 
        userId: payload.id, 
        type: payload.tipoUsuario,
        message: "Usuario autenticado."
    };
}