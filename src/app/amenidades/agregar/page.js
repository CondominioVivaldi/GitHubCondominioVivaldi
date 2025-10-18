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

    if (!nombre || !requiereReserva || !tiempoMaximo || !imagenFile) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 pt-[140px] px-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Agregar Amenidad
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre amenidad *
            </label>
            <input
              type="text"
              placeholder="Escribir..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
             focus:outline-none focus:ring-1 focus:ring-blue-500
             text-gray-900 placeholder-gray-400 text-base"

              required
            />
          </div>

          {/* Necesita reserva */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ¿Necesita reserva? *
            </label>
            <select
              value={requiereReserva}
              onChange={(e) => setRequiereReserva(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
             focus:outline-none focus:ring-1 focus:ring-blue-500
             text-gray-500 text-base"

              required
            >
              <option value="">Elegir...</option>
              <option value="sí">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Tiempo máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo máximo de reserva *
            </label>
            <select
              value={tiempoMaximo}
              onChange={(e) => setTiempoMaximo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
             focus:outline-none focus:ring-1 focus:ring-blue-500
             text-gray-500 text-base"

              required
            >
              <option value="">Elegir...</option>
              <option value="30 minutos">30 minutos</option>
              <option value="1 hora">1 hora</option>
              <option value="2 horas">2 horas</option>
              <option value="3 horas">3 horas</option>
            </select>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="w-full text-gray-500 text-base
             file:text-gray-500 file:font-medium
             file:border file:border-gray-400
             file:px-4 file:py-2 file:rounded-lg"

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
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-lg shadow-md
                       bg-gradient-to-b from-[#A2D4F4] to-[#003D8F]
                       hover:from-[#7EC3F2] hover:to-[#0050B5]
                       transition duration-300 ease-in-out"
          >
            Guardar
          </button>

          {mensaje && (
            <p className="text-center mt-4 font-medium text-blue-700">{mensaje}</p>
          )}
        </form>
      </div>
    </div>
  );
}