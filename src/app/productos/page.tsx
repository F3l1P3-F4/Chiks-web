import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';

export default function ProductosPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb items={[{ label: 'Productos' }]} />
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8">
        Catálogo Completo
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mb-16">
        Explorá nuestras líneas de indumentaria, merchandising y gráfica de gran formato. Producción 100% propia.
      </p>

      {/* 1. INDUMENTARIA */}
      <section id="indumentaria" className="mb-24">
        <SectionDivider text="INDUMENTARIA" metadata="TEXTIL, UNIFORMES Y DEPORTIVO" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCard 
            title="Remeras Personalizadas"
            category="Indumentaria"
            description="Algodón o poliéster. Estampadas en serigrafía o sublimación sin límite de colores."
            href="/productos/indumentaria/remeras-personalizadas"
          />
          <ProductCard 
            title="Camperas"
            category="Indumentaria"
            description="Camperas de abrigo y rompevientos con logo bordado o estampado."
            href="/productos/indumentaria"
            ctaText="Ver Indumentaria"
          />
          <ProductCard 
            title="Conjuntos Deportivos"
            category="Indumentaria"
            description="Camisetas y shorts diseñados a medida para clubes y equipos."
            href="/productos/indumentaria"
            ctaText="Ver Indumentaria"
          />
          <ProductCard 
            title="Bolsos Botineros"
            category="Indumentaria"
            description="Bolsos resistentes personalizados para clubes y delegaciones."
            href="/productos/merchandising"
            ctaText="Ver en Merchandising"
          />
        </div>
      </section>

      {/* 2. MERCHANDISING */}
      <section id="merchandising" className="mb-24">
        <SectionDivider text="MERCHANDISING" metadata="PROMOCIONALES Y ACCESORIOS" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCard 
            title="Banderas"
            category="Merchandising"
            description="Telas sublimadas full color de alta resistencia para exterior e interior."
            href="/productos/merchandising"
            ctaText="Ver Merchandising"
          />
          <ProductCard 
            title="Regalos Empresariales"
            category="Merchandising"
            description="Tazas, mates, libretas y bolígrafos personalizados con tu marca."
            href="/productos/merchandising"
            ctaText="Ver Merchandising"
          />
        </div>
      </section>

      {/* 3. GRÁFICA */}
      <section id="grafica" className="mb-24">
        <SectionDivider text="GRÁFICA" metadata="GRAN FORMATO Y CARTELERÍA" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCard 
            title="Banners y Roll Ups"
            category="Gráfica"
            description="Lona frontlit impresa en alta definición. Ideal para eventos y puntos de venta."
            href="/productos/grafica"
            ctaText="Ver Gráfica"
          />
          <ProductCard 
            title="Ploteo de Vidrieras"
            category="Gráfica"
            description="Vinilos de corte e impresos para frentes comerciales y señalética."
            href="/productos/grafica"
            ctaText="Ver Gráfica"
          />
          <ProductCard 
            title="Marquesinas"
            category="Gráfica"
            description="Cartelería exterior luminosa, frentes y estructuras a medida."
            href="/productos/grafica"
            ctaText="Ver Gráfica"
          />
        </div>
      </section>
      
    </div>
  );
}
