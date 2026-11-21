'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import ProductConsultation from './ProductConsultation';
import { selectionVersion, useConsultation } from './ConsultationProvider';
import type { ConsultationItem, ConsultationProduct, SaveResult } from './ConsultationProvider';
import conflictStyles from './ConsultationConflict.module.css';

interface Draft { quantity: string; notes: string; base: ConsultationItem | null }

export default function ProductSelection({ product, heading = 'Agregar a mi consulta', onDraftChange, showConsultation = false }: {
  product: ConsultationProduct;
  heading?: string;
  onDraftChange?: (dirty: boolean) => void;
  showConsultation?: boolean;
}) {
  const { items, ready, save, pendingIds, conflicts, readCurrent } = useConsultation();
  const router = useRouter();
  const [navigating, startNavigation] = useTransition();
  const saving = useRef(false);
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState<SaveResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const existing = items.find((item) => item.id === product.id) ?? null;
  const quantity = draft?.quantity ?? String(existing?.quantity ?? 1);
  const notes = draft?.notes ?? existing?.notes ?? '';
  const conflict = draft !== null && selectionVersion(draft.base) !== selectionVersion(existing);
  const formId = `seleccion-form-${product.id}`;
  const busy = submitting || navigating;

  const temporaryResolved = lastResult === 'temporary' && !pendingIds.includes(product.id);
  const conflictResolved = lastResult === 'conflict' && !conflict && conflicts.length === 0;
  const feedback = temporaryResolved || conflictResolved ? '' : message;

  function edit(quantity: string, notes: string) {
    setDraft({ quantity, notes, base: draft ? draft.base : existing });
    onDraftChange?.(true);
    setMessage('');
    setLastResult(null);
  }

  function clearDraft() {
    setDraft(null);
    onDraftChange?.(false);
    setMessage('');
    setLastResult(null);
  }

  return (
    <>
    <section aria-labelledby={`seleccion-${product.id}`} className="internal-surface border border-divider p-6 mb-8">
      <h2 id={`seleccion-${product.id}`} className="text-xl mb-4">{heading}</h2>
      {conflict && <div role="alert" className="text-sm mb-4 space-y-3">
        <p>Este producto cambió en otra pestaña. Tu borrador sigue aquí. Elegí qué versión conservar antes de guardar.</p>
        <p className={conflictStyles.observations}>Versión guardada: {existing ? `${existing.quantity} unidades. Observaciones: ${existing.notes || 'Sin observaciones.'}` : 'Producto eliminado.'}</p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" showArrow={false} onClick={clearDraft}>Usar versión guardada</Button>
          <Button type="button" showArrow={false} onClick={() => {
            setDraft({ quantity, notes, base: existing });
            setLastResult(null);
            setMessage('Borrador conservado. Pulsá el botón de guardar para aplicar tus cambios.');
          }}>Conservar mi borrador</Button>
        </div>
      </div>}
      <form
        id={formId}
        onInvalid={(event) => {
          setLastResult(null);
          setMessage((event.target as HTMLInputElement | HTMLTextAreaElement).name === 'quantity'
            ? 'Ingresá una cantidad entera positiva dentro del rango permitido.'
            : 'Las observaciones deben tener hasta 2.000 caracteres.');
        }}
        onSubmit={async (event) => {
          event.preventDefault();
          if (conflict || saving.current || navigating) return;
          const submitter = (event.nativeEvent as SubmitEvent).submitter;
          const requestBudget = submitter instanceof HTMLButtonElement && submitter.name === 'selectionAction' && submitter.value === 'budget';
          const value = Number(quantity);
          if (!Number.isSafeInteger(value) || value <= 0) {
            setLastResult(null);
            setMessage('Ingresá una cantidad entera positiva.');
            return;
          }
          if (notes.length > 2000) {
            setLastResult(null);
            setMessage('Las observaciones deben tener hasta 2.000 caracteres.');
            return;
          }
          const selection = { ...product, quantity: value, notes: notes.trim() };
          saving.current = true;
          setSubmitting(true);
          try {
            const result = await save(selection, draft ? draft.base : existing);
            setLastResult(result);
            if (result === 'conflict') {
              setMessage('Hay cambios en otra pestaña. Revisá los avisos de conflicto antes de guardar.');
              return;
            }
            if (requestBudget) {
              const current = readCurrent();
              if (current.conflicts.length || selectionVersion(current.items.find((item) => item.id === product.id)) !== selectionVersion(selection)) {
                setLastResult('conflict');
                setMessage('La selección cambió. Revisá los avisos y volvé a guardar antes de solicitar presupuesto. Tu borrador sigue aquí.');
                return;
              }
            }
            clearDraft();
            setLastResult(result);
            setMessage(result === 'saved'
              ? existing ? 'Selección actualizada en Mi consulta.' : 'Producto agregado a Mi consulta.'
              : 'La selección quedó en esta sesión. El navegador no permitió guardarla y se perderá al recargar.');
            if (requestBudget) startNavigation(() => router.push('/mi-consulta'));
          } catch {
            setLastResult(null);
            setMessage('No se pudo completar la acción. Tu selección sigue en el formulario; volvé a intentarlo.');
          } finally {
            saving.current = false;
            setSubmitting(false);
          }
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor={`cantidad-${product.id}`} className="block text-sm font-bold mb-2">Cantidad solicitada</label>
          <input id={`cantidad-${product.id}`} name="quantity" type="number" min="1" max={Number.MAX_SAFE_INTEGER} step="1" required value={quantity} disabled={!ready || busy} onChange={(event) => edit(event.target.value, notes)}
            className="w-full rounded-lg border border-divider bg-white p-3 text-[#07134b]" />
        </div>
        <div>
          <label htmlFor={`observaciones-${product.id}`} className="block text-sm font-bold mb-2">Observaciones opcionales</label>
          <textarea id={`observaciones-${product.id}`} name="notes" rows={3} maxLength={2000} value={notes} onChange={(event) => edit(quantity, event.target.value)} disabled={!ready || busy} aria-describedby={`ayuda-${product.id}`}
            className="w-full rounded-lg border border-divider bg-white p-3 text-[#07134b]" />
          <p id={`ayuda-${product.id}`} className="text-sm text-gray-600 mt-2">Podés indicar talles, colores, diseños u otras necesidades. No incluyas datos personales.</p>
        </div>
        <Button type="submit" variant="solid" disabled={!ready || conflict || busy} className="w-full max-w-full text-center disabled:opacity-50">
          {existing ? 'Actualizar mi consulta' : 'Agregar a mi consulta'}
        </Button>
      </form>
      {draft && <p className="mt-3 text-sm">Borrador sin guardar.</p>}
      <p id={`${formId}-status`} role="status" aria-live="polite" className="mt-3 text-sm font-semibold">{feedback}</p>
    </section>
    {showConsultation && <ProductConsultation selectionFormId={formId} disabled={!ready || conflict || busy} />}
    </>
  );
}
