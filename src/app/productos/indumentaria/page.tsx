import { pageMetadata } from '@/lib/seo';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';
import { indumentariaGroups, indumentariaGroupHref, type IndumentariaGroupSlug } from '@/data/indumentariaGroups';
import Button from '@/components/Button';
import CatalogIntro from '@/components/CatalogIntro';
import Link from 'next/link';
import { catalogEntries, catalogEntryHref, catalogProductSlugs } from '@/data/catalogEntries';


export const metadata = pageMetadata('/productos/indumentaria');

export default function IndumentariaPage() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb currentPath="/productos/indumentaria" wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: 'Indumentaria' }
      ]} />
      
      <CatalogIntro title="Indumentaria" context="CATÁLOGO TEXTIL" metadata="CONFECCIÓN Y ESTAMPADO PROPIO">
          Prendas confeccionadas y estampadas en nuestro taller para colegios, clubes, empresas y proyectos independientes. Producción directa sin intermediarios.
      </CatalogIntro>

      <p className="text-sm text-gray-600 mb-8">Para preparar un presupuesto, abrí una ficha y agregá el producto a Mi consulta con la cantidad y las observaciones que necesites.</p>
      <nav aria-label="Productos de Indumentaria" className="mb-12">
        <h2 className="text-xl mb-4">Productos disponibles</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {catalogProductSlugs.filter((slug) => catalogEntries[slug].categorySlug === 'indumentaria').map((slug) => (
            <li key={slug}>
              <Link href={catalogEntryHref(slug)} className="inline-block py-2 text-sm font-bold underline underline-offset-4 hover:text-brand">
                {catalogEntries[slug].title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

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
            Consulta general
          </Button>
        </div>
      </section>

    </div>
  );
}
