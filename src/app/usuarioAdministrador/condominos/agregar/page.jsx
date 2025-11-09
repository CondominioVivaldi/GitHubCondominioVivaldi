// src/app/usuarioAdministrador/condominos/agregar/page.jsx

"use client";

import { useState, useRef, useEffect } from "react";

export default function AgregarCondomino() {
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

  // Estado para rastrear si un campo ha sido "tocado" (desenfocado)
  const [touched, setTouched] = useState({});

  // Estado para rastrear la validez general del formulario
  const [isFormValid, setIsFormValid] = useState(false);

  // Lógica de validación extraída a una función pura.
  // Esta función solo calcula los errores, no actualiza el estado.
  const getFormErrors = () => {
    const newErrors = {};

    // --- Validación de campos requeridos ---
    if (!tipoDocumento)
      newErrors.tipoDocumento = "Tipo de documento es requerido";
    if (!numeroDocumento)
      newErrors.numeroDocumento = "Número de documento es requerido";
    if (!nombreCompleto)
      newErrors.nombreCompleto = "Nombre completo es requerido";
    if (!fechaNacimiento)
      newErrors.fechaNacimiento = "Fecha de nacimiento es requerida";
    if (!correo) newErrors.correo = "Correo electrónico es requerido";
    if (!telefono) newErrors.telefono = "Número de teléfono es requerido";
    if (!fechaEntrada) newErrors.fechaEntrada = "Fecha de entrada es requerida";

    // --- Validaciones específicas ---
    if (numeroDocumento) {
      const cleanDoc = numeroDocumento.replace(/\s+/g, "");
      if (tipoDocumento === "DPI" && !/^\d{13}$/.test(cleanDoc)) {
        newErrors.numeroDocumento = "DPI debe tener 13 dígitos";
      }
      if (tipoDocumento === "Pasaporte" && !/^\d{9}$/.test(cleanDoc)) {
        newErrors.numeroDocumento = "Pasaporte debe tener 9 dígitos";
      }
    }

    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = "Formato de correo inválido";
    }

    if (fechaNacimiento) {
      const birthDate = new Date(fechaNacimiento);
      // Ajuste para permitir la fecha de hoy, pero no fechas futuras
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (birthDate > today) {
        newErrors.fechaNacimiento =
          "La fecha de nacimiento no puede ser en el futuro";
      }
    }

    if (fechaSalida && fechaEntrada) {
      const entrada = new Date(fechaEntrada);
      const salida = new Date(fechaSalida);
      if (salida <= entrada) {
        newErrors.fechaSalida =
          "La fecha de salida debe ser posterior a la fecha de entrada";
      }
    }

    return newErrors;
  };

  // useEffect que se ejecuta cada vez que cambia un campo del formulario.
  // Su propósito es actualizar el estado 'isFormValid' para (des)habilitar el botón.
  useEffect(() => {
    const newErrors = getFormErrors();
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [
    tipoDocumento,
    numeroDocumento,
    nombreCompleto,
    fechaNacimiento,
    correo,
    telefono,
    fechaEntrada,
    fechaSalida,
  ]);

  // Función para validar y actualizar el estado de errores.
  const validateAndSetErrors = () => {
    const newErrors = getFormErrors();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador para el evento 'onBlur' (cuando el usuario sale del campo)
  const handleBlur = (e) => {
    const { id } = e.target;
    // Marca el campo como "tocado"
    setTouched((prev) => ({ ...prev, [id]: true }));
    // Valida el formulario para actualizar el error de este campo
    validateAndSetErrors();
  };

  const selectTextColor =
    tipoDocumento === ""
      ? "text-[var(--Mi-gris)]"
      : "text-[var(--Mi-cafe-oscuro)]";

  const fechaTextColor = (valorFecha) =>
    valorFecha === ""
      ? "text-[var(--Mi-gris)]"
      : "text-[var(--Mi-cafe-oscuro)]";

  const clearForm = () => {
    setTipoDocumento("");
    setNumeroDocumento("");
    setNombreCompleto("");
    setFechaNacimiento("");
    setCorreo("");
    setTelefono("");
    setFechaEntrada("");
    setFechaSalida("");
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como 'touched' para mostrar
    // todos los errores pendientes si el usuario intenta enviar
    setTouched({
      tipoDocumento: true,
      numeroDocumento: true,
      nombreCompleto: true,
      fechaNacimiento: true,
      correo: true,
      telefono: true,
      fechaEntrada: true,
      fechaSalida: true,
    });

    // Llamar a la nueva función de validación
    if (!validateAndSetErrors()) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/condominos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoDocumento,
          numeroDocumento,
          nombreCompleto,
          fechaNacimiento,
          correoElectronico: correo,
          numeroTelefono: telefono,
          fechaEntrada,
          fechaSalida: fechaSalida || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("Condomino agregado exitosamente");
        clearForm();
      } else {
        setSubmitMessage(data.message || "Error al agregar condomino");
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
          Datos personales
        </h1>

        <form
          className="flex flex-col space-y-5 Mi_texto_20"
          onSubmit={handleSubmit}
          noValidate // Deshabilitar validación nativa del navegador
        >
          <div className="flex flex-col">
            <label
              htmlFor="tipoDocumento"
              className="mb-1 text-[var(--Mi-cafe-oscuro)]"
            >
              Tipo de documento:*
            </label>
            <select
              id="tipoDocumento"
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${selectTextColor} ${
                // Comprobar error Y si fue tocado
                errors.tipoDocumento && touched.tipoDocumento
                  ? "border-red-500"
                  : ""
              }`}
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              onBlur={handleBlur} // Añadir manejador onBlur
            >
              <option value="" disabled className="text-[var(--Mi-gris)]">
                Seleccionar...
              </option>
              <option value="DPI" className="text-[var(--Mi-cafe-oscuro)]">
                DPI
              </option>
              <option value="Pasaporte" className="text-[var(--Mi-cafe-oscuro)]">
                Pasaporte
              </option>
            </select>
            {errors.tipoDocumento && touched.tipoDocumento && (
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
              placeholder="Escribir..."
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              onBlur={handleBlur}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
                errors.numeroDocumento && touched.numeroDocumento
                  ? "border-red-500"
                  : ""
              }`}
            />
            {errors.numeroDocumento && touched.numeroDocumento && (
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
              placeholder="Escribir..."
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              onBlur={handleBlur}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
                errors.nombreCompleto && touched.nombreCompleto
                  ? "border-red-500"
                  : ""
              }`}
            />
            {errors.nombreCompleto && touched.nombreCompleto && (
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
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              onBlur={handleBlur}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${fechaTextColor(
                fechaNacimiento
              )} ${
                errors.fechaNacimiento && touched.fechaNacimiento
                  ? "border-red-500"
                  : ""
              }`}
            />
            {errors.fechaNacimiento && touched.fechaNacimiento && (
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
              placeholder="Escribir..."
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              onBlur={handleBlur}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
                errors.correo && touched.correo ? "border-red-500" : ""
              }`}
            />
            {errors.correo && touched.correo && (
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
              placeholder="Escribir..."
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              onBlur={handleBlur}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
                errors.telefono && touched.telefono ? "border-red-500" : ""
              }`}
            />
            {errors.telefono && touched.telefono && (
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
              value={fechaEntrada}
              onChange={(e) => setFechaEntrada(e.target.value)}
              onBlur={handleBlur}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${fechaTextColor(
                fechaEntrada
              )} ${
                errors.fechaEntrada && touched.fechaEntrada
                  ? "border-red-500"
                  : ""
              }`}
            />
            {errors.fechaEntrada && touched.fechaEntrada && (
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
              value={fechaSalida}
              onChange={(e) => setFechaSalida(e.target.value)}
              onBlur={handleBlur}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${fechaTextColor(
                fechaSalida
              )} ${
                errors.fechaSalida && touched.fechaSalida
                  ? "border-red-500"
                  : ""
              }`}
            />
            {errors.fechaSalida && touched.fechaSalida && (
              <span className="text-red-500 text-sm mt-1">
                {errors.fechaSalida}
              </span>
            )}
          </div>

          {submitMessage && (
            <div
              className={`text-center p-3 rounded-lg ${
                submitMessage.includes("exitosamente")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              // Deshabilitar si el formulario NO es válido O si se está enviando
              disabled={!isFormValid || isSubmitting}
              className={`bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-xl shadow-md transition-opacity ${
                // Aplicar estilos de deshabilitado si NO es válido O si se está enviando
                !isFormValid || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
