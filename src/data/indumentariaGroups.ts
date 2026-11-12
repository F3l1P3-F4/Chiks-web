import { catalogEntries, catalogEntryHref } from './catalogEntries';
import { catalogPhotos } from './productImages';

const remeras = {
  title: 'Remeras Personalizadas',
  category: 'Indumentaria',
  description: 'Remeras personalizadas con tu logo o diseño para uniformes, egresados y eventos.',
  photo: catalogPhotos.remeras,
  href: '/productos/indumentaria/remeras-personalizadas',
};

export const indumentariaGroups = {
  egresados: { ...catalogEntries.egresados, products: [remeras] },
  deportiva: {
    ...catalogEntries.deportiva,
    products: [{ ...catalogEntries['conjuntos-deportivos'], href: catalogEntryHref('conjuntos-deportivos') }],
  },
  empresarial: { ...catalogEntries.empresarial, products: [remeras] },
  bandas: { ...catalogEntries.bandas, products: [] },
  personalizada: {
    title: 'Personalizada',
    category: 'Indumentaria',
    description: 'Prendas personalizadas a medida para marcas independientes, promociones o diseños propios con variedad de técnicas de estampado.',
    photo: catalogPhotos.remeras,
    products: [remeras, { ...catalogEntries.camperas, href: catalogEntryHref('camperas') }],
  },
};

export type IndumentariaGroupSlug = keyof typeof indumentariaGroups;

export function indumentariaGroupHref(slug: IndumentariaGroupSlug) {
  return `/productos/ficha/${slug}`;
}
