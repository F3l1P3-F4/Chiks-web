import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import Button from '@/components/Button';

export default function Page() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb wrap items={[{ label: 'Nosotros' }]} />
      <div className="max-w-4xl mb-16">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8 break-words">Nosotros</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Las Chikas Design reúne soluciones de indumentaria, gráfica y merchandising para hacer visible la identidad de cada proyecto.
        </p>
      </div>

      <section aria-labelledby="servicios-title" className="mb-16">
        <h2 id="servicios-title" className="text-2xl md:text-3xl mb-8">Qué hacemos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Indumentaria', text: 'Prendas personalizadas para clubes, equipos, empresas y proyectos independientes.', href: '/productos/indumentaria' },
            { title: 'Gráfica', text: 'Impresión, cartelería y ploteos para comercios, vehículos, eventos y obras.', href: '/productos/grafica' },
            { title: 'Merchandising', text: 'Artículos y accesorios personalizados, como gorras, tazas y banderas.', href: '/productos/merchandising' },
          ].map((service) => (
            <article key={service.href} className="internal-surface min-w-0 border border-divider p-6 flex flex-col">
              <h3 className="text-xl mb-4 break-words">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{service.text}</p>
              <Link href={service.href} className="mt-auto text-sm font-bold underline underline-offset-4 hover:text-brand">Ver {service.title}</Link>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="perfiles-title" className="max-w-3xl mb-16">
        <h2 id="perfiles-title" className="text-2xl md:text-3xl mb-6">Para cada proyecto</h2>
        <p className="text-gray-600 leading-relaxed">
          El sitio organiza nuestras soluciones para clubes y equipos, empresas, comercios, eventos y obras. En el catálogo podés conocer los productos y servicios de cada línea y consultar las opciones para tu idea.
        </p>
      </section>

      <section aria-labelledby="proceso-nosotros-title" className="border-t border-divider pt-8 mb-12">
        <h2 id="proceso-nosotros-title" className="text-2xl md:text-3xl mb-8">Cómo trabajamos</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '1. Consulta', text: 'Contanos tu idea.' },
            { title: '2. Diseño', text: 'Propuesta visual personalizada.' },
            { title: '3. Producción', text: 'Impresión con calidad profesional.' },
          ].map((step) => (
            <li key={step.title} className="border-t border-brand pt-4">
              <h3 className="text-xl mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button href="/productos" className="w-full sm:w-auto">Ver catálogo</Button>
        <Button href="/faq" className="w-full sm:w-auto">Preguntas frecuentes</Button>
      </div>
    </div>
  );
}
