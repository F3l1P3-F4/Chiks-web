import Breadcrumb from './Breadcrumb';
import Button from './Button';
import ProductCard from './ProductCard';
import SectionDivider from './SectionDivider';
import { indumentariaGroups, type IndumentariaGroupSlug } from '@/data/indumentariaGroups';

export default function IndumentariaGroup({ slug }: { slug: IndumentariaGroupSlug }) {
  const { title, description, products } = indumentariaGroups[slug];

  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb wrap items={[
        { label: 'Productos', href: '/productos' },
        { label: 'Indumentaria', href: '/productos/indumentaria' },
        { label: title },
      ]} />
      <h1 className="mb-8">{title}</h1>
      <p className="max-w-3xl text-xl text-gray-600 leading-relaxed mb-10">{description}</p>
      {products.length > 0 && (
        <section aria-labelledby="productos-linea" className="mb-12">
          <SectionDivider id="productos-linea" text="Productos de la línea" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => <ProductCard key={product.href} {...product} />)}
          </div>
        </section>
      )}
      <Button href="/contacto" variant="solid" className="max-w-full text-center">Consultar por esta línea</Button>
    </div>
  );
}
