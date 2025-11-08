// src/app/usuarioAdministrador/inicio/page.jsx

export default function InicioAdministrador() {
  return (
    // Contenedor principal: usa la imagen como fondo fijo que cubre toda la pantalla
    <div 
      className="relative flex items-center justify-center min-h-screen 
                 bg-[url('/Fondo.png')] bg-cover bg-center bg-no-repeat"
    >
      
      {/* 1. OVERLAY OSCURO semi-transparente para mejorar el contraste del texto */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* 2. Contenedor del contenido (Texto), asegurando que esté sobre el overlay (z-10) */}
      <div className="relative z-10 p-8 flex flex-col items-center justify-center text-center">
        
        {/* Título: Texto en blanco con sombra para máxima legibilidad */}
        <h1 className="Mi_H2_40 text-white drop-shadow-lg mb-4 sm:mb-6">
          Sistema del administrador
        </h1>
        
        {/* Subtítulo o Mensaje: También en blanco con sombra */}
        <p className="Mi_texto_20 text-white drop-shadow-md max-w-lg">
          Bienvenido al panel del administrador. Dirígete al menú para empezar a interactuar.
        </p>
      </div>
    </div>
  );
}