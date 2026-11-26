# Registro de campos y validación comercial

Estados: **C** confirmado comercialmente con evidencia identificable; **R** preferencia solicitada; **P** pendiente de aprobación; **N** no corresponde como control de este flujo. No se acredita C a nuevas variantes de estas 21 fichas. Fuente de nombres y referencias: `src/data/catalogEntries.ts`, contrastado con la asignación V13.

Cada ficha hereda los campos comunes del [README](README.md#campos-comunes-y-reglas): cantidad R, diseño R, observaciones R, asesoramiento R, precio Consultar informativo y mínimos P. No se repiten a continuación. Las listas P son campos previstos, **no opciones para mostrar ahora**. Material, color o medidas desconocidos no se deducen de fotografías.

## A. Indumentaria

### Buzos y Hoodies (`buzos-y-hoodies`)

- **R:** modelo, elección única Buzo clásico / Hoodie con capucha. Técnica solicitada, elección única Estampado / Bordado. Talle especial y material deseado pueden describirse en Otra preferencia, sin lista prefijada. Cantidades solicitadas por talle cuando el cliente indique sus referencias.
- **P:** tabla de talles por modelo; conjunto de materiales; colores; posiciones de personalización; combinaciones de técnica/material y mínimos. Los talles S/M/L/XL de Remeras no acreditan una tabla para esta ficha.
- **N:** uso de ancho/alto como área de impresión completa del producto; iluminación, montaje y ámbito de instalación.
- **Antes de activar:** aprobar las referencias R como solicitudes y decidir cómo manejar talles distintos al cambiar Buzo/Hoodie. Conservar el borrador anterior y pedir revisión, no convertir equivalencias automáticamente.

### Camperas (`camperas`)

- **R:** modelo De abrigo / Rompevientos. Técnica solicitada Bordado / Estampado. Referencias de talle aportadas por el cliente y cantidades por referencia.
- **P:** modelos concretos, tabla por modelo, material, colores y ubicaciones. No mostrar variantes de cierres, forros u otras características que no figuran en el proyecto.
- **N:** capacidad en litros, medidas de cartel y servicios de montaje.
- **Antes de activar:** confirmar qué datos permiten cotizar cada modelo y qué técnicas se pueden solicitar para él.

### Conjuntos Deportivos (`conjuntos-deportivos`)

- **R:** necesidad de Camiseta y short como descripción informativa; diseño y referencias especiales indicadas por el cliente.
- **P:** modelo, material, técnica, colores y talles; si camiseta y short integran una unidad o pueden pedirse separados. La selección múltiple de piezas y las cantidades independientes por pieza **no se habilitan** antes de resolverlo.
- **N:** ancho/alto de cartelería, iluminación y montaje.
- **Antes de activar:** definir unidad y regla de talles. Si se cotiza por conjunto, el total cuenta conjuntos y la asignación de talles de ambas prendas debe sumar ese total. Si se cotiza por pieza, se requieren configuraciones separadas o un contrato aprobado que lo represente; no sumar camisetas y shorts como conjuntos.

## B. Gráfica

### Banners (`banners`)

- **R:** formato Portabanner / Roll-up, uno por configuración. Usos Ferias / Presentaciones / Eventos, casillas múltiples. Dimensiones deseadas, con unidad visible, o asesoramiento.
- **P:** materiales, medidas de catálogo, terminaciones, disponibilidad y contenido del soporte. No anunciar Frontlit por copiar el configurador de Lonas; tampoco incorporar un selector “incluye estructura” sin aprobación.
- **N:** talles de indumentaria, capacidad y datos identificatorios del lugar del evento.
- **Antes de activar:** confirmar si cada formato tiene medidas fijas o personalizadas y qué representa la cantidad. No limitar el ancho a un formato inventado.

### Vinilos (`vinilos`)

- **R:** tipo Impreso brillante / Impreso mate / De corte, uno por configuración. Usos Señalización / Calcos / Decoración de superficies lisas, múltiples. Medidas solicitadas o asesoramiento; contexto de superficie en Otra preferencia.
- **P:** adhesivos/materiales concretos, formas o terminaciones seleccionables, medidas de catálogo, límites técnicos e instalación. Los tres tipos no acreditan compatibilidad con cualquier superficie.
- **N:** talles de prenda, iluminación y estructuras.
- **Antes de activar:** acordar unidad de cantidad y significado de cada tipo; si cambian medidas o tipo, crear otra configuración en vez de combinarlos en una cantidad ambigua.

### Microperforados (`microperforados`)

- **R:** usos Vidrios de locales / Lunetas vehiculares, múltiples como contextos. Dimensiones deseadas o asesoramiento. “Vinilo microperforado” se conserva como información existente; no se fuerza una tarjeta única de material.
- **P:** material concreto, otras variantes, terminaciones y condiciones/alcance de colocación.
- **N:** talles, capacidad y selección de vehículo mediante patente o identificación personal.
- **Antes de activar:** validar unidad, datos de superficie necesarios y si cada superficie debe cotizarse por separado.

### Backlite (`backlite`)

- **R:** uso Carteles luminosos / Cajas de luz; casillas de contexto. Dimensiones solicitadas o asesoramiento. Soporte traslúcido informativo.
- **P:** alternativas de soporte, terminaciones, límites de dimensión y si la oferta incluye solamente impresión. No heredar Frontlit/Blackout/Mesh.
- **N:** talles y selector de instalación eléctrica ofrecida como disponible.
- **Antes de activar:** separar la impresión solicitada de cualquier estructura o iluminación del proyecto del cliente.

## C. Merchandising

### Gorras (`gorras`)

- **R:** técnica solicitada Estampado / Bordado, una preferencia principal; otra necesidad se describe. Contextos Marca / Eventos / Merchandising promocional, múltiples.
- **P:** modelos, materiales, talles si existen, colores y zonas. La aprobación de bordado no confirma todas las combinaciones ni dos técnicas simultáneas en la misma gorra.
- **N:** ancho/alto como requisito para comprar la prenda y cantidad de piezas de un conjunto deportivo.
- **Antes de activar:** confirmar modelos y técnica por modelo. No utilizar imágenes de modelos que no estén documentados.

### Tazas (`tazas`)

- **R:** cantidad y estado del diseño. Logo/diseño full color es una referencia informativa de personalización; no se presenta como una lista de técnicas de fabricación.
- **P:** modelos, material, capacidades/medidas, colores y zonas de aplicación. No inventar capacidad, taza mágica, cerámica o área de impresión.
- **N:** talles de prenda, distribución por talle y dimensiones numéricas obligatorias del producto estándar.
- **Antes de activar:** precisar si hay variantes que merezcan tarjetas. Sin ellas basta un bloque de consulta y el resumen dinámico.

### Llaveros (`llaveros`)

- **R:** cantidad, estado del diseño y necesidad especial mediante Otra preferencia.
- **P:** formatos, materiales, medidas, colores y técnicas. “Diversos formatos” no permite fabricar una lista de formas seleccionables.
- **N:** talles, cantidades por talle y uso de iluminación.
- **Antes de activar:** solicitar catálogo de formatos y técnica por material. No usar fotografías de otros productos para representar opciones.

### Neceseres (`neceseres`)

- **R:** cantidad, diseño y solicitud especial. Los usos ya descritos pueden permanecer como ayuda informativa.
- **P:** modelos, materiales, medidas, colores y personalización. No separar Organizador/Neceser en dos variantes comerciales sólo por la redacción actual.
- **N:** talles de prendas y dimensiones obligatorias de una pieza gráfica.
- **Antes de activar:** confirmar qué diferencias reales determinan una variante y qué datos cambian el presupuesto.

### Botineros (`botineros`)

- **R:** solicitud de escudo y descripción de colores del club; estado del diseño y cantidad. La descripción de color es texto del cliente, no una pantonera confirmada.
- **P:** modelos, material, medidas, paleta y ubicaciones; técnicas compatibles.
- **N:** tabla S/M/L/XL de prendas y dimensiones de cartelería.
- **Antes de activar:** definir las variantes y si los colores son de material, de impresión o ambas cosas, evitando un único campo ambiguo.

### Mochilas (`mochilas`)

- **R:** cantidad, diseño y contextos Traslados / Entrenamientos / Delegaciones, múltiples.
- **P:** modelos, materiales, capacidad/medidas, colores y personalización. No convertir capacidad en opciones de litros sin datos.
- **N:** distribución por talle de prenda y dimensiones obligatorias de impresión.
- **Antes de activar:** aprobar modelos y diferencias que el visitante pueda comprender; si no existen, conservar el bloque único.

### Toallones (`toallones`)

- **R:** usos Disciplinas acuáticas / Vestuarios / Gimnasios; dimensiones deseadas opcionales o asesoramiento. Estampado se conserva como referencia textual, sin deducir una técnica.
- **P:** materiales, medidas comerciales, técnicas, paleta y ubicación del diseño.
- **N:** talles de prendas, iluminación y montaje.
- **Antes de activar:** aprobar cómo se expresa la unidad y si se ofrecen medidas propias o sólo las que ya estén catalogadas. Una medida solicitada no confirma fabricación a esa medida.

### Banderas (`banderas-deportivas`)

- **R:** Bandera / Tirante / Estandarte, una referencia por configuración. Dimensiones deseadas opcionales o asesoramiento. Sublimación full color como información de la ficha, no nuevas técnicas.
- **P:** material, confección/terminación, cantidades por unidad y diferencia con `banderas`. No copiar ojales de Lonas ni asociar bases o mástiles inexistentes.
- **N:** talles de indumentaria y selector de técnicas Vinilo/DTF heredado de Remeras.
- **Antes de activar:** aclarar alcance y etiquetas entre las dos fichas. Mantener familia C y URL actual.

### Banderas (`banderas`)

- **R:** usos Exterior / Interior, como contextos de necesidad; dimensiones deseadas o asesoramiento. Sublimación full color informativa.
- **P:** tipos de tela, terminaciones, medidas de catálogo y diferencia con Banderas deportivas. No prometer resistencia por haber seleccionado Exterior.
- **N:** tabla de talles y soportes de cartelería no documentados.
- **Antes de activar:** establecer alcance y unidad; mantener familia C y la ficha independiente.

### Regalos Empresariales (`regalos-empresariales`)

- **R:** artículo de interés Tazas / Mates / Libretas / Bolígrafos, **uno por configuración**. Cantidad de esa configuración y diseño de marca. Para otro artículo se agrega otra configuración del mismo producto.
- **P:** unidad comercial y si se trata de artículos o conjuntos; modelos, materiales, técnicas y mínimos por artículo. No se presupone que exista un kit, un pack o una cantidad por caja.
- **N:** un total automático que sume artículos heterogéneos o una selección múltiple sin cantidad interpretable.
- **Antes de activar:** aprobar esta lectura comercial. Si la venta sólo admite conjuntos, hay que revisar el diseño antes de implementarlo; no ocultar la diferencia dentro de observaciones ni crear fichas nuevas automáticamente.

## D. Proyectos a medida

En las cuatro fichas D, alcance de servicios y unidad de cantidad son **P**. El flujo no se habilita hasta acordar qué cuenta esa cantidad. Los controles R recogen intención y no confirman capacidad de ejecución, visita o instalación.

### Marquesinas (`marquesinas`)

- **R:** Con iluminación / Sin iluminación como preferencia; Frente comercial como contexto. Ancho/alto aproximados opcionales, con asesoramiento alternativo.
- **P:** unidad, alcance de diseño/impresión/estructura/iluminación/montaje, materiales y límites. La opción Con iluminación no confirma un servicio eléctrico incluido.
- **N:** talles, domicilio o coordenadas dentro del registro persistente del producto.
- **Antes de activar:** definir qué decisiones se pueden tomar con dimensiones aproximadas y qué información se obtiene luego mediante asesoramiento.

### Vidrieras (`vidrieras`)

- **R:** Vinilo esmerilado / Vinilo promocional / Vinilo de corte como preferencia principal; contexto Frente comercial / Vidriera / Acceso; dimensiones aproximadas o ayuda. Superficies diferentes pueden guardarse como configuraciones distintas.
- **P:** unidad, material concreto, colocación, superficie admisible y alcance por tipo. No se confirma instalación por elegir un contexto.
- **N:** talles y dirección postal en campos persistidos.
- **Antes de activar:** acordar si la cantidad representa piezas, paños u otra unidad; no sumar paños de dimensiones distintas en una configuración sin detalle.

### Ploteo Vehicular (`ploteo-vehicular`)

- **R:** contexto Utilitario / Camioneta / Flota comercial; descripción de zonas a intervenir y diseño. No es un inventario de marcas o modelos disponibles.
- **P:** unidad por vehículo/flota, alcances visuales predeterminados, materiales, colocación y cualquier control de dimensiones por pieza.
- **N:** ancho y alto obligatorios de un vehículo completo; patente, VIN o información identificatoria en localStorage.
- **Antes de activar:** aprobar cómo se expresan cantidad y alcance. Para una pieza concreta se puede diseñar después un campo de medida opcional; no suponer que un vehículo se cotiza como un rectángulo.

### Stands y Cartelería (`stands-y-carteleria`)

- **R:** referencia Cartelería corpórea / Cuadros / Tótems / Elementos gráficos para stands, una por configuración; dimensiones aproximadas opcionales o asesoramiento; diseño.
- **P:** unidad, materiales, requisitos dimensionales por pieza y alcance de montaje/producción. No ofrecer un stand completo por deducción de su nombre.
- **N:** talles de prendas y cantidades que sumen piezas distintas sin identificarlas.
- **Antes de activar:** definir qué constituye una pieza. Otras piezas se consultan mediante configuraciones independientes del mismo producto, sin un subsistema de pedidos anidado.

## Evidencia requerida para cambiar un campo a C

Registrar producto/slug, campo, alternativas exactas, responsable de aprobación, fecha, fuente y condiciones aplicables. Las compatibilidades requieren una aprobación propia: una técnica y un material aprobados por separado no prueban que se puedan combinar.

No convertir R o P a C automáticamente al implementar una tarjeta. No usar `source: confirmed` del modelo actual como prueba de stock: ese indicador técnico también contiene preferencias solicitadas de Lonas y no cubre estos 21 productos.
