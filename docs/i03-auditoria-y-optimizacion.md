# I03 — Auditoría estética y optimización UX/UI

Fecha: 21 de noviembre de 2026. Rama: `desarrollo`. Punto de recuperación: `4db8a05327188ad01f6d96b634efe34cc407e474` (G01).

## Método y alcance

Se utilizaron las guías disponibles de Impeccable 4.10.0 para composición, adaptación responsive, auditoría manual y pulido. El intento de ejecutar `impeccable context --target src/app` no pudo iniciar el motor 0.1.27: no estaba instalado y requería permisos para crear su caché y acceso de red. No se descargó ni instaló. No se ejecutaron el detector, overlays ni comandos automáticos de auditoría, y no se atribuyen resultados a ellos. No había `PRODUCT.md` ni `DESIGN.md`; la implementación aprobada fue la referencia visual.

La evaluación visual fue manual, apoyada por capturas y mediciones del navegador. No constituye una auditoría independiente con dos evaluadores ni una certificación completa de accesibilidad.

Se sirvió la exportación estática en un servidor local de prueba y se abrió una instancia aislada de Chromium 148.0.7778.96. Se cargaron todas las imágenes antes de capturar, incluidas las que normalmente se cargan al desplazarse. Se compararon 13 rutas en 320, 390, 768, 1024, 1440 y 1670 px (78 distribuciones antes y 78 después), además de Mi consulta con dos productos en los mismos seis anchos. La altura de viewport fue de 1.000 px.

Rutas revisadas:

- `/`
- `/productos`
- `/productos/indumentaria`
- `/productos/merchandising`
- `/productos/grafica`
- `/productos/indumentaria/remeras-personalizadas`
- `/productos/ficha/tazas`
- `/soluciones/clubes-y-equipos`
- `/trabajos-realizados`
- `/nosotros`
- `/faq`
- `/contacto`
- `/mi-consulta`

Las otras fichas comparten los componentes intervenidos y quedaron incluidas en la compilación y en la comprobación de referencias exportadas; no se afirma haber inspeccionado visualmente cada una de ellas en el navegador.

## A. Diagnóstico estético inicial

### Fortalezas

- El azul profundo, los barridos cian, el fucsia y el logo original ofrecen una identidad reconocible. No necesitaban una sustitución de estilo.
- El hero y las fotografías reales aportan personalidad; los títulos y las tarjetas ya tienen un lenguaje común.
- I02.3 permitió descubrir antes los destacados sin perder el índice de los 23 productos. I02.2 resolvió la composición de títulos de fichas. Ambas soluciones se conservaron.
- La consulta distingue selección, datos personales, revisión y apertura de WhatsApp. Los avisos sobre configuración pendiente son honestos y deben conservarse.

### Oportunidades seleccionadas

| Hallazgo | Prioridad | Impacto estético / UX | Coherencia | Riesgo | Esfuerzo |
|---|---|---|---|---|---|
| Breadcrumbs monoespaciados en páginas institucionales y sans serif en catálogo | P2 | Medio / medio: una misma navegación parecía pertenecer a sistemas distintos | Alta | Bajo | Bajo |
| Categorías con separador destacado, subtítulo y H1 sucesivos | P2 | Alto / medio: demasiada competencia antes de llegar a productos | Alta | Bajo | Bajo |
| Espacio sin fotografía tan alto como una fotografía real en móvil | P2 | Alto / alto: el catálogo dedica mucho desplazamiento a estados vacíos | Alta | Bajo | Bajo |
| FAQ con un panel separado por pregunta, sombras repetidas y grandes separaciones | P2 | Alto / medio: fragmentación y ritmo monótono | Alta | Bajo | Medio |
| Cantidad a todo el ancho y observaciones debajo en Mi consulta de escritorio | P2 | Medio / alto: controles sobredimensionados y repetición vertical | Alta | Bajo: solo CSS localizado | Bajo |
| Enlaces de tarjetas con superficie táctil de 36 px y foco de campos heterogéneo | P2 | Medio / alto | Alta | Bajo | Bajo |

