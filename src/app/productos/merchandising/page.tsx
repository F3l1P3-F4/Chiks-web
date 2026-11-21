import { pageMetadata } from '@/lib/seo';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';
import { catalogEntries, catalogEntryHref } from '@/data/catalogEntries';
import Button from '@/components/Button';
import CatalogIntro from '@/components/CatalogIntro';


export const metadata = pageMetadata('/productos/merchandising');

export default function MerchandisingPage() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb currentPath="/productos/merchandising" wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: 'Merchandising' }
      ]} />
      
      <CatalogIntro title="Merchandising" context="MERCHANDISING INTEGRAL" metadata="ARTÍCULOS Y ACCESORIOS PERSONALIZADOS">
          Desarrollo y producción de artículos promocionales y accesorios personalizados para empresas, eventos, marcas y entidades deportivas.
      </CatalogIntro>

      <p className="text-sm text-gray-600 mb-8">Para preparar un presupuesto, abrí una ficha y agregá el producto a Mi consulta con la cantidad y las observaciones que necesites.</p>
      {/* 1. ARTÍCULOS GENERALES */}
      <section id="articulos-generales" className="mb-24">
        <SectionDivider text="ARTÍCULOS GENERALES" metadata="PROMOCIONALES, EMPRESAS Y EVENTOS" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard {...catalogEntries['gorras']} href={catalogEntryHref('gorras')} />
          <ProductCard {...catalogEntries['tazas']} href={catalogEntryHref('tazas')} />
          <ProductCard {...catalogEntries['buzos-y-hoodies']} href={catalogEntryHref('buzos-y-hoodies')} />
          <ProductCard {...catalogEntries['llaveros']} href={catalogEntryHref('llaveros')} />
          <ProductCard {...catalogEntries['neceseres']} href={catalogEntryHref('neceseres')} />
          <ProductCard {...catalogEntries['banderas']} href={catalogEntryHref('banderas')} />
          <ProductCard {...catalogEntries['regalos-empresariales']} href={catalogEntryHref('regalos-empresariales')} />
        </div>
      </section>

      {/* 2. ARTÍCULOS PARA CLUBES */}
      <section id="articulos-clubes" className="mb-24">
        <SectionDivider text="ARTÍCULOS PARA CLUBES" metadata="LÍNEA DEPORTIVA E INSTITUCIONAL" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard {...catalogEntries['botineros']} href={catalogEntryHref('botineros')} />
          <ProductCard {...catalogEntries['mochilas']} href={catalogEntryHref('mochilas')} />
          <ProductCard {...catalogEntries['toallones']} href={catalogEntryHref('toallones')} />
          <ProductCard {...catalogEntries['banderas-deportivas']} href={catalogEntryHref('banderas-deportivas')} />
        </div>
      </section>

      {/* ASESORAMIENTO Y PRESUPUESTOS */}
      <section className="border-t border-divider pt-16 mb-16">
        <div className="internal-surface p-8 md:p-12 border border-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-3">
              ¿Buscás merchandising para tu marca o club?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Producimos accesorios y artículos personalizados en volumen con entregas coordinadas y asesoramiento directo.
            </p>
          </div>
          <Button href="/contacto" variant="solid" className="w-full sm:w-auto min-w-0 max-w-full text-center">
            Consulta general
          </Button>
        </div>
      </section>

    </div>
  );
}
