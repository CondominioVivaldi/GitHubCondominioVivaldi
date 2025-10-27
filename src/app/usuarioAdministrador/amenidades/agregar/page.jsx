export default function AgregarAmenidad() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-mi-gradiante-blanco space-y-8">
      <div className="bg-[var(--Mi-blanco)] w-full max-w-xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col space-y-5 Mi_texto_20">
          <div className="flex flex-col">
            <label
              htmlFor="nombre"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Nombre amenidad:*
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Escribir..."
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--Mi-blanco)] w-full max-w-xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col space-y-5 Mi_texto_20">
          <div className="flex flex-col">
            <label
              htmlFor="requiereReserva"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              ¿Necesitas reserva?*
            </label>
            <select
              id="requiereReserva"
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-gris)]"
            >
              <option value="" disabled selected>
                Elegir...
              </option>
              <option value="sí">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[var(--Mi-blanco)] w-full max-w-xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col space-y-5 Mi_texto_20">
          <div className="flex flex-col">
            <label
              htmlFor="tiempoMaximo"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Tiempo máximo de reserva:*
            </label>
            <select
              id="tiempoMaximo"
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-gris)]"
            >
              <option value="" disabled selected>
                Elegir...
              </option>
              <option value="1 hora">1 hora</option>
              <option value="2 horas">2 horas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          type="button"
          className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-md hover:opacity-90 transition-opacity"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
