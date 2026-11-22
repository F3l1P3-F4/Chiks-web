import Breadcrumb from './Breadcrumb';
import ProductCard from './ProductCard';
import ProductGallery from './ProductGallery';
import ProductSelection from './ProductSelection';
import type { ProductInfo } from './ProductDetail';
import styles from './RemerasProductDetail.module.css';

// Piloto F03.1: solo la ruta de Remeras utiliza esta composición.
export default async function RemerasProductDetail({ product, path }: { product: ProductInfo; path: string }) {
  const photos = product.photo ? [product.photo, ...(product.additionalPhotos ?? [])] : [];
  const gallery = <div className={styles.visualColumn}>
    <div className={styles.gallery}><ProductGallery photos={photos} /></div>
    <p className={styles.photoCaption}>Fotografías del producto. Las imágenes no cambian según las observaciones.</p>
    <details className={styles.productFacts}>
      <summary>Información del producto</summary>
      {product.applications && <div><h2>Usos y aplicaciones</h2><p>{product.applications}</p></div>}
      {product.customization && <div><h2>Personalización</h2><p>{product.customization}</p></div>}
      <p>Modelos, materiales, talles, colores y cantidades mínimas están pendientes de confirmación. Podés indicar lo que necesitás en las observaciones para consultarlo con el equipo.</p>
    </details>
  </div>;
  const selection = <ProductSelection
    product={{ id: path.split('/').pop()!, name: product.title, path }}
    heading="Prepará tu consulta"
    showConsultation
    presentation="remeras-pilot"
  />;
  let workspace = <div className={styles.workspace}>{gallery}{selection}</div>;
  if (process.env.NODE_ENV === 'development') {
    const { default: RemerasDevelopmentPreview } = await import('./RemerasDevelopmentPreview');
    workspace = <RemerasDevelopmentPreview gallery={gallery} commercialSelection={selection} productName={product.title} />;
  }

  return (
    <div className={`internal-page ${styles.page}`}>
      <Breadcrumb currentPath={path} wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: product.category, href: `/productos/${product.categorySlug}` },
        ...(product.subcategory ? [product.subcategory] : []),
        { label: product.title },
      ]} />

      <header className={styles.heading}>
        <h1 className={styles.title}>{product.title}</h1>
        <p>{product.description}</p>
      </header>

      {workspace}

      {!!product.faqs?.length && <section className={styles.followUp} aria-labelledby="dudas-remeras">
        <h2 id="dudas-remeras">Dudas sobre estas remeras</h2>
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
