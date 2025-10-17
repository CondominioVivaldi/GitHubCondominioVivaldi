export default function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-sky-500 to-blue-800 text-white p-4">
      <nav className="space-y-2">
        <a href="/inicio" className="block py-2 px-3 hover:bg-blue-700 rounded">Inicio</a>
        <details>
          <summary className="cursor-pointer py-2 px-3 hover:bg-blue-700 rounded">
            Estados de cuenta
          </summary>
          <div className="ml-4">
            <a href="/estados/buscar" className="block py-1">Buscar</a>
            <a href="/estados/transferencias" className="block py-1">transferencias</a>
            <a href="/estados/agregarCuota" className="block py-1">Agregar cuota</a>
          </div>
        </details>
        <details>
          <summary className="cursor-pointer py-2 px-3 hover:bg-blue-700 rounded">
            Amenidades
          </summary>
          <div className="ml-4">
            <a href="/amenidades/agregar" className="block py-1">Agregar</a>
            <a href="/amenidades/editar" className="block py-1">Editar</a>
            <a href="/amenidades/eliminar" className="block py-1">Eliminar</a>
          </div>
        </details>
        <a href="/reservas" className="block py-2 px-3 hover:bg-blue-700 rounded">Reservas</a>
        <a href="/reclamos" className="block py-2 px-3 hover:bg-blue-700 rounded">Reclamos</a>
        <a href="/condominos" className="block py-2 px-3 hover:bg-blue-700 rounded">Condóminos</a>
        <details>
          <summary className="cursor-pointer py-2 px-3 hover:bg-blue-700 rounded">
            Viviendas
          </summary>
          <div className="ml-4">
            <a href="/viviendas/agregar" className="block py-1">Agregar</a>
            <a href="/viviendas/editar" className="block py-1">Editar</a>
            <a href="/viviendas/eliminar" className="block py-1">Eliminar</a>
          </div>
        </details>
        <a href="/usuarios" className="block py-2 px-3 hover:bg-blue-700 rounded">Usuarios</a>
      </nav>
    </aside>
  );
}