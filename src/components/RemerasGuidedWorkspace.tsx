'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import GuidedProductSelection from './guided/GuidedProductSelection';
import type { ConsultationProduct } from './ConsultationProvider';
import pilot from './RemerasProductDetail.module.css';
import styles from './RemerasGuidedWorkspace.module.css';

// Sólo reubica la vista del resumen. El estado y los cálculos siguen en el formulario existente.
export default function RemerasGuidedWorkspace({ gallery, product }: { gallery: ReactNode; product: ConsultationProduct }) {
  const [summaryTarget, setSummaryTarget] = useState<HTMLDivElement | null>(null);
  return <div className={`${pilot.workspace} ${styles.workspace}`}>
    <div className={pilot.visualColumn} data-v10-column="gallery">
      {gallery}
    </div>
    <GuidedProductSelection product={product} presentation="remeras-definitiva" summaryTarget={summaryTarget} />
    <div ref={setSummaryTarget} className={styles.summaryMount} />
  </div>;
}
