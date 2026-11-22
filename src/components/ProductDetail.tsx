import React from 'react';
import Breadcrumb from './Breadcrumb';
import SectionDivider from './SectionDivider';
import ProductCard from './ProductCard';
import ProductGallery from './ProductGallery';
import ProductSelection from './ProductSelection';
import type { CatalogPhoto } from '@/data/productImages';
import styles from './ProductDetail.module.css';

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

interface ProductDetailProps {
  product: ProductInfo;
  path: string;
  renderWorkspace?: (gallery: React.ReactNode, commercialInfo: React.ReactNode) => React.ReactNode;
}

export default function ProductDetail({ product, path, renderWorkspace }: ProductDetailProps) {
  const specifications = [
    { title: 'Especificaciones', values: product.features },
    { title: 'Materiales', values: product.materials },
    { title: 'Talles / Tamaños', values: product.sizes },
    { title: 'Modelos y variantes', values: product.variants },
  ];
  const knownSpecifications = specifications.filter(({ values }) => values?.length);
  const photos = product.photo ? [product.photo, ...(product.additionalPhotos ?? [])] : [];
  const description = product.description?.trim();
  const faqs = product.faqs ?? [];
  const pendingFields = specifications.filter(({ values }) => !values?.length).map(({ title }) => title);
  if (!product.customization) pendingFields.push('Opciones de personalización');
  if (!product.minQuantity) pendingFields.push('Cantidad mínima de pedido y aplicabilidad');


  const gallery = <ProductGallery key={product.title} photos={photos} />;
  const commercialInfo = (
        <div className={`${styles.info} flex flex-col min-w-0`}>
          <h1 className={`${styles.title} font-extrabold uppercase tracking-tighter mb-6`}>
            {product.title}
          </h1>
          
          <p className="mb-8 text-xl font-bold text-brand">Precio: Consultar</p>

          <div className="mb-8">
            <h2 className="text-xl mb-3">Descripción general</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{description || 'Descripción pendiente de validación comercial.'}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl mb-3">Usos y aplicaciones</h2>
            <p className="text-gray-700 leading-relaxed">{product.applications ?? pending}</p>
          </div>

          {knownSpecifications.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {knownSpecifications.map(({ title, values }) => (
              <div key={title}>
                <h2 className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-4 border-b border-divider pb-2">{title}</h2>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    {values?.map((value) => <li key={value}>{value}</li>)}
                  </ul>
              </div>
            ))}
          </div>}

          <div className="internal-surface p-6 border border-divider mb-12 text-sm text-gray-700 space-y-2">
            {product.customization && <>
              <h2 className="text-base mb-2">Opciones de personalización</h2>
              <p>{product.customization}</p>
            </>}
            {product.minQuantity && <p><strong>Cantidad mínima de pedido</strong> {product.minQuantity}</p>}
            {pendingFields.length > 0 && <>
              <h2 className="text-base mb-2">Datos pendientes de confirmación</h2>
              <ul className="list-disc pl-5 space-y-1">
                {pendingFields.map((field) => <li key={field}>{field}</li>)}
              </ul>
            </>}
          </div>

          <ProductSelection product={{ id: path.split('/').pop()!, name: product.title, path }} showConsultation />
        </div>
  );

  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb currentPath={path} wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: product.categorySlug === 'grafica' ? 'Gráfica' : product.category, href: `/productos/${product.categorySlug}` },
        ...(product.subcategory ? [product.subcategory] : []),
        { label: product.title }
      ]} />

      {renderWorkspace ? renderWorkspace(gallery, commercialInfo) : <div className="grid grid-cols-1 gap-12 mb-24 lg:grid-cols-2 lg:gap-24">
        {gallery}
        {commercialInfo}
      </div>}

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
          {faqs.length === 0 && <p className="text-gray-700">Preguntas específicas sobre {product.title.toLocaleLowerCase('es')} pendientes de validación comercial.</p>}
          {faqs.some(({ answer }) => !answer) && <p className="mb-6 text-gray-700">Respuestas pendientes de validación comercial.</p>}
          {faqs.map(({ question, answer }) => (
            <div key={question} className="mb-8 border-b border-divider pb-6">
              <h3 className="text-lg font-bold uppercase tracking-tight mb-2">{question}</h3>
              {answer && <p className="text-gray-700">{answer}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
