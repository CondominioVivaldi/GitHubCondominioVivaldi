// src/app/usuarioAdministrador/amenidades/editar/page.jsx

"use client";

import { useEffect, useState } from "react";

export default function EditarAmenidadPage() {
  const [amenidades, setAmenidades] = useState([]);
  const [seleccionada, setSeleccionada] = useState("");
  const [nombre, setNombre] = useState("");
  const [requiereReserva, setRequiereReserva] = useState("");
  const [tiempoMaximo, setTiempoMaximo] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Cargar amenidades
  useEffect(() => {
    fetch("/api/amenidades")
      .then((res) => res.json())
      .then((data) => {
        const todas = [...(data.conReserva || []), ...(data.sinReserva || [])];
        setAmenidades(todas);
      })
      .catch(() => setMensaje("Error al cargar amenidades."));
  }, []);

  // Cargar datos de la amenidad seleccionada
  useEffect(() => {
    const actual = amenidades.find((a) => a._id === seleccionada);
    if (actual) {
      setNombre(actual.nombre);
      setRequiereReserva(actual.requiereReserva);
      setTiempoMaximo(actual.tiempoMaximo);
    }
  }, [seleccionada, amenidades]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!seleccionada || !nombre || !requiereReserva || !tiempoMaximo) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    const res = await fetch(`/api/amenidades?id=${seleccionada}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, requiereReserva, tiempoMaximo }),
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje("Amenidad actualizada correctamente.");
    } else {
      setMensaje(data?.error || "Error al actualizar.");
    }
  };

  return (
    <div className="min-h-screen bg-mi-gradiante-blanco px-6">
      <div className="max-w-xl mx-auto bg-transparent rounded-lg p-10 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Selección de amenidad */}
          <div className="p-6 rounded-lg bg-[var(--Mi-blanco)] shadow-lg">
            <label className="Mi_texto_20 block mb-2 text-[var(--Mi-cafe-oscuro)]">
              Selecciona amenidad a editar:*
            </label>
            <select
              value={seleccionada}
              onChange={(e) => setSeleccionada(e.target.value)}
              className="Mi_texto_20 w-full p-3 rounded-lg border border-[var(--Mi-gris)] text-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-gris)]"
              required
            >
              <option value="">Elegir...</option>
              {amenidades.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Campo: Nombre */}
          <div className="p-6 rounded-lg bg-[var(--Mi-blanco)] shadow-lg">
            <label className="Mi_texto_20 block mb-2 text-[var(--Mi-cafe-oscuro)]">
              Nombre amenidad:*
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="Mi_texto_20 w-full p-3 rounded-lg border border-[var(--Mi-gris)] text-[var(--Mi-cafe-oscuro)] placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-gris)]"
              required
            />
          </div>

          {/* Campo: ¿Necesita reserva? */}
          <div className="p-6 rounded-lg bg-[var(--Mi-blanco)] shadow-lg">
            <label className="Mi_texto_20 block mb-2 text-[var(--Mi-cafe-oscuro)]">
              ¿Necesitas reserva?*
            </label>
            <select
              value={requiereReserva}
              onChange={(e) => setRequiereReserva(e.target.value)}
              className="Mi_texto_20 w-full p-3 rounded-lg border border-[var(--Mi-gris)] text-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-gris)]"
              required
            >
              <option value="">Elegir...</option>
              <option value="sí">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Campo: Tiempo máximo */}
          <div className="p-6 rounded-lg bg-[var(--Mi-blanco)] shadow-lg">
            <label className="Mi_texto_20 block mb-2 text-[var(--Mi-cafe-oscuro)]">
              Tiempo máximo de reserva:*
            </label>
            <select
              value={tiempoMaximo}
              onChange={(e) => setTiempoMaximo(e.target.value)}
              className="Mi_texto_20 w-full p-3 rounded-lg border border-[var(--Mi-gris)] text-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-gris)]"
              required
            >
              <option value="">Elegir...</option>
              <option value="30 minutos">30 minutos</option>
              <option value="1 hora">1 hora</option>
              <option value="2 horas">2 horas</option>
              <option value="3 horas">3 horas</option>
            </select>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-full py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 border"
          >
            Guardar cambios
          </button>

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
