import React from 'react';
import ProductDetail, { ProductInfo } from '@/components/ProductDetail';
import { catalogPhotos } from '@/data/productImages';
import { catalogEntryHref } from '@/data/catalogEntries';
import { indumentariaGroupHref } from '@/data/indumentariaGroups';

export default function RemerasPersonalizadasPage() {
  const productData: ProductInfo = {
    photo: catalogPhotos.remeras,
    additionalPhotos: [catalogPhotos.deportiva],
    subcategory: { label: 'Personalizada', href: indumentariaGroupHref('personalizada') },
    title: "Remeras Personalizadas",
    category: "Indumentaria",
    categorySlug: "indumentaria",
    description: 'Remeras personalizadas para uniformes, egresados, eventos y merchandising.',
    applications: 'Uniformes, indumentaria para egresados, eventos y merchandising.',
    customization: 'Aplicación de un logo o diseño propio.',
    faqs: [
      { question: '¿Se puede sublimar sobre una remera negra?' },
      { question: '¿Cuánto demora el pedido?' },
    ],
    relatedProducts: [
      {
        title: "Camperas",
        category: "Indumentaria",
        description: "Camperas de abrigo y rompevientos con logo bordado.",
        href: catalogEntryHref('camperas')
      },
      {
        title: "Conjuntos Deportivos",
        category: "Indumentaria",
        description: "Equipos completos de fútbol, básquet o vóley.",
        href: catalogEntryHref('conjuntos-deportivos')
      },
      {
        title: "Botineros",
        category: "Merchandising",
        description: "Complemento perfecto para tu equipo deportivo.",
        href: catalogEntryHref('botineros')
      }
    ]
  };

  return <ProductDetail product={productData} />;
}