Son valoraciones de diseño, no fallos funcionales ni una justificación para cambiar la identidad.

## B. Cambios implementados

### Navegación contextual

`Breadcrumb` utiliza la misma tipografía sans serif, tamaño de 14 px y capitalización natural en todas las páginas. Los enlaces disponen de 32 px de alto, con separación entre ellos. Se ajustó el margen inferior para que esa superficie más cómoda no retrase el contenido principal. Se eliminó la excepción tipográfica que solo afectaba al catálogo. Sus enlaces y datos estructurados no cambiaron.

### Categorías

`CatalogIntro` reúne la presentación compartida de Indumentaria, Merchandising y Gráfica. El H1 conduce la lectura, seguido de la descripción. Los antiguos títulos de contexto y subtítulos se conservan completos como información secundaria después de la descripción, con menor peso y sin otro separador dominante. No se eliminaron textos comerciales, agrupaciones, anclas ni accesos.

### Tarjetas compartidas

Se suavizó el contorno de 2 a 1 px; se mantuvieron los radios, sombras y colores existentes. Los títulos tienen un interlineado de 1,25. Los accesos a fichas o líneas se reconocen como enlaces mediante el acento magenta existente y subrayado, con un área mínima de 44 px de alto.

En una columna y hasta 767 px, el encabezado de una tarjeta sin imagen utiliza proporción 2:1. Las fotografías reales mantienen su proporción 4:3 y `object-contain`, sin recortes nuevos ni deformaciones. A partir de 768 px todas las tarjetas conservan encabezados uniformes para alinear las grillas. El mismo tratamiento compacto se aplica si una fotografía falla al cargar, mediante un atributo visual en el placeholder existente. No se cambió la lógica de imágenes.

### FAQ

Se agruparon las preguntas de cada tema en un único panel blanco, con divisores internos y flechas magenta simples. Se mantienen los elementos nativos `details` y `summary`, sus preguntas, respuestas y avisos pendientes. Las respuestas tienen una longitud de línea limitada y el foco del resumen se dibuja dentro del panel para evitar que el borde redondeado lo recorte. No se agregaron librerías ni nuevas interacciones.

### Mi consulta y estados de edición

Un módulo CSS limita la lectura a 64 rem y coloca cantidad y observaciones en dos columnas a partir de 640 px. En móvil mantiene el orden vertical y reduce el padding lateral de los paneles de 24 a 16 px. Los campos ganan 16 px de ancho útil en 320 y 390 px. Los botones mantienen el orden del DOM y sus acciones.

Se unificó el foco visible azul de campos de páginas internas y se incorporó una selección de texto blanca sobre magenta oscuro. No se modificaron la persistencia, los borradores, la resolución de conflictos, las validaciones, la clave de almacenamiento ni WhatsApp.

## C. Comparación antes y después

Las posiciones se miden desde el inicio del documento hasta el borde superior del contenedor de la primera fotografía real. Las alturas son del documento completo, incluido Header y Footer. Son mediciones de Chromium con las mismas condiciones antes y después, no una promesa para cualquier dispositivo.

| Medición | Ancho | Antes | Después |
|---|---:|---:|---:|
| Primera foto del catálogo | 390 px | 723 px | 722 px |
| Altura total del catálogo | 390 px | 7.461 px | 6.967 px |
| Primera foto de Indumentaria | 390 px | 1.501 px | 1.324 px |
| Primera foto de Merchandising | 390 px | 811 px | 739 px |
| Primera foto de Gráfica | 390 px | 4.444 px | 3.865 px |
| Altura total de FAQ, cerradas | 390 px | 2.970 px | 2.622 px |
| Primera foto de Indumentaria | 1440 px | 863 px | 760 px |
| Altura total de FAQ, cerradas | 1440 px | 2.181 px | 1.951 px |
| Alto del formulario de edición de un producto, sin su título ni mensajes | 1440 px | 320 px | 230 px |
| Ancho del formulario de edición de un producto | 1670 px | 1.422 px | 974 px |

