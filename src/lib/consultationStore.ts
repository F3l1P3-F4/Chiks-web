import { cleanConfiguration, configurationKeyValid, configurationShape, itemKey, selectionVersion, validateConfiguration } from './consultationConfiguration';
import type { ConsultationItem, ConsultationProduct } from './consultationConfiguration';
import type { GuidedCatalog } from '../data/guidedCatalogs';

export const CONSULTATION_STORAGE_KEY = 'las-chikas-design:consulta:v1';
export type SaveResult = 'saved' | 'temporary' | 'conflict';
export interface ConsultationConflict extends ConsultationProduct { key: string; local: ConsultationItem | null; remote: ConsultationItem | null }
interface PendingChange { base: ConsultationItem | null; value: ConsultationItem | null }
export interface StorageAdapter { read: () => string | null; write: (raw: string) => void }
const EMPTY = '{"version":1,"items":[]}';

export function parseConsultation(raw: string, products: readonly ConsultationProduct[], demo = false) {
  const items = new Map<string, ConsultationItem>();
  let storageIssue: string | null = null;
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.items)) throw Error();
    for (const entry of data.items) {
      const product = products.find((product) => product.id === entry?.id);
      if (!product || !Number.isSafeInteger(entry.quantity) || entry.quantity <= 0 || typeof entry.notes !== 'string' || entry.notes.length > 2000 ||
        (entry.configurationId !== undefined && (!configurationKeyValid(entry.configurationId) || !configurationShape(entry.configuration, product.id))) ||
        (entry.configuration !== undefined && (!configurationShape(entry.configuration, product.id) || (!demo && entry.configuration.source === 'demo')))) {
        storageIssue = 'Hay selecciones guardadas que no se pueden interpretar. No se sobrescribirá el almacenamiento; conservá esta pestaña y solicitá ayuda para recuperar los datos.';
        continue;
      }
      const item: ConsultationItem = { ...product, quantity: entry.quantity, notes: entry.notes,
        ...(entry.configurationId ? { configurationId: entry.configurationId } : {}),
        ...(entry.configuration ? { configuration: cleanConfiguration(entry.configuration) } : {}),
      };
      if (items.has(itemKey(item))) { storageIssue = 'Hay identificadores de selección duplicados. No se sobrescribirá el almacenamiento hasta revisar los datos.'; continue; }
      items.set(itemKey(item), item);
    }
  } catch { storageIssue = 'El almacenamiento de Mi consulta está dañado o pertenece a una versión desconocida. No se borrará ni reemplazará automáticamente.'; }
  return { items: [...items.values()], storageIssue };
}
function mergeItems(stored: ConsultationItem[], changes: Map<string, PendingChange>) {
  const items = new Map(stored.map((item) => [itemKey(item), item]));
  for (const [key, change] of changes) { if (change.value) items.set(key, change.value); else items.delete(key); }
  return [...items.values()];
}
function conflictsFor(stored: ConsultationItem[], changes: Map<string, PendingChange>): ConsultationConflict[] {
  return [...changes].flatMap(([key, change]) => {
    const remote = stored.find((item) => itemKey(item) === key) ?? null;
    if (selectionVersion(remote) === selectionVersion(change.value) || selectionVersion(remote) === selectionVersion(change.base)) return [];
    const product = change.value ?? change.base ?? remote;
    return product ? [{ id: product.id, name: product.name, path: product.path, key, local: change.value, remote }] : [];
  });
}

