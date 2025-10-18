"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [usuario, setUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario }),
    });
    const data = await res.json();
    setMensaje(data.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Solicitud para Restablecer Contraseña
        </h1>

        <ol className="list-decimal list-inside text-sm text-gray-600 mb-4 space-y-1">
          <li>Ingrese su nombre de usuario.</li>
          <li>Presione "Solicitar".</li>
          <li>Revise la bandeja de entrada o spam de su correo vinculado.</li>
        </ol>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Escribir..."
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-lg shadow-md
             bg-gradient-to-b from-[#A2D4F4] to-[#003D8F]
             hover:from-[#7EC3F2] hover:to-[#0050B5]
             transition duration-300 ease-in-out"
          >
            Solicitar
          </button>
        </form>

        {mensaje && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded text-center">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}