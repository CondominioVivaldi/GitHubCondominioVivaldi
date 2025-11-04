// src/app/usuarioVivienda/reclamos/finalizados/page.jsx

"use client";
import * as React from "react";

// 🔹 Selector de rango de fechas
function DateRangeSelector({ onBuscar }) {
  const [inicio, setInicio] = React.useState("");
  const [fin, setFin] = React.useState("");

  React.useEffect(() => {
    if (inicio && fin) {
      onBuscar(inicio, fin);
    }
  }, [inicio, fin]); // ← 🔥 Ejecuta búsqueda automática

  return (
    <section className="flex absolute justify-center items-center px-0 pt-3.5 pb-2 bg-white rounded-xl h-[184px] left-[50px] top-[65px] w-[400px] max-md:relative max-md:left-0 max-md:mb-5 max-md:w-full">
      <div className="flex absolute left-0 top-3.5 shrink-0 justify-center items-center px-12 py-4 bg-white rounded-xl h-[162px] w-[400px]">
        <header className="absolute w-60 h-6 text-xl left-[46px] text-zinc-800 top-[15px]">
          Intervalo de fecha:*
        </header>

        <label className="absolute h-6 text-xl left-[46px] top-[59px]">Inicio:</label>
        <div className="flex absolute items-center px-4 py-3 w-60 h-12 bg-white rounded-lg border border-zinc-300 left-[114px] top-[47px]">
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="text-xl flex-1 text-neutral-700 bg-transparent border-none outline-none"
          />
        </div>

        <label className="absolute h-6 text-xl left-[46px] top-[111px]">Fin:</label>
        <div className="flex absolute items-center px-4 py-3 w-60 h-12 bg-white rounded-lg border border-zinc-300 left-[114px] top-[99px]">
          <input
            type="date"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
            className="text-xl flex-1 text-neutral-700 bg-transparent border-none outline-none"
          />
        </div>

        <input type="hidden" id="inicio-fecha" value={inicio} readOnly />
        <input type="hidden" id="fin-fecha" value={fin} readOnly />
      </div>
    </section>
  );
}

