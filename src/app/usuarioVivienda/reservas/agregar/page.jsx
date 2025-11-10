// src/app/usuarioVivienda/reservas/agregar/page.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

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
 * Formatea un objeto Date a un string 'YYYY-MM-DD'.
 * @param {Date} date El objeto Date a formatear.
 * @returns {string} Fecha en formato 'YYYY-MM-DD'.
 */
const formatDateToYYYYMMDD = (date) => {
  if (!date) return null;
  // Usar toISOString y tomar la primera parte (YYYY-MM-DD)
  // Ajustamos la zona horaria localmente antes de convertir
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset*60*1000));
  return adjustedDate.toISOString().split('T')[0];
};

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

// --- COMPONENTE DE CALENDARIO (MODIFICADO) ---

/**
 * Muestra el calendario con la disponibilidad.
 * Se hizo dinámico para navegar entre meses y usar la fecha actual.
 * * @param {object} props 
 * @param {string} props.selectedAmenidadId - ID de la amenidad seleccionada.
 * @param {Date | null} props.selectedDate - Objeto Date de la fecha seleccionada.
 * @param {function} props.setSelectedDate - Setter para la fecha seleccionada.
 * @param {object} props.monthReservations - Mapa de reservas por fecha: { 'YYYY-MM-DD': ['h10', 'h11'], ... }
 * @param {Date} props.viewedMonth - El mes/año que se está viendo.
 * @param {function} props.setViewedMonth - Setter para el mes/año.
 * @param {function} props.setSelectedTime - Setter para la hora seleccionada.
 */
