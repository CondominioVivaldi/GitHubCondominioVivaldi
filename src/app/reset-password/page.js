"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setMensaje(data.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Restablecer Contraseña
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingrese nueva contraseña:
            </label>
            <input
              type="password"
              placeholder="Escribir..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repita nueva contraseña:
            </label>
            <input
              type="password"
              placeholder="Escribir..."
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white py-2 rounded-lg transition 
                       bg-gradient-to-b from-sky-400 to-blue-800 
                       hover:from-sky-500 hover:to-blue-900"
          >
            Restablecer
          </button>
        </form>

        {mensaje && (
          <div
            className={`mt-4 p-3 rounded text-center ${
              mensaje.includes("cambiada") || mensaje.includes("actualizada")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}