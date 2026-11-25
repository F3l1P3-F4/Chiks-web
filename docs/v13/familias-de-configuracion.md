# Familias para futuras fichas configurables

Propuesta técnica de V13. No modifica las categorías comerciales, los productos, las URLs ni las selecciones disponibles. No confirma stock ni compatibilidades. Ningún configurador adicional está habilitado.

## Base reutilizable

La separación propuesta aprovecha lo que ya existe:

1. **Información y fotografía:** `ProductInfo`, `ProductDetail`, `ProductGallery` y `CatalogImage`. La presentación no depende de que exista un configurador.
2. **Consulta general vigente:** `ProductSelection`, `ProductConsultation` y `ConsultationProvider`. Siguen resolviendo cantidad, observaciones, validación, conflictos, persistencia y acceso a Mi consulta.
3. **Área futura de configuración:** `ProductDetail` conserva `renderWorkspace(gallery, commercialInfo)` como punto de extensión. Se puede incorporar una composición por familia sin reescribir las 21 páginas ni duplicar la galería.
4. **Selección visual, cuando existan opciones validadas:** reutilizar `GuidedChoiceField`, `RequestedPreferenceField`, resúmenes y ayudas. `useGuidedSteps` sólo cuando la complejidad justifique una selección progresiva; no imponer tres pasos a todos los productos.
5. **Datos de configuración separados de la presentación:** cada producto declarará únicamente los campos aplicables, sus opciones documentadas y su condición de preferencia solicitada o alternativa confirmada. Las reglas de talles, dimensiones o unidades serán específicas de cada familia/producto.

La persistencia actual admite cantidad y observaciones en las fichas generales; las configuraciones estructuradas están tipadas para Remeras y Lonas. Incorporar variantes estructuradas a otras fichas requerirá una ampliación compatible y validada de ese contrato en una etapa futura. V13 no introduce campos, versiones o almacenamientos nuevos ni guarda configuraciones simuladas dentro de observaciones.

## Matriz de las 21 fichas

Las familias siguientes son propuestas de interacción. Buzos y Hoodies permanece comercialmente en Merchandising aunque su posible formulario futuro comparta reglas de indumentaria.

