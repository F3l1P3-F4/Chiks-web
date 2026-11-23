import { adviceLabels, configurationLabels, confirmedCatalogs, kindFields, productKinds } from '../data/guidedCatalogs';
import type { AdviceField, ConfigurationField, ConfigurationOption, GuidedCatalog, GuidedKind } from '../data/guidedCatalogs';

export interface ProductConfiguration {
  version: 1;
  kind: GuidedKind;
  source: 'confirmed' | 'demo';
  choices: Partial<Record<ConfigurationField, Pick<ConfigurationOption, 'id' | 'label'>>>;
  sizes: { id: string; label: string; quantity: number; requested?: true }[];
  requests?: { model?: string; material?: string; sizesNotes?: string };
  lonaRequest?: { use?: string; finish?: string; design?: string; measurementsNotes?: string };
  placements?: Pick<ConfigurationOption, 'id' | 'label'>[];
  measurements?: { width: number; height: number; unit: 'cm' | 'm' };
  advice: AdviceField[];
}
export interface ConsultationProduct { id: string; name: string; path: string }
export interface ConsultationItem extends ConsultationProduct {
  quantity: number;
  notes: string;
  configurationId?: string;
  configuration?: ProductConfiguration;
}
export const itemKey = (item: ConsultationItem) => item.configurationId ?? item.id;
export const configurationKeyValid = (value: unknown): value is string => typeof value === 'string' && /^cfg-[a-zA-Z0-9-]{8,76}$/.test(value);
export function selectionVersion(item: ConsultationItem | null | undefined) {
  return item ? JSON.stringify([item.id, item.quantity, item.notes, item.configurationId ?? null, item.configuration ?? null]) : null;
}
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const label = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= 120;
const positive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;
export function configurationShape(value: unknown, productId: string): value is ProductConfiguration {
  if (!productKinds[productId] || !object(value) || value.version !== 1 || value.kind !== productKinds[productId] || !['confirmed', 'demo'].includes(String(value.source))) return false;
  if (!object(value.choices) || !Array.isArray(value.sizes) || value.sizes.length > 40 || !Array.isArray(value.advice) || value.advice.length > 10) return false;
  if (Object.entries(value.choices).some(([field, option]) => !kindFields[value.kind as GuidedKind].includes(field as ConfigurationField) || !object(option) || !label(option.id) || !label(option.label))) return false;
  if (value.sizes.length && value.kind !== 'remeras') return false;
  if (value.sizes.some((size: unknown) => !object(size) || !label(size.id) || !label(size.label) || !Number.isSafeInteger(size.quantity) || Number(size.quantity) <= 0)) return false;
  if (new Set(value.sizes.map((size: { id: string }) => size.id)).size !== value.sizes.length) return false;
  if (value.sizes.some((size: Record<string, unknown>) => size.requested !== undefined && size.requested !== true)) return false;
  if (value.requests !== undefined && (value.kind !== 'remeras' || !object(value.requests) || Object.entries(value.requests).some(([key, text]) => !['model', 'material', 'sizesNotes'].includes(key) || typeof text !== 'string' || !text.trim() || text.length > (key === 'sizesNotes' ? 500 : 120)))) return false;
  if (value.lonaRequest !== undefined && (value.kind !== 'lonas' || !object(value.lonaRequest) || Object.entries(value.lonaRequest).some(([key,text]) => !['use','finish','design','measurementsNotes'].includes(key) || typeof text !== 'string' || !text.trim() || text.length>500))) return false;
  if (value.placements !== undefined && (value.kind !== 'remeras' || !Array.isArray(value.placements) || value.placements.length > 2 || value.placements.some((p: unknown) => !object(p) || !label(p.id) || !label(p.label)) || new Set(value.placements.map((p: {id:string}) => p.id)).size !== value.placements.length || value.choices.placement)) return false;
  if (value.advice.some((field: unknown) => typeof field !== 'string' || !Object.hasOwn(adviceLabels, field)) || new Set(value.advice).size !== value.advice.length) return false;
  if (value.measurements !== undefined && (value.kind !== 'lonas' || !object(value.measurements) || !positive(value.measurements.width) || !positive(value.measurements.height) || !['cm', 'm'].includes(String(value.measurements.unit)))) return false;
  return true;
}
// Elimina campos desconocidos antes de persistir: nunca copiar objetos completos externos.
export function cleanConfiguration(value: ProductConfiguration): ProductConfiguration {
  return {
    version: 1, kind: value.kind, source: value.source,
    choices: Object.fromEntries(Object.entries(value.choices).sort(([a], [b]) => a.localeCompare(b)).map(([key, option]) => [key, { id: option!.id, label: option!.label }])),
    sizes: value.sizes.map(({ id, label, quantity, requested }) => ({ id, label, quantity, ...(requested ? { requested: true as const } : {}) })),
    ...(value.requests && Object.keys(value.requests).length ? { requests: Object.fromEntries(Object.entries(value.requests).filter(([,text]) => text?.trim())) } : {}),
    ...(value.placements?.length ? { placements: value.placements.map(({id,label}) => ({id,label})) } : {}),
    ...(value.lonaRequest && Object.values(value.lonaRequest).some(text=>text?.trim()) ? {lonaRequest:Object.fromEntries(['use','finish','design','measurementsNotes'].flatMap(key=>{const text=value.lonaRequest?.[key as keyof NonNullable<ProductConfiguration['lonaRequest']>];return text?.trim()?[[key,text]]:[];}))} : {}),
    ...(value.measurements ? { measurements: { width: value.measurements.width, height: value.measurements.height, unit: value.measurements.unit } } : {}),
    advice: [...value.advice].sort(),
  };
}
export function unavailableOptions(config: ProductConfiguration, catalog: GuidedCatalog = confirmedCatalogs[config.kind]): string[] {
  const issues: string[] = [];
  for (const [field, option] of Object.entries(config.choices)) {
    const current = catalog.fields[field as ConfigurationField]?.find((candidate) => candidate.id === option!.id);
    if (!current || current.label !== option!.label) issues.push(`${configurationLabels[field as ConfigurationField]}: ${option!.label}`);
  }
  for (const size of config.sizes) if (!size.requested && !catalog.sizes.some((candidate) => candidate.id === size.id && candidate.label === size.label)) issues.push(`Talle: ${size.label}`);
  for (const option of config.placements ?? []) if (!catalog.fields.placement?.some((candidate) => candidate.id === option.id && candidate.label === option.label)) issues.push(`Ubicación del diseño: ${option.label}`);
  return issues;
}
export function validateConfiguration(item: ConsultationItem, catalog?: GuidedCatalog, allowDemo = false): string | null {
  const config = item.configuration;
  if (!config) return item.configurationId ? 'Falta la configuración de esta selección.' : null;
  if ((item.configurationId !== undefined && !configurationKeyValid(item.configurationId)) || !configurationShape(config, item.id)) return 'Revisá la configuración del producto.';
  if (config.source === 'demo' && !allowDemo) return 'Las opciones de demostración no pueden incorporarse a una solicitud comercial.';
  const activeCatalog = catalog ?? confirmedCatalogs[config.kind];
  if (activeCatalog.kind !== config.kind || activeCatalog.source !== config.source) return 'Las opciones no corresponden al catálogo de este producto.';
  if (config.sizes.length && config.sizes.reduce((sum, size) => sum + size.quantity, 0) !== item.quantity) return 'El total debe coincidir con las cantidades por talle.';
  if (new Set(config.sizes.map(size => size.label.trim().toLocaleLowerCase('es'))).size !== config.sizes.length) return 'No repitas el mismo talle; sumá sus cantidades en una sola fila.';
  if (config.requests?.model && config.choices.model || config.requests?.material && config.choices.material) return 'Revisá la solicitud y la selección de modelo o material para evitar datos contradictorios.';
  if (unavailableOptions(config, catalog).length) return 'Hay opciones que ya no están confirmadas. Revisá la configuración antes de guardar o preparar el presupuesto.';
  return null;
}
export function configurationRows(config?: ProductConfiguration): { label: string; value: string }[] {
  if (!config) return [];
  return [
    ...(config.requests?.model ? [{label:'Modelo solicitado',value:config.requests.model}] : []),
    ...(config.requests?.material ? [{label:'Material solicitado',value:config.requests.material}] : []),
    ...Object.entries(configurationLabels).flatMap(([field, label]) => config.choices[field as ConfigurationField] ? [{ label:config.kind==='lonas'&&field==='material'?'Material solicitado':label, value: config.choices[field as ConfigurationField]!.label }] : []),
    ...([['use','Uso previsto'],['finish','Terminación solicitada'],['design','Información del diseño'],['measurementsNotes','Observaciones sobre medidas']] as const).flatMap(([field,label])=>config.lonaRequest?.[field]?[{label,value:config.lonaRequest[field]!}]:[]),
    ...(config.sizes.length ? [{ label: 'Talles y cantidades', value: config.sizes.map((size) => `${size.label}: ${size.quantity}`).join(' · ') }] : []),
    ...(config.requests?.sizesNotes ? [{label:'Observaciones sobre talles',value:config.requests.sizesNotes}] : []),
    ...(config.placements?.length ? [{label:'Ubicación del diseño',value:config.placements.map(p=>p.label).join(' y ')}] : []),
    ...(config.measurements ? [{ label: 'Medidas solicitadas', value: `${config.measurements.width} × ${config.measurements.height} ${config.measurements.unit}` }] : []),
    ...(config.advice.length ? [{ label: 'Asesoramiento solicitado', value: config.advice.map((field) => adviceLabels[field]).join(' · ') }] : []),
  ];
}
