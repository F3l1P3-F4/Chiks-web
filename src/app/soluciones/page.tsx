import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import SolutionCard from '@/components/SolutionCard';

export default function SolucionesPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb items={[{ label: 'Soluciones' }]} />
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8">
        Soluciones por Perfil
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mb-16">
        No importa el tamaño de tu proyecto, tenemos la estructura para resolverlo de principio a fin.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
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
    </div>
  );
}
