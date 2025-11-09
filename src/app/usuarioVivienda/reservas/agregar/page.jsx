// src/app/usuarioVivienda/reservas/agregar/page.jsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

// --- CONSTANTES Y UTILIDADES ---

// Función para generar todos los horarios de 8 AM a 8 PM
const generateAllHours = () => {
  const hours = [];
  for (let h = 8; h < 20; h++) {
    const start = `${h.toString().padStart(2, '0')}:00`;
    const end = `${(h + 1).toString().padStart(2, '0')}:00`;
    hours.push({ id: `h${h}`, time: `${start} - ${end}` });
  }
  return hours;
};

// Horarios base de 8 AM a 8 PM
const ALL_HOURS = generateAllHours();

/**
 * Convierte un número de día (1-31) al formato YYYY-MM-DD para la base de datos.
 * Nota: El Calendario está fijo en Enero 2025.
 */
const formatDayToDate = (dayNumber) => {
    if (!dayNumber) return null;
    return `2025-01-${String(dayNumber).padStart(2, '0')}`;
}

// Componente para una sección de formulario (tarjeta blanca)
const FormCard = ({ children, title, className = "" }) => (
  <div
    className={`bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in mb-6 text-[var(--Mi-cafe-oscuro)] ${className}`}
  >
    {title && (
      <h3 className="Mi_H4_24 mb-4 border-b pb-2 border-gray-200">{title}</h3>
    )}
    {children}
  </div>
);

// --- COMPONENTE DE CALENDARIO ---

/**
 * Muestra el calendario con la disponibilidad.
 */
