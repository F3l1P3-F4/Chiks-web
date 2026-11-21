import type { Metadata } from 'next';
import { catalogEntries, catalogEntryHref } from '@/data/catalogEntries';
import { indumentariaGroups, indumentariaGroupHref } from '@/data/indumentariaGroups';
import { solutionProfiles } from '@/data/solutionProfiles';
import { absoluteUrl } from './siteUrl';

export interface PageSeo { path: string; title: string; description: string }

const staticPages: PageSeo[] = [
  { path: '/', title: 'Las Chikas Design | Indumentaria, gráfica y merchandising', description: 'Indumentaria, gráfica y merchandising para clubes, empresas, comercios, eventos y obras. Conocé el catálogo y los trabajos de Las Chikas Design.' },
  { path: '/productos', title: 'Catálogo de productos', description: 'Explorá los 23 productos y servicios del catálogo de Las Chikas Design, organizados en Indumentaria, Merchandising y Gráfica.' },
  { path: '/productos/indumentaria', title: 'Indumentaria personalizada', description: 'Remeras personalizadas, camperas y conjuntos deportivos. Explorá las líneas Egresados, Deportiva, Empresarial, Bandas y Personalizada.' },
  { path: '/productos/merchandising', title: 'Merchandising y artículos personalizados', description: 'Gorras, tazas, bolsos y otros artículos personalizados. Consultá las fichas de merchandising general y artículos para clubes.' },
  { path: '/productos/grafica', title: 'Gráfica e impresión ecosolvente', description: 'Lonas, banners, vinilos y soportes de impresión ecosolvente. Conocé también las propuestas de cartelería, vidrieras, ploteo vehicular y stands.' },
  { path: '/soluciones', title: 'Soluciones por perfil', description: 'Explorá las soluciones de Las Chikas Design para clubes y equipos, empresas, comercios, eventos y obras.' },
  { path: '/trabajos-realizados', title: 'Trabajos realizados', description: 'Galería de trabajos de indumentaria, gráfica y merchandising. Fotografías de remeras, vidrieras, stands, ploteo vehicular y artículos personalizados.' },
  { path: '/nosotros', title: 'Nosotros', description: 'Conocé los servicios de indumentaria, gráfica y merchandising de Las Chikas Design y las etapas de consulta, diseño y producción.' },
  { path: '/faq', title: 'Preguntas frecuentes', description: 'Información para preparar una consulta sobre personalización, archivos de diseño, presupuestos, producción y entrega. Condiciones pendientes de confirmar.' },
  { path: '/contacto', title: 'Contacto', description: 'Prepará la información de tu proyecto para consultar a Las Chikas Design. Los canales de contacto todavía están pendientes de confirmación.' },
];

export const seoPages: PageSeo[] = [
  ...staticPages,
  ...Object.entries(catalogEntries).map(([slug, product]) => ({
    path: catalogEntryHref(slug as keyof typeof catalogEntries),
    title: product.title + (slug === 'banderas' ? ' | Artículos generales' : slug === 'banderas-deportivas' ? ' | Artículos para clubes' : ' | ' + product.category),
    description: `${product.title}. ${product.applications ?? product.description}`,
  })),
  ...Object.entries(indumentariaGroups).map(([slug, group]) => ({
    path: indumentariaGroupHref(slug as keyof typeof indumentariaGroups),
    title: `${group.title} | Indumentaria`,
    description: `Línea ${group.title.toLowerCase()} de Las Chikas Design. ${group.products.length ? 'Explorá los productos asociados a esta línea de indumentaria.' : 'Conocé la presentación de esta línea. Sus productos específicos están pendientes de confirmación.'}`,
  })),
  ...Object.entries(solutionProfiles).map(([slug, profile]) => ({
    path: '/soluciones/' + slug,
    title: 'Soluciones para ' + profile.title.toLowerCase(),
    description: `Soluciones para ${profile.title.toLowerCase()} de Las Chikas Design. Conocé sus servicios y los accesos al catálogo relacionados con este perfil.`,
  })),
];

export function pageMetadata(path: string): Metadata {
  const page = seoPages.find((entry) => entry.path === path);
  if (!page) throw new Error(`Falta la configuración SEO de ${path}`);
  const title = path === '/' ? page.title : page.title + ' | Las Chikas Design';
  return {
    title,
    description: page.description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: 'website', locale: 'es_AR', siteName: 'Las Chikas Design',
      title, description: page.description, url: absoluteUrl(path),
      images: [{ url: absoluteUrl('/images/optimizadas/logo.webp'), width: 512, height: 512, alt: 'Las Chikas Design' }],
    },
  };
}
