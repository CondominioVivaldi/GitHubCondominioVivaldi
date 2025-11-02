"use client";

import { useState, useEffect } from "react";

export default function AgregarEliminarUsuarios() {
  const [formData, setFormData] = useState({
    usuario: "",
    contraseña: "",
    
  });
  const [mensaje, setMensaje] = useState("");
  const [viviendasVinculadas, setViviendasVinculadas] = useState([]);
  useEffect(() => {
    const fetchViviendas = async () => {
      try {
        const response = await fetch("/api/viviendas/buscar-viviendas");
        const data = await response.json();
        setViviendasVinculadas(data.viviendas || []);
      } catch (error) {
        console.error("Error al obtener las viviendas:", error);
      }
    };
    fetchViviendas();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/usuarios/crear-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje("Usuario creado exitosamente.");
      }
      else {
        setMensaje(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      setMensaje("Error al crear el usuario.");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/usuarios/eliminar-usuario", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vivienda: formData.vivienda }),
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje("Usuario eliminado exitosamente.");
      }
      else {
        setMensaje(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setMensaje("Error al eliminar el usuario.");
    }
  };

  return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--Mi-fondo)] gap-6 py-10">
        <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[722px] flex flex-col items-center">
        <form onSubmit={handleSubmit} className="space-y-4 w-[553px]">
          <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] text-left mb-6">
            Crear Usuario
          </h1>
            <div className="flex items-center space-x-4">
            <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1 w-1/3">
                Vivienda
            </label>
            <select className="w-full border border-gray-300 p-2 rounded" name="usuario" value={formData.usuario} onChange={handleChange} required>
                <option value="" >Seleccione una vivienda</option>
                {viviendasVinculadas.map((vivienda) => (
                    <option key={vivienda._id} value={vivienda._id}>
                        {vivienda.idVivienda}
                    </option>
                ))}
            </select>
            </div>
            <div className="flex items-center space-x-4">
            <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1 w-1/3">
                Contraseña
            </label>
            <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
            />
            </div>
           <div className="flex items-center space-x-4">
            <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1 w-1/3">
                Confirmar Contraseña
            </label>
            <input
                type="password"
                name="confirmarContraseña"
                value={formData.confirmarContraseña || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
            />
             </div>
             <button
              type="submit"
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-auto px-8 mx-auto block py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 border-1 border-[var(--Mi-cafe-oscuro)]"
            >
              Crear Usuario
            </button>
          </form>
        {mensaje && <p className="mt-4 text-center text-[var(--Mi-cafe-oscuro)]">{mensaje}</p>}
        </div>
        
        <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[722px] flex flex-col items-center">
        <form onSubmit={handleDelete} className="space-y-4 w-[553px]">
            <h1 className="Mi_H4_24 text-[var(--Mi-cafe-oscuro)] text-left mb-6">
            Eliminar Usuario
            </h1>
            <div className="flex items-center space-x-4">
            <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1 w-1/3">
                Vivienda
            </label>
            <select className="w-full border border-gray-300 p-2 rounded" name="vivienda" value={formData.vivienda} onChange={handleChange} required>
                <option value="">Seleccione una vivienda</option>
                {viviendasVinculadas.map((vivienda) => (
                    <option key={vivienda._id} value={vivienda._id}>
                        {vivienda.idVivienda}
                    </option>
                ))}
            </select>
            </div>
            <button
              type="submit"
              className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-auto px-8 mx-auto block py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 border-1 border-[var(--Mi-cafe-oscuro)]"
            >
              Eliminar Usuario
            </button>
          </form>
        </div>
    </div>
  );
}
