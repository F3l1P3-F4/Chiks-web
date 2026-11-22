# F03.3 — Base reutilizable de fichas guiadas

Fecha: 22 de noviembre de 2026. Rama: `desarrollo`. Base: `7df4da058db6fc03d05645e7c6ab62b7233b6a66`.

## Resultado

Remeras y Lonas utilizan los mismos controles y el mismo manejo del recorrido de demostración, conservando sus experiencias aprobadas. No se incorporaron variantes al sistema comercial ni a otros productos.

Accesos locales, con el servidor de desarrollo habitual:

- [Remeras personalizadas](http://localhost:3000/productos/indumentaria/remeras-personalizadas).
- [Lonas](http://localhost:3000/productos/ficha/lonas).

En ambos casos, pulsar **Probar experiencia F02**. La disponibilidad y la alternancia de modo no cambiaron.

## Duplicación identificada y extracción

| Componente compartido | Responsabilidad |
|---|---|
| `GuidedModeBar` | Selector entre consulta comercial y prueba, con su estado accesible. El destino del foco al alternar sigue definido por cada piloto. |
| `GuidedDemoNotice` | Aviso de opciones ilustrativas, ausencia de persistencia y ausencia de envío. |
| `GuidedChoiceField` | Grupo de tarjetas con radios, ayudas, muestra de color opcional, estilo de asesoramiento y relación con errores. |
| `GuidedSteps` | Indicador de pasos con navegación y `aria-current`. |
| `GuidedActions` | Anterior, continuar/revisar y acceso al resumen. |
| `GuidedConfigurator` | Panel, encabezado, reinicio, título y ayuda del paso, aviso de error y composición de los campos específicos. Utiliza los dos componentes anteriores. |
| `GuidedNotes` | Observaciones controladas y ayuda existente de 2.000 caracteres. |
| `GuidedSummary` | Resumen dinámico recibido por propiedades, con regiones de lectura para textos extensos. |
| `GuidedReview` | Revisión final con las mismas filas, advertencia, edición y reinicio. |

`SummaryRows` es un detalle privado de las dos presentaciones de resumen. No se publica una API adicional para esa estructura interna.

El hook `useGuidedSteps` centraliza el estado del paso, la revisión, el error y los anuncios, junto con anterior/siguiente, validación antes de avanzar, validación de todos los pasos antes de revisar, reinicio y recuperación del foco. Recibe `validateStep` y `resetSelection` del producto: no conoce talles, centímetros, variantes ni reglas comerciales.

El CSS que ambos pilotos ya compartían bajo el nombre de Remeras se trasladó a `guided/GuidedPreview.module.css`. Sus reglas se conservaron literalmente; no se duplicaron ni se introdujeron valores visuales nuevos. El módulo incluye los estilos de controles numéricos que ya usaba la distribución de talles, sin trasladar sus cálculos ni su contenido.

Los dos pilotos pasaron de 535 a 358 líneas combinadas. La implementación común ocupa 189 líneas de TypeScript/TSX; el total pasa de 535 a 547. La ventaja es mantener una sola implementación de los controles y del recorrido, no una reducción artificial del total de líneas ni una mejora de rendimiento que no se midió.

## Qué permanece independiente

**Remeras:** catálogo demostrativo de modelos, materiales, colores, técnicas y ubicación; talles S/M/L/XL; distribución por talle, sumas, validaciones y textos propios; asesoramiento de talles y cantidad; cálculo de filas del resumen; galería y formulario comercial montado.

**Lonas:** materiales, usos, terminaciones y estado del diseño originales; ancho y alto, centímetros, coma/punto, dos decimales y validaciones; cantidad; esquema y ojales de referencia; asesoramiento específico; cálculo de filas del resumen; composición de galería, información comercial y modo de prueba.

Las nueve agrupaciones de opciones, sus 28 alternativas, ayudas y pasos coinciden con F02. Los inicializadores, validadores, cantidades y fórmulas de resumen se compararon mediante el AST de TypeScript contra el commit de base: no cambiaron.

No se creó un componente para cada ayuda desplegable o cada campo numérico. Los `<details>` nativos ya resuelven la interacción, sus contenidos difieren y un envoltorio mínimo no aportaría una ventaja comprobable. Tampoco se unificaron las galerías, el esquema o los contenedores comerciales: su disposición y su relación con los borradores son distintas.

## Archivos intervenidos

| Archivo | Cambio |
|---|---|
| `src/components/RemerasDevelopmentPreview.tsx` | Consume controles y recorrido compartidos. |
| `src/components/LonasDevelopmentPreview.tsx` | Consume la misma base y conserva sus campos y esquema propios. |
| `src/components/guided/GuidedPreview.tsx` | Nuevo módulo de componentes y tipos de opciones/filas. |
| `src/components/guided/useGuidedSteps.ts` | Nuevo hook del recorrido y foco. |
| `src/components/guided/GuidedPreview.module.css` | CSS compartido trasladado sin cambios de reglas. |
| `src/components/RemerasDevelopmentPreview.module.css` | Retirado de su ubicación anterior tras actualizar sus dos consumidores. |
| `docs/f03.3/` | Informe, seis registros JSON y 24 capturas comparativas. |

No se modificaron `ProductDetail`, `RemerasProductDetail`, `ProductSelection`, `ConsultationProvider`, el CSS específico de Lonas, las rutas de entrada, los datos, los prototipos F02 ni el despliegue. Los 37 archivos de E01 permanecen intactos.

## Comparación visual y funcional

| Verificación ejecutada | Resultado |
|---|---|
| Antes/después de ambos pilotos | 72/72 firmas iguales: seis estados por producto en 320, 390, 768, 1024, 1440 y 1670 px. Se compara marcado relevante, texto, valores, atributos accesibles, geometría y estilos calculados. |
| Capturas antes/después | 12/12 pares de PNG idénticos byte por byte. Son los pasos 1 y 3 y la revisión de ambos productos en 390 y 1440 px. |
| Producción recién compilada | 46/46 firmas iguales: las 23 fichas en 390 y 1440 px, incluidas las otras 21 fichas. |
| Funcionalidad | 18 grupos satisfactorios: opciones, validación, asesoramiento, ayudas, resumen, navegación, reinicio, borradores y regresiones comerciales. |
| Remeras | Distribución 8 + 12 = 20, cantidades vacías/cero/negativas/fraccionarias, asesoramiento y cantidad por definir. |
| Lonas | `120,50 × 80.25` se muestra como `120,5 × 80,25 cm`; tres piezas; errores de ancho, alto y cantidad; asesoramiento y esquema conservados. |
| Validación integral | Saltar al paso 3 y revisar sigue detectando y enfocando el primer dato pendiente de un paso anterior. |
| Texto extenso | 2.000 caracteres consecutivos y texto con espacios/saltos conservados; región enfocable y desplazable, sin desbordes en los seis anchos. |
| Teclado | Entrada con Enter, radios con flechas, Tab, foco visible, foco en errores y regreso lógico al formulario comercial. |
| Borradores | Cantidad y observaciones se conservan al alternar modos y reiniciar. Ninguna opción demostrativa se escribe en la consulta persistente. |
| R4 | Solicitud directa desde Lonas, edición, recarga, sincronización entre pestañas, conservación y resolución del borrador en conflicto y eliminación satisfactorias. |
| Almacenamiento bloqueado | Ambos recorridos completos funcionan; los borradores sobreviven al cambio de modo y la selección comercial se conserva en memoria con sus avisos. |
| JavaScript | Sin excepciones en el recorrido principal del navegador. |
| ESLint | `npm run lint`: satisfactorio. |
| TypeScript | `npx tsc --noEmit`: satisfactorio. |
| Compilación estática | `npm run build` con `GITHUB_ACTIONS=true` y `GITHUB_REPOSITORY=F3l1P3-F4/Chiks-web`: 48 páginas, basePath `/Chiks-web` y postbuild con 44 nombres de segmentos normalizados. |
| Exclusión en producción | 333 archivos exportados revisados. Cero controles/opciones de prueba y cero referencias a los nuevos módulos `GuidedPreview` y `useGuidedSteps`. |
| Mensaje comercial | `node scripts/test-consultation-request.mjs`: satisfactorio; Unicode, opcionales, validaciones y alternativa de mensaje extenso, sin solicitudes externas. |
| Protección | Comparación SHA-256 de los 238 archivos iniciales. Solo cambian los dos pilotos y se traslada su CSS; el resto permanece intacto. |

Los seis estados de la comparación son paso 1, paso 2, paso 3, revisión, observaciones extensas y asesoramiento. Para estabilizar las capturas se ocultó el indicador de desarrollo y se desactivaron transiciones, animaciones y el caret únicamente en el navegador de QA. No se modificó el CSS del sitio para hacer esa estabilización.

## Capturas para revisión

| Ejemplo | Antes | Después |
|---|---|---|
| Remeras, escritorio | [Paso 3, 1440 px](capturas/remeras-paso-3-1440-before.png) | [Paso 3, 1440 px](capturas/remeras-paso-3-1440-after.png) |
| Remeras, celular | [Paso 1, 390 px](capturas/remeras-paso-1-390-before.png) | [Paso 1, 390 px](capturas/remeras-paso-1-390-after.png) |
| Lonas, escritorio | [Paso 3, 1440 px](capturas/lonas-paso-3-1440-before.png) | [Paso 3, 1440 px](capturas/lonas-paso-3-1440-after.png) |
| Lonas, celular | [Revisión, 390 px](capturas/lonas-revision-390-before.png) | [Revisión, 390 px](capturas/lonas-revision-390-after.png) |

El directorio `capturas/` contiene los doce pares completos. Resultados: `comparacion-visual.json`, `comparacion-capturas.json`, `comparacion-produccion.json`, `pruebas-funcionales.json`, `exclusion-produccion.json` y `proteccion-proyecto.json`.

## Uso futuro de la base

1. Mantener en el producto su estado, las opciones confirmadas o explícitamente demostrativas, sus campos particulares y su función `validateStep`.
2. Elegir un `idPrefix` único para conservar identificadores, nombres de radios, relaciones de error y anclas sin colisiones.
3. Usar `useGuidedSteps` con los nombres de los pasos, el validador propio y una función que reinicie solo su selección de prueba.
4. Componer `GuidedConfigurator` con campos particulares como hijos. Usar `GuidedChoiceField` y `GuidedNotes` cuando coincidan con la interacción existente.
5. Construir las filas del resumen desde el estado específico y pasarlas a `GuidedSummary` y `GuidedReview`; la base no deduce medidas, talles, cantidades ni compatibilidades.
6. Conservar la importación condicionada a desarrollo en la entrada del producto, el aislamiento de R4 y la instancia comercial montada. Volver a comprobar la exportación al incorporar cualquier piloto nuevo.

No se conectó otro producto ni se creó un motor de reglas, una configuración global de variantes, una base de datos, persistencia nueva o un configurador comercial definitivo.

## Límites

- Las opciones siguen siendo ilustrativas. F03.3 no confirma materiales, talles, medidas admisibles, técnicas, mínimos ni disponibilidad.
- La base no implementa recorridos condicionales ni validaciones universales. Una necesidad futura distinta debe evaluarse con datos reales antes de ampliar la abstracción.
- Comprobaciones realizadas en Chromium con diferentes anchos; no se certificó Safari, dispositivos físicos o un lector de pantalla real.
- No se probó una recepción real por WhatsApp ni se modificó su configuración.

**F03.3 completada. Sin dependencias nuevas, commit, push ni deploy. No se avanzó a otros productos.**
