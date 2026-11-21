import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ConsultationReview from '@/components/ConsultationReview';
import { catalogEntries, catalogProductSlugs } from '@/data/catalogEntries';
import type { ProductInfo } from '@/components/ProductDetail';
import { absoluteUrl } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: 'Mi consulta | Las Chikas Design',
  description: 'Revisá los productos seleccionados para tu consulta.',
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl('/mi-consulta') },
  openGraph: {
    title: 'Mi consulta | Las Chikas Design',
    description: 'Revisá los productos seleccionados para tu consulta.',
    url: absoluteUrl('/mi-consulta'),
  },
};

export default function ConsultationPage() {
  const photos = Object.fromEntries(catalogProductSlugs.map((id) => [id, (catalogEntries[id] as ProductInfo).photo]));

  return (
    <div className="internal-page container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb currentPath="/mi-consulta" wrap items={[{ label: 'Mi consulta' }]} />
      <h1 className="mb-8">Mi consulta</h1>
      <ConsultationReview photos={photos} />
    </div>
  );
}
