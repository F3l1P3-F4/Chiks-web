# V13 — Experiencia compartida de las 21 fichas generales

25 de noviembre de 2026. Rama `desarrollo`, base `ebbd55e`. Sin commit, push ni deploy.

## Implementación

Se modificaron únicamente `src/components/ProductDetail.tsx` y `src/components/ProductDetail.module.css` en producción. Las 21 páginas reutilizan esa plantilla; no se editaron individualmente ni se alteraron los datos del catálogo.

- Nombre y descripción originales al inicio, con Precio: Consultar.
- Fotografía más amplia al reducir de 96 a 24 px la separación entre columnas de escritorio. Se reutilizan ProductGallery y CatalogImage con sus proporciones y estados sin imagen.
- Panel blanco “Prepará tu consulta” junto a la fotografía en escritorio y después de la fotografía/información útil en móvil.
- Cantidad, observaciones, Agregar/Actualizar mi consulta, Contacto y Solicitar presupuesto conservan el formulario y los destinos existentes.
- Usos y personalización conocidos se muestran sin una lista extensa de pendientes antes del formulario.
- Especificaciones, variantes, mínimos y campos pendientes se conservan en “Características y datos por confirmar”, contraíble y posterior a la consulta. No se inventó ni eliminó información comercial.
- Tipografía, bordes, foco, blancos y acentos coherentes con las fichas guiadas, con reglas limitadas a esta plantilla.

ProductSelection, ProductConsultation, ProductGallery, los componentes guiados, el proveedor de consulta, la persistencia y el mensaje de WhatsApp no se modificaron. La composición aprobada de Remeras y Lonas usa otro componente; no consume estos estilos.

## Familias futuras

Se documentó una estructura de composición y adaptación reutilizable en [familias-de-configuracion.md](familias-de-configuracion.md), con una matriz de las 21 fichas y preguntas concretas para Aldana y Karina:

| Familia de interacción propuesta | Fichas |
| --- | --- |
| A. Indumentaria | Buzos y Hoodies, Camperas, Conjuntos Deportivos (3) |
| B. Gráfica | Banners, Vinilos, Microperforados, Backlite (4) |
| C. Merchandising | Gorras, Tazas, Llaveros, Neceseres, Botineros, Mochilas, Toallones, ambas fichas de Banderas y Regalos Empresariales (10) |
| D. Proyectos a medida | Marquesinas, Vidrieras, Ploteo Vehicular, Stands y Cartelería (4) |

Esto no reasigna categorías ni confirma opciones. Buzos permanece comercialmente en Merchandising; las diferencias entre las dos fichas de Banderas necesitan confirmación. No se crearon configuradores adicionales ni tipos/campos de almacenamiento nuevos.

## Verificaciones ejecutadas

| Comprobación | Resultado |
| --- | --- |
| ESLint del proyecto y revisión dirigida del script final y ProductDetail | Correctos; el aviso de variable sin usar de la prueba inicial se resolvió al completar la prueba. |
| TypeScript `npx --no-install tsc --noEmit --incremental false` | Correcto. |
| Compilación estática y postbuild con `/Chiks-web` | 48 páginas generadas; 44 nombres de segmentos normalizados. El primer intento no pudo descargar Inter por la conexión restringida; el segundo pasó con acceso a Google Fonts, sin cambios de configuración. |
| `node scripts/test-v13.mjs --production` | 26 grupos correctos: las 21 fichas y cinco recorridos compartidos. Una pestaña aislada. Evidencia en `resultados.json`. |
| Responsive y accesibilidad básica | Las 21 fichas a 390 y 1440 px: un H1, título/formulario legibles, orden galería → formulario, etiquetas asociadas, Tab y foco visible, sin desbordes. |
| Imágenes y enlaces | Fotografías locales cargadas, sin deformación; 23 destinos internos únicos respondieron 200. |
| Mi consulta | Las 21 fichas agregaron su selección. Edición desde la ficha y desde Mi consulta, validación de cantidad, vuelta sin guardar, eliminación/reincorporación y recarga correctas. |
| Mensaje único | Conservó los 21 productos con cantidades y observaciones. Copia exacta comprobada con datos sintéticos; sin envíos externos. |
| `test-guided-consultation.mjs` | 15 grupos correctos: compatibilidad, variantes, sincronización, conflictos, almacenamiento bloqueado, configuraciones y mensajes. |
| `test-consultation-request.mjs` | Correcto: validación, formato, Unicode, construcción de enlaces y alternativa extensa. |
| Regresión `test-r51.mjs` | 10 grupos correctos; salida redirigida a `regresion-r51/resultados.json` sin sobrescribir el resultado local anterior. Incluye 20 → distribución 30 → total 30 y asesoramiento de Lonas sin dimensiones. |

