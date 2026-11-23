'use client';

import { useConsultation } from './ConsultationProvider';
import Button from './Button';
import conflictStyles from './ConsultationConflict.module.css';
import ConsultationItemSummary from './ConsultationItemSummary';

export default function ConsultationPersistence() {
  const { ready, pendingCount, conflicts, readable, retry, resolve, storageIssue } = useConsultation();
  if (!ready || (pendingCount === 0 && readable && !storageIssue)) return null;

  return (
    <aside aria-label="Estado de guardado de Mi consulta" className="internal-page bg-[#031b50] px-4 py-3">
      <div className="internal-surface mx-auto max-w-[1400px] break-words p-4 text-sm space-y-3">
        {storageIssue && <p role="alert">{storageIssue}</p>}
        <p role="status" aria-live="polite">
          {pendingCount > 0
            ? 'Hay cambios locales sin guardar. Se conservan en esta pestaña y pueden perderse al recargar o cerrarla.'
            : !readable ? 'El navegador no permite leer el almacenamiento de Mi consulta.' : 'La información guardada necesita revisión antes de continuar.'}
        </p>
        {conflicts.map((conflict) => (
          <div key={conflict.key} role="alert" className="space-y-2">
            <p className="font-bold">{conflict.name} también cambió en otra pestaña.</p>
            <div className={conflictStyles.observations}><strong>Versión local</strong>{conflict.local ? <ConsultationItemSummary item={conflict.local} /> : <p>Producto quitado.</p>}</div>
            <div className={conflictStyles.observations}><strong>Otra pestaña</strong>{conflict.remote ? <ConsultationItemSummary item={conflict.remote} /> : <p>Producto quitado.</p>}</div>
            <div className="flex flex-wrap gap-3">
              <Button className="max-w-full text-center" showArrow={false} onClick={() => resolve(conflict.key, 'local')}>Conservar cambio local de {conflict.name}</Button>
              <Button className="max-w-full text-center" showArrow={false} onClick={() => resolve(conflict.key, 'remote')}>Usar cambio de otra pestaña de {conflict.name}</Button>
            </div>
          </div>
        ))}
        {pendingCount > 0 && conflicts.length === 0 && !storageIssue && <Button showArrow={false} onClick={retry}>Reintentar guardado</Button>}
      </div>
    </aside>
  );
}
