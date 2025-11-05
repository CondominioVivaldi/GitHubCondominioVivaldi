// src/app/usuarioAdministrador/reservas/agregar/calendar.jsx

"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function Calendar({ name, value, onChange }) {
  const selected =
    value && !isNaN(new Date(value)) ? new Date(value) : undefined;

  const handleSelect = (date) => {
    const formatted = date ? date.toISOString().split("T")[0] : "";
    onChange({ target: { name, value: formatted } }); // works with your handleChange
  };

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      className="rounded-xl bg-white p-2 shadow-sm font-sans"
      styles={{
        day: { borderRadius: "9999px", height: "2rem", width: "2rem" },
        day_selected: { backgroundColor: "#007aff", color: "white" },
        head_cell: { color: "#aaa", fontWeight: 600 },
        caption_label: { fontWeight: 600, fontSize: "0.9rem" },
      }}
    />
  );
}