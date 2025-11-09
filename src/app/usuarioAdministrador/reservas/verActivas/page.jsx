// src/app/usuarioAdministrador/reservas/verActivas/page.jsx

"use client";
import React, { useState, useEffect } from "react";
import { Trash2, AlertCircle, CheckCircle } from "lucide-react";

export default function ViewReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [userName, setUserName] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [selectedReservas, setSelectedReservas] = useState(new Set());
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Búsqueda de usuarios con autocompletado (debounce)
  useEffect(() => {
    if (userName.length < 2 || userName.toLowerCase() === "todos") {
      setUserSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/usuarios/buscar?term=${userName}`);
        if (!res.ok) throw new Error("Error en la búsqueda");
        const data = await res.json();
        setUserSuggestions(data);
      } catch (err) {
        console.error("Error buscando usuarios:", err);
        setUserSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userName]);

  // Fetch de reservas
  const fetchReservas = async () => {
    setError(null);
    setSuccessMessage(null);

    // Validar que todos los campos estén completos
    if (!userName || !fechaInicio || !fechaFin) {
      setError("Por favor, complete todos los campos de búsqueda.");
      return;
    }

    // Validar rango de fechas
    if (fechaInicio > fechaFin) {
      setError("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        userName,
        fechaInicio,
        fechaFin,
      }).toString();

      const response = await fetch(`/api/reservas/verActivas?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setReservas(data.reservas);
        setSelectedReservas(new Set()); // Limpiar selección
        if (data.reservas.length === 0) {
          setError("No se encontraron reservas con los criterios especificados.");
        }
      } else {
        setError(data.message || "Error al obtener las reservas.");
      }
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      setError("Error de conexión. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejo de selección de checkbox individual
  const handleCheckboxChange = (reservaId) => {
    const newSelected = new Set(selectedReservas);
    if (newSelected.has(reservaId)) {
      newSelected.delete(reservaId);
    } else {
      newSelected.add(reservaId);
    }
    setSelectedReservas(newSelected);
  };

  // Manejo de selección de todos los checkboxes
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(reservas.map(r => r._id));
      setSelectedReservas(allIds);
    } else {
      setSelectedReservas(new Set());
    }
  };

  // Eliminar reservas seleccionadas
  const handleDeleteSelected = async () => {
    if (selectedReservas.size === 0) {
      setError("Por favor, seleccione al menos una reserva para eliminar.");
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro que desea eliminar ${selectedReservas.size} reserva(s)? Esta acción no se puede deshacer.`
    );

    if (!confirmacion) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/reservas/eliminar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaIds: Array.from(selectedReservas),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        // Refrescar la tabla después de eliminar
        await fetchReservas();
      } else {
        setError(data.message || "Error al eliminar las reservas.");
      }
    } catch (error) {
      console.error("Error al eliminar reservas:", error);
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ocultar mensajes después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="flex flex-col items-center justify-center bg-[var(--Mi-fondo)] py-10 px-4">
      {/* Mensajes de Error y Éxito */}
      {error && (
        <div className="w-full max-w-[1158px] mb-6 flex items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fade-in">
          <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
          <p className="Mi_texto_20">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="w-full max-w-[1158px] mb-6 flex items-center p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fade-in">
          <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
          <p className="Mi_texto_20">{successMessage}</p>
        </div>
      )}

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 w-full max-w-[1158px]">
        {/* Buscar por Usuario */}
        <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg flex-1 flex flex-col items-start relative">
          <h1 className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-6">
            Buscar por usuario / Todos:
          </h1>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='Escribir usuario o "Todos"...'
            autoComplete="off"
            className="w-full border border-gray-300 p-2 rounded focus:ring-1 focus:ring-[var(--Mi-gradiante-azul-from)] focus:border-[var(--Mi-gradiante-azul-from)]"
          />

          {/* Sugerencias de autocompletado */}
          {userSuggestions.length > 0 && (
            <div className="absolute z-50 w-[calc(100%-4rem)] mt-[120px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {userSuggestions.map((user) => (
                <div
                  key={user._id}
                  className="p-3 Mi_texto_pequeño_16 text-[var(--Mi-cafe-oscuro)] hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setUserName(user.usuario);
                    setUserSuggestions([]);
                  }}
                >
                  {user.usuario}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buscar por Fechas */}
        <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg flex-1 flex flex-col items-start">
          <h1 className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-6">
            Buscar por Fecha:
          </h1>
          <label className="Mi_texto_pequeño_16 text-[var(--Mi-cafe-oscuro)] mb-1">
            Fecha inicio:
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3 focus:ring-1 focus:ring-[var(--Mi-gradiante-azul-from)] focus:border-[var(--Mi-gradiante-azul-from)]"
          />
          <label className="Mi_texto_pequeño_16 text-[var(--Mi-cafe-oscuro)] mb-1">
            Fecha fin:
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-4 focus:ring-1 focus:ring-[var(--Mi-gradiante-azul-from)] focus:border-[var(--Mi-gradiante-azul-from)]"
          />
          <button
            onClick={fetchReservas}
            disabled={isLoading}
            className={`w-full bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] rounded px-4 py-2 Mi_texto_boton transition duration-300 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90 hover:shadow-lg"
            }`}
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-full max-w-[1158px] flex flex-col">
        {/* Botón de eliminar seleccionados */}
        {reservas.length > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <p className="Mi_texto_pequeño_16 text-[var(--Mi-cafe-oscuro)]">
              {selectedReservas.size > 0
                ? `${selectedReservas.size} reserva(s) seleccionada(s)`
                : "Seleccione reservas para eliminar"}
            </p>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedReservas.size === 0 || isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded Mi_texto_boton transition duration-300 ${
                selectedReservas.size === 0 || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
              }`}
            >
              <Trash2 className="w-5 h-5" />
              Eliminar Seleccionadas
            </button>
          </div>
        )}

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="bg-mi-gradiante-azul border border-gray-300 px-4 py-2 text-white">
                  <input
                    type="checkbox"
                    checked={
                      reservas.length > 0 &&
                      selectedReservas.size === reservas.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                {["Fecha", "Hora", "Amenidad", "Usuario"].map((header) => (
                  <th
                    key={header}
                    className="bg-mi-gradiante-azul border border-gray-300 px-4 py-2 text-white Mi_texto_boton"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="border border-gray-300 px-4 py-8 text-center text-[var(--Mi-gris)] Mi_texto_20"
                  >
                    {isLoading
                      ? "Cargando reservas..."
                      : "No hay reservas para mostrar. Use los filtros para buscar."}
                  </td>
                </tr>
              ) : (
                reservas.map((reserva) => (
                  <tr key={reserva._id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedReservas.has(reserva._id)}
                        onChange={() => handleCheckboxChange(reserva._id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center Mi_texto_pequeño_16">
                      {new Date(reserva.date + "T00:00:00").toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center Mi_texto_pequeño_16">
                      {reserva.hourTime}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center Mi_texto_pequeño_16">
                      {reserva.amenidadNombre}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center Mi_texto_pequeño_16">
                      {reserva.userName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Información adicional */}
        {reservas.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="Mi_texto_pequeño_16 text-[var(--Mi-cafe-oscuro)]">
              Total de reservas encontradas: <strong>{reservas.length}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}