'use client';

import { useState } from 'react';
import Button from './Button';
import { customerDetailsLimits, validateCustomerDetails } from '@/lib/customerDetails';
import type { CustomerDetails, CustomerField } from '@/lib/customerDetails';

const fields = [
  { name: 'fullName', label: 'Nombre y apellido', type: 'text', autoComplete: 'name', required: true, help: 'Escribí el nombre de la persona que realiza la consulta.' },
  { name: 'phone', label: 'Celular o WhatsApp', type: 'tel', autoComplete: 'tel', required: true, help: 'Incluí el código de área. Podés usar +54 u otro prefijo internacional.' },
  { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', required: false, help: 'Opcional. Por ejemplo, nombre@dominio.com.' },
  { name: 'comment', label: 'Comentario general sobre el pedido', type: 'textarea', autoComplete: 'off', required: false, help: 'Opcional. Agregá información general sobre tu consulta (hasta 2.000 caracteres).' },
] as const;

export default function ConsultationCustomerDetails({ visible, values, onChange, onReview }: {
  visible: boolean;
  values: CustomerDetails;
  onChange: (values: CustomerDetails) => void;
  onReview: () => void;
}) {
  const [touched, setTouched] = useState<Partial<Record<CustomerField, boolean>>>({});
  const errors = validateCustomerDetails(values);

  // La instancia permanece montada al vaciar la consulta; no reinicia la edición.
  if (!visible) return null;

  return (
    <section aria-labelledby="tus-datos-title" className="internal-surface border border-divider p-6 mb-8">
      <h2 id="tus-datos-title" className="text-xl mb-3">Tus datos</h2>
      <p id="tus-datos-help" className="text-sm text-gray-600 mb-6">
        Nombre y celular son obligatorios. Tus datos se conservan solo mientras permanezcas en esta página. Podrás revisar el resumen antes de compartirlo con WhatsApp.
      </p>
      <form aria-labelledby="tus-datos-title" aria-describedby="tus-datos-help" noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setTouched({ fullName: true, phone: true, email: true, comment: true });
          const firstError = fields.find((field) => errors[field.name]);
          if (firstError) event.currentTarget.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${firstError.name}"]`)?.focus();
          else onReview();
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {fields.map((field) => {
          const id = `cliente-${field.name}`;
          const error = touched[field.name] ? errors[field.name] : undefined;
          const shared = {
            id,
            name: field.name,
            value: values[field.name],
            required: field.required,
            maxLength: customerDetailsLimits[field.name],
            autoComplete: field.autoComplete,
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...values, [field.name]: event.target.value }),
            onBlur: () => setTouched((previous) => ({ ...previous, [field.name]: true })),
            'aria-invalid': Boolean(error),
            'aria-describedby': `${id}-help${error ? ` ${id}-error` : ''}`,
            className: `w-full min-w-0 rounded-lg border bg-white p-3 text-[#07134b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005bea] ${error ? 'border-[#b00050]' : 'border-divider'}`,
          };

          return (
            <div key={field.name} className={`min-w-0 ${field.name === 'comment' ? 'md:col-span-2' : ''}`}>
              <label htmlFor={id} className="block text-sm font-bold mb-2">{field.label} ({field.required ? 'obligatorio' : 'opcional'})</label>
              {field.type === 'textarea' ? <textarea {...shared} rows={4} /> : <input {...shared} type={field.type} />}
              <p id={`${id}-help`} className="text-sm text-gray-600 mt-2">{field.help}</p>
              {error && <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-[#b00050]">{error}</p>}
            </div>
          );
        })}
        <div className="md:col-span-2">
          <Button type="submit" variant="solid" className="max-w-full text-center">Revisar solicitud</Button>
        </div>
      </form>
    </section>
  );
}
