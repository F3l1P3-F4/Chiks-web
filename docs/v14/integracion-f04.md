# Integración propuesta con Mi consulta y F04

Diseño para una implementación posterior. Este documento no cambia el contrato, los componentes ni el almacenamiento actual.

## Situación comprobada

| Elemento | Comportamiento actual | Consecuencia para la propuesta |
| --- | --- | --- |
| ProductDetail | Sirve a las 21 fichas generales y ofrece `renderWorkspace(gallery, commercialInfo)`. | Mantener la plantilla y sustituir únicamente el área de consulta cuando un perfil esté habilitado. |
| ProductSelection | Guarda cantidad y observaciones; busca la selección general por id de producto. | Conservarlo para el flujo general. No usar esa búsqueda por producto para editar varias configuraciones, porque tomaría la primera. |
| GuidedProductSelection | Controla borrador, revisión, guardado, conflicto y navegación para los dos tipos vigentes. | Reutilizar el mecanismo de identidad y transacción; separar las reglas propias antes de extenderlo. No copiar todo el componente 21 veces. |
| ProductConfiguration | Versión 1; tipos `remeras` y `lonas`, campos específicos y listas permitidas por producto. | No basta añadir tarjetas: los nuevos datos hoy serían rechazados o eliminados por validadores/normalización. |
| ConsultationProvider/store | Un único estado, clave `las-chikas-design:consulta:v1`, envoltorio de datos versión 1 y adaptador localStorage. | Conservar proveedor, clave y flujo. No crear un store por familia ni una consulta paralela. |
| itemKey / selectionVersion | Identidad por configurationId cuando existe; por producto en selecciones anteriores. Versiona el contenido completo. | Preservar identidad y comparación con la versión esperada al guardar/editar/eliminar. |
| configurationRows | Produce filas para resúmenes y mensaje. | Añadir interpretación de los nuevos datos una sola vez y reutilizarla en todos los destinos. |
| Mensaje/WhatsApp | Valida productos y cliente; crea un mensaje único y exige revisión/consentimiento según el canal disponible. | No crear mensajes por familia ni simular recepción al abrir WhatsApp. |

## Componentes a reutilizar y adaptaciones necesarias

| Bloque | Reutilización propuesta | Lo que todavía debe adaptarse |
| --- | --- | --- |
| ProductDetail, ProductGallery, CatalogImage | Información, foto, estados sin imagen, rutas y estructura V13. | Conectar el perfil habilitado a la composición sin tocar Remeras/Lonas. |
| GuidedChoiceField | Tarjetas de elección única, etiquetas y foco. | Un control de casillas para usos o temas múltiples; no convertir radios en multiselección mediante CSS. |
| RequestedPreferenceField | Referencias solicitadas, asesoramiento y Otra preferencia; recuperación de textos fuera del catálogo. | Conectar a campos de la nueva configuración, sin deducir disponibilidad del valor. |
| GuidedSteps, GuidedActions, GuidedConfigurator, useGuidedSteps | Navegación progresiva, errores, anuncio y foco para dos/tres pasos. | Perfiles de pasos reales por producto. Para un bloque único, composición simple sin barra de pasos artificial. |
| RemerasConfigurationFields | Reglas de talles solicitados, cantidades, total y ayuda. | Extraer control de distribución compartido, independiente de las opciones de Remeras; preservar R5.1 y su límite técnico actual. |
| LonasConfigurationFields | Medidas, unidad, esquema y decisión excluyente de asesoramiento. | Extraer control numérico/asesoramiento sin copiar materiales o terminaciones de Lonas. Para proyectos, distinguir medida aproximada de definitiva. |
| GuidedSummary, SummaryRows, GuidedNotes | Resumen legible, observaciones extensas y revisión. | Filas canónicas para campos múltiples, preferencias y medidas activas. |
| ConsultationReview / ConsultationItemSummary | Panel blanco, contador, edición por identidad, eliminación y resumen. | Reconocer perfiles nuevos y generar sus enlaces de edición; hoy la detección guiada está restringida a dos productos. |
| ProductConsultation y transacción de guardado | Guardar antes de navegar al presupuesto; advertencias de sesión temporal. | Un único controlador de guardado para la selección activa, en vez de duplicar validación en botones diferentes. |

