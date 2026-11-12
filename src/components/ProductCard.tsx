import React from 'react';
import Link from 'next/link';
import CatalogImage from './CatalogImage';
import type { CatalogPhoto } from '@/data/productImages';

interface ProductCardProps {
  title: string;
  description: string;
  photo?: CatalogPhoto;
  href?: string;
  category: string;
  ctaText?: string;
}

export default function ProductCard({ title, description, photo, href, category, ctaText }: ProductCardProps) {
  return (
    <div className="internal-surface flex h-full min-w-0 flex-col border-2 border-divider transition-colors hover:border-brand focus-within:border-brand">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-divider bg-[#f6f8fc]">
        <CatalogImage photo={photo} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
      </div>
      
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
          {category}
        </span>
        <h3 className="text-xl font-bold uppercase tracking-tight mb-2 break-words">
          {title}
        </h3>
        <p className="mb-5 flex-grow text-sm leading-relaxed text-gray-600">
          {description}
        </p>
        
        {/* CTA */}
        <Link
          href={href ?? '/contacto'}
          className="mt-auto inline-flex items-center self-start py-2 text-sm font-bold uppercase tracking-wide transition-colors hover:text-brand"
        >
          {ctaText || (href ? 'Ver ficha' : 'Consultar en Contacto')} <span className="ml-2 font-normal">→</span>
        </Link>
      </div>
    </div>
  );
}
