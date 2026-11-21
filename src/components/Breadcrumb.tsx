import React from 'react';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/siteUrl';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  wrap?: boolean;
  currentPath: string;
}

export default function Breadcrumb({ items, wrap = false, currentPath }: BreadcrumbProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Inicio', href: '/' }, ...items].map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.label,
      item: absoluteUrl(item.href ?? currentPath),
    })),
  };
  return (
    <nav aria-label="Ruta de navegación" className={`flex items-center gap-x-2 gap-y-1 text-sm font-sans font-medium text-gray-500 mb-4 pb-2 ${wrap ? 'flex-wrap min-w-0 break-words' : 'overflow-x-auto whitespace-nowrap'}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
      <Link href="/" className="inline-flex min-h-8 items-center hover:text-foreground transition-colors">
        Inicio
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span aria-hidden="true">/</span>
          {item.href ? (
            <Link href={item.href} className="inline-flex min-h-8 items-center hover:text-foreground transition-colors">
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
