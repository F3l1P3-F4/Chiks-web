'use client';

import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { emptyCustomerDetails } from '@/lib/customerDetails';
import type { CustomerDetails } from '@/lib/customerDetails';

const CustomerDraftContext = createContext<{ customer: CustomerDetails; setCustomer: Dispatch<SetStateAction<CustomerDetails>> } | null>(null);

// Separado del store persistente: vive sólo mientras esta pestaña mantiene la aplicación abierta.
export default function ConsultationCustomerDraft({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState(() => ({ ...emptyCustomerDetails }));
  return <CustomerDraftContext.Provider value={{ customer, setCustomer }}>{children}</CustomerDraftContext.Provider>;
}

export function useConsultationCustomerDraft() {
  const context = useContext(CustomerDraftContext);
  if (!context) throw Error('Falta el contexto temporal de datos de contacto.');
  return context;
}
