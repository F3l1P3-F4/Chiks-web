# F03.2 — Experiencia completa de Lonas

Fecha: 22 de noviembre de 2026. Rama: `desarrollo`. Base: `da26cf225b2b9d904f9c9dbd38888b996a72bb2d`.

## Acceso y alcance

Abrir [la ficha local de Lonas](http://localhost:3000/productos/ficha/lonas) y pulsar **Probar experiencia F02**. Para regresar, utilizar **Volver a consulta comercial**. El servidor de desarrollo permanece disponible; no se publicó el sitio.

La demostración se integra en la ficha existente sin iframe ni ruta adicional. Solo se importa cuando el entorno es desarrollo y la ficha es `lonas`. La producción conserva íntegramente la presentación comercial anterior.

## Experiencia incorporada

1. **Material y uso:** las cuatro alternativas de material y las tres de uso del F02 original, con sus ayudas literales. Las opciones de asesoramiento permiten seguir sin definir una alternativa.
2. **Medidas y cantidad:** ancho y alto en centímetros, coma o punto y hasta dos decimales; cantidad entera positiva. Ayuda para definir medidas y cantidad por definir. El resumen y el esquema cambian inmediatamente. Las entradas se conservan al retroceder y al activar/desactivar asesoramiento.
3. **Terminaciones y diseño:** las tres alternativas originales de terminación y las dos de diseño. El esquema muestra los ojales únicamente cuando se elige esa referencia. Observaciones opcionales de hasta 2.000 caracteres.

El resumen incluye producto, material, uso, medidas con unidades, cantidad, terminación, estado del diseño, asesoramiento, observaciones y cantidad mínima **A confirmar**. Permite revisar, editar, retroceder y reiniciar. Antes de revisar se validan los tres pasos, incluso si se accedió directamente al último mediante la navegación de pasos.

El esquema es orientativo, no una fotografía ni una representación a escala exacta. Su proporción se acota para mantener la legibilidad, como en F02. No calcula superficie, precios, mínimos ni condiciones de fabricación.

## Aislamiento comercial

- Estado temporal de React, sin persistencia, consulta al proveedor comercial ni envíos.
- La instancia original de la selección comercial permanece montada y oculta durante la prueba. Se mantienen cantidad, observaciones, borradores y avisos de conflicto.
- Reiniciar limpia solamente la demostración. Entrar o salir conserva también las elecciones de prueba mientras la ficha permanece montada.
- Los formularios ocultos no participan en la navegación con teclado. El acceso enfoca el encabezado de la prueba o su revisión; el regreso enfoca la cantidad comercial.
- Las opciones no se transfieren a Mi consulta ni al mensaje de WhatsApp.

## Archivos de aplicación

| Archivo | Intervención |
|---|---|
| `src/components/LonasDevelopmentPreview.tsx` | Nuevo componente cliente: tres pasos, validaciones, esquema, resumen y alternancia de modo. |
| `src/components/LonasDevelopmentPreview.module.css` | Nuevo CSS localizado del esquema, medidas y paneles de Lonas. |
| `src/app/productos/ficha/[slug]/page.tsx` | Importación condicional exclusivamente para Lonas en desarrollo. |
| `src/components/ProductDetail.tsx` | Punto opcional de composición del área de galería e información; el renderizado predeterminado conserva el marcado original. |

Se reutilizan sin modificarlos `Button`, `ProductGallery`, `ProductSelection`, `Breadcrumb`, las secciones comerciales existentes y los módulos CSS de Remeras. No se realizó una refactorización general de configuradores ni se añadieron dependencias.

La documentación nueva se limita a este directorio: este informe, cinco registros JSON y doce capturas.

## Diferencias frente a F02

- Integración nativa en Next.js y navegación/breadcrumbs reales; conserva el encabezado, footer, relacionados y preguntas frecuentes de la ficha.
- Se mantiene la descripción comercial existente, en lugar de sustituirla por la introducción experimental de F02.
- Alternancia explícita entre consulta comercial y demostración, igual al piloto de Remeras.
- Observaciones de ejemplo y fila explícita de asesoramiento en el resumen.
- Cantidad con singular/plural y errores asociados al control correspondiente; no se alteran las alternativas originales.
- Actualmente Lonas no tiene fotografía asignada. La consulta comercial conserva su galería y el marcador actual. En la demostración se usa el esquema identificado de F02; no se asignaron fotografías ajenas ni se modificaron archivos originales.

Las cuatro agrupaciones, doce alternativas, ayudas, títulos y pasos se compararon automáticamente contra `docs/prototipos/prototipo.js`: coinciden literalmente.

## Revisión con Impeccable

Se aplicaron las guías locales de composición, claridad, tipografía, adaptación y calidad visual de Impeccable, conservando el prototipo aprobado como dirección. El ejecutable de Impeccable no está disponible en esta sesión: no se atribuyen resultados a un detector automático. La comprobación del resultado se realizó en Chromium mediante capturas, interacción y medidas del navegador.

## Verificaciones realizadas

| Comprobación | Resultado |
|---|---|
| Interacciones principales | 23 grupos de pruebas satisfactorios. |
| Comprobaciones adicionales | 7 grupos satisfactorios: medidas extremas, ayuda reversible, foco, almacenamiento bloqueado y circuito de producción. |
| Responsive | 36 combinaciones de estado/ancho sin desbordes: material, medidas, terminación, revisión, asesoramiento y texto de 2.000 caracteres en 320, 390, 768, 1024, 1440 y 1670 px. |
| Medidas inválidas | Vacío, cero, negativo, letras y más de dos decimales rechazados sin perder entradas. |
| Cantidades inválidas | Vacío, cero, negativo y fraccionario rechazados. |
| Medidas válidas | `120,50 × 80.25` se refleja como `120,5 × 80,25 cm`; tres piezas y cambios de terminación correctos. |
| Teclado | Entrada con Enter, radios con flechas, navegación con Tab, foco visible, errores enfocados y controles ocultos excluidos. |
| Observaciones | Saltos, espacios y 2.000 caracteres consecutivos conservados; región de lectura desplazable y accesible. |
| Borrador comercial | Cantidad y observaciones conservadas al entrar, salir y reiniciar. Conflicto remoto conservado al alternar modos. |
| R4 comercial | Solicitud directa, actualización, recarga, sincronización entre dos pestañas, resolución conservando borrador local y eliminación correctas. |
| Almacenamiento bloqueado | Prueba completa utilizable; selección comercial permanece en memoria, navega a Mi consulta y conserva advertencias. |
| Remeras | Galería, borrador y demostración de tres pasos con 8 + 12 = 20 prendas; revisión y regreso correctos. |
| Otras fichas | Comparación antes/después de las 23 fichas en 390 y 1440 px: 46/46 firmas de contenido, geometría y estilos coinciden en producción. |
| Producción con basePath | Ficha → Solicitar presupuesto → `/Chiks-web/mi-consulta`; cantidad, datos temporales y mensaje correctos, sin opciones de prueba ni datos personales persistidos. No se abrió WhatsApp. |
| ESLint y TypeScript | `npm run lint` y `npx tsc --noEmit` satisfactorios. |
| Exportación estática | `npm run build` con `GITHUB_ACTIONS=true`, `GITHUB_REPOSITORY=F3l1P3-F4/Chiks-web`; 48 páginas generadas y postbuild con 44 nombres de segmentos normalizados. |
| Exclusión de demostración | 333 archivos HTML/TXT/JS/CSS/JSON/MAP examinados; cero coincidencias de controles, módulo y textos exclusivos de prueba. Se conservan las variantes comerciales preexistentes Frontlit, Blackout y Mesh. |
| Mensaje de presupuesto | `node scripts/test-consultation-request.mjs` satisfactorio: Unicode, opcionales, validaciones y mensaje extenso; sin solicitudes externas. |
| Errores de ejecución | Sin excepciones JavaScript en el recorrido principal. |
| Protección | SHA-256 de 218 archivos iniciales: solo cambian los dos archivos existentes indicados. Los 37 archivos E01, F02, Remeras, R4 y fotografías permanecen intactos. |

Registros detallados: `verificacion-interactiva.json`, `verificacion-adicional.json`, `regresion-produccion.json`, `exclusion-produccion.json` y `proteccion-proyecto.json`.

## Capturas

| Estado | Celular | Escritorio |
|---|---|---|
| Material y uso | [390 px](capturas/lonas-material-390.png) | [1440 px](capturas/lonas-material-1440.png) |
| Medidas y cantidad | [390 px](capturas/lonas-medidas-390.png) | [1440 px](capturas/lonas-medidas-1440.png) |
| Terminación y diseño | [390 px](capturas/lonas-terminacion-390.png) | [1440 px](capturas/lonas-terminacion-1440.png) |
| Revisión | [390 px](capturas/lonas-revision-390.png) | [1440 px](capturas/lonas-revision-1440.png) |

Detalles adicionales de medidas: [320 px](capturas/lonas-detalle-medidas-320.png), [768 px](capturas/lonas-detalle-medidas-768.png), [1024 px](capturas/lonas-detalle-medidas-1024.png), [1670 px](capturas/lonas-detalle-medidas-1670.png).

Las capturas principales corresponden a la página completa en desarrollo; el indicador de herramientas de Next.js puede aparecer en ellas. Las cuatro capturas de detalle lo ocultan solamente en el navegador de QA. No se modificó la configuración del proyecto.

## Límites y pendientes

- Las alternativas siguen siendo demostrativas. Antes de F03.3 se deben confirmar materiales/usos compatibles, medidas admisibles, terminaciones, condiciones de diseño y mínimos con Aldana y Karina.
- Falta fotografía específica de Lonas, ya pendiente en el catálogo. No se inventó ni reemplazó contenido.
- Pruebas realizadas en Chromium de escritorio con distintos anchos; no equivalen a una certificación con dispositivos físicos, Safari o un lector de pantalla real.
- No hay almacenamiento ni envío del configurador. Sus selecciones se pierden al recargar o abandonar la ficha deliberadamente.
- No se modificó configuración de despliegue ni datos comerciales; no hubo commit, push, deploy ni avance a F03.3.

**F03.2 completada.**
