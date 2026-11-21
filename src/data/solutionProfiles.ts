import { visualAssets } from './visualAssets';
import { catalogEntryHref } from './catalogEntries';
import { indumentariaGroupHref } from './indumentariaGroups';

export const PROFILE_PHOTOS = {
  clubes: { src: visualAssets.clubes, alt: 'Equipo con indumentaria deportiva personalizada', position: '50% 45%' },
  empresas: { src: visualAssets.uniformes, alt: 'Gorras e indumentaria corporativa personalizadas', position: '50% 20%' },
  comercios: { src: visualAssets.vidriera, alt: 'Vidriera de comercio con gráfica personalizada', position: '50% 30%' },
  eventos: { src: visualAssets.stand, alt: 'Stand y paneles gráficos para un evento', position: '50% 55%' },
  obras: { src: visualAssets.carteleria, alt: 'Carteles impresos para una empresa de obras', position: '50% 20%' },
};

// Cada vínculo corresponde a un servicio ya listado y una oferta existente.
// Los servicios ambiguos conservan su texto y el acceso general al catálogo.
export const solutionServiceLinks: Record<keyof typeof solutionProfiles, Partial<Record<string, string>>> = {
  'clubes-y-equipos': {
    'Indumentaria deportiva': indumentariaGroupHref('deportiva'),
    'Banderas y estandartes': catalogEntryHref('banderas-deportivas'),
    'Bolsos botineros': catalogEntryHref('botineros'),
    'Merchandising para hinchas': '/productos/merchandising#articulos-clubes',
  },
  empresas: {
    'Indumentaria corporativa': indumentariaGroupHref('empresarial'),
    'Regalos empresariales': catalogEntryHref('regalos-empresariales'),
  },
  comercios: {
    'Ploteo de vidrieras': catalogEntryHref('vidrieras'),
    'Marquesinas y cartelería': catalogEntryHref('marquesinas'),
    'Uniformes para staff': indumentariaGroupHref('empresarial'),
  },
  eventos: {
    'Armado de stands': catalogEntryHref('stands-y-carteleria'),
  },
  obras: {
    'Frentes de obra en lona': catalogEntryHref('lonas'),
  },
};

export const solutionProfiles = {
  "clubes-y-equipos": {
    title: "Clubes y Equipos",
    items: ['Indumentaria deportiva', 'Banderas y estandartes', 'Bolsos botineros', 'Merchandising para hinchas'],
    photo: PROFILE_PHOTOS.clubes,
    catalogHref: "/productos/indumentaria",
  },
  "empresas": {
    title: "Empresas",
    items: ['Indumentaria corporativa', 'Regalos empresariales', 'Gráfica para oficinas', 'Kits de bienvenida'],
    photo: PROFILE_PHOTOS.empresas,
    catalogHref: "/productos/indumentaria",
  },
  "comercios": {
    title: "Comercios",
    items: ['Ploteo de vidrieras', 'Marquesinas y cartelería', 'Decoración interior', 'Uniformes para staff'],
    photo: PROFILE_PHOTOS.comercios,
    catalogHref: "/productos/grafica",
  },
  "eventos": {
    title: "Eventos",
    items: ['Banners y fly banners', 'Armado de stands', 'Acreditaciones y pulseras', 'Souvenirs'],
    photo: PROFILE_PHOTOS.eventos,
    catalogHref: "/productos/grafica",
  },
  "obras": {
    title: "Obras",
    items: ['Frentes de obra en lona', 'Cartelería de seguridad', 'Mallas microperforadas'],
    photo: PROFILE_PHOTOS.obras,
    catalogHref: "/productos/grafica",
  },
};
