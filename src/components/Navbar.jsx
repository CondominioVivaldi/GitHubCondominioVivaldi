export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full h-[140px] bg-white shadow-md z-50 rounded-b">
      <div className="max-w-screen mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo + Nombre */}
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo Condominio Vivaldi" className="h-20 w-auto rounded" />
          <span className="font-italianno text-3xl text-black">
  Condominio Vivaldi
</span>
        </div>

        {/* Contacto */}
        <div className="text-[18px] font-normal font-rubik text-gray-700 text-right leading-loose">
          <p>Número de oficina: 12102 - 1212</p>
          <p>Correo: adm@condominiovivaldi.com</p>
          <p>Dirección: 99av. 99-99, zona 99, Ciudad de Guatemala</p>
        </div>
      </div>
    </header>
  );
}