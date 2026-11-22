'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import pilot from './RemerasProductDetail.module.css';
import styles from './guided/GuidedPreview.module.css';
import {
  GuidedModeBar, GuidedDemoNotice, GuidedChoiceField, GuidedConfigurator,
  GuidedNotes, GuidedSummary, GuidedReview,
  type GuidedChoiceOption as Choice, type GuidedSummaryRow as Row,
} from './guided/GuidedPreview';
import { useGuidedSteps, type GuidedStepError as DemoError } from './guided/useGuidedSteps';

// F03.1B: opciones copiadas de F02. Este módulo solo se importa en desarrollo.
// No depende de ConsultationProvider ni escribe selecciones en R4.
type Field = 'modelo' | 'material' | 'color' | 'tecnica' | 'ubicacion';
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

export default function RemerasDevelopmentPreview({ gallery, commercialSelection, productName }: {
  gallery: ReactNode;
  commercialSelection: ReactNode;
  productName: string;
}) {
  const [demo, setDemo] = useState(false);

  return <>
    <GuidedModeBar idPrefix="f02-demo" demo={demo} onToggle={() => {
      setDemo(!demo);
      requestAnimationFrame(() => {
        const target = !demo
          ? document.getElementById('f02-demo-title') ?? document.getElementById('f02-demo-review-title')
          : document.getElementById('cantidad-remeras-personalizadas');
        target?.focus();
      });
    }} />
    <GuidedDemoNotice visible={demo} />
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

function RemerasDemo({ productName }: { productName: string }) {
  const [selection, setSelection] = useState(initialState);
  const total = sizes.reduce((sum, size) => sum + Number(selection.sizes[size]), 0);
  const validSizes = sizes.every((size) => selection.sizes[size].trim() !== '' && Number.isSafeInteger(Number(selection.sizes[size])) && Number(selection.sizes[size]) >= 0) && Number.isSafeInteger(total);

  function patch(values: Partial<DemoState>) {
    setSelection((previous) => ({ ...previous, ...values }));
    clearError();
  }

  function changeChoice(field: Field, value: string) {
    setSelection((previous) => ({ ...previous, answers: { ...previous.answers, [field]: value } }));
    clearError();
    setAnnouncement(`${fields[field].label}: ${fields[field].options.find(([key]) => key === value)?.[1]}. Resumen actualizado.`);
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

  const { step, reviewed, error, announcement, stepTitle, reviewTitle, moveStep, next, reset, clearError, setAnnouncement } = useGuidedSteps({
    idPrefix: 'f02-demo', steps, validateStep: errorFor, resetSelection: () => setSelection(initialState()),
  });

  function choice(field: Field) {
    return <GuidedChoiceField key={field} idPrefix="f02-demo" field={field} {...fields[field]} selected={selection.answers[field]} error={error} onChange={(value) => changeChoice(field, value)} />;
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
    {reviewed ? <GuidedReview idPrefix="f02-demo" className={pilot.formPanel} rows={rows} titleRef={reviewTitle} onEdit={() => moveStep(2)} onReset={reset} /> : <>
      <GuidedConfigurator
        idPrefix="f02-demo" className={pilot.formPanel} steps={steps} step={step}
        title={stepTitles[step]} help={stepHelp[step]} error={error} stepTitleRef={stepTitle}
        onStepChange={moveStep} onNext={next} onReset={reset}
      >
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
                <input id={`f02-demo-size-${size}`} type="number" min="0" step="1" max={Number.MAX_SAFE_INTEGER} inputMode="numeric" value={selection.sizes[size]} onChange={(event) => { const value = event.target.value; setSelection((previous) => ({ ...previous, sizes: { ...previous.sizes, [size]: value } })); clearError(); }} aria-invalid={error?.id === `f02-demo-size-${size}` || undefined} aria-describedby={`f02-demo-sizes-help${error?.id === `f02-demo-size-${size}` ? ' f02-demo-error' : ''}`} />
              </div>)}</div>
              <div className={styles.totalLine}><span>Total de prendas</span><output id="f02-demo-size-total" aria-live="polite">{validSizes ? format(total) : 'Revisá las cantidades'}</output></div>
            </>}
            <details className={styles.contextHelp}><summary>¿Qué pasa si todavía no conozco los talles?</summary><p>Marcá la opción de ayuda y, si la sabés, indicá una cantidad total. Una futura tabla de medidas deberá validarse para cada modelo; este ejemplo no usa equivalencias de talles.</p></details>
            <p id="f02-demo-sizes-help" className={styles.fieldHelp}>S, M, L y XL son etiquetas de muestra. No representan una oferta ni una tabla de talles confirmada.</p>
          </fieldset> : stages[step].map(choice)}
          {step === 2 && <>
            <GuidedNotes idPrefix="f02-demo" value={selection.notes} onChange={(value) => patch({ notes: value })} />
            <p className={styles.notice}>Son referencias para evaluar la experiencia. No confirman técnicas, colores ni terminaciones disponibles.</p>
          </>}
      </GuidedConfigurator>
      <GuidedSummary idPrefix="f02-demo" className={pilot.selectionSummary} rows={rows} />
    </>}
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </>;
}
