"use client";
import React, { useState, useEffect } from "react";

export default function ViewReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [viviendaId, setViviendaId] = useState("");
  const [amenidadId, setAmenidadId] = useState("");
  const [fechaReserva, setFechaReserva] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fetchReservas = async () => {
    try {
      const queryParams = new URLSearchParams({
        viviendaId,
        fechaInicio,
        fechaFin,
      }).toString();
      const response = await fetch(`/api/reservas/verActivas?${queryParams}`); //src/app/api/reservas/verActivas/route.js
      const data = await response.json();
      if (response.ok) {
        setReservas(data.reservas);
      }
    }
    catch (error) {
      console.error("Error al obtener reservas:", error.message);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center bg-[var(--Mi-fondo)] py-10">
      {/* FILTROS */}
      <div className="flex gap-6 mb-10">
        {/* Buscar por Vivienda */}
        <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[400px] flex flex-col items-start">
          <h1 className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-6">Buscar por ID de Vivienda</h1>
          <input
            type="text"
            value={viviendaId}
            onChange={(e) => setViviendaId(e.target.value)}
            placeholder="Ingrese ID de Vivienda"
            className="w-full border border-gray-300 p-2 rounded mb-4"
          />
        </div>

        {/* Buscar por Fechas */}
        <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[400px] flex flex-col items-start">
          <h1 className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-6">Buscar por Fechas</h1>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-2"
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-4"
          />
          <button
            onClick={() => fetchReservas({ viviendaId, fechaInicio, fechaFin })}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[1158px] flex flex-col items-center">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              {["Acción", "Fecha", "Hora", "Amenidad", "Vivienda"].map((header) => (
                <th key={header} className="bg-mi-gradiante-azul border border-gray-300 px-4 py-2 text-white">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/reservas/cancelar/", {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            _id: reserva._id,
                          }),
                        });

                        const data = await response.json();

                         await fetchReservas();

                      } catch (error) {
                        setSubmitMessage("Error de conexión. Intente nuevamente.");
                      }
                    }}
                    className="bg-red-600 text-white rounded px-2 py-1 hover:bg-red-700">Cancelar</button>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {new Date(reserva.fechaReserva).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {reserva.horaInicio}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {reserva.amenidad.nombre}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {reserva.vivienda.idVivienda}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
