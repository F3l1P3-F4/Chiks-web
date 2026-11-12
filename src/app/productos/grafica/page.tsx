import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';
import { catalogEntries, catalogEntryHref } from '@/data/catalogEntries';
import Button from '@/components/Button';

export const metadata: Metadata = {
  title: "Gráfica e Impresión Ecosolvente | Las Chikas Design",
  description: "Impresión en gran formato y cartelería: lonas, vinilos, microperforados, backlite, marquesinas, vidrieras, ploteo vehicular, stands y cartelería.",
};

export default function GraficaPage() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: 'Gráfica' }
      ]} />
      
      <div className="max-w-4xl mb-16">
        <SectionDivider text="GRÁFICA Y GRAN FORMATO" metadata="PRODUCCIÓN DIRECTA EN TALLER" />
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8 break-words">
          Gráfica
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Impresión gráfica de gran formato, cartelería y señalética comercial con tecnología de plotter ecosolvente. Soluciones a medida para locales, vía pública, vehículos y eventos.
        </p>
      </div>

      {/* 1. IMPRESIÓN ECOSOLVENTE */}
      <section id="impresion-ecosolvente" className="mb-24">
        <SectionDivider text="IMPRESIÓN ECOSOLVENTE" metadata="SUSTRATOS Y SOPORTES DE GRAN FORMATO" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard {...catalogEntries['lonas']} href={catalogEntryHref('lonas')} />
          <ProductCard {...catalogEntries['banners']} href={catalogEntryHref('banners')} />
          <ProductCard {...catalogEntries['vinilos']} href={catalogEntryHref('vinilos')} />
          <ProductCard {...catalogEntries['microperforados']} href={catalogEntryHref('microperforados')} />
          <ProductCard {...catalogEntries['backlite']} href={catalogEntryHref('backlite')} />
        </div>
      </section>

      <section id="proceso-productivo" className="mb-24">
        <SectionDivider text="TECNOLOGÍA DE IMPRESIÓN" metadata="PRODUCCIÓN DIRECTA" />
        <div className="internal-surface border border-divider p-6 md:p-12">
          <h2 className="text-2xl mb-4">Plotter ecosolvente</h2>
          <p className="text-gray-600 leading-relaxed">Impresión gráfica de gran formato para lonas, vinilos y otros soportes del catálogo.</p>
        </div>
      </section>

      {/* 2. CARTELERÍA Y SERVICIOS */}
      <section id="carteleria-servicios" className="mb-24">
        <SectionDivider text="CARTELERÍA Y SERVICIOS" metadata="INSTALACIONES COMERCIALES Y VEHICULARES" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard {...catalogEntries['marquesinas']} href={catalogEntryHref('marquesinas')} />
          <ProductCard {...catalogEntries['vidrieras']} href={catalogEntryHref('vidrieras')} />
          <ProductCard {...catalogEntries['ploteo-vehicular']} href={catalogEntryHref('ploteo-vehicular')} />
          <ProductCard {...catalogEntries['stands-y-carteleria']} href={catalogEntryHref('stands-y-carteleria')} />
        </div>
      </section>

      {/* ASESORAMIENTO Y PRESUPUESTOS */}
      <section className="border-t border-divider pt-16 mb-16">
        <div className="internal-surface p-8 md:p-12 border border-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-3">
              ¿Tenés un proyecto de cartelería o impresión en gran formato?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Realizamos presupuestos según medidas, materiales y tipo de colocación requerida. Consultanos por asesoramiento directo.
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
