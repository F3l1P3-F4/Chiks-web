import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background mt-24 border-t border-divider">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase mb-6 text-gradient-electric w-fit">Las Chikas Design</h3>
            <p className="text-gray-500 font-mono text-sm max-w-sm mb-6 leading-relaxed">
              Gráfica integral. Impresión, sublimación, indumentaria, cartelería y merchandising con producción propia.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">Navegación</h4>
            <nav className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest">
              <Link href="/productos" className="hover:text-brand transition-colors">Productos</Link>
              <Link href="/soluciones" className="hover:text-brand transition-colors">Soluciones</Link>
              <Link href="/trabajos-realizados" className="hover:text-brand transition-colors">Trabajos</Link>
              <Link href="/nosotros" className="hover:text-brand transition-colors">El Taller</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">Contacto</h4>
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest">
              <a href="https://wa.me/5491155553300" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">+54 9 11 5555-3300</a>
              <a href="mailto:hola@laschikas.com.ar" className="hover:text-brand transition-colors">hola@laschikas.com.ar</a>
              <span className="text-gray-500">Av. Falsa 1234, CABA</span>
              <span className="text-gray-500">Lun a Vie · 9 a 18h</span>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-divider flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            © {currentYear} Las Chikas Design — Buenos Aires, Argentina
          </p>
          <div className="flex gap-4">
            {/* Social Links can go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
