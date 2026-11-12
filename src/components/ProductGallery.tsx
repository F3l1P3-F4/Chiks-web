'use client';

import { useState } from 'react';
import CatalogImage from './CatalogImage';
import type { CatalogPhoto } from '@/data/productImages';

export default function ProductGallery({ photos }: { photos: CatalogPhoto[] }) {
  const [selected, setSelected] = useState(0);
  const photo = photos[selected] ?? photos[0];

  return (
    <section aria-label="Fotografías del producto" className="min-w-0 space-y-4">
      <div className="internal-surface relative aspect-[4/3] border-2 border-divider" id="product-main-image">
        <CatalogImage photo={photo} sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      {photos.length > 1 && (
        <div role="group" aria-label="Miniaturas" className="flex flex-wrap gap-3">
          {photos.map((thumbnail, index) => (
            <button
              key={thumbnail.src.src}
              type="button"
              aria-label={`Ver foto ${index + 1}: ${thumbnail.alt}`}
              aria-controls="product-main-image"
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
              className="relative h-16 w-20 cursor-pointer overflow-hidden rounded-lg border-2 border-divider bg-white aria-pressed:border-brand"
            >
              <CatalogImage photo={thumbnail} sizes="80px" thumbnail />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
