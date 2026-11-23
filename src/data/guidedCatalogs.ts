// Sólo incorporar alternativas aprobadas por Aldana y Karina. Sin opciones de muestra.
export type GuidedKind = 'remeras' | 'lonas';
export type ConfigurationField = 'model' | 'material' | 'use' | 'color' | 'technique' | 'placement' | 'finish' | 'design';
export interface ConfigurationOption { id: string; label: string; help?: string; color?: string }
export interface GuidedCatalog {
  kind: GuidedKind;
  source: 'confirmed' | 'demo';
  fields: Partial<Record<ConfigurationField, readonly ConfigurationOption[]>>;
  sizes: readonly ConfigurationOption[];
}
export const configurationLabels: Record<ConfigurationField, string> = {
  model: 'Modelo', material: 'Material', use: 'Uso previsto', color: 'Color',
  technique: 'Técnica de personalización', placement: 'Ubicación del diseño', finish: 'Terminación', design: 'Diseño',
};
export const adviceLabels = { general: 'Asesoramiento general', model: 'Modelo', material: 'Material', sizes: 'Talles', measurements: 'Medidas', color: 'Color', customization: 'Personalización', finish: 'Terminación', design: 'Diseño' } as const;
export type AdviceField = keyof typeof adviceLabels;
export const productKinds: Readonly<Record<string, GuidedKind>> = { 'remeras-personalizadas': 'remeras', lonas: 'lonas' };
export const confirmedCatalogs: Record<GuidedKind, GuidedCatalog> = {
  // Opciones definidas en V11. Las muestras son aproximaciones digitales, no códigos Pantone.
  remeras: { kind: 'remeras', source: 'confirmed', fields: {
    technique: [{ id: 'vinilo', label: 'Estampa vinilo' }, { id: 'dtf', label: 'DTF' }],
    placement: [{ id: 'frente', label: 'Frente' }, { id: 'espalda', label: 'Espalda' }],
    color: [
      { id: 'blanco', label: 'Blanco', color: '#ffffff' }, { id: 'rojo', label: 'Rojo', color: '#cc2936' },
      { id: 'negro', label: 'Negro', color: '#202124' }, { id: 'amarillo', label: 'Amarillo', color: '#f4ce36' },
      { id: 'gris-shogin', label: 'Gris shogin', color: '#aeb0b4' }, { id: 'gris-oscuro', label: 'Gris oscuro', color: '#555961' },
      { id: 'azul-oscuro', label: 'Azul oscuro', color: '#182f59' }, { id: 'azul-francia', label: 'Azul Francia', color: '#2858c5' },
      { id: 'naranja', label: 'Naranja', color: '#ed812b' }, { id: 'verde', label: 'Verde', color: '#34814e' },
    ],
  }, sizes: [] },
  // V12: preferencias solicitadas; no confirma stock ni terminaciones.
  lonas: { kind: 'lonas', source: 'confirmed', fields: { material: [
    {id:'frontlit',label:'Frontlit',help:'Preferencia para consultar con el equipo.'},
    {id:'blackout',label:'Blackout',help:'Preferencia para consultar con el equipo.'},
    {id:'mesh',label:'Mesh',help:'Preferencia para consultar con el equipo.'},
  ] }, sizes: [] },
};
export const kindFields: Record<GuidedKind, readonly ConfigurationField[]> = {
  remeras: ['model', 'material', 'color', 'technique', 'placement'],
  lonas: ['material', 'use', 'finish', 'design'],
};