// Una instancia por Provider: la demostración no comparte almacenamiento ni pendientes con R4.
export function createConsultationStore(products: readonly ConsultationProduct[], adapter: StorageAdapter, demoCatalog?: GuidedCatalog) {
  let lastStored = EMPTY;
  const pending = new Map<string, PendingChange>();
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());
  const readStorage = () => { try { lastStored = adapter.read() ?? EMPTY; return { raw: lastStored, readable: true }; } catch { return { raw: lastStored, readable: false }; } };
  const parse = (raw: string) => parseConsultation(raw, products, !!demoCatalog);
  const getSnapshot = () => JSON.stringify({ ...readStorage(), pending: [...pending] });
  function stateFromSnapshot(raw: string | null) {
    const value = raw ? JSON.parse(raw) : { raw: EMPTY, readable: true, pending: [] };
    const stored = parse(value.raw);
    const changes = new Map<string, PendingChange>(value.pending);
    const pendingIds = [...changes].filter(([key, change]) => selectionVersion(stored.items.find((item) => itemKey(item) === key)) !== selectionVersion(change.value)).map(([key]) => key);
    return { items: mergeItems(stored.items, changes), conflicts: conflictsFor(stored.items, changes), pendingIds, pendingCount: pendingIds.length, readable: value.readable as boolean, storageIssue: stored.storageIssue };
  }
  function retry(): SaveResult {
    const storage = readStorage(), stored = parse(storage.raw);
    if (stored.storageIssue || conflictsFor(stored.items, pending).length) { notify(); return 'conflict'; }
    if (!storage.readable) { notify(); return 'temporary'; }
    const updated = JSON.stringify({ version: 1, items: mergeItems(stored.items, pending) });
    let result: SaveResult = 'saved';
    try { adapter.write(updated); lastStored = updated; pending.clear(); } catch { result = 'temporary'; }
    notify();return result;
  }
  function change(key: string, value: ConsultationItem | null, expected: ConsultationItem | null): SaveResult {
    const stored = parse(readStorage().raw);
    const current = mergeItems(stored.items, pending).find((item) => itemKey(item) === key);
    if (stored.storageIssue || selectionVersion(current) !== selectionVersion(expected) || conflictsFor(stored.items, pending).length) { notify(); return 'conflict'; }
    pending.set(key, { base: pending.has(key) ? pending.get(key)!.base : stored.items.find((item) => itemKey(item) === key) ?? null, value });
    return retry();
  }
  async function exclusive(action: () => SaveResult): Promise<SaveResult> {
    if (demoCatalog || typeof navigator === 'undefined' || !navigator.locks) return action();
    let started = false;
    try { return await navigator.locks.request(CONSULTATION_STORAGE_KEY, () => { started = true;return action(); }); }
    catch (error) { if (started) throw error;return action(); }
  }
  return {
    getSnapshot, stateFromSnapshot,
    subscribe: (listener: () => void) => { listeners.add(listener);return () => { listeners.delete(listener); }; },
    onStorage(raw?: string | null) {
      const storage = readStorage();
      if (!storage.readable && raw !== undefined) lastStored = raw ?? EMPTY;
      const stored = parse(lastStored);
      if (!stored.storageIssue) for (const [key, change] of pending) if (selectionVersion(stored.items.find((item) => itemKey(item) === key)) === selectionVersion(change.value)) pending.delete(key);
      notify();
    },
    readCurrent() { const state = stateFromSnapshot(getSnapshot());notify();return { items: state.items, conflicts: state.conflicts, storageIssue: state.storageIssue }; },
    save(item: ConsultationItem, expected: ConsultationItem | null) {
      const product = products.find((product) => product.id === item.id);
      const problem = validateConfiguration(item, demoCatalog, !!demoCatalog);
      if (!product || !Number.isSafeInteger(item.quantity) || item.quantity <= 0 || typeof item.notes !== 'string' || item.notes.length > 2000 || problem) return Promise.reject(Error(problem ?? 'Revisá la cantidad y las observaciones.'));
      const value: ConsultationItem = { ...product, quantity: item.quantity, notes: item.notes,
        ...(item.configuration ? { configurationId: item.configurationId, configuration: cleanConfiguration(item.configuration) } : {}),
      };
      return exclusive(() => change(itemKey(value), value, expected));
    },
    remove: (key: string, expected: ConsultationItem | null) => exclusive(() => change(key, null, expected)),
    retry: () => exclusive(retry),
    resolve: (key: string, choice: 'local' | 'remote') => exclusive(() => {
      const entry = pending.get(key);
      if (entry) { if (choice === 'remote') pending.delete(key);else entry.base = parse(readStorage().raw).items.find((item) => itemKey(item) === key) ?? null; }
      return retry();
    }),
  };
}
