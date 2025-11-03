// src/app/usuarioAdministrador/amenidades/editar/page.jsx

"use client";

import { useEffect, useState } from "react";

export default function AgregarAmenidadPage() {
  // Estados para el formulario de amenidad
  const [nombre, setNombre] = useState("");
  const [requiereReserva, setRequiereReserva] = useState("");
  const [tiempoMaximo, setTiempoMaximo] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Usado para previsualizar nueva/antigua imagen
  const [mensaje, setMensaje] = useState("");

  // Estados para la funcionalidad de Edición
  const [amenidades, setAmenidades] = useState([]);
  const [seleccionada, setSeleccionada] = useState(""); // ID de la amenidad a editar
  const isEditing = !!seleccionada;
  
  // Define si el formulario debe estar deshabilitado (es true si no hay nada seleccionado)
  const isFormDisabled = !seleccionada; 

  // 1. Cargar amenidades al iniciar (para el selector de edición)
  useEffect(() => {
    fetch("/api/amenidades")
      .then((res) => res.json())
      .then((data) => {
        // Combinar amenidades con y sin reserva
        const todas = [...(data.conReserva || []), ...(data.sinReserva || [])];
        setAmenidades(todas);
      })
      .catch(() => setMensaje("Error al cargar la lista de amenidades."));
  }, []);

  // 2. Cargar datos de la amenidad seleccionada
  useEffect(() => {
    const actual = amenidades.find((a) => a._id === seleccionada);

    if (actual) {
      // Entrando en modo edición: Cargar datos
      setNombre(actual.nombre);
      // Corregido: La propiedad de Amenidad ya es una cadena "sí" o "no"
      setRequiereReserva(actual.requiereReserva || "no");
      setTiempoMaximo(actual.tiempoMaximo);
      // Mostrar imagen existente (asumiendo que 'imagenUrl' es el campo para la URL)
      setPreviewUrl(actual.imagenUrl || null);
      setImagenFile(null); // Asegurar que no hay archivo nuevo seleccionado al cargar
      // setMensaje(""); // <-- ELIMINADO: Ya no limpiamos el mensaje aquí para permitir que se muestre el mensaje de éxito después de guardar.
    } else {
      // Saliendo del modo edición (al seleccionar la opción vacía): Limpiar campos
      setNombre("");
      setRequiereReserva("");
      setTiempoMaximo("");
      setPreviewUrl(null);
      setImagenFile(null);
      setMensaje("");
    }
  }, [seleccionada, amenidades]);

  // Maneja la selección de archivo de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImagenFile(file);
    if (file) {
      // Crear preview de la nueva imagen
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else if (isEditing) {
        // Si borra el archivo en modo edición, mantenemos la URL existente (si la hay)
        const actual = amenidades.find((a) => a._id === seleccionada);
        setPreviewUrl(actual?.imagenUrl || null);
    } else {
      // Modo edición con campo vacío y se cancela la selección
      setPreviewUrl(null);
    }
  };

  // 3. Manejar el envío del formulario (siempre PUT en este modo)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: Como es solo edición, seleccionada siempre debería tener valor aquí, 
    // pero las validaciones de campos son necesarias.
    if (!nombre || !requiereReserva || !tiempoMaximo) {
      setMensaje("Todos los campos de texto son obligatorios.");
      return;
    }
    
    // Validación de imagen: Se requiere una imagen (nueva o previa)
    if (!imagenFile && !previewUrl) {
        setMensaje("La amenidad necesita una imagen. Por favor, suba una nueva.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    // Convertir el string de vuelta a 'sí' o 'no'. El backend lo acepta.
    formData.append("requiereReserva", requiereReserva); 
    formData.append("tiempoMaximo", tiempoMaximo);

    // Adjuntar la nueva imagen solo si se seleccionó un archivo nuevo
    if (imagenFile) {
      formData.append("imagen", imagenFile);
    }
    
    // Si estamos editando y no subimos nueva imagen, aseguramos que la URL exista en el body
    if (!imagenFile && previewUrl) {
        formData.append("imagenUrl", previewUrl);
    }

    const method = "PUT";
    const url = `/api/amenidades?id=${seleccionada}`;

    const res = await fetch(url, {
      method: method,
      body: formData,
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      // Manejo de error si la respuesta no es un JSON válido (e.g., cuerpo vacío en un error 500)
      data = { error: res.statusText || 'Error desconocido del servidor. La respuesta no fue JSON.' };
    }

    if (res.ok) {
      // El backend devuelve { message: "Amenidad actualizada correctamente." }
      setMensaje(data.message || `Amenidad actualizada correctamente.`);
      
      // Re-cargar amenidades para actualizar el selector y el formulario (Importante para que se vea el cambio)
      fetch("/api/amenidades")
          .then((res) => res.json())
          .then((data) => {
            const todas = [...(data.conReserva || []), ...(data.sinReserva || [])];
            setAmenidades(todas);
          });
          
      // Opcionalmente, podemos quitar el mensaje después de unos segundos
      setTimeout(() => setMensaje(''), 3000);

    } else {
      // Usar el error del JSON si existe, o el mensaje de error por defecto que creamos.
      setMensaje(data?.error || `Error al actualizar.`);
    }
  };


  const esFormularioValido = isEditing && nombre && requiereReserva && tiempoMaximo && (imagenFile || previewUrl);
  
  // Texto del botón
  const buttonText = "Guardar";
  

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-mi-gradiante-blanco space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-xl">
      
        {/* Selector de Amenidad (Obligatorio) */}
        <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8">
            <label htmlFor="selectorAmenidad" className="Mi_texto_20 mb-2 block text-[var(--Mi-cafe-oscuro)]">
                Selecciona amenidad a editar:*
            </label>
            <select
                id="selectorAmenidad"
                value={seleccionada}
                onChange={(e) => setSeleccionada(e.target.value)}
                className={`Mi_texto_20 w-full p-3 rounded-lg border border-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
                    seleccionada ? 'text-[var(--Mi-cafe-oscuro)]' : 'text-[var(--Mi-gris)]'
                }`}
            >
                {/* Texto modificado para reflejar modo Edición Exclusivo */}
                <option value="" className="text-[var(--Mi-cafe-oscuro)]">Elegir amenidad para editar...</option>
                {amenidades.map((a) => (
                    <option 
                        key={a._id} 
                        value={a._id} 
                        className="text-[var(--Mi-cafe-oscuro)]" 
                    >
                        {a.nombre}
                    </option>
                ))}
            </select>
            {!isEditing && (
                <p className="Mi_texto_18 mt-2 text-red-500 font-medium">
                    Por favor, selecciona una amenidad para habilitar la edición.
                </p>
            )}
            {isEditing && (
                <p className="Mi_texto_18 mt-2 text-[var(--Mi-cafe-oscuro)]">
                    Estás editando: <strong>{nombre || 'Cargando...'}</strong>.
                </p>
            )}
        </div>

        {/* Nombre */}
        <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8">
          <label htmlFor="nombre" className="Mi_texto_20 mb-2 block text-[var(--Mi-cafe-oscuro)]">
            Nombre amenidad:*
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Escribir..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`border border-[var(--Mi-gris)] rounded-lg p-3 w-full text-[var(--Mi-cafe-oscuro)] placeholder-[var(--Mi-gris)] focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${isFormDisabled ? 'bg-gray-100' : ''}`}
            required
            disabled={isFormDisabled}
          />
        </div>

        {/* ¿Necesita reserva? */}
        <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8">
          <label htmlFor="requiereReserva" className="Mi_texto_20 mb-2 block text-[var(--Mi-cafe-oscuro)]">
            ¿Necesitas reserva?*
          </label>
          <select
            id="requiereReserva"
            value={requiereReserva}
            onChange={(e) => setRequiereReserva(e.target.value)}
            className={`border border-[var(--Mi-gris)] rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
              requiereReserva === '' ? 'text-[var(--Mi-gris)]' : 'text-[var(--Mi-cafe-oscuro)]'
            } ${isFormDisabled ? 'bg-gray-100' : ''}`}
            required
            disabled={isFormDisabled}
          >
            {/* FIX: Aplicar color a las opciones */}
            <option value="" className="text-[var(--Mi-cafe-oscuro)]">Elegir...</option>
            <option value="sí" className="text-[var(--Mi-cafe-oscuro)]">Sí</option>
            <option value="no" className="text-[var(--Mi-cafe-oscuro)]">No</option>
          </select>
        </div>

        {/* Tiempo máximo */}
        <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8">
          <label htmlFor="tiempoMaximo" className="Mi_texto_20 mb-2 block text-[var(--Mi-cafe-oscuro)]">
            Tiempo máximo de reserva:*
          </label>
          <select
            id="tiempoMaximo"
            value={tiempoMaximo}
            onChange={(e) => setTiempoMaximo(e.target.value)}
            className={`border border-[var(--Mi-gris)] rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[var(--Mi-cafe-oscuro)] ${
              tiempoMaximo === '' ? 'text-[var(--Mi-gris)]' : 'text-[var(--Mi-cafe-oscuro)]'
            } ${isFormDisabled ? 'bg-gray-100' : ''}`}
            required
            disabled={isFormDisabled}
          >
            {/* FIX: Aplicar color a las opciones */}
            <option value="" className="text-[var(--Mi-cafe-oscuro)]">Elegir...</option>
            <option value="1 hora" className="text-[var(--Mi-cafe-oscuro)]">1 hora</option>
            <option value="2 horas" className="text-[var(--Mi-cafe-oscuro)]">2 horas</option>
            <option value="3 horas" className="text-[var(--Mi-cafe-oscuro)]">3 horas</option>
            <option value="4 horas" className="text-[var(--Mi-cafe-oscuro)]">4 horas</option>
            <option value="5 horas" className="text-[var(--Mi-cafe-oscuro)]">5 horas</option>
            <option value="6 horas" className="text-[var(--Mi-cafe-oscuro)]">6 horas</option>
            <option value="7 horas" className="text-[var(--Mi-cafe-oscuro)]">7 horas</option>
            <option value="8 horas" className="text-[var(--Mi-cafe-oscuro)]">8 horas</option>
          </select>
        </div>

        {/* Imagen */}
        <div className="bg-[var(--Mi-blanco)] rounded-2xl shadow-2xl p-6 sm:p-8">
          <label htmlFor="imagen" className="Mi_texto_20 mb-2 block text-[var(--Mi-cafe-oscuro)]">
            Reemplazar imagen (Opcional):
          </label>
          <input
            id="imagen"
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            disabled={isFormDisabled}
            className={`Mi_texto_20 w-full file:font-medium file:px-4 file:py-2 file:rounded-lg transition-opacity duration-300 ${
              isFormDisabled 
                ? 'text-[var(--Mi-gris)] file:text-[var(--Mi-gris)] file:border file:border-[var(--Mi-gris)] opacity-50' 
                : 'text-[var(--Mi-cafe-oscuro)] file:text-[var(--Mi-blanco)] file:bg-[var(--Mi-cafe-oscuro)] file:border-transparent cursor-pointer'
            }`}
          />
          {(previewUrl || isEditing) && (
            <div className="mt-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Previsualización de la amenidad"
                  className="rounded-lg shadow-md w-full h-48 object-cover border border-[var(--Mi-gris)]"
                />
              ) : (
                <p className="Mi_texto_18 text-red-500">
                    {isEditing ? 'Esta amenidad no tiene imagen. Por favor, suba una.' : ''}
                </p>
              )}
              {isEditing && !imagenFile && previewUrl && (
                  <p className="Mi_texto_18 mt-2 text-[var(--Mi-cafe-oscuro)]">
                      Imagen actual: Se mantendrá si no subes una nueva.
                  </p>
              )}
            </div>
          )}
        </div>

        {/* Botón */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={!esFormularioValido}
            className={`Mi_texto_boton w-auto px-10 py-3 rounded-lg border transition-all duration-300 ${
              !esFormularioValido
                ? 'bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] cursor-not-allowed opacity-50'
                : 'bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] hover:opacity-90'
            }`}
          >
            {buttonText}
          </button>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <p className="text-center mt-4 Mi_texto_20 text-blue-700 font-medium">
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
}
