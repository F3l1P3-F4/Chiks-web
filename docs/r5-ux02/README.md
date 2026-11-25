# R5-UX02 — Selección visual y Mi consulta

24 de noviembre de 2026. Rama `desarrollo`, base `5342798`. Sin commit, push ni deploy.

## Qué se recuperó

| Área | Antes | Ahora |
| --- | --- | --- |
| Mi consulta | Listado sobre el fondo azul; sólo algunas secciones tenían superficie blanca. Sin control global de contracción. | Panel blanco con encabezado, contador de selecciones, flecha y acciones Expandir/Contraer. Filas compactas en escritorio. |
| Remeras: modelo/material | Dos descripciones libres como entrada principal. | Tarjetas Corte recto/Corte amplio y Algodón/Poliéster. Asesoramiento y Otra preferencia como alternativas. |
| Remeras: talles | Había que escribir cada referencia de talle. | Botones S, M, L y XL, cantidades por talle y total automático. Se pueden agregar referencias distintas mediante texto complementario. |
| Lonas: uso/terminación | Descripciones libres como entrada principal. | Interior/Exterior y Con ojales/Sin ojales; asesoramiento y Otra preferencia. |

Se conservaron Vinilo/DTF, colores orientativos, frente y espalda simultáneos, materiales de Lonas, medidas en centímetros, esquema dimensional y las ayudas existentes.

### Límite de la restauración histórica

Se revisaron el historial de `ConsultationReview`/`mi-consulta` y las versiones `4db8a05`, `e91f31a` y `31692a9`. No se identificó una versión con contracción de toda la consulta. Por eso el panel reproduce el comportamiento solicitado sobre el componente vigente; **no se afirma una restauración exacta de aquella implementación**. No se restauraron archivos antiguos completos.

Las alternativas visuales provienen del F02 original (`docs/prototipos/prototipo.js`), no de nuevos modelos o materiales inventados. Se siguieron las guías de composición y calidad visual de Impeccable y se inspeccionaron los resultados renderizados. No se ejecutó su detector automático: el lanzador había fallado en esta sesión.

## Preferencias y confirmación comercial

- Corte recto/amplio, Algodón/Poliéster y S/M/L/XL son **referencias solicitadas**, sin disponibilidad ni equivalencias de medidas confirmadas.
- Frontlit, Blackout y Mesh siguen siendo materiales solicitados sujetos a confirmación.
- Interior/Exterior describe el uso previsto; no promete resistencia de un material.
- Con/Sin ojales expresa una terminación solicitada que debe confirmarse al presupuestar.
- No se agregaron técnicas, precios, mínimos, stock ni combinaciones comerciales confirmadas.

## Compatibilidad con F04 y R5.1

Las tarjetas escriben los campos existentes `requests.model`, `requests.material`, `lonaRequest.use` y `lonaRequest.finish`. Los talles conservan la estructura de talles solicitados (`requested: true`). No se cambió el esquema, la versión, la clave `las-chikas-design:consulta:v1`, el store ni el mecanismo de WhatsApp.

Los valores anteriores que no coincidan con una referencia se muestran automáticamente como Otra preferencia, con su texto completo. No se migra ni sobrescribe ningún registro al abrirlo. Cada configuración mantiene su identidad independiente.

El panel utiliza `details`/`summary` nativos. Contraerlo oculta sus descendientes sin desmontar los formularios; conserva productos, borradores, datos personales y revisión del mensaje. El navegador anuncia su estado expandido/contraído. Tab no entra en contenido cerrado.

Remeras mantiene un único control de distribución y el último total válido: **20 → distribución 30 → desactivar → 30**. Las filas nuevas no traen cantidades inventadas. Los botones nuevos respetan el límite técnico existente de 40 filas.

Lonas conserva la elección excluyente entre medidas y asesoramiento. Alternar recupera los números del borrador abierto, pero al guardar asesoramiento las dimensiones inactivas no se persisten ni aparecen en Mi consulta/mensaje.

La composición se mantiene: escritorio con galería/resumen a la izquierda y formulario a la derecha; móvil con galería → formulario → resumen. Sin paneles duplicados ni controles de demostración.

## Verificaciones ejecutadas

