"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgregarCondomino() {
  const params = useParams();

  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});

  async function fetchDetails() {
    const response = await fetch(`/api/condominos/${params.id}`);
    const data = await response.json();

    const condomino = data.found;

    setTipoDocumento(condomino.tipoDocumento);
    setNumeroDocumento(condomino.numeroDocumento);
    setNombreCompleto(condomino.nombreCompleto);
    setFechaNacimiento(condomino.fechaNacimiento);
    setCorreo(condomino.correoElectronico);
    setTelefono(condomino.numeroTelefono);
    setFechaEntrada(condomino.fechaEntrada);
    setFechaSalida(condomino.fechaSalida);
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  const selectTextColor =
    tipoDocumento === ""
      ? "text-[var(--Mi-gris)]"
      : "text-[var(--Mi-cafe-oscuro)]";

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-8 text-left">
          Datos personales
        </h1>

        <form className="flex flex-col space-y-5 Mi_texto_20">
          <div className="flex flex-col">
            <label
              htmlFor="tipoDocumento"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Tipo de documento:*
            </label>
            <select
              id="tipoDocumento"
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${selectTextColor} ${errors.tipoDocumento ? "border-red-500" : ""}`}
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
            >
              <option value="" disabled>
                Seleccione una opción:
              </option>
              <option value="DPI">DPI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
            {errors.tipoDocumento && (
              <span className="text-red-500 text-sm mt-1">
                {errors.tipoDocumento}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="numeroDocumento" className="mb-1">
              Número de documento:*
            </label>
            <input
              id="numeroDocumento"
              type="text"
              placeholder="0000000000000"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.numeroDocumento ? "border-red-500" : ""}`}
            />
            {errors.numeroDocumento && (
              <span className="text-red-500 text-sm mt-1">
                {errors.numeroDocumento}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="nombreCompleto" className="mb-1">
              Nombre completo:*
            </label>
            <input
              id="nombreCompleto"
              type="text"
              placeholder="Bruce Lee"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.nombreCompleto ? "border-red-500" : ""}`}
            />
            {errors.nombreCompleto && (
              <span className="text-red-500 text-sm mt-1">
                {errors.nombreCompleto}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="fechaNacimiento" className="mb-1">
              Fecha de nacimiento:*
            </label>
            <input
              id="fechaNacimiento"
              type="date"
              value={new Date(fechaNacimiento).toLocaleDateString("en-CA")}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.fechaNacimiento ? "border-red-500" : ""}`}
            />
            {errors.fechaNacimiento && (
              <span className="text-red-500 text-sm mt-1">
                {errors.fechaNacimiento}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="correo" className="mb-1">
              Correo electrónico:*
            </label>
            <input
              id="correo"
              type="email"
              placeholder="brucelee@yahoo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.correo ? "border-red-500" : ""}`}
            />
            {errors.correo && (
              <span className="text-red-500 text-sm mt-1">{errors.correo}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="telefono" className="mb-1">
              Número de teléfono:*
            </label>
            <input
              id="telefono"
              type="text"
              placeholder="00000000"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.telefono ? "border-red-500" : ""}`}
            />
            {errors.telefono && (
              <span className="text-red-500 text-sm mt-1">
                {errors.telefono}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="fechaEntrada" className="mb-1">
              Fecha de entrada:*
            </label>
            <input
              id="fechaEntrada"
              type="date"
              value={new Date(fechaEntrada).toLocaleDateString("en-CA")}
              onChange={(e) => setFechaEntrada(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.fechaEntrada ? "border-red-500" : ""}`}
            />
            {errors.fechaEntrada && (
              <span className="text-red-500 text-sm mt-1">
                {errors.fechaEntrada}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="fechaSalida" className="mb-1">
              Fecha de salida:
            </label>
            <input
              id="fechaSalida"
              type="date"
              value={new Date(fechaSalida).toLocaleDateString("en-CA")}
              onChange={(e) => setFechaSalida(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${errors.fechaSalida ? "border-red-500" : ""}`}
            />
            {errors.fechaSalida && (
              <span className="text-red-500 text-sm mt-1">
                {errors.fechaSalida}
              </span>
            )}
          </div>

          {submitMessage && (
            <div
              className={`text-center p-3 rounded-lg ${submitMessage.includes("exitosamente") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {submitMessage}
            </div>
          )}

          <div className="flex justify-center pt-6 gap-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-lg shadow-md transition-opacity ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-lg shadow-md transition-opacity ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              Editar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-lg shadow-md transition-opacity ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              Eliminar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
