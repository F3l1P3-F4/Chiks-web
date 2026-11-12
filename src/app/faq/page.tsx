import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { faqGroups } from '@/data/faqs';

export default function Page() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb wrap items={[{ label: 'Preguntas frecuentes' }]} />
      <div className="max-w-4xl mb-12">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8 break-words">Preguntas frecuentes</h1>
        <p className="text-xl text-gray-600 leading-relaxed">Información para preparar tu consulta y conocer qué condiciones necesitamos confirmar para cada trabajo.</p>
      </div>
      <div className="max-w-4xl space-y-12">
        {faqGroups.map((group) => (
          <section key={group.title}>
            <h2 className="text-2xl mb-6">{group.title}</h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <details key={item.question} className="internal-surface border border-divider px-5 py-4">
                  <summary className="cursor-pointer py-2 pr-2 font-bold text-lg leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">{item.question}</summary>
                  <div className="pt-3 pb-2">
                    {'pending' in item && item.pending && <p className="text-sm font-bold mb-3">Pendiente de confirmación</p>}
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
      <nav aria-label="Más información" className="mt-12 flex flex-wrap gap-6 text-sm font-bold">
        <Link href="/productos" className="py-2 underline underline-offset-4 hover:text-brand">Explorar el catálogo</Link>
        <Link href="/contacto" className="py-2 underline underline-offset-4 hover:text-brand">Ver opciones de contacto</Link>
      </nav>
    </div>
  );
}
