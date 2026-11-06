import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  href?: string;
  category: string;
  ctaText?: string;
}

export default function ProductCard({ title, description, imageUrl, href, category, ctaText }: ProductCardProps) {
  return (
    <div className="group border border-divider flex flex-col h-full bg-white hover:border-brand transition-colors duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden border-b border-divider">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={imageUrl} 
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase tracking-widest bg-striped">
            <span className="bg-white px-2 py-1 border border-divider text-gray-400">[ IMG ]</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-mono text-brand uppercase tracking-widest mb-3">
          {category}
        </span>
        <h3 className="text-xl font-bold uppercase tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-6 flex-grow">
          {description}
        </p>
        
        {/* CTA */}
        {href ? (
          <Link 
            href={href}
            className="inline-flex items-center text-xs font-bold uppercase tracking-widest hover:text-brand transition-colors mt-auto"
          >
            {ctaText || 'Ver producto'} <span className="ml-2 font-normal">→</span>
          </Link>
        ) : (
          <span className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-gray-400 mt-auto">
            {ctaText || 'Ficha en desarrollo'}
          </span>
        )}
      </div>
    </div>
  );
}