// 🔹 Tabla de reclamos finalizados
function ReclamosTable({ data, onSelect, selectedId, mensajeError }) {
  return (
    <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in absolute left-[500px] top-[65px] w-[914px] h-[351px]">
      <div className="overflow-x-auto">
        <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
          {/* Mensaje de error */}
          {mensajeError && (
            <div className="text-red-600 text-center font-semibold mb-2 animate-pulse">
              {mensajeError}
            </div>
          )}

          <table className="border border-[var(--Mi-cafe-oscuro)] rounded-lg overflow-hidden w-full">
            <thead className="bg-mi-gradiante-azul text-[var(--Mi-blanco)] Mi_texto_negrita_20 text-center sticky top-0">
              <tr>
                <th className="px-4 py-3">Ver</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Asunto</th>
                <th className="px-4 py-3">Vivienda</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((r) => (
                  <tr
                    key={r._id}
                    className={`bg-mi-gradiante-blanco text-[var(--Mi-cafe-oscuro)] Mi_texto_20 hover:bg-gray-50 cursor-pointer ${
                      selectedId === r._id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => onSelect(r)}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedId === r._id}
                        onChange={() => onSelect(r)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(r.fechaResolucion).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-4 py-3 text-center">{r.titulo}</td>
                    <td className="px-4 py-3 text-center">
                      {r.vivienda?.numero || r.creadoPor?.usuario}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-[var(--Mi-gris)] italic"
                  >
                    No hay reclamos finalizados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 🔹 Histórico de conversación (sin cambios)
function ConversationHistory({ reclamo }) {
  if (!reclamo) return null;

  return (
    <section className="flex justify-center items-start w-full pl-125 py-120">
      <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 w-full max-w-[914px] mx-auto">
        <div className="mb-6">
          <h3 className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-2">Asunto:</h3>
          <input
            type="text"
            value={reclamo.titulo}
            readOnly
            className="Mi_texto_20 w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
          />
        </div>

        <h3 className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] mb-2">
          Histórico de conversación:
        </h3>
        <div className="Mi_texto_20 border border-gray-300 rounded-lg p-4 bg-gray-50 h-64 overflow-y-auto space-y-4">
          <p className="text-gray-600">
            {`Vivienda ${
              reclamo.vivienda?.numero ?? reclamo.creadoPor?.usuario ?? "sin identificar"
            }, ${new Date(reclamo.createdAt).toLocaleDateString("es-ES")}, ${new Date(
              reclamo.createdAt
            ).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`}
          </p>
          <p>{reclamo.descripcion}</p>

          {Array.isArray(reclamo.conversacion) &&
            reclamo.conversacion.map((c, i) => (
              <div key={i} className="border-t border-gray-300 pt-2">
                <p className="text-gray-600">
                  {c.autor === "admin" ? "Administrador" : "Usuario"} –{" "}
                  {new Date(c.fecha).toLocaleString("es-ES")}
                </p>
                <p>{c.mensaje}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

// 🔹 Página principal - Usuario Vivienda
export default function Page() {
  const [reclamos, setReclamos] = React.useState([]);
  const [reclamoSeleccionado, setReclamoSeleccionado] = React.useState(null);
  const [mensajeError, setMensajeError] = React.useState("");

  const buscar = async (inicio, fin) => {
    const usuarioId =
      typeof window !== "undefined" ? localStorage.getItem("usuarioId") : null;

    const limpiarYMostrar = (mensaje) => {
      setMensajeError(mensaje);
      setReclamos([]);
      setReclamoSeleccionado(null);
    };

    // 🔍 Validaciones
    if (!inicio || !fin || !usuarioId) {
      limpiarYMostrar("Por favor selecciona ambas fechas.");
      return;
    }

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    const hoy = new Date();

    if (isNaN(fechaInicio) || isNaN(fechaFin)) {
      limpiarYMostrar("Fechas inválidas.");
      return;
    }

    if (fechaInicio > fechaFin) {
      limpiarYMostrar("La fecha de inicio no puede ser mayor que la fecha final.");
      return;
    }

    const inicioSinTiempo = new Date(
      fechaInicio.getFullYear(),
      fechaInicio.getMonth(),
      fechaInicio.getDate()
    );
    const finSinTiempo = new Date(
      fechaFin.getFullYear(),
      fechaFin.getMonth(),
      fechaFin.getDate()
    );
    const hoySinTiempo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    if (inicioSinTiempo > hoySinTiempo || finSinTiempo > hoySinTiempo) {
      limpiarYMostrar("No puedes seleccionar fechas futuras.");
      return;
    }

    // ✅ Si pasa validación
    setMensajeError("");
    setReclamos([]);
    setReclamoSeleccionado(null);

    try {
      const res = await fetch(
        `/api/reclamos?estado=Finalizado&creadoPor=${usuarioId}&inicio=${inicio}&fin=${fin}`
      );
      const data = await res.json();

      if (!data?.reclamos || data.reclamos.length === 0) {
        limpiarYMostrar("No hay reclamos finalizados en ese rango de fechas.");
        return;
      }

      setReclamos(data.reclamos);
      setReclamoSeleccionado(null);
    } catch (err) {
      console.error("Error al buscar reclamos:", err);
      limpiarYMostrar("Ocurrió un error al consultar los reclamos. Intenta de nuevo.");
    }
  };

  return (
    <main className="relative h-[855px] w-[1395px]">
      <DateRangeSelector onBuscar={buscar} />
      <ReclamosTable
        data={reclamos}
        onSelect={setReclamoSeleccionado}
        selectedId={reclamoSeleccionado?._id}
        mensajeError={mensajeError}
      />
      <ConversationHistory reclamo={reclamoSeleccionado} />
    </main>
  );
}
