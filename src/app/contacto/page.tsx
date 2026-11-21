import { pageMetadata } from '@/lib/seo';
﻿import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';

export const metadata = pageMetadata('/contacto');

export default function Page() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb currentPath="/contacto" wrap items={[{ label: 'Contacto' }]} />
      <div className="max-w-4xl mb-12">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-8 break-words">Contacto</h1>
        <p className="text-xl text-gray-600 leading-relaxed">Consultas generales y presupuestos de productos: conocé cómo preparar cada consulta y el estado de los canales de contacto.</p>
      </div>

      <section aria-labelledby="canales-title" className="mb-12">
        <h2 id="canales-title" className="text-2xl md:text-3xl mb-6">Consultas generales</h2>
        <p className="max-w-3xl text-gray-600 leading-relaxed mb-8">Para hacer una pregunta o consultar por un proyecto que no encuentres en el catálogo, no necesitás seleccionar productos. Prepará tu pregunta y las referencias que quieras compartir. Los datos de contacto se publicarán una vez confirmados; actualmente no hay un canal directo habilitado desde esta página.</p>
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
        <h2 id="consulta-title" className="text-2xl md:text-3xl mb-6">Presupuestos de productos</h2>
        <p className="text-gray-600 leading-relaxed mb-5">Podés preparar una solicitud con varios productos del catálogo:</p>
        <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
          <li>Abrí cada ficha, indicá la cantidad y agregá observaciones si las necesitás. Pulsá «Agregar a mi consulta» para seguir eligiendo productos.</li>
          <li>Entrá a Mi consulta para revisar o modificar tu selección y completar Tus datos.</li>
          <li>Pulsá «Revisar solicitud» y copiá el resumen completo. Prepararlo o copiarlo no envía la consulta.</li>
          <li>Cuando se configure el número comercial, podrás abrir WhatsApp, revisar el mensaje y presionar Enviar desde esa aplicación. Abrir el chat no confirma el envío ni la recepción.</li>
        </ul>
      </section>
      <nav aria-label="Información para tu consulta" className="flex flex-wrap gap-6 text-sm font-bold">
        <Link href="/productos" className="py-2 underline underline-offset-4 hover:text-brand">Elegir productos</Link>
        <Link href="/mi-consulta" className="py-2 underline underline-offset-4 hover:text-brand">Ver mi consulta</Link>
        <Link href="/faq" className="py-2 underline underline-offset-4 hover:text-brand">Leer preguntas frecuentes</Link>
      </nav>
    </div>
  );
}
