'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CatalogPhoto } from '@/data/productImages';

export default function CatalogImage({ photo, sizes, thumbnail = false }: {
  photo?: CatalogPhoto;
  sizes: string;
  thumbnail?: boolean;
}) {
  // Una nueva selección vuelve a intentar la carga aunque la anterior falle.
  return <CatalogImageContent key={photo?.src.src} photo={photo} sizes={sizes} thumbnail={thumbnail} />;
}

function CatalogImageContent({ photo, sizes, thumbnail }: {
  photo?: CatalogPhoto;
  sizes: string;
  thumbnail: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!photo || failed) {
    return (
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#eef3fa] p-2 text-center text-[#354560]">
        <svg aria-hidden="true" className={thumbnail ? 'size-5' : 'size-9'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m4 17 5-4 3 2 4-5 5 5" />
        </svg>
        <span className={thumbnail ? 'sr-only' : 'text-sm font-semibold'}>Sin imagen disponible</span>
      </span>
    );
  }

  return (
    <>
      <Image src={photo.src} alt={thumbnail ? '' : photo.alt} fill sizes={sizes} className="object-contain" onError={() => setFailed(true)} />
      {photo.illustrative && !thumbnail && (
        <span className="absolute bottom-2 left-2 rounded-full bg-[#07134b] px-3 py-1 text-xs font-semibold text-white">
          Imagen ilustrativa
        </span>
      )}
    </>
  );
}
