'use client';

import { useConsultation } from './ConsultationProvider';
import Button from './Button';
import conflictStyles from './ConsultationConflict.module.css';

export default function ConsultationPersistence() {
  const { ready, pendingCount, conflicts, readable, retry, resolve } = useConsultation();
  if (!ready || (pendingCount === 0 && readable)) return null;

  return (
    <aside aria-label="Estado de guardado de Mi consulta" className="internal-page bg-[#031b50] px-4 py-3">
      <div className="internal-surface mx-auto max-w-[1400px] break-words p-4 text-sm space-y-3">
        <p role="status" aria-live="polite">
          {pendingCount > 0
            ? 'Hay cambios locales sin guardar. Se conservan en esta pestaña y pueden perderse al recargar o cerrarla.'
            : 'El navegador no permite leer el almacenamiento de Mi consulta.'}
        </p>
        {conflicts.map((conflict) => (
          <div key={conflict.id} role="alert" className="space-y-2">
            <p className="font-bold">{conflict.name} también cambió en otra pestaña.</p>
            <p className={conflictStyles.observations}>Versión local: {conflict.local ? `${conflict.local.quantity} unidades. ${conflict.local.notes}` : 'Producto quitado.'}</p>
            <p className={conflictStyles.observations}>Otra pestaña: {conflict.remote ? `${conflict.remote.quantity} unidades. ${conflict.remote.notes}` : 'Producto quitado.'}</p>
            <div className="flex flex-wrap gap-3">
              <Button className="max-w-full text-center" showArrow={false} onClick={() => resolve(conflict.id, 'local')}>Conservar cambio local de {conflict.name}</Button>
              <Button className="max-w-full text-center" showArrow={false} onClick={() => resolve(conflict.id, 'remote')}>Usar cambio de otra pestaña de {conflict.name}</Button>
            </div>
          </div>
        ))}
        {pendingCount > 0 && conflicts.length === 0 && <Button showArrow={false} onClick={retry}>Reintentar guardado</Button>}
      </div>
    </aside>
  );
}
