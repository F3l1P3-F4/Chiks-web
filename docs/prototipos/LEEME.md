# F02 — Prototipos interactivos de fichas

Rama de trabajo: `desarrollo`. Propuesta para revisión visual, sin integración funcional con las 23 fichas ni con R4.

## Abrir y probar

Con el servidor de revisión iniciado:

- Remeras: <http://localhost:3102/#remeras>
- Lonas: <http://localhost:3102/#lonas>

Para iniciarlo desde la raíz del repositorio:

```powershell
node docs/prototipos/servir.mjs
```

El servidor escucha únicamente en este equipo. No reemplaza `npm run dev` ni utiliza su puerto. Para usar otro puerto: `node docs/prototipos/servir.mjs 3103`. Ctrl+C lo detiene en la terminal que lo inició.

También se puede abrir `docs/prototipos/index.html` directamente en el navegador, sin servidor. CSS, JavaScript, fuente, logo y fotos usan referencias locales. La apertura directa se verificó en Chromium.

El selector superior cambia entre los dos ejemplos. Los enlaces `#remeras` y `#lonas` son estados del documento independiente, no nuevas rutas de Next.js.

## Qué estamos evaluando

Una persona quiere describir un producto sin dominar vocabulario técnico. La propuesta mantiene el azul, el logo original, Inter y los acentos fucsia del sitio, con un recorrido de tres pasos en un panel blanco. La fotografía o el esquema acompañan la decisión. El resumen permite revisar sus consecuencias sin recordar lo seleccionado en pantallas anteriores.

Las alternativas configurables son **demostrativas**. Su presencia no confirma materiales, modelos, técnicas, colores, talles ni disponibilidad comercial. Ninguna combinación se valida como fabricable. No se inventan precios, mínimos de pedido ni condiciones de producción.

## A. Remeras personalizadas

| Bloque | Qué permite probar | Por qué está organizado así |
|---|---|---|
| Referencia del producto | Ver la descripción existente y dos fotos del catálogo; cambiar de foto dentro del desplegable | Entender el producto sin presentar la foto como una simulación de lo elegido |
| Paso 1: modelo y material | Comparar corte recto/amplio y algodón/poliéster, o elegir asesoramiento | Dos decisiones relacionadas antes de repartir prendas |
| Paso 2: talles y cantidades | Indicar cantidades por S, M, L y XL; ver la suma inmediata | Evitar escribir una distribución larga en observaciones; las etiquetas no son una tabla de talles real |
| Alternativa de ayuda | Dejar talles por definir, con cantidad aproximada o cantidad también por definir | No obligar a decidir algo que el cliente todavía desconoce |
| Paso 3: personalización | Explorar color, técnica y ubicación del diseño, con ayudas breves | Presentar solo estas decisiones al llegar a su momento, sin un formulario con todos los campos simultáneos |
| Revisión | Leer todo lo elegido, volver a editar o reiniciar el ejemplo | Revisar antes de una consulta futura; aquí no existe un envío |

Las fotos son `public/images/productos/indumentaria-corporativa.webp` e `indumentaria-clubes.webp`, asociaciones ya utilizadas en la ficha existente. No cambian según color, modelo o técnica. El prototipo no crea fotografías ni personaliza sus píxeles.

### Recorrido sugerido

1. Elegir Corte recto y Algodón como ejemplos.
2. Continuar y repartir 8 prendas S y 12 M: el total muestra 20.
3. Probar la opción de ayuda con los talles y regresar al reparto: los valores se conservan mientras el documento siga abierto.
4. Elegir referencias de color, técnica y ubicación.
5. Revisar la selección y usar «Volver a editar».

También se puede completar todo el ejemplo eligiendo asesoramiento y dejando la cantidad por definir.

## B. Lonas

Se eligió una ficha existente del catálogo de Gráfica / Impresión ecosolvente. Frontlit, Blackout y Mesh aparecen como variantes en el proyecto; **su selección en este configurador sigue siendo demostrativa**. Las terminaciones propuestas requieren validación adicional.

| Bloque | Qué permite probar | Por qué está organizado así |
|---|---|---|
| Referencia visual | Ver un rectángulo con ancho y alto | Lonas no tiene una fotografía específica asignada; se usa un esquema identificado, sin atribuirle fotos ajenas |
| Paso 1: material y uso | Explorar materiales con explicaciones breves y contexto interior/exterior | Describir la necesidad sin exigir conocimientos técnicos ni garantizar que la combinación sea adecuada |
| Paso 2: medidas y cantidad | Introducir ancho/alto en centímetros, con coma o punto, y cantidad de piezas | Las unidades son explícitas; no se calculan precios, límites ni mínimos comerciales |
| Alternativa de ayuda | Dejar medidas o cantidad por definir | Poder continuar aunque todavía falte medir el espacio |
| Paso 3: terminación y diseño | Explorar con/sin ojales y expresar si necesita ayuda con el diseño | Separar la colocación de la definición inicial del material |
| Revisión | Leer las referencias elegidas y regresar a editar | Cerrar la evaluación de experiencia sin aparentar una solicitud real |

