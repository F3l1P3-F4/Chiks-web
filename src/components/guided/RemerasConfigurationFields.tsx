'use client';

import type { AdviceField, GuidedCatalog } from '@/data/guidedCatalogs';
import type { ProductConfiguration } from '@/lib/consultationConfiguration';
import { GuidedChoiceField } from './GuidedPreview';
import type { GuidedStepError } from './useGuidedSteps';
import styles from './GuidedPreview.module.css';
import local from './GuidedProductSelection.module.css';

export type RequestedSize = { id: string; label: string; quantity: string; requested?: true };
export default function RemerasConfigurationFields({ step, prefix, catalog, requests, choices, placements, advice, sizes, distribute, error, onRequests, onChoices, onPlacements, onAdvice, onSizes, onDistribute }: {
  step: number; prefix: string; catalog: GuidedCatalog;
  requests: NonNullable<ProductConfiguration['requests']>; choices: ProductConfiguration['choices'];
  placements: NonNullable<ProductConfiguration['placements']>; advice: AdviceField[];
  sizes: RequestedSize[]; distribute: boolean; error: GuidedStepError | null;
  onRequests: (value: NonNullable<ProductConfiguration['requests']>) => void;
  onChoices: (value: ProductConfiguration['choices']) => void;
  onPlacements: (value: NonNullable<ProductConfiguration['placements']>) => void;
  onAdvice: (value: AdviceField[]) => void; onSizes: (value: RequestedSize[]) => void;
  onDistribute: (checked: boolean) => void;
}) {
  function advisory(field: AdviceField, text: string) {
    return <label className={styles.checkLine}><input id={`${prefix}-advice-${field}`} type="checkbox" checked={advice.includes(field)} onChange={e => onAdvice(e.target.checked ? [...advice, field] : advice.filter(f => f !== field))} />{text}</label>;
  }
  function request(field: 'model' | 'material' | 'sizesNotes', title: string, help: string) {
    const id = `${prefix}-request-${field}`;
    return <div className={styles.formField}><label htmlFor={id}>{title}</label><textarea id={id} rows={2} maxLength={field === 'sizesNotes' ? 500 : 120} value={requests[field] ?? ''} onChange={e => onRequests({...requests, [field]: e.target.value})} aria-describedby={`${id}-help`} /><p id={`${id}-help`} className={styles.fieldHelp}>{help}</p></div>;
  }
  function choice(field: 'model' | 'material' | 'color' | 'technique', title: string, adviceField?: AdviceField) {
    const options = catalog.fields[field] ?? [];
    return <div><GuidedChoiceField idPrefix={prefix} field={field} label={title} options={[
      ...options.map(o => [o.id,o.label,o.help ?? '',o.color] as const),
      ...(adviceField ? [['asesoramiento','Necesito asesoramiento',''] as const] : []),
    ]} selected={choices[field]?.id ?? (adviceField && advice.includes(adviceField) ? 'asesoramiento' : undefined)} error={error} onChange={id => {
      const next={...choices};
      if(id === 'asesoramiento') { delete next[field];onChoices(next);onAdvice([...advice.filter(f=>f!==adviceField),adviceField!]); }
      else { const option=options.find(o=>o.id===id)!;next[field]={id:option.id,label:option.label};onChoices(next);if(field==='model'||field==='material')onRequests({...requests,[field]:''});if(adviceField)onAdvice(advice.filter(f=>f!==adviceField)); }
    }} />{choices[field] && <button type="button" className={styles.smallLink} onClick={()=>{const next={...choices};delete next[field];onChoices(next);}}>Quitar selección de {title.toLowerCase()}</button>}</div>;
  }
  if(step===0) return <div className={local.requestFields}>
    {catalog.fields.model?.length ? choice('model','Modelo') : request('model','Modelo que te gustaría (opcional)','Describí el corte o estilo que buscás. Es una solicitud, sujeta a confirmación.')}
    {catalog.fields.material?.length ? choice('material','Material') : request('material','Material que buscás (opcional)','Si no conocés el nombre, contanos qué necesitás de la prenda. Podés dejarlo sin definir.')}
    {advisory('general','No estoy seguro, necesito asesoramiento')}
    <details className={styles.contextHelp}><summary>¿Cómo describo el modelo y el material?</summary><p>Contanos cómo te gustaría que sea la remera y para qué la vas a usar. El equipo te ayudará a definir la opción adecuada; no hace falta conocer términos técnicos.</p></details>
  </div>;
  if(step===1) return <div className={local.requestFields}>
    {catalog.sizes.length===0 && <>
      <label className={styles.checkLine}><input id={`${prefix}-distribute`} type="checkbox" checked={distribute} onChange={e=>onDistribute(e.target.checked)} />Conozco los talles y quiero repartir las cantidades</label>
      {distribute && <>
        <p className={styles.fieldHelp}>Ingresá tus propias referencias de talle. Son talles solicitados, no una tabla de disponibilidad confirmada. El total se calcula sumando las filas.</p>
        <div className={local.requestFields}>{sizes.map((size,index)=><div key={size.id} className={local.sizeRequest}>
          <div className={styles.formField}><label htmlFor={`${prefix}-label-${size.id}`}>Talle solicitado {index+1}</label><input id={`${prefix}-label-${size.id}`} maxLength={120} value={size.label} onChange={e=>onSizes(sizes.map(s=>s.id===size.id?{...s,label:e.target.value}:s))} aria-invalid={error?.id===`${prefix}-label-${size.id}`||undefined} aria-describedby={error?.id===`${prefix}-label-${size.id}`?`${prefix}-error`:undefined} /></div>
          <div className={styles.formField}><label htmlFor={`${prefix}-size-${size.id}`}>Cantidad</label><input id={`${prefix}-size-${size.id}`} type="number" inputMode="numeric" min={1} step={1} value={size.quantity} onChange={e=>onSizes(sizes.map(s=>s.id===size.id?{...s,quantity:e.target.value}:s))} aria-invalid={error?.id===`${prefix}-size-${size.id}`||undefined} aria-describedby={error?.id===`${prefix}-size-${size.id}`?`${prefix}-error`:undefined} /></div>
          <button type="button" className={styles.smallLink} aria-label={`Quitar talle solicitado ${index+1}`} onClick={()=>onSizes(sizes.filter(s=>s.id!==size.id))}>Quitar</button>
        </div>)}</div>
        <button id={`${prefix}-add-size`} type="button" className={styles.smallLink} disabled={sizes.length>=40} onClick={()=>onSizes([...sizes,{id:`solicitado-${crypto.randomUUID()}`,label:'',quantity:'1',requested:true}])}>Agregar talle solicitado</button>
      </>}
    </>}
    {advisory('sizes','Necesito ayuda para definir los talles')}
    {request('sizesNotes','Observaciones sobre talles (opcional)','Podés explicar cómo querés repartir las prendas o qué necesitás consultar. Hasta 500 caracteres.')}
  </div>;
  return <div className={local.requestFields}>
    {choice('technique','Técnica de personalización','customization')}
    <fieldset className={styles.fieldset}><legend>Ubicación del diseño</legend><p className={styles.fieldHelp}>Podés elegir frente, espalda o ambas ubicaciones.</p><div className={styles.choiceGrid}>{(catalog.fields.placement ?? []).map(option=><label className={styles.choice} key={option.id}><input id={`${prefix}-placement-${option.id}`} type="checkbox" checked={placements.some(p=>p.id===option.id)} onChange={e=>onPlacements(e.target.checked?[...placements,{id:option.id,label:option.label}]:placements.filter(p=>p.id!==option.id))} /><span><strong>{option.label}</strong></span></label>)}</div></fieldset>
    {choice('color','Color de referencia','color')}
    <p className={styles.fieldHelp}>Muestras digitales orientativas, sin equivalencias Pantone. El tono definitivo y la disponibilidad se confirman con el equipo.</p>
    <p className={styles.fieldHelp}>En las observaciones podés describir el diseño, una ubicación especial o cualquier requerimiento adicional.</p>
  </div>;
}
