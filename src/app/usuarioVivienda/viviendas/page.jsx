// src/app/usuarioVivienda/viviendas/page.jsx

"use client";

import { useState, useEffect } from "react";

export default function MiViviendaPage() {
  const [viviendaActual, setViviendaActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchViviendaActual();
  }, []);

  const fetchViviendaActual = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Obtener el usuario actual para saber su idVivienda
      const userResponse = await fetch("/api/usuarios/actual");

      // Verificar si la respuesta es exitosa (previene SyntaxError en .json())
      if (!userResponse.ok) {
        // Si hay un 401, 404, 500, el servidor no pudo devolver el JSON esperado.
        throw new Error(
          `Error al obtener datos del usuario. Estado: ${userResponse.status}`
        );
      }

      const userData = await userResponse.json();

      // Verificar si la API devolvió éxito y si el objeto de usuario contiene el ID de la vivienda.
      // La API devuelve: { success: true, usuario: { usuario: "vivienda001", ... } }
      if (!userData.success || !userData.usuario?.usuario) {
        // En este caso, userData.usuario.usuario es el idVivienda (ej: "vivienda001")
        throw new Error(
          "No se pudo identificar la vivienda asociada a su usuario."
        );
      }

      // Definimos la variable que se usa para filtrar
      const idViviendaUsuario = userData.usuario.usuario;

      // 2. Obtener todas las viviendas
      const viviendasResponse = await fetch("/api/viviendas");
       if (!viviendasResponse.ok) {
        throw new Error(
          `Error al obtener lista de viviendas. Estado: ${viviendasResponse.status}`
        );
      }
      const viviendasData = await viviendasResponse.json();

      if (!viviendasData.success) {
        throw new Error("Error al cargar los datos de las viviendas.");
      }

      // 3. Filtrar para encontrar la vivienda de este usuario
      // Compara idVivienda (en la colección) con el nombre de usuario (vivienda001)
      const miVivienda = viviendasData.viviendas.find(
        (v) => v.idVivienda === idViviendaUsuario
      );

      if (!miVivienda) {
        throw new Error(
          "No se encontraron los datos para su vivienda específica."
        );
      }

      setViviendaActual(miVivienda);
    } catch (err) {
      console.error("Error fetching vivienda actual:", err);
      setError(err.message || "Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado ---

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="Mi_texto_20 text-gray-500">
          Cargando datos de su vivienda...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-100 text-red-800 p-6 rounded-lg max-w-md text-center">
          <p className="Mi_texto_negrita_20 mb-2">Error</p>
          <p className="Mi_texto_20">{error}</p>
        </div>
      </div>
    );
  }

  if (!viviendaActual) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="Mi_texto_20 text-gray-500">
          No se encontraron datos para su vivienda.
        </p>
      </div>
    );
  }

  // 2. Mostrar la información inmediatamente
  return (
    <div className="flex items-start justify-center px-4 sm:px-6 lg:px-8 py-10">
      {/* 1. No hay selector de vivienda, solo se muestran los datos */}
      <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
        <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-8 text-left">
          Datos de su vivienda: {viviendaActual.idVivienda}
        </h1>

        {/* MODO VISTA (único modo) */}
        <div className="flex flex-col space-y-5 Mi_texto_20">
          {/* Campos con estilo deshabilitado */}
          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              ID de vivienda:
            </label>
            <div className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center">
              {viviendaActual.idVivienda}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Dirección:
            </label>
            <div className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center">
              {viviendaActual.direccion}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">Modelo:</label>
            <div className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center">
              {viviendaActual.modeloCasa || "No especificado"}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Cantidad de personas:
            </label>
            <div className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center">
              {viviendaActual.cantidadPersonas}
            </div>
          </div>

          <div className="border-t border-[var(--Mi-gris)] pt-6">
            <h2 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-4">
              Condóminos
            </h2>
            {viviendaActual.condominosVinculados?.length > 0 ? (
              viviendaActual.condominosVinculados.map((vinculo, index) => (
                <div
                  key={index}
                  className="p-4 mb-4 relative border border-gray-200 rounded-lg"
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                        Condómino:
                      </label>
                      {/* Muestra datos poblados */}
                      <div className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center">
                        {vinculo.condominoId.numeroDocumento} -{" "}
                        {vinculo.condominoId.nombreCompleto}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
                        Tipo de inquilino:
                      </label>
                      <div className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 bg-slate-100 text-slate-700 min-h-[44px] flex items-center">
                        {vinculo.tipoInquilino}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">
                No hay condóminos vinculados a esta vivienda.
              </div>
            )}
          </div>

          {/* 3. No hay botones de Editar o Eliminar */}
        </div>
      </div>
    </div>
  );
}