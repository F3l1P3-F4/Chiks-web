'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

export interface ConsultationProduct { id: string; name: string; path: string }
export interface ConsultationItem extends ConsultationProduct { quantity: number; notes: string }
export type SaveResult = 'saved' | 'temporary' | 'conflict';
interface PendingChange { base: ConsultationItem | null; value: ConsultationItem | null }
interface Conflict extends ConsultationProduct { local: ConsultationItem | null; remote: ConsultationItem | null }

export const CONSULTATION_STORAGE_KEY = 'las-chikas-design:consulta:v1';
const CHANGED_EVENT = 'las-chikas-design:consulta-cambiada';
const EMPTY = '{"version":1,"items":[]}';
let lastStored = EMPTY;
const pending = new Map<string, PendingChange>();

export function selectionVersion(item: ConsultationItem | null | undefined) {
  return item ? JSON.stringify([item.quantity, item.notes]) : null;
}

function readStorage() {
  try {
    lastStored = localStorage.getItem(CONSULTATION_STORAGE_KEY) ?? EMPTY;
    return { raw: lastStored, readable: true };
  } catch {
    return { raw: lastStored, readable: false };
  }
}

function snapshot() {
  return JSON.stringify({ ...readStorage(), pending: [...pending] });
}

function readItems(raw: string, products: ConsultationProduct[]): ConsultationItem[] {
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.items)) return [];
    const items = new Map<string, ConsultationItem>();
    for (const entry of data.items) {
      if (!entry || typeof entry !== 'object') continue;
      const product = products.find((product) => product.id === entry.id);
      if (!product || !Number.isSafeInteger(entry.quantity) || entry.quantity <= 0 || typeof entry.notes !== 'string') continue;
      items.set(product.id, { ...product, quantity: entry.quantity, notes: entry.notes.slice(0, 2000) });
    }
    return [...items.values()];
  } catch {
    return [];
  }
}

function mergeItems(stored: ConsultationItem[], changes: Map<string, PendingChange>) {
  const items = new Map(stored.map((item) => [item.id, item]));
  for (const [id, change] of changes) {
    if (change.value) items.set(id, change.value);
    else items.delete(id);
  }
  return [...items.values()];
}

function conflictsFor(stored: ConsultationItem[], changes: Map<string, PendingChange>, products: ConsultationProduct[]): Conflict[] {
  const conflicts: Conflict[] = [];
  for (const [id, change] of changes) {
    const remote = stored.find((item) => item.id === id) ?? null;
    if (selectionVersion(remote) === selectionVersion(change.value) || selectionVersion(remote) === selectionVersion(change.base)) continue;
    const product = products.find((product) => product.id === id);
    if (product) conflicts.push({ ...product, local: change.value, remote });
  }
  return conflicts;
}

function notifyChanged() {
  window.dispatchEvent(new Event(CHANGED_EVENT));
}

interface ConsultationState {
  items: ConsultationItem[];
  ready: boolean;
  pendingCount: number;
  pendingIds: string[];
  conflicts: Conflict[];
  readable: boolean;
  readCurrent: () => { items: ConsultationItem[]; conflicts: Conflict[] };
  save: (item: ConsultationItem, expected: ConsultationItem | null) => Promise<SaveResult>;
  remove: (id: string, expected: ConsultationItem | null) => Promise<SaveResult>;
  retry: () => Promise<SaveResult>;
  resolve: (id: string, choice: 'local' | 'remote') => Promise<SaveResult>;
}

async function exclusive(action: () => SaveResult): Promise<SaveResult> {
  // Serializa las escrituras de pestañas que usan esta versión del sitio.
  if (!navigator.locks) return action();
  let started = false;
  try {
    return await navigator.locks.request(CONSULTATION_STORAGE_KEY, () => {
      started = true;
      return action();
    });
  } catch (error) {
    if (started) throw error;
    return action();
  }
}

const ConsultationContext = createContext<ConsultationState | null>(null);

