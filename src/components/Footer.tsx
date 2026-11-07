import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/images/logo/20231028_172144_0000 (1).png';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} w-full mt-24`}>
      <div className={`${styles.inner} mx-auto px-4 lg:px-6`}>
        <div className={styles.columns}>
          
          <div className={styles.brand}>
            <Link href="/" className={styles.logo} aria-label="Las Chikas Design — Inicio">
              <Image src={logo} alt="Las Chikas Design" sizes="144px" className={styles.logoImage} />
            </Link>
            <p className={styles.description}>
              Indumentaria, gráfica y merchandising para clubes, empresas, comercios, eventos y obras.
            </p>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Enlaces rápidos</h3>
            <nav aria-label="Enlaces del pie de página" className={styles.links}>
              <Link href="/">Inicio</Link>
              <Link href="/trabajos-realizados">Trabajos</Link>
              <Link href="/productos">Catálogo</Link>
              <Link href="/nosotros">Nosotros</Link>
              <Link href="/soluciones">Soluciones</Link>
              <Link href="/faq">Preguntas Frecuentes</Link>
            </nav>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Contacto</h3>
            <Link href="/contacto" className={styles.contactLink}>
              <svg width="21" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="1" y="1" width="20" height="16" rx="2" />
                <path d="m2 2 9 7 9-7" />
              </svg>
              Ir a Contacto
            </Link>
            <p className={styles.pending}>Datos de contacto pendientes de confirmación.</p>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Redes sociales</h3>
            <div className={styles.socials}>
              {/* Íconos informativos: incorporar enlaces solo al confirmar los perfiles. */}
              <span role="img" aria-label="Instagram: perfil pendiente de confirmación" className={styles.socialIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </span>
              <span role="img" aria-label="Facebook: perfil pendiente de confirmación" className={styles.socialIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.4A23 23 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v9Z" />
                </svg>
              </span>
              <span role="img" aria-label="TikTok: perfil pendiente de confirmación" className={styles.socialIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 3v13a4 4 0 1 1-4-4M14 3c0 4 3 6 6 6" />
                </svg>
              </span>
              <span role="img" aria-label="YouTube: perfil pendiente de confirmación" className={styles.socialIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
                </svg>
              </span>
            </div>
            <p className={styles.pending}>Perfiles pendientes de confirmación.</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {currentYear} Las Chikas Design
          </p>
        </div>
      </div>
    </footer>
  );
}
