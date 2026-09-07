import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';

export default function Page() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb items={[{ label: 'soluciones/eventos' }]} />
      <h1 className="text-5xl font-extrabold tracking-tighter uppercase mb-8">Página: soluciones/eventos</h1>
    </div>
  );
}
