import { pageMetadata } from '@/lib/seo';
import Breadcrumb from '@/components/Breadcrumb';
import SectionDivider from '@/components/SectionDivider';
import ProductCard from '@/components/ProductCard';
import { catalogEntries, catalogEntryHref, catalogProductSlugs } from '@/data/catalogEntries';
import { catalogFamilies, catalogHighlights } from '@/data/catalogNavigation';
import Link from 'next/link';

export const metadata = pageMetadata('/productos');

export default function ProductosPage() {
  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-8 md:py-12">
      <Breadcrumb currentPath="/productos" wrap items={[{ label: 'Productos' }]} />
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-6">Catálogo</h1>
      <p className="text-xl text-gray-600 max-w-3xl mb-4">
        Explorá nuestras líneas de indumentaria, merchandising y gráfica de gran formato. Producción 100% propia.
      </p>
      <p className="text-sm text-gray-600 mb-4">Para preparar un presupuesto, abrí una ficha, indicá la cantidad y agregá el producto a Mi consulta. Allí podrás completar tus datos y revisar el resumen antes de compartirlo.</p>
      <nav aria-label="Categorías del catálogo" className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-sm font-bold">
        {catalogFamilies.map(({ slug, title }) => (
          <Link key={slug} href={`/productos/${slug}`} className="py-2 underline underline-offset-4 hover:text-brand">{title}</Link>
        ))}
        <a href="#todos-los-productos" className="py-2 underline underline-offset-4 hover:text-brand">Ver todos los productos</a>
      </nav>

      <section aria-labelledby="destacados-title">
        <SectionDivider id="destacados-title" text="Productos destacados" />
        {catalogFamilies.map(({ slug, title }) => (
          <section key={slug} id={slug} aria-label={`Destacados de ${title}`} className="mb-16">
            <h3 className="text-xl mb-4">{title}</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {catalogHighlights[slug].map(({ slug: productSlug, ...display }) => (
                <ProductCard heading="h4" key={productSlug} {...catalogEntries[productSlug]} {...display} href={catalogEntryHref(productSlug)} />
              ))}
            </div>
          </section>
        ))}
      </section>
      <section id="todos-los-productos" aria-labelledby="todos-title" tabIndex={-1} className="mb-16 scroll-mt-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
        <SectionDivider id="todos-title" text="Todos los productos" />
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {catalogFamilies.map(({ slug, title }) => (
            <div key={slug} className="internal-surface border border-divider p-5 sm:p-6">
              <h3 className="text-xl mb-4">
                <Link href={`/productos/${slug}`} className="hover:text-brand">{title}</Link>
              </h3>
              <ul className="space-y-1">
                {catalogProductSlugs.filter((key) => catalogEntries[key].categorySlug === slug).map((key) => (
                  <li key={key}>
                    <Link href={catalogEntryHref(key)} className="block py-2 text-sm font-semibold underline underline-offset-4 hover:text-brand">
                      {catalogEntries[key].title}
                      {key === 'banderas' && <span className="font-normal"> · Artículos generales</span>}
                      {key === 'banderas-deportivas' && <span className="font-normal"> · Artículos para clubes</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
