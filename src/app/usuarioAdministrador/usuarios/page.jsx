// src/app/usuarioAdministrador/usuarios/page.jsx

"use client";

import { useState, useEffect } from "react";

export default function AgregarEliminarUsuarios() {
  const [viviendasVinculadas, setViviendasVinculadas] = useState([]);
  const [usuariosExistentes, setUsuariosExistentes] = useState([]);
  const [formDataCrear, setFormDataCrear] = useState({
    viviendaId: "", // ID de MongoDB de la vivienda seleccionada
    viviendaNombre: "", // idVivienda (nombre) de la vivienda
    correoElectronico: "",
    contraseña: "",
    confirmarContraseña: "",
    usuario: "", // Mismo que viviendaNombre (idVivienda)
  });
  const [formDataEliminar, setFormDataEliminar] = useState({
    usuarioAEliminar: "", // idVivienda del usuario/vivienda a eliminar
  });
  
  const [mensajeCreacion, setMensajeCreacion] = useState("");
  const [mensajeEliminacion, setMensajeEliminacion] = useState("");

  // Estado para manejar la búsqueda en la datalist (Problema 1)
  const [filtroVivienda, setFiltroVivienda] = useState("");

  useEffect(() => {
    // 1. Obtener todas las viviendas disponibles (para creación)
    async function fetchViviendas() {
      try {
        const response = await fetch("/api/viviendas/buscar-viviendas");
        const data = await response.json();
        setViviendasVinculadas(data.viviendas || []);
      } catch (error) {
        console.error("Error al obtener viviendas vinculadas:", error);
      }
    }
    fetchViviendas();

    // 2. Obtener usuarios existentes (para eliminación)
    async function fetchUsuariosExistentes() {
      try {
        const response = await fetch("/api/usuarios/ver-usuarios");
        const data = await response.json();
        // data.usuariosConIdVivienda debe contener objetos con { idVivienda: 'V-XXX', _idUsuario: '...' }
        setUsuariosExistentes(data.usuariosConIdVivienda || []);
      } catch (error) {
        console.error("Error al obtener usuarios existentes:", error);
      }
    }
    fetchUsuariosExistentes();
  }, []);

  // Manejador para el campo de búsqueda/datalist (Problema 1)
  const handleViviendaSearchChange = (e) => {
    const value = e.target.value;
    setFiltroVivienda(value);
    setMensajeCreacion("");

    // Buscar la vivienda en la lista basado en el idVivienda escrito
    const viviendaSeleccionada = viviendasVinculadas.find(
      (v) => v.idVivienda === value
    );

    if (viviendaSeleccionada) {
      setFormDataCrear((prev) => ({
        ...prev,
        viviendaId: viviendaSeleccionada._id,
        viviendaNombre: viviendaSeleccionada.idVivienda,
        usuario: viviendaSeleccionada.idVivienda,
        correoElectronico: viviendaSeleccionada.correoElectronico || "",
      }));
    } else {
      // Si el usuario borra o escribe algo que no existe, resetear el ID de la vivienda
      setFormDataCrear((prev) => ({
        ...prev,
        viviendaId: "",
        viviendaNombre: value, // mantener el texto escrito
        usuario: value,
      }));
    }
  };

  // Manejador genérico para el formulario de CREACIÓN
  const handleChangeCrear = (e) => {
    const { name, value } = e.target;
    setFormDataCrear((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMensajeCreacion("");
  };

  // Manejador genérico para el formulario de ELIMINACIÓN
  const handleChangeEliminar = (e) => {
    const { name, value } = e.target;
    setFormDataEliminar((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMensajeEliminacion(""); // Limpiar mensaje al cambiar la selección
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeCreacion(""); // Limpiar mensaje anterior (Problema 2)
    
    // Validación: Contraseñas
    if (formDataCrear.contraseña !== formDataCrear.confirmarContraseña) {
      setMensajeCreacion("Las contraseñas no coinciden.");
      return;
    }

    // Validación: Vivienda seleccionada
    if (!formDataCrear.viviendaId) {
      setMensajeCreacion("Seleccione una vivienda válida de la lista.");
      return;
    }

    try {
      const response = await fetch("/api/usuarios/crear-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: formDataCrear.usuario,
          correoElectronico: formDataCrear.correoElectronico,
          contraseña: formDataCrear.contraseña,
          vivienda: formDataCrear.viviendaId, // Usamos el ID de MongoDB
        }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setMensajeCreacion(data.mensaje || "Usuario creado exitosamente.");
      } else {
        setMensajeCreacion(data.mensaje || "Error al crear el usuario.");
      }

    } catch (error) {
      console.error("Error al crear usuario:", error);
      setMensajeCreacion("Error de conexión al intentar crear el usuario.");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setMensajeEliminacion(""); // Limpiar mensaje anterior (Problema 3)

    if (!formDataEliminar.usuarioAEliminar) {
      setMensajeEliminacion("Seleccione un usuario para eliminar.");
      return;
    }

    try {
      const response = await fetch("/api/usuarios/eliminar-usuario", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idVivienda: formDataEliminar.usuarioAEliminar, // Pasamos el idVivienda para la eliminación
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMensajeEliminacion(data.mensaje || "Usuario eliminado exitosamente.");
        // Después de eliminar, recargar la lista de usuarios existentes
        try {
          const updatedResponse = await fetch("/api/usuarios/ver-usuarios");
          const updatedData = await updatedResponse.json();
          setUsuariosExistentes(updatedData.usuariosConIdVivienda || []);
          setFormDataEliminar({ usuarioAEliminar: "" }); // Resetear selección
        } catch (error) {
          console.error("Error al recargar usuarios después de eliminar:", error);
        }
      } else {
        setMensajeEliminacion(data.mensaje || "Error al eliminar el usuario.");
      }

    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setMensajeEliminacion("Error de conexión al intentar eliminar el usuario.");
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--Mi-fondo)] gap-6 py-10">
      
      {/* -------------------- FORMULARIO CREAR USUARIO -------------------- */}
      <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[722px] flex flex-col items-center">
        <form onSubmit={handleSubmit} className="space-y-4 w-[553px]">
          <h1 className="Mi_H2_40 text-[var(--Mi-cafe-oscuro)] text-center mb-6">
            Crear Usuario
          </h1>
          
          {/* Campo de búsqueda/datalist para Vivienda (Problema 1) */}
          <div className="flex items-center space-x-4">
            <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1 w-1/3">
              Nombre usuario:
            </label>
            <input
              list="viviendaOptions"
              type="text"
              name="viviendaNombre"
              value={filtroVivienda}
              onChange={handleViviendaSearchChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Escriba o seleccione una vivienda"
              required
            />
            <datalist id="viviendaOptions">
              {viviendasVinculadas.map((vivienda) => (
                <option
                  key={vivienda._id}
                  value={vivienda.idVivienda}
                />
              ))}
            </datalist>
          </div>
          
          <div className="flex items-center space-x-4"> 
            <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1 w-1/3">
              Correo Electrónico:
            </label>
            <input
              type="email"
              name="correoElectronico"
              value={formDataCrear.correoElectronico}
              onChange={handleChangeCrear}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1 w-1/3">
              Contraseña:
            </label>
            <input
              type="password"
              name="contraseña"
              value={formDataCrear.contraseña}
              onChange={handleChangeCrear}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1 w-1/3">
              Confirmar Contraseña:
            </label>
            <input
              type="password"
              name="confirmarContraseña"
              value={formDataCrear.confirmarContraseña || ""}
              onChange={handleChangeCrear}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-auto px-8 mx-auto block py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 border-1]"
          >
            Crear
          </button>
        </form>
        {/* Mensaje de creación único (Problema 2) */}
        {mensajeCreacion && <p className="mt-4 text-center Mi_texto_pequeño_16 text-[var(--Mi-cafe-oscuro)] font-bold">{mensajeCreacion}</p>}
      </div>

      
      {/* -------------------- FORMULARIO ELIMINAR USUARIO -------------------- */}
      <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[722px] flex flex-col items-center">
        <form onSubmit={handleDelete} className="space-y-4 w-[553px]">
          <h1 className="Mi_H2_40 text-[var(--Mi-cafe-oscuro)] text-center mb-6">
            Eliminar Usuario
          </h1>
          <div className="flex items-center space-x-4">
            <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1 w-1/3">
              Seleccionar usuario:
            </label>
            {/* Lista de usuarios existentes (Problema 3) */}
            <select 
              className="w-full border border-gray-300 p-2 rounded" 
              name="usuarioAEliminar" 
              value={formDataEliminar.usuarioAEliminar} 
              onChange={handleChangeEliminar} 
              required
            >
              <option value="">Seleccione un usuario existente</option>
              {usuariosExistentes.map((usuario) => (
                <option key={usuario._id} value={usuario.idVivienda}>
                  {usuario.idVivienda}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-auto px-5 mx-auto block py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 border-1]"
          >
            Eliminar
          </button>
        </form>
        {/* Mensaje de eliminación único (Problema 3) */}
        {mensajeEliminacion && <p className="mt-4 text-center Mi_texto_pequeño_16 text-[var(--Mi-cafe-oscuro)] font-bold">{mensajeEliminacion}</p>}
      </div>
    </div>
  );
}
