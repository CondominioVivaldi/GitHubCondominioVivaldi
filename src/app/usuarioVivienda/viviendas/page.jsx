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

         <div className="flex flex-col space-y-5 Mi_texto_20">
          <div className="flex flex-col">
            <label
              htmlFor="idVivienda"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              ID de vivienda:*
            </label>
            <p
              
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
        </div>
      </div>
    </div>
  );
}
