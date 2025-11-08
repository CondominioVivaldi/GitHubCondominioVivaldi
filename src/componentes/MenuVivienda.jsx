// src/componentes/MenuVivienda.jsx

"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // <-- Hooks de Next.js

// --- DECLARACIÓN DE ESTILOS Y CONFIGURACIÓN ---

// Constantes de clases CSS
const CLASES_ITEM_BASE = "Mi_texto_20 text-left w-full transition flex items-center";
const CLASES_PADDING_NAV = "px-10 py-0 rounded-lg";
const CLASES_ACTIVO = "bg-[var(--Mi-gradiante-blanco-from)]/30 border-1 border-[var(--Mi-blanco)]";
const CLASES_HOVER = "hover:bg-[var(--Mi-gradiante-blanco-from)]/20";
const CLASES_DIVISOR = "w-full h-1 bg-[var(--Mi-gris)] opacity-25 my-4";


// Estructura actualizada con rutas (href) y rutas base (basePath)
const ESTRUCTURA_MENU = [
  // Categoría 1
  [{ 
    titulo: 'Inicio', 
    tipo: 'nav',
    href: '/usuarioVivienda/inicio' 
  }],
  // Categoría 2
  [
    { 
      titulo: 'Estados de cuenta🔒', 
      tipo: 'nav', 
      href: '/usuarioVivienda/estadosDeCuenta' 
    },
    { 
      titulo: 'Amenidades', 
      tipo: 'nav',
      href: '/usuarioVivienda/amenidades' 
    },
    { 
      titulo: 'Reservas🚧', 
      tipo: 'desplegable', 
      basePath: '/usuarioVivienda/reservas', // Ruta base para apertura automática
      opciones: [
        { titulo: "Agregar", href: "/usuarioVivienda/reservas/agregar" },
        { titulo: "Ver activas", href: "/usuarioVivienda/reservas/verActivas" }
      ] 
    },
    { 
      titulo: 'Reclamos', 
      tipo: 'desplegable', 
      basePath: '/usuarioVivienda/reclamos', // Ruta base para apertura automática
      opciones: [
        { titulo: "Agregar", href: "/usuarioVivienda/reclamos/agregar" },
        { titulo: "Pendientes", href: "/usuarioVivienda/reclamos/pendientes" },
        { titulo: "Finalizados", href: "/usuarioVivienda/reclamos/finalizados" }
      ] 
    },
  ],
  // Categoría 3
  [
    { 
      titulo: 'Condóminos', 
      tipo: 'nav',
      href: '/usuarioVivienda/condominos' 
    },
    { 
      titulo: 'Viviendas', 
      tipo: 'nav',
      href: '/usuarioVivienda/viviendas' 
    },
    { 
      titulo: 'Usuarios', 
      tipo: 'nav',
      href: '/usuarioVivienda/usuarios' 
    },
  ]
];

// Componente Divisor
const Divisor = () => (
    <div className={CLASES_DIVISOR} />
);