const CalendarComponent = ({ selectedAmenidadId, selectedDate, setSelectedDate, monthReservations }) => {
  const [currentMonth] = useState(new Date(2025, 0)); // Enero 2025 (Fijo por ahora)

  const daysOfWeek = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const monthName = currentMonth.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = 31; // Enero 2025 tiene 31 días
  const firstDay = 3; // El 1 de Enero de 2025 cae en Miércoles (3)

  // Obtiene los IDs de las horas reservadas para un día
  const getReservedHourIds = (day) => {
    if (!selectedAmenidadId || !monthReservations) return [];
    const dateKey = formatDayToDate(day);
    return monthReservations[dateKey] || [];
  };
  
  // Determina si hay al menos una hora libre en el día
  const isDayAvailable = (day) => {
    if (!selectedAmenidadId) return false;
    const reservedHours = getReservedHourIds(day);
    return reservedHours.length < ALL_HOURS.length;
  }

  const handleDayClick = (day) => {
    if (day > 0 && day <= daysInMonth && isDayAvailable(day)) {
      setSelectedDate(day);
    } else {
      setSelectedDate(null);
    }
  };

  const getDayClass = (day) => {
    if (day <= 0 || day > daysInMonth) {
        return "bg-gray-100 cursor-not-allowed";
    }

    if (selectedAmenidadId) {
        if (isDayAvailable(day)) {
             if (day === selectedDate) {
                return "bg-blue-300 text-[var(--Mi-blanco)] Mi_texto_boton border-blue-500 border-2 shadow-inner";
             }
             return "bg-green-500 text-[var(--Mi-blanco)] cursor-pointer hover:bg-green-600 shadow-md";
        } else {
            return "bg-gray-300 text-[var(--Mi-cafe-oscuro)] opacity-70 cursor-not-allowed";
        }
    }
    
    return "bg-gray-100 text-[var(--Mi-cafe-oscuro)] opacity-50 cursor-not-allowed";
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-start-${i}`} className="p-2 text-center"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <div
        key={day}
        className={`p-2 rounded-full h-8 w-8 flex items-center justify-center Mi_texto_pequeño_16 mx-auto transition-colors ${getDayClass(
          day
        )}`}
        onClick={() => handleDayClick(day)}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center px-2">
        <button
          className="text-[var(--Mi-cafe-oscuro)] opacity-50 cursor-not-allowed"
          disabled
        >
          &lt;
        </button>
        <span className="Mi_texto_negrita_20 capitalize text-[var(--Mi-cafe-oscuro)]">
          {monthName}
        </span>
        <button
          className="text-[var(--Mi-cafe-oscuro)] opacity-50 cursor-not-allowed"
          disabled
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center Mi_texto_pequeño_16 text-[var(--Mi-cafe-oscuro)] font-bold border-b pb-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-xs text-[var(--Mi-gris)]">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>
      
      {!selectedAmenidadId && (
          <p className="Mi_texto_pequeño_16 text-red-500 text-center mt-2">
            *Seleccione una amenidad para ver la disponibilidad de fechas.
          </p>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function AgregarReservaViviendaPage() {
  // --- STATES ---
  const [currentUser, setCurrentUser] = useState(null); // Usuario actual logueado
  const [selectedAmenidad, setSelectedAmenidad] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedTime, setSelectedTime] = useState("");
  const [amenidadesDisponibles, setAmenidadesDisponibles] = useState([]);
  const [monthReservations, setMonthReservations] = useState({}); 

  // --- FEEDBACK STATES ---
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  
  // --- FETCH USUARIO ACTUAL ---
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/usuarios/actual");
        if (!res.ok) {
          throw new Error("Error al obtener el usuario actual.");
        }
        const data = await res.json();
        if (data.success && data.usuario) {
          setCurrentUser({
            _id: data.usuario.id,
            usuario: data.usuario.usuario,
          });
        } else {
          throw new Error("No se pudo obtener la información del usuario.");
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError("No se pudo cargar la información del usuario. Por favor, recargue la página.");
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);
  
  // --- FETCH AMENIDADES ---
  useEffect(() => {
    const fetchAmenidades = async () => {
      try {
        const res = await fetch("/api/amenidades?filter=reservation");
        if (!res.ok) {
          throw new Error("Error al obtener las amenidades.");
        }
        const data = await res.json();
        setAmenidadesDisponibles(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching amenidades:", err);
        setError("No se pudieron cargar las amenidades. Verifique la conexión con el servidor.");
      }
    };

    fetchAmenidades();
  }, []);

  // --- FETCH RESERVATIONS ---
  useEffect(() => {
    if (!selectedAmenidad) {
        setMonthReservations({});
        setSelectedDate(null);
        setSelectedTime("");
        return;
    }
    
    const fetchReservations = async () => {
        try {
            const res = await fetch(`/api/reservas/disponibilidad?amenidadId=${selectedAmenidad}`);
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al obtener la disponibilidad de reservas.");
            }
            
            const data = await res.json();
            setMonthReservations(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching reservations:", err);
            setError(`Error al obtener disponibilidad: ${err.message}`);
            setMonthReservations({});
        }
    };
    
    fetchReservations();
  }, [selectedAmenidad]);

  // --- CALCULAR HORARIOS DISPONIBLES ---
  const availableHours = useMemo(() => {
    if (!selectedAmenidad || !selectedDate || !monthReservations) {
        return [];
    }

    const targetDate = formatDayToDate(selectedDate);
    const reservedHourIds = monthReservations[targetDate] || [];
    
    return ALL_HOURS.filter(hour => !reservedHourIds.includes(hour.id));

  }, [selectedAmenidad, selectedDate, monthReservations]); 

  // --- HANDLERS ---
  
  // Manejar cambio de amenidad
  const handleAmenidadChange = (e) => {
    const newAmenidadId = e.target.value;
    setSelectedAmenidad(newAmenidadId);
    setSelectedDate(null);
    setSelectedTime("");
    setError(null); 
  }

  // Si la fecha seleccionada cambia, se limpia el horario
  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  // Guardar Reserva
  const handleSave = async () => {
    setError(null);
    setShowSuccessMessage(false);

    // Validaciones
    if (!currentUser) {
      setError("No se pudo obtener la información del usuario. Por favor, recargue la página.");
      return;
    }
    if (!selectedAmenidad) {
      setError("Por favor, seleccione una amenidad.");
      return;
    }
    if (!selectedDate) {
      setError("Por favor, seleccione una fecha.");
      return;
    }
    if (!selectedTime) {
      setError("Por favor, seleccione un horario.");
      return;
    }

    const reservationDate = formatDayToDate(selectedDate);
    const selectedHour = ALL_HOURS.find(h => h.id === selectedTime);
    const selectedHourTime = selectedHour?.time;
    
    // Validación final de disponibilidad
    const isAvailableNow = availableHours.some(h => h.id === selectedTime);
    if (!isAvailableNow) {
        setError(`El horario de ${selectedHourTime} ya no está disponible. Por favor, seleccione otro.`);
        return;
    }

    setIsLoading(true);

    try {
        const newReservation = {
            amenidadId: selectedAmenidad,
            date: reservationDate,
            hourId: selectedTime,
            hourTime: selectedHourTime,
            userId: currentUser._id,
            userName: currentUser.usuario,
        };
        
        const res = await fetch("/api/reservas/agregar-vivienda", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newReservation),
        });

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || "Error desconocido al guardar la reserva.");
        }

        // Éxito
        setShowSuccessMessage(true);
        
        // Limpiar formulario
        setSelectedDate(null);
        setSelectedTime("");
        setSelectedAmenidad("");
        setMonthReservations({});

    } catch (e) {
        console.error("Error al guardar la reserva:", e);
        setError(e.message || "Error al guardar la reserva. Intente de nuevo.");
    } finally {
        setIsLoading(false);
    }
  };

  // Ocultar mensaje de éxito
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  // Mostrar loading mientras se carga el usuario
  if (isLoadingUser) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-center p-8">
          <p className="Mi_texto_20 text-[var(--Mi-cafe-oscuro)]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      {/* Mensaje de Éxito */}
      {showSuccessMessage && (
        <div className="flex items-center justify-center p-4 mb-6 bg-green-100 border border-green-400 text-[var(--Mi-cafe-oscuro)] rounded-lg animate-fade-in">
          <CheckCircle className="w-6 h-6 mr-3 text-green-700" />
          <p className="Mi_texto_negrita_20">¡Reserva creada con éxito!</p>
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="flex items-center justify-center p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fade-in">
          <AlertCircle className="w-6 h-6 mr-3" />
          <p className="Mi_texto_negrita_20">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Sección 1: Usuario Actual (Bloqueado pero Visible) */}
        <FormCard>
          <label
            htmlFor="currentUser"
            className="block Mi_texto_negrita_20 mb-2 text-[var(--Mi-cafe-oscuro)]"
          >
            Usuario:*
          </label>
          <input
            id="currentUser"
            type="text"
            value={currentUser?.usuario || ""}
            disabled
            className="w-full p-3 border-2 border-gray-300 rounded-lg Mi_texto_20 text-[var(--Mi-cafe-oscuro)] bg-gray-100 cursor-not-allowed"
          />
        </FormCard>

        {/* Sección 2: Amenidad Disponible */}
        <FormCard>
          <label
            htmlFor="amenidadSelect"
            className="block Mi_texto_negrita_20 mb-2 text-[var(--Mi-cafe-oscuro)]"
          >
            Seleccione amenidad:*
          </label>
          <div className="relative">
            <select
              id="amenidadSelect"
              value={selectedAmenidad}
              onChange={handleAmenidadChange}
              className="w-full p-3 border border-[var(--Mi-cafe-oscuro)] rounded-lg focus:ring-1 focus:ring-[var(--Mi-gradiante-azul-from)] focus:border-[var(--Mi-gradiante-azul-from)] Mi_texto_20 appearance-none bg-white pr-8 text-[var(--Mi-cafe-oscuro)]"
              disabled={amenidadesDisponibles.length === 0}
            >
              <option value="" className="text-[var(--Mi-gris)]">
                {amenidadesDisponibles.length === 0 ? "Cargando..." : `Elegir... (${amenidadesDisponibles.length} disponibles)`}
              </option>
              {amenidadesDisponibles.map((amenidad) => (
                <option
                  key={amenidad._id} 
                  value={amenidad._id} 
                  className="text-[var(--Mi-cafe-oscuro)]"
                >
                  {amenidad.nombre} 
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--Mi-cafe-oscuro)]">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l-.707.707L13.586 18l4.293-4.293-.707-.707L13.586 16.586 9.293 12.95z" />
              </svg>
            </div>
          </div>
        </FormCard>

        {/* Sección 3: Fecha de Reserva (Calendario) y Horarios */}
        <div className="grid grid-cols-1 gap-6">
          {/* Tarjeta de Calendario */}
          <FormCard>
            <label
              htmlFor="fechaReserva"
              className="block Mi_texto_negrita_20 mb-2 text-[var(--Mi-cafe-oscuro)]"
            >
              Seleccione fecha para la reserva:*
            </label>
            <div className="mb-4" />

            <div className="flex flex-col space-y-4">
              {/* Leyenda */}
              <div className="Mi_texto_pequeño_16 space-y-2 mb-4 text-[var(--Mi-cafe-oscuro)]">
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                  Espacios disponibles
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full bg-gray-300 mr-2"></span>
                  Sin espacios disponibles
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full bg-blue-300 mr-2 border-blue-500 border"></span>
                  Fecha seleccionada
                </div>
              </div>

              {/* Calendario */}
              <CalendarComponent
                selectedAmenidadId={selectedAmenidad}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                monthReservations={monthReservations}
              />
            </div>
          </FormCard>

          {/* Tarjeta de Horarios Disponibles */}
          <FormCard>
            <label
              htmlFor="timeSelect"
              className="block Mi_texto_negrita_20 mb-2 text-[var(--Mi-cafe-oscuro)]"
            >
              Horarios disponibles:*
            </label>
            <div className="relative">
              <select
                id="timeSelect"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  setError(null); 
                }}
                className="w-full p-3 border border-[var(--Mi-cafe-oscuro)] rounded-lg focus:ring-1 focus:ring-[var(--Mi-gradiante-azul-from)] focus:border-[var(--Mi-gradiante-azul-from)] Mi_texto_20 appearance-none bg-white pr-8 text-[var(--Mi-cafe-oscuro)]"
                disabled={!selectedDate || isLoading || availableHours.length === 0} 
              >
                <option value="" className="text-[var(--Mi-gris)]">
                  {selectedDate ? (availableHours.length > 0 ? "Elegir..." : "No hay horarios disponibles") : "Seleccione una fecha primero"}
                </option>
                {availableHours.map((horario) => (
                    <option
                      key={horario.id}
                      value={horario.id}
                      className="text-[var(--Mi-cafe-oscuro)]"
                    >
                      {horario.time}
                    </option>
                  ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--Mi-cafe-oscuro)]">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l-.707.707L13.586 18l4.293-4.293-.707-.707L13.586 16.586 9.293 12.95z" />
              </svg>
              </div>
            </div>

            {/* Nota */}
            <div className="mt-6 p-4 rounded-lg text-[var(--Mi-cafe-oscuro)]">
              <p className="Mi_texto_negrita_20 mb-1">Nota:</p>
              <p className="Mi_texto_pequeño_16">
                Cada reserva tiene duración de una hora.
              </p>
            </div>
          </FormCard>
        </div>

        {/* Botón Guardar */}
        <div className="text-center pt-4">
          <button
            onClick={handleSave}
            disabled={
              isLoading ||
              !currentUser ||
              !selectedAmenidad ||
              !selectedDate ||
              !selectedTime
            }
            className={`w-full max-w-fit p-3 rounded-lg Mi_texto_boton text-[var(--Mi-blanco)] shadow-md transition duration-300 ease-in-out ${
              isLoading ||
              !currentUser ||
              !selectedAmenidad ||
              !selectedDate ||
              !selectedTime
                ? "bg-[var(--Mi-gris)] cursor-not-allowed" 
                : "bg-mi-gradiente-boton-principal hover:shadow-xl transform hover:scale-[1.03]" 
            }`}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