Las verificaciones de conflictos y almacenamiento bloqueado fueron de modelo mediante las pruebas existentes; no se abrió una batería nueva multipestaña. Los controles iniciales de Remeras y Lonas también se comprobaron en navegador, y el diff confirma que sus archivos no cambiaron.

La jerarquía se revisó con las guías de Impeccable y capturas renderizadas; no se atribuye esta revisión a su detector automático, cuyo lanzador había fallado en esta sesión.

## Comparación medible

Posición vertical del campo Cantidad solicitada desde el inicio del documento, en px (redondeada):

| Ficha | Ancho | Antes | Después | Reducción |
| --- | --- | --- | --- | --- |
| Tazas | 390 | 1406 | 1063 | 343 |
| Tazas | 1440 | 1019 | 566 | 453 |
| Vidrieras | 390 | 1511 | 991 | 520 |
| Vidrieras | 1440 | 1124 | 566 | 558 |

Se mantiene espacio para fotografía e información útil; no se persiguió una altura arbitraria ni se ocultó el formulario. Las posiciones provienen de `antes.json` y `resultados.json`.

## Capturas representativas

| Ficha | Antes móvil | Después móvil | Antes escritorio | Después escritorio |
| --- | --- | --- | --- | --- |
| Tazas — con foto | [390](capturas/antes-tazas-390.png) | [390](capturas/tazas-390.png) | [1440](capturas/antes-tazas-1440.png) | [1440](capturas/tazas-1440.png) |
| Vidrieras — con foto | [390](capturas/antes-vidrieras-390.png) | [390](capturas/vidrieras-390.png) | [1440](capturas/antes-vidrieras-1440.png) | [1440](capturas/vidrieras-1440.png) |
| Camperas — sin fotografía específica | — | [390](capturas/camperas-390.png) | — | [1440](capturas/camperas-1440.png) |

Son estados de prueba con datos sintéticos; las fotografías del catálogo se conservan sin cambios. No se generaron capturas de cada una de las 42 combinaciones ficha/ancho.

## Pendientes y límites

- Confirmar opciones y condiciones por producto según la matriz de familias antes de habilitar selecciones específicas.
- Las 21 fichas generales mantienen el comportamiento previo de una selección actualizable por producto. Las configuraciones independientes de Remeras/Lonas permanecen intactas.
- Seis fichas generales tienen fotografía asignada. Quedan sin fotografía específica: Buzos y Hoodies, Llaveros, Neceseres, Botineros, Mochilas, Toallones, Banderas deportivas, Banners, Vinilos, Microperforados, Backlite, Marquesinas, Camperas, Conjuntos Deportivos y Regalos Empresariales. Se conservó su placeholder, sin fotografías prestadas ni ficticias.
- El número comercial de WhatsApp sigue sin configurar. No se comprobó recepción real ni se inventó un número.
- Se mantuvieron FAQ y contenidos comerciales pendientes; esta etapa mejora presentación y recorrido, no valida esa información.
- AGENTS.md y los informes, resultados y capturas pendientes de otras etapas se conservaron. No hubo limpieza ni cambios en dependencias, rutas, SEO, Inicio, Header, Footer o F02.

Archivos nuevos de esta etapa: `scripts/test-v13.mjs`, este informe, `familias-de-configuracion.md`, resultados JSON y las diez capturas representativas. No se modificaron pruebas históricas.
