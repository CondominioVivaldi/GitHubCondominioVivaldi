"use client";

import { useState, useEffect } from "react";

export default function AgregarVivienda() {
  const [idVivienda, setIdVivienda] = useState("");
  const [direccion, setDireccion] = useState("");
  const [modeloCasa, setModeloCasa] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState("");
  const [condominos, setCondominos] = useState([]);
  const [condominosVinculados, setCondominosVinculados] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [loadingCondominos, setLoadingCondominos] = useState(false);

  useEffect(() => {
    fetchCondominos();
  }, []);

  const fetchCondominos = async () => {
    setLoadingCondominos(true);
    try {
      const response = await fetch("/api/condominos");
      const data = await response.json();
      if (data.success) {
        setCondominos(data.condominos);
      }
    } catch (error) {
      console.error("Error fetching condominos:", error);
    } finally {
      setLoadingCondominos(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!idVivienda.trim())
      newErrors.idVivienda = "ID de vivienda es requerido";
    if (!direccion.trim()) newErrors.direccion = "Dirección es requerida";
    if (!cantidadPersonas)
      newErrors.cantidadPersonas = "Cantidad de personas es requerida";

    if (
      cantidadPersonas &&
      (isNaN(cantidadPersonas) || parseInt(cantidadPersonas) < 1)
    ) {
      newErrors.cantidadPersonas = "Debe ser un número mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addCondomino = () => {
    setCondominosVinculados([
      ...condominosVinculados,
      { condominoId: "", tipoInquilino: "" },
    ]);
  };

  const removeCondomino = (index) => {
    const updated = condominosVinculados.filter((_, i) => i !== index);
    setCondominosVinculados(updated);
  };

  const updateCondomino = (index, field, value) => {
    const updated = [...condominosVinculados];
    updated[index][field] = value;
    setCondominosVinculados(updated);
  };

  const clearForm = () => {
    setIdVivienda("");
    setDireccion("");
    setModeloCasa("");
    setCantidadPersonas("");
    setCondominosVinculados([]);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/viviendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idVivienda,
          direccion,
          modeloCasa: modeloCasa || null,
          cantidadPersonas,
          condominosVinculados: condominosVinculados.filter(
            (c) => c.condominoId && c.tipoInquilino,
          ),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("Vivienda agregada exitosamente");
        clearForm();
      } else {
        setSubmitMessage(data.message || "Error al agregar vivienda");
      }
    } catch (error) {
      setSubmitMessage("Error de conexión. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-8 text-left">
          Datos de vivienda:
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-5 Mi_texto_20"
        >
          <div className="flex flex-col">
            <label
              htmlFor="idVivienda"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              ID de vivienda:*
            </label>
            <input
              id="idVivienda"
              type="text"
              placeholder="Vivienda304"
              value={idVivienda}
              onChange={(e) => setIdVivienda(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.idVivienda ? "border-red-500" : ""}`}
            />
            {errors.idVivienda && (
              <span className="text-red-500 text-sm mt-1">
                {errors.idVivienda}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="direccion"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Dirección:*
            </label>
            <input
              id="direccion"
              type="text"
              placeholder="4a av 4-58 zona 4"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.direccion ? "border-red-500" : ""}`}
            />
            {errors.direccion && (
              <span className="text-red-500 text-sm mt-1">
                {errors.direccion}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="modeloCasa"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Modelo:*
            </label>
            <input
              id="modeloCasa"
              type="text"
              placeholder="Premium"
              value={modeloCasa}
              onChange={(e) => setModeloCasa(e.target.value)}
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="cantidadPersonas"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Cantidad de personas:*
            </label>
            <input
              id="cantidadPersonas"
              type="number"
              min="1"
              placeholder="1"
              value={cantidadPersonas}
              onChange={(e) => setCantidadPersonas(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.cantidadPersonas ? "border-red-500" : ""}`}
            />
            {errors.cantidadPersonas && (
              <span className="text-red-500 text-sm mt-1">
                {errors.cantidadPersonas}
              </span>
            )}
          </div>

          <div className="border-t border-[var(--Mi-gris)] pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)]">
                Condóminos
              </h2>
              <button
                type="button"
                onClick={addCondomino}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                + Agregar
              </button>
            </div>

            {condominosVinculados.map((vinculo, index) => (
              <div
                key={index}
                className="border border-[var(--Mi-gris)] rounded-lg p-4 mb-4 relative"
              >
                <button
                  type="button"
                  onClick={() => removeCondomino(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                >
                  ×
                </button>

                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                      Condomino:
                    </label>
                    <select
                      value={vinculo.condominoId}
                      onChange={(e) =>
                        updateCondomino(index, "condominoId", e.target.value)
                      }
                      className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)]"
                      disabled={loadingCondominos}
                    >
                      <option value="">
                        {loadingCondominos
                          ? "Cargando..."
                          : "Seleccione un condomino"}
                      </option>
                      {condominos.map((condomino) => (
                        <option key={condomino._id} value={condomino._id}>
                          {condomino.numeroDocumento} -{" "}
                          {condomino.nombreCompleto}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                      Tipo de inquilino:
                    </label>
                    <select
                      value={vinculo.tipoInquilino}
                      onChange={(e) =>
                        updateCondomino(index, "tipoInquilino", e.target.value)
                      }
                      className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)]"
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="Propietario">Propietario</option>
                      <option value="Arrendatario">Arrendatario</option>
                      <option value="Ocupante">Ocupante</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {submitMessage && (
            <div
              className={`text-center p-3 rounded-lg ${submitMessage.includes("exitosamente") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {submitMessage}
            </div>
          )}

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-md transition-opacity ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
