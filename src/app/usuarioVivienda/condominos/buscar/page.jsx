// src/app/usuarioVivienda/condominos/buscar/page.jsx

"use client";

import { useState } from "react";

export default function BuscarCondominos() {
  const [criterio, setCriterio] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Determina color de texto dinámico
  const selectTextColor =
    criterio === "" ? "text-[var(--Mi-gris)]" : "text-[var(--Mi-cafe-oscuro)]";
  const inputTextColor =
    busqueda === "" ? "text-[var(--Mi-gris)]" : "text-[var(--Mi-cafe-oscuro)]";

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-8 py-10 space-y-8 bg-mi-gradiante-blanco">
      {/* Contenedor superior: búsqueda */}
      <div className="bg-[var(--Mi-blanco)] w-[700px] max-w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
        <form className="flex flex-col space-y-6 Mi_texto_20 text-[var(--Mi-cafe-oscuro)]">
          {/* Buscar por */}
          <div className="flex flex-col">
            <label htmlFor="criterio" className="mb-1">
              Buscar por:*
            </label>
            <select
              id="criterio"
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${selectTextColor}`}
              value={criterio}
              onChange={(e) => setCriterio(e.target.value)}
            >
              <option value="" disabled style={{ color: "var(--Mi-gris)" }}>
                Elegir...
              </option>
              <option value="ID" style={{ color: "var(--Mi-cafe-oscuro)" }}>
                ID
              </option>
              <option value="Nombre" style={{ color: "var(--Mi-cafe-oscuro)" }}>
                Nombre
              </option>
              <option value="Todos" style={{ color: "var(--Mi-cafe-oscuro)" }}>
                Todos
              </option>
            </select>
          </div>

          {/* Escribir ID / Nombre */}
          <div className="flex flex-col">
            <label htmlFor="busqueda" className="mb-1">
              Escribir ID / Nombre:*
            </label>
            <input
              id="busqueda"
              type="text"
              placeholder="Escribir..."
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${inputTextColor}`}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Contenedor inferior: tabla */}
      <div className="bg-[var(--Mi-blanco)] w-[700px] max-w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
        <table className="border border-[var(--Mi-cafe-oscuro)] rounded-lg overflow-hidden w-full">
          <thead className=" bg-mi-gradiante-azul text-[var(--Mi-blanco)] Mi_texto_negrita_20 text-center">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Número de documento</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr
                key={i}
                className="bg-mi-gradiante-blanco text-[var(--Mi-cafe-oscuro)] Mi_texto_20"
              >
                <td className="px-6 py-3">&nbsp;</td>
                <td className="px-6 py-3">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
