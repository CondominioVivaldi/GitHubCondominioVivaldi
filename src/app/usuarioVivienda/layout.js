// src/app/usuarioVivienda/layout.jsx

import PaginaFondo from "@/componentes/PaginaFondo";

export default function LayoutVivienda({ children }) {
  return <PaginaFondo tipoUsuario="vivienda">{children}</PaginaFondo>;
}

