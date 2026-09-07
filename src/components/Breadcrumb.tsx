import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
      <Link href="/" className="hover:text-foreground transition-colors">
        Inicio
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
