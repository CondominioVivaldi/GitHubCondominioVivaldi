// src/app/usuarioAdministrador/amenidades/agregar/page.jsx

"use client";

import { useState } from "react";

export default function AgregarAmenidadPage() {
  const [nombre, setNombre] = useState("");
  const [requiereReserva, setRequiereReserva] = useState("");
  const [tiempoMaximo, setTiempoMaximo] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("requiereReserva", requiereReserva);
    formData.append("tiempoMaximo", tiempoMaximo);
    formData.append("imagen", imagenFile);

    const res = await fetch("/api/amenidades", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje("Amenidad guardada correctamente.");
      setNombre("");
      setRequiereReserva("");
      setTiempoMaximo("");
      setImagenFile(null);
      setPreviewUrl(null);
    } else {
      setMensaje(data?.error || "Error al guardar.");
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImagenFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const esFormularioValido = nombre && requiereReserva && tiempoMaximo && imagenFile;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-mi-gradiante-blanco space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-xl">
        {/* Nombre */}
        <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8">
          <label htmlFor="nombre" className="Mi_texto_20 mb-2 block text-[var(--Mi-cafe-oscuro)]">
            Nombre amenidad:*
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Escribir..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-[var(--Mi-gris)] rounded-lg p-3 w-full text-[var(--Mi-cafe-oscuro)] placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            required
          />
        </div>

        {/* ¿Necesita reserva? */}
        <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8">
          <label htmlFor="requiereReserva" className="Mi_texto_20 mb-2 block text-[var(--Mi-cafe-oscuro)]">
            ¿Necesitas reserva?*
          </label>
          <select
            id="requiereReserva"
            value={requiereReserva}
            onChange={(e) => setRequiereReserva(e.target.value)}
            className={`border border-[var(--Mi-gris)] rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
              requiereReserva === '' ? 'text-[var(--Mi-gris)]' : 'text-[var(--Mi-cafe-oscuro)]'
        }`}
            required
          >
            <option value="">Elegir...</option>
            <option value="sí" className="text-[var(--Mi-cafe-oscuro)]">Sí</option>
            <option value="no" className="text-[var(--Mi-cafe-oscuro)]">No</option>
          </select>
        </div>

        {/* Tiempo máximo */}
        <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8">
          <label htmlFor="tiempoMaximo" className="Mi_texto_20 mb-2 block text-[var(--Mi-cafe-oscuro)]">
            Tiempo máximo de reserva:*
          </label>
          <select
            id="tiempoMaximo"
            value={tiempoMaximo}
            onChange={(e) => setTiempoMaximo(e.target.value)}
            className={`border border-[var(--Mi-gris)] rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
              tiempoMaximo === '' ? 'text-[var(--Mi-gris)]' : 'text-[var(--Mi-cafe-oscuro)]'
            }`}
            required
          >
            <option value="">Elegir...</option>
            <option value="1 hora" className="text-[var(--Mi-cafe-oscuro)]">1 hora</option>
            <option value="2 horas" className="text-[var(--Mi-cafe-oscuro)]">2 horas</option>
            <option value="3 horas" className="text-[var(--Mi-cafe-oscuro)]">3 horas</option>
            <option value="4 horas" className="text-[var(--Mi-cafe-oscuro)]">4 horas</option>
            <option value="5 horas" className="text-[var(--Mi-cafe-oscuro)]">5 horas</option>
            <option value="6 horas" className="text-[var(--Mi-cafe-oscuro)]">6 horas</option>
            <option value="7 horas" className="text-[var(--Mi-cafe-oscuro)]">7 horas</option>
            <option value="8 horas" className="text-[var(--Mi-cafe-oscuro)]">8 horas</option>
          </select>
        </div>

        {/* Imagen */}
        <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8">
          <label htmlFor="imagen" className="Mi_texto_20 mb-2 block text-[var(--Mi-cafe-oscuro)]">
            Subir imagen:*
          </label>
          <input
            id="imagen"
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            className="Mi_texto_20 w-full text-[var(--Mi-gris)] file:text-[var(--Mi-gris)] file:font-medium file:border file:border-[var(--Mi-gris)] file:px-4 file:py-2 file:rounded-lg"
            required
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-4 rounded-lg shadow-md w-full h-48 object-cover"
            />
          )}
        </div>

        {/* Botón */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={!esFormularioValido}
            className={`Mi_texto_boton w-auto px-10 py-3 rounded-lg border transition-all duration-300 ${
              !esFormularioValido
                ? 'bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] cursor-not-allowed opacity-50'
                : 'bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] hover:opacity-90'
            }`}
          >
            Guardar
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
  );
}