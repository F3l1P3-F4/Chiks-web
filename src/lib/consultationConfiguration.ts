import { adviceLabels, configurationLabels, confirmedCatalogs, kindFields, productKinds } from '../data/guidedCatalogs';
import type { AdviceField, ConfigurationField, ConfigurationOption, GuidedCatalog, GuidedKind } from '../data/guidedCatalogs';

export interface ProductConfiguration {
  version: 1;
  kind: GuidedKind;
  source: 'confirmed' | 'demo';
  choices: Partial<Record<ConfigurationField, Pick<ConfigurationOption, 'id' | 'label'>>>;
  sizes: { id: string; label: string; quantity: number }[];
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
  if (value.advice.some((field: unknown) => typeof field !== 'string' || !Object.hasOwn(adviceLabels, field)) || new Set(value.advice).size !== value.advice.length) return false;
  if (value.measurements !== undefined && (value.kind !== 'lonas' || !object(value.measurements) || !positive(value.measurements.width) || !positive(value.measurements.height) || !['cm', 'm'].includes(String(value.measurements.unit)))) return false;
  return true;
}
// Elimina campos desconocidos antes de persistir: nunca copiar objetos completos externos.
export function cleanConfiguration(value: ProductConfiguration): ProductConfiguration {
  return {
    version: 1, kind: value.kind, source: value.source,
    choices: Object.fromEntries(Object.entries(value.choices).sort(([a], [b]) => a.localeCompare(b)).map(([key, option]) => [key, { id: option!.id, label: option!.label }])),
    sizes: value.sizes.map(({ id, label, quantity }) => ({ id, label, quantity })),
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
  for (const size of config.sizes) if (!catalog.sizes.some((candidate) => candidate.id === size.id && candidate.label === size.label)) issues.push(`Talle: ${size.label}`);
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
  if (unavailableOptions(config, catalog).length) return 'Hay opciones que ya no están confirmadas. Revisá la configuración antes de guardar o preparar el presupuesto.';
  return null;
}
export function configurationRows(config?: ProductConfiguration): { label: string; value: string }[] {
  if (!config) return [];
  return [
    ...Object.entries(configurationLabels).flatMap(([field, label]) => config.choices[field as ConfigurationField] ? [{ label, value: config.choices[field as ConfigurationField]!.label }] : []),
    ...(config.sizes.length ? [{ label: 'Talles y cantidades', value: config.sizes.map((size) => `${size.label}: ${size.quantity}`).join(' · ') }] : []),
    ...(config.measurements ? [{ label: 'Medidas solicitadas', value: `${config.measurements.width} × ${config.measurements.height} ${config.measurements.unit}` }] : []),
    ...(config.advice.length ? [{ label: 'Asesoramiento solicitado', value: config.advice.map((field) => adviceLabels[field]).join(' · ') }] : []),
  ];
}
