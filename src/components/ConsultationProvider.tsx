'use client';

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { CONSULTATION_STORAGE_KEY, createConsultationStore } from '@/lib/consultationStore';
import type { GuidedCatalog } from '@/data/guidedCatalogs';
import type { ConsultationProduct } from '@/lib/consultationConfiguration';
import ConsultationCustomerDraft from './ConsultationCustomerDraft';
export { CONSULTATION_STORAGE_KEY } from '@/lib/consultationStore';
export { itemKey, selectionVersion } from '@/lib/consultationConfiguration';
export type { ConsultationProduct, ConsultationItem } from '@/lib/consultationConfiguration';
export type { SaveResult } from '@/lib/consultationStore';

type Store = ReturnType<typeof createConsultationStore>;
type ConsultationState = ReturnType<Store['stateFromSnapshot']> & Pick<Store, 'readCurrent' | 'save' | 'remove' | 'retry' | 'resolve'> & { ready: boolean; demoCatalog?: GuidedCatalog };
const ConsultationContext = createContext<ConsultationState | null>(null);
export default function ConsultationProvider({ products, children, demoCatalog }: { products: ConsultationProduct[]; children: ReactNode; demoCatalog?: GuidedCatalog }) {
  const [store] = useState(() => {
    let memory: string | null = null;
    return createConsultationStore(products, demoCatalog ? { read: () => memory, write: (raw) => { memory = raw; } } : {
      read: () => localStorage.getItem(CONSULTATION_STORAGE_KEY),
      write: (raw) => localStorage.setItem(CONSULTATION_STORAGE_KEY, raw),
    }, demoCatalog);
  });
  useEffect(() => {
    if (demoCatalog) return;
    const storage = (event: StorageEvent) => { if (event.key === CONSULTATION_STORAGE_KEY || event.key === null) store.onStorage(event.newValue); };
    window.addEventListener('storage', storage);
    return () => window.removeEventListener('storage', storage);
  }, [store, demoCatalog]);
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, () => null);
  const state = useMemo(() => store.stateFromSnapshot(raw), [store, raw]);
  return <ConsultationContext.Provider value={{ ...state, ready: raw !== null, demoCatalog, readCurrent: store.readCurrent, save: store.save, remove: store.remove, retry: store.retry, resolve: store.resolve }}><ConsultationCustomerDraft>{children}</ConsultationCustomerDraft></ConsultationContext.Provider>;
}
export function useConsultation() {
  const context = useContext(ConsultationContext);
  if (!context) throw Error('Falta ConsultationProvider.');
  return context;
}
