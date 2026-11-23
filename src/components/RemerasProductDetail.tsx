import Breadcrumb from './Breadcrumb';
import ProductCard from './ProductCard';
import ProductGallery from './ProductGallery';
import GuidedProductSelection from './guided/GuidedProductSelection';
import RemerasGuidedWorkspace from './RemerasGuidedWorkspace';
import type { ProductInfo } from './ProductDetail';
import styles from './RemerasProductDetail.module.css';

// Composición guiada compartida exclusivamente por Remeras personalizadas y Lonas.
export default async function RemerasProductDetail({ product, path }: { product: ProductInfo; path: string }) {
  const consultationProduct = { id: path.split('/').pop()!, name: product.title, path };
  const definitive = consultationProduct.id === 'remeras-personalizadas';
  const photos = product.photo ? [product.photo, ...(product.additionalPhotos ?? [])] : [];
  const gallery = <div className={styles.visualColumn}>
    <div className={styles.gallery}><ProductGallery photos={photos} /></div>
    {!definitive && <>
    <p className={styles.photoCaption}>Fotografías del producto. Las imágenes no cambian según las observaciones.</p>
    <details className={styles.productFacts}>
      <summary>Información del producto</summary>
      {product.applications && <div><h2>Usos y aplicaciones</h2><p>{product.applications}</p></div>}
      {product.customization && <div><h2>Personalización</h2><p>{product.customization}</p></div>}
      {consultationProduct.id === 'lonas' && <>
        {([{ label: 'Especificaciones', values: product.features }, { label: 'Materiales', values: product.materials }, { label: 'Tamaños', values: product.sizes }, { label: 'Modelos y variantes', values: product.variants }]).filter(({ values }) => values?.length).map(({ label, values }) => <div key={label}><h2>{label}</h2><ul className="list-disc pl-5">{values?.map((value) => <li key={value}>{value}</li>)}</ul></div>)}
        {product.minQuantity && <p><strong>Cantidad mínima de pedido</strong> {product.minQuantity}</p>}
      </>}
      <p>Las opciones y condiciones comerciales pendientes se confirman con el equipo. Podés indicar lo que necesitás en las observaciones y pedir asesoramiento.</p>
    </details>
    </>}
  </div>;
  const selection = <GuidedProductSelection product={consultationProduct} />;
  let workspace = definitive ? <RemerasGuidedWorkspace gallery={gallery} product={consultationProduct} /> : <div className={styles.workspace}>{gallery}{selection}</div>;
  if (!definitive && process.env.NODE_ENV === 'development') {
    const { default: DevelopmentPreview } = consultationProduct.id === 'lonas'
      ? await import('./LonasDevelopmentPreview') : await import('./RemerasDevelopmentPreview');
    workspace = <DevelopmentPreview gallery={gallery} commercialSelection={selection} product={consultationProduct} />;
  }

  return (
    <div className={`internal-page ${styles.page}`}>
      <Breadcrumb currentPath={path} wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: product.categorySlug === 'grafica' ? 'Gráfica' : product.category, href: `/productos/${product.categorySlug}` },
        ...(product.subcategory ? [product.subcategory] : []),
        { label: product.title },
      ]} />

      <header className={styles.heading}>
        <h1 className={styles.title}>{product.title}</h1>
        <p>{product.description}</p>
      </header>

      {workspace}

      {!!product.faqs?.length && <section className={styles.followUp} aria-labelledby="dudas-remeras">
        <h2 id="dudas-remeras">Dudas sobre {product.title.toLocaleLowerCase('es')}</h2>
        <p className={styles.sectionHelp}>Las respuestas específicas todavía necesitan confirmación. Podés incluir tu pregunta en las observaciones.</p>
        <div className={styles.faqs}>
          {product.faqs.map(({ question, answer }) => <details key={question}>
            <summary>{question}</summary>
            <p>{answer || 'Respuesta pendiente de confirmación con el equipo.'}</p>
          </details>)}
        </div>
      </section>}

      {!!product.relatedProducts?.length && <section className={styles.followUp} aria-labelledby="relacionados-remeras">
        <h2 id="relacionados-remeras">También te puede interesar</h2>
        <div className={styles.related}>
          {product.relatedProducts.map((related) => <ProductCard key={related.href} {...related} />)}
        </div>
      </section>}
    </div>
  );
}