export function MenuVivienda({ onClose }) {
  const router = useRouter();
  const pathname = usePathname(); 

  // --- LÓGICA DE ESTADOS ---
  
  // Inicializa el estado 'estadosAbierto' basado en la ruta actual (pathname).
  const [estadosAbierto, setEstadosAbierto] = useState(() => {
    const initialState = {};
    ESTRUCTURA_MENU.flat() 
      .filter(item => item.tipo === 'desplegable' && item.basePath)
      .forEach(item => {
        // Si la URL actual empieza con la ruta base, abre el acordeón
        initialState[item.titulo] = pathname.startsWith(item.basePath);
      });
    return initialState;
  });

  // Lógica para cerrar sesión (sin cambios)
  const manejarCerrarSesion = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/inicioDeSesion";
  };

  // Función de navegación unificada
  const navegar = (href) => {
    router.push(href);
    onClose(); 
  }

  // Componente interno para cada elemento de navegación simple (sin submenú).
  const ItemNavegacion = ({ titulo, href, onClick }) => {
    // Resaltado si la ruta actual coincide exactamente
    const esActiva = pathname === href; 

    return (
      <button
        className={`${CLASES_ITEM_BASE} ${CLASES_PADDING_NAV} justify-start mb-5 
          ${esActiva ? CLASES_ACTIVO : CLASES_HOVER}`}
        onClick={() => {
          if (href) {
            navegar(href); 
          }
          if (onClick) onClick(); 
        }}
      >
        {titulo}
      </button>
    );
  };

  // Componente interno para cada elemento de menú desplegable.
  const ItemDesplegable = ({ titulo, opciones }) => {
    const estaAbierto = estadosAbierto[titulo] || false; 

    const manejarClick = () => {
      setEstadosAbierto((prev) => ({
        ...prev,
        [titulo]: !estaAbierto,
      }));
    };

    // El botón principal del desplegable (padre) solo tiene hover 
    // para que el hijo activo destaque (Resaltado Único).
    const clasesBoton = `${CLASES_ITEM_BASE} ${CLASES_PADDING_NAV} justify-between ${CLASES_HOVER}`;
    
    return (
      <div className="mb-5">
        <button className={clasesBoton} onClick={manejarClick}>
          <span>{titulo}</span>
          {/* Indicador de submenú */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform ${
              estaAbierto ? "rotate-90" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Submenú: opciones navegables */}
        {estaAbierto && opciones && (
          <div className="mt-0 flex flex-col gap-1 px-0 pl-5">
            {opciones.map((opcion) => {
              // Resaltado del hijo: comparación exacta con la ruta.
              const esActiva = pathname === opcion.href;
              
              return (
                <button
                  key={opcion.titulo}
                  // Estilo para submenú
                  className={`${CLASES_ITEM_BASE} py-0 pl-12 mt-5 rounded-lg justify-start
                    ${esActiva ? CLASES_ACTIVO : CLASES_HOVER}`} // <-- SOLO el hijo se resalta
                  onClick={() => navegar(opcion.href)} // <-- Navegación a la ruta
                >
                  {opcion.titulo}
                </button>
              )
            })}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 z-30">
      {/* Fondo translúcido oscuro */}
      <div
        className="absolute inset-0 bg-black/75 z-30"
        onClick={onClose}
      ></div>

      {/* Menú lateral azul */}
      <aside
        className="absolute left-0 top-0 h-full w-[300px] flex flex-col 
        bg-mi-gradiante-azul border border-[var(--Mi-blanco)] rounded-lg 
        text-[var(--Mi-blanco)] z-40"
      >
        {/* --- CONTENEDOR SUPERIOR CON SCROLL --- */}
        <div className="flex-1 overflow-y-auto menu-scroll pt-7">
          
          {ESTRUCTURA_MENU.map((categoria, index) => (
            <div key={index}>
              {index > 0 && <Divisor />}

              {categoria.map((item) => (
                <div key={item.titulo}>
                  {item.tipo === 'desplegable' && (
                    <ItemDesplegable 
                      titulo={item.titulo} 
                      opciones={item.opciones} 
                    />
                  )}
                  {item.tipo === 'nav' && (
                    <ItemNavegacion titulo={item.titulo} href={item.href} />
                  )}
                </div>
              ))}
            </div>
          ))}

        </div>

        {/* --- CERRAR SESIÓN --- */}
        <div className="flex-shrink-0">
          <Divisor />
          <ItemNavegacion titulo="Cerrar Sesión" onClick={manejarCerrarSesion} />
          <div className="h-0"></div>
        </div>

      </aside>

      {/* Ícono Xmenu.png */}
      <img
        src="/Xmenu.png"
        alt="Cerrar menú"
        className="absolute top-1 left-[305px] w-20 h-20 cursor-pointer z-40"
        onClick={onClose}
      />
    </div>
  );
}
