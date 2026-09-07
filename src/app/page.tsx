import React from 'react';
import Button from '@/components/Button';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';
import SolutionCard from '@/components/SolutionCard';

export default function Home() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      
      {/* HERO */}
      <section className="mb-32 mt-12">
        <SectionDivider text="GRÁFICA INTEGRAL" metadata="BUENOS AIRES, AR" />
        <div className="max-w-6xl">
          <h1 className="text-[12vw] sm:text-8xl md:text-9xl lg:text-[180px] font-extrabold tracking-tighter uppercase leading-[0.8] mb-12 text-foreground">
            Tinta<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px var(--color-brand)' }}>Que</span><br />
            Habla
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-12 leading-relaxed">
            Imprimimos, sublimamos y vestimos ideas. Producción propia de punta a punta: de la remera al cartel de seis metros, sin intermediarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/productos" variant="solid">Ver Productos</Button>
            <Button href="/contacto">Solicitar Pedido</Button>
          </div>
        </div>
      </section>

      {/* ¿QUÉ ESTÁS BUSCANDO? */}
      <section className="mb-32">
        <SectionDivider text="NAVEGACIÓN RÁPIDA" metadata="¿QUÉ ESTÁS BUSCANDO?" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-divider border border-divider">
          {[
            { label: 'Indumentaria', href: '/productos/indumentaria' },
            { label: 'Merchandising', href: '/productos/merchandising' },
            { label: 'Gráfica', href: '/productos/grafica' },
            { label: 'Comercios', href: '/soluciones/comercios' },
            { label: 'Eventos', href: '/soluciones/eventos' },
            { label: 'Clubes', href: '/soluciones/clubes-y-equipos' },
          ].map((cat) => (
            <a 
              key={cat.label} 
              href={cat.href}
              className="bg-white p-8 aspect-square flex flex-col items-center justify-center text-center hover:bg-foreground hover:text-white transition-colors duration-300 group"
            >
              <span className="font-bold uppercase tracking-widest text-xs md:text-sm">{cat.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="mb-32">
        <div className="flex justify-between items-end mb-12">
          <div className="flex-grow">
            <SectionDivider text="CATÁLOGO" metadata="PRODUCTOS DESTACADOS" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCard 
            title="Remeras Personalizadas"
            category="Indumentaria"
            description="Algodón o poliéster. Estampadas en serigrafía o sublimación sin límite de colores."
            href="/productos/indumentaria/remeras-personalizadas"
          />
          <ProductCard 
            title="Conjuntos Deportivos"
            category="Indumentaria"
            description="Camisetas y shorts diseñados a medida para clubes y equipos."
            href="/productos/indumentaria/conjuntos-deportivos"
          />
          <ProductCard 
            title="Banderas"
            category="Merchandising"
            description="Telas sublimadas full color de alta resistencia para exterior e interior."
            href="/productos/merchandising/banderas"
          />
          <ProductCard 
            title="Banners y Roll Ups"
            category="Gráfica"
            description="Lona frontlit impresa en alta definición. Ideal para eventos y puntos de venta."
            href="/productos/grafica/banners"
          />
        </div>
        <div className="mt-12 text-center">
          <Button href="/productos">Ver todo el catálogo</Button>
        </div>
      </section>

      {/* SOLUCIONES PARA TU PROYECTO */}
      <section className="mb-32">
        <SectionDivider text="PERFILES" metadata="SOLUCIONES PARA TU PROYECTO" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SolutionCard 
            title="Clubes y Equipos"
            items={['Indumentaria deportiva', 'Banderas y estandartes', 'Bolsos botineros', 'Merchandising para hinchas']}
            href="/soluciones/clubes-y-equipos"
          />
          <SolutionCard 
            title="Empresas"
            items={['Indumentaria corporativa', 'Regalos empresariales', 'Gráfica para oficinas', 'Kits de bienvenida']}
            href="/soluciones/empresas"
          />
          <SolutionCard 
            title="Comercios"
            items={['Ploteo de vidrieras', 'Marquesinas y cartelería', 'Decoración interior', 'Uniformes para staff']}
            href="/soluciones/comercios"
          />
        </div>
      </section>

      {/* TRABAJOS REALIZADOS */}
      <section className="mb-32">
        <SectionDivider text="ARCHIVO DE PRODUCCIÓN" metadata="TRABAJOS REALIZADOS" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-[4/3] border border-divider group cursor-pointer overflow-hidden bg-striped">
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-divider p-4 flex justify-between items-center text-xs font-mono uppercase tracking-widest">
              <span className="font-bold text-foreground">Camiseta Sublimada</span>
              <span className="text-gray-500">Club Atlético Norte</span>
            </div>
          </div>
          <div className="relative aspect-[4/3] border border-divider group cursor-pointer overflow-hidden bg-striped">
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-divider p-4 flex justify-between items-center text-xs font-mono uppercase tracking-widest">
              <span className="font-bold text-foreground">Campaña Vía Pública</span>
              <span className="text-gray-500">Distrito Textil</span>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button href="/trabajos-realizados">Ver portafolio completo</Button>
        </div>
      </section>

      {/* PROCESO */}
      <section className="mb-32 border-t border-divider pt-24">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter uppercase mb-16 max-w-2xl">
          De la idea a la calle en 4 pasos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          {[
            { step: '01', title: 'Briefing', desc: 'Nos contás qué necesitás. Cantidades, materiales y fecha.' },
            { step: '02', title: 'Arte y Prueba', desc: 'Preparamos el arte y definimos los detalles técnicos.' },
            { step: '03', title: 'Producción', desc: 'Imprimimos, sublimamos o confeccionamos en nuestro taller.' },
            { step: '04', title: 'Entrega', desc: 'Empaque, control de calidad y despacho o instalación.' }
          ].map((s) => (
            <div key={s.step} className="border-t border-brand pt-6">
              <span className="text-brand font-mono font-bold mb-4 block">{s.step} / 04</span>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-8 border border-divider text-center">
          <p className="text-lg md:text-xl font-bold uppercase tracking-tight mb-6">
            Producción propia. Sin intermediarios.
          </p>
          <Button href="/contacto" variant="solid">Solicitar Presupuesto</Button>
        </div>
      </section>
      
    </div>
  );
}
