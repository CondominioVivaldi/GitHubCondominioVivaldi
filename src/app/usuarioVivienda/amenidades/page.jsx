// src/app/usuarioVivienda/amenidades/page.jsx

"use client";

import { useState, useEffect } from "react";

export default function VerAmenidad() {
  const [amenidades, setAmenidades] = useState({
    conReserva: [],
    sinReserva: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentIndexConReserva, setCurrentIndexConReserva] = useState(0);
  const [currentIndexSinReserva, setCurrentIndexSinReserva] = useState(0);

  useEffect(() => {
    fetchAmenidades();
  }, []);

  const fetchAmenidades = async () => {
    try {
      const response = await fetch("/api/amenidades");
      const data = await response.json();

      if (data.success) {
        setAmenidades({
          conReserva: data.conReserva || [],
          sinReserva: data.sinReserva || [],
        });
      }
    } catch (error) {
      console.error("Error fetching amenidades desde la API:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = (type) => {
    if (type === "conReserva") {
      setCurrentIndexConReserva((prev) =>
        prev === amenidades.conReserva.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentIndexSinReserva((prev) =>
        prev === amenidades.sinReserva.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevSlide = (type) => {
    if (type === "conReserva") {
      setCurrentIndexConReserva((prev) =>
        prev === 0 ? amenidades.conReserva.length - 1 : prev - 1
      );
    } else {
      setCurrentIndexSinReserva((prev) =>
        prev === 0 ? amenidades.sinReserva.length - 1 : prev - 1
      );
    }
  };

  const goToSlide = (index, type) => {
    if (type === "conReserva") {
      setCurrentIndexConReserva(index);
    } else {
      setCurrentIndexSinReserva(index);
    }
  };

  // Función para redirigir a la ruta de reservas
  const goToReservas = () => {
    window.location.href = "/usuarioVivienda/reservas/agregar";
  };

  const CarouselSection = ({
    title,
    items,
    currentIndex,
    type,
    showButton = false,
  }) => (
    <div className="bg-[var(--Mi-blanco)] w-full max-w-4xl rounded-2xl shadow-2xl p-6 sm:p-8 mb-8">
      <div className="flex justify-center items-center mb-6">
        <h2 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)]">{title}</h2>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20">
            No hay amenidades disponibles en esta categoría.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-center">
            <button
              onClick={() => prevSlide(type)}
              className="absolute left-0 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              disabled={items.length <= 1}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-2xl text-[var(--Mi-cafe-oscuro)]">←</span>
              </div>
            </button>

            <div className="mx-16 w-full max-w-md">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={items[currentIndex]?.imagenUrl || "/imagen-placeholder.jpg"}
                  alt={items[currentIndex]?.nombre || "Amenidad"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <button
              onClick={() => nextSlide(type)}
              className="absolute right-0 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              disabled={items.length <= 1}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-2xl text-[var(--Mi-cafe-oscuro)]">→</span>
              </div>
            </button>
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index, type)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-[var(--Mi-cafe-oscuro)]"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {items[currentIndex] && (
            <div className="text-center mt-4">
              <h3 className="Mi_texto_negrita_20 text-[var(--Mi-cafe-oscuro)] mb-2">
                {items[currentIndex].nombre}
              </h3>
              {/* Mostrar 'Tiempo máximo' SOLO si el tipo es 'conReserva' */}
              {type === 'conReserva' && (
                <p className="text-[var(--Mi-gris)] Mi_texto_20">
                  Tiempo máximo: {items[currentIndex].tiempoMaximo}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end w-full">
            {showButton && items.length > 0 && (
              <button
                // Asignar la función de navegación al botón
                onClick={goToReservas}
                className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition-opacity"
              >
                Ir a reserva
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--Mi-cafe-oscuro)]"></div>
            <span className="ml-3 text-[var(--Mi-cafe-oscuro)] Mi_texto_20">
              Cargando amenidades...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-mi-gradiante-blanco">
      <CarouselSection
        title="Con reserva"
        items={amenidades.conReserva}
        currentIndex={currentIndexConReserva}
        type="conReserva"
        showButton={true}
      />

      <CarouselSection
        title="Sin reserva"
        items={amenidades.sinReserva}
        currentIndex={currentIndexSinReserva}
        type="sinReserva"
        showButton={false}
      />
    </div>
  );
}
