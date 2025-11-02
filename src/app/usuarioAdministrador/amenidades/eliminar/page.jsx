// src/app/usuarioAdministrador/amenidades/eliminar/page.jsx

"use client";

import { useEffect, useState } from "react";

export default function EliminarAmenidadPage() {
  const [amenidades, setAmenidades] = useState([]);
  const [seleccionada, setSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [imagenPreview, setImagenPreview] = useState("");

  // Cargar amenidades al montar
  useEffect(() => {
    fetch("/api/amenidades")
      .then((res) => res.json())
      .then((data) => {
        const todas = [...(data.conReserva || []), ...(data.sinReserva || [])];
        setAmenidades(todas);
      })
      .catch(() => setMensaje("Error al cargar amenidades."));
  }, []);

  // Actualizar preview al seleccionar
  useEffect(() => {
    const encontrada = amenidades.find((a) => a.nombre === seleccionada);
    setImagenPreview(encontrada?.imagenUrl || "");
  }, [seleccionada, amenidades]);

  const handleEliminar = async (e) => {
    e.preventDefault();

    if (!seleccionada) {
      setMensaje("Debes seleccionar una amenidad.");
      return;
    }

    const res = await fetch(`/api/amenidades?nombre=${encodeURIComponent(seleccionada)}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje(data.message);
      setAmenidades((prev) => prev.filter((a) => a.nombre !== seleccionada));
      setSeleccionada("");
      setImagenPreview("");
    } else {
      setMensaje(data?.error || "Error al eliminar.");
    }
  };

  return (
    <div className="min-h-screen bg-mi-gradiante-blanco px-6">
      <div className="max-w-xl mx-auto bg-transparent rounded-lg p-10 space-y-8">
        <form onSubmit={handleEliminar} className="space-y-8">
          {/* Bloque: Selección de amenidad */}
          <div className="p-6 rounded-lg bg-[var(--Mi-blanco)] shadow-lg">
            <label className="Mi_texto_20 block mb-2 text-[var(--Mi-cafe-oscuro)]">
              Nombre amenidad:*
            </label>
            <select
              value={seleccionada}
              onChange={(e) => setSeleccionada(e.target.value)}
              className="Mi_texto_20 w-full p-3 rounded-lg border border-[var(--Mi-gris)] text-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-gris)]"
              required
            >
              <option value="">Elegir...</option>
              {amenidades.map((a) => (
                <option key={a._id} value={a.nombre}>
                  {a.nombre}
                </option>
              ))}
            </select>

            {imagenPreview && (
              <div className="mt-6">
                <img
                  src={imagenPreview}
                  alt={`Imagen de ${seleccionada}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-full py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 border"
          >
            Eliminar
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
