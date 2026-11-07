import React from 'react';
import Button from '@/components/Button';
import SolutionCard from '@/components/SolutionCard';
import styles from './Hero.module.css';
import solutionStyles from '@/components/SolutionCard.module.css';
import WorkGallery from '@/components/WorkGallery';
import galleryStyles from '@/components/WorkGallery.module.css';
import processStyles from './Process.module.css';

export default function Home() {
  return (
    <div className="bg-portada relative isolate overflow-hidden">
    <div aria-hidden="true" className="bg-portada-curvas pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1400px]" />
    <div className="container mx-auto px-4 lg:px-8 py-12">
      
      {/* HERO */}
      <section aria-labelledby="hero-title" className={`${styles.hero} relative isolate mb-16 grid items-center gap-10 lg:grid-cols-2`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Diseño <span aria-hidden="true">|</span> Impresión <span aria-hidden="true">|</span> Personalización</p>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.firstLine}>Tintas que</span>{' '}
            <span className={styles.highlight}><span>hablan</span></span>
          </h1>
          <p className={styles.subtitle}>
            Indumentaria, gráfica y merchandising que hacen visible tu identidad
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Button href="/productos" variant="solid" showArrow={false} className={styles.button}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M2 2h5v5H2zm11 0h5v5h-5zM2 13h5v5H2zm11 0h5v5h-5z" />
              </svg>
              Explorá el catálogo
            </Button>
            <Button href="/contacto" showArrow={false} className={styles.button}>
              <svg width="22" height="20" viewBox="0 0 22 20" fill="currentColor" aria-hidden="true">
                <path d="M21 1 1 8l7 3L18 4l-8 9 3 6 8-18Z" />
              </svg>
              Solicitar presupuesto
            </Button>
          </div>
        </div>
        {/* Espacio para la composición original de productos de public/images/hero/.
            Falta el recurso: no se muestran productos inventados ni imágenes rotas.
            Al incorporarlo, usar next/image con import estático y object-fit: contain. */}
        <div aria-hidden="true" className={`${styles.products} hidden lg:block`} />
      </section>

      {/* SOLUCIONES POR PERFIL */}
      <section className="mb-6" aria-labelledby="soluciones-title">
        <h2 id="soluciones-title" className={galleryStyles.title}>SOLUCIONES POR PERFIL</h2>
        <div className={solutionStyles.profileGrid}>
          <SolutionCard 
            title="Clubes y Equipos"
            variant="clubes"
            items={['Indumentaria deportiva', 'Banderas y estandartes', 'Merchandising para hinchas']}
            href="/soluciones/clubes-y-equipos"
          />
          <SolutionCard 
            title="Empresas"
            variant="empresas"
            items={['Indumentaria corporativa', 'Regalos empresariales', 'Gráfica para oficinas']}
            href="/soluciones/empresas"
          />
          <SolutionCard 
            title="Comercios"
            variant="comercios"
            items={['Ploteo de vidrieras', 'Marquesinas y cartelería', 'Decoración interior']}
            href="/soluciones/comercios"
          />
          <SolutionCard 
            title="Eventos"
            variant="eventos"
            items={['Banners y fly banners', 'Armado de stands', 'Souvenirs']}
            href="/soluciones/eventos"
          />
          <SolutionCard 
            title="Obras"
            variant="obras"
            items={['Frentes de obra en lona', 'Cartelería de seguridad', 'Señalética']}
            href="/soluciones/obras"
          />
        </div>
      </section>

      {/* TRABAJOS REALIZADOS */}
      <section className="mb-32" aria-labelledby="trabajos-title">
        <WorkGallery />
      </section>

      {/* PROCESO */}
      <section className="mb-32" aria-labelledby="proceso-title">
        <h2 id="proceso-title" className={galleryStyles.title}>
          Proceso de trabajo
        </h2>
        <ol className={processStyles.steps}>
          {[
            {
              step: '1', title: 'Consulta', desc: 'Contanos tu idea.',
              icon: <>
                <path d="M40 22c0 10-8 17-18 17h-5L7 44l3-11a16 16 0 0 1-6-12C4 11 12 5 22 5s18 7 18 17Z" />
                <circle cx="14" cy="22" r="1.5" /><circle cx="22" cy="22" r="1.5" /><circle cx="30" cy="22" r="1.5" />
              </>
            },
            {
              step: '2', title: 'Diseño', desc: 'Propuesta visual personalizada.',
              icon: <>
                <rect x="8" y="6" width="32" height="28" rx="2" />
                <path d="M8 34 3 42h42l-5-8M19 26l2-7L31 9l5 5-10 10-7 2ZM19 38h10" />
              </>
            },
            {
              step: '3', title: 'Producción', desc: 'Impresión con calidad profesional.',
              icon: <>
                <path d="M14 16V5h20v11M14 36H8a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-6" />
                <path d="M14 28h20v15H14ZM19 33h10M19 38h10M35 22h3" />
              </>
            }
          ].map((s) => (
            <li key={s.step} className={processStyles.step}>
              <svg className={processStyles.icon} width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {s.icon}
              </svg>
              <div className={processStyles.copy}>
                <h3 className={processStyles.title}>{s.step}. {s.title}</h3>
                <p className={processStyles.description}>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      
    </div>
    </div>
  );
}
