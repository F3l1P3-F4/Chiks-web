'use client';

import type { ReactNode, Ref } from 'react';
import Button from '../Button';
import type { GuidedStepError } from './useGuidedSteps';
import styles from './GuidedPreview.module.css';

export type GuidedChoiceOption = readonly [value: string, label: string, help: string, color?: string];
export interface GuidedSummaryRow { label: string; value: string; pending?: boolean; scrollable?: boolean }

export function GuidedModeBar({ idPrefix, demo, onToggle }: { idPrefix: string; demo: boolean; onToggle: () => void }) {
  return <div className={styles.modeBar}>
    <div><strong>Prueba local de la ficha</strong><p>Alterná entre la consulta comercial y la experiencia completa de F02.</p></div>
    <Button id={`${idPrefix}-toggle`} showArrow={false} aria-pressed={demo} aria-controls={`${idPrefix}-view`} onClick={onToggle}>{demo ? 'Volver a consulta comercial' : 'Probar experiencia F02'}</Button>
  </div>;
}

export function GuidedDemoNotice({ visible }: { visible: boolean }) {
  return <div hidden={!visible} className={styles.warning} role="note">
    <strong>Demostración — opciones pendientes de confirmación comercial</strong>
    <p>Las selecciones son ilustrativas, no modifican las fotografías y no se guardan ni se envían. No se incorporan a Mi consulta.</p>
  </div>;
}

export function GuidedChoiceField({ idPrefix, field, label, options, selected, onChange, error }: {
  idPrefix: string;
  field: string;
  label: string;
  options: readonly GuidedChoiceOption[];
  selected?: string;
  onChange: (value: string) => void;
  error: GuidedStepError | null;
}) {
  return <fieldset className={styles.fieldset}>
    <legend>{label}</legend>
    <div className={styles.choiceGrid}>
      {options.map(([value, label, help, color]) => {
        const id = `${idPrefix}-${field}-${value}`;
        return <label key={value} className={`${styles.choice} ${value === 'asesoramiento' ? styles.advice : ''}`}>
          <input id={id} type="radio" name={`${idPrefix}-${field}`} value={value} checked={selected === value} onChange={() => onChange(value)} aria-invalid={error?.id === id || undefined} aria-describedby={error?.id === id ? `${idPrefix}-error` : undefined} />
          {color && <span className={styles.colorDot} style={{ backgroundColor: color }} aria-hidden="true" />}
          <span><strong>{label}</strong>{help && <small>{help}</small>}</span>
        </label>;
      })}
    </div>
  </fieldset>;
}

export function GuidedSteps({ idPrefix, steps, step, onSelect, label = 'Pasos de selección de ejemplo' }: {
  idPrefix: string; steps: readonly string[]; step: number; onSelect: (index: number) => void; label?: string;
}) {
  return <ol className={styles.stepNav} aria-label={label}>
    {steps.map((label, index) => <li key={label}><button type="button" aria-current={step === index ? 'step' : undefined} aria-controls={`${idPrefix}-step-content`} onClick={() => onSelect(index)}><span>Paso {index + 1}</span>{label}</button></li>)}
  </ol>;
}

export function GuidedActions({ idPrefix, step, stepCount, onPrevious, onNext }: {
  idPrefix: string; step: number; stepCount: number; onPrevious: () => void; onNext: () => void;
}) {
  return <>
    <div className={styles.actions}>
      {step > 0 && <Button id={`${idPrefix}-back`} showArrow={false} onClick={onPrevious}>Anterior</Button>}
      <Button id={`${idPrefix}-next`} variant="solid" onClick={onNext}>{step === stepCount - 1 ? 'Revisar selección de ejemplo' : 'Continuar'}</Button>
    </div>
    <a className={styles.summaryLink} href={`#${idPrefix}-summary`}>Ver mi resumen de ejemplo</a>
  </>;
}

export function GuidedConfigurator({ idPrefix, className, steps, step, title, help, error, stepTitleRef, onStepChange, onNext, onReset, children, stepsLabel }: {
  idPrefix: string; className: string; steps: readonly string[]; step: number; title: string; help: string;
  error: GuidedStepError | null; stepTitleRef: Ref<HTMLHeadingElement>; onStepChange: (index: number) => void;
  onNext: () => void; onReset: () => void; children: ReactNode; stepsLabel?: string;
}) {
  return <section className={`internal-surface ${className} ${styles.configurator}`} aria-labelledby={`${idPrefix}-title`}>
    <div className={styles.configTop}><h2 id={`${idPrefix}-title`} tabIndex={-1}>Armá tu ejemplo</h2><button id={`${idPrefix}-reset`} type="button" className={styles.smallLink} onClick={onReset}>Reiniciar</button></div>
    <GuidedSteps idPrefix={idPrefix} steps={steps} step={step} onSelect={onStepChange} label={stepsLabel} />
    <div id={`${idPrefix}-step-content`}>
      <h3 ref={stepTitleRef} tabIndex={-1} className={styles.stepTitle}>{title}</h3>
      <p className={styles.stepHelp}>{help}</p>
      {error && <p id={`${idPrefix}-error`} role="alert" className={styles.error}>{error.message}</p>}
      {children}
    </div>
    <GuidedActions idPrefix={idPrefix} step={step} stepCount={steps.length} onPrevious={() => onStepChange(step - 1)} onNext={onNext} />
  </section>;
}

export function GuidedNotes({ idPrefix, value, onChange }: { idPrefix: string; value: string; onChange: (value: string) => void }) {
  return <div className={styles.formField}>
    <label htmlFor={`${idPrefix}-notes`}>Observaciones adicionales del ejemplo</label>
    <textarea id={`${idPrefix}-notes`} rows={3} maxLength={2000} value={value} onChange={(event) => onChange(event.target.value)} aria-describedby={`${idPrefix}-notes-help`} />
    <p id={`${idPrefix}-notes-help`} className={styles.fieldHelp}>Hasta 2.000 caracteres. No incluyas datos personales; este texto no se incorpora a solicitudes reales.</p>
  </div>;
}

function SummaryRows({ rows, review = false, notesLabel }: { rows: readonly GuidedSummaryRow[]; review?: boolean; notesLabel: string }) {
  return <dl className={review ? styles.reviewList : styles.summaryList}>
    {rows.map(({ label, value, pending, scrollable }) => <div className={styles.summaryRow} key={label}>
      <dt>{label}</dt>
      <dd className={`${pending ? styles.pending : ''} ${scrollable ? styles.longText : ''}`} tabIndex={scrollable ? 0 : undefined} role={scrollable ? 'region' : undefined} aria-label={scrollable ? notesLabel : undefined}>{value}</dd>
    </div>)}
  </dl>;
}

export function GuidedSummary({ idPrefix, className, rows, notesLabel = 'Observaciones de la demostración' }: {
  idPrefix: string; className: string; rows: readonly GuidedSummaryRow[]; notesLabel?: string;
}) {
  return <aside id={`${idPrefix}-summary`} tabIndex={-1} className={`internal-surface ${className} ${styles.summary}`} aria-labelledby={`${idPrefix}-summary-title`}>
    <h2 id={`${idPrefix}-summary-title`}>Tu selección de ejemplo</h2>
    <p>Se actualiza mientras probás las opciones.</p>
    <SummaryRows rows={rows} notesLabel={notesLabel} />
    <p className={styles.footnote}>Precio, disponibilidad y condiciones: a confirmar con el equipo. La demostración no calcula presupuestos.</p>
  </aside>;
}

export function GuidedReview({ idPrefix, className, rows, titleRef, onEdit, onReset, notesLabel = 'Observaciones de la demostración' }: {
  idPrefix: string; className: string; rows: readonly GuidedSummaryRow[]; titleRef: Ref<HTMLHeadingElement>;
  onEdit: () => void; onReset: () => void; notesLabel?: string;
}) {
  return <section className={`internal-surface ${className} ${styles.review}`} aria-labelledby={`${idPrefix}-review-title`}>
    <h2 id={`${idPrefix}-review-title`} ref={titleRef} tabIndex={-1}>Revisá tu selección de ejemplo</h2>
    <p>Estas son las decisiones que tomaste durante la demostración.</p>
    <SummaryRows rows={rows} review notesLabel={notesLabel} />
    <p className={styles.notice}><strong>Fin de la demostración.</strong> No se agregó nada a Mi consulta, no se guardó información y no se envió una solicitud. Todas las opciones siguen pendientes de validación comercial.</p>
    <div className={styles.actions}><Button id={`${idPrefix}-edit`} variant="solid" showArrow={false} onClick={onEdit}>Volver a editar</Button><button id={`${idPrefix}-reset-review`} className={styles.smallLink} type="button" onClick={onReset}>Reiniciar demostración</button></div>
  </section>;
}