No se proponen dependencias, rutas nuevas, formularios personales adicionales, un backend ni un administrador.

## Contrato recomendado para guardar selecciones estructuradas

Propuesta a aprobar antes de implementar: conservar el envoltorio versión 1 y la clave existente, ampliando **la configuración de cada elemento** mediante una variante de contrato versión 2. La versión del envoltorio y la versión de configuración tienen funciones distintas.

Los lectores futuros admitirían tres casos explícitos:

1. Selección anterior sin configuración: id, nombre, ruta, cantidad y observaciones.
2. Configuración versión 1 de Remeras o Lonas, interpretada como hoy, sin reclasificar opciones.
3. Configuración versión 2 de un perfil nuevo aprobado, con familia A/B/C/D y validación específica por producto.

No se presenta la versión 2 como compatible con el código actual. Requiere cambios futuros coordinados en tipos, validación, limpieza, lectura, edición, filas y mensaje.

| Dato propuesto | Función y regla |
| --- | --- |
| id, name, path | Mantener el producto existente; nombre/ruta se obtienen del catálogo del proyecto. Un artículo de interés no crea otra ficha o producto. |
| quantity / notes | Conservar campos vigentes, cantidad entera positiva y notas hasta 2.000 caracteres. El significado comercial de la unidad debe estar aprobado por perfil. |
| configurationId | Identidad estable de una nueva configuración. No derivarla sólo de las opciones elegidas: dos solicitudes pueden ser deliberadamente independientes. |
| configuration.version | Distinguir contrato nuevo de versión 1. No cambiar la versión de una configuración antigua sólo por abrirla. |
| Familia y perfil | Identificar familia de interacción y perfil por producto, sin alterar su categoría comercial. |
| Revisión del perfil | Detectar cambios en opciones/reglas respecto del momento de guardado. No significa una revisión de precio. |
| Preferencias seleccionadas | Id estable de campo/opción y etiqueta de lectura; tipo de valor único o múltiple; condición de solicitud R o confirmación C según la definición aprobada. |
| Solicitudes libres | Texto complementario cuando no hay alternativa aplicable. No tratarlo como una opción de stock. |
| Distribución de cantidades | Referencias de talle y cantidades; suma igual a quantity. No imponer a los otros productos las referencias de Remeras. |
| Medidas activas | Ancho, alto, unidad y condición aproximada cuando corresponda; sólo si el usuario eligió indicar medidas. |
| Temas de asesoramiento | Lista de campos aplicables al producto; no confundirla con una selección comercial. |

No guardar HTML, datos personales, archivos, direcciones, patentes ni tokens. Los nombres de campos, tipos y longitudes se validan por una lista explícita del perfil. La condición C procede de la definición aprobada, no de un valor arbitrario suministrado por el navegador.

Los campos P no se convierten en valores vacíos de una opción comercial. La ausencia de una selección se representa como no definida o como asesoramiento; no como una elección ficticia.

## Identidad, edición y consultas anteriores

- Una nueva configuración usa la identidad de configuración, no sólo el id del producto. “Agregar otra configuración” crea una identidad distinta de forma explícita; guardar dos veces la misma edición actualiza una sola selección.
- Editar una configuración utiliza la identidad concreta desde el enlace de Mi consulta. Regalos Empresariales y Stands pueden tener varios artículos/piezas de interés bajo su ficha actual, cada uno con su configuración y cantidad.
- Una selección general anterior mantiene su id de producto como clave de edición. Si el usuario confirma convertirla a una configuración estructurada, la propuesta conserva esa clave heredada para actualizarla **en el mismo elemento**, sin crear una copia. El futuro validador debe permitir ese caso explícito. Las configuraciones adicionales usan ids nuevos.
- Nombre, ruta, cantidad y observaciones anteriores se recuperan completos. No extraer automáticamente talles, materiales o dimensiones del texto de observaciones; el usuario debe revisarlos y elegirlos.
- Abrir o recargar no migra ni escribe. Sólo Guardar aplica una conversión revisada. No convertir las 21 selecciones en un lote por detectar una versión antigua.
- Una opción retirada conserva su etiqueta/valor guardados y se señala para revisión. No sustituirla por la primera opción disponible ni descartarla durante la normalización.
- Registros no interpretables mantienen el comportamiento de protección de F04: conservar el contenido original y bloquear una sobrescritura que pierda datos. No vaciar la consulta para poder continuar.