| Verificación | Resultado |
| --- | --- |
| ESLint del proyecto y comprobación final dirigida de archivos intervenidos | Sin errores; avisos de variables auxiliares de la prueba corregidos. |
| TypeScript `npx --no-install tsc --noEmit --incremental false` | Correcto. También pasó TypeScript en la compilación final. |
| Compilación estática con `GITHUB_ACTIONS=true` y `GITHUB_REPOSITORY=F3l1P3-F4/Chiks-web` | 48 páginas generadas. Postbuild correcto: 44 nombres de segmentos normalizados. |
| `node scripts/test-guided-consultation.mjs` | 15 grupos correctos: datos anteriores, variantes, persistencia, conflictos, almacenamiento bloqueado, aislamiento y mensajes. |
| `node scripts/test-consultation-request.mjs` | Correcto: preparación/copia del mensaje, validación, enlaces, Unicode y alternativa extensa; sin envíos externos. |
| `node scripts/test-r5-ux02.mjs --production` | 12 grupos correctos; una pestaña aislada, con `/Chiks-web`. Evidencia: `resultados.json`. |
| `node scripts/test-r5-ux02.mjs --production --limit-only` | Límite de 40 filas correcto; permite retirar y sustituir un talle conservando el total. Evidencia: `limite-talles.json`. |
| Regresión de `test-r51.mjs` sobre la exportación | 10 grupos correctos; salida redirigida a `regresion-r51/resultados.json` para preservar el resultado local anterior. |

Los 12 grupos de navegador cubren selección visual sin escribir, resumen dinámico, teclado/foco, semántica de contracción, imágenes locales, guardado, recarga, edición, cancelación, eliminación, configuraciones múltiples, compatibilidad literal con datos anteriores y mensaje único con copia exacta. Se revisaron 390 y 1440 px sin desbordes. En la muestra con cuatro selecciones, el panel contraído mide 109,78 px y 98,19 px respectivamente.

Los scripts V11/V12 se adaptaron a los controles actuales (abrir Otra preferencia antes de escribir y elegir un talle antes de completar cantidades). No se repitieron sus baterías completas ni se sobrescribieron capturas históricas; sus recorridos afectados están cubiertos por la prueba dirigida de esta etapa.

El número comercial sigue sin configurar. Se comprobó la copia y el estado sin enlace de WhatsApp, no una recepción real. Los casos entre pestañas y almacenamiento bloqueado se verificaron mediante las pruebas de modelo existentes, no mediante una nueva batería multipestaña.

## Archivos intervenidos

Producción:

- `src/components/ConsultationReview.tsx`
- `src/components/ConsultationReview.module.css`
- `src/components/guided/GuidedProductSelection.tsx`
- `src/components/guided/GuidedProductSelection.module.css`
- `src/components/guided/RemerasConfigurationFields.tsx`
- `src/components/guided/LonasConfigurationFields.tsx`
- `src/components/guided/RequestedPreferenceField.tsx` (nuevo, reutiliza `GuidedChoiceField`)
- `src/data/guidedPreferences.ts` (nuevo, referencias F02 para solicitudes)

Pruebas: `scripts/test-r5-ux02.mjs` (nuevo), `scripts/test-r51.mjs`, `scripts/test-v11.mjs`, `scripts/test-v12.mjs`.

Documentación y evidencia nueva: este informe, resultados JSON y capturas en `docs/r5-ux02/`.

No se modificaron Inicio C03, Header, Footer, las otras 21 fichas, fotografías, F02, experimentos, dependencias ni despliegue. El cambio pendiente anterior de `AGENTS.md` y los informes/capturas locales F04, V11 y R5.1 se conservaron.

## Capturas comparativas

| Pantalla | Antes 390 | Después 390 | Antes 1440 | Después 1440 |
| --- | --- | --- | --- | --- |
| Mi consulta abierta | [Antes](capturas/antes-consulta-390.png) | [Abierta](capturas/consulta-abierta-390.png) | [Antes](capturas/antes-consulta-1440.png) | [Abierta](capturas/consulta-abierta-1440.png) |
| Mi consulta contraída | Sin control global | [Contraída](capturas/consulta-contraida-390.png) | Sin control global | [Contraída](capturas/consulta-contraida-1440.png) |
| Remeras | [Antes](capturas/antes-remeras-390.png) | [Tarjetas](capturas/remeras-390.png) | [Antes](capturas/antes-remeras-1440.png) | [Tarjetas](capturas/remeras-1440.png) |
| Lonas | [Antes](capturas/antes-lonas-390.png) | [Tarjetas](capturas/lonas-390.png) | [Antes](capturas/antes-lonas-1440.png) | [Tarjetas](capturas/lonas-1440.png) |

Detalle adicional: [talles seleccionables](capturas/remeras-talles-1440.png) y [terminaciones de Lonas](capturas/lonas-terminacion-1440.png).

Las capturas usan datos sintéticos; la cantidad de selecciones cambia entre estados de prueba. Sirven para comparar presentación y controles, no para atribuir una diferencia de altura a conjuntos de productos distintos.
