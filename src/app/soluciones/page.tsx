import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import SolutionCard from '@/components/SolutionCard';
import { solutionProfiles } from '@/data/solutionProfiles';

export default function SolucionesPage() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb items={[{ label: 'Soluciones' }]} />
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8">
        Soluciones por Perfil
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mb-16">
        No importa el tamaño de tu proyecto, tenemos la estructura para resolverlo de principio a fin.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
        {Object.entries(solutionProfiles).map(([slug, profile]) => (
          <SolutionCard
            key={slug}
            title={profile.title}
            items={profile.items}
            href={`/soluciones/${slug}`}
          />
        ))}
      </div>
    </div>
  );
}
