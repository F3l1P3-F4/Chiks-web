import { configurationRows } from '@/lib/consultationConfiguration';
import type { ConsultationItem } from './ConsultationProvider';
import { SummaryRows } from './guided/GuidedPreview';

export default function ConsultationItemSummary({ item }: { item: ConsultationItem }) {
  return <SummaryRows review notesLabel="Observaciones completas de la selección" rows={[
    { label: 'Cantidad total', value: String(item.quantity) }, ...configurationRows(item.configuration),
    { label: 'Observaciones', value: item.notes || 'Sin observaciones.', scrollable: !!item.notes },
  ]} />;
}
