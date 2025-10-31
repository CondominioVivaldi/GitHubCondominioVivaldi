"use client";
import { useEffect, useState } from "react";

export default function ReclamosPendientesUsuario() {
  const [reclamos, setReclamos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const usuarioId = typeof window !== "undefined" ? localStorage.getItem("usuarioId") : null;
    if (!usuarioId) return;

    const cargar = async () => {
      const res = await fetch(`/api/reclamos?estado=pendientes&creadoPor=${usuarioId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.reclamos || []);
      setReclamos(items);
    };

    cargar();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-8 py-10 space-y-8 bg-mi-gradiante-blanco">

      {/* 📌 Cuadro 1: Tabla */}
      <div className="bg-[var(--Mi-blanco)] w-full max-w-[1200px] rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
            <table className="border border-[var(--Mi-cafe-oscuro)] rounded-lg overflow-hidden w-full">
              <thead className="bg-mi-gradiante-azul text-[var(--Mi-blanco)] Mi_texto_negrita_20 text-center sticky top-0">
                <tr>
                  <th className="px-4 py-3">Acción</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Asunto</th>
                  <th className="px-4 py-3">Vivienda</th>
                </tr>
              </thead>
              <tbody>
                {reclamos.map((r) => (
                  <tr
                    key={r._id}
                    className="bg-mi-gradiante-blanco text-[var(--Mi-cafe-oscuro)] Mi_texto_20 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={seleccionado?._id === r._id}
                        onChange={() => setSeleccionado(r)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(r.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-4 py-3 text-center">{r.estado}</td>
                    <td className="px-4 py-3 text-center">{r.titulo}</td>
                    <td className="px-4 py-3 text-center">
                      {r.vivienda?.numero || r.creadoPor?.usuario}
                    </td>
                  </tr>
                ))}

                {reclamos.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-[var(--Mi-gris)]">
                      No hay reclamos pendientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 📌 Cuadros 2 y 3 en dos columnas */}
      {seleccionado && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Columna izquierda: Asunto + Histórico */}
          <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-fade-in">
            {/* Asunto */}
            <div>
              <h3 className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-2">Asunto</h3>
              <input
                type="text"
                value={seleccionado.titulo}
                readOnly
                className="Mi_texto_20 w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
              />
            </div>

            {/* Histórico */}
            <div>
              <h3 className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-2">Histórico de conversación</h3>
              <div className="Mi_texto_20 border border-gray-300 rounded-lg p-3 bg-gray-50 h-64 overflow-y-auto">
                {seleccionado.descripcion ? (
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      {`Vivienda${seleccionado.vivienda?.numero || seleccionado.creadoPor?.usuario}, ${new Date(seleccionado.createdAt).toLocaleDateString("es-ES")}, ${new Date(seleccionado.createdAt).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                    <p>{seleccionado.descripcion}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">Sin detalles aún</p>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha: Detalles con botón */}
          <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)]">Detalles</h3>
              <div className="flex gap-4">
                <button className="Mi_texto_20 bg-mi-gradiente-boton-principal Mi_texto_boton text-white px-4 py-2 rounded-lg shadow hover:opacity-90">
                  Finalizar reclamo
                </button>
                <button className="Mi_texto_20 bg-mi-gradiente-boton-principal Mi_texto_boton text-white px-4 py-2 rounded-lg shadow hover:opacity-90">
                  Enviar
                </button>
              </div>
            </div>
            <textarea
              placeholder="Escribir..."
              className="Mi_texto_20 w-full border border-gray-300 rounded-lg p-2 bg-gray-100 h-64 flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}