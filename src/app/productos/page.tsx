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

      {/* Categorías (Navegación interna) */}
      <div className="flex gap-4 mb-12 border-b border-divider pb-4 overflow-x-auto">
        <span className="font-bold uppercase tracking-widest text-sm text-brand border-b-2 border-brand pb-2 whitespace-nowrap">Todos</span>
        <a href="#indumentaria" className="font-bold uppercase tracking-widest text-sm text-gray-400 hover:text-foreground transition-colors pb-2 whitespace-nowrap">Indumentaria</a>
        <a href="#merchandising" className="font-bold uppercase tracking-widest text-sm text-gray-400 hover:text-foreground transition-colors pb-2 whitespace-nowrap">Merchandising</a>
        <a href="#grafica" className="font-bold uppercase tracking-widest text-sm text-gray-400 hover:text-foreground transition-colors pb-2 whitespace-nowrap">Gráfica</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
        <ProductCard 
          title="Remeras Personalizadas"
          category="Indumentaria"
          description="Algodón o poliéster. Estampadas en serigrafía o sublimación."
          href="/productos/indumentaria/remeras-personalizadas"
        />
        <ProductCard 
          title="Camperas"
          category="Indumentaria"
          description="Camperas de abrigo y rompevientos con logo bordado o estampado."
          href="/productos/indumentaria/camperas"
        />
        <ProductCard 
          title="Banderas"
          category="Merchandising"
          description="Telas sublimadas full color de alta resistencia."
          href="/productos/merchandising/banderas"
        />
        <ProductCard 
          title="Banners"
          category="Gráfica"
          description="Lona frontlit impresa en alta definición."
          href="/productos/grafica/banners"
        />
        <ProductCard 
          title="Bolsos Botineros"
          category="Indumentaria"
          description="Bolsos resistentes personalizados para clubes."
          href="/productos/indumentaria/bolsos-botineros"
        />
        <ProductCard 
          title="Regalos Empresariales"
          category="Merchandising"
          description="Tazas, mates, libretas y bolígrafos personalizados."
          href="/productos/merchandising/regalos-empresariales"
        />
        <ProductCard 
          title="Ploteo de Vidrieras"
          category="Gráfica"
          description="Vinilos de corte e impresos para frentes comerciales."
          href="/productos/grafica/ploteo"
        />
        <ProductCard 
          title="Marquesinas"
          category="Gráfica"
          description="Cartelería exterior luminosa y frentes."
          href="/productos/grafica/marquesinas"
        />
      </div>
      
    </div>
  );
}
