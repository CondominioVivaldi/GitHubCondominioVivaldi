// src/app/usuarioAdministrador/condominos/buscar/[id]/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditarCondomino() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    tipoDocumento: "",
    numeroDocumento: "",
    nombreCompleto: "",
    fechaNacimiento: "",
    correoElectronico: "",
    numeroTelefono: "",
    fechaEntrada: "",
    fechaSalida: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar datos del condómino
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/condominos/${id}`);
        const data = await res.json();
        if (data.success) {
          const c = data.condomino;
          setFormData({
            tipoDocumento: c.tipoDocumento || "",
            numeroDocumento: c.numeroDocumento || "",
            nombreCompleto: c.nombreCompleto || "",
            fechaNacimiento: c.fechaNacimiento
              ? new Date(c.fechaNacimiento).toISOString().split("T")[0]
              : "",
            correoElectronico: c.correoElectronico || "",
            numeroTelefono: c.numeroTelefono || "",
            fechaEntrada: c.fechaEntrada
              ? new Date(c.fechaEntrada).toISOString().split("T")[0]
              : "",
            fechaSalida: c.fechaSalida
              ? new Date(c.fechaSalida).toISOString().split("T")[0]
              : "",
          });
        } else {
          setMessage("❌ Error al obtener datos del condómino.");
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Error de conexión al cargar datos.");
      }
    }

    if (id) fetchData();
  }, [id]);

  // Validaciones
  const getFormErrors = (data) => {
    const newErrors = {};
    if (!data.tipoDocumento)
      newErrors.tipoDocumento = "Selecciona un tipo de documento.";
    if (!data.numeroDocumento)
      newErrors.numeroDocumento = "El número de documento es obligatorio.";
    if (!data.nombreCompleto)
      newErrors.nombreCompleto = "El nombre completo es obligatorio.";
    if (!data.fechaNacimiento)
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    if (!data.correoElectronico)
      newErrors.correoElectronico = "El correo electrónico es obligatorio.";
    if (!data.numeroTelefono)
      newErrors.numeroTelefono = "El número de teléfono es obligatorio.";
    if (!data.fechaEntrada)
      newErrors.fechaEntrada = "La fecha de entrada es obligatoria.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = getFormErrors(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/condominos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Cambios guardados exitosamente.");
      } else {
        setMessage(`❌ ${data.message || "Error al guardar cambios."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al guardar cambios.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas eliminar este condómino?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/condominos/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("🗑️ Condómino eliminado exitosamente.");
        router.push("/usuarioAdministrador/condominos/buscar");
      } else {
        setMessage(`❌ ${data.message || "Error al eliminar."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al eliminar condómino.");
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="text-[var(--Mi-rojo)] text-sm mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] mb-8 text-left">
          Datos Personales
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-5 Mi_texto_20"
        >
          {/* Tipo de documento (bloqueado) */}
          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Tipo de Documento:
            </label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              disabled
              className="border border-[var(--Mi-gris)] rounded-lg p-3 text-[var(--Mi-cafe-oscuro)] bg-gray-100 cursor-not-allowed"
            >
              <option value="">Seleccione una opción</option>
              <option value="DPI">DPI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
            {renderError("tipoDocumento")}
          </div>

          {/* Número de documento (bloqueado) */}
          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Número de Documento:
            </label>
            <input
              type="text"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              readOnly
              disabled
              className="border border-[var(--Mi-gris)] rounded-lg p-3 text-[var(--Mi-cafe-oscuro)] bg-gray-100 cursor-not-allowed"
            />
            {renderError("numeroDocumento")}
          </div>

          {/* Nombre completo */}
          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Nombre Completo:
            </label>
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              className="border border-[var(--Mi-gris)] rounded-lg p-3 text-[var(--Mi-cafe-oscuro)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
            {renderError("nombreCompleto")}
          </div>

          {/* Fecha nacimiento */}
          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Fecha de Nacimiento:
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="border border-[var(--Mi-gris)] rounded-lg p-3 text-[var(--Mi-cafe-oscuro)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
            {renderError("fechaNacimiento")}
          </div>

          {/* Correo electrónico (bloqueado) */}
          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Correo Electrónico:
            </label>
            <input
              type="email"
              name="correoElectronico"
              value={formData.correoElectronico}
              readOnly
              disabled
              className="border border-[var(--Mi-gris)] rounded-lg p-3 text-[var(--Mi-cafe-oscuro)] bg-gray-100 cursor-not-allowed"
            />
            {renderError("correoElectronico")}
          </div>

          {/* Número teléfono */}
          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Número de Teléfono:
            </label>
            <input
              type="text"
              name="numeroTelefono"
              value={formData.numeroTelefono}
              onChange={handleChange}
              className="border border-[var(--Mi-gris)] rounded-lg p-3 text-[var(--Mi-cafe-oscuro)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
            {renderError("numeroTelefono")}
          </div>

          {/* Fecha entrada */}
          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Fecha de Entrada:
            </label>
            <input
              type="date"
              name="fechaEntrada"
              value={formData.fechaEntrada}
              onChange={handleChange}
              className="border border-[var(--Mi-gris)] rounded-lg p-3 text-[var(--Mi-cafe-oscuro)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
            {renderError("fechaEntrada")}
          </div>

          {/* Fecha salida */}
          <div className="flex flex-col">
            <label className="mb-1 text-[var(--Mi-cafe-oscuro)]">
              Fecha de Salida:
            </label>
            <input
              type="date"
              name="fechaSalida"
              value={formData.fechaSalida}
              onChange={handleChange}
              className="border border-[var(--Mi-gris)] rounded-lg p-3 text-[var(--Mi-cafe-oscuro)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)]"
            />
          </div>

          {/* Mensaje */}
          {message && (
            <div
              className={`text-center p-3 rounded-lg ${
                message.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-3 rounded-xl shadow-md transition-opacity ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className={`bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-3 rounded-xl shadow-md transition-opacity ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "Eliminando..." : "Eliminar condómino"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