export default function ConsultationProvider({ products, children }: { products: ConsultationProduct[]; children: ReactNode }) {
  const subscribe = useCallback((notify: () => void) => {
    const storage = (event: StorageEvent) => {
      if (event.key !== CONSULTATION_STORAGE_KEY && event.key !== null) return;
      const stored = readItems(readStorage().raw, products);
      // Solo retirar operaciones cuyo resultado ya está realmente guardado.
      for (const [id, change] of pending) {
        if (selectionVersion(stored.find((item) => item.id === id)) === selectionVersion(change.value)) pending.delete(id);
      }
      notify();
    };
    window.addEventListener('storage', storage);
    window.addEventListener(CHANGED_EVENT, notify);
    return () => {
      window.removeEventListener('storage', storage);
      window.removeEventListener(CHANGED_EVENT, notify);
    };
  }, [products]);
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const state = useMemo(() => {
    const value = raw ? JSON.parse(raw) : { raw: EMPTY, readable: true, pending: [] };
    const stored = readItems(value.raw, products);
    const changes = new Map<string, PendingChange>(value.pending);
    const pendingIds = [...changes].filter(([id, change]) => selectionVersion(stored.find((item) => item.id === id)) !== selectionVersion(change.value)).map(([id]) => id);
    return {
      items: mergeItems(stored, changes),
      conflicts: conflictsFor(stored, changes, products),
      pendingCount: pendingIds.length,
      pendingIds,
      readable: value.readable as boolean,
    };
  }, [raw, products]);

  function retry(): SaveResult {
    const storage = readStorage();
    const stored = readItems(storage.raw, products);
    if (conflictsFor(stored, pending, products).length) {
      notifyChanged();
      return 'conflict';
    }
    if (!storage.readable) {
      notifyChanged();
      return 'temporary';
    }
    const updated = JSON.stringify({ version: 1, items: mergeItems(stored, pending) });
    let result: SaveResult = 'saved';
    try {
      localStorage.setItem(CONSULTATION_STORAGE_KEY, updated);
      lastStored = updated;
      pending.clear();
    } catch {
      result = 'temporary';
    }
    notifyChanged();
    return result;
  }

  // Releer antes de copiar o abrir WhatsApp, incluso si el evento remoto aún no llegó.
  function readCurrent() {
    const stored = readItems(readStorage().raw, products);
    const current = { items: mergeItems(stored, pending), conflicts: conflictsFor(stored, pending, products) };
    notifyChanged();
    return current;
  }

  function change(id: string, value: ConsultationItem | null, expected: ConsultationItem | null): SaveResult {
    const stored = readItems(readStorage().raw, products);
    const current = mergeItems(stored, pending).find((item) => item.id === id);
    if (selectionVersion(current) !== selectionVersion(expected) || conflictsFor(stored, pending, products).length) {
      notifyChanged();
      return 'conflict';
    }
    pending.set(id, { base: pending.get(id)?.base ?? stored.find((item) => item.id === id) ?? null, value });
    return retry();
  }

  function save(item: ConsultationItem, expected: ConsultationItem | null) {
    const product = products.find((product) => product.id === item.id);
    if (!product || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) throw new Error('Cantidad inválida.');
    return exclusive(() => change(item.id, { ...product, quantity: item.quantity, notes: item.notes.slice(0, 2000) }, expected));
  }

  function remove(id: string, expected: ConsultationItem | null) {
    return exclusive(() => change(id, null, expected));
  }

  function resolve(id: string, choice: 'local' | 'remote') {
    return exclusive(() => {
      const entry = pending.get(id);
      if (entry) {
        if (choice === 'remote') pending.delete(id);
        else entry.base = readItems(readStorage().raw, products).find((item) => item.id === id) ?? null;
      }
      return retry();
    });
  }

  return <ConsultationContext.Provider value={{ ...state, ready: raw !== null, readCurrent, save, remove, retry: () => exclusive(retry), resolve }}>{children}</ConsultationContext.Provider>;
}

export function useConsultation() {
  const value = useContext(ConsultationContext);
  if (!value) throw new Error('Falta ConsultationProvider.');
  return value;
}
