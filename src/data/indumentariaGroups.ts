import { catalogEntries, catalogEntryHref } from './catalogEntries';
import { catalogPhotos } from './productImages';

const remeras = {
  ...catalogEntries['remeras-personalizadas'],
  description: 'Remeras personalizadas con tu logo o diseño para uniformes, egresados y eventos.',
  href: catalogEntryHref('remeras-personalizadas'),
};

export const indumentariaGroups = {
  egresados: {
    title: "Egresados",
    category: "Indumentaria",
    categorySlug: "indumentaria",
    description: "Buzos, camperas, remeras y chombas para egresados de todos los niveles. Diseños exclusivos con bordado y serigrafía.",
    products: [remeras],
  },
  deportiva: {
    title: "Deportiva",
    category: "Indumentaria",
    categorySlug: "indumentaria",
    description: "Camisetas, shorts y conjuntos técnicos para clubes y equipos. Confección en Dry Fit y telas de alto rendimiento con sublimación full color.",
    photo: catalogPhotos.deportiva,
    products: [{ ...catalogEntries['conjuntos-deportivos'], href: catalogEntryHref('conjuntos-deportivos') }],
  },
  empresarial: {
    title: "Empresarial",
    category: "Indumentaria",
    categorySlug: "indumentaria",
    description: "Uniformes de trabajo, chombas, remeras de staff y ropa de abrigo corporativa con identificación duradera de marca.",
    photo: catalogPhotos.empresarial,
    products: [remeras],
  },
  bandas: {
    title: "Bandas",
    category: "Indumentaria",
    categorySlug: "indumentaria",
    description: "Remeras, buzos y merchandising textil para bandas, músicos y eventos culturales. Estampados de alta resolución y fidelidad de color.",
    products: [],
  },
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
