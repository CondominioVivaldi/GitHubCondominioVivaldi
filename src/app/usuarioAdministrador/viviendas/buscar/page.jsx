// src/app/usuarioAdministrador/viviendas/buscar/page.jsx

"use client";

import { useState, useEffect } from "react";

export default function BuscarVivienda() {
  const [condominos, setCondominos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [loadingCondominos, setLoadingCondominos] = useState(false);
  const [viviendas, setViviendas] = useState([]);
  
  // 1. Estado inicial null para que no se muestre nada al inicio
  const [viviendaSeleccionada, setViviendaSeleccionada] = useState(null);
  const [modoEdicionActivo, setModoEdicionActivo] = useState(false);

  // 2. Estado para el campo de búsqueda (typeahead)
  const [searchTerm, setSearchTerm] = useState("");

  // variables de formulario de editar
  const [idVivienda, setIdVivienda] = useState("");
  const [direccion, setDireccion] = useState("");
  const [modeloCasa, setModeloCasa] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState("");
  const [condominosVinculados, setCondominosVinculados] = useState([]);

  useEffect(() => {
    fetchCondominos();
    fetchViviendas();
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

  const fetchViviendas = async () => {
    try {
      const response = await fetch("/api/viviendas");
      const data = await response.json();
      if (data.success) {
        setViviendas(data.viviendas);
        // 1. Eliminamos la lógica que seleccionaba la primera vivienda por defecto
      }
    } catch (error) {
      console.error("Error fetching viviendas:", error);
    }
  };

  // 2. Manejador para cuando se selecciona una vivienda del typeahead
  const handleSelectVivienda = (vivienda) => {
    setViviendaSeleccionada(vivienda); // Establece la vivienda completa
    setSearchTerm(""); // Limpia la búsqueda
    setModoEdicionActivo(false); // Asegura estar en modo vista
    setErrors({}); // Limpia errores anteriores
    setSubmitMessage(""); // Limpia mensajes anteriores
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

    // Validación para condóminos vinculados
    condominosVinculados.forEach((vinculo, index) => {
      if (!vinculo.condominoId) {
        newErrors[`condomino_${index}`] = "Debe seleccionar un condómino";
      }
      if (!vinculo.tipoInquilino) {
        newErrors[`inquilino_${index}`] = "Debe seleccionar un tipo de inquilino";
      }
    });

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

  // Lógica para GUARDAR (PATCH)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");

    if (!validateForm()) {
      setSubmitMessage("Por favor corrija los errores en el formulario.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/viviendas", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: viviendaSeleccionada._id,
          idVivienda,
          direccion,
          modeloCasa: modeloCasa || null,
          cantidadPersonas,
          // 3. Enviamos los datos limpios (solo IDs)
          condominosVinculados: condominosVinculados.filter(
            (c) => c.condominoId && c.tipoInquilino
          ),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("Vivienda actualizada exitosamente");
        clearForm();
        setModoEdicionActivo(false);
        
        // Actualizar la lista de viviendas y la vivienda seleccionada
        await fetchViviendas();
        // Actualizar la vivienda seleccionada con los nuevos datos
        setViviendaSeleccionada(data.vivienda); 

      } else {
        setSubmitMessage(data.message || "Error al actualizar vivienda");
        setErrors(data.errors || {});
      }
    } catch (error) {
      setSubmitMessage("Error de conexión. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lógica para ELIMINAR (DELETE)
  const handleDelete = async () => {
    if (!viviendaSeleccionada) return;

    // TODO: Reemplazar esto con un modal de confirmación
    const
 
confirmado = window.confirm("¿Está seguro de que desea eliminar esta vivienda? Esta acción no se puede deshacer.");
    if (!confirmado) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/viviendas", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: viviendaSeleccionada._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("Vivienda eliminada exitosamente");
        setViviendaSeleccionada(null); // Limpiamos la selección
        await fetchViviendas(); // Recargamos la lista de viviendas
        clearForm();
        setModoEdicionActivo(false);
      } else {
        setSubmitMessage(data.message || "Error al eliminar vivienda");
      }
    } catch (error) {
      setSubmitMessage("Error de conexión. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row items-start justify-center px-4 sm:px-6 lg:px-8 py-10 gap-8">
      {/* Columna de Búsqueda */}
      <div className="bg-[var(--Mi-blanco)] w-full lg:w-[400px] lg:max-w-sm rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
        <div className="flex flex-col relative">
          <label htmlFor="searchVivienda" className="mb-1 Mi_texto_20">
            Ingrese ID vivienda:
          </label>
          {/* 2. Componente Typeahead simple */}
          <input
            id="searchVivienda"
            type="text"
            placeholder="Buscar por ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)]"
          />
          {searchTerm && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-lg max-h-60 overflow-y-auto shadow-lg z-10 mt-1">
              {viviendas
                .filter((v) =>
                  v.idVivienda.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((vivienda) => (
                  <div
                    key={vivienda._id}
                    className="p-3 hover:bg-gray-100 cursor-pointer Mi_texto_pequeño_16"
                    onClick={() => handleSelectVivienda(vivienda)}
                  >
                    {vivienda.idVivienda}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Columna de Datos */}
      <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
        {/* 1. Mostrar solo si hay una vivienda seleccionada */}
        {!viviendaSeleccionada ? (
          <div className="text-center text-gray-500 Mi_texto_20 py-10">
            Seleccione una vivienda para ver los detalles.
          </div>
        ) : (
          <>
            <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-8 text-left">
              Datos de vivienda: {viviendaSeleccionada.idVivienda}
            </h1>

            {/* MENSAJE DE SUBMIT */}
            {submitMessage && (
              <div
                className={`mb-4 p-3 rounded-lg text-center ${
                  submitMessage.includes("exitosamente")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {submitMessage}
              </div>
            )}

            {modoEdicionActivo ? (
              // ----------------- MODO EDICIÓN -----------------
              <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-5 Mi_texto_20"
              >
                {/* --- Campos del Formulario --- */}
                <div className="flex flex-col">
                  <label
                    htmlFor="idVivienda"
                    className="mb-1 text-[var(--Mi-cafe-oscuro)]"
                  >
                    ID de vivienda:*
                  </label>
                  <input
                    disabled={isSubmitting}
                    id="idVivienda"
                    type="text"
                    placeholder="Escribir"
                    value={idVivienda}
                    onChange={(e) => setIdVivienda(e.target.value)}
                    className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
                      errors.idVivienda ? "border-red-500" : ""
                    }`}
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
                    disabled={isSubmitting}
                    id="direccion"
                    type="text"
                    placeholder="Escribir"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
                      errors.direccion ? "border-red-500" : ""
                    }`}
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
                    Modelo:
                  </label>
                  <input
                    disabled={isSubmitting}
                    id="modeloCasa"
                    type="text"
                    placeholder="Escribir (ej. Modelo A, Modelo B)"
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
                    disabled={isSubmitting}
                    id="cantidadPersonas"
                    type="number"
                    min="1"
                    placeholder="Escribir"
                    value={cantidadPersonas}
                    onChange={(e) => setCantidadPersonas(e.target.value)}
                    className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
                      errors.cantidadPersonas ? "border-red-500" : ""
                    }`}
                  />
                  {errors.cantidadPersonas && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.cantidadPersonas}
                    </span>
                  )}
                </div>

                {/* --- Sección Condóminos Vinculados --- */}
                <div className="border-t border-[var(--Mi-gris)] pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)]">
                      Condóminos
                    </h2>
                    <button
                      type="button"
                      onClick={addCondomino}
                      disabled={isSubmitting}
                      className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                    >
                      + Agregar
                    </button>
                  </div>
                  {condominosVinculados.map((vinculo, index) => (
                    <div
                      key={index}
                      className="p-4 mb-4 relative border border-gray-200 rounded-lg"
                    >
                      <button
                        type="button"
                        onClick={() => removeCondomino(index)}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                      >
                        &times;
                      </button>
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-col">
                          <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                            Condómino:
                          </label>
                          {/* 3. Select de Condóminos CORREGIDO */}
                          <select
                            value={vinculo.condominoId}
                            onChange={(e) =>
                              updateCondomino(index, "condominoId", e.target.value)
                            }
                            disabled={isSubmitting || loadingCondominos}
                            className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)] ${
                              errors[`condomino_${index}`] ? "border-red-500" : ""
                            }`}
                          >
                            <option value="">
                              {loadingCondominos
                                ? "Cargando..."
                                : "Seleccione un condómino"}
                            </option>
                            {condominos.map((condomino) => (
                              <option key={condomino._id} value={condomino._id}>
                                {condomino.numeroDocumento} -{" "}
                                {condomino.nombreCompleto}
                              </option>
                            ))}
                          </select>
                          {errors[`condomino_${index}`] && (
                            <span className="text-red-500 text-sm mt-1">
                              {errors[`condomino_${index}`]}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                            Tipo de inquilino:
                          </label>
                          {/* 3. Select de Tipo Inquilino CORREGIDO */}
                          <select
                            value={vinculo.tipoInquilino}
                            onChange={(e) =>
                              updateCondomino(index, "tipoInquilino", e.target.value)
                            }
                            disabled={isSubmitting}
                            className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)] ${
                              errors[`inquilino_${index}`] ? "border-red-500" : ""
                            }`}
                          >
                            <option value="">Seleccione un tipo</option>
                            <option value="Propietario">Propietario</option>
                            <option value="Arrendatario">Arrendatario</option>
                            <option value="Ocupante">Ocupante</option>
                          </select>
                          {errors[`inquilino_${index}`] && (
                            <span className="text-red-500 text-sm mt-1">
                              {errors[`inquilino_${index}`]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* --- Botones de Acción --- */}
                <div className="flex gap-4 justify-center mt-6">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-32 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300"
                    onClick={() => {
                      setModoEdicionActivo(false);
                      clearForm();
                      setSubmitMessage("");
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-32 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            ) : (
              // ----------------- MODO VISTA -----------------
              <div className="flex flex-col space-y-5 Mi_texto_20">
                {/* 4. Campos con estilo deshabilitado */}
                <div className="flex flex-col">
                  <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                    ID de vivienda:
                  </label>
                  <div
                    className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center"
                  >
                    {viviendaSeleccionada.idVivienda}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                    Dirección:
                  </label>
                  <div
                    className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center"
                  >
                    {viviendaSeleccionada.direccion}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                    Modelo:
                  </label>
                  <div
                    className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center"
                  >
                    {viviendaSeleccionada.modeloCasa || "No especificado"}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                    Cantidad de personas:
                  </label>
                  <div
                    className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center"
                  >
                    {viviendaSeleccionada.cantidadPersonas}
                  </div>
                </div>

                <div className="border-t border-[var(--Mi-gris)] pt-6">
                  <h2 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-4">
                    Condóminos
                  </h2>
                  {viviendaSeleccionada.condominosVinculados?.length > 0 ? (
                    viviendaSeleccionada.condominosVinculados.map(
                      (vinculo, index) => (
                        <div
                          key={index}
                          className="p-4 mb-4 relative border border-gray-200 rounded-lg"
                        >
                          <div className="flex flex-col space-y-4">
                            <div className="flex flex-col">
                              <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                                Condómino:
                              </label>
                              {/* 3. Muestra datos poblados */}
                              <div
                                className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center"
                              >
                                {vinculo.condominoId.numeroDocumento} -{" "}
                                {vinculo.condominoId.nombreCompleto}
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                                Tipo de inquilino:
                              </label>
                              <div
                                className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center"
                              >
                                {vinculo.tipoInquilino}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-gray-500">
                      No hay condóminos vinculados a esta vivienda.
                    </div>
                  )}
                </div>

                {/* --- Botones de Acción --- */}
                <div className="flex gap-4 justify-center mt-6">
                  <button
                    type="button"
                    className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-32 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300"
                    onClick={() => {
                      // 3. Poblar formulario para edición
                      setIdVivienda(viviendaSeleccionada.idVivienda);
                      setDireccion(viviendaSeleccionada.direccion);
                      setModeloCasa(viviendaSeleccionada.modeloCasa || "");
                      setCantidadPersonas(
                        viviendaSeleccionada.cantidadPersonas
                      );
                      
                      // 3. Transforma los datos poblados a un formato simple (solo IDs) para el estado del formulario
                      const simpleVinculos = (
                        viviendaSeleccionada.condominosVinculados || []
                      ).map((v) => ({
                        condominoId: v.condominoId._id, // Guarda solo el ID
                        tipoInquilino: v.tipoInquilino,
                      }));
                      setCondominosVinculados(simpleVinculos);

                      setModoEdicionActivo(true);
                      setSubmitMessage("");
                      setErrors({});
                    }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-32 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300"
                    onClick={handleDelete}
                  >
                    {isSubmitting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}