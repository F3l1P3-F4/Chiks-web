import { pageMetadata } from '@/lib/seo';
import ProductDetail from '@/components/ProductDetail';
import { catalogEntries } from '@/data/catalogEntries';
import { getRelatedProducts } from '@/data/catalogNavigation';
import { indumentariaGroupHref } from '@/data/indumentariaGroups';

export const metadata = pageMetadata('/productos/indumentaria/remeras-personalizadas');

export default function RemerasPersonalizadasPage() {
  return <ProductDetail path="/productos/indumentaria/remeras-personalizadas" product={{
    ...catalogEntries['remeras-personalizadas'],
    subcategory: { label: 'Personalizada', href: indumentariaGroupHref('personalizada') },
    relatedProducts: getRelatedProducts('remeras-personalizadas'),
  }} />;
}
