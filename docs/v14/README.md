# V14 — Diseño funcional de las 21 fichas generales

Base revisada: `492a21f`, rama `desarrollo`. Documento de propuesta, no implementación ni aprobación comercial. No se modifican fichas, categorías, rutas, Mi consulta o almacenamiento.

## Documentos de revisión

- [Matriz de los 21 productos](matriz-productos.md): asignación exacta de V13, pasos, controles, pendientes, reutilización y complejidad.
- [Campos y validación comercial](campos-y-validacion.md): alternativas concretas, estado por campo y preguntas que impiden habilitar opciones.
- [Integración con F04](integracion-f04.md): contrato propuesto, identidad, compatibilidad, guardado y mensaje único.

## Qué está definido y qué necesita aprobación

La regla de experiencia es seleccionar primero y escribir sólo cuando sea necesario. Eso no autoriza a llenar una tarjeta con alternativas inventadas.

| Estado | Significado | Tratamiento propuesto |
| --- | --- | --- |
| C — Confirmado comercialmente | Hay aprobación comercial identificable para esa opción y ese producto. | Puede publicarse como opción confirmada, sin deducir stock o compatibilidades no aprobadas. |
| R — Preferencia solicitada | El cliente expresa una necesidad; los nombres ofrecidos provienen del catálogo existente o describen su propia intención. | Mostrar “Preferencia sujeta a confirmación al presupuestar”. Guardar y comunicar como solicitud. |
| P — Pendiente de aprobación | Faltan alternativas, unidad, alcance, compatibilidad o una decisión comercial. | No mostrar alternativas vacías, botones inactivos ni listas ficticias. Mantener asesoramiento/Otra preferencia hasta resolver el pendiente, cuando eso permita una consulta comprensible. |
| N — No corresponde | No es un control necesario del flujo propuesto para ese producto. | No mostrar ni solicitar. No significa que el objeto carezca físicamente de esa característica. |

En las fuentes revisadas no se encontró una aprobación específica que permita marcar **C** a nuevas variantes seleccionables de estas 21 fichas. Los textos existentes son evidencia de contenido publicado, no prueba suficiente de disponibilidad. Las referencias ya nombradas se proponen como **R**; los catálogos de opciones aún desconocidos permanecen **P**. No se traslada la aprobación de Vinilo/DTF, colores o talles de Remeras a otros productos.

Los estados R identifican propuestas de interfaz: tampoco significan que V14 haya habilitado un selector. La aprobación de esta experiencia y las decisiones pendientes preceden a su implementación.

## Campos comunes y reglas

Estos campos forman parte de **cada una de las 21 filas** de la matriz, además de sus particularidades:

| Campo | Control y alternativas exactas propuestas | Estado | Regla |
| --- | --- | --- | --- |
| Producto | Nombre y enlace de la ficha, de sólo lectura. | Identidad existente; no es una opción de disponibilidad C. | Conservar nombre, id y URL; desambiguar las dos Banderas por su slug. |
| Cantidad solicitada | Número entero positivo. | R; validación técnica ya existente. | No inventar mínimos. La unidad comercial de cada producto es P hasta confirmarla; nunca convertir una cantidad en packs, metros cuadrados o proyectos implícitos. |
| Estado del diseño | Una tarjeta: “Tengo un diseño preparado”, “Todavía no tengo un diseño preparado” o “Necesito asesoramiento”. | R: declaración del cliente. | Opcional. No confirma revisión del archivo ni incluye carga de archivos. |
| Observaciones adicionales | Texto opcional, hasta 2.000 caracteres. | R. | Conservar contenido; no pedir datos personales en las observaciones del producto. |
| Asesoramiento | Opción en cada decisión y casillas de temas aplicables. | R. | Permite continuar sin inventar decisiones. No sustituye la cantidad positiva exigida por F04. |
| Precio | “Consultar”, de sólo lectura. | Texto vigente; importe numérico P. | Sin cálculo de precio ni cotización automática. |
| Cantidad mínima | No se agrega un selector. | P en las 21 fichas. | Sólo aplicar un mínimo cuando exista aprobación por producto/variante. |
| Colores | Sin pantonera nueva. Otra preferencia permite describir el color buscado. | R para descripción; P para paleta y combinaciones. | No copiar los diez colores de Remeras. |
| Tiempos, stock, pagos y carga de archivos | Sin controles en esta propuesta. | N como campos del configurador. | No promete disponibilidad; la decisión de archivos P01 sigue pendiente. |

