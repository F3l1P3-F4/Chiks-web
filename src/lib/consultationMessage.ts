import type { ConsultationItem } from '../components/ConsultationProvider';
import { validateCustomerDetails } from './customerDetails';
import type { CustomerDetails } from './customerDetails';
import { configurationRows, itemKey, validateConfiguration } from './consultationConfiguration';
import type { GuidedCatalog } from '../data/guidedCatalogs';

export function validateConsultationProducts(items: readonly ConsultationItem[], demoCatalog?: GuidedCatalog): string | null {
  if (!items.length) return 'Agregá al menos un producto antes de preparar la solicitud.';
  const ids = new Set<string>();
  for (const item of items) {
    if (!item.id || !item.name.trim() || ids.has(itemKey(item))) return 'Revisá los productos de tu consulta antes de continuar.';
    if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) return 'Todas las cantidades deben ser enteras positivas.';
    if (typeof item.notes !== 'string' || item.notes.length > 2000) return 'Las observaciones de cada producto deben tener hasta 2.000 caracteres.';
    const configurationError = validateConfiguration(item, demoCatalog, demoCatalog?.source === 'demo');
    if (configurationError) return configurationError;
    ids.add(itemKey(item));
  }
  return null;
}

export function buildConsultationMessage(items: readonly ConsultationItem[], customer: CustomerDetails, demoCatalog?: GuidedCatalog): string {
  const error = validateConsultationProducts(items, demoCatalog);
  if (error) throw new Error(error);
  if (Object.keys(validateCustomerDetails(customer)).length) throw new Error('Revisá los datos de contacto antes de continuar.');

  const contact = [
    'Datos del cliente',
    `Nombre y apellido: ${customer.fullName.trim()}`,
    `Celular: ${customer.phone.trim()}`,
    ...(customer.email.trim() ? [`Correo electrónico: ${customer.email.trim()}`] : []),
  ].join('\n');
  const products = items.map((item, index) => [
    `${index + 1}. ${item.name}`,
    ...(item.configuration && items.filter((entry) => entry.id === item.id).length > 1 ? [`Configuración ${items.slice(0, index + 1).filter((entry) => entry.id === item.id).length} de ${items.filter((entry) => entry.id === item.id).length}`] : []),
    `${item.configuration ? 'Cantidad total' : 'Cantidad'}: ${item.quantity}`,
    ...configurationRows(item.configuration).map((row) => `${row.label}: ${row.value}`),
    ...(item.notes.trim() ? [`Observaciones: ${item.notes}`] : []),
  ].join('\n')).join('\n\n');

  return [
    demoCatalog ? 'DEMOSTRACIÓN AISLADA — NO ENVIAR — Opciones sin confirmar' : 'Solicitud de presupuesto — Las Chikas Design',
    contact,
    `Productos seleccionados\n${products}`,
    ...(customer.comment.trim() ? [`Comentario general\n${customer.comment.trim()}`] : []),
  ].join('\n\n');
}
