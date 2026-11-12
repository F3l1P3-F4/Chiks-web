import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import { catalogEntries, catalogEntryHref } from '@/data/catalogEntries';
import IndumentariaGroup from '@/components/IndumentariaGroup';
import { indumentariaGroups, indumentariaGroupHref, type IndumentariaGroupSlug } from '@/data/indumentariaGroups';

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set([...Object.keys(catalogEntries), ...Object.keys(indumentariaGroups)])].map((slug) => ({ slug }));
}

export default async function CatalogEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (Object.hasOwn(indumentariaGroups, slug)) return <IndumentariaGroup slug={slug as IndumentariaGroupSlug} />;
  if (!Object.hasOwn(catalogEntries, slug)) notFound();

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

  const relatedProducts = (Object.keys(catalogEntries) as (keyof typeof catalogEntries)[])
    .filter((key) => key !== slug && !Object.hasOwn(indumentariaGroups, key))
    .filter((key) => catalogEntries[key].categorySlug === product.categorySlug)
    .sort((a, b) => Number(catalogEntries[b].category === product.category) - Number(catalogEntries[a].category === product.category))
    .slice(0, 3)
    .map((key) => ({ ...catalogEntries[key], href: catalogEntryHref(key) }));

  return <ProductDetail product={{ ...product, subcategory, relatedProducts }} />;
}
