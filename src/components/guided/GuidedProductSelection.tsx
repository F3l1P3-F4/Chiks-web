'use client';

import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import Button from '../Button';
import { itemKey, selectionVersion, useConsultation } from '../ConsultationProvider';
import type { ConsultationItem, ConsultationProduct, SaveResult } from '../ConsultationProvider';
import { adviceLabels, configurationLabels, confirmedCatalogs, productKinds } from '@/data/guidedCatalogs';
import type { AdviceField, ConfigurationField, GuidedCatalog } from '@/data/guidedCatalogs';
import { cleanConfiguration, configurationRows, unavailableOptions, validateConfiguration } from '@/lib/consultationConfiguration';
import type { ProductConfiguration } from '@/lib/consultationConfiguration';
import { GuidedChoiceField, GuidedConfigurator, GuidedNotes, GuidedSummary, SummaryRows } from './GuidedPreview';
import type { GuidedSummaryRow } from './GuidedPreview';
import { useGuidedSteps } from './useGuidedSteps';
import type { GuidedStepError } from './useGuidedSteps';
import pilot from '../RemerasProductDetail.module.css';
import styles from './GuidedPreview.module.css';
import local from './GuidedProductSelection.module.css';
import RemerasConfigurationFields from './RemerasConfigurationFields';
import LonasConfigurationFields from './LonasConfigurationFields';
import type { RequestedSize } from './RemerasConfigurationFields';

const subscribeHash = (notify: () => void) => { window.addEventListener('hashchange', notify); window.addEventListener('popstate', notify); return () => { window.removeEventListener('hashchange', notify); window.removeEventListener('popstate', notify); }; };
const readHash = () => new URLSearchParams(window.location.hash.slice(1)).get('configuracion') ?? '';
function setConfigurationAddress(key: string | null) {
  const url = new URL(window.location.href);
  url.hash = key ? `configuracion=${encodeURIComponent(key)}` : '';
  window.history.replaceState(window.history.state, '', url);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}
const positiveInteger = (value: string) => value.trim() !== '' && Number.isSafeInteger(Number(value)) && Number(value) > 0;
const measure = (value: string) => Number(value.replace(',', '.'));
const validMeasure = (value: string) => /^\d+(?:[.,]\d+)?$/.test(value) && Number.isFinite(measure(value)) && measure(value) > 0;
interface Draft {
  base: ConsultationItem | null;
  quantity: string;
  notes: string;
  choices: ProductConfiguration['choices'];
  sizes: RequestedSize[];
  requests: NonNullable<ProductConfiguration['requests']>;
  lonaRequest: NonNullable<ProductConfiguration['lonaRequest']>;
  placements: NonNullable<ProductConfiguration['placements']>;
  distribute: boolean;
  dimensions: boolean;
  width: string;
  height: string;
  unit: 'cm' | 'm';
  advice: AdviceField[];
}
function fromItem(item: ConsultationItem | null, catalog: GuidedCatalog): Draft {
  const config = item?.configuration;
  const choices = {...config?.choices};
  const lona = catalog.kind === 'lonas' && catalog.source === 'confirmed';
  const factor = lona && config?.measurements?.unit === 'm' ? 100 : 1;
  const lonaRequest = {...(lona ? {use:choices.use?.label,finish:choices.finish?.label,design:choices.design?.label} : {}),...config?.lonaRequest};
  if (lona) { delete choices.use; delete choices.finish; delete choices.design; }
  const placements = config?.placements ?? (catalog.source === 'confirmed' && catalog.kind === 'remeras' && choices.placement ? [choices.placement] : []);
  if (catalog.source === 'confirmed' && catalog.kind === 'remeras') delete choices.placement;
  const dimensions = item ? !!config?.measurements && !(lona && config?.advice.includes('measurements')) : lona;
  const advice = lona ? [...(config?.advice ?? []).filter(field=>field!=='measurements'), ...(!dimensions ? ['measurements' as const] : [])] : config?.advice ?? [];
  return { base: item, quantity: String(item?.quantity ?? 1), notes: item?.notes ?? '', choices, requests: config?.requests ?? {}, placements, lonaRequest,
    sizes: [...catalog.sizes.map(({ id, label }) => config?.sizes.find((size) => size.id === id) ?? { id, label, quantity: 0 }), ...(config?.sizes.filter((size) => !catalog.sizes.some((option) => option.id === size.id)) ?? [])].map((size) => ({ ...size, quantity: String(size.quantity) })),
    distribute: !!config?.sizes.length, dimensions, width: String(config?.measurements ? config.measurements.width * factor : ''), height: String(config?.measurements ? config.measurements.height * factor : ''), unit: lona ? 'cm' : config?.measurements?.unit ?? 'cm', advice,
  };
}

