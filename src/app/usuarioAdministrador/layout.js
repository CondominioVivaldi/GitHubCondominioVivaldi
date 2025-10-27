// src/app/usuarioAdministrador/layout.jsx

import PaginaFondo from "@/componentes/PaginaFondo";

export default function LayoutAdministrador({ children }) {
  return <PaginaFondo tipoUsuario="administrador">{children}</PaginaFondo>;
}