El selector de asesoramiento usa sólo temas aplicables: modelo, material, talles, medidas, diseño, personalización o terminación, según la fila. No presentar “talles” en Tazas ni “montaje” como servicio ofrecido cuando no está aprobado.

## Propuesta visual por familia

### A. Indumentaria — tres pasos

1. **Modelo y preferencias:** tarjetas de los modelos nombrados en la ficha; material sólo con alternativas aprobadas. Otra preferencia y asesoramiento complementan la selección.
2. **Talles y cantidades:** elección entre cantidad total y distribución por talle. Botones de talles únicamente cuando se aprueben referencias para ese producto. Para un talle especial, referencia libre y cantidad. Total automático.
3. **Personalización:** técnica solicitada cuando esté nombrada, estado del diseño y observaciones. Ubicaciones y colores sólo cuando se aprueben; no suponer frente/espalda en todas las prendas.

La distribución conserva R5.1: 20 → distribución válida de 30 → desactivar → 30. Reactivar recupera las filas y anuncia el total recuperado; no asigna cantidades por defecto. El modelo de Conjuntos necesita definir antes si camiseta/short se cotizan juntos o por pieza.

### B. Gráfica — dos o tres pasos

- **Banners y Vinilos:** tipo/uso → medidas/cantidad → terminación/diseño.
- **Microperforados y Backlite:** uso/medidas/cantidad → diseño y necesidades especiales. Un material único ya nombrado se presenta como información, no como una decisión artificial.
- Usos pueden ser casillas múltiples cuando la ficha nombra varios. Son contextos de la misma solicitud: no reparten cantidades ni autorizan compatibilidades. Dimensiones diferentes requieren configuraciones separadas.
- Medidas: “Quiero indicar medidas” o “Necesito asesoramiento”, excluyentes. Unidad visible propuesta: cm, sin límites de fabricación inventados. Aceptar coma/punto y valores positivos. No calcular superficie facturable.

### C. Merchandising — uno o dos bloques

- **Un bloque sin indicador de pasos:** Tazas, Llaveros, Neceseres y Mochilas. Cantidad, diseño y preferencias disponibles; los campos sin alternativas no deben fabricar un segundo paso vacío.
- **Dos pasos:** Gorras, Botineros, Toallones, ambas Banderas y Regalos Empresariales. Preferencias/cantidad → personalización o diseño, con particularidades en la matriz.
- Regalos Empresariales utiliza **un artículo de interés por configuración**. Elegir varias configuraciones permite consultar distintos artículos sin mezclar una cantidad global ambigua ni crear productos nuevos. No se presume que exista un kit o un pack.
- Las dos fichas de Banderas permanecen en C, incluso si reutilizan el control de medidas de B. No se fusionan ni se reasignan.

### D. Proyectos a medida — dos pasos

1. **Qué necesitás y dónde se aplicaría:** referencia de alcance nombrada en la ficha, contexto de uso y dimensiones aproximadas cuando aporten información.
2. **Diseño y asesoramiento:** estado del diseño, necesidades especiales, cantidad con unidad comercial aprobada y revisión.

Ubicación significa contexto o tipo de superficie; no domicilio, geolocalización ni patente. No se agregan servicios de instalación, estructura o electricidad como disponibles. En Ploteo Vehicular no se exige ancho/alto del vehículo completo. La unidad de consulta de estos cuatro productos debe aprobarse antes de habilitar el flujo: no preseleccionar silenciosamente “1 proyecto”.

## Comportamientos comunes

