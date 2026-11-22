'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Button from './Button';
import pilot from './RemerasProductDetail.module.css';
import styles from './RemerasDevelopmentPreview.module.css';

// F03.1B: opciones copiadas de F02. Este módulo solo se importa en desarrollo.
// No depende de ConsultationProvider ni escribe selecciones en R4.
type Field = 'modelo' | 'material' | 'color' | 'tecnica' | 'ubicacion';
type Choice = readonly [value: string, label: string, help: string, color?: string];
const advice: Choice = ['asesoramiento', 'Necesito asesoramiento', 'Podés seguir sin decidir esto ahora.'];
const fields: Record<Field, { label: string; options: readonly Choice[] }> = {
  modelo: { label: 'Modelo', options: [['recto', 'Corte recto', 'Ejemplo de silueta de líneas rectas.'], ['amplio', 'Corte amplio', 'Ejemplo de silueta más holgada.'], advice] },
  material: { label: 'Material', options: [['algodon', 'Algodón', 'Explorá una alternativa de fibra natural.'], ['poliester', 'Poliéster', 'Explorá una alternativa de fibra sintética.'], advice] },
  color: { label: 'Color de referencia', options: [['azul', 'Azul marino', '', '#07134b'], ['blanco', 'Blanco', '', '#fff'], ['negro', 'Negro', '', '#20222a'], advice] },
  tecnica: { label: '¿Cómo imaginás aplicar tu diseño?', options: [['estampado', 'Estampado', 'Como referencia, un diseño impreso sobre la prenda.'], ['bordado', 'Bordado', 'Como referencia, un diseño realizado con hilos.'], advice] },
  ubicacion: { label: 'Ubicación del diseño', options: [['frente', 'Frente', 'Referencia para la parte delantera.'], ['espalda', 'Espalda', 'Referencia para la parte trasera.'], advice] },
};
const steps = ['Modelo y material', 'Talles y cantidades', 'Personalización'];
const stepTitles = ['Elegí una base para tu idea', '¿Cómo repartirías las prendas?', 'Dale forma a la personalización'];
const stepHelp = ['Explorá alternativas de ejemplo. Si todavía no sabés cuál elegir, podés pedir asesoramiento.', 'Probá distintas cantidades por talle. No es una tabla de medidas ni confirma talles disponibles.', 'Elegí referencias para conversar. No se verifica la compatibilidad entre material y técnica en este prototipo.'];
const stages: Field[][] = [['modelo', 'material'], [], ['color', 'tecnica', 'ubicacion']];
const sizes = ['S', 'M', 'L', 'XL'] as const;
type Size = typeof sizes[number];
interface DemoState {
  answers: Partial<Record<Field, string>>;
  sizes: Record<Size, string>;
  sizeAdvice: boolean;
  quantityUnknown: boolean;
  total: string;
  notes: string;
}
const initialState = (): DemoState => ({ answers: {}, sizes: { S: '0', M: '0', L: '0', XL: '0' }, sizeAdvice: false, quantityUnknown: false, total: '', notes: '' });
const positiveInteger = (value: string) => value.trim() !== '' && Number.isSafeInteger(Number(value)) && Number(value) > 0;
const format = (value: number) => value.toLocaleString('es-AR');
type DemoError = { message: string; id: string };
type Row = { label: string; value: string; pending?: boolean; scrollable?: boolean };

export default function RemerasDevelopmentPreview({ gallery, commercialSelection, productName }: {
  gallery: ReactNode;
  commercialSelection: ReactNode;
  productName: string;
}) {
  const [demo, setDemo] = useState(false);

  return <>
    <div className={styles.modeBar}>
      <div><strong>Prueba local de la ficha</strong><p>Alterná entre la consulta comercial y la experiencia completa de F02.</p></div>
      <Button id="f02-demo-toggle" showArrow={false} aria-pressed={demo} aria-controls="f02-demo-view" onClick={() => {
        setDemo(!demo);
        requestAnimationFrame(() => {
          const target = !demo
            ? document.getElementById('f02-demo-title') ?? document.getElementById('f02-demo-review-title')
            : document.getElementById('cantidad-remeras-personalizadas');
          target?.focus();
        });
      }}>{demo ? 'Volver a consulta comercial' : 'Probar experiencia F02'}</Button>
    </div>
    <div hidden={!demo} className={styles.warning} role="note">
      <strong>Demostración — opciones pendientes de confirmación comercial</strong>
      <p>Las selecciones son ilustrativas, no modifican las fotografías y no se guardan ni se envían. No se incorporan a Mi consulta.</p>
    </div>
    <div className={pilot.workspace}>
      {gallery}
      {/* Mantener montada la consulta conserva su borrador al alternar de modo. */}
      <div className={styles.contents} hidden={demo}>{commercialSelection}</div>
      <div id="f02-demo-view" className={styles.contents} hidden={!demo}>
        <RemerasDemo productName={productName} />
      </div>
    </div>
  </>;
}

