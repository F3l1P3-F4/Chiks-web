export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  comment: string;
}

export type CustomerField = keyof CustomerDetails;
export type CustomerErrors = Partial<Record<CustomerField, string>>;

export const emptyCustomerDetails: CustomerDetails = { fullName: '', phone: '', email: '', comment: '' };
export const customerDetailsLimits = { fullName: 120, phone: 40, email: 254, comment: 2000 } as const;

// Se reutilizará al asociar estos datos temporales con los productos en R4.4.
export function validateCustomerDetails(values: CustomerDetails): CustomerErrors {
  const errors: CustomerErrors = {};
  const name = values.fullName.trim();
  const phone = values.phone.trim();
  const email = values.email.trim();
  const digits = phone.replace(/\D/g, '').replace(/^00/, '');

  if (!name) errors.fullName = 'Ingresá tu nombre y apellido.';
  else if (values.fullName.length > customerDetailsLimits.fullName) errors.fullName = 'Usá hasta 120 caracteres.';

  if (!phone) errors.phone = 'Ingresá tu celular o WhatsApp.';
  else if (phone.length > customerDetailsLimits.phone || !/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
    errors.phone = 'Ingresá un número válido, con código de área. Podés incluir el prefijo internacional, espacios, guiones o paréntesis.';
  }

  if (email && (values.email.length > customerDetailsLimits.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    errors.email = 'Revisá el correo: por ejemplo, nombre@dominio.com.';
  }
  if (values.comment.length > customerDetailsLimits.comment) errors.comment = 'Usá hasta 2.000 caracteres.';

  return errors;
}
