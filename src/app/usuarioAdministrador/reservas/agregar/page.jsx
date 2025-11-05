// src/app/usuarioAdministrador/reservas/agregar/page.jsx

"use client";
import Calendar from "./calendar";

import React, { useState } from "react";
export default function AddReservaPage() {
    const [formData, setFormData] = useState({
        vivienda: "",
        fechaReserva: "",
        amenidad: "",
        horaInicio: ""
    });
    const [mensaje, setMensaje] = useState("");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        }); // src/app/usuarioAdministrador/reservas/agregar/page.jsx
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/reservas/agregar/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setMensaje("Reserva creada exitosamente");
                setFormData({
                    vivienda: "",
                    fechaReserva: "",
                    amenidad: "",
                    horaInicio: ""
                });
            }
            else {
                setMensaje(`Error: ${data.error}`);
            }
        }
        catch (error) {
            setMensaje(`Error: ${error.message}`);
        }
    };
    return (
        // Formulario para agregar reserva usando los estilos globales de la aplicación
        <div className="flex flex-col items-center justify-center bg-[var(--Mi-fondo)] gap-6 py-10">
            <div className="flex items-start justify-center bg-[var(--Mi-fondo)] gap-6 py-10">
                <div className="flex flex-col gap-6">
                    <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[400px] flex flex-col items-center">
                        <form onSubmit={handleSubmit} className="space-y-4 w-[361px]">
                            <div>
                                <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1">
                                    Ingrese ID vivienda
                                </label>
                                <input
                                    type="text"
                                    name="vivienda"
                                    value={formData.vivienda}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[400px] flex flex-col items-center">
                        <form onSubmit={handleSubmit} className="space-y-4 w-[361px]">
                            <div>
                                <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1">
                                    Fecha de Reserva
                                </label>
                                <Calendar
                                    name="fechaReserva"
                                    value={formData.fechaReserva}
                                    onChange={handleChange}
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[400px] flex flex-col items-center">
                        <form onSubmit={handleSubmit} className="space-y-4 w-[240px]">
                            <div>
                                <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1">
                                    Amenidad disponible
                                </label>
                                <input
                                    type="text"
                                    name="amenidad"
                                    value={formData.amenidad}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[400px] flex flex-col items-center">
                        <form onSubmit={handleSubmit} className="space-y-4 w-[240px]">
                            <div>
                                <label className="Mi_texto_datos_de_contacto block text-[var(--Mi-cafe-oscuro)] mb-1">
                                    Horarios disponibles
                                </label>
                                <input
                                    type="text"
                                    name="horaInicio"
                                    value={formData.horaInicio}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    <div className="bg-[var(--Mi-blanco)] p-8 rounded-lg shadow-lg w-[400px] flex flex-col items-center">
                        <p>Nota:
                            <br />
                            Las reservas tienen una duracion de una hora.
                            <br />
                            Tu usuario no tiene limites de reservas.
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <button>
                    <div
                        onClick={handleSubmit}
                        className="bg-mi-gradiente-boton-principal text-[var(--Mi-blanco)] Mi_texto_boton w-auto px-8 mx-auto block py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 border-1 border-[var(--Mi-cafe-oscuro)] cursor-pointer"
                    >
                        Agregar Reserva
                    </div>
                </button>
                {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
            </div>
        </div>
    );
}
