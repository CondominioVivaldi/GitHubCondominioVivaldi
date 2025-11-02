// src/app/usuarioVivienda/condominos/buscar/page.jsx

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Pagina para que cargar los datos del condomino activo en los campos del formulario
export default function BuscarCondominos() {
  const router = useRouter();
  const [criterio, setCriterio] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [condominos, setCondominos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [tipoDocumento, setTipoDocumento] = useState("");

  const selectTextColor =
    criterio === "" ? "text-[var(--Mi-gris)]" : "text-[var(--Mi-cafe-oscuro)]";
  const inputTextColor =
    busqueda === "" ? "text-[var(--Mi-gris)]" : "text-[var(--Mi-cafe-oscuro)]";
  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Título */}
        <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-8 text-left">
          Datos personales
        </h1>
        {/* Formulario */}
        <form className="flex flex-col space-y-5 Mi_texto_20">
          {/* Tipo de documento */}
          <div className="flex flex-col">
            <label
              htmlFor="tipoDocumento"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Tipo de documento:*
            </label>
            <select
              id="tipoDocumento"
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${selectTextColor}`}
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}>
              <option value="" disabled>
                Seleccione una opción:
              </option>
              <option value="DPI">DPI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          {/* Número de documento */}
          <div className="flex flex-col">
            <label htmlFor="numeroDocumento" className="mb-1">
              Número de documento:*
            </label>
            <input
              id="numeroDocumento"
              type="text"
              placeholder="0000000000000"
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>
          {/* Nombre completo */}
          <div className="flex flex-col">
            <label htmlFor="nombreCompleto" className="mb-1">
              Nombre completo:*
            </label>
            <input
              id="nombreCompleto"
              type="text"
              placeholder="Bruce Lee"
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>
        </form>
      </div>
    </div>
  );
}