// Número público incorporado por Next.js durante la compilación; nunca inferir el país.
export function normalizeWhatsAppNumber(value: string | undefined): string | null {
  const raw = value?.trim();
  if (!raw || raw.length > 40 || !/^\+?[\d\s().-]+$/.test(raw)) return null;
  const compact = raw.replace(/[\s().-]/g, '');
  const number = compact.startsWith('+') ? compact.slice(1) : compact.replace(/^00/, '');
  return /^[1-9]\d{7,14}$/.test(number) ? number : null;
}

export const whatsAppNumber = normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

// Umbral conservador del sitio, no un límite oficial de WhatsApp. Nunca truncar el texto.
export const MAX_WHATSAPP_URL_LENGTH = 2000;

export function buildWhatsAppAction(number: string, message: string) {
  const normalized = normalizeWhatsAppNumber(number);
  if (!normalized) throw new Error('El canal de WhatsApp está pendiente de configuración.');
  const chatUrl = `https://wa.me/${normalized}`;
  const url = new URL(chatUrl);
  url.searchParams.set('text', message);
  const prefilled = url.href.length <= MAX_WHATSAPP_URL_LENGTH;
  return { url: prefilled ? url.href : chatUrl, chatUrl, prefilled };
}
