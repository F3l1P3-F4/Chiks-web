import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';

export default function Page() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb items={[{ label: 'trabajos-realizados' }]} />
      <h1 className="text-5xl font-extrabold tracking-tighter uppercase mb-8">Página: trabajos-realizados</h1>
    </div>
  );
}
