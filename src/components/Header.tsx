'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Button from './Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full border-b border-divider relative z-50 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-extrabold uppercase tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr from-[#00FF33] via-[#FF00CC] to-[#6600FF] transition-all">
                Chik's
              </span>
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest hidden md:inline ml-4">
                Gráfica · Est. 1998
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <Link href="/productos" className="hover:text-brand transition-colors">Productos</Link>
            <Link href="/soluciones" className="hover:text-brand transition-colors">Soluciones</Link>
            <Link href="/trabajos-realizados" className="hover:text-brand transition-colors">Trabajos</Link>
            <Link href="/nosotros" className="hover:text-brand transition-colors">Nosotros</Link>
            <Link href="/faq" className="hover:text-brand transition-colors">FAQ</Link>
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Button href="/contacto" showArrow>Solicitar Pedido</Button>
            </div>
            
            <button 
              className="xl:hidden p-2 uppercase text-xs font-bold tracking-widest flex items-center gap-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? 'Cerrar' : 'Menú'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-background border-b border-divider shadow-lg">
          <nav className="flex flex-col px-4 py-8 gap-6 text-sm font-bold uppercase tracking-widest">
            <Link href="/" onClick={toggleMenu} className="hover:text-brand transition-colors">Inicio</Link>
            <Link href="/productos" onClick={toggleMenu} className="hover:text-brand transition-colors">Productos</Link>
            <Link href="/soluciones" onClick={toggleMenu} className="hover:text-brand transition-colors">Soluciones</Link>
            <Link href="/trabajos-realizados" onClick={toggleMenu} className="hover:text-brand transition-colors">Trabajos Realizados</Link>
            <Link href="/nosotros" onClick={toggleMenu} className="hover:text-brand transition-colors">Nosotros</Link>
            <Link href="/faq" onClick={toggleMenu} className="hover:text-brand transition-colors">FAQ</Link>
            <Link href="/contacto" onClick={toggleMenu} className="hover:text-brand transition-colors">Contacto</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