function SummaryRows({ rows, review = false }: { rows: Row[]; review?: boolean }) {
  return <dl className={review ? styles.reviewList : styles.summaryList}>
    {rows.map(({ label, value, pending, scrollable }) => <div className={styles.summaryRow} key={label}>
      <dt>{label}</dt>
      <dd className={`${pending ? styles.pending : ''} ${scrollable ? styles.longText : ''}`} tabIndex={scrollable ? 0 : undefined} role={scrollable ? 'region' : undefined} aria-label={scrollable ? 'Observaciones de la demostración' : undefined}>{value}</dd>
    </div>)}
  </dl>;
}

function RemerasDemo({ productName }: { productName: string }) {
  const [selection, setSelection] = useState(initialState);
  const [step, setStep] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const [error, setError] = useState<DemoError | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const reviewTitle = useRef<HTMLHeadingElement>(null);
  const total = sizes.reduce((sum, size) => sum + Number(selection.sizes[size]), 0);
  const validSizes = sizes.every((size) => selection.sizes[size].trim() !== '' && Number.isSafeInteger(Number(selection.sizes[size])) && Number(selection.sizes[size]) >= 0) && Number.isSafeInteger(total);

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
    if (missing) return { message: `Elegí una opción en «${fields[missing].label}» o indicá que necesitás ayuda.`, id: `f02-demo-${missing}-${fields[missing].options[0][0]}` };
    if (index !== 1) return null;
    if (!selection.sizeAdvice) {
      if (!validSizes || total <= 0) {
        const invalid = sizes.find((size) => selection.sizes[size].trim() === '' || !Number.isSafeInteger(Number(selection.sizes[size])) || Number(selection.sizes[size]) < 0) ?? 'S';
        return { message: 'Indicá al menos una prenda con cantidades enteras desde cero, o marcá que necesitás ayuda con los talles.', id: `f02-demo-size-${invalid}` };
      }
    } else if (!selection.quantityUnknown && !positiveInteger(selection.total)) {
      return { message: 'Indicá una cantidad entera mayor que cero, o marcá «Todavía no sé la cantidad». Esto no define un mínimo comercial.', id: 'f02-demo-total-quantity' };
    }
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
    requestAnimationFrame(() => document.getElementById('f02-demo-title')?.focus());
  }

  function choice(field: Field) {
    return <fieldset className={styles.fieldset} key={field}>
      <legend>{fields[field].label}</legend>
      <div className={styles.choiceGrid}>
        {fields[field].options.map(([value, label, help, color]) => {
          const id = `f02-demo-${field}-${value}`;
          return <label key={value} className={`${styles.choice} ${value === 'asesoramiento' ? styles.advice : ''}`}>
            <input id={id} type="radio" name={`f02-demo-${field}`} value={value} checked={selection.answers[field] === value} onChange={() => changeChoice(field, value)} aria-invalid={error?.id === id || undefined} aria-describedby={error?.id === id ? 'f02-demo-error' : undefined} />
            {color && <span className={styles.colorDot} style={{ backgroundColor: color }} aria-hidden="true" />}
            <span><strong>{label}</strong>{help && <small>{help}</small>}</span>
          </label>;
        })}
      </div>
    </fieldset>;
  }

  const chosen = (field: Field): Row => {
    const option = fields[field].options.find(([value]) => value === selection.answers[field]);
    return { label: fields[field].label, value: option?.[1] ?? 'A elegir', pending: !option };
  };
  const quantity = selection.sizeAdvice ? selection.quantityUnknown ? 'Por definir con asesoramiento' : positiveInteger(selection.total) ? `${format(Number(selection.total))} prendas` : 'A indicar' : validSizes && total > 0 ? `${format(total)} prendas` : 'A indicar';
  const distribution = selection.sizeAdvice ? 'Necesito asesoramiento' : validSizes && total > 0 ? sizes.filter((size) => Number(selection.sizes[size]) > 0).map((size) => `${size}: ${format(Number(selection.sizes[size]))}`).join(' · ') : 'Sin repartir';
  const adviceRequested = (Object.keys(fields) as Field[]).filter((field) => selection.answers[field] === 'asesoramiento').map((field) => fields[field].label);
  if (selection.sizeAdvice) adviceRequested.push('Talles');
  if (selection.sizeAdvice && selection.quantityUnknown) adviceRequested.push('Cantidad');
  const rows: Row[] = [
    { label: 'Producto', value: productName }, chosen('modelo'), chosen('material'),
    { label: 'Total de unidades', value: quantity, pending: quantity === 'A indicar' },
    { label: 'Talles y cantidades', value: distribution, pending: distribution === 'Sin repartir' },
    chosen('color'), chosen('tecnica'), chosen('ubicacion'),
    { label: 'Asesoramiento solicitado', value: adviceRequested.join(' · ') || 'Sin solicitar' },
    { label: 'Observaciones', value: selection.notes || 'Sin observaciones.', scrollable: !!selection.notes },
    { label: 'Cantidad mínima', value: 'A confirmar', pending: true },
  ];

  return <>
    {reviewed ? <section className={`internal-surface ${pilot.formPanel} ${styles.review}`} aria-labelledby="f02-demo-review-title">
      <h2 id="f02-demo-review-title" ref={reviewTitle} tabIndex={-1}>Revisá tu selección de ejemplo</h2>
      <p>Estas son las decisiones que tomaste durante la demostración.</p>
      <SummaryRows rows={rows} review />
      <p className={styles.notice}><strong>Fin de la demostración.</strong> No se agregó nada a Mi consulta, no se guardó información y no se envió una solicitud. Todas las opciones siguen pendientes de validación comercial.</p>
      <div className={styles.actions}><Button id="f02-demo-edit" variant="solid" showArrow={false} onClick={() => moveStep(2)}>Volver a editar</Button><button id="f02-demo-reset-review" className={styles.smallLink} type="button" onClick={reset}>Reiniciar demostración</button></div>
    </section> : <>
      <section className={`internal-surface ${pilot.formPanel} ${styles.configurator}`} aria-labelledby="f02-demo-title">
        <div className={styles.configTop}><h2 id="f02-demo-title" tabIndex={-1}>Armá tu ejemplo</h2><button id="f02-demo-reset" type="button" className={styles.smallLink} onClick={reset}>Reiniciar</button></div>
        <ol className={styles.stepNav} aria-label="Pasos de selección de ejemplo">
          {steps.map((label, index) => <li key={label}><button type="button" aria-current={step === index ? 'step' : undefined} aria-controls="f02-demo-step-content" onClick={() => moveStep(index)}><span>Paso {index + 1}</span>{label}</button></li>)}
        </ol>
        <div id="f02-demo-step-content">
          <h3 ref={stepTitle} tabIndex={-1} className={styles.stepTitle}>{stepTitles[step]}</h3>
          <p className={styles.stepHelp}>{stepHelp[step]}</p>
          {error && <p id="f02-demo-error" role="alert" className={styles.error}>{error.message}</p>}
          {step === 1 ? <fieldset className={styles.fieldset}>
            <legend>Talles de ejemplo</legend>
            <label className={styles.checkLine}><input id="f02-demo-size-advice" type="checkbox" checked={selection.sizeAdvice} onChange={(event) => patch({ sizeAdvice: event.target.checked })} /><span>Necesito ayuda para definir los talles</span></label>
            {selection.sizeAdvice ? <>
              <label className={styles.checkLine}><input id="f02-demo-quantity-unknown" type="checkbox" checked={selection.quantityUnknown} onChange={(event) => patch({ quantityUnknown: event.target.checked })} /><span>Todavía no sé la cantidad</span></label>
              {!selection.quantityUnknown && <div className={styles.formField}>
                <label htmlFor="f02-demo-total-quantity">Cantidad total aproximada</label>
                <input id="f02-demo-total-quantity" type="number" min="1" step="1" max={Number.MAX_SAFE_INTEGER} inputMode="numeric" value={selection.total} onChange={(event) => patch({ total: event.target.value })} aria-invalid={error?.id === 'f02-demo-total-quantity' || undefined} aria-describedby={`f02-demo-quantity-help${error?.id === 'f02-demo-total-quantity' ? ' f02-demo-error' : ''}`} />
              </div>}
              <p id="f02-demo-quantity-help" className={styles.fieldHelp}>No hay una cantidad mínima comercial definida en este ejemplo.</p>
            </> : <>
              <div className={styles.quantityGrid}>{sizes.map((size) => <div className={styles.quantityCell} key={size}>
                <label htmlFor={`f02-demo-size-${size}`}>{size}<span className="sr-only">, cantidad de ejemplo</span></label>
                <input id={`f02-demo-size-${size}`} type="number" min="0" step="1" max={Number.MAX_SAFE_INTEGER} inputMode="numeric" value={selection.sizes[size]} onChange={(event) => { const value = event.target.value; setSelection((previous) => ({ ...previous, sizes: { ...previous.sizes, [size]: value } })); setError(null); }} aria-invalid={error?.id === `f02-demo-size-${size}` || undefined} aria-describedby={`f02-demo-sizes-help${error?.id === `f02-demo-size-${size}` ? ' f02-demo-error' : ''}`} />
              </div>)}</div>
              <div className={styles.totalLine}><span>Total de prendas</span><output id="f02-demo-size-total" aria-live="polite">{validSizes ? format(total) : 'Revisá las cantidades'}</output></div>
            </>}
            <details className={styles.contextHelp}><summary>¿Qué pasa si todavía no conozco los talles?</summary><p>Marcá la opción de ayuda y, si la sabés, indicá una cantidad total. Una futura tabla de medidas deberá validarse para cada modelo; este ejemplo no usa equivalencias de talles.</p></details>
            <p id="f02-demo-sizes-help" className={styles.fieldHelp}>S, M, L y XL son etiquetas de muestra. No representan una oferta ni una tabla de talles confirmada.</p>
          </fieldset> : stages[step].map(choice)}
          {step === 2 && <>
            <div className={styles.formField}><label htmlFor="f02-demo-notes">Observaciones adicionales del ejemplo</label><textarea id="f02-demo-notes" rows={3} maxLength={2000} value={selection.notes} onChange={(event) => patch({ notes: event.target.value })} aria-describedby="f02-demo-notes-help" /><p id="f02-demo-notes-help" className={styles.fieldHelp}>Hasta 2.000 caracteres. No incluyas datos personales; este texto no se incorpora a solicitudes reales.</p></div>
            <p className={styles.notice}>Son referencias para evaluar la experiencia. No confirman técnicas, colores ni terminaciones disponibles.</p>
          </>}
        </div>
        <div className={styles.actions}>
          {step > 0 && <Button id="f02-demo-back" showArrow={false} onClick={() => moveStep(step - 1)}>Anterior</Button>}
          <Button id="f02-demo-next" variant="solid" onClick={next}>{step === 2 ? 'Revisar selección de ejemplo' : 'Continuar'}</Button>
        </div>
        <a className={styles.summaryLink} href="#f02-demo-summary">Ver mi resumen de ejemplo</a>
      </section>
      <aside id="f02-demo-summary" tabIndex={-1} className={`internal-surface ${pilot.selectionSummary} ${styles.summary}`} aria-labelledby="f02-demo-summary-title">
        <h2 id="f02-demo-summary-title">Tu selección de ejemplo</h2>
        <p>Se actualiza mientras probás las opciones.</p>
        <SummaryRows rows={rows} />
        <p className={styles.footnote}>Precio, disponibilidad y condiciones: a confirmar con el equipo. La demostración no calcula presupuestos.</p>
      </aside>
    </>}
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </>;
}
