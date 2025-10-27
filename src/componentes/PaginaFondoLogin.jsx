// src/componentes/PaginaFondoLogin.jsx

"use client";

export default function PaginaFondoLogin({ children }) {
  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Barra superior */}
      <header
        className="w-[99.5%] mx-auto mt-0.5 h-[110px] rounded-lg flex items-center justify-between px-2 
        bg-mi-gradiante-blanco shadow-md z-10"
      >
        {/* Logo y texto (sin icono hamburguesa) */}
        <div className="flex items-end gap-7 ml-15">
          <div className="flex items-center gap-1">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-[80px] w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="Mi_texto_logo text-[var(--Mi-cafe-oscuro)]">
                Condominio
              </span>
              <span className="Mi_texto_logo text-[var(--Mi-cafe-oscuro)]">
                Vivaldi
              </span>
            </div>
          </div>
        </div>

        {/* Datos de contacto */}
        <div className="text-right space-y-1 pr-1">
          <p className="Mi_texto_datos_de_contacto text-[var(--Mi-cafe-oscuro)] leading-relaxed">
            Número de oficina: 1212 1212
          </p>
          <p className="Mi_texto_datos_de_contacto text-[var(--Mi-cafe-oscuro)] leading-relaxed">
            Correo: condominioVivaldiG2@gmail.com
          </p>
          <p className="Mi_texto_datos_de_contacto text-[var(--Mi-cafe-oscuro)] leading-relaxed">
            Dirección: 99av. 99-99, zona 9, Guatemala
          </p>
        </div>
      </header>

      {/* Zona de trabajo */}
      <main className="flex-1 w-[99.5%] mx-auto mt-0 rounded-lg overflow-x-hidden bg-mi-gradiante-blanco">
        {children}
      </main>
    </div>
  );
}
