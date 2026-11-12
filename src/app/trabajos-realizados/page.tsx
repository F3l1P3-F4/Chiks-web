import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import WorkGallery from '@/components/WorkGallery';
import Button from '@/components/Button';

export default function Page() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb wrap items={[{ label: 'Trabajos realizados' }]} />
      <h1 className="mb-8">Trabajos realizados</h1>
      <p className="max-w-3xl text-xl text-gray-600 mb-8">Una selección de trabajos de indumentaria, gráfica y merchandising.</p>
      <WorkGallery showTitle={false} />
      <div className="mt-10"><Button href="/contacto" variant="solid">Consultar en Contacto</Button></div>
    </div>
  );
}
