import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb wrap items={[{ label: 'Contacto' }]} />
      <div className="max-w-4xl mb-12">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8 break-words">Contacto</h1>
        <p className="text-xl text-gray-600 leading-relaxed">Conocé el estado de nuestros canales de contacto y prepará la información de tu proyecto.</p>
      </div>

      <section aria-labelledby="canales-title" className="mb-12">
        <h2 id="canales-title" className="text-2xl md:text-3xl mb-6">Canales de contacto</h2>
        <p className="max-w-3xl text-gray-600 leading-relaxed mb-8">Los datos se publicarán una vez confirmados. Actualmente no hay un canal directo habilitado desde esta página.</p>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['Teléfono y WhatsApp', 'Correo electrónico', 'Ubicación y horarios', 'Redes sociales'].map((channel) => (
            <div key={channel} className="internal-surface border border-divider p-6 min-w-0">
              <dt className="font-bold text-lg mb-3">{channel}</dt>
              <dd className="text-gray-600 leading-relaxed">Pendiente de confirmación.</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="consulta-title" className="max-w-3xl border-t border-divider pt-8 mb-12">
        <h2 id="consulta-title" className="text-2xl md:text-3xl mb-6">Prepará tu consulta</h2>
        <p className="text-gray-600 leading-relaxed mb-5">Para describir lo que necesitás, podés reunir estos datos:</p>
        <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
          <li>Producto o servicio que te interesa.</li>
          <li>Cantidad aproximada y uso previsto.</li>
          <li>Idea de personalización, diseño o referencias disponibles.</li>
          <li>Fecha deseada para consultar su disponibilidad.</li>
        </ul>
      </section>
      <nav aria-label="Información para tu consulta" className="flex flex-wrap gap-6 text-sm font-bold">
        <Link href="/productos" className="py-2 underline underline-offset-4 hover:text-brand">Ver catálogo</Link>
        <Link href="/faq" className="py-2 underline underline-offset-4 hover:text-brand">Leer preguntas frecuentes</Link>
      </nav>
    </div>
  );
}
