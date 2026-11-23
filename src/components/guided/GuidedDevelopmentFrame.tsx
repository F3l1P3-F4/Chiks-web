'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import ConsultationProvider from '../ConsultationProvider';
import type { ConsultationProduct } from '../ConsultationProvider';
import ConsultationReview from '../ConsultationReview';
import GuidedProductSelection from './GuidedProductSelection';
import { GuidedModeBar } from './GuidedPreview';
import { demoCatalogs } from '@/data/guidedDemoCatalogs';
import { productKinds } from '@/data/guidedCatalogs';
import pilot from '../RemerasProductDetail.module.css';
import styles from './GuidedPreview.module.css';

export default function GuidedDevelopmentFrame({ gallery, commercialSelection, product }: { gallery: ReactNode; commercialSelection: ReactNode; product: ConsultationProduct }) {
  const [demo, setDemo] = useState(false);
  return <>
    <GuidedModeBar idPrefix={`demo-${product.id}`} demo={demo} onToggle={() => { setDemo(!demo);requestAnimationFrame(() => document.getElementById(`${!demo ? 'demo-' : ''}guiada-${product.id}-ficha-title`)?.focus()); }} />
    <div hidden={!demo} className={styles.warning} role="note"><strong>Demostración aislada — sin disponibilidad comercial confirmada</strong><p>Probá opciones F02, múltiples configuraciones, edición y revisión del mensaje. Todo queda sólo en memoria de esta prueba y se reinicia al salir o recargar. No se copia a la consulta comercial ni se abre WhatsApp.</p></div>
    <div className={pilot.workspace}>
      {gallery}
      <div hidden={demo} className={styles.contents}>{commercialSelection}</div>
      {demo && <ConsultationProvider products={[product]} demoCatalog={demoCatalogs[productKinds[product.id]]}>
        <div id={`demo-${product.id}-view`} className={styles.contents}>
          <GuidedProductSelection product={product} />
          <section className="internal-surface p-6 col-span-full" aria-label="Mi consulta de demostración"><h2 className="text-xl mb-6">Mi consulta de demostración</h2><ConsultationReview photos={{}} /></section>
        </div>
      </ConsultationProvider>}
    </div>
  </>;
}