export default function GuidedProductSelection({ product, targetKey, embedded = false, onDraftChange, presentation = 'default', summaryTarget }: {
  product: ConsultationProduct; targetKey?: string; embedded?: boolean; onDraftChange?: (dirty: boolean) => void;
  presentation?: 'default' | 'remeras-definitiva' | 'lonas-definitiva'; summaryTarget?: HTMLElement | null;
}) {
  const { ready } = useConsultation();
  const hash = useSyncExternalStore(subscribeHash, readHash, () => null);
  return ready && hash !== null ? <ReadyGuidedSelection product={product} targetKey={targetKey} embedded={embedded} onDraftChange={onDraftChange} initialHash={hash} presentation={presentation} summaryTarget={summaryTarget} /> : <p role="status">Cargando tus configuraciones…</p>;
}

function ReadyGuidedSelection({ product, targetKey, embedded, onDraftChange, initialHash, presentation, summaryTarget }: {
  product: ConsultationProduct; targetKey?: string; embedded: boolean; onDraftChange?: (dirty: boolean) => void; initialHash: string;
  presentation: 'default' | 'remeras-definitiva' | 'lonas-definitiva'; summaryTarget?: HTMLElement | null;
}) {
  const { items, ready, demoCatalog, pendingIds } = useConsultation();
  const [explicitKey, setExplicitKey] = useState<string>();
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState('');
  const [lastResult, setLastResult] = useState<SaveResult | null>(null);
  useEffect(() => {
    const changed = () => { setExplicitKey(undefined);setNotice('');setLastResult(null); };
    window.addEventListener('hashchange', changed);window.addEventListener('popstate', changed);
    return () => { window.removeEventListener('hashchange', changed);window.removeEventListener('popstate', changed); };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault();event.returnValue = ''; };
    const beforeLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank') return;
      const destination = new URL(anchor.href);
      if (destination.origin === location.origin && destination.pathname === location.pathname && destination.search === location.search && (!destination.hash.startsWith('#configuracion=') || destination.hash === location.hash)) return;
      if (!window.confirm('Hay una configuración sin guardar. ¿Querés salir y descartar ese borrador?')) { event.preventDefault();event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', beforeUnload);document.addEventListener('click', beforeLink, true);
    return () => { window.removeEventListener('beforeunload', beforeUnload);document.removeEventListener('click', beforeLink, true); };
  }, [dirty]);
  const selections = items.filter((item) => item.id === product.id);
  // Sin identificador se inicia otra personalización; sólo Editar recupera una selección.
  // La identidad inicial no depende de inserciones o eliminaciones en otra pestaña.
  const [initialKey] = useState(() => demoCatalog && selections.length === 1 ? itemKey(selections[0]) : 'new');
  const selectedKey = targetKey ?? explicitKey ?? ((!demoCatalog && initialHash) || initialKey);
  const currentNotice = lastResult === 'temporary' && !pendingIds.includes(selectedKey) ? '' : notice;
  const catalog = demoCatalog ?? confirmedCatalogs[productKinds[product.id]];
  function choose(key: string) {
    if (dirty && !window.confirm('Hay un borrador sin guardar. ¿Querés descartarlo y cambiar de configuración?')) return;
    if (!embedded && !demoCatalog) setConfigurationAddress(key === 'new' ? null : key);
    setExplicitKey(key);setDirty(false);setNotice('');setLastResult(null);onDraftChange?.(false);
  }
  return <div className={`${local.root} ${embedded ? local.embedded : local.full}`}>
    {!embedded && presentation === 'default' && <div className={local.picker}>
      <label htmlFor={`${demoCatalog ? 'demo-' : ''}configuraciones-${product.id}`}>Tus configuraciones de este producto</label>
      <select id={`${demoCatalog ? 'demo-' : ''}configuraciones-${product.id}`} value={selectedKey} disabled={!ready} onChange={(event) => choose(event.target.value)}>
        <option value="new">Nueva configuración</option>
        {selections.map((item, index) => <option key={itemKey(item)} value={itemKey(item)}>Configuración {index + 1} · {item.quantity} unidades{item.configuration ? '' : ' · selección anterior'}</option>)}
        {selectedKey !== 'new' && !selections.some((item) => itemKey(item) === selectedKey) && <option value={selectedKey}>Configuración no disponible</option>}
      </select>
      <p>Podés guardar varias configuraciones del mismo producto. Cada una se mantiene por separado.</p>
      {selectedKey !== 'new' && <button className={styles.smallLink} type="button" onClick={() => choose('new')}>Crear otra configuración</button>}
    </div>}
    <p id={`${demoCatalog ? 'demo-' : ''}guardado-${product.id}-${embedded ? targetKey : 'ficha'}`} tabIndex={-1} role="status" className={local.feedback}>{currentNotice}</p>
    <ConfigurationForm key={selectedKey} product={product} selectedKey={selectedKey} catalog={catalog} embedded={embedded} editingFromAddress={!embedded && !demoCatalog && !!initialHash && selectedKey !== 'new'} definitive={presentation !== 'default'} summaryTarget={summaryTarget} onDirty={(value) => { setDirty(value);if (value) { setNotice('');setLastResult(null); } onDraftChange?.(value); }} onSaved={(key, result) => {
      if (!embedded && !demoCatalog) setConfigurationAddress(key);
      setLastResult(result);
      setExplicitKey(key);setNotice(result === 'temporary' ? 'Configuración conservada sólo en esta sesión. Se perderá al recargar si el navegador no permite guardarla.' : demoCatalog ? 'Configuración guardada en la consulta de demostración, sólo en memoria.' : 'Configuración guardada en Mi consulta.');
      requestAnimationFrame(() => document.getElementById(`${demoCatalog ? 'demo-' : ''}guardado-${product.id}-${embedded ? targetKey : 'ficha'}`)?.focus({ preventScroll: true }));
    }} />
    {presentation !== 'default' && !embedded && !demoCatalog && lastResult && lastResult !== 'conflict' && !dirty && <div className={styles.actions}><Button showArrow={false} onClick={() => choose('new')}>Agregar otra personalización</Button></div>}
  </div>;
}

