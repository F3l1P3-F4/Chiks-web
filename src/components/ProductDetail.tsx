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
  const commercialInfo = <div className={`internal-surface ${styles.consultation}`} data-general-consultation>
    <ProductSelection product={{ id: path.split('/').pop()!, name: product.title, path }} heading="Prepará tu consulta" showConsultation />
  </div>;

  return (
    <div className={`internal-page container mx-auto px-4 lg:px-8 py-12 ${styles.page}`}>
      <Breadcrumb currentPath={path} wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: product.categorySlug === 'grafica' ? 'Gráfica' : product.category, href: `/productos/${product.categorySlug}` },
        ...(product.subcategory ? [product.subcategory] : []),
        { label: product.title }
      ]} />

      <header className={styles.heading}>
        <h1 className={styles.title}>{product.title}</h1>
        <p>{description || 'Descripción pendiente de validación comercial.'}</p>
        <p className={styles.price}>Precio: Consultar</p>
      </header>

      {renderWorkspace ? renderWorkspace(gallery, commercialInfo) : <div className={styles.workspace} data-general-product>
        <div className={styles.visualColumn}>
          <div className={styles.gallery}>{gallery}</div>
          {(product.applications || product.customization) && <section className={`internal-surface ${styles.knownInfo}`} aria-label="Información del producto">
            {product.applications && <div><h2>Usos y aplicaciones</h2><p>{product.applications}</p></div>}
            {product.customization && <div><h2>Opciones de personalización</h2><p>{product.customization}</p></div>}
          </section>}
        </div>
        {commercialInfo}
      </div>}

      <details className={`internal-surface ${styles.productFacts}`} data-product-facts>
        <summary>Características y datos por confirmar</summary>
        <div className={styles.specifications}>
          {knownSpecifications.map(({ title, values }) => <div key={title}>
            <h2>{title}</h2><ul className="list-disc pl-5 space-y-2">{values?.map(value=><li key={value}>{value}</li>)}</ul>
          </div>)}
          {!product.applications && <div><h2>Usos y aplicaciones</h2><p>{pending}</p></div>}
          {product.minQuantity && <div><h2>Cantidad mínima de pedido</h2><p>{product.minQuantity}</p></div>}
          {pendingFields.length>0 && <div><h2>Datos pendientes de confirmación</h2><ul className="list-disc pl-5 space-y-2">{pendingFields.map(field=><li key={field}>{field}</li>)}</ul></div>}
        </div>
      </details>

      {/* Relacionados */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className={styles.followUp}>
          <SectionDivider text="TE PUEDE INTERESAR" metadata="PRODUCTOS RELACIONADOS" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.relatedProducts.map((related) => (
              <ProductCard key={related.href} {...related} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ Específica */}
      <section className={styles.followUp}>
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
