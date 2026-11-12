import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';
import { catalogEntryHref } from '@/data/catalogEntries';
import { catalogPhotos } from '@/data/productImages';
import Link from 'next/link';

export default function ProductosPage() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb wrap items={[{ label: 'Productos' }]} />
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8">
        Catálogo Completo
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mb-8">
        Explorá nuestras líneas de indumentaria, merchandising y gráfica de gran formato. Producción 100% propia.
      </p>
      <nav aria-label="Categorías del catálogo" className="flex flex-wrap gap-x-6 gap-y-2 mb-16 text-sm font-bold">
        <Link href="/productos/indumentaria" className="py-2 underline underline-offset-4 hover:text-brand">Indumentaria</Link>
        <Link href="/productos/merchandising" className="py-2 underline underline-offset-4 hover:text-brand">Merchandising</Link>
        <Link href="/productos/grafica" className="py-2 underline underline-offset-4 hover:text-brand">Gráfica</Link>
      </nav>

      {/* 1. INDUMENTARIA */}
      <section id="indumentaria" className="mb-24">
        <SectionDivider text="INDUMENTARIA" metadata="TEXTIL, UNIFORMES Y DEPORTIVO" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard 
            title="Remeras Personalizadas"
            photo={catalogPhotos.remeras}
            category="Indumentaria"
            description="Algodón o poliéster. Estampadas en serigrafía o sublimación."
            href="/productos/indumentaria/remeras-personalizadas"
          />
          <ProductCard 
            title="Camperas"
            category="Indumentaria"
            description="Camperas de abrigo y rompevientos con logo bordado o estampado."
            href={catalogEntryHref('camperas')}
          />
          <ProductCard 
            title="Conjuntos Deportivos"
            category="Indumentaria"
            description="Camisetas y shorts diseñados a medida para clubes y equipos."
            href={catalogEntryHref('conjuntos-deportivos')}
          />
        </div>
      </section>

      {/* 2. MERCHANDISING */}
      <section id="merchandising" className="mb-24">
        <SectionDivider text="MERCHANDISING" metadata="PROMOCIONALES Y ACCESORIOS" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            title="Bolsos Botineros"
            category="Merchandising"
            description="Bolsos resistentes personalizados para clubes y delegaciones."
            href={catalogEntryHref('botineros')}
          />
          <ProductCard 
            title="Banderas"
            photo={catalogPhotos.banderas}
            category="Merchandising"
            description="Telas sublimadas full color de alta resistencia para exterior e interior."
            href={catalogEntryHref('banderas')}
          />
          <ProductCard 
            title="Regalos Empresariales"
            category="Merchandising"
            description="Tazas, mates, libretas y bolígrafos personalizados con tu marca."
            href={catalogEntryHref('regalos-empresariales')}
          />
        </div>
      </section>

      {/* 3. GRÁFICA */}
      <section id="grafica" className="mb-24">
        <SectionDivider text="GRÁFICA" metadata="GRAN FORMATO Y CARTELERÍA" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard 
            title="Banners y Roll Ups"
            category="Gráfica"
            description="Lona frontlit impresa en alta definición. Ideal para eventos y puntos de venta."
            href={catalogEntryHref('banners')}
          />
          <ProductCard 
            title="Ploteo de Vidrieras"
            photo={catalogPhotos.vidrieras}
            category="Gráfica"
            description="Vinilos de corte e impresos para frentes comerciales y señalética."
            href={catalogEntryHref('vidrieras')}
          />
          <ProductCard 
            title="Marquesinas"
            category="Gráfica"
            description="Cartelería exterior luminosa, frentes y estructuras a medida."
            href={catalogEntryHref('marquesinas')}
          />
        </div>
      </section>
      
    </div>
  );
}
