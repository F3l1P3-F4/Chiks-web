import type { StaticImageData } from 'next/image';
import banderas from '../../public/images/productos/banderas-publicitarias.webp';
import gorras from '../../public/images/productos/gorras-personalizadas.webp';
import clubes from '../../public/images/productos/indumentaria-clubes.webp';
import corporativa from '../../public/images/productos/indumentaria-corporativa.webp';
import uniformes from '../../public/images/productos/uniformes-corporativos.webp';
import ploteo from '../../public/images/productos/ploteo-vehicular.webp';
import tazas from '../../public/images/productos/tazas-personalizadas.webp';
import carteleria from '../../public/images/productos/carteleria-obra.webp';
import vidrieras from '../../public/images/productos/vidriera-comercial.webp';

export interface CatalogPhoto {
  src: StaticImageData;
  alt: string;
  illustrative?: boolean;
}

export const catalogPhotos = {
  vidrieras: { src: vidrieras, alt: 'Gráfica aplicada a una vidriera comercial' },
  banderas: { src: banderas, alt: 'Bandera publicitaria con soporte' },
  gorras: { src: gorras, alt: 'Gorras personalizadas con estampados' },
  deportiva: { src: clubes, alt: 'Remera personalizada para un club' },
  remeras: { src: corporativa, alt: 'Remeras con estampados corporativos' },
  empresarial: { src: uniformes, alt: 'Gorras e indumentaria con identificación corporativa' },
  ploteo: { src: ploteo, alt: 'Vehículo con ploteo gráfico' },
  tazas: { src: tazas, alt: 'Tazas personalizadas con escudo de club' },
  carteleria: { src: carteleria, alt: 'Carteles impresos para una empresa de obras' },
} satisfies Record<string, CatalogPhoto>;
