import type { ReactNode } from 'react';

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="catalog-background bg-portada relative isolate flex-1 overflow-hidden">
      <div aria-hidden="true" className="bg-portada-curvas pointer-events-none absolute inset-x-0 top-0 -z-10" />
      {children}
    </div>
  );
}
