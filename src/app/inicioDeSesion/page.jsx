// src/app/inicioDeSesion/page.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PaginaFondoLogin from "@/componentes/PaginaFondoLogin";

export default function inicioDeSesion() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensajeError("");

    console.log("Iniciando envío del formulario...");

    try {
      const respuesta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contraseña }),
      });

      console.log("Respuesta recibida del backend:", respuesta);

      const data = await respuesta.json();
      console.log("JSON parseado:", data);

      if (!respuesta.ok || !data.success) {
        console.warn("Error en autenticación:", data.message);
        setMensajeError(data.message || "Error al iniciar sesión.");
        return;
      }

      localStorage.setItem("usuarioId", data.usuarioId);   // Guardar ID del usuario para reclamos
      localStorage.setItem("tipoUsuario", data.tipoUsuario); // Guardar tipo de usuario para reclamos

      console.log("Login exitoso. Tipo de usuario:", data.tipoUsuario);

      // Pausa pequeña para que la cookie se guarde
      setTimeout(() => {
        if (data.tipoUsuario === "administrador") {
          console.log("Redirigiendo a /usuarioAdministrador/inicio...");
          router.push("/usuarioAdministrador/inicio");
          window.location.href = "/usuarioAdministrador/inicio";
        } else if (data.tipoUsuario === "vivienda") {
          console.log("Redirigiendo a /usuarioVivienda/inicio...");
          router.push("/usuarioVivienda/inicio");
          window.location.href = "/usuarioVivienda/inicio";
        } else {
          console.error("Tipo de usuario desconocido:", data.tipoUsuario);
          setMensajeError("Tipo de usuario desconocido.");
        }
      }, 200);
    } catch (error) {
      console.error("Error en el bloque try-catch:", error);
      setMensajeError("Error de conexión con el servidor.");
    }
  };


  return (
    <PaginaFondoLogin>
      <div className="flex items-center justify-center min-h-screen">
        {/* Contenedor blanco principal */}
        <div className="bg-[var(--Mi-blanco)] rounded-lg p-10 shadow-lg w-full max-w-xl">
          {/* Título */}
          <h1 className="Mi_H1_64 text-[var(--Mi-cafe-oscuro)] text-center mb-10">
            Inicio de Sesión
          </h1>

          {/* Contenedor interior con borde gris y fondo transparente */}
          <form
            onSubmit={manejarEnvio}
            className="border border-[var(--Mi-gris)] p-8 rounded-lg bg-transparent w-80 mx-auto"
          >
            {/* Etiqueta: Nombre de usuario */}
            <label className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] block mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Escribir..."
              className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] placeholder:text-[var(--Mi-gris)] w-full mb-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-gris)]"
            />

            {/* Etiqueta: Contraseña */}
            <label className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] block mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Escribir..."
              className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)] placeholder:text-[var(--Mi-gris)] w-full mb-6 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--Mi-gris)]"
            />

            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-full py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 border-1 border-[var(--Mi-cafe-oscuro)]"
            >
              Iniciar sesión
            </button>

            {/* Mensaje de error */}
            {mensajeError && (
              <p className="Mi_texto_pequeño_16 text-red-600 text-center mt-3">
                {mensajeError}
              </p>
            )}

            {/* Enlace de contraseña olvidada */}
            <div className="text-center mt-4">
              <a
                href="inicioDeSesion/solicitarRestablecerPass"
                className="Mi_texto_pequeño_16 text-[var(--Mi-cafe-oscuro)] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </PaginaFondoLogin>
  );
}
