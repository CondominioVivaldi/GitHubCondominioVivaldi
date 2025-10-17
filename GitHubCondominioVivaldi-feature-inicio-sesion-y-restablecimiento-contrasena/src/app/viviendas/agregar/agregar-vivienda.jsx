"use client";

import { useState } from 'react';

export default function AgregarViviendas() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    DPI: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Vivienda agregada!");
    setFormData({
      IDdeVivienda: "",
      Direccion: "",
      Modelo: "",
      CantidaddePersonas: "",
    });
  };

  return (
    <div>
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-[8px] p-6 mt-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Datos de Vivienda</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-black ">ID de Vivienda</label>
            <input
              type="text"
              name="nombre"
              value={formData.IDdeVivienda}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-[8px] p-2 text-black"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-black">Direccion</label>
            <input
              type="text"
              name="direccion"
              value={formData.Direccion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-[8px] p-2 text-black"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-black text-black">Modelo</label>
            <input
              type="Data"
              name="Modelo"
              value={formData.Modelo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-[8px] p-2 text-black"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-black">Cantidad de Personas</label>
            <input
              type="text"
              name="Cantidad-de-Personas"
              value={formData.CantidaddePersonas}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-[8px] p-2 text-black"
              required
              
              
            />
           
          
          </div>
           <h1 className="text-2xl font-bold text-center mb-6 text-black">Condomino</h1>
            <label htmlFor="Condomino"className=" text-black" >Condomino:</label>
  <select name="Condomino" id="Condomino "className="w-full border border-gray-300 rounded-[8px] p-2 text-black">
    <option value="Seleccionar">Seleccionar</option>
    <option value="Pasaporte">Pasaporte</option>
    <option value="DPI">DPI</option>
 
 
  </select>
   <label htmlFor="Tipo de Inquilino" className=" text-black"> Tipo de Inquilino:</label>
  <select name="Tipo de Inquilino" id="Tipo de Inquilino" className="w-full border border-gray-300 rounded-[8px] p-2 text-black">
    <option value="Seleccionar">Seleccionar</option>
    <option value="Ocupante">Ocupante</option>
    <option value="Inquilino">Inquilino</option>
    <option value="Propietario">Propietario</option>
    
  </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-[8px] hover:bg-blue-700 transition"
          
          >

            
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}