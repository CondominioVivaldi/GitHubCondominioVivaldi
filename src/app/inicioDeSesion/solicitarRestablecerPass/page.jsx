// src/app/inicioDeSesion/solicitarRestablecerPass/page.jsx

"use client";
import { useState } from "react";
import PaginaFondoLogin from "@/componentes/PaginaFondoLogin";

export default function solicitarRestablecerPass() {
  const [usuario, setUsuario] = useState("");
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mensajeAviso, setMensajeAviso] = useState("");

  const handleSolicitar = async () => {
    if (!usuario.trim()) return;

    try {
      const res = await fetch("/api/solicitarRestablecerPass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario }),
      });

      const data = await res.json();

      if (data.ok) {
        const correo = data.correo;
        const partes = correo.split("@");
        const parcial = partes[0].slice(0, 2) + "***@" + partes[1];
        setMensajeAviso(`Hemos enviado un correo electrónico a: ${parcial}`);
      } else {
        setMensajeAviso("No existe el usuario ingresado.");
      }

      setMostrarAviso(true);
    } catch (error) {
      setMensajeAviso("Ocurrió un error inesperado.");
      setMostrarAviso(true);
    }
  };

  return (
    <PaginaFondoLogin>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-6 p-10 rounded-2xl shadow-md text-center  bg-[var(--Mi-blanco)]">
          <h2 className="Mi_H2_40 text-[var(--Mi-cafe-oscuro)]">
            Solicitud para restablecer contraseña
          </h2>

          <div className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20 text-left">
            <p>1. Ingrese su nombre de usuario.</p>
            <p>2. Presione "Solicitar".</p>
            <p>3. Revise la bandeja de entrada/spam de su correo vinculado a su usuario.</p>
          </div>

          <input
            type="text"
            placeholder="Escribir..."
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 text-[var(--Mi-cafe-oscuro)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
          />

          <button
            onClick={handleSolicitar}
            className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-8 py-2 rounded-lg hover:opacity-90 transition"
          >
            Solicitar
          </button>
        </div>

        {mostrarAviso && (
          <div className="flex justify-center items-center absolute inset-0 bg-black/75 z-10">
            <div className="bg-mi-gradiante-blanco rounded-xl p-6 shadow-lg relative w-80 text-center">
              <button
                onClick={() => setMostrarAviso(false)}
                className="absolute top-2 right-3 text-[var(--Mi-cafe-oscuro)] text-xl font-bold"
              >
                ×
              </button>
              <h3 className="Mi_texto_negrita_20 text-[var(--Mi-cafe-oscuro)] mb-2 text-left ml-5">
                Aviso
              </h3>
              <p className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20 text-left ml-5">{mensajeAviso}</p>
            </div>
          </div>
        )}
      </div>
    </PaginaFondoLogin>
  );
}
