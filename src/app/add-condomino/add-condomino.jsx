"use client";

import React, { useState } from "react";


export default function AddCondominoPage() {
  const [formData, setFormData] = useState({
    tipoDocumento: "DPI",
    numeroDocumento: "",
    nombre: "",
    fechaNacimiento: "",
    correoElectronico: "",
    numeroTelefono: "",
    fechaEntrada: "",
    fechaSalida: "",
  });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/add-condomino", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
        if (result.ok) {
        setMessage("Condomino agregado exitosamente.");
        setFormData({
          tipoDocumento: "DPI",
            numeroDocumento: "",
            nombre: "",
            fechaNacimiento: "",
            correoElectronico: "",
            numeroTelefono: "",
            fechaEntrada: "",
            fechaSalida: "",
        });
      } else {
        setError(result.error || "Error al agregar el condomino.");
      }
    } catch (err) {
        setError("Error de red. Intente nuevamente.");
        console.error(err);
    }
  };
    return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Agregar Nuevo Condómino</h2>
        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block mb-1 font-medium">Tipo de Documento</label>
            <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            >
            <option value="DPI">DPI</option>
            <option value="Pasaporte">Pasaporte</option>
            </select>
        </div>
        <div>
            <label className="block mb-1 font-medium">Número de Documento</label>
            <input
            type="text"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
            />
        </div>
        <div>
            <label className="block mb-1 font-medium">Nombre Completo</label>
            <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
            />
        </div>
        <div>
            <label className="block mb-1 font-medium">Fecha de Nacimiento</label>
            <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
            />
        </div>
        <div>
            <label className="block mb-1 font-medium">Correo Electrónico</label>
            <input
            type="email"
            name="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
            />
        </div>
        <div>
            <label className="block mb-1 font-medium">Número de Teléfono</label>
            <input
            type="text"
            name="numeroTelefono"
            value={formData.numeroTelefono}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
            />
        </div>
        <div>
            <label className="block mb-1 font-medium">Fecha de Entrada</label>
            <input
            type="date"
            name="fechaEntrada"
            value={formData.fechaEntrada}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
            />
        </div>
        <div>
            <label className="block mb-1 font-medium">Fecha de Salida (opcional)</label>
            <input
            type="date"
            name="fechaSalida"
            value={formData.fechaSalida}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            />
        </div>
        <div className="text-center">
            <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            Agregar Condómino
            </button>
        </div>
        </form>
    </div>
  );
}