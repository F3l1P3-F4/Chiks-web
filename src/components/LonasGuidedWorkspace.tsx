'use client';
import {useState} from 'react';
import type {ReactNode} from 'react';
import type {ConsultationProduct} from './ConsultationProvider';
import GuidedProductSelection from './guided/GuidedProductSelection';
import pilot from './RemerasProductDetail.module.css';
import layout from './RemerasGuidedWorkspace.module.css';

// Misma composición aprobada, sin duplicar el formulario ni su resumen.
export default function LonasGuidedWorkspace({gallery,product}:{gallery:ReactNode;product:ConsultationProduct}) {
  const [target,setTarget]=useState<HTMLDivElement|null>(null);
  return <div className={`${pilot.workspace} ${layout.workspace}`}>
    <div className={pilot.visualColumn} data-lonas-column="gallery">{gallery}</div>
    <GuidedProductSelection product={product} presentation="lonas-definitiva" summaryTarget={target}/>
    <div ref={setTarget} className={layout.summaryMount}/>
  </div>;
}
