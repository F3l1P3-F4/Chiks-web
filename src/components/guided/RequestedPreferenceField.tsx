'use client';

import { useState } from 'react';
import { GuidedChoiceField } from './GuidedPreview';
import styles from './GuidedPreview.module.css';
import local from './GuidedProductSelection.module.css';

// La selección escribe los mismos campos de solicitud que ya conserva F04.
export default function RequestedPreferenceField({ idPrefix, field, title, value, options, onChange, advice, onAdvice, adviceText, limit = 120 }: {
  idPrefix: string; field: string; title: string; value: string;
  options: readonly (readonly [string, string, string])[];
  onChange: (value: string) => void;
  advice?: boolean; onAdvice?: (value: boolean) => void; adviceText: string;
  limit?: number;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const option = options.find(([, label]) => label === value);
  const asking = onAdvice ? advice : value === adviceText;
  const custom = customOpen || (!!value && !option && !asking);
  const selected = custom ? 'otra' : asking ? 'asesoramiento' : option?.[0];
  const id = `${idPrefix}-request-${field}`;
  return <div className={local.preferenceField}>
    <GuidedChoiceField idPrefix={idPrefix} field={`preference-${field}`} label={title} options={[
      ...options,
      ['otra', 'Otra preferencia', 'Contanos una necesidad diferente.'],
      ['asesoramiento', 'Necesito asesoramiento', 'Podés continuar sin definir esta preferencia.'],
    ]} selected={selected} error={null} onChange={choice => {
      setCustomOpen(choice === 'otra');
      onAdvice?.(choice === 'asesoramiento');
      if (choice === 'otra') {
        // No borrar el valor previo al abrir su edición libre.
        if (asking) onChange('');
      } else onChange(choice === 'asesoramiento' ? onAdvice ? '' : adviceText : options.find(([key]) => key === choice)![1]);
    }} />
    <p className={styles.fieldHelp}>Preferencias para solicitar, sujetas a confirmación al presupuestar. No indican disponibilidad.</p>
    {custom && <div className={styles.formField}>
      <label htmlFor={id}>Describí otra preferencia (opcional)</label>
      <textarea id={id} rows={2} maxLength={limit} value={value} onChange={event => onChange(event.target.value)} aria-describedby={`${id}-help`} />
      <p id={`${id}-help`} className={styles.fieldHelp}>Se conserva tu descripción completa. Hasta {limit} caracteres.</p>
    </div>}
    {(value || asking || custom) && <button type="button" className={styles.smallLink} onClick={()=>{setCustomOpen(false);onAdvice?.(false);onChange('');}}>Dejar {title.toLocaleLowerCase('es')} sin definir</button>}
  </div>;
}