El esquema actualiza sus etiquetas y una proporción aproximada al cambiar las medidas. Los puntos muestran conceptualmente la opción de ojales: no definen cantidad ni posiciones de fabricación. No es una fotografía ni una previsualización de impresión. No se carga ningún archivo de diseño.

### Recorrido sugerido

1. Elegir Frontlit e Interior como referencias de ejemplo.
2. Indicar ancho 150,5 cm, alto 100 cm y 2 piezas.
3. Probar «Necesito ayuda para definir las medidas» y volver: las medidas anteriores se conservan en memoria.
4. Elegir Con ojales y Necesito ayuda para definir el diseño.
5. Revisar la selección, editarla o reiniciar.

## Cómo se construye el resumen

- Cada ejemplo mantiene su propio estado temporal en JavaScript.
- Las etiquetas se obtienen del mismo esquema que genera las opciones; no se mantienen dos listas de nombres independientes.
- En remeras se suma la distribución por talle. Si se activa asesoramiento, se utiliza la cantidad aproximada o «Por definir con asesoramiento».
- En lonas se muestran medidas válidas o la necesidad de asesoramiento, cantidad, material, contexto y terminación.
- «A elegir» y «A indicar» distinguen campos sin completar; «Necesito asesoramiento» es una decisión válida, no un error.
- «Cantidad mínima: A confirmar» permanece sin valor numérico en ambos ejemplos.
- Antes de la revisión se comprueban todos los pasos, incluso si la persona los exploró fuera de orden. Un error enfoca el campo correspondiente sin descartar los datos.
- Los errores se retiran al editar. La selección activa se reconoce por el radio nativo y el tratamiento visual, no solo por color.

## Qué podría reutilizarse en las 23 fichas

Son patrones de experiencia para una futura integración, todavía **no componentes React de producción**:

1. Esquema por producto: grupos, opciones, ayudas y campos aplicables. Cada ficha decide qué mostrar; no se asume que todas tengan talles o medidas.
2. Grupo de opciones con etiquetas, explicación y una salida de asesoramiento cuando corresponde.
3. Distribución de cantidades por talle y total derivado, para productos donde se confirme esa necesidad.
4. Bloque de medidas con unidades y estado «Por definir».
5. Resumen derivado de la selección, revisión y vuelta a editar.
6. Estados de foco, validación, campos condicionales y anuncios breves para tecnologías de asistencia.

La futura integración deberá aprovechar la galería y los componentes existentes. También deberá definir cómo representar variantes y configuraciones distintas de un mismo producto dentro de la consulta; este prototipo no decide ni modifica esa arquitectura.

## Preguntas para Aldana y Karina

### Experiencia a aprobar primero

- ¿Los tres pasos resultan claros o alguna decisión debería aparecer en otro momento?
- ¿Se entiende la diferencia entre dejar algo pendiente y pedir asesoramiento?
- ¿La distribución por talle representa la forma en que reciben habitualmente los pedidos?
- ¿Es suficiente un resumen textual o necesitan otra información para conversar con el cliente?
- ¿Las unidades en centímetros son claras para gráfica o también conviene admitir metros?
- ¿Les resulta útil conservar elecciones al cambiar entre ejemplos durante una misma visita?

### Información comercial para una etapa posterior

- ¿Qué modelos, materiales y variantes se ofrecen realmente para cada producto?
- ¿Qué talles corresponden a cada modelo? ¿Qué tabla de medidas debe utilizarse?
- ¿Qué colores se pueden elegir y cómo se identifica una referencia de color?
- ¿Qué técnicas son compatibles con cada material y qué ubicaciones se admiten?
- ¿Cuándo se necesita confirmar la viabilidad de una combinación con el equipo?
- Para lonas: ¿qué materiales, usos, medidas máximas y terminaciones están disponibles?
- ¿Hay cantidades mínimas? ¿Son por producto, diseño, técnica, talle o combinación?
- ¿Qué información necesita el equipo para asesorar cuando el cliente deja medidas, talles o cantidad por definir?
- ¿Qué documentación o referencias visuales reales pueden acompañar estas ayudas?
- La eventual carga de archivos sigue siendo P01. ¿Se mantiene fuera del MVP o se evaluará en otra etapa?

Ninguna respuesta está presupuesta ni implementada como condición comercial.

## Evaluación con Impeccable

Se verificó la existencia de `critique`, `layout`, `clarify`, `typeset`, `polish` y `adapt` como guías de la skill local Impeccable 4.10.0. Se utilizaron sus pautas y la rúbrica de crítica manual. El motor automático ya había fallado en esta sesión por no estar instalado y no se reintentó ni se simuló su ejecución. No hubo detector, overlays ni evaluación independiente con dos agentes.

