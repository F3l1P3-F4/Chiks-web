'use client';

import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import Button from './Button';
import ConsultationCustomerDetails from './ConsultationCustomerDetails';
import { useConsultation } from './ConsultationProvider';
import { emptyCustomerDetails, validateCustomerDetails } from '@/lib/customerDetails';
import { buildConsultationMessage, validateConsultationProducts } from '@/lib/consultationMessage';
import { buildWhatsAppAction, whatsAppNumber } from '@/lib/whatsapp';

const conflictHelp = 'Resolvé primero los conflictos de sincronización indicados arriba.';
const draftHelp = 'Guardá los cambios de productos o resolvé sus borradores antes de revisar la solicitud.';
const externalLinkStyle = 'inline-flex items-center justify-center px-6 py-4 text-xs font-bold uppercase tracking-widest max-w-full text-center';

export default function ConsultationRequest({ hasProductDrafts }: { hasProductDrafts: boolean }) {
  const { items, ready, conflicts, readCurrent } = useConsultation();
  // Solo memoria de esta página; estos datos nunca se pasan al estado persistente.
  const [customer, setCustomer] = useState(() => ({ ...emptyCustomerDetails }));
  const [reviewedMessage, setReviewedMessage] = useState<string | null>(null);
  const [authorizedMessage, setAuthorizedMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; message: string | null; error: boolean } | null>(null);
  const [copying, setCopying] = useState(false);
  const previewTitle = useRef<HTMLHeadingElement>(null);
  const previewText = useRef<HTMLTextAreaElement>(null);
  const blockingReason = conflicts.length ? conflictHelp : hasProductDrafts ? draftHelp : validateConsultationProducts(items);
  const validCustomer = Object.keys(validateCustomerDetails(customer)).length === 0;
  const currentMessage = ready && !blockingReason && validCustomer ? buildConsultationMessage(items, customer) : null;
  const previewCurrent = reviewedMessage !== null && reviewedMessage === currentMessage;
  const authorized = previewCurrent && authorizedMessage === reviewedMessage;
  const action = whatsAppNumber && previewCurrent ? buildWhatsAppAction(whatsAppNumber, reviewedMessage!) : null;

  function latestMessage(): string | null {
    const current = readCurrent();
    const reason = current.conflicts.length ? conflictHelp : hasProductDrafts ? draftHelp : validateConsultationProducts(current.items);
    if (reason || !validCustomer) {
      setNotice({ text: reason ?? 'Revisá los datos de contacto antes de continuar.', message: null, error: true });
      return null;
    }
    return buildConsultationMessage(current.items, customer);
  }

  function review() {
    const message = latestMessage();
    if (message === null) return;
    setReviewedMessage(message);
    setAuthorizedMessage(null);
    setNotice(null);
    requestAnimationFrame(() => previewTitle.current?.focus());
  }

  function checkedMessage(): string | null {
    const message = latestMessage();
    if (message === null) return null;
    if (message !== reviewedMessage) {
      setNotice({ text: 'La consulta cambió. Volvé a revisar el resumen antes de copiarlo o abrir WhatsApp.', message: null, error: true });
      return null;
    }
    return message;
  }

  async function copy() {
    const message = checkedMessage();
    if (message === null) return;
    setCopying(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Portapapeles no disponible.');
      await navigator.clipboard.writeText(message);
      setNotice({ text: 'Resumen copiado. Podés pegarlo y enviarlo manualmente en WhatsApp.', message, error: false });
    } catch {
      setNotice({ text: 'El navegador no permitió copiar. Seleccioná el texto completo del resumen y copialo manualmente.', message, error: true });
      previewText.current?.focus();
      previewText.current?.select();
    } finally {
      setCopying(false);
    }
  }

  function beforeOpen(event: MouseEvent<HTMLAnchorElement>) {
    if (checkedMessage() === null || !authorized || !whatsAppNumber) event.preventDefault();
  }

  const visible = ready && items.length > 0;
  const activeNotice = notice && (notice.message === null || notice.message === currentMessage) ? notice : null;

  return (
    <>
      <ConsultationCustomerDetails visible={visible} values={customer} onChange={setCustomer} onReview={review} />
      {visible && <>
        {blockingReason && <p role="alert" className="mb-5 text-sm font-semibold">{blockingReason}</p>}
        {!whatsAppNumber && <p role="status" className="mb-5 text-sm">El canal de WhatsApp está pendiente de configuración. Podés revisar y copiar el resumen completo.</p>}
        {activeNotice && <p role={activeNotice.error ? 'alert' : 'status'} className="mb-5 text-sm font-semibold">{activeNotice.text}</p>}
        {reviewedMessage !== null && <section aria-labelledby="resumen-solicitud-title" className="internal-surface border border-divider p-6 mb-8 space-y-5">
          <h2 id="resumen-solicitud-title" tabIndex={-1} ref={previewTitle} className="text-xl focus-visible:outline-2 focus-visible:outline-offset-2">Revisá tu solicitud</h2>
          {!previewCurrent ? <p role="alert">La consulta cambió. Revisá los datos y pulsá «Revisar solicitud» para actualizar el resumen.</p> : <>
            <div>
              <label htmlFor="resumen-solicitud-texto" className="block text-sm font-bold mb-2">Mensaje completo del presupuesto</label>
              <textarea id="resumen-solicitud-texto" ref={previewText} value={reviewedMessage} readOnly rows={12}
                className="w-full min-w-0 rounded-lg border border-divider bg-white p-3 text-sm text-[#07134b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005bea]" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button showArrow={false} className="max-w-full text-center" disabled={copying} onClick={copy}>{copying ? 'Copiando…' : 'Copiar resumen completo'}</Button>
              <Button showArrow={false} className="max-w-full text-center" onClick={() => {
                setReviewedMessage(null);
                setAuthorizedMessage(null);
                setNotice(null);
                document.getElementById('cliente-fullName')?.focus();
              }}>Volver a editar</Button>
            </div>
            {action && <>
              <p id="whatsapp-privacy" className="text-sm">
                {action.prefilled
                  ? 'Al abrir WhatsApp con el mensaje precargado, tus datos se compartirán mediante una URL externa que puede quedar en el historial o en registros de navegación. También podés copiar el resumen y abrir el chat sin texto.'
                  : 'El resumen es extenso. Copialo completo y abrí el chat sin texto precargado; luego pegalo y envialo manualmente. Tus datos no se incluirán en la URL del chat.'}
              </p>
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" checked={authorized} onChange={(event) => setAuthorizedMessage(event.target.checked ? reviewedMessage : null)} aria-describedby="whatsapp-privacy whatsapp-confirmation"
                  className="mt-1 h-5 w-5 shrink-0 accent-[#a90062] focus-visible:outline-2 focus-visible:outline-offset-2" />
                <span>Entiendo cómo se compartirán mis datos y quiero continuar a WhatsApp.</span>
              </label>
              <div className="flex flex-wrap items-center gap-4">
                {authorized ? <>
                  <a href={action.url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" onClick={beforeOpen} aria-describedby="whatsapp-confirmation" data-button-variant="solid" className={externalLinkStyle}>
                    {action.prefilled ? 'Abrir WhatsApp con mi consulta' : 'Abrir chat de WhatsApp sin texto'}
                  </a>
                  {action.prefilled && <a href={action.chatUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" onClick={beforeOpen} className="py-2 text-sm font-bold underline underline-offset-4">Abrir chat sin texto precargado</a>}
                </> : <Button disabled variant="solid" className="max-w-full text-center" aria-describedby="whatsapp-privacy" showArrow={false}>Abrir WhatsApp</Button>}
              </div>
              <p id="whatsapp-confirmation" className="text-sm">Revisá el mensaje en WhatsApp y presioná Enviar para completar tu consulta. Los productos seguirán en Mi consulta.</p>
            </>}
          </>}
        </section>}
      </>}
    </>
  );
}
