'use client';

import { useState } from 'react';
import Link from 'next/link';
import { itemKey, useConsultation } from './ConsultationProvider';
import type { ConsultationItem, SaveResult } from './ConsultationProvider';
import ProductSelection from './ProductSelection';
import CatalogImage from './CatalogImage';
import Button from './Button';
import ConsultationRequest from './ConsultationRequest';
import type { CatalogPhoto } from '@/data/productImages';
import styles from './ConsultationReview.module.css';
import GuidedProductSelection from './guided/GuidedProductSelection';
import ConsultationItemSummary from './ConsultationItemSummary';
import { productKinds } from '@/data/guidedCatalogs';

export default function ConsultationReview({ photos }: { photos: Record<string, CatalogPhoto | undefined> }) {
  const { items, ready, remove, pendingIds, conflicts, demoCatalog } = useConsultation();
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState<{ id: string; result: SaveResult } | null>(null);
  const [removing, setRemoving] = useState(false);
  const [held, setHeld] = useState(new Map<string, ConsultationItem>());
  const reviewItems = [...items, ...[...held.values()].filter((entry) => !items.some((item) => itemKey(item) === itemKey(entry)))];

  const temporaryResolved = lastResult?.result === 'temporary' && !pendingIds.includes(lastResult.id);
  const conflictResolved = lastResult?.result === 'conflict' && conflicts.length === 0;
  const feedback = temporaryResolved || conflictResolved ? '' : message;

  function hold(item: ConsultationItem, dirty: boolean) {
    setHeld((previous) => {
      const next = new Map(previous);
      if (dirty) next.set(itemKey(item), item);
      else next.delete(itemKey(item));
      return next;
    });
  }

  return (
    <div className={styles.review}>
      <details open className={`internal-surface ${styles.panel}`} id="consulta-panel">
        <summary className={styles.toggle} id="consulta-panel-toggle">
          <span><strong>Productos y datos de tu consulta</strong><span className={styles.count}>{ready ? `${reviewItems.length} ${reviewItems.length===1?'selección':'selecciones'}` : 'Cargando selección…'}</span></span>
          <span className={styles.toggleAction} aria-hidden="true"><span className={styles.whenOpen}>Contraer</span><span className={styles.whenClosed}>Expandir</span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></span>
        </summary>
        <div className={styles.contents}>
      <p role="status" aria-live="polite" className="mb-4 text-sm font-semibold">{feedback}</p>
      {!ready ? <p role="status" className="mb-8">Cargando tu consulta…</p> : reviewItems.length === 0 ? (
        <p className="mb-8 text-lg text-gray-600">Tu consulta está vacía. Explorá el catálogo y agregá los productos que te interesan.</p>
      ) : (
        <ul aria-label="Productos seleccionados" className="space-y-8 mb-10">
          {reviewItems.map((item) => (
            <li key={itemKey(item)} data-selection-key={itemKey(item)} className="min-w-0 border-b border-divider pb-6">
              <div className="flex items-start gap-4 mb-5">
                {photos[item.id] && <div className="internal-surface relative h-24 w-24 shrink-0">
                  <CatalogImage photo={photos[item.id]} sizes="96px" />
                </div>}
                <div className="min-w-0">
                  <h2 className="text-xl mb-2 break-words">{item.name}</h2>
                  {item.configuration && <p className="text-sm mb-2">Configuración {reviewItems.filter((entry) => entry.id === item.id).findIndex((entry) => itemKey(entry) === itemKey(item)) + 1}</p>}
                  {!demoCatalog && <Link href={productKinds[item.id] ? `${item.path}#configuracion=${encodeURIComponent(itemKey(item))}` : item.path} aria-label={productKinds[item.id] ? `Editar configuración ${reviewItems.filter((entry) => entry.id === item.id).findIndex((entry) => itemKey(entry) === itemKey(item)) + 1} de ${item.name}` : undefined} className="inline-block py-2 text-sm font-bold underline underline-offset-4 hover:text-brand">{productKinds[item.id] ? 'Editar configuración' : `Ver ficha de ${item.name}`}</Link>}
                </div>
              </div>
              {productKinds[item.id] ? <>
                <ConsultationItemSummary item={item} />
                {demoCatalog && <details className="my-5"><summary className="py-3 font-bold cursor-pointer">Editar esta configuración</summary><GuidedProductSelection product={item} targetKey={itemKey(item)} embedded onDraftChange={(dirty) => hold(item, dirty)} /></details>}
              </> : <ProductSelection product={item} heading="Editar selección" onDraftChange={(dirty) => hold(item, dirty)} />}
              <Button showArrow={false} aria-label={`Quitar ${item.name}`} disabled={removing} onClick={async () => {
                setRemoving(true);
                try {
                  const result = await remove(itemKey(item), items.find((entry) => itemKey(entry) === itemKey(item)) ?? null);
                  setLastResult({ id: itemKey(item), result });
                  if (result === 'conflict') {
                    setMessage('Hay cambios pendientes de resolver en otra pestaña. Revisá los avisos antes de quitar el producto.');
                    return;
                  }
                  hold(item, false);
                  setMessage(result === 'saved'
                    ? `${item.name} se quitó de Mi consulta.`
                    : `${item.name} se quitó solo en esta sesión. El navegador no permitió guardar el cambio; la selección anterior puede reaparecer al recargar.`);
                } finally {
                  setRemoving(false);
                }
              }}>Quitar producto</Button>
            </li>
          ))}
        </ul>
      )}
      <ConsultationRequest hasProductDrafts={held.size > 0} />
      <Button href="/productos" className="max-w-full text-center">Seguir explorando productos</Button>
        </div>
      </details>
    </div>
  );
}
