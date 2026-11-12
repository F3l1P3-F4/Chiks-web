import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';
import { indumentariaGroups, indumentariaGroupHref, type IndumentariaGroupSlug } from '@/data/indumentariaGroups';
import Button from '@/components/Button';

export const metadata: Metadata = {
  title: "Indumentaria | Las Chikas Design",
  description: "Líneas de indumentaria textil: egresados, deportiva, empresarial, bandas y personalizada. Confección y estampado propio.",
};

export default function IndumentariaPage() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: 'Indumentaria' }
      ]} />
      
      <div className="max-w-4xl mb-16">
        <SectionDivider text="CATÁLOGO TEXTIL" metadata="CONFECCIÓN Y ESTAMPADO PROPIO" />
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8 break-words">
          Indumentaria
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Prendas confeccionadas y estampadas en nuestro taller para colegios, clubes, empresas y proyectos independientes. Producción directa sin intermediarios.
        </p>
      </div>

      {/* 5 SUBCATEGORÍAS */}
      <section className="mb-24">
        <SectionDivider text="SUBCATEGORÍAS" metadata="5 LÍNEAS DE PRODUCCIÓN" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(indumentariaGroups) as IndumentariaGroupSlug[]).map((slug) => (
            <ProductCard key={slug} {...indumentariaGroups[slug]} href={indumentariaGroupHref(slug)} ctaText="Ver línea" />
          ))}
        </div>
      </section>

      {/* ASESORAMIENTO Y CONSULTAS */}
      <section className="border-t border-divider pt-16 mb-16">
        <div className="internal-surface p-8 md:p-12 border border-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-3">
              ¿Buscás indumentaria para tu grupo o empresa?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Te asesoramos sobre telas, moldería, tablas de talles y técnicas de estampado ideales para tu volumen y presupuesto.
            </p>
          </div>
          <Button href="/contacto" variant="solid" className="w-full sm:w-auto min-w-0 max-w-full text-center">
            Solicitar Presupuesto
          </Button>
        </div>
      </section>

    </div>
  );
}
