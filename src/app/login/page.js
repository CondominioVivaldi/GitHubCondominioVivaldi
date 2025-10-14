"use client";
import { useState } from "react";
import Link from "next/link";


export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contraseña }),
    });
    const data = await res.json();
    setMensaje(data.message);

    if (res.ok) {
      if (data.tipoUsuario === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/residente";
      }
    }
  };

  return (
    <>
      {/* HEADER FIJO ARRIBA */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo + Nombre */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Logo Condominio Vivaldi"
              className="h-20 w-auto"
            />
            <span className="text-xl font-bold text-blue-900">
              Condominio Vivaldi
            </span>
          </div>

          {/* Contacto */}
          <div className="text-sm text-gray-700 text-right">
            <p>Número de oficina: 4120 - 4121</p>
            <p>Correo: adm@condominiovivaldi.com</p>
            <p>Dirección: 99a., 99-97, zona 9, Ciudad de Guatemala</p>
          </div>
        </div>
      </header>

      {/* CONTENIDO DE LOGIN */}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4 pt-40">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Inicio de Sesión
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="usuario"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de usuario
              </label>
              <input
                id="usuario"
                type="text"
                placeholder="Escribir..."
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label
                htmlFor="contraseña"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="contraseña"
                type="password"
                placeholder="Escribir..."
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white py-2 rounded-lg transition 
                         bg-gradient-to-b from-sky-200 to-blue-800 
                         hover:from-sky-500 hover:to-blue-600"
            >
              Iniciar Sesión
            </button>
          </form>

          {mensaje && (
            <p
              className={`mt-4 text-center font-medium ${
                mensaje.includes("exitoso") ? "text-green-600" : "text-red-600"
              }`}
            >
              {mensaje}
            </p>
          )}

          <p className="mt-4 text-center text-sm hover:underline">
  <Link href="/forgot-password" className="text-blue-600">
    ¿Olvidaste tu contraseña?
  </Link>
</p>
        </div>
      </div>
    </>
  );
}