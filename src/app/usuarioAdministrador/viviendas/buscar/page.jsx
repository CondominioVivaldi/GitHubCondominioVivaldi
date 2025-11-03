// src/app/usuarioAdministrador/viviendas/buscar/page.jsx
"use client";

import { useState, useEffect } from "react";

export default function AgregarVivienda() {
  const [condominos, setCondominos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [loadingCondominos, setLoadingCondominos] = useState(false);
  const [viviendas, setviviendas] = useState([]);
  const [viviendaSeleccionada, setViviendaSeleccionada] = useState({});
  const [modoEdicionActivo, setModoEdicionActivo] = useState(false)


  // variables de formulario de editar
  const [idVivienda, setIdVivienda] = useState("");
  const [direccion, setDireccion] = useState("");
  const [modeloCasa, setModeloCasa] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState("");
  const [condominosVinculados, setCondominosVinculados] = useState([]);


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
  useEffect(() => {
    fetchviviendas();
  }, []);

  const fetchviviendas = async () => {
    try {
      const response = await fetch("/api/viviendas");
      const data = await response.json();
      if (data.success) {
        setviviendas(data.viviendas);


        for (const vivienda of data.viviendas) {
          if (vivienda) {
            setViviendaSeleccionada({
              _id: vivienda._id,
              idVivienda: vivienda.idVivienda,
              direccion: vivienda.direccion,
              modeloCasa: vivienda.modeloCasa,
              cantidadPersonas: vivienda.cantidadPersonas,
              condominosVinculados: vivienda.condominosVinculados || [],
            })

            return
          }
        }
      }
    } catch (error) {
      console.error("Error fetching viviendas:", error);
    } finally {

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
          condominosVinculados: condominosVinculados.filter(
            (c) => c.condominoId && c.tipoInquilino,
          ),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("Vivienda agregada exitosamente");
        clearForm();


        // limpiar todos los campos
        setIdVivienda("");
        setDireccion("");
        setModeloCasa("");
        setCantidadPersonas("");
        setCondominosVinculados([]);
        setModoEdicionActivo(false)


        await fetchviviendas();

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

    <div className="flex items-start justify-center px-4 sm:px-6 lg:px-8 py-10 gap-8">
      <div className="bg-[var(--Mi-blanco)] w-[400px] max-w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in h-[162px]">
        <div className="flex flex-col">
          <label className="mb-1">
            Ingrese ID vivienda
          </label>
          <select
            onChange={(e) => {
              for (const vivienda of viviendas) {
                if (vivienda.idVivienda === e.target.value) {
                  setViviendaSeleccionada({
                    _id: vivienda._id,
                    idVivienda: vivienda.idVivienda,
                    direccion: vivienda.direccion,
                    modeloCasa: vivienda.modeloCasa,
                    cantidadPersonas: vivienda.cantidadPersonas,
                    condominosVinculados: vivienda.condominosVinculados || [],
                  })
                }
              }
            }
            }
            className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)]"
          >
            {viviendas?.map((v, index) => (<option key={index} value={v.idVivienda}>{v.idVivienda}</option>))}
          </select>
        </div>
      </div>
      <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-8 text-left">
          Datos de vivienda:

        </h1>

        {modoEdicionActivo ? <div>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5 Mi_texto_20">
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
                disabled={isSubmitting}
                id="direccion"
                type="text"
                placeholder="Escribir"
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
                disabled={isSubmitting}
                id="modeloCasa"
                type="text"
                placeholder="Escribir"
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
                className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.cantidadPersonas ? "border-red-500" : ""}`}
              />
            </div>

            <div className="border-t border-[var(--Mi-gris)] pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)]">
                  Condóminos
                </h2>
              </div>
              {condominosVinculados.map((vinculo, index) => (
                <div key={index} className="p-4 mb-4 relative">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                        Condomino:
                      </label>
                      <select
                        value={vinculo.condominoId.numeroDocumento}
                        onChange={(e) =>
                          setCondominosVinculados((prev) => {
                            const updated = [...prev];
                            updated[index].condominoId.numeroDocumento = e.target.value;
                            return updated;
                          })
                        }
                        className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)]"
                      >
                        <option value="">Seleccione un condómino</option>
                        {condominos.map((condomino, index) => (
                          <option
                            key={index}
                            value={condomino.numeroDocumento}
                          >
                            {condomino.numeroDocumento}
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
                          setCondominosVinculados((prev) => {
                            const updated = [...prev];
                            updated[index].tipoInquilino = e.target.value;
                            return updated;
                          }
                          )}
                        className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)]"
                      >
                        <option value="Propietario">Propietario</option>
                        <option value="Arrendatario">Arrendatario</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 justify-center mt-6">
                <button
                  type="button"
                  className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-32 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300"
                  onClick={async () => {
                    setModoEdicionActivo(false)

                    // limpiar todos los campos
                    setIdVivienda("");
                    setDireccion("");
                    setModeloCasa("");
                    setCantidadPersonas("");
                    setCondominosVinculados([]);

                    await fetchviviendas();
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-32 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300"
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>

        </div> : <div className="flex flex-col space-y-5 Mi_texto_20">
          <div className="flex flex-col">
            <label
              htmlFor="idVivienda"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              ID de vivienda:*
            </label>
            <p
              disabled={modoEdicionActivo === false}
              id="idVivienda"
              type="text"
              placeholder="Escribir"
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.idVivienda ? "border-red-500" : ""}`}
            >{viviendaSeleccionada.idVivienda}</p>

          </div>
          <div className="flex flex-col">
            <label
              htmlFor="direccion"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Dirección:*
            </label>
            <p
              disabled={modoEdicionActivo === false}
              id="direccion"
              type="text"
              placeholder="Escribir"


              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.direccion ? "border-red-500" : ""}`}
            >{viviendaSeleccionada.direccion}</p>

          </div>
          <div className="flex flex-col">
            <label
              htmlFor="modeloCasa"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Modelo:*
            </label>
            <p
              disabled={modoEdicionActivo === false}
              id="modeloCasa"
              type="text"
              placeholder="Escribir"



              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            >{viviendaSeleccionada.modeloCasa ?? "Modelo C"}</p>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="cantidadPersonas"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Cantidad de personas:*
            </label>
            <p
              disabled={modoEdicionActivo === false}
              id="cantidadPersonas"
              type="number"
              min="1"
              placeholder="Escribir"
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.cantidadPersonas ? "border-red-500" : ""}`}
            >

              {viviendaSeleccionada.cantidadPersonas}
            </p>
          </div>
          <div className="border-t border-[var(--Mi-gris)] pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)]">
                Condóminos
              </h2>
            </div>

            {viviendaSeleccionada.condominosVinculados?.map((vinculo, index) => (
              <div key={index} className="p-4 mb-4 relative">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                      Condomino:
                    </label>
                    <p

                      disabled={modoEdicionActivo === false}

                      className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)]"

                    >
                      {vinculo.condominoId.numeroDocumento}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                      Tipo de inquilino:
                    </label>
                    <p


                      className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)]"
                    >
                      {vinculo.tipoInquilino}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>


          <div className="flex gap-4 justify-center">
            <button
              type="button"
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-32 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300"
              onClick={() => {
                // Inicializar los campos del formulario con los datos actuales de la vivienda seleccionada
                setIdVivienda(viviendaSeleccionada.idVivienda);
                setDireccion(viviendaSeleccionada.direccion);
                setModeloCasa(viviendaSeleccionada.modeloCasa);
                setCantidadPersonas(viviendaSeleccionada.cantidadPersonas);
                setCondominosVinculados(viviendaSeleccionada.condominosVinculados || []);

                setModoEdicionActivo(true)
              }}
            >
              Editar
            </button>
            <button
              type="button"
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-32 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300"
              onClick={async () => {
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

                    for (const vivienda of viviendas) {
                      if (vivienda._id !== viviendaSeleccionada._id) {
                        setViviendaSeleccionada({
                          _id: vivienda._id,
                          idVivienda: vivienda.idVivienda,
                          direccion: vivienda.direccion,
                          modeloCasa: vivienda.modeloCasa,
                          cantidadPersonas: vivienda.cantidadPersonas,
                          condominosVinculados: vivienda.condominosVinculados || [],
                        })

                        break
                      }
                    }

                    await fetchviviendas();

                  } else {
                    setSubmitMessage(data.message || "Error al agregar vivienda");
                  }
                } catch (error) {
                  setSubmitMessage("Error de conexión. Intente nuevamente.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              Eliminar
            </button>
          </div>
        </div>}
      </div>
    </div>
  );
}