const CalendarComponent = ({ 
    selectedAmenidadId, 
    selectedDate, 
    setSelectedDate, 
    monthReservations,
    viewedMonth,
    setViewedMonth,
    setSelectedTime // Añadido para limpiar la hora al cambiar de mes
}) => {

  const daysOfWeek = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  
  // Normalizar 'today' para la comparación (ignorar la hora)
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const monthName = viewedMonth.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  // Cálculo dinámico de los días del mes
  const year = viewedMonth.getFullYear();
  const month = viewedMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 (Dom) - 6 (Sáb)

  // Obtiene los IDs de las horas reservadas para un día (número)
  const getReservedHourIds = (day) => {
    if (!selectedAmenidadId || !monthReservations) return [];
    // Construir la clave YYYY-MM-DD para el día específico
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthReservations[dateKey] || [];
  };
  
  // Determina si hay al menos una hora libre en el día
  const isDayAvailable = (day) => {
    if (!selectedAmenidadId) return false;
    const reservedHours = getReservedHourIds(day);
    return reservedHours.length < ALL_HOURS.length;
  }

  const handleDayClick = (day) => {
    const dayDate = new Date(year, month, day);
    dayDate.setHours(0, 0, 0, 0);

    // No permitir seleccionar días pasados
    if (dayDate < today) return;

    // Solo permitir seleccionar si el día está disponible
    if (day > 0 && day <= daysInMonth && isDayAvailable(day)) {
      setSelectedDate(dayDate); // Guardar el objeto Date completo
    } else {
      setSelectedDate(null);
    }
  };

  const getDayClass = (day) => {
    if (day <= 0 || day > daysInMonth) {
      return "bg-transparent cursor-not-allowed"; // Días fuera del rango (vacíos)
    }

    const dayDate = new Date(year, month, day);
    dayDate.setHours(0, 0, 0, 0); // Normalizar para comparación

    // 1. Días pasados (Mayor prioridad)
    if (dayDate < today) {
      return "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70";
    }

    // 2. Días futuros o hoy
    if (selectedAmenidadId) {
        if (isDayAvailable(day)) {
            // Días disponibles
            // Comprobar si es la fecha seleccionada
            if (selectedDate && dayDate.getTime() === new Date(selectedDate).setHours(0,0,0,0)) {
              // Fecha seleccionada
              return "bg-blue-300 text-[var(--Mi-blanco)] Mi_texto_boton border-blue-500 border-2 shadow-inner";
            }
            // Disponible pero no seleccionado
            return "bg-green-500 text-[var(--Mi-blanco)] cursor-pointer hover:bg-green-600 shadow-md";
        } else {
            // Sin espacios disponibles (día completamente lleno)
            return "bg-gray-300 text-[var(--Mi-cafe-oscuro)] opacity-70 cursor-not-allowed";
        }
    }
    
    // 3. Si NO hay amenidad seleccionada (días futuros)
    return "bg-gray-100 text-[var(--Mi-cafe-oscuro)] opacity-50 cursor-not-allowed";
  };

  const days = [];
  // Espacios en blanco al inicio (días antes del 1)
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-start-${i}`} className="p-2 text-center"></div>);
  }

  // Días del mes
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

  // Navegación de Mes
  const goToPreviousMonth = () => {
    setViewedMonth(new Date(year, month - 1, 1));
    setSelectedDate(null); // Limpiar selección al cambiar de mes
    setSelectedTime("");
  };

  const goToNextMonth = () => {
    setViewedMonth(new Date(year, month + 1, 1));
    setSelectedDate(null); // Limpiar selección al cambiar de mes
    setSelectedTime("");
  };
  
  // No permitir ir a meses pasados
  const canGoToPreviousMonth = useMemo(() => {
    const prevMonth = new Date(year, month - 1, 1);
    const lastDayOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
    lastDayOfPrevMonth.setHours(0,0,0,0);
    return lastDayOfPrevMonth >= today;
  }, [year, month, today]);


  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center px-2">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoToPreviousMonth}
          className="text-[var(--Mi-cafe-oscuro)] p-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="Mi_texto_negrita_20 capitalize text-[var(--Mi-cafe-oscuro)] w-32 text-center">
          {monthName}
        </span>
        <button
          onClick={goToNextMonth}
          className="text-[var(--Mi-cafe-oscuro)] p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
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
      
      {/* Mensaje de advertencia si no hay amenidad seleccionada */}
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
  const [selectedDate, setSelectedDate] = useState(null); // Ahora guarda un objeto Date
  const [selectedTime, setSelectedTime] = useState("");
  const [amenidadesDisponibles, setAmenidadesDisponibles] = useState([]);
  const [viewedMonth, setViewedMonth] = useState(new Date()); // Mes que se está viendo
  const [monthReservations, setMonthReservations] = useState({}); 

  // --- FEEDBACK STATES ---
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isFetchingAvailability, setIsFetchingAvailability] = useState(false);
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

  // --- FETCH RESERVATIONS (Depende de amenidad y mes visto) ---
  useEffect(() => {
    if (!selectedAmenidad) {
        setMonthReservations({});
        setSelectedDate(null);
        setSelectedTime("");
        return;
    }
    
    const fetchReservations = async () => {
        setIsFetchingAvailability(true);
        setError(null);
        
        const year = viewedMonth.getFullYear();
        const month = viewedMonth.getMonth() + 1; // 1-12

        try {
            // Se añaden year y month a la consulta para la API dinámica
            const res = await fetch(`/api/reservas/disponibilidad?amenidadId=${selectedAmenidad}&year=${year}&month=${month}`);
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al obtener la disponibilidad de reservas.");
            }
            
            const data = await res.json();
            setMonthReservations(data);

        } catch (err) {
            console.error("Error fetching reservations:", err);
            setError(`Error al obtener disponibilidad: ${err.message}.`);
            setMonthReservations({});
        } finally {
            setIsFetchingAvailability(false);
        }
    };
    
    fetchReservations();
  }, [selectedAmenidad, viewedMonth]); // Depende de la amenidad y del mes visto


  // --- CALCULAR HORARIOS DISPONIBLES ---
  const availableHours = useMemo(() => {
    if (!selectedAmenidad || !selectedDate || !monthReservations) {
        return [];
    }
    // Usar la función de utilidad que formatea el objeto Date
    const targetDate = formatDateToYYYYMMDD(selectedDate);
    const reservedHourIds = monthReservations[targetDate] || [];
    
    return ALL_HOURS.filter(hour => !reservedHourIds.includes(hour.id));

  }, [selectedAmenidad, selectedDate, monthReservations]); 

  // --- HANDLERS ---
  
  // Manejar cambio de amenidad
  const handleAmenidadChange = (e) => {
    const newAmenidadId = e.target.value;
    setSelectedAmenidad(newAmenidadId);
    setSelectedDate(null); // Limpiar fecha al cambiar amenidad
    setSelectedTime(""); // Limpiar hora al cambiar amenidad
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

    // Usar la función de utilidad para obtener la fecha de reserva
    const reservationDate = formatDateToYYYYMMDD(selectedDate);
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
        
        // Limpiar estado
        setSelectedDate(null);
        setSelectedTime("");
        
        // Forzamos la recarga de disponibilidad del mes actual
        setViewedMonth(new Date(viewedMonth.getTime()));


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
                  <span className="inline-block w-4 h-4 rounded-full bg-gray-100 text-gray-400 border mr-2"></span>
                  Día pasado (no disponible)
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full bg-blue-300 mr-2 border-blue-500 border"></span>
                  Fecha seleccionada
                </div>
              </div>

              {/* Calendario (ahora dinámico) */}
              <CalendarComponent
                selectedAmenidadId={selectedAmenidad}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                monthReservations={monthReservations}
                viewedMonth={viewedMonth}
                setViewedMonth={setViewedMonth}
                setSelectedTime={setSelectedTime}
              />
               {isFetchingAvailability && (
                  <p className="Mi_texto_pequeño_16 text-blue-600 text-center">
                      Actualizando disponibilidad...
                  </p>
              )}
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
                disabled={!selectedDate || isLoading || availableHours.length === 0 || isFetchingAvailability} 
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