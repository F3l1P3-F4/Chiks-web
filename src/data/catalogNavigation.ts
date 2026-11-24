import { catalogEntries, catalogEntryHref, type CatalogProductSlug } from './catalogEntries';

export const catalogFamilies = [
  { slug: 'indumentaria', title: 'Indumentaria' },
  { slug: 'merchandising', title: 'Merchandising' },
  { slug: 'grafica', title: 'Gráfica' },
] as const;

// Conserva los textos de las nueve tarjetas destacadas que ya tenía el catálogo.
export const catalogHighlights = {
  indumentaria: [
    { slug: 'remeras-personalizadas', description: 'Remeras personalizadas con tu logo o diseño para uniformes, egresados y eventos.' },
    { slug: 'camperas' },
    { slug: 'conjuntos-deportivos' },
  ],
  merchandising: [
    { slug: 'botineros', title: 'Bolsos Botineros', description: 'Bolsos resistentes personalizados para clubes y delegaciones.' },
    { slug: 'banderas' },
    { slug: 'regalos-empresariales' },
  ],
  grafica: [
    { slug: 'banners', title: 'Banners y Roll Ups', category: 'Gráfica', description: 'Lona frontlit impresa en alta definición. Ideal para eventos y puntos de venta.' },
    { slug: 'vidrieras', title: 'Ploteo de Vidrieras', category: 'Gráfica', description: 'Vinilos de corte e impresos para frentes comerciales y señalética.' },
    { slug: 'marquesinas', category: 'Gráfica', description: 'Cartelería exterior luminosa, frentes y estructuras a medida.' },
  ],
} satisfies Record<string, { slug: CatalogProductSlug; title?: string; category?: string; description?: string }[]>;

// Relaciones explícitas basadas en los usos y artículos descritos en el catálogo.
// Sin evidencia suficiente, el producto queda sin recomendaciones.
const relatedProductSlugs: Partial<Record<CatalogProductSlug, CatalogProductSlug[]>> = {
  'remeras-personalizadas': ['camperas', 'conjuntos-deportivos', 'botineros'],
  camperas: ['remeras-personalizadas'],
  'conjuntos-deportivos': ['botineros', 'mochilas', 'banderas-deportivas'],
  botineros: ['conjuntos-deportivos', 'mochilas', 'toallones'],
  mochilas: ['botineros', 'toallones'],
  toallones: ['botineros', 'mochilas'],
  'banderas-deportivas': ['conjuntos-deportivos', 'botineros'],
  tazas: ['regalos-empresariales'],
  'regalos-empresariales': ['tazas'],
  lonas: ['banners'],
  banners: ['lonas', 'stands-y-carteleria'],
  vinilos: ['vidrieras'],
  vidrieras: ['vinilos', 'microperforados'],
  microperforados: ['vidrieras'],
  backlite: ['marquesinas'],
  marquesinas: ['backlite', 'vidrieras'],
  'stands-y-carteleria': ['banners'],
};

export function getRelatedProducts(slug: CatalogProductSlug) {
  return (relatedProductSlugs[slug] ?? []).map((related) => ({
    ...catalogEntries[related],
    ...(slug === 'remeras-personalizadas' && {
      description: remerasRelatedDescriptions[related] ?? catalogEntries[related].description,
    }),
    href: catalogEntryHref(related),
  }));
}

// Textos de las tarjetas relacionadas que ya existían en la ficha de Remeras.
const remerasRelatedDescriptions: Partial<Record<CatalogProductSlug, string>> = {
  camperas: 'Camperas de abrigo y rompevientos con logo bordado.',
  'conjuntos-deportivos': 'Equipos completos de fútbol, básquet o vóley.',
  botineros: 'Complemento perfecto para tu equipo deportivo.',
};
