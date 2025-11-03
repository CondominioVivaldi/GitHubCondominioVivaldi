// src/app/usuarioVivienda/usuarios/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function UsuarioViviendaUsuariosPage() {
  const [usuario, setUsuario] = useState(null);
  const [nuevaPass, setNuevaPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [alerta, setAlerta] = useState("");
  const [passValida, setPassValida] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch("/api/usuarios/actual");
        const data = await res.json();
        if (res.ok && data.success) {
          setUsuario(data.usuario);
        } else {
          setMensaje(data.message || "No se pudo obtener la información del usuario.");
        }
      } catch (error) {
        console.error(error);
        setMensaje("Error al obtener usuario actual.");
      }
    };
    fetchUsuario();
  }, []);

  // Validación en tiempo real
  useEffect(() => {
    if (!nuevaPass && !confirmarPass) {
      setMensaje("");
      setPassValida(false);
      return;
    }

    if (nuevaPass.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      setPassValida(false);
    } else if (nuevaPass !== confirmarPass) {
      setMensaje("Las contraseñas no coinciden.");
      setPassValida(false);
    } else {
      setMensaje("");
      setPassValida(true);
    }
  }, [nuevaPass, confirmarPass]);

  const manejarCambioPassword = async () => {
    if (!passValida) return;

    try {
      const res = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: usuario.usuario,
          nuevaContrasena: nuevaPass,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.message || "Contraseña actualizada correctamente.");
        setAlerta("Listo! Recuerde usar su nueva contraseña en su próximo inicio de sesión.");
        setNuevaPass("");
        setConfirmarPass("");
        setPassValida(false);
      } else {
        setMensaje(data.message || "Hubo un error al actualizar la contraseña.");
        setAlerta("");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Hubo un error al actualizar la contraseña.");
      setAlerta("");
    }
  };

  const botonHabilitado = passValida;

  // Clases dinámicas para bordes según validación
  const bordeNuevaPass = nuevaPass ? (nuevaPass.length >= 6 ? "border-green-500" : "border-red-500") : "border-[var(--Mi-gris)]";
  const bordeConfirmPass =
    confirmarPass
      ? nuevaPass === confirmarPass && nuevaPass.length >= 6
        ? "border-green-500"
        : "border-red-500"
      : "border-[var(--Mi-gris)]";

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-12 text-[var(--Mi-cafe-oscuro)]">

      {/* Sección Usuario */}
      <div className="p-6 bg-white rounded-[8px] shadow">
        <h1 className="Mi_H2_40 mb-6 text-center">Usuario</h1>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="Mi_texto_20 font-semibold mb-1">Usuario actual</label>
            <input
              type="text"
              value={usuario?.usuario || ""}
              disabled
              className="Mi_texto_20 w-full p-2 border rounded-[8px] bg-gray-100 cursor-not-allowed border-[var(--Mi-gris)]"
            />
          </div>
        </div>
      </div>

      {/* Sección Cambiar Contraseña */}
      <div className="p-6 bg-white rounded-[8px] shadow">
        <h1 className="Mi_H2_40 mb-6 text-center">Cambiar contraseña</h1>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="Mi_texto_20 font-semibold mb-1">Nueva contraseña</label>
            <input
              type="password"
              value={nuevaPass}
              onChange={(e) => setNuevaPass(e.target.value)}
              className={`Mi_texto_20 w-full p-2 border rounded-[8px] ${bordeNuevaPass}`}
            />
          </div>
          <div className="flex flex-col">
            <label className="Mi_texto_20 font-semibold mb-1">Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmarPass}
              onChange={(e) => setConfirmarPass(e.target.value)}
              className={`Mi_texto_20 w-full p-2 border rounded-[8px] ${bordeConfirmPass}`}
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={manejarCambioPassword}
              disabled={!botonHabilitado}
              className={`Mi_texto_boton px-6 py-3 rounded-[8px] transition ${
                botonHabilitado
                  ? "bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] hover:opacity-90"
                  : "bg-gray-400 text-[var(--Mi-blanco)] cursor-not-allowed"
              }`}
            >
              Restablecer
            </button>
          </div>
          {mensaje && <p className="Mi_texto_20 text-red-600 mt-2">{mensaje}</p>}
          {alerta && <p className="Mi_texto_20 text-emerald-500 mt-1">{alerta}</p>}
        </div>
      </div>

    </div>
  );
}
