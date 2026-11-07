'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '../../public/images/logo/20231028_172144_0000 (1).png';
import styles from './Header.module.css';

const PRODUCT_LINKS = [
  { href: '/productos/indumentaria', label: 'Indumentaria' },
  { href: '/productos/merchandising', label: 'Merchandising' },
  { href: '/productos/grafica', label: 'Gráfica' },
];

export default function Header() {
  const pathname = usePathname();
  const navClass = (href: string) => `${styles.navLink} ${pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)) ? styles.active : ''}`;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Escape cierra menús; clic fuera cierra el submenú de escritorio.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.getElementById('submenu-productos')?.contains(document.activeElement)) {
          productsRef.current?.querySelector('button')?.focus();
        }
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
    <header className={`${styles.header} w-full relative z-50`}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-5 h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className={styles.logo} aria-label="Las Chikas Design — Inicio">
              <Image src={logo} alt="Las Chikas Design" priority sizes="132px" className={styles.logoImage} />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav aria-label="Principal" className="hidden xl:flex items-center gap-6 2xl:gap-9 text-base font-bold">
            <Link href="/" className={navClass('/')} aria-current={pathname === '/' ? 'page' : undefined}>Inicio</Link>
            <div
              ref={productsRef}
              className="relative flex items-center gap-1"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsProductsOpen(false);
              }}
            >
              <Link href="/productos" onClick={() => setIsProductsOpen(false)} className={navClass('/productos')}>Catálogo</Link>
              <button
                type="button"
                aria-label="Mostrar categorías de productos"
                aria-expanded={isProductsOpen}
                aria-controls="submenu-productos"
                onClick={(e) => setIsProductsOpen((open) => e.detail === 0 ? !open : true)}
                className="p-2 hover:text-[#df007c] transition-colors"
              >
                <svg className={`w-3 h-3 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProductsOpen && (
                <div id="submenu-productos" className="absolute left-0 top-full pt-2 min-w-56 z-50">
                  <ul className="flex flex-col bg-white border border-divider rounded-lg shadow-lg">
                    {PRODUCT_LINKS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsProductsOpen(false)}
                          className="block px-5 py-3 hover:bg-gray-50 hover:text-[#df007c] transition-colors whitespace-nowrap"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li className="border-t border-divider">
                      <Link
                        href="/productos"
                        onClick={() => setIsProductsOpen(false)}
                          className="block px-5 py-3 text-sm text-gray-600 hover:text-[#df007c] transition-colors whitespace-nowrap"
                      >
                        Ver todo el catálogo →
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <Link href="/soluciones" className={navClass('/soluciones')}>Soluciones</Link>
            <Link href="/trabajos-realizados" className={navClass('/trabajos-realizados')}>Trabajos</Link>
            <Link href="/nosotros" className={navClass('/nosotros')}>Nosotros</Link>
            <Link href="/faq" className={navClass('/faq')}>Preguntas Frecuentes</Link>
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className={`${styles.contactGroup} hidden sm:block`}>
              <Link href="/contacto" className={styles.contact}>
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <rect x="1" y="1" width="20" height="16" rx="1" />
                  <path d="m2 2 9 7 9-7M2 16l6-6m12 6-6-6" />
                </svg>
                Contacto
              </Link>
            </div>
            <button 
              type="button"
              className="xl:hidden p-3 text-sm font-bold flex items-center gap-2 rounded-lg border border-[#07134b]/20 hover:text-[#df007c]"
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
        <div id="menu-movil" className="xl:hidden absolute top-full left-0 w-full bg-white border-b border-divider shadow-lg max-h-[calc(100dvh-5rem)] overflow-y-auto">
          <nav aria-label="Principal móvil" className="flex flex-col px-6 py-6 gap-4 text-base font-bold">
            <Link href="/" onClick={toggleMenu} className={navClass('/')}>Inicio</Link>
            <div className="flex flex-col gap-4">
              <Link href="/productos" onClick={toggleMenu} className={navClass('/productos')}>Catálogo</Link>
              <ul className="flex flex-col gap-4 pl-4 border-l border-divider text-xs">
                {PRODUCT_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={toggleMenu} className="block py-1 text-gray-600 hover:text-[#df007c] transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/soluciones" onClick={toggleMenu} className={navClass('/soluciones')}>Soluciones</Link>
            <Link href="/trabajos-realizados" onClick={toggleMenu} className={navClass('/trabajos-realizados')}>Trabajos</Link>
            <Link href="/nosotros" onClick={toggleMenu} className={navClass('/nosotros')}>Nosotros</Link>
            <Link href="/faq" onClick={toggleMenu} className={navClass('/faq')}>Preguntas Frecuentes</Link>
            <Link href="/contacto" onClick={toggleMenu} className={`${styles.contact} self-start`}>Contacto</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