function ConfigurationForm({ product, selectedKey, catalog, embedded, onDirty, onSaved, definitive, summaryTarget, editingFromAddress }: {
  product: ConsultationProduct; selectedKey: string; catalog: GuidedCatalog; embedded: boolean;
  onDirty: (value: boolean) => void; onSaved: (key: string, result: SaveResult) => void;
  definitive: boolean; summaryTarget?: HTMLElement | null;
  editingFromAddress: boolean;
}) {
  const { items, ready, save, readCurrent, conflicts, pendingIds, storageIssue, demoCatalog } = useConsultation();
  const existing = items.find((item) => item.id === product.id && itemKey(item) === selectedKey) ?? null;
  const [draft, setDraft] = useState<Draft | null>(null);
  const value = draft ?? fromItem(existing, catalog);
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [navigating, startNavigation] = useTransition();
  const router = useRouter();
  const prefix = `${demoCatalog ? 'demo-' : ''}guiada-${product.id}-${embedded ? selectedKey : 'ficha'}`;
  const conflict = !!draft && selectionVersion(draft.base) !== selectionVersion(existing);
  const missing = selectedKey !== 'new' && !existing && !draft;
  const steps = catalog.kind === 'remeras' ? ['Modelo y material', 'Talles y cantidad', 'Personalización'] : ['Material y uso', 'Medidas y cantidad', 'Terminaciones y diseño'];
  const stages: ConfigurationField[][] = catalog.kind === 'remeras' ? [['model', 'material'], [], ['color', 'technique', 'placement']] : [['material', 'use'], [], ['finish', 'design']];
  const interactiveRemeras = catalog.kind === 'remeras' && catalog.source === 'confirmed';
  const interactiveLonas = catalog.kind === 'lonas' && catalog.source === 'confirmed';
  const requestedDistribution = interactiveRemeras && catalog.sizes.length === 0;
  const total = value.distribute ? value.sizes.reduce((sum, size) => sum + Number(size.quantity), 0) : Number(value.quantity);
  function configuration(): ProductConfiguration {
    return cleanConfiguration({ version: 1, kind: catalog.kind, source: catalog.source, choices: value.choices,
      sizes: value.distribute ? value.sizes.filter((size) => Number(size.quantity) > 0 && size.label.trim()).map((size) => ({ ...size, quantity: Number(size.quantity) })) : [],
      ...(interactiveRemeras ? {requests:value.requests,placements:value.placements} : {}),
      ...(interactiveLonas ? {lonaRequest:value.lonaRequest} : {}),
      ...(value.dimensions && validMeasure(value.width) && validMeasure(value.height) ? { measurements: { width: measure(value.width), height: measure(value.height), unit: value.unit } } : {}), advice: value.advice,
    });
  }
  const unavailable = unavailableOptions(configuration(), catalog);
  function validSizesTotal(sizes: RequestedSize[]) {
    const sum=sizes.reduce((n,size)=>n+Number(size.quantity),0);
    const coherent=sizes.length>0 && sizes.every(size=>size.label.trim() && size.label.length<=120 && size.quantity.trim()!=='' && Number.isSafeInteger(Number(size.quantity)) && (requestedDistribution ? Number(size.quantity)>0 : Number(size.quantity)>=0)) && new Set(sizes.map(size=>size.label.trim().toLocaleLowerCase('es'))).size===sizes.length;
    return coherent && Number.isSafeInteger(sum) && sum>0 ? sum : null;
  }
  function patch(values: Partial<Draft>) {
    setDraft(previous => {
      const next={ ...(previous ?? value), ...values, base: previous ? previous.base : existing };
      if(interactiveRemeras && next.distribute){const sum=validSizesTotal(next.sizes);if(sum!==null)next.quantity=String(sum);}
      return next;
    });onDirty(true);setFeedback('');clearError();
  }
  function toggleDistribution(distribute:boolean) {
    const sum=validSizesTotal(value.sizes);
    patch({distribute});
    setAnnouncement(distribute ? sum!==null ? `Distribución recuperada: ${sum} unidades. El total se calcula con esas cantidades.` : 'Completá los talles y las cantidades. Se conserva el último total válido para volver al modo de cantidad total.' : `Distribución desactivada. Cantidad total conservada: ${value.quantity}.`);
  }
  function cancel() { setDraft(null);onDirty(false);setFeedback('Edición cancelada. La selección guardada no cambió.');moveStep(0); }
  function cancelAndReturn() { cancel();startNavigation(() => router.push('/mi-consulta')); }
  function problem(index: number): GuidedStepError | null {
    if (index === 0 && interactiveRemeras) for (const field of ['model','material'] as const) if ((value.requests[field]?.length ?? 0)>120) return {id:`${prefix}-request-${field}`,message:'Usá hasta 120 caracteres para describir lo que buscás.'};
    if (interactiveLonas) { const fields = index===0 ? ['use'] as const : index===1 ? ['measurementsNotes'] as const : ['finish','design'] as const; for (const field of fields) if ((value.lonaRequest[field]?.length ?? 0)>500) return {id:`${prefix}-request-${field}`,message:'Usá hasta 500 caracteres para describir tu solicitud.'}; }
    if (index === 1) {
      if (requestedDistribution && value.distribute) {
        if (!value.sizes.length) return {id:`${prefix}-add-size`,message:'Agregá al menos un talle o desmarcá la distribución para indicar sólo el total.'};
        const invalid = value.sizes.find(size=>!size.label.trim() || size.label.length>120 || !positiveInteger(size.quantity));
        if (invalid) return {id:`${prefix}-${!invalid.label.trim()||invalid.label.length>120?'label':'size'}-${invalid.id}`,message:'Completá cada talle solicitado con un nombre y una cantidad entera mayor que cero.'};
        if(new Set(value.sizes.map(size=>size.label.trim().toLocaleLowerCase('es'))).size!==value.sizes.length) return {id:`${prefix}-label-${value.sizes[0].id}`,message:'No repitas el mismo talle; sumá sus cantidades en una sola fila.'};
      }
      if ((value.requests.sizesNotes?.length ?? 0)>500) return {id:`${prefix}-request-sizesNotes`,message:'Las observaciones sobre talles admiten hasta 500 caracteres.'};
      if (value.distribute && (value.sizes.some((size) => size.quantity.trim() === '' || !Number.isSafeInteger(Number(size.quantity)) || Number(size.quantity) < 0) || !Number.isSafeInteger(total) || total <= 0)) return { id: `${prefix}-size-${value.sizes[0]?.id}`, message: 'Indicá cantidades enteras desde cero y al menos una prenda en total.' };
      if (!value.distribute && !positiveInteger(value.quantity)) return { id: `${prefix}-quantity`, message: 'Ingresá una cantidad entera mayor que cero. No se establece un mínimo comercial.' };
      if (value.dimensions && !validMeasure(value.width)) return { id: `${prefix}-width`, message: 'Ingresá un ancho mayor que cero. Podés usar coma o punto decimal.' };
      if (value.dimensions && !validMeasure(value.height)) return { id: `${prefix}-height`, message: 'Ingresá un alto mayor que cero. Podés usar coma o punto decimal.' };
    }
    if (index === 2 && value.notes.length > 2000) return { id: `${prefix}-notes`, message: 'Las observaciones admiten hasta 2.000 caracteres.' };
    return null;
  }
  const { step, reviewed, error, announcement, stepTitle, reviewTitle, moveStep, next, reset, clearError, setAnnouncement } = useGuidedSteps({ idPrefix: prefix, steps, validateStep: problem, resetSelection: () => patch(fromItem(null, catalog)), commercial: true });
  const rows: GuidedSummaryRow[] = [{ label: 'Producto', value: product.name }, { label: 'Cantidad total', value: Number.isSafeInteger(total) && total > 0 ? String(total) : 'Revisá la cantidad' }, ...configurationRows(configuration()), ...((interactiveRemeras || interactiveLonas) && !value.notes ? [] : [{ label: 'Observaciones', value: value.notes || 'Sin observaciones.', scrollable: !!value.notes }])];
  async function commit(go: boolean) {
    if (saving.current || navigating || conflict || missing) return;
    for (let i = 0; i < 3; i++) { const issue = problem(i);if (issue) { moveStep(i);setFeedback(issue.message);return; } }
    const key = existing?.configurationId ?? (selectedKey === 'new' ? `cfg-${crypto.randomUUID()}` : selectedKey.startsWith('cfg-') ? selectedKey : undefined);
    const item: ConsultationItem = { ...product, ...(key ? { configurationId: key } : {}), quantity: total, notes: value.notes, configuration: configuration() };
    const issue = validateConfiguration(item, catalog, !!demoCatalog);
    if (issue) { setFeedback(issue);return; }
    saving.current = true;setBusy(true);
    try {
      const result = await save(item, draft ? draft.base : existing);
      if (result === 'conflict') { setFeedback('La consulta cambió o hay datos pendientes de revisión. Tu borrador sigue aquí; resolvé los avisos antes de guardar.');return; }
      const current = readCurrent();
      if (current.conflicts.length || selectionVersion(current.items.find((entry) => itemKey(entry) === itemKey(item))) !== selectionVersion(item)) { setFeedback('Hay cambios nuevos. Revisá el conflicto antes de continuar; tu borrador sigue aquí.');return; }
      setDraft(null);setFeedback('');setAnnouncement('');onDirty(false);onSaved(itemKey(item), result);
      if (go && !demoCatalog) startNavigation(() => router.push('/mi-consulta'));
    } catch (cause) { setFeedback(cause instanceof Error ? cause.message : 'No se pudo guardar. Tu borrador sigue aquí.'); }
    finally { saving.current = false;setBusy(false); }
  }
  const disabled = !ready || busy || navigating || conflict || missing || !!storageIssue || conflicts.length > 0;
  function input(id: string, label: string, text: string, change: (value: string) => void, decimal = false) {
    return <div className={styles.formField}><label htmlFor={`${prefix}-${id}`}>{label}</label><input id={`${prefix}-${id}`} type={decimal ? 'text' : 'number'} inputMode={decimal ? 'decimal' : 'numeric'} min={decimal ? undefined : 1} step={decimal ? undefined : 1} max={decimal ? undefined : Number.MAX_SAFE_INTEGER} maxLength={decimal ? 30 : undefined} value={text} onChange={(event) => change(event.target.value)} aria-invalid={error?.id === `${prefix}-${id}` || undefined} aria-describedby={error?.id === `${prefix}-${id}` ? `${prefix}-error` : undefined} /></div>;
  }
  const summary = <GuidedSummary commercial idPrefix={prefix} className={`${pilot.selectionSummary} ${local.panel}`} rows={rows} notesLabel="Observaciones completas de tu selección" />;
  return <>
    {missing && <p role="alert" className={styles.error}>Esta configuración ya no está disponible. Volvé a Mi consulta o creá una nueva selección.</p>}
    {conflict && <div role="alert" className={local.conflict}>
      <p>Esta configuración cambió en otra pestaña. Tu borrador sigue aquí. Compará ambas versiones antes de guardar.</p>
      <h3>Tu borrador</h3><SummaryRows rows={rows} review notesLabel="Observaciones del borrador" />
      <h3>Versión guardada</h3>{existing ? <SummaryRows rows={[{ label: 'Cantidad total', value: String(existing.quantity) }, ...configurationRows(existing.configuration), { label: 'Observaciones', value: existing.notes || 'Sin observaciones.', scrollable: !!existing.notes }]} review notesLabel="Observaciones de otra pestaña" /> : <p>Configuración eliminada.</p>}
      <div className={styles.actions}><Button showArrow={false} onClick={cancel}>Usar versión guardada</Button><Button showArrow={false} onClick={() => { setDraft({ ...value, base: existing });setFeedback('Borrador conservado. Revisá y guardá para aplicar tus cambios.'); }}>Conservar mi borrador</Button></div>
    </div>}
    {!!unavailable.length && <div role="alert" className={styles.error}>Estas opciones ya no están confirmadas: {unavailable.join(' · ')}. Se conservaron para que puedas revisarlas. Elegí una alternativa o quitá expresamente la selección; no se reemplazará automáticamente.</div>}
    <div className={embedded ? local.inlineWorkspace : local.workspace}>
      {reviewed ? <section className={`internal-surface ${pilot.formPanel} ${local.panel}`} aria-labelledby={`${prefix}-review-title`}>
        <h2 id={`${prefix}-review-title`} tabIndex={-1} ref={reviewTitle}>Revisá tu configuración</h2>
        <SummaryRows rows={rows} review notesLabel="Observaciones completas de la configuración" />
        <div className={styles.actions}>
          <Button showArrow={false} disabled={disabled} variant="solid" onClick={() => commit(editingFromAddress)}>{existing ? 'Guardar cambios' : 'Agregar a mi consulta'}</Button>
          {!embedded && !demoCatalog && <Button showArrow={false} disabled={disabled} onClick={() => commit(true)}>Solicitar presupuesto</Button>}
          <button className={styles.smallLink} type="button" onClick={() => moveStep(2)}>Volver a editar</button>
        </div>
      </section> : <GuidedConfigurator commercial idPrefix={prefix} className={`${pilot.formPanel} ${local.panel}`} steps={steps} stepsLabel="Pasos para configurar tu consulta" step={step} title={steps[step]} help={catalog.source === 'demo' ? 'Probá alternativas ilustrativas de F02. No representan disponibilidad comercial y se guardan sólo en la consulta aislada de esta prueba.' : interactiveLonas ? ['Indicá tu material preferido y para qué necesitás la lona.','Ingresá medidas en centímetros o pedí ayuda para definirlas.','Contanos la terminación que buscás y si tenés un diseño preparado.'][step] : interactiveRemeras ? ['Contanos cómo te gustaría tu remera. Podés dejar decisiones abiertas y pedir ayuda.','Indicá cuántas prendas necesitás. Si conocés los talles, podés repartir las cantidades.','Elegí cómo te gustaría personalizarla. El equipo confirmará los detalles de tu solicitud.'][step] : step === 1 ? 'Indicá lo que necesitás. Las medidas y cantidades solicitadas se confirmarán con el equipo.' : 'Elegí entre las opciones confirmadas o pedí asesoramiento. Podés continuar sin definirlas ahora.'} error={error} stepTitleRef={stepTitle} onStepChange={moveStep} onNext={next} onReset={reset}>
        <fieldset disabled={!ready || busy} className={local.fields}>
          <legend className="sr-only">{steps[step]}</legend>
          {interactiveLonas && <LonasConfigurationFields step={step} prefix={prefix} catalog={catalog} choices={value.choices} request={value.lonaRequest} advice={value.advice} width={value.width} height={value.height} dimensions={value.dimensions} onChoices={choices=>patch({choices})} onRequest={lonaRequest=>patch({lonaRequest})} onAdvice={advice=>patch({advice})} onDimensions={dimensions=>patch({dimensions,advice:[...value.advice.filter(field=>field!=='measurements'),...(!dimensions?['measurements' as const]:[])]})}/>}
          {interactiveRemeras && <RemerasConfigurationFields step={step} prefix={prefix} catalog={catalog} requests={value.requests} choices={value.choices} placements={value.placements} advice={value.advice} sizes={value.sizes} distribute={value.distribute} error={error} onRequests={requests=>patch({requests})} onChoices={choices=>patch({choices})} onPlacements={placements=>patch({placements})} onAdvice={advice=>patch({advice})} onSizes={sizes=>patch({sizes})} onDistribute={toggleDistribution} />}
          {step === 1 ? <>
            {catalog.kind === 'remeras' && !requestedDistribution && value.sizes.length > 0 && <label className={styles.checkLine}><input type="checkbox" checked={value.distribute} onChange={(event) => patch({ distribute: event.target.checked })} />Distribuir cantidades por talle</label>}
            {value.distribute ? <>{!requestedDistribution && <div className={styles.quantityGrid}>{value.sizes.map((size, index) => <div key={size.id} className={styles.quantityCell}><label htmlFor={`${prefix}-size-${size.id}`}>{size.label}</label><input id={`${prefix}-size-${size.id}`} type="number" min="0" step="1" max={Number.MAX_SAFE_INTEGER} inputMode="numeric" value={size.quantity} onChange={(event) => patch({ sizes: value.sizes.map((entry, i) => i === index ? { ...entry, quantity: event.target.value } : entry) })} aria-invalid={error?.id === `${prefix}-size-${size.id}` || undefined} aria-describedby={error?.id === `${prefix}-size-${size.id}` ? `${prefix}-error` : undefined} /></div>)}</div>}<p className={styles.totalLine}>Cantidad total: {Number.isSafeInteger(total) ? total : 'Revisá las cantidades'}</p></> : input('quantity', 'Cantidad solicitada', value.quantity, (quantity) => patch({ quantity }))}
            {catalog.kind === 'lonas' && <>
              {!interactiveLonas && <label className={styles.checkLine}><input type="checkbox" checked={value.dimensions} onChange={(event) => patch({ dimensions: event.target.checked })} />Quiero indicar las medidas que necesito</label>}
              {value.dimensions ? <><div className={local.measurements}>{input('width', 'Ancho', value.width, (width) => patch({ width }), true)}{input('height', 'Alto', value.height, (height) => patch({ height }), true)}</div>{interactiveLonas ? <p className={styles.fieldHelp}>Ancho y alto en centímetros (cm).</p> : <div className={styles.formField}><label htmlFor={`${prefix}-unit`}>Unidad de las medidas</label><select id={`${prefix}-unit`} value={value.unit} onChange={(event) => patch({ unit: event.target.value as 'cm' | 'm' })}><option value="cm">Centímetros (cm)</option><option value="m">Metros (m)</option></select></div>}<p className={styles.fieldHelp}>Son medidas solicitadas, sujetas a confirmación; no definen límites de fabricación.</p></> : <p className={styles.fieldHelp}>Podés pedir asesoramiento y definir las medidas con el equipo.</p>}
            </>}
          </> : !interactiveRemeras && !interactiveLonas && stages[step].map((field) => {
            const options = catalog.fields[field] ?? [], selected = value.choices[field];
            return <div key={field}>{options.length > 0 ? <GuidedChoiceField idPrefix={prefix} field={field} label={configurationLabels[field]} options={options.map((option) => [option.id, option.label, option.help ?? '', option.color])} selected={selected?.id} error={error} onChange={(id) => { const option = options.find((option) => option.id === id)!;patch({ choices: { ...value.choices, [field]: { id, label: option.label } } }); }} /> : <p className={styles.fieldHelp}><strong>{configurationLabels[field]}</strong>: opciones pendientes de confirmación. Contanos lo que necesitás en las observaciones.</p>}
              {selected && <button type="button" className={styles.smallLink} onClick={() => { const choices = { ...value.choices };delete choices[field];patch({ choices }); }}>Quitar selección de {configurationLabels[field].toLowerCase()}: {selected.label}</button>}
            </div>;
          })}
          {step === 2 && <>
            <fieldset className={styles.fieldset}><legend>¿Sobre qué necesitás asesoramiento?</legend>{(catalog.kind === 'remeras' ? ['general', 'model', 'material', 'sizes', 'color', 'customization'] as const : ['general', 'material', 'measurements', 'finish', 'design'] as const).map((field) => interactiveLonas && field === 'measurements' ? null : <label className={styles.checkLine} key={field}><input type="checkbox" checked={value.advice.includes(field)} onChange={(event) => patch({ advice: event.target.checked ? [...value.advice, field] : value.advice.filter((entry) => entry !== field) })} />{adviceLabels[field]}</label>)}</fieldset>
            <GuidedNotes commercial idPrefix={prefix} value={value.notes} onChange={(notes) => patch({ notes })} />
          </>}
          <details className={styles.contextHelp}><summary>¿Qué pasa si todavía no sé qué elegir?</summary><p>Podés continuar con la cantidad y tu idea. Pedir asesoramiento no confirma materiales, técnicas, talles ni condiciones de producción.</p></details>
        </fieldset>
      </GuidedConfigurator>}
      {!definitive && !reviewed && summary}
    </div>
    {definitive && summaryTarget && createPortal(summary, summaryTarget)}
    {(draft || editingFromAddress) && <div className={local.draftBar}>{draft && <span>Borrador sin guardar.</span>}<button type="button" disabled={busy || navigating} className={styles.smallLink} onClick={editingFromAddress ? cancelAndReturn : cancel}>{editingFromAddress ? draft ? 'Cancelar edición y volver a Mi consulta' : 'Volver a Mi consulta' : 'Cancelar edición'}</button></div>}
    {existing && pendingIds.includes(itemKey(existing)) && <p role="status">Esta configuración se conserva sólo en esta pestaña hasta que se pueda guardar.</p>}
    <p role="status" aria-live="polite" className={local.feedback}>{feedback || announcement}</p>
  </>;
}
