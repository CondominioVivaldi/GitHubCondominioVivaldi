// src\app\layout.js

import "./globals.css";
import { Italianno, Rubik } from "next/font/google";

export const metadata = {
  title: "Condominio Vivaldi",
  description: "Sistema de gestión del Condominio Vivaldi",
};

// Configurar fuentes de Google
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-rubik",
});

const italianno = Italianno({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-italianno",
});

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${rubik.variable} ${italianno.variable} w-screen h-screen bg-mi-gradiante-blanco`}
      >
        {children}
      </body>
    </html>
  );
}
