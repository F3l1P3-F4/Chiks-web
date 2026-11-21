// Pruebas locales con datos ficticios. No abren WhatsApp ni contactan destinatarios.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { createRequire } from 'node:module';

const load = createRequire(import.meta.url);

const previousLoader = load.extensions['.ts'];
load.extensions['.ts'] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(compiled.outputText, filename);
};

try {
  const { buildConsultationMessage, validateConsultationProducts } = load('../src/lib/consultationMessage.ts');
  const { normalizeWhatsAppNumber, buildWhatsAppAction, MAX_WHATSAPP_URL_LENGTH } = load('../src/lib/whatsapp.ts');
  const customer = { fullName: 'Cliente de prueba', phone: '+1 202 555 0199', email: '', comment: '' };
  const shirt = { id: 'remeras-personalizadas', name: 'Remeras Personalizadas', path: '/productos/indumentaria/remeras-personalizadas', quantity: 20, notes: '' };
  const mug = { id: 'tazas', name: 'Tazas', path: '/productos/ficha/tazas', quantity: 30, notes: 'Dos diseños\nCon acentos: áéíóú y emoji 🎨' };
  const single = buildConsultationMessage([shirt], customer);
  assert.equal(single, [
    'Solicitud de presupuesto — Las Chikas Design',
    'Datos del cliente\nNombre y apellido: Cliente de prueba\nCelular: +1 202 555 0199',
    'Productos seleccionados\n1. Remeras Personalizadas\nCantidad: 20',
  ].join('\n\n'));
  assert.ok(!single.includes('Correo electrónico:'));
  assert.ok(!single.includes('Observaciones:'));
  assert.ok(!single.includes('Comentario general'));
  const values = { ...customer, email: 'prueba@example.test', comment: 'Comentario general de prueba' };
  const message = buildConsultationMessage([shirt, mug], values);
  assert.ok(message.includes('2. Tazas\nCantidad: 30\nObservaciones: ' + mug.notes));
  assert.equal(message.split(values.email).length, 2);
  assert.ok(message.endsWith('Comentario general\n' + values.comment));
  assert.equal(validateConsultationProducts([shirt, mug]), null);
  for (const quantity of [0, -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => buildConsultationMessage([{ ...shirt, quantity }], customer));
  assert.throws(() => buildConsultationMessage([], customer));
  assert.throws(() => buildConsultationMessage([shirt, shirt], customer));
  assert.throws(() => buildConsultationMessage([{ ...shirt, notes: 'x'.repeat(2001) }], customer));
  for (const fields of [{ fullName: ' ' }, { phone: '' }, { phone: '123' }, { email: 'incorrecto' }]) assert.throws(() => buildConsultationMessage([shirt], { ...customer, ...fields }));
  for (const raw of [undefined, '', ' ', 'pendiente', '01112345678', '+0012025550123', '++12025550123', '12025550123?text=x', '1234567', '1234567890123456']) assert.equal(normalizeWhatsAppNumber(raw), null);
  // Rango ficticio reservado NANP 202-555-01xx, exclusivamente para pruebas.
  for (const raw of ['12025550123', '+1 (202) 555-0123', '0012025550123']) assert.equal(normalizeWhatsAppNumber(raw), '12025550123');
  const action = buildWhatsAppAction('12025550123', message);
  assert.equal(action.prefilled, true);
  assert.equal(new URL(action.url).searchParams.get('text'), message);
  assert.equal(new URL(action.url).hostname, 'wa.me');
  assert.ok(action.url.length <= MAX_WHATSAPP_URL_LENGTH);
  assert.throws(() => buildWhatsAppAction('mal configurado', message));
  const many = Array.from({ length: 23 }, (_, i) => ({ ...shirt, id: 'prueba-' + i, name: 'Artículo de prueba ' + i, quantity: i + 1, notes: 'á'.repeat(2000) }));
  const longMessage = buildConsultationMessage(many, { ...values, comment: 'z'.repeat(2000) });
  const longAction = buildWhatsAppAction('12025550123', longMessage);
  assert.equal(longAction.prefilled, false);
  assert.equal(longAction.url, longAction.chatUrl);
  assert.equal(new URL(longAction.url).search, '');
  for (const item of many) assert.ok(longMessage.includes(item.name + '\nCantidad: ' + item.quantity + '\nObservaciones: ' + item.notes));
  assert.ok(longMessage.endsWith('z'.repeat(2000)));
  assert.equal(shirt.quantity, 20);
  console.log('R4.4: mensaje exacto, opcionales, validaciones, número comercial, Unicode y alternativa extensa: correctos. Sin solicitudes externas.');
} finally {
  if (previousLoader) load.extensions['.ts'] = previousLoader;
  else delete load.extensions['.ts'];
}
