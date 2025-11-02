"use client";
import { useState } from "react";

export default function AgregarReclamoPage() {
  const [asunto, setAsunto] = useState("");
  const [detalles, setDetalles] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!asunto || !detalles) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    const creadoPor = localStorage.getItem("usuarioId");
    if (!creadoPor) {
      setMensaje("No se encontró el usuario logueado.");
      return;
    }

    const res = await fetch("/api/reclamos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: asunto,
        descripcion: detalles,
        creadoPor,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje("Reclamo enviado correctamente.");
      setAsunto("");
      setDetalles("");
    } else {
      setMensaje(data?.error || "Error al enviar reclamo.");
    }
  };

  return (
    <div className="min-h-screen bg-mi-gradiante-blanco px-6 animate-fade-in">
      <div className="max-w-xl mx-auto bg-transparent rounded-lg p-10">
        <form onSubmit={handleSubmit}>
          <div className="p-6 rounded-lg bg-[var(--Mi-blanco)] shadow-lg space-y-6">
            {/* Campo: Asunto */}
            <div>
              <label className="Mi_texto_20 block mb-2 text-[var(--Mi-cafe-oscuro)]">
                Asunto:*
              </label>
              <input
                type="text"
                placeholder="Escribir..."
                value={asunto}
                onChange={(e) => {
                  setAsunto(e.target.value);
                  e.target.setCustomValidity("");
                }}
                onInvalid={(e) =>
                  e.target.setCustomValidity("Este campo es obligatorio")
                }
                required
                className="Mi_texto_20 w-full p-3 rounded-lg border border-[var(--Mi-gris)] 
                           text-[var(--Mi-cafe-oscuro)] placeholder-[var(--Mi-gris)] 
                           focus:outline-none focus:ring-2 focus:ring-[var(--Mi-gris)]"
              />
            </div>

            {/* Campo: Detalles */}
            <div>
              <label className="Mi_texto_20 block mb-2 text-[var(--Mi-cafe-oscuro)]">
                Detalles:*
              </label>
              <textarea
                placeholder="Escribir..."
                value={detalles}
                onChange={(e) => {
                  setDetalles(e.target.value);
                  e.target.setCustomValidity("");
                }}
                onInvalid={(e) =>
                  e.target.setCustomValidity("Este campo es obligatorio")
                }
                required
                rows={5}
                className="Mi_texto_20 w-full p-3 rounded-lg border border-[var(--Mi-gris)] 
                           text-[var(--Mi-cafe-oscuro)] placeholder-[var(--Mi-gris)] 
                           focus:outline-none focus:ring-2 focus:ring-[var(--Mi-gris)]"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] 
                         Mi_texto_boton w-full py-3 rounded-lg hover:opacity-90 
                         transition-opacity duration-300 border"
            >
              Enviar
            </button>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <p className="text-center mt-4 Mi_texto_20 text-blue-700 font-medium">
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}