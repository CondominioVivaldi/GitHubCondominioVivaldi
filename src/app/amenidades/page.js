"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AmenidadesPage() {
  const [amenidades, setAmenidades] = useState([]);

  useEffect(() => {
    const fetchAmenidades = async () => {
      const res = await fetch("/api/amenidades", { cache: "no-store" });
      const data = await res.json();
      setAmenidades(Array.isArray(data) ? data : []);
    };
    fetchAmenidades();
  }, []);

  const conReserva = amenidades.filter((a) => a.requiereReserva === "sí");
  const sinReserva = amenidades.filter((a) => a.requiereReserva === "no");

  // Carrusel con flechas SVG externas
  const Carousel = ({ items, conReserva }) => {
    const [index, setIndex] = useState(0);

    const prev = () => setIndex((i) => (i === 0 ? items.length - 1 : i - 1));
    const next = () => setIndex((i) => (i === items.length - 1 ? 0 : i + 1));

    if (items.length === 0) return null;
    const actual = items[index];

    return (
      <div className="flex flex-col items-center">
        {/* Contenedor con flechas afuera */}
        <div className="flex items-center w-full justify-center relative">
          {/* Flecha izquierda */}
          {items.length > 1 && (
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute -left-2 top-1/2 -translate-y-1/2 hover:scale-110 transition"
            >
              <img
                src="/icons/arrow-left.svg"
                alt="Anterior"
                className="w-12 h-12"
              />
            </button>
          )}

          {/* Imagen centrada */}
          <div className="rounded-lg overflow-hidden shadow-md w-full max-w-3xl">
            <img
              src={actual.imagenUrl || "/images/sin-imagen.jpg"}
              alt={actual.nombre}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Flecha derecha */}
          {items.length > 1 && (
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute -right-2 top-1/2 -translate-y-1/2 hover:scale-110 transition"
            >
              <img
                src="/icons/arrow-right.svg"
                alt="Siguiente"
                className="w-12 h-12"
              />
            </button>
          )}
        </div>

        {/* Info debajo de la imagen */}
        <div className="mt-6 text-center space-y-3">
  <h3 className="text-2xl font-bold text-gray-800">{actual.nombre}</h3>
  <p className="text-sm text-gray-600">
    Tiempo máximo: {actual.tiempoMaximo || "N/A"}
  </p>
  {conReserva && (
    <Link
      href="/reservas"
      className="mt-4 px-6 py-2 text-white font-semibold rounded-lg shadow-md
               bg-gradient-to-b from-[#A2D4F4] to-[#003D8F]
               hover:from-[#7EC3F2] hover:to-[#0050B5]
               transition duration-300 ease-in-out"
    >
      Ir a reservar
    </Link>
  )}
</div>

        {/* Puntos indicadores debajo */}
        <div className="flex justify-center space-x-2 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-blue-700" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 pt-[140px] px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-10">

        {/* Con reserva */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black text-center mb-4">Con reserva</h2>
          {conReserva.length === 0 ? (
            <p className="text-gray-600 text-center">No hay amenidades con reserva aún.</p>
          ) : (
            <Carousel items={conReserva} conReserva />
          )}
        </section>

        {/* Sin reserva */}
        <section>
          <h2 className="text-2xl font-bold text-black text-center mb-4">Sin reserva</h2>
          {sinReserva.length === 0 ? (
            <p className="text-gray-600 text-center">No hay amenidades sin reserva aún.</p>
          ) : (
            <Carousel items={sinReserva} conReserva={false} />
          )}
        </section>
      </div>
    </div>
  );
}