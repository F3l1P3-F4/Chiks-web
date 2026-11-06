import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';

export const metadata: Metadata = {
  title: "Merchandising | Las Chikas Design",
  description: "Artículos promocionales y merchandising para marcas y clubes: tazas, gorras, botineros, mochilas, banderas y más.",
};

export default function MerchandisingPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: 'Productos', href: '/productos' },
        { label: 'Merchandising' }
      ]} />
      
      <div className="max-w-4xl mb-16">
        <SectionDivider text="MERCHANDISING INTEGRAL" metadata="ARTÍCULOS Y ACCESORIOS PERSONALIZADOS" />
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8 break-words">
          Merchandising
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Desarrollo y producción de artículos promocionales y accesorios personalizados para empresas, eventos, marcas y entidades deportivas.
        </p>
      </div>

      {/* 1. ARTÍCULOS GENERALES */}
      <section id="articulos-generales" className="mb-24">
        <SectionDivider text="ARTÍCULOS GENERALES" metadata="PROMOCIONALES, EMPRESAS Y EVENTOS" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard 
            title="Gorras"
            category="Merchandising"
            description="Gorras personalizadas con estampado o bordado para marcas, eventos o merchandising promocional."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Tazas"
            category="Merchandising"
            description="Tazas personalizadas con logo o diseño full color. Ideales para regalos empresariales, souvenirs o venta."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Buzos y Hoodies"
            category="Merchandising"
            description="Buzos clásicos y hoodies con capucha, personalizados con estampado o bordado para marcas o eventos."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Llaveros"
            category="Merchandising"
            description="Llaveros personalizados para promociones, souvenirs y difusión de marca en diversos formatos."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Neceseres"
            category="Merchandising"
            description="Organizadores y neceseres multiuso personalizados para kits de bienvenida, viajes o regalos."
            ctaText="Ficha en desarrollo"
          />
        </div>
      </section>

      {/* 2. ARTÍCULOS PARA CLUBES */}
      <section id="articulos-clubes" className="mb-24">
        <SectionDivider text="ARTÍCULOS PARA CLUBES" metadata="LÍNEA DEPORTIVA E INSTITUCIONAL" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            title="Botineros"
            category="Merchandising"
            description="Bolsos botineros personalizados con escudo y colores para planteles, socios y torneos."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Mochilas"
            category="Merchandising"
            description="Mochilas deportivas personalizadas para traslados, entrenamientos y delegaciones de clubes."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Toallones"
            category="Merchandising"
            description="Toallones deportivos estampados a medida para disciplinas acuáticas, vestuarios y gimnasios."
            ctaText="Ficha en desarrollo"
          />
          <ProductCard 
            title="Banderas"
            category="Merchandising"
            description="Banderas, tirantes y estandartes sublimados full color para clubes, hinchadas y eventos deportivos."
            ctaText="Ficha en desarrollo"
          />
        </div>
      </section>

      {/* ASESORAMIENTO Y PRESUPUESTOS */}
      <section className="border-t border-divider pt-16 mb-16">
        <div className="bg-gray-50 p-8 md:p-12 border border-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-3">
              ¿Buscás merchandising para tu marca o club?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Producimos accesorios y artículos personalizados en volumen con entregas coordinadas y asesoramiento directo.
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
