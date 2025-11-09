// src/lib/enviarCorreoRestablecerPass.js
// Función específica para el restablecimiento de contraseña.

import jwt from "jsonwebtoken";
import { enviarCorreo } from "./enviarCorreo";

export async function enviarCorreoRestablecerPass(usuario, correo) {
  if (!process.env.CONTRASENNA_JWT || !process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error("Faltan variables de entorno necesarias para el envío de correo.");
  }

  // Crear token temporal (10 minutos)
  const token = jwt.sign({ usuario }, process.env.CONTRASENNA_JWT, {
    expiresIn: "10m",
  });

  const asunto = "Restablecer contraseña";
  const enlace = `${process.env.NEXT_PUBLIC_BASE_URL}/inicioDeSesion/restablecerPass?token=${token}`;

  // --- Mensaje en texto plano (fallback) ---
  const texto = `Estimado usuario,

Se ha solicitado el restablecimiento de la contraseña del usuario ${usuario} perteneciente al sistema del Condominio Vivaldi.

Para continuar con el proceso, copie y pegue el siguiente enlace en la barra de direcciones de su navegador:

${enlace}

Si usted no realizó esta solicitud, puede ignorar este mensaje con seguridad.

Atentamente,
Administración Condominio Vivaldi`;

  // --- Mensaje en HTML (mejor formato) ---
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a3728;">Restablecer Contraseña</h2>
      
      <p>Estimado usuario,</p>
      
      <p>Se ha solicitado el restablecimiento de la contraseña del usuario <strong>${usuario}</strong> perteneciente al sistema del Condominio Vivaldi.</p>
      
      <p>Para continuar con el proceso, haga clic en el siguiente botón:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${enlace}" 
           style="background-color: #4a3728; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Restablecer Contraseña
        </a>
      </div>
      
      <p>O copie y pegue el siguiente enlace en la barra de direcciones de su navegador:</p>
      
      <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
        <a href="${enlace}" style="color: #4a3728;">${enlace}</a>
      </p>
      
      <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
        <strong>Nota:</strong> Este enlace expirará en 10 minutos.
      </p>
      
      <p style="color: #666; font-size: 0.9em;">
        Si usted no realizó esta solicitud, puede ignorar este mensaje con seguridad.
      </p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      
      <p style="color: #888; font-size: 0.9em;">
        Atentamente,<br>
        <strong>Administración Condominio Vivaldi</strong>
      </p>
    </div>
  `;

  // Enviamos tanto texto como HTML
  return await enviarCorreo({
    para: correo,
    asunto,
    texto,
    html,
  });
}
