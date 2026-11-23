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
  remeras: { kind: 'remeras', source: 'confirmed', fields: {}, sizes: [] },
  lonas: { kind: 'lonas', source: 'confirmed', fields: {}, sizes: [] },
};
export const kindFields: Record<GuidedKind, readonly ConfigurationField[]> = {
  remeras: ['model', 'material', 'color', 'technique', 'placement'],
  lonas: ['material', 'use', 'finish', 'design'],
};
