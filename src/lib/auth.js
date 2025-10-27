// src/lib/auth.js
// Crear y verificar tokens JWT compatible con Edge Runtime usando jose

import { SignJWT, jwtVerify } from "jose";

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