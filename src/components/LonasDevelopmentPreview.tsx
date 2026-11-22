'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Button from './Button';
import pilot from './RemerasProductDetail.module.css';
import styles from './RemerasDevelopmentPreview.module.css';
import local from './LonasDevelopmentPreview.module.css';

// F03.2: alternativas originales de F02, importadas exclusivamente en desarrollo.
// Este módulo no importa el estado de consultas ni escribe en almacenamiento.
type Field = 'material' | 'uso' | 'terminacion' | 'diseno';
type Choice = readonly [value: string, label: string, help: string];
const advice: Choice = ['asesoramiento', 'Necesito asesoramiento', 'Podés seguir sin decidir esto ahora.'];
const fields: Record<Field, { label: string; options: readonly Choice[] }> = {
  material: { label: 'Material de referencia', options: [
    ['frontlit', 'Frontlit', 'Referencia: superficie continua para impresión frontal.'],
    ['blackout', 'Blackout', 'Referencia: una lona que busca bloquear el paso de luz.'],
    ['mesh', 'Mesh', 'Referencia: una superficie con pequeños orificios.'], advice,
  ] },
  uso: { label: '¿Dónde imaginás usarla?', options: [
    ['interior', 'Interior', 'Un espacio bajo techo.'],
    ['exterior', 'Exterior', 'Un espacio al aire libre.'], advice,
  ] },
  terminacion: { label: 'Terminación de referencia', options: [
    ['ojales', 'Con ojales', 'Pequeñas aberturas para pensar una forma de sujeción.'],
    ['sin-ojales', 'Sin ojales', 'Sin esas aberturas en el esquema de ejemplo.'], advice,
  ] },
  diseno: { label: '¿Cómo está tu diseño?', options: [
    ['preparado', 'Tengo una idea o diseño', 'Quiero conversar sobre cómo adaptarlo.'],
    ['ayuda', 'Necesito ayuda para definirlo', 'Quiero orientación antes de avanzar.'],
  ] },
};
const steps = ['Material y uso', 'Medidas y cantidad', 'Terminaciones'];
const stepTitles = ['Contanos qué tenés en mente', 'Dale una medida a tu idea', 'Pensá cómo se colocaría'];
const stepHelp = [
  'Los nombres de materiales existen en el catálogo. Su selección aquí es demostrativa y necesita validación.',
  'Usá centímetros. Si no sabés las medidas finales, podés dejar esa decisión para una conversación.',
  'Probá cómo pedirías una terminación y ayuda con el diseño. Las posibilidades reales se deben confirmar.',
];
const stages: Field[][] = [['material', 'uso'], [], ['terminacion', 'diseno']];
interface DemoState {
  answers: Partial<Record<Field, string>>;
  width: string;
  height: string;
  measureAdvice: boolean;
  total: string;
  quantityUnknown: boolean;
  notes: string;
}
const initialState = (): DemoState => ({ answers: {}, width: '', height: '', measureAdvice: false, total: '', quantityUnknown: false, notes: '' });
const numeric = (value: string) => Number(value.trim().replace(',', '.'));
const validMeasure = (value: string) => /^\d+(?:[.,]\d{1,2})?$/.test(value.trim()) && Number.isFinite(numeric(value)) && numeric(value) > 0;
const positiveInteger = (value: string) => value.trim() !== '' && Number.isSafeInteger(Number(value)) && Number(value) > 0;
const format = (value: number) => value.toLocaleString('es-AR');
type DemoError = { id: string; message: string };
type Row = { label: string; value: string; pending?: boolean; scrollable?: boolean };

function SummaryRows({ rows, review = false }: { rows: Row[]; review?: boolean }) {
  return <dl className={review ? styles.reviewList : styles.summaryList}>
    {rows.map(({ label, value, pending, scrollable }) => <div className={styles.summaryRow} key={label}>
      <dt>{label}</dt>
      <dd className={`${pending ? styles.pending : ''} ${scrollable ? styles.longText : ''}`} tabIndex={scrollable ? 0 : undefined} role={scrollable ? 'region' : undefined} aria-label={scrollable ? 'Observaciones de la demostración de Lonas' : undefined}>{value}</dd>
    </div>)}
  </dl>;
}

export default function LonasDevelopmentPreview({ gallery, commercialInfo, productName, description, hasPhotos }: {
  gallery: ReactNode;
  commercialInfo: ReactNode;
  productName: string;
  description?: string;
  hasPhotos: boolean;
}) {
  const [demo, setDemo] = useState(false);
  const [selection, setSelection] = useState(initialState);
  const [step, setStep] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const [error, setError] = useState<DemoError | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const reviewTitle = useRef<HTMLHeadingElement>(null);

  function patch(values: Partial<DemoState>) {
    setSelection((previous) => ({ ...previous, ...values }));
    setError(null);
  }

  function changeChoice(field: Field, value: string) {
    setSelection((previous) => ({ ...previous, answers: { ...previous.answers, [field]: value } }));
    setError(null);
    setAnnouncement(`${fields[field].label}: ${fields[field].options.find(([key]) => key === value)?.[1]}. Resumen actualizado.`);
  }

  function moveStep(index: number) {
    setStep(index);
    setReviewed(false);
    setError(null);
    setAnnouncement(`Paso ${index + 1}: ${steps[index]}.`);
    requestAnimationFrame(() => { stepTitle.current?.focus({ preventScroll: true }); stepTitle.current?.scrollIntoView({ block: 'start' }); });
  }

  function errorFor(index: number): DemoError | null {
    const missing = stages[index].find((field) => !selection.answers[field]);
    if (missing) return { message: `Elegí una opción en «${fields[missing].label}» o indicá que necesitás ayuda.`, id: `lonas-demo-${missing}-${fields[missing].options[0][0]}` };
    if (index !== 1) return null;
    if (!selection.measureAdvice) {
      if (!validMeasure(selection.width)) return { message: 'Indicá un ancho mayor que cero en centímetros, con hasta dos decimales, o pedí ayuda con las medidas.', id: 'lonas-demo-width' };
      if (!validMeasure(selection.height)) return { message: 'Indicá un alto mayor que cero en centímetros, con hasta dos decimales, o pedí ayuda con las medidas.', id: 'lonas-demo-height' };
    }
    if (!selection.quantityUnknown && !positiveInteger(selection.total)) return { message: 'Indicá una cantidad entera mayor que cero, o marcá «Todavía no sé la cantidad». Esto no define un mínimo comercial.', id: 'lonas-demo-total' };
    return null;
  }

  function showError(index: number, problem: DemoError) {
    setStep(index);
    setReviewed(false);
    setError(problem);
    requestAnimationFrame(() => document.getElementById(problem.id)?.focus());
  }

  function next() {
    if (step < 2) {
      const problem = errorFor(step);
      if (problem) showError(step, problem);
      else moveStep(step + 1);
      return;
    }
    for (let index = 0; index < steps.length; index++) {
      const problem = errorFor(index);
      if (problem) { showError(index, problem); return; }
    }
    setError(null);
    setReviewed(true);
    setAnnouncement('Selección de ejemplo lista para revisar. No se guardó ni se envió.');
    requestAnimationFrame(() => { reviewTitle.current?.focus(); reviewTitle.current?.scrollIntoView({ block: 'start' }); });
  }

  function reset() {
    setSelection(initialState());
    setStep(0);
    setReviewed(false);
    setError(null);
    setAnnouncement('Demostración reiniciada. La consulta comercial no cambió.');
    requestAnimationFrame(() => document.getElementById('lonas-demo-title')?.focus());
  }

  function choice(field: Field) {
    return <fieldset className={styles.fieldset} key={field}>
      <legend>{fields[field].label}</legend>
      <div className={styles.choiceGrid}>
        {fields[field].options.map(([value, label, help]) => {
          const id = `lonas-demo-${field}-${value}`;
          return <label key={value} className={`${styles.choice} ${value === 'asesoramiento' ? styles.advice : ''}`}>
            <input id={id} type="radio" name={`lonas-demo-${field}`} value={value} checked={selection.answers[field] === value} onChange={() => changeChoice(field, value)} aria-invalid={error?.id === id || undefined} aria-describedby={error?.id === id ? 'lonas-demo-error' : undefined} />
            <span><strong>{label}</strong><small>{help}</small></span>
          </label>;
        })}
      </div>
    </fieldset>;
  }

  const chosen = (field: Field): Row => {
    const option = fields[field].options.find(([value]) => value === selection.answers[field]);
    return { label: fields[field].label, value: option?.[1] ?? 'A elegir', pending: !option };
  };
  const measuresValid = validMeasure(selection.width) && validMeasure(selection.height);
  const measures = selection.measureAdvice ? 'Necesito asesoramiento' : measuresValid ? `${format(numeric(selection.width))} × ${format(numeric(selection.height))} cm` : 'A indicar';
  const quantity = selection.quantityUnknown ? 'Por definir con asesoramiento' : positiveInteger(selection.total) ? `${format(Number(selection.total))} ${Number(selection.total) === 1 ? 'pieza' : 'piezas'}` : 'A indicar';
  const adviceRequested = (Object.keys(fields) as Field[]).filter((field) => selection.answers[field] === 'asesoramiento').map((field) => fields[field].label);
  if (selection.measureAdvice) adviceRequested.push('Medidas');
  if (selection.quantityUnknown) adviceRequested.push('Cantidad');
  if (selection.answers.diseno === 'ayuda') adviceRequested.push('Diseño');
  const rows: Row[] = [
    { label: 'Producto', value: productName }, chosen('material'), chosen('uso'),
    { label: 'Medidas', value: measures, pending: measures === 'A indicar' },
    { label: 'Cantidad', value: quantity, pending: quantity === 'A indicar' },
    chosen('terminacion'), chosen('diseno'),
    { label: 'Asesoramiento solicitado', value: adviceRequested.join(' · ') || 'Sin solicitar' },
    { label: 'Observaciones', value: selection.notes || 'Sin observaciones.', scrollable: !!selection.notes },
    { label: 'Cantidad mínima', value: 'A confirmar', pending: true },
  ];
  const ratio = measuresValid && !selection.measureAdvice ? Math.max(.55, Math.min(1.85, numeric(selection.width) / numeric(selection.height))) : 1.5;
  const dimension = (value: string, label: string) => !selection.measureAdvice && validMeasure(value) ? `${format(numeric(value))} cm` : label;

  return <div className={`${local.preview} ${demo ? local.active : ''}`}>
    <div className={styles.modeBar}>
      <div><strong>Prueba local de la ficha</strong><p>Alterná entre la consulta comercial y la experiencia completa de F02.</p></div>
      <Button id="lonas-demo-toggle" showArrow={false} aria-pressed={demo} aria-controls="lonas-demo-view" onClick={() => {
        setDemo(!demo);
        requestAnimationFrame(() => document.getElementById(!demo ? reviewed ? 'lonas-demo-review-title' : 'lonas-demo-title' : 'cantidad-lonas')?.focus());
      }}>{demo ? 'Volver a consulta comercial' : 'Probar experiencia F02'}</Button>
    </div>
    <header hidden={!demo} className={local.heading}>
      <h1>{productName}</h1>
      {description && <p>{description}</p>}
    </header>
    <div hidden={!demo} className={styles.warning} role="note">
      <strong>Demostración — opciones pendientes de confirmación comercial</strong>
      <p>Las selecciones son ilustrativas, no modifican las fotografías y no se guardan ni se envían. No se incorporan a Mi consulta.</p>
    </div>
    <div className={demo ? pilot.workspace : 'grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24'}>
      <div className={demo ? pilot.visualColumn : styles.contents}>
        <div hidden={demo && !hasPhotos} className={demo ? pilot.gallery : styles.contents}>{gallery}</div>
        {demo && <section className={`internal-surface ${local.scheme}`} aria-labelledby="lonas-demo-scheme-title">
          <h2 id="lonas-demo-scheme-title">Una referencia para tu idea</h2>
          <div className={local.schemeStage}>
            <div id="lonas-demo-scheme" className={local.board} style={{ aspectRatio: ratio }} role="img" aria-label={`Esquema orientativo de una lona. ${measures}. ${selection.answers.terminacion === 'ojales' ? 'Con ojales de referencia.' : ''}`}>
              <span className={local.widthLabel}>{dimension(selection.width, 'Ancho')}</span>
              <span className={local.heightLabel}>{dimension(selection.height, 'Alto')}</span>
              <span className={local.boardText}>Tu diseño<br /><small>Espacio de referencia</small></span>
              {selection.answers.terminacion === 'ojales' && [0, 1, 2, 3].map((corner) => <i key={corner} className={local.eyelet} aria-hidden="true" />)}
            </div>
          </div>
          <p>Esquema orientativo · No es una fotografía</p>
          <details className={styles.contextHelp}><summary>Cómo leer este esquema</summary><p>El esquema cambia de proporción según las medidas que escribís. No representa una escala exacta ni una terminación comercial confirmada.</p></details>
        </section>}
      </div>
      {/* Nunca desmontar la selección comercial: conserva cantidad, notas y conflictos. */}
      <div className={styles.contents} hidden={demo}>{commercialInfo}</div>
      <div id="lonas-demo-view" className={styles.contents} hidden={!demo}>
        {reviewed ? <section className={`internal-surface ${pilot.formPanel} ${local.panel} ${styles.review}`} aria-labelledby="lonas-demo-review-title">
          <h2 id="lonas-demo-review-title" ref={reviewTitle} tabIndex={-1}>Revisá tu selección de ejemplo</h2>
          <p>Estas son las decisiones que tomaste durante la demostración.</p>
          <SummaryRows rows={rows} review />
          <p className={styles.notice}><strong>Fin de la demostración.</strong> No se agregó nada a Mi consulta, no se guardó información y no se envió una solicitud. Todas las opciones siguen pendientes de validación comercial.</p>
          <div className={styles.actions}><Button id="lonas-demo-edit" variant="solid" showArrow={false} onClick={() => moveStep(2)}>Volver a editar</Button><button id="lonas-demo-reset-review" className={styles.smallLink} type="button" onClick={reset}>Reiniciar demostración</button></div>
        </section> : <>
          <section className={`internal-surface ${pilot.formPanel} ${local.panel}`} aria-labelledby="lonas-demo-title">
            <div className={styles.configTop}><h2 id="lonas-demo-title" tabIndex={-1}>Armá tu ejemplo</h2><button id="lonas-demo-reset" type="button" className={styles.smallLink} onClick={reset}>Reiniciar</button></div>
            <ol className={styles.stepNav} aria-label="Pasos de selección de ejemplo de Lonas">
              {steps.map((label, index) => <li key={label}><button type="button" aria-current={step === index ? 'step' : undefined} aria-controls="lonas-demo-step-content" onClick={() => moveStep(index)}><span>Paso {index + 1}</span>{label}</button></li>)}
            </ol>
            <div id="lonas-demo-step-content">
              <h3 ref={stepTitle} tabIndex={-1} className={styles.stepTitle}>{stepTitles[step]}</h3>
              <p className={styles.stepHelp}>{stepHelp[step]}</p>
              {error && <p id="lonas-demo-error" className={styles.error} role="alert">{error.message}</p>}
              {step === 1 ? <>
                <fieldset className={styles.fieldset}>
                  <legend>Medidas de referencia</legend>
                  <label className={styles.checkLine}><input id="lonas-demo-measure-advice" type="checkbox" checked={selection.measureAdvice} onChange={(event) => patch({ measureAdvice: event.target.checked })} /><span>Necesito ayuda para definir las medidas</span></label>
                  {!selection.measureAdvice && <div className={local.measureGrid}>{(['width', 'height'] as const).map((axis) => <div className={styles.formField} key={axis}>
                    <label htmlFor={`lonas-demo-${axis}`}>{axis === 'width' ? 'Ancho' : 'Alto'} <span>(cm)</span></label>
                    <input id={`lonas-demo-${axis}`} type="text" inputMode="decimal" maxLength={12} value={selection[axis]} onChange={(event) => patch({ [axis]: event.target.value })} aria-invalid={error?.id === `lonas-demo-${axis}` || undefined} aria-describedby={`lonas-demo-measure-help${error?.id === `lonas-demo-${axis}` ? ' lonas-demo-error' : ''}`} />
                  </div>)}</div>}
                  <p id="lonas-demo-measure-help" className={styles.fieldHelp}>Medidas en centímetros. Podés usar coma o punto y hasta dos decimales. No se calculan precios ni límites de fabricación.</p>
                </fieldset>
                <fieldset className={styles.fieldset}>
                  <legend>Cantidad de piezas</legend>
                  <label className={styles.checkLine}><input id="lonas-demo-quantity-unknown" type="checkbox" checked={selection.quantityUnknown} onChange={(event) => patch({ quantityUnknown: event.target.checked })} /><span>Todavía no sé la cantidad</span></label>
                  {!selection.quantityUnknown && <div className={styles.formField}>
                    <label htmlFor="lonas-demo-total">Cantidad de piezas</label>
                    <input id="lonas-demo-total" type="number" inputMode="numeric" min="1" step="1" max={Number.MAX_SAFE_INTEGER} value={selection.total} onChange={(event) => patch({ total: event.target.value })} aria-invalid={error?.id === 'lonas-demo-total' || undefined} aria-describedby={`lonas-demo-quantity-help${error?.id === 'lonas-demo-total' ? ' lonas-demo-error' : ''}`} />
                  </div>}
                  <p id="lonas-demo-quantity-help" className={styles.fieldHelp}>No hay una cantidad mínima comercial definida en este ejemplo.</p>
                </fieldset>
              </> : stages[step].map(choice)}
              {step === 2 && <>
                <div className={styles.formField}><label htmlFor="lonas-demo-notes">Observaciones adicionales del ejemplo</label><textarea id="lonas-demo-notes" rows={3} maxLength={2000} value={selection.notes} onChange={(event) => patch({ notes: event.target.value })} aria-describedby="lonas-demo-notes-help" /><p id="lonas-demo-notes-help" className={styles.fieldHelp}>Hasta 2.000 caracteres. No incluyas datos personales; este texto no se incorpora a solicitudes reales.</p></div>
                <p className={styles.notice}>Son referencias para evaluar la experiencia. No confirman materiales, usos ni terminaciones disponibles.</p>
              </>}
            </div>
            <div className={styles.actions}>
              {step > 0 && <Button id="lonas-demo-back" showArrow={false} onClick={() => moveStep(step - 1)}>Anterior</Button>}
              <Button id="lonas-demo-next" variant="solid" onClick={next}>{step === 2 ? 'Revisar selección de ejemplo' : 'Continuar'}</Button>
            </div>
            <a className={styles.summaryLink} href="#lonas-demo-summary">Ver mi resumen de ejemplo</a>
          </section>
          <aside id="lonas-demo-summary" tabIndex={-1} className={`internal-surface ${pilot.selectionSummary} ${local.panel} ${styles.summary}`} aria-labelledby="lonas-demo-summary-title">
            <h2 id="lonas-demo-summary-title">Tu selección de ejemplo</h2>
            <p>Se actualiza mientras probás las opciones.</p>
            <SummaryRows rows={rows} />
            <p className={styles.footnote}>Precio, disponibilidad y condiciones: a confirmar con el equipo. La demostración no calcula presupuestos.</p>
          </aside>
        </>}
      </div>
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </div>;
}
