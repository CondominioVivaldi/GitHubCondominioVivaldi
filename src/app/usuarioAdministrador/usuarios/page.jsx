"use client";

import { useState, useEffect } from "react";

export default function AgregarEliminarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserForChange, setSelectedUserForChange] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/api/usuarios");
      const data = await response.json();
      if (data.success) {
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedUserForChange) {
      newErrors.selectedUserForChange = "Debe seleccionar un usuario";
    }
    if (!nuevaContrasena) {
      newErrors.nuevaContrasena = "La nueva contraseña es requerida";
    }
    if (!confirmarContrasena) {
      newErrors.confirmarContrasena = "Debe confirmar la contraseña";
    }
    if (
      nuevaContrasena &&
      confirmarContrasena &&
      nuevaContrasena !== confirmarContrasena
    ) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: selectedUserForChange,
          nuevaContrasena,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Contraseña actualizada exitosamente");
        setSelectedUserForChange("");
        setNuevaContrasena("");
        setConfirmarContrasena("");
        setErrors({});
      } else {
        setMessage(data.message || "Error al actualizar contraseña");
      }
    } catch (error) {
      setMessage("Error de conexión. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[var(--Mi-blanco)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--Mi-cafe-oscuro)]"></div>
            <span className="ml-3 text-[var(--Mi-cafe-oscuro)] Mi_texto_20">
              Cargando usuarios...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-mi-gradiante-blanco space-y-8">
      <div className="bg-[var(--Mi-blanco)] w-full max-w-4xl rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-blue-500">
        <div className="text-center mb-6">
          <h1 className="Mi_H2_40 text-[var(--Mi-cafe-oscuro)] mb-4">
            Usuarios
          </h1>
          <p className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20">
            Si desea cambiar de usuario, seleccione su otra cuenta
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <label className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20">
            Usuario actual:
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-gris)] min-w-64"
          >
            {usuarios.map((usuario) => (
              <option key={usuario._id} value={usuario.usuario}>
                {usuario.usuario}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[var(--Mi-blanco)] w-full max-w-4xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="Mi_H2_40 text-[var(--Mi-cafe-oscuro)]">
            Cambiar contraseña
          </h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <label className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20 min-w-fit">
              Usuario:
            </label>
            <select
              value={selectedUserForChange}
              onChange={(e) => setSelectedUserForChange(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] text-[var(--Mi-cafe-oscuro)] min-w-64 ${errors.selectedUserForChange ? "border-red-500" : ""}`}
            >
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario.usuario}>
                  {usuario.usuario}
                </option>
              ))}
            </select>
          </div>
          {errors.selectedUserForChange && (
            <div className="text-center">
              <span className="text-red-500 text-sm">
                {errors.selectedUserForChange}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            <label className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20 min-w-fit">
              Nueva contraseña:
            </label>
            <input
              type="password"
              placeholder="Escribir contraseña..."
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] min-w-64 ${errors.nuevaContrasena ? "border-red-500" : ""}`}
            />
          </div>
          {errors.nuevaContrasena && (
            <div className="text-center">
              <span className="text-red-500 text-sm">
                {errors.nuevaContrasena}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            <label className="text-[var(--Mi-cafe-oscuro)] Mi_texto_20 min-w-fit">
              Confirmar contraseña:
            </label>
            <input
              type="password"
              placeholder="Repite contraseña..."
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className={`border border-[var(--Mi-gris)] rounded-lg p-2 sm:p-3 placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] min-w-64 ${errors.confirmarContrasena ? "border-red-500" : ""}`}
            />
          </div>
          {errors.confirmarContrasena && (
            <div className="text-center">
              <span className="text-red-500 text-sm">
                {errors.confirmarContrasena}
              </span>
            </div>
          )}

          {message && (
            <div
              className={`text-center p-3 rounded-lg ${message.includes("exitosamente") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-md transition-opacity ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {isSubmitting ? "Restableciendo..." : "Restablecer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
