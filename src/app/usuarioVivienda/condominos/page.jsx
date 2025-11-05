// src/app/usuarioVivienda/condominos/page.jsx

"use client";

import { useEffect, useState } from "react";

export default function VerMisDatos() {
  // Estados para los datos del condómino
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");

  // Estados de carga y error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCondominoData() {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Obtener los datos del usuario actual (de la sesión)
        // Este endpoint AHORA devuelve el condominoId correcto
        const resUser = await fetch("/api/usuarios/actual");
        if (!resUser.ok) {
          throw new Error("No se pudo obtener la información del usuario.");
        }
        const dataUser = await resUser.json();

        // Verificamos que la API haya devuelto los datos
        if (!dataUser.success || !dataUser.usuario) {
          throw new Error(
            dataUser.message || "Error al obtener datos del usuario."
          );
        }

        const condominoId = dataUser.usuario.condominoId;

        if (!condominoId) {
          // ESTE ES EL ERROR SI NO SE ENCUENTRA UN "Propietario"
          throw new Error(
            "No se encontró un condómino con 'Tipo: Propietario' vinculado a su vivienda."
          );
        }

        // 2. Obtener los datos del condómino usando el ID obtenido
        const resCondomino = await fetch(`/api/condominos/${condominoId}`);
        if (!resCondomino.ok) {
          throw new Error(
            "No se pudo obtener los datos del condómino (Propietario)."
          );
        }
        const dataCondomino = await resCondomino.json();

        // 3. Poblar el estado con los datos encontrados
        const condomino = dataCondomino.found;
        if (condomino) {
          setTipoDocumento(condomino.tipoDocumento || "");
          setNumeroDocumento(condomino.numeroDocumento || "");
          setNombreCompleto(condomino.nombreCompleto || "");
          setFechaNacimiento(condomino.fechaNacimiento || "");
          setCorreo(condomino.correoElectronico || "");
          setTelefono(condomino.numeroTelefono || "");
          setFechaEntrada(condomino.fechaEntrada || "");
          setFechaSalida(condomino.fechaSalida || "");
        } else {
          throw new Error(
            `No se encontró el perfil del condómino en la colección 'condominos' (ID: ${condominoId}).`
          );
        }
      } catch (err) {
        console.error("Error en fetchCondominoData:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCondominoData();
  }, []); // Se ejecuta solo una vez al cargar la página

  const selectTextColor =
    tipoDocumento === ""
      ? "text-[var(--Mi-gris)]"
      : "text-[var(--Mi-cafe-oscuro)]";

  // --- Renderizado ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] animate-pulse">
          Cargando sus datos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-10 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center shadow-md max-w-2xl">
          <strong className="font-bold Mi_texto_negrita_20">Error:</strong>
          <span className="block Mi_texto_20 mt-2"> {error}</span>
          <p className="Mi_texto_pequeño_16 mt-3 text-gray-700">
            Por favor, contacte al administrador si cree que esto es un error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
        <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-8 text-left">
          Mis datos personales (Propietario)
        </h1>

        <form className="flex flex-col space-y-5 Mi_texto_20">
          {/* --- Todos los campos están deshabilitados (disabled) --- */}

          <div className="flex flex-col">
            <label
              htmlFor="tipoDocumento"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Tipo de documento:
            </label>
            <select
              id="tipoDocumento"
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none ${selectTextColor} bg-gray-100 cursor-not-allowed`}
              value={tipoDocumento}
              onChange={() => {}} // No hacer nada al cambiar
              disabled // Deshabilitado
            >
              <option value="" disabled>
                Seleccione una opción:
              </option>
              <option value="DPI">DPI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="numeroDocumento" className="mb-1">
              Número de documento:
            </label>
            <input
              id="numeroDocumento"
              type="text"
              placeholder="0000000000000"
              value={numeroDocumento}
              readOnly // Deshabilitado
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="nombreCompleto" className="mb-1">
              Nombre completo:
            </label>
            <input
              id="nombreCompleto"
              type="text"
              placeholder="Bruce Lee"
              value={nombreCompleto}
              readOnly // Deshabilitado
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="fechaNacimiento" className="mb-1">
              Fecha de nacimiento:
            </label>
            <input
              id="fechaNacimiento"
              type="date"
              value={
                fechaNacimiento
                  ? new Date(fechaNacimiento).toLocaleDateString("en-CA")
                  : ""
              }
              readOnly // Deshabilitado
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="correo" className="mb-1">
              Correo electrónico:
            </label>
            <input
              id="correo"
              type="email"
              placeholder="brucelee@yahoo.com"
              value={correo}
              readOnly // Deshabilitado
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="telefono" className="mb-1">
              Número de teléfono:
            </label>
            <input
              id="telefono"
              type="text"
              placeholder="00000000"
              value={telefono}
              readOnly // Deshabilitado
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="fechaEntrada" className="mb-1">
              Fecha de entrada:
            </label>
            <input
              id="fechaEntrada"
              type="date"
              value={
                fechaEntrada
                  ? new Date(fechaEntrada).toLocaleDateString("en-CA")
                  : ""
              }
              readOnly // Deshabilitado
              className="border border-[var(--Mi-gis)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="fechaSalida" className="mb-1">
              Fecha de salida:
            </label>
            <input
              id="fechaSalida"
              type="date"
              value={
                fechaSalida
                  ? new Date(fechaSalida).toLocaleDateString("en-CA")
                  : ""
              }
              readOnly // Deshabilitado
              className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* --- Botones eliminados --- */}
        </form>
      </div>
    </div>
  );
}