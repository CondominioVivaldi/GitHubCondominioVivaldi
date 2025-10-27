// src/app/usuarioAdministrador/condominos/buscar/encontrado/page.jsx

"use client";

import { useState } from 'react';

export default function CondominoEncontrado() {

  const [tipoDocumento, setTipoDocumento] = useState("");

  const selectTextColor = tipoDocumento === "" 
    ? "text-[var(--Mi-gris)]" 
    : "text-[var(--Mi-cafe-oscuro)]";

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
            <label htmlFor="tipoDocumento" className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Tipo de documento:*
            </label>
            <select
              id="tipoDocumento"
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${selectTextColor}`}
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
            >
              <option value="" disabled>Seleccione una opción:</option>
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

          {/* Fecha de nacimiento */}
          <div className="flex flex-col">
            <label htmlFor="fechaNacimiento" className="mb-1">
              Fecha de nacimiento:*
            </label>
            <input
              id="fechaNacimiento"
              type="text"
              placeholder="Año/mes/día"
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>

          {/* Correo electrónico */}
          <div className="flex flex-col">
            <label htmlFor="correo" className="mb-1">
              Correo electrónico:*
            </label>
            <input
              id="correo"
              type="email"
              placeholder="brucelee@yahoo.com"
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>

          {/* Número de teléfono */}
          <div className="flex flex-col">
            <label htmlFor="telefono" className="mb-1">
              Número de teléfono:*
            </label>
            <input
              id="telefono"
              type="text"
              placeholder="00000000"
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>

          {/* Fecha de entrada */}
          <div className="flex flex-col">
            <label htmlFor="fechaEntrada" className="mb-1">
              Fecha de entrada:*
            </label>
            <input
              id="fechaEntrada"
              type="text"
              placeholder="Año/mes/día"
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>

          {/* Fecha de salida */}
          <div className="flex flex-col">
            <label htmlFor="fechaSalida" className="mb-1">
              Fecha de salida:
            </label>
            <input
              id="fechaSalida"
              type="text"
              placeholder="Año/mes/día"
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-6 pt-8">
            <button
              type="button"
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-md hover:opacity-90 transition-opacity"
            >
              Guardar
            </button>

            <button
              type="button"
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-md hover:opacity-80 transition-opacity"
            >
              Editar
            </button>

            <button
              type="button"
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-md hover:opacity-90 transition-opacity"
            >
              Eliminar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