El catálogo en escritorio suma 14 px de altura por la superficie táctil ampliada de sus enlaces; conserva sus filas y llega a la primera imagen 1 px antes. Se priorizó la comodidad de interacción sobre reducir toda altura a cualquier costo.

En Gráfica la primera fotografía todavía aparece tarde porque los primeros productos carecen de imágenes pertinentes. Se preservó su orden y se compactaron sus placeholders, sin sustituirlos por fotografías de otros productos ni inventar material.

### Capturas conservadas

| Superficie | Antes | Después |
|---|---|---|
| Indumentaria, 390 px | [Antes](i03/indumentaria-390-antes.png) | [Después](i03/indumentaria-390-despues.png) |
| FAQ, 390 px | [Antes](i03/faq-390-antes.png) | [Después](i03/faq-390-despues.png) |
| Mi consulta, 1440 px | [Antes](i03/consulta-1440-antes.png) | [Después](i03/consulta-1440-despues.png) |

Las capturas de consulta usan exclusivamente datos ficticios. Las cantidades y textos reflejan distintos momentos de las pruebas; no son información comercial ni datos de clientes.

## D. Archivos modificados o creados

Código (13 archivos):

- `src/app/globals.css`
- `src/app/faq/page.tsx`
- `src/app/faq/Faq.module.css` (nuevo)
- `src/app/productos/indumentaria/page.tsx`
- `src/app/productos/merchandising/page.tsx`
- `src/app/productos/grafica/page.tsx`
- `src/components/Breadcrumb.tsx`
- `src/components/CatalogIntro.tsx` (nuevo)
- `src/components/CatalogImage.tsx`
- `src/components/ProductCard.tsx`
- `src/components/ProductCard.module.css` (nuevo)
- `src/components/ConsultationReview.tsx`
- `src/components/ConsultationReview.module.css` (nuevo)

Documentación y evidencia (7 archivos nuevos):

- `docs/i03-auditoria-y-optimizacion.md`
- `docs/i03/indumentaria-390-antes.png`
- `docs/i03/indumentaria-390-despues.png`
- `docs/i03/faq-390-antes.png`
- `docs/i03/faq-390-despues.png`
- `docs/i03/consulta-1440-antes.png`
- `docs/i03/consulta-1440-despues.png`

## E. Evaluación final

El catálogo dedica menos espacio a imágenes ausentes y hace más reconocibles sus enlaces. Las categorías presentan una jerarquía más clara y llegan antes a los productos. Las FAQ expresan sus temas con grupos visuales y menos fragmentación. Mi consulta aprovecha mejor el ancho de escritorio y conserva su lectura vertical en móvil.

La portada conserva su geometría en los seis anchos comparados. Header, Footer, hero, fotografías originales y sus asociaciones, textos comerciales, navegación, datos del catálogo, dependencias y configuración de despliegue no fueron modificados. El archivo tipográfico de I02.2 permanece intacto. I02.1 y el circuito comercial mantienen su funcionamiento en las pruebas ejecutadas.

## F. Decisiones pendientes

- Incorporar fotografías pertinentes de los productos que aún no las tienen. Es el principal límite visual restante, especialmente en Gráfica. No se inventaron ni reasignaron imágenes.
- Confirmar información comercial y canales de contacto con Aldana y Karina, incluido el número autorizado de WhatsApp y una recepción real. No se configuró ni se realizó un envío.
- P01: decidir sobre la carga de archivos de diseño. No se implementó y no se considera un defecto del MVP.
- Una futura mayor presencia visual de Mi consulta en el Header puede evaluarse con las clientas; no se modificó la jerarquía del Header durante este ajuste.

No se requiere aprobar otra paleta, tipografía o identidad para utilizar las mejoras implementadas.

## G. Pruebas y limitaciones

### Verificaciones visuales

