// Alternativas originales de F02. Importar este archivo sólo dentro del límite de desarrollo.
import type { GuidedCatalog } from './guidedCatalogs';
export const demoCatalogs: Record<'remeras' | 'lonas', GuidedCatalog> = {
  remeras: { kind: 'remeras', source: 'demo', sizes: ['S', 'M', 'L', 'XL'].map((id) => ({ id, label: id })), fields: {
    model: [{ id: 'recto', label: 'Corte recto', help: 'Ejemplo de silueta de líneas rectas.' }, { id: 'amplio', label: 'Corte amplio', help: 'Ejemplo de silueta más holgada.' }],
    material: [{ id: 'algodon', label: 'Algodón', help: 'Alternativa ilustrativa de fibra natural.' }, { id: 'poliester', label: 'Poliéster', help: 'Alternativa ilustrativa de fibra sintética.' }],
    color: [{ id: 'azul', label: 'Azul marino', color: '#07134b' }, { id: 'blanco', label: 'Blanco', color: '#fff' }, { id: 'negro', label: 'Negro', color: '#20222a' }],
    technique: [{ id: 'estampado', label: 'Estampado', help: 'Referencia de un diseño impreso sobre la prenda.' }, { id: 'bordado', label: 'Bordado', help: 'Referencia de un diseño realizado con hilos.' }],
    placement: [{ id: 'frente', label: 'Frente' }, { id: 'espalda', label: 'Espalda' }],
  } },
  lonas: { kind: 'lonas', source: 'demo', sizes: [], fields: {
    material: [{ id: 'frontlit', label: 'Frontlit', help: 'Superficie continua para impresión frontal.' }, { id: 'blackout', label: 'Blackout', help: 'Referencia que busca bloquear el paso de luz.' }, { id: 'mesh', label: 'Mesh', help: 'Referencia de una superficie con pequeños orificios.' }],
    use: [{ id: 'interior', label: 'Interior', help: 'Un espacio bajo techo.' }, { id: 'exterior', label: 'Exterior', help: 'Un espacio al aire libre.' }],
    finish: [{ id: 'ojales', label: 'Con ojales', help: 'Aberturas de referencia para una forma de sujeción.' }, { id: 'sin-ojales', label: 'Sin ojales' }],
    design: [{ id: 'preparado', label: 'Tengo una idea o diseño' }, { id: 'ayuda', label: 'Necesito ayuda para definirlo' }],
  } },
};
