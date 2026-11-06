import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';

export const metadata: Metadata = {
  title: "Gráfica e Impresión Ecosolvente | Las Chikas Design",
  description: "Impresión en gran formato y cartelería: lonas, vinilos, microperforados, backlite, marquesinas, vidrieras, ploteo vehicular, stands y cartelería.",
};

export default function GraficaPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb items={[
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
          <ProductCard 
            title="Lonas"
            category="Impresión ecosolvente"
            description="Lonas frontlit, blackout y mesh impresas en alta resolución para cartelería exterior, fondos y cerramientos."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Banners"
            category="Impresión ecosolvente"
            description="Banners con portabanner o soporte roll-up, resistentes y fáciles de trasladar para ferias, presentaciones y eventos."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Vinilos"
            category="Impresión ecosolvente"
            description="Vinilos impresos brillantes o mate, y vinilos de corte para señalización, calcos y decoración de superficies lisas."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Microperforados"
            category="Impresión ecosolvente"
            description="Vinilo microperforado para vidrios de locales o lunetas vehiculares. Permite visión exterior manteniendo privacidad interna."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Backlite"
            category="Impresión ecosolvente"
            description="Soportes traslúcidos diseñados especialmente para carteles luminosos, cajas de luz y retroiluminación uniforme."
            ctaText="Ficha en desarrollo"
          />
        </div>
      </section>

      {/* ESPACIO PARA VIDEO DEL PLOTTER EN ACCIÓN */}
      <section id="proceso-productivo" className="mb-24">
        <SectionDivider text="TECNOLOGÍA DE IMPRESIÓN" metadata="PRODUCCIÓN DIRECTA" />
        <div className="border border-divider bg-gray-50 p-6 md:p-12 relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center py-10 md:py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary mb-2">
              [ Registro en taller ]
            </p>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase mb-4">
              Plotter Ecosolvente en Producción
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 max-w-lg mx-auto">
              Espacio destinado para mostrar el funcionamiento de nuestro plotter en taller, imprimiendo sustratos en alta definición.
            </p>
            <span className="inline-block px-3 py-1 text-xs font-mono border border-divider text-gray-500 bg-white uppercase tracking-wider">
              Video en preparación
            </span>
          </div>
        </div>
      </section>

      {/* 2. CARTELERÍA Y SERVICIOS */}
      <section id="carteleria-servicios" className="mb-24">
        <SectionDivider text="CARTELERÍA Y SERVICIOS" metadata="INSTALACIONES COMERCIALES Y VEHICULARES" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            title="Marquesinas"
            category="Cartelería y servicios"
            description="Estructuras exteriores de gran impacto visual, frentes comerciales metálicos y marquesinas con o sin iluminación."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Vidrieras"
            category="Cartelería y servicios"
            description="Ploteo integral de frentes comerciales, vinilo esmerilado, promocional y de corte para vidrieras y accesos."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Ploteo Vehicular"
            category="Cartelería y servicios"
            description="Rotulación gráfica de utilitarios, camionetas y flotas comerciales para difusión de marca en vía pública."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Stands y Cartelería"
            category="Cartelería y servicios"
            description="Armado de cartelería corpórea, cuadros, tótems y elementos gráficos para stands de ferias y eventos."
            ctaText="Ficha en desarrollo"
          />
        </div>
      </section>

      {/* ASESORAMIENTO Y PRESUPUESTOS */}
      <section className="border-t border-divider pt-16 mb-16">
        <div className="bg-gray-50 p-8 md:p-12 border border-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-3">
              ¿Tenés un proyecto de cartelería o impresión en gran formato?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Realizamos presupuestos según medidas, materiales y tipo de colocación requerida. Consultanos por asesoramiento directo.
            </p>
          </div>
          <Button href="/contacto" variant="solid" className="whitespace-nowrap">
            Solicitar Presupuesto
          </Button>
        </div>
      </section>

    </div>
  );
}