- 13 rutas × 6 anchos, antes y después: sin desbordamiento horizontal del documento y sin imágenes fallidas tras completar su carga.
- Mi consulta con dos productos: sin desbordes en los seis anchos.
- Inspección visual de capturas de Inicio, catálogo, las tres categorías, fichas representativas, solución, trabajos, Nosotros, FAQ, Contacto y consulta vacía/llena/revisión.
- Tarjetas de móvil: enlace de 44 px; error de imagen simulado mantiene «Sin imagen disponible» y reduce el encabezado de 267 a 178 px a 390 px, sin desborde.
- Muestras de contraste de los estilos intervenidos: enlace magenta/blanco 7,33:1; texto secundario/blanco 9,67:1; placeholder 8,67:1; foco azul/blanco 5,70:1; selección blanca/magenta 8,58:1. Estas muestras no equivalen a certificar todos los estados y superficies del sitio.

### Regresión funcional: 23 comprobaciones correctas

1. Consulta vacía sin formulario personal.
2. Miniatura de galería cambia la imagen principal.
3. Cantidad inválida impide navegar al presupuesto.
4. Presupuesto directo incorpora 20 remeras con sus observaciones.
5. Apertura del menú móvil.
6. Escape cierra el menú y devuelve el foco al botón.
7. Mi consulta cierra el menú al navegar y conserva el contador de dos productos.
8. Errores del formulario personal accesibles y foco en nombre.
9. Teléfono/correo inválidos conservan el nombre ingresado.
10. Editar productos no borra datos personales.
11. Actualización desde otra pestaña conserva el borrador y los datos personales.
12. Observación remota de 2.000 caracteres consecutivos completa y sin desborde.
13. Resolución del conflicto conserva exactamente el contenido remoto.
14. Consulta llena responsive en los seis anchos.
15. Vista previa con productos, cantidades, datos y foco correctos.
16. WhatsApp sin configurar no ofrece un enlace externo de envío.
17. Lectura del portapapeles coincide con el resumen, normalizando únicamente CRLF de Windows a LF.
18. La interfaz confirma la copia completada.
19. Recarga conserva productos y descarta datos personales temporales.
20. Eliminación actualiza correctamente la selección.
21. FAQ abre con Enter y tiene foco visible dentro del panel.
22. FAQ cierra con Enter.
23. Índice de 23 productos accesible con teclado.

La sesión de prueba terminó sin excepciones de JavaScript. Los datos de prueba se eliminaron del almacenamiento del navegador aislado. Durante la preparación del ensayo se corrigieron condiciones del servidor y de la automatización (resolución de archivos exportados, activación de pestañas, eventos de teclado y normalización de saltos de línea del portapapeles), sin cambiar código comercial para satisfacer esas pruebas.

### Verificaciones técnicas

- `npm run lint`: correcto.
- `tsc --noEmit`: correcto.
- `node scripts/test-consultation-request.mjs`: correcto, sin solicitudes externas.
- `npm run build` con `GITHUB_ACTIONS=true` y `GITHUB_REPOSITORY=F3l1P3-F4/Chiks-web`: correcto, 48 entradas generadas.
- Postbuild: correcto, 44 nombres de segmentos normalizados en Windows.
- 46 documentos HTML exportados: 1.926 referencias locales comprobadas, sin destinos ni recursos faltantes.
- Sitemap generado. Se conserva el `basePath` `/Chiks-web`.
- `git diff --check`: correcto para los cambios de código.

Limitaciones: navegador Chromium de escritorio con emulación de viewport, ratón y teclado sintetizados. No se probaron equipos físicos, Safari/iOS, lectores de pantalla ni una recepción real de WhatsApp. La copia se comprobó en el entorno local autorizado; el portapapeles puede tener políticas distintas en otros dispositivos. No se ejecutó una nueva auditoría exhaustiva de todas las condiciones de almacenamiento bloqueado ni una auditoría general de arquitectura.

I03 finaliza con cambios locales revisables. No se hizo commit, push ni deploy y no se inició R5.
