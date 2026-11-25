// Referencias originales de F02, autorizadas en R5-UX02 como preferencias.
// Se guardan como solicitudes libres de F04, nunca como opciones de stock confirmado.
export const guidedPreferences = {
  model: [['recto', 'Corte recto', 'Preferencia de silueta para consultar.'], ['amplio', 'Corte amplio', 'Preferencia de silueta para consultar.']],
  material: [['algodon', 'Algodón', 'Material solicitado; se confirma al cotizar.'], ['poliester', 'Poliéster', 'Material solicitado; se confirma al cotizar.']],
  use: [['interior', 'Interior', 'Pensada para un espacio bajo techo.'], ['exterior', 'Exterior', 'Pensada para un espacio al aire libre.']],
  finish: [['ojales', 'Con ojales', 'Preferencia de sujeción a consultar.'], ['sin-ojales', 'Sin ojales', 'Preferencia de terminación a consultar.']],
} as const;
export const referenceSizes = ['S', 'M', 'L', 'XL'] as const;