| Guía | Aplicación en F02 |
|---|---|
| Critique | Evaluación manual de carga cognitiva, control del usuario, claridad y diferenciación entre demostración y oferta |
| Layout | Referencia visual junto a las opciones y resumen en escritorio; orden vertical y acceso al resumen en móvil |
| Clarify | Verbos concretos, unidades explícitas, ayuda contextual, asesoramiento y fin de demostración sin falso envío |
| Typeset | Inter existente, jerarquía de título/paso/etiqueta/ayuda, números tabulares y respaldo para texto ampliado |
| Polish | Estados seleccionados, errores recuperables, reinicio, edición y alineación del resumen final |
| Adapt | Cinco anchos, controles nativos, áreas táctiles, teclado y navegación sin depender de hover |

La crítica inicial detectó demasiado desplazamiento en móvil antes de elegir: se redujo la altura de la foto y se agruparon la segunda foto y sus explicaciones en un desplegable. La revisión final corrigió la alineación y el peso de los valores del resumen. Al ampliar el texto al 200% se añadió un respaldo de salto de palabras excepcional para evitar desbordamiento del título.

La propuesta reduce las decisiones visibles a un paso y a un máximo de cuatro opciones por grupo. Permite completar un recorrido con asesoramiento, sin forzar conocimientos técnicos. La comprensión con clientes reales todavía debe evaluarse: las pruebas técnicas no sustituyen esa revisión.

## Verificaciones

- 40 combinaciones de estado y ancho: ambas experiencias, pasos representativos y revisión, en **320, 390, 768, 1024 y 1440 px**.
- Sin desbordamiento horizontal, imágenes fallidas ni excepciones de JavaScript en las comprobaciones.
- 23 comprobaciones funcionales: elecciones, suma por talle, cantidades negativas, medidas inválidas, coma/punto, campos condicionales, conservación de edición, asesoramiento, reinicio, revisión y apertura directa del HTML.
- 18 avances con Tab por ejemplo, con foco visible y sin controles ocultos enfocados; grupos de radios operables con flechas y botones con teclado.
- Toque sintetizado en Chromium a 320 px: selección y actualización del resumen correctas. No equivale a una prueba en un teléfono físico.
- Texto ampliado al 200% en móvil: ancho del documento conservado en 320 px.
- Se comprobó que no se escriben datos en `localStorage`, `sessionStorage` ni cookies. La recarga descarta las selecciones.
- Las solicitudes observadas son únicamente GET de recursos locales. No hay servicios externos ni solicitudes comerciales.
- `node --check` y ESLint de los dos archivos JavaScript: correctos.
- `git diff` de `src`, dependencias y configuración: sin cambios. No se agregaron páginas a Next.js ni al sitemap.

Límites de la validación: Chromium con viewport, teclado y toque emulados. Sin pruebas con usuarios reales, lectores de pantalla, Safari/iOS o dispositivos físicos. No se validaron especificaciones comerciales ni compatibilidades de producción.

## Capturas comparativas

| Estado | Remeras | Lonas |
|---|---|---|
| Cantidades / medidas, escritorio | [Talles, 1440 px](capturas/remeras-talles-1440.png) | [Medidas, 1440 px](capturas/lonas-medidas-1440.png) |
| Cantidades / medidas, celular | [Talles, 390 px](capturas/remeras-talles-390.png) | [Medidas, 390 px](capturas/lonas-medidas-390.png) |
| Revisión, escritorio | [Resumen, 1440 px](capturas/remeras-resumen-1440.png) | [Resumen, 1440 px](capturas/lonas-resumen-1440.png) |
| Revisión, celular | [Resumen, 390 px](capturas/remeras-resumen-390.png) | [Resumen, 390 px](capturas/lonas-resumen-390.png) |

Las cantidades y combinaciones de las capturas son ejemplos elegidos durante las pruebas, no condiciones comerciales.

## Archivos

- `index.html`: documento independiente y aviso de demostración.
- `prototipo.css`: estilos aislados y responsive.
- `prototipo.js`: datos demostrativos, pasos, interacción, validación y resumen en memoria.
- `servir.mjs`: servidor local opcional, sin dependencias adicionales.
- `assets/inter-latin.woff2`: copia de la fuente Inter ya utilizada en la exportación local del sitio, para abrir el prototipo sin depender de `.next` ni `out`.
- `capturas/`: ocho capturas de comparación.
- `LEEME.md`: esta guía de revisión.

Solo se agregaron recursos en `docs/prototipos/`. No se modificaron las fichas públicas, ProductSelection, ConsultationProvider ni el circuito R4. No se hizo commit, push ni deploy. La integración definitiva queda pendiente de aprobación de la experiencia y validación comercial.
