// src/app/inicioDeSesion/restablecerPass/page.jsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PaginaFondoLogin from "@/componentes/PaginaFondoLogin";

export default function RestablecerPass() {
  const router = useRouter();
  const [nuevaPass, setNuevaPass] = useState("");
  const [repetirPass, setRepetirPass] = useState("");
  const [error, setError] = useState("");
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mensajeAviso, setMensajeAviso] = useState("");
  const [cambioExitoso, setCambioExitoso] = useState(false);

  const handleRestablecer = async () => {
    if (!nuevaPass || !repetirPass) {
      setError("Debe llenar ambos campos.");
      return;
    }
    if (nuevaPass !== repetirPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    try {
      const res = await fetch("/api/restablecerPass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaContrasena: nuevaPass }),
      });

      const data = await res.json();

      if (data.ok) {
        setMensajeAviso("¡La contraseña se ha cambiado!");
        setCambioExitoso(true);
      } else {
        setMensajeAviso(
          data.error === "Token inválido o expirado"
            ? "El enlace ya no es válido. Solicite nuevamente el restablecimiento."
            : "Error al cambiar la contraseña."
        );
        setCambioExitoso(false);
      }
    } catch (error) {
      setMensajeAviso("Error de conexión con el servidor.");
      setCambioExitoso(false);
    }

    setMostrarAviso(true);
  };

  const handleCerrarAviso = () => {
    setMostrarAviso(false);
    if (cambioExitoso) {
      router.push("/inicioDeSesion");
    }
  };

  return (
    <PaginaFondoLogin>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-6 p-10 rounded-2xl shadow-md text-center bg-[var(--Mi-blanco)]">
          <h2 className="Mi_H2_40 text-[var(--Mi-cafe-oscuro)]">
            Restablecer contraseña
          </h2>

          {/* Campo 1 */}
          <div className="flex flex-col text-left w-72">
            <label className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-1">
              Ingrese nueva contraseña
            </label>
            <input
              type="password"
              placeholder="Escribir..."
              value={nuevaPass}
              onChange={(e) => setNuevaPass(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-[var(--Mi-cafe-oscuro)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>

          {/* Campo 2 */}
          <div className="flex flex-col text-left w-72">
            <label className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-1">
              Repita nueva contraseña
            </label>
            <input
              type="password"
              placeholder="Escribir..."
              value={repetirPass}
              onChange={(e) => setRepetirPass(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-[var(--Mi-cafe-oscuro)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>

          {/* Error de validación */}
          {error && (
            <p className="text-red-600 text-sm Mi_texto_20 mt-[-10px]">
              {error}
            </p>
          )}

          {/* Botón */}
          <button
            onClick={handleRestablecer}
            className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-8 py-2 rounded-lg hover:opacity-90 transition"
          >
            Restablecer
          </button>
        </div>

        {/* Cuadro de aviso */}
        {mostrarAviso && (
          <div className="flex justify-center items-center absolute inset-0 bg-black/75 z-10">
            <div className="bg-mi-gradiante-blanco rounded-xl p-6 shadow-lg relative w-80 text-center">
              <button
                onClick={handleCerrarAviso}
                className="absolute top-2 right-3 text-[var(--Mi-cafe-oscuro)] text-xl font-bold"
              >
                ×
              </button>
              <h3 className="Mi_texto_negrita_20 text-[var(--Mi-cafe-oscuro)] mb-2 text-left ml-5">
                Aviso
              </h3>
              <p className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20 text-left ml-5">
                {mensajeAviso}
              </p>
            </div>
          </div>
        )}
      </div>
    </PaginaFondoLogin>
  );
}