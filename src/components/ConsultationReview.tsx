'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useConsultation } from './ConsultationProvider';
import type { ConsultationItem, SaveResult } from './ConsultationProvider';
import ProductSelection from './ProductSelection';
import CatalogImage from './CatalogImage';
import Button from './Button';
import ConsultationRequest from './ConsultationRequest';
import type { CatalogPhoto } from '@/data/productImages';
import styles from './ConsultationReview.module.css';

export default function ConsultationReview({ photos }: { photos: Record<string, CatalogPhoto | undefined> }) {
  const { items, ready, remove, pendingIds, conflicts } = useConsultation();
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState<{ id: string; result: SaveResult } | null>(null);
  const [removing, setRemoving] = useState(false);
  const [held, setHeld] = useState(new Map<string, ConsultationItem>());
  const reviewItems = [...items, ...[...held.values()].filter((entry) => !items.some((item) => item.id === entry.id))];

  const temporaryResolved = lastResult?.result === 'temporary' && !pendingIds.includes(lastResult.id);
  const conflictResolved = lastResult?.result === 'conflict' && conflicts.length === 0;
  const feedback = temporaryResolved || conflictResolved ? '' : message;

  function hold(item: ConsultationItem, dirty: boolean) {
    setHeld((previous) => {
      const next = new Map(previous);
      if (dirty) next.set(item.id, item);
      else next.delete(item.id);
      return next;
    });
  }

  return (
    <div className={styles.review}>
      <p role="status" aria-live="polite" className="mb-4 text-sm font-semibold">{feedback}</p>
      {!ready ? <p role="status" className="mb-8">Cargando tu consulta…</p> : reviewItems.length === 0 ? (
        <p className="mb-8 text-lg text-gray-600">Tu consulta está vacía. Explorá el catálogo y agregá los productos que te interesan.</p>
      ) : (
        <ul aria-label="Productos seleccionados" className="space-y-8 mb-10">
          {reviewItems.map((item) => (
            <li key={item.id} className="min-w-0 border-b border-divider pb-6">
              <div className="flex items-start gap-4 mb-5">
                {photos[item.id] && <div className="internal-surface relative h-24 w-24 shrink-0">
                  <CatalogImage photo={photos[item.id]} sizes="96px" />
                </div>}
                <div className="min-w-0">
                  <h2 className="text-xl mb-2 break-words">{item.name}</h2>
                  <Link href={item.path} className="inline-block py-2 text-sm font-bold underline underline-offset-4 hover:text-brand">Ver ficha de {item.name}</Link>
                </div>
              </div>
              <ProductSelection product={item} heading="Editar selección" onDraftChange={(dirty) => hold(item, dirty)} />
              <Button showArrow={false} aria-label={`Quitar ${item.name}`} disabled={removing} onClick={async () => {
                setRemoving(true);
                try {
                  const result = await remove(item.id, items.find((entry) => entry.id === item.id) ?? null);
                  setLastResult({ id: item.id, result });
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
  );
}
