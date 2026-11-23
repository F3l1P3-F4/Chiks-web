# V12 — Configurador definitivo de Lonas

23/11/2026. Rama `desarrollo`, base `65cf071`. Implementación y recorridos dirigidos completos; sin commit, push ni deploy.

## Vista e interacción

Lonas abre directamente el configurador comercial. Se retiraron de esta ficha los controles de demostración, el selector de configuraciones y la información redundante bajo la galería. No se borraron prototipos ni módulos históricos. La galería conserva «Sin imagen disponible», porque no tiene fotografías asignadas.

La composición reutiliza los estilos aprobados, sin modificar el componente de Remeras: en escritorio, galería y resumen a la izquierda, formulario a la derecha; en celular, galería → formulario → resumen. Un único formulario calcula el único resumen y lo presenta mediante un portal.

1. **Material y uso:** tarjetas Frontlit, Blackout, Mesh y asesoramiento; uso libre opcional y ayuda contextual. Se indica «Material y disponibilidad sujetos a confirmación al presupuestar». No se ofrecen interiores/exteriores como servicios o disponibilidades confirmadas.
2. **Medidas y cantidad:** ancho y alto positivos, coma o punto decimal, centímetros visibles y cantidad entera positiva. Observaciones específicas y asesoramiento. Un esquema geométrico orientativo refleja las dimensiones sin simular fotografías, impresión ni ojales. Se puede dejar las medidas por definir y pedir asesoramiento. Los registros anteriores en metros se presentan convertidos a centímetros al editar; no se reescriben hasta guardar.
3. **Terminaciones y diseño:** terminación deseada como texto libre, tarjetas para indicar si el cliente tiene un diseño preparado o necesita ayuda, observaciones y asesoramiento. No se muestran terminaciones ilustrativas como oferta comercial. No se cargan archivos.

## Integración F04

Se mantiene `las-chikas-design:consulta:v1`, sus identidades, validaciones y mecanismos de persistencia/conflictos. El campo opcional `lonaRequest` conserva uso, terminación, estado del diseño y notas de medidas. Se valida exclusivamente para Lonas, con hasta 500 caracteres por campo. Material, medidas, cantidad, asesoramiento y observaciones reutilizan los campos existentes.

`configurationRows` alimenta resumen, Mi consulta y mensaje. El material se rotula «Material solicitado». Las selecciones anteriores continúan siendo legibles; al editar, los rótulos antiguos de uso/terminación/diseño se conservan como solicitudes, sin declararlos disponibles.

Se verificaron guardar, recargar, editar por identidad, cancelar sin sobrescribir, dos configuraciones independientes y eliminación individual. El [mensaje de prueba](mensaje-prueba.txt) incluye una consulta anterior de Tazas, 20 Remeras V11 y dos Lonas: Frontlit, 4 unidades, 180 × 200 cm; Mesh, 3 unidades, 90 × 120 cm. Incluye los campos definidos y los datos sintéticos del cliente. La copia coincide exactamente; no se abrió WhatsApp ni se simuló recepción.

## Archivos

Nuevos:

- `src/components/LonasGuidedWorkspace.tsx`.
- `src/components/guided/LonasConfigurationFields.tsx` y su CSS.
- `scripts/test-v12.mjs`, que reutiliza el soporte CDP de F04 con una sola página.
- Este informe, resultados JSON, mensaje sintético y dos capturas en `docs/v12/`.

Modificados estrictamente para integrar Lonas:

- `src/components/RemerasProductDetail.tsx`: composición compartida; sólo cambia la rama de Lonas, sin alterar la de Remeras.
- `src/components/guided/GuidedProductSelection.tsx`: presentación definitiva de Lonas, campos específicos y centímetros. El componente específico de Remeras permanece intacto.
- `src/data/guidedCatalogs.ts`: preferencias de material de Lonas autorizadas en V12; catálogo de Remeras intacto.
- `src/lib/consultationConfiguration.ts`: extensión opcional para Lonas y presentación del material solicitado.
- `scripts/test-guided-consultation.mjs`: caso V12 y etiqueta esperada de material solicitado; pruebas V11 conservadas.

No se modificaron `AGENTS.md`, documentos pendientes, Inicio/C03, Header/Footer, rutas, las otras 21 fichas ni F02. `AGENTS.md` conserva su cambio local previo de O02.

## Verificaciones ejecutadas

- ESLint y TypeScript: correctos.
- Compilación estática con `/Chiks-web` y postbuild: correctos, 48 páginas y 44 nombres de segmentos normalizados.
- `test-guided-consultation.mjs`: 15 grupos correctos, incluyendo V11, consultas anteriores, sincronización, conflictos, almacenamiento bloqueado y el nuevo caso de Lonas.
- `test-consultation-request.mjs`: correcto; validación del mensaje, opcionales, Unicode, enlaces y alternativa extensa; sin solicitudes externas.
- `node scripts/test-v12.mjs --production`: nueve recorridos correctos sobre la exportación estática. Incluye una regresión mínima de Remeras V11, tres materiales, asesoramiento, errores de cantidades/medidas con foco, resumen, recarga, edición, cancelación, variantes, mensaje conjunto y eliminación individual. Ver `resultados.json`.
- 390 y 1440 px: orden DOM/visual, resumen único y ausencia de desbordes correctos. Navegación por teclado y foco en errores verificados. Se inspeccionaron únicamente las dos capturas nuevas.

Se utilizó una sola instancia de Chromium y una sola página de prueba; no se repitió la auditoría general ni la regresión masiva de navegador. No hubo bloqueos de memoria en esta ejecución. Las pruebas son de Chromium con anchos emulados; no sustituyen pruebas en dispositivos físicos o lectores de pantalla.

## Pendientes comerciales

Stock de materiales, terminaciones efectivamente disponibles, precios, mínimos, límites de fabricación y plazos. Frontlit/Blackout/Mesh son preferencias solicitadas, sujetas a confirmación. El número comercial de WhatsApp y una recepción real siguen pendientes. No se añadieron restricciones de fabricación ni servicios no autorizados.

Capturas: [celular 390 px](capturas/lonas-390.png) · [escritorio 1440 px](capturas/lonas-1440.png).
