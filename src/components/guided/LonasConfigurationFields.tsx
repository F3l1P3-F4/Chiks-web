'use client';
import type {AdviceField,GuidedCatalog} from '@/data/guidedCatalogs';
import type {ProductConfiguration} from '@/lib/consultationConfiguration';
import {GuidedChoiceField} from './GuidedPreview';
import styles from './GuidedPreview.module.css';
import local from './LonasConfigurationFields.module.css';
import RequestedPreferenceField from './RequestedPreferenceField';
import { guidedPreferences } from '@/data/guidedPreferences';

export default function LonasConfigurationFields({step,prefix,catalog,choices,request,advice,width,height,dimensions,onChoices,onRequest,onAdvice,onDimensions}:{
  step:number;prefix:string;catalog:GuidedCatalog;choices:ProductConfiguration['choices'];request:NonNullable<ProductConfiguration['lonaRequest']>;advice:AdviceField[];
  width:string;height:string;dimensions:boolean;
  onChoices:(value:ProductConfiguration['choices'])=>void;onRequest:(value:NonNullable<ProductConfiguration['lonaRequest']>)=>void;onAdvice:(value:AdviceField[])=>void;
  onDimensions:(known:boolean)=>void;
}) {
  function text(field:keyof typeof request,label:string,help:string){return <div className={styles.formField}><label htmlFor={`${prefix}-request-${field}`}>{label}</label><textarea id={`${prefix}-request-${field}`} rows={2} maxLength={500} value={request[field]??''} onChange={e=>onRequest({...request,[field]:e.target.value})} aria-describedby={`${prefix}-${field}-help`}/><p className={styles.fieldHelp} id={`${prefix}-${field}-help`}>{help}</p></div>;}
  if(step===0)return <div className={local.fields}>
    <GuidedChoiceField idPrefix={prefix} field="material" label="Material solicitado" options={[...(catalog.fields.material??[]).map(o=>[o.id,o.label,o.help??''] as const),['asesoramiento','Necesito asesoramiento','Podés definir el material con el equipo.']]} selected={choices.material?.id??(advice.includes('material')?'asesoramiento':undefined)} error={null} onChange={id=>{
      const next={...choices};if(id==='asesoramiento'){delete next.material;onAdvice([...advice.filter(f=>f!=='material'),'material']);}else{const option=catalog.fields.material!.find(o=>o.id===id)!;next.material={id:option.id,label:option.label};onAdvice(advice.filter(f=>f!=='material'));}onChoices(next);
    }}/>
    {choices.material&&<button type="button" className={styles.smallLink} onClick={()=>{const next={...choices};delete next.material;onChoices(next);}}>Quitar material solicitado</button>}
    <p className={styles.fieldHelp}>Material y disponibilidad sujetos a confirmación al presupuestar.</p>
    <RequestedPreferenceField idPrefix={prefix} field="use" title="Uso previsto" options={guidedPreferences.use} value={request.use??''} onChange={use=>onRequest({...request,use})} adviceText="Necesito asesoramiento sobre el uso" limit={500}/>
    <details className={styles.contextHelp}><summary>¿Cómo elijo el material?</summary><p>Podés indicar una preferencia o pedir asesoramiento. El uso, la ubicación y la forma de colocación ayudan al equipo a confirmar una alternativa adecuada.</p></details>
  </div>;
  if(step===1){const w=Number(width.replace(',','.')),h=Number(height.replace(',','.'));const known=dimensions&&Number.isFinite(w)&&Number.isFinite(h)&&w>0&&h>0;const ratio=known?w/h:1.6;const rw=Math.min(160,100*ratio),rh=Math.min(100,160/ratio);
    return <div className={local.fields}>
      <fieldset className={styles.fieldset}><legend>¿Cómo querés definir las medidas?</legend><div className={styles.choiceGrid}>
        <label className={styles.choice}><input id={`${prefix}-measure-known`} type="radio" name={`${prefix}-measure-mode`} checked={dimensions} onChange={()=>onDimensions(true)}/><span><strong>Quiero indicar mis medidas</strong></span></label>
        <label className={styles.choice}><input id={`${prefix}-measure-advice`} type="radio" name={`${prefix}-measure-mode`} checked={!dimensions} onChange={()=>onDimensions(false)}/><span><strong>Necesito asesoramiento para definirlas</strong></span></label>
      </div></fieldset>
      {!dimensions && <p role="status" className={styles.fieldHelp}>No hace falta completar ancho ni alto. Las medidas que ya escribiste se conservan en este borrador y podés recuperarlas al volver a «Quiero indicar mis medidas». No se incluyen en la consulta mientras pedís asesoramiento.</p>}
      <figure className={local.diagram} aria-label={known?`Esquema orientativo: ancho ${w} cm, alto ${h} cm`:'Esquema orientativo con medidas a definir'}><svg viewBox="0 0 220 155" aria-hidden="true"><rect x={(220-Math.max(8,rw))/2} y={(125-Math.max(8,rh))/2} width={Math.max(8,rw)} height={Math.max(8,rh)} rx="3" fill="#eaf0ff" stroke="#1339ba" strokeWidth="2"/><text x="110" y="145" textAnchor="middle" fill="#07134b" fontSize="12">{known?`${w} × ${h} cm`:'Medidas a definir'}</text></svg><figcaption>Esquema orientativo; no previsualiza una impresión ni fija límites de fabricación.</figcaption></figure>
      {text('measurementsNotes','Observaciones sobre medidas (opcional)','Indicá cualquier aclaración. Podés pedir ayuda para definir las dimensiones.')}
    </div>;
  }
  return <div className={local.fields}>
    <RequestedPreferenceField idPrefix={prefix} field="finish" title="Terminación solicitada" options={guidedPreferences.finish} value={request.finish??''} onChange={finish=>onRequest({...request,finish})} advice={advice.includes('finish')} onAdvice={asking=>onAdvice(asking?[...advice.filter(f=>f!=='finish'),'finish']:advice.filter(f=>f!=='finish'))} adviceText="Necesito asesoramiento sobre la terminación" limit={500}/>
    <GuidedChoiceField idPrefix={prefix} field="design-status" label="¿Tenés un diseño preparado?" options={[
      ['preparado','Tengo un diseño preparado','Podrás coordinarlo con el equipo; aquí no se suben archivos.'],
      ['pendiente','Todavía no tengo un diseño preparado','Podés contar tu idea en las observaciones.'],
      ['asesoramiento','Necesito asesoramiento','Consultá cómo preparar tu diseño.'],
    ]} selected={request.design==='Tengo un diseño preparado'?'preparado':request.design==='Todavía no tengo un diseño preparado'?'pendiente':request.design==='Necesito asesoramiento sobre el diseño'?'asesoramiento':undefined} error={null} onChange={id=>{onRequest({...request,design:id==='preparado'?'Tengo un diseño preparado':id==='pendiente'?'Todavía no tengo un diseño preparado':'Necesito asesoramiento sobre el diseño'});onAdvice(id==='asesoramiento'?[...advice.filter(f=>f!=='design'),'design']:advice.filter(f=>f!=='design'));}}/>
    <button type="button" className={styles.smallLink} onClick={()=>onRequest({...request,design:''})}>Dejar el diseño sin definir</button>
    <details className={styles.contextHelp}><summary>¿Qué tengo que indicar sobre la terminación?</summary><p>Contanos cómo pensás instalar la lona. No hace falta elegir una terminación técnica: el equipo confirmará las posibilidades para tu solicitud.</p></details>
  </div>;
}
