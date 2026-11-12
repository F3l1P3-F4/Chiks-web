import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  wrap?: boolean;
}

export default function Breadcrumb({ items, wrap = false }: BreadcrumbProps) {
  return (
    <nav aria-label="Ruta de navegación" className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 mb-8 pb-2 ${wrap ? 'flex-wrap min-w-0 break-words' : 'overflow-x-auto whitespace-nowrap'}`}>
      <Link href="/" className="hover:text-foreground transition-colors">
        Inicio
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span aria-hidden="true">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground" aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
