// src/app/usuarioVivienda/reclamos/finalizados/page.jsx

// export default function ReclamosFinalizados() {
//  return (
//    <div className="flex justify-center items-center h-full">
//      <h1 className="Mi_H2_40 text-[var(--Mi-cafe-oscuro)] text-center">
//        Sistema del condómino - Reclamos Finalizados
//      </h1>
//    </div>
//  );
// }

"use client";
import * as React from "react";

// 🔹 Selector de rango de fechas
function DateRangeSelector({ onBuscar }) {
  const [inicio, setInicio] = React.useState("");
  const [fin, setFin] = React.useState("");

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

// 🔹 Icono de búsqueda
function ActionIcons({ onBuscar }) {
  const handleBuscar = () => {
    const inicio = document.getElementById("inicio-fecha")?.value;
    const fin = document.getElementById("fin-fecha")?.value;
    if (inicio && fin) onBuscar(inicio, fin);
  };

  return (
    <div className="flex items-center gap-3 mb-3">
      {/* 👁️ Buscar */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleBuscar}
        className="cursor-pointer hover:scale-110 transition-transform"
      >
        <g clipPath="url(#clip0)">
          <path
            d="M1.33398 16C1.33398 16 6.66732 5.33337 16.0007 5.33337C25.334 5.33337 30.6673 16 30.6673 16C30.6673 16 25.334 26.6667 16.0007 26.6667C6.66732 26.6667 1.33398 16 1.33398 16Z"
            stroke="#1E1E1E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.0007 20C18.2098 20 20.0007 18.2092 20.0007 16C20.0007 13.7909 18.2098 12 16.0007 12C13.7915 12 12.0007 13.7909 12.0007 16C12.0007 18.2092 13.7915 20 16.0007 20Z"
            stroke="#1E1E1E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// 🔹 Tabla de reclamos finalizados
function ReclamosTable({ data, onBuscar, onSelect, selectedId, mensajeError }) {
  return (
    <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in absolute left-[500px] top-[65px] w-[914px] h-[351px]">
      <div className="overflow-x-auto">
        <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
          <div className="flex items-center justify-start mb-2">
            <ActionIcons onBuscar={onBuscar} />
          </div>

          {/* Mensaje de error */}
          {mensajeError && (
            <div className="text-red-600 text-center font-semibold mb-2 animate-pulse">
              {mensajeError}
            </div>
          )}

          <table className="border border-[var(--Mi-cafe-oscuro)] rounded-lg overflow-hidden w-full">
            <thead className="bg-mi-gradiante-azul text-[var(--Mi-blanco)] Mi_texto_negrita_20 text-center sticky top-0">
              <tr>
                <th className="px-4 py-3">Acción</th>
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

// 🔹 Histórico de conversación
function ConversationHistory({ reclamo }) {
  if (!reclamo) return null;

  return (
    <section className="flex justify-start items-start w-full pl-125 py-120">
      <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 w-full max-w-[700px]">
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
    const usuarioId = typeof window !== "undefined" ? localStorage.getItem("usuarioId") : null;

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

    const inicioSinTiempo = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
    const finSinTiempo = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());
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
        onBuscar={buscar}
        onSelect={setReclamoSeleccionado}
        selectedId={reclamoSeleccionado?._id}
        mensajeError={mensajeError}
      />
      <ConversationHistory reclamo={reclamoSeleccionado} />
    </main>
  );
}
