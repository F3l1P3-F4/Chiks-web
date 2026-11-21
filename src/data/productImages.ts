import { visualAssets } from './visualAssets';
import type { StaticImageData } from 'next/image';

export interface CatalogPhoto {
  src: StaticImageData;
  alt: string;
  illustrative?: boolean;
}

export const catalogPhotos = {
  vidrieras: { src: visualAssets.vidriera, alt: 'Gráfica aplicada a una vidriera comercial' },
  banderas: { src: visualAssets.banderas, alt: 'Bandera publicitaria con soporte' },
  gorras: { src: visualAssets.gorras, alt: 'Gorras personalizadas con estampados' },
  deportiva: { src: visualAssets.deportiva, alt: 'Remera personalizada para un club' },
  remeras: { src: visualAssets.corporativa, alt: 'Remeras con estampados corporativos' },
  empresarial: { src: visualAssets.uniformes, alt: 'Gorras e indumentaria con identificación corporativa' },
  ploteo: { src: visualAssets.ploteo, alt: 'Vehículo con ploteo gráfico' },
  tazas: { src: visualAssets.tazas, alt: 'Tazas personalizadas con escudo de club' },
  carteleria: { src: visualAssets.carteleria, alt: 'Carteles impresos para una empresa de obras' },
  stands: { src: visualAssets.stand, alt: 'Stand con paneles gráficos para un evento' },
} satisfies Record<string, CatalogPhoto>;