| Familia propuesta | Producto / slug actual | Información presente en el proyecto | Confirmación necesaria antes de habilitar opciones |
| --- | --- | --- | --- |
| A. Indumentaria | Buzos y Hoodies — `buzos-y-hoodies` | Buzo clásico, hoodie con capucha; estampado o bordado como texto informativo. | Modelos ofrecidos, materiales, tabla de talles por modelo, cantidades por talle, técnicas compatibles y ubicaciones. |
| A. Indumentaria | Camperas — `camperas` | De abrigo y rompevientos; logo bordado o estampado. | Modelos, materiales, talles, colores y personalización disponibles para cada alternativa. |
| A. Indumentaria | Conjuntos Deportivos — `conjuntos-deportivos` | Camiseta y short para clubes/equipos. | Si se consulta por conjunto o por pieza, modelos, talles de cada pieza, materiales y distribución de cantidades. |
| B. Gráfica | Banners — `banners` | Portabanner y roll-up como variantes informativas. | Soportes ofrecidos, materiales, medidas admitidas, terminaciones e inclusión del soporte. |
| B. Gráfica | Vinilos — `vinilos` | Impreso brillante, impreso mate y de corte. | Materiales/adhesivos ofrecidos, medidas, superficie de aplicación, terminaciones y alcance de colocación. |
| B. Gráfica | Microperforados — `microperforados` | Vinilo microperforado, vidrios y lunetas vehiculares. | Material concreto, dimensiones, uso, superficie y condiciones de instalación. |
| B. Gráfica | Backlite — `backlite` | Soporte traslúcido para carteles luminosos/cajas de luz. | Materiales, medidas y terminaciones ofrecidos; si incluye sólo impresión u otros elementos. |
| C. Merchandising | Gorras — `gorras` | Estampado o bordado como información existente. | Modelos, materiales, colores y técnicas por modelo. |
| C. Merchandising | Tazas — `tazas` | Logo o diseño full color. | Modelos, materiales, capacidad/medidas, zonas de personalización y cantidades. |
| C. Merchandising | Llaveros — `llaveros` | Personalización para promociones y souvenirs. | Formatos, materiales, medidas y técnicas realmente ofrecidos. |
| C. Merchandising | Neceseres — `neceseres` | Organizadores/neceseres multiuso. | Modelos, medidas, materiales y ubicaciones/técnicas de personalización. |
| C. Merchandising | Botineros — `botineros` | Escudo y colores del club. | Modelos, materiales, medidas, colores y aplicación del escudo. |
| C. Merchandising | Mochilas — `mochilas` | Uso deportivo y traslados de clubes. | Modelos, capacidades/medidas, materiales y personalización. |
| C. Merchandising | Toallones — `toallones` | Toallones deportivos estampados. | Materiales, medidas, técnicas y opciones de diseño. |
| C. Merchandising, por confirmar | Banderas — `banderas-deportivas` | Bandera, tirante y estandarte; sublimación full color. | Diferencia con `/productos/ficha/banderas`, materiales, medidas y terminaciones; determinar si conviene un formulario de Gráfica. |
| C. Merchandising, por confirmar | Banderas — `banderas` | Telas sublimadas para exterior/interior. | Diferencia de alcance con Banderas deportivas; materiales, medidas y confección. No fusionar ni reasignar sin aprobación. |
| C. Merchandising | Regalos Empresariales — `regalos-empresariales` | Tazas, mates, libretas y bolígrafos mencionados en la ficha existente. | Si la ficha representa una selección individual o un conjunto, opciones reales de cada artículo y cantidades. No crear fichas adicionales automáticamente. |
| D. Proyectos a medida | Marquesinas — `marquesinas` | Con/sin iluminación como variantes informativas. | Alcance de diseño, impresión, estructura, iluminación y montaje; dimensiones de referencia e información necesaria para cotizar. |
| D. Proyectos a medida | Vidrieras — `vidrieras` | Vinilo esmerilado, promocional y de corte como información. | Superficie, medidas aproximadas, diseño y alcance de colocación. |
| D. Proyectos a medida | Ploteo Vehicular — `ploteo-vehicular` | Rotulación de utilitarios, camionetas y flotas. | Tipo de vehículo, zonas a intervenir, alcance y datos/fotos de referencia necesarios; sin implementar carga de archivos. |
| D. Proyectos a medida | Stands y Cartelería — `stands-y-carteleria` | Cartelería corpórea, cuadros, tótems y elementos para stands. | Tipo de pieza, uso, dimensiones aproximadas, montaje y asesoramiento necesario. |

Distribución propuesta: A = 3, B = 4, C = 10, D = 4. Total: 21 fichas. Remeras V11 y Lonas V12 quedan fuera de esta matriz de implementación.

## Preguntas comunes para Aldana y Karina

- ¿Qué alternativas se pueden seleccionar realmente y cuáles sólo se reciben como preferencias para cotizar?
- ¿Qué datos son obligatorios para presupuestar cada producto y cuáles pueden quedar para asesoramiento?
- ¿Cómo se interpreta la cantidad: piezas, conjuntos, lotes o proyectos? La interfaz actual conserva “Cantidad solicitada” sin inventar unidades comerciales.
- ¿Hay mínimos? ¿A cuáles productos o combinaciones se aplican?
- ¿Qué combinaciones de material, técnica, color y terminación están confirmadas?
- ¿Qué medidas o tablas de talles corresponden a cada modelo? ¿Qué unidad debe usarse?
- ¿Qué datos sobre diseño, colocación o montaje se necesitan y cómo se recibirán mientras P01, carga de archivos, siga pendiente?
- ¿Cuáles son las diferencias comerciales entre las dos fichas de Banderas y cómo se consulta Regalos Empresariales?

Hasta resolver estas preguntas, todas las fichas generales continúan con cantidad y observaciones, sin controles ficticios ni promesas nuevas.
