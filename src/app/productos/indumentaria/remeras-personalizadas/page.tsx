import React from 'react';
import ProductDetail, { ProductInfo } from '@/components/ProductDetail';

export default function RemerasPersonalizadasPage() {
  const productData: ProductInfo = {
    title: "Remeras Personalizadas",
    category: "Indumentaria",
    categorySlug: "indumentaria",
    description: "Remeras de confección propia ideales para uniformes, egresados, eventos o merchandising. Estampamos tu logo o diseño a todo color garantizando durabilidad y calidad textil.",
    features: [
      "Costuras reforzadas",
      "Cuello redondo o escote en V",
      "Corte unisex o entallado",
      "Resistencia a lavados intensos"
    ],
    materials: ["Algodón Peinado 20/1", "Spun (Poliéster)", "Dry Fit"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "Especiales a pedido"],
    customization: "Serigrafía (hasta 6 colores), Sublimación (full color, solo prendas claras de poliéster), o Bordado.",
    minQuantity: "A partir de 10 unidades (serigrafía) / Sin mínimo (sublimación)",
    faqs: [
      {
        question: "¿Se puede sublimar sobre remera negra?",
        answer: "No, la sublimación no toma sobre bases oscuras o algodón. Para prendas oscuras recomendamos serigrafía o transfer."
      },
      {
        question: "¿Cuánto demora el pedido?",
        answer: "Generalmente entre 7 y 10 días hábiles desde la aprobación del diseño."
      }
    ],
    relatedProducts: [
      {
        title: "Camperas",
        category: "Indumentaria",
        description: "Camperas de abrigo y rompevientos con logo bordado.",
        href: "/productos/indumentaria/camperas"
      },
      {
        title: "Conjuntos Deportivos",
        category: "Indumentaria",
        description: "Equipos completos de fútbol, básquet o vóley.",
        href: "/productos/indumentaria/conjuntos-deportivos"
      },
      {
        title: "Bolsos Botineros",
        category: "Indumentaria",
        description: "Complemento perfecto para tu equipo deportivo.",
        href: "/productos/indumentaria/bolsos-botineros"
      }
    ]
  };

  return <ProductDetail product={productData} />;
}
