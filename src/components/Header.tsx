'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from './Button';

const PRODUCT_LINKS = [
  { href: '/productos/indumentaria', label: 'Indumentaria' },
  { href: '/productos/merchandising', label: 'Merchandising' },
  { href: '/productos/grafica', label: 'Gráfica' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Escape cierra menús; clic fuera cierra el submenú de escritorio.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProductsOpen(false);
        setIsMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  return (
    <header className="w-full border-b border-divider relative z-50 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg sm:text-xl whitespace-nowrap font-extrabold uppercase tracking-tighter text-gradient-electric">
                Las Chikas Design
              </span>
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest hidden 2xl:inline ml-4">
                Gráfica · Est. 1998
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav aria-label="Principal" className="hidden xl:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <div
              ref={productsRef}
              className="relative flex items-center gap-1"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsProductsOpen(false);
              }}
            >
              <Link href="/productos" onClick={() => setIsProductsOpen(false)} className="hover:text-brand transition-colors">Productos</Link>
              <button
                type="button"
                aria-label="Mostrar categorías de productos"
                aria-expanded={isProductsOpen}
                aria-controls="submenu-productos"
                onClick={() => setIsProductsOpen((v) => !v)}
                className="p-1 hover:text-brand transition-colors"
              >
                <svg className={`w-3 h-3 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProductsOpen && (
                <div id="submenu-productos" className="absolute left-0 top-full pt-2 min-w-56 z-50">
                  <ul className="flex flex-col bg-background border border-divider shadow-lg">
                    {PRODUCT_LINKS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsProductsOpen(false)}
                          className="block px-5 py-3 hover:bg-gray-50 hover:text-brand transition-colors whitespace-nowrap"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li className="border-t border-divider">
                      <Link
                        href="/productos"
                        onClick={() => setIsProductsOpen(false)}
                        className="block px-5 py-3 text-xs font-mono text-gray-500 hover:text-brand transition-colors whitespace-nowrap"
                      >
                        Ver todo el catálogo →
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
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
              type="button"
              className="xl:hidden p-2 uppercase text-xs font-bold tracking-widest flex items-center gap-2"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="menu-movil"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? 'Cerrar' : 'Menú'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="menu-movil" className="xl:hidden absolute top-full left-0 w-full bg-background border-b border-divider shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto">
          <nav aria-label="Principal móvil" className="flex flex-col px-4 py-8 gap-6 text-sm font-bold uppercase tracking-widest">
            <Link href="/" onClick={toggleMenu} className="hover:text-brand transition-colors">Inicio</Link>
            <div className="flex flex-col gap-4">
              <Link href="/productos" onClick={toggleMenu} className="hover:text-brand transition-colors">Productos</Link>
              <ul className="flex flex-col gap-4 pl-4 border-l border-divider text-xs">
                {PRODUCT_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={toggleMenu} className="block py-1 text-gray-600 hover:text-brand transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
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
