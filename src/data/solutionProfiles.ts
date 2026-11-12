import clubesPhoto from '../../public/images/soluciones/clubes-y-equipos.webp';
import empresasPhoto from '../../public/images/soluciones/empresas.webp';
import comerciosPhoto from '../../public/images/soluciones/comercios.webp';
import eventosPhoto from '../../public/images/soluciones/eventos.webp';
import obrasPhoto from '../../public/images/soluciones/obras.webp';

export const PROFILE_PHOTOS = {
  clubes: { src: clubesPhoto, alt: 'Equipo con indumentaria deportiva personalizada', position: '50% 45%' },
  empresas: { src: empresasPhoto, alt: 'Gorras e indumentaria corporativa personalizadas', position: '50% 20%' },
  comercios: { src: comerciosPhoto, alt: 'Vidriera de comercio con gráfica personalizada', position: '50% 30%' },
  eventos: { src: eventosPhoto, alt: 'Stand y paneles gráficos para un evento', position: '50% 55%' },
  obras: { src: obrasPhoto, alt: 'Carteles impresos para una empresa de obras', position: '50% 20%' },
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