- Mantener galería e información útil de V13. Escritorio: galería/resumen a la izquierda y formulario a la derecha. Móvil: galería → formulario → resumen, con una sola instancia y orden DOM coherente.
- Tarjetas de elección única con radios. Casillas para varias necesidades o usos independientes; la multiselección no significa combinaciones comerciales confirmadas.
- Otra preferencia abre un texto complementario. Los valores anteriores fuera de la lista se recuperan allí, no se borran ni se reinterpretan.
- Ayudas en desplegables cercanos al campo; etiquetas explícitas, foco visible y áreas táctiles de al menos 44 px. Los estados no dependen sólo del color.
- Resumen dinámico: producto, cantidad, preferencias activas, dimensiones/unidad si corresponden, asesoramiento y observaciones. No listar campos P sin resolver como si hubieran sido seleccionados.
- Revisar selección no guarda. “Agregar a mi consulta” y “Guardar cambios” mantienen acciones diferenciadas; “Solicitar presupuesto” valida, guarda y comprueba el resultado antes de navegar.
- Volver entre pasos conserva el borrador. Contraer Mi consulta no lo desmonta. Los datos personales siguen separados y temporales.
- Cambiar de modo puede inactivar medidas/talles: conservarlos en el borrador abierto, sin incluirlos como definitivos al guardar el modo alternativo. No prometer recuperar después de una recarga datos que nunca se guardaron.
- Si una elección altera otras, informar qué necesita revisión. No sustituir variantes, colores, cantidades o especificaciones silenciosamente.
- Los pasos indicados son el diseño objetivo con sus campos aprobados. Si un paso queda sin decisiones reales, se omite; no se crea un paso para mostrar pendientes. La revisión común no se suma artificialmente como un paso obligatorio del producto.

## Orden de desarrollo propuesto

No autoriza iniciar estas etapas. Cada grupo se habilita después de sus decisiones comerciales y pruebas.

| Etapa | Productos | Reutilización y condición de salida |
| --- | --- | --- |
| 0. Base y validación | Sin fichas nuevas activadas. | Aprobar matriz, unidad de cantidad, referencias R y contrato F04. Implementar primero lectores compatibles y pruebas mixtas, con escritores nuevos desactivados. |
| 1. Preferencias y cantidad | Tazas como piloto; después Llaveros, Neceseres, Mochilas y Gorras (5). | Un bloque simple; Gorras añade preferencias de técnica y dos pasos. No esperar modelos inventados para rellenar tarjetas. |
| 2. Medidas reutilizables | Microperforados, Backlite, Banners y Vinilos (4). | Medidas/asesoramiento, usos, formato y resumen. Banners y Vinilos agregan un tercer paso justificado. |
| 3. Distribución y personalización | Buzos y Hoodies, Camperas, Conjuntos Deportivos, Botineros y Toallones (5). | Reutilizar talles/cantidades cuando apliquen; Botineros y Toallones mantienen familia C y no heredan una tabla de talles de prendas. |
| 4. Alcances ambiguos y a medida | Ambas Banderas, Regalos Empresariales, Marquesinas, Vidrieras, Ploteo Vehicular y Stands y Cartelería (7). | Resolver diferencias entre Banderas, artículo/unidad de Regalos y alcance/unidad de proyectos. Reutilizar controles anteriores sin fusionar fichas. |

Las etapas 1–4 cubren exactamente 21 fichas. La complejidad de cada producto en la matriz es relativa y no constituye un plazo o presupuesto de desarrollo.

## Fuentes y límite de la revisión

Se consultaron la matriz V13, ProductDetail, catalogEntries, los componentes compartidos F03.3, las selecciones vigentes de Remeras/Lonas, guidedCatalogs y las funciones de configuración, almacenamiento y mensaje de F04. No se revisaron capturas ni informes históricos. Las guías de tareas y formularios de Impeccable orientan esta propuesta; no se ejecutó un detector o una prueba visual.

Sólo se crean documentos en `docs/v14/`. No corresponde ejecutar builds, ESLint, navegador ni regresiones funcionales para esta etapa de diseño documental. La comprobación final es de cobertura y coherencia de los documentos.

Comprobación de cierre realizada: 21 slugs únicos, nombres exactos respecto de `catalogEntries`, asignación idéntica a V13 (3/4/10/4), siete columnas en las 21 filas de la matriz y un registro de campos para cada producto. Los cuatro documentos están en UTF-8 y sus enlaces internos de archivo resuelven. El estado Git confirma que no se modificó código de producción; el cambio previo de AGENTS.md se conserva sin alteraciones.
