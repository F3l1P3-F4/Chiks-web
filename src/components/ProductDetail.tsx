import React from 'react';
import Breadcrumb from './Breadcrumb';
import SectionDivider from './SectionDivider';
import ProductCard from './ProductCard';
import ProductGallery from './ProductGallery';
import ProductConsultation from './ProductConsultation';
import type { CatalogPhoto } from '@/data/productImages';

export interface ProductInfo {
  photo?: CatalogPhoto;
  additionalPhotos?: CatalogPhoto[];
  subcategory?: { label: string; href: string };
  title: string;
  category: string;
  categorySlug: string;
  description?: string;
  applications?: string;
  features?: string[];
  materials?: string[];
  variants?: string[];
  sizes?: string[];
  customization?: string;
  minQuantity?: string;
  faqs?: { question: string; answer?: string }[];
  relatedProducts?: { title: string; category: string; description: string; href: string; photo?: CatalogPhoto; ctaText?: string }[];
}

const pending = 'Pendiente de confirmación.';
const placeholderDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

interface ProductDetailProps {
  product: ProductInfo;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const specifications = [
    { title: 'Especificaciones', values: product.features },
    { title: 'Materiales', values: product.materials },
    { title: 'Talles / Tamaños', values: product.sizes },
    { title: 'Modelos y variantes', values: product.variants },
  ];
  const photos = product.photo ? [product.photo, ...(product.additionalPhotos ?? [])] : [];
  const description = product.description?.trim();
  const faqs = product.faqs ?? [
    { question: `¿Cómo solicito un presupuesto para ${product.title.toLocaleLowerCase('es')}?`, answer: 'Usá el botón «Solicitar presupuesto» para abrir la página de Contacto y enviar tu consulta por los canales indicados.' },
    { question: '¿Cuál es el plazo de producción para este producto?', answer: pending },
  ];

  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: product.categorySlug === 'grafica' ? 'Gráfica' : product.category, href: `/productos/${product.categorySlug}` },
        ...(product.subcategory ? [product.subcategory] : []),
        { label: product.title }
      ]} />

      <div className="grid grid-cols-1 gap-12 mb-24 lg:grid-cols-2 lg:gap-24">
        <ProductGallery key={product.title} photos={photos} />

        {/* Info Section */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tighter mb-6 leading-none break-words">
            {product.title}
          </h1>
          
          <p className="mb-8 text-xl font-bold text-brand">Precio: Consultar</p>

          <div className="mb-8">
            <h2 className="text-xl mb-3">Descripción general</h2>
            {!description && <p className="text-sm font-bold mb-2">Texto de muestra · pendiente de revisión</p>}
            <p className="text-lg text-gray-700 leading-relaxed">{description || placeholderDescription}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl mb-3">Usos y aplicaciones</h2>
            <p className="text-gray-700 leading-relaxed">{product.applications ?? pending}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {specifications.map(({ title, values }) => (
              <div key={title}>
                <h2 className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-4 border-b border-divider pb-2">{title}</h2>
                {values?.length ? (
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    {values.map((value) => <li key={value}>{value}</li>)}
                  </ul>
                ) : <p className="text-sm text-gray-700">{pending}</p>}
              </div>
            ))}
          </div>

          <div className="internal-surface p-6 border border-divider mb-12 text-sm text-gray-700 space-y-2">
            <h2 className="text-base mb-2">Opciones de personalización</h2>
            <p>{product.customization ?? pending}</p>
            <p><strong>Cantidad mínima de pedido:</strong> {product.minQuantity ?? pending}</p>
          </div>

          <ProductConsultation />
        </div>
      </div>

      {/* Relacionados */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="mb-32">
          <SectionDivider text="TE PUEDE INTERESAR" metadata="PRODUCTOS RELACIONADOS" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.relatedProducts.map((related) => (
              <ProductCard key={related.href} {...related} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ Específica */}
      <section className="mb-24">
        <SectionDivider text="DUDAS FRECUENTES" metadata="SOBRE ESTE PRODUCTO" />
        <div className="max-w-3xl">
          {faqs.map(({ question, answer }) => (
            <div key={question} className="mb-8 border-b border-divider pb-6">
              <h3 className="text-lg font-bold uppercase tracking-tight mb-2">{question}</h3>
              <p className="text-gray-700">{answer ?? pending}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
