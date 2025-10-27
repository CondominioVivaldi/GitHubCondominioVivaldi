// src/lib/enviarCorreo.js

import nodemailer from "nodemailer";

export async function enviarCorreo({ para, asunto, texto, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Condominio Vivaldi" <${process.env.EMAIL_USER}>`,
      to: para,
      subject: asunto,
      text: texto,
      html: html || texto, // usa html si existe
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente a:", para);
    return true;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return false;
  }
}