## Transacción única de guardado

El borrador y las reglas visuales se mantienen separados del estado persistente. El guardado propuesto sigue esta secuencia:

1. Validar cantidad, campos activos, sumas, unidades y opciones del perfil.
2. Mostrar revisión de la selección; el usuario puede volver sin perder el borrador.
3. Guardar mediante el proveedor existente, enviando la identidad y la versión base que se está editando.
4. Si hay conflicto, mantener el borrador y pedir resolución explícita. No sobrescribir por haber pulsado Solicitar presupuesto.
5. Si el navegador bloquea almacenamiento, conservar sólo en memoria y advertirlo como hoy. No mostrar “guardado permanente”.
6. Leer el resultado actual y comprobar que contiene la selección esperada antes de navegar a Mi consulta.

Las dimensiones inactivas y la distribución desactivada pueden permanecer en el borrador abierto para recuperarlas, pero no se envían como definitivas. No introducir un segundo guardado paralelo ni otro estado global para cada familia.

## Mi consulta y mensaje único

Las nuevas filas se definirían en el mismo formateador central que consume la ficha, Mi consulta y WhatsApp: producto, cantidad, tipo/modelo/artículo solicitado, preferencias, usos múltiples, talles, medidas/unidad, condición aproximada, asesoramiento y observaciones. Mostrar únicamente campos activos.

“Solicitado” y “aproximado” deben permanecer en el texto del mensaje cuando apliquen. Una solicitud guardada no es un pedido aceptado, una variante disponible ni una cotización calculada. Varias configuraciones del mismo producto se numeran y conservan sus cantidades particulares.

Los datos de Tus datos siguen en el contexto temporal separado. Copia, revisión, consentimiento, alternativa de mensajes extensos y número comercial no configurado conservan el funcionamiento R4.4. No incorporar datos personales a hashes o rutas de edición.

## Secuencia de compatibilidad antes de publicar escritores nuevos

1. Aprobar contrato y perfiles. Añadir pruebas para los tres formatos y lectores/normalizadores/filas compatibles, con la escritura de versión 2 desactivada.
2. Validar edición mixta y regresión completa de R5.1, R5-UX02, Remeras y Lonas. No reclasificar sus opciones ni cambiar sus formularios para aprovechar la base nueva.
3. Activar un producto piloto mediante su perfil, no los 21 simultáneamente. Mantener el formulario general si el producto aún no está aprobado.
4. Documentar el comportamiento entre versiones: una pestaña con el código antiguo **no sabe leer** configuraciones versión 2 y puede mostrar el aviso de almacenamiento desconocido. El despliegue estático no garantiza que todas las pestañas estén actualizadas. No prometer compatibilidad bidireccional automática ni recargar borradores sin revisión.
5. Para desactivar un piloto, volver al formulario general conservando los lectores nuevos. No restaurar simplemente `492a21f` después de que existan datos versión 2; ese código no los interpretaría. La estrategia de transición debe aprobarse antes de habilitar la escritura.

## Criterios de aceptación para la etapa de implementación

- Mezcla de selección antigua, Remeras V1, Lonas V1 y varias configuraciones nuevas sin duplicados ni pérdida de notas.
- Edición y eliminación por identidad; conversión voluntaria de una selección antigua sin duplicarla.
- Cantidades válidas, distribución con total coherente y exclusión de medidas inactivas, conservando R5.1.
- Selecciones únicas/múltiples, asesoramiento y Otra preferencia recuperados exactamente al guardar/recargar/editar.
- Conflicto entre pestañas, borrador sin guardar, eliminación temporal y almacenamiento bloqueado.
- Opciones retiradas, perfiles no habilitados y datos desconocidos sin borrado automático.
- Mismas filas en resumen, Mi consulta y mensaje; todos los productos en un solo mensaje, sin envío simulado.
- SSR/hidratación, exportación estática y basePath existentes; móvil/escritorio, teclado y foco.

Estos criterios son **pruebas futuras propuestas**, no verificaciones ejecutadas en V14.
