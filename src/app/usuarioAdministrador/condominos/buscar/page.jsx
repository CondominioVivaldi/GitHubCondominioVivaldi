"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function BuscarCondominos() {
  const router = useRouter();
  const [criterio, setCriterio] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [condominos, setCondominos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const selectTextColor =
    criterio === "" ? "text-[var(--Mi-gris)]" : "text-[var(--Mi-cafe-oscuro)]";
  const inputTextColor =
    busqueda === "" ? "text-[var(--Mi-gris)]" : "text-[var(--Mi-cafe-oscuro)]";

  const fetchCondominos = async (searchCriterio = "", searchBusqueda = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchCriterio && searchBusqueda) {
        params.append("criterio", searchCriterio);
        params.append("busqueda", searchBusqueda);
      }

      const response = await fetch(`/api/condominos?${params}`);
      const data = await response.json();

      if (data.success) {
        setCondominos(data.condominos);
        setHasSearched(true);
      } else {
        setCondominos([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Error fetching condominos:", error);
      setCondominos([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchCondominos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (criterio && busqueda.trim()) {
      fetchCondominos(criterio, busqueda.trim());
    }
  };

  const handleReset = () => {
    setCriterio("");
    setBusqueda("");
    setHasSearched(false);
    fetchCondominos();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-GT");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-8 py-10 space-y-8 bg-mi-gradiante-blanco">
      <div className="bg-[var(--Mi-blanco)] w-[700px] max-w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
        <form
          onSubmit={handleSearch}
          className="flex flex-col space-y-6 Mi_texto_20 text-[var(--Mi-cafe-oscuro)]"
        >
          <div className="flex flex-col">
            <label htmlFor="criterio" className="mb-1">
              Buscar por:*
            </label>
            <select
              id="criterio"
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${selectTextColor}`}
              value={criterio}
              onChange={(e) => {
                if (e.target.value === "Todos") {
                  handleReset();
                }

                setCriterio(e.target.value);
              }}
            >
              <option value="" disabled style={{ color: "var(--Mi-gris)" }}>
                Elegir...
              </option>
              <option value="ID" style={{ color: "var(--Mi-cafe-oscuro)" }}>
                ID
              </option>
              <option value="Nombre" style={{ color: "var(--Mi-cafe-oscuro)" }}>
                Nombre
              </option>
              <option value="Todos" style={{ color: "var(--Mi-cafe-oscuro)" }}>
                Todos
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="busqueda" className="mb-1">
              Escribir ID / Nombre:*
            </label>
            <input
              id="busqueda"
              type="text"
              placeholder="Escribir..."
              disabled={criterio === "Todos"}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${inputTextColor}`}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              disabled={!criterio || !busqueda.trim() || loading}
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="bg-[var(--Mi-blanco)] w-[700px] max-w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--Mi-cafe-oscuro)]"></div>
            <span className="ml-3 text-[var(--Mi-cafe-oscuro)] Mi_texto_20">
              Cargando...
            </span>
          </div>
        </div>
      )}

      {!loading && hasSearched && condominos.length === 0 && (
        <div className="bg-[var(--Mi-blanco)] w-[700px] max-w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
          <div className="text-center py-8">
            <p className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20">
              No se encontraron condominos con los criterios de búsqueda.
            </p>
          </div>
        </div>
      )}

      {!loading && (!hasSearched || condominos.length > 0) && (
        <div className="bg-[var(--Mi-blanco)] w-[700px] max-w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
          <div className="mb-4">
            <p className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20">
              {initialLoad
                ? "Cargando condominos..."
                : `${condominos.length} condomino(s) encontrado(s)`}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="border border-[var(--Mi-cafe-oscuro)] rounded-lg overflow-hidden w-full">
              <thead className="bg-mi-gradiante-azul text-[var(--Mi-blanco)] Mi_texto_negrita_20 text-center">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Documento</th>
                </tr>
              </thead>
              <tbody>
                {condominos.map((condomino, i) => (
                  <tr
                    key={condomino._id}
                    className={`${i % 2 === 0 ? "bg-mi-gradiante-blanco" : "bg-white"} text-[var(--Mi-cafe-oscuro)] Mi_texto_20 hover:bg-gray-50 pointer`}
                    onClick={() => router.push("buscar/" + condomino._id)}
                  >
                    <td className="px-4 py-3 text-center">
                      {condomino.nombreCompleto}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {condomino.numeroDocumento}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
