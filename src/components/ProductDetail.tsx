import React from 'react';
import Breadcrumb from './Breadcrumb';
import Button from './Button';
import SectionDivider from './SectionDivider';
import ProductCard from './ProductCard';

export interface ProductInfo {
  title: string;
  category: string;
  categorySlug: string;
  description: string;
  features: string[];
  materials: string[];
  sizes: string[];
  customization: string;
  minQuantity?: string;
  price?: string;
  faqs?: { question: string; answer: string }[];
  relatedProducts?: { title: string; category: string; description: string; href: string }[];
}

interface ProductDetailProps {
  product: ProductInfo;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: 'Productos', href: '/productos' },
        { label: product.category, href: `/productos/${product.categorySlug}` },
        { label: product.title }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-striped border border-divider flex items-center justify-center font-mono text-gray-400 uppercase tracking-widest relative">
            <span className="bg-white px-3 py-1 border border-divider">[ IMAGEN PRINCIPAL ]</span>
            <div className="absolute bottom-4 right-4 text-xs bg-white px-2 border border-divider">FIG. 01</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] bg-striped border border-divider flex items-center justify-center font-mono text-xs text-gray-400 uppercase tracking-widest">
              <span className="bg-white px-2 py-1 border border-divider">[ DETALLE 1 ]</span>
            </div>
            <div className="aspect-[4/3] bg-striped border border-divider flex items-center justify-center font-mono text-xs text-gray-400 uppercase tracking-widest">
              <span className="bg-white px-2 py-1 border border-divider">[ DETALLE 2 ]</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tighter mb-6 leading-none">
            {product.title}
          </h1>
          
          <div className="text-2xl font-mono text-brand mb-8">
            {product.price ? product.price : 'PRECIO: CONSULTAR'}
          </div>

          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-4 border-b border-divider pb-2">Especificaciones</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-brand mr-2">✳</span> {feat}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-4 border-b border-divider pb-2">Materiales</h3>
              <p className="text-sm text-gray-700">{product.materials.join(' · ')}</p>
              
              <h3 className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-4 border-b border-divider pb-2 mt-6">Talles / Tamaños</h3>
              <p className="text-sm text-gray-700">{product.sizes.join(' · ')}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 border border-divider mb-12 text-sm text-gray-700 space-y-2">
            <p><strong className="uppercase font-bold">Personalización:</strong> {product.customization}</p>
            {product.minQuantity && (
              <p><strong className="uppercase font-bold">Cantidad Mínima:</strong> {product.minQuantity}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Button variant="solid" className="w-full sm:w-auto text-center" href="/contacto">
              Solicitar Pedido
            </Button>
            <a 
              href="https://wa.me/5491155553300" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center uppercase font-bold tracking-widest text-xs py-4 px-8 border border-green-500 text-green-700 hover:bg-green-500 hover:text-white transition-colors duration-200"
            >
              Consultar WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="mb-32">
          <SectionDivider text="TE PUEDE INTERESAR" metadata="PRODUCTOS RELACIONADOS" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.relatedProducts.map((rel, i) => (
              <ProductCard 
                key={i}
                title={rel.title}
                category={rel.category}
                description={rel.description}
                href={rel.href}
              />
            ))}
          </div>
        </section>
      )}

      {/* FAQ Específica */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="mb-24">
          <SectionDivider text="DUDAS FRECUENTES" metadata="SOBRE ESTE PRODUCTO" />
          <div className="max-w-3xl">
            {product.faqs.map((faq, i) => (
              <div key={i} className="mb-8 border-b border-divider pb-6">
                <h4 className="text-lg font-bold uppercase tracking-tight mb-2">Q: {faq.question}</h4>
                <p className="text-gray-700">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
