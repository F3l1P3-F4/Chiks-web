import React from 'react';
import Button from '@/components/Button';
import SectionDivider from '@/components/SectionDivider';
import SolutionCard from '@/components/SolutionCard';

export default function Home() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      
      {/* HERO */}
      <section className="relative isolate mb-32 mt-12">
        <div aria-hidden="true" className="bg-depth pointer-events-none absolute inset-0 -z-10" />
        <SectionDivider text="GRÁFICA INTEGRAL" metadata="BUENOS AIRES, AR" />
        <div className="max-w-6xl">
          <h1 className="text-[12vw] sm:text-8xl md:text-9xl lg:text-[180px] font-extrabold tracking-tighter uppercase leading-[0.8] mb-12 text-foreground">
            Tintas<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px var(--color-brand)' }}>Que</span><br />
            Hablan
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

      {/* SOLUCIONES POR PERFIL */}
      <section className="mb-32">
        <SectionDivider text="SOLUCIONES POR PERFIL" metadata="CLUBES, EMPRESAS, COMERCIOS, EVENTOS Y OBRAS" />
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
          <SolutionCard 
            title="Eventos"
            items={['Banners y fly banners', 'Armado de stands', 'Acreditaciones y pulseras', 'Souvenirs']}
            href="/soluciones/eventos"
          />
          <SolutionCard 
            title="Obras"
            items={['Frentes de obra en lona', 'Cartelería de seguridad', 'Mallas microperforadas']}
            href="/soluciones/obras"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
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
      </section>
      
    </div>
  );
}
