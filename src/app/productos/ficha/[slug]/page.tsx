import { pageMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import { catalogEntries } from '@/data/catalogEntries';
import { getRelatedProducts } from '@/data/catalogNavigation';
import IndumentariaGroup from '@/components/IndumentariaGroup';
import { indumentariaGroups, indumentariaGroupHref, type IndumentariaGroupSlug } from '@/data/indumentariaGroups';

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === 'remeras-personalizadas' || (!Object.hasOwn(catalogEntries, slug) && !Object.hasOwn(indumentariaGroups, slug))) notFound();
  return pageMetadata('/productos/ficha/' + slug);
}

export function generateStaticParams() {
  const productSlugs = Object.keys(catalogEntries).filter((slug) => slug !== 'remeras-personalizadas');
  return [...productSlugs, ...Object.keys(indumentariaGroups)].map((slug) => ({ slug }));
}

export default async function CatalogEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (Object.hasOwn(indumentariaGroups, slug)) return <IndumentariaGroup slug={slug as IndumentariaGroupSlug} />;
  if (slug === 'remeras-personalizadas' || !Object.hasOwn(catalogEntries, slug)) notFound();

  const product = catalogEntries[slug as keyof typeof catalogEntries];
  let subcategory;

  if (product.categorySlug === 'indumentaria') {
    const group = slug === 'conjuntos-deportivos' ? 'deportiva' : 'personalizada';
    subcategory = { label: indumentariaGroups[group].title, href: indumentariaGroupHref(group) };
  } else if (product.categorySlug === 'grafica') {
    const section = product.category === 'Impresión ecosolvente' ? 'impresion-ecosolvente' : 'carteleria-servicios';
    subcategory = { label: product.category, href: `/productos/grafica#${section}` };
  } else {
    const forClubs = ['botineros', 'mochilas', 'toallones', 'banderas-deportivas'].includes(slug);
    subcategory = forClubs
      ? { label: 'Artículos para clubes', href: '/productos/merchandising#articulos-clubes' }
      : { label: 'Artículos generales', href: '/productos/merchandising#articulos-generales' };
  }

  const relatedProducts = getRelatedProducts(slug as keyof typeof catalogEntries);

  if (slug === 'lonas') {
    const { default: GuidedProductDetail } = await import('@/components/RemerasProductDetail');
    return <GuidedProductDetail path={'/productos/ficha/' + slug} product={{ ...product, subcategory, relatedProducts }} />;
  }

  return <ProductDetail path={'/productos/ficha/' + slug} product={{ ...product, subcategory, relatedProducts }} />;
}
