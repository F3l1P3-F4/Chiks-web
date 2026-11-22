# F03.1 · Piloto visual de Remeras personalizadas

Fecha: 22 de noviembre de 2026. Rama: `desarrollo`. Base: `204a1a689e6ffcf046986a5e7b873675c9caedcc`.

## Resultado

La ficha real de Remeras recupera la composición de F02 y conserva el circuito comercial R4. No se implementó un configurador de variantes.

Vista local: <http://localhost:3000/productos/indumentaria/remeras-personalizadas>.

## Archivos de implementación

| Archivo | Cambio |
| --- | --- |
| `src/app/productos/indumentaria/remeras-personalizadas/page.tsx` | Utiliza la presentación específica del piloto, conservando datos, ruta y metadatos. |
| `src/components/RemerasProductDetail.tsx` | Nueva composición de título, galería, información desplegable, selección, preguntas y relacionados. |
| `src/components/RemerasProductDetail.module.css` | Estilos locales basados en F02, sin reglas globales nuevas. |
| `src/components/ProductSelection.tsx` | Presentación opcional `remeras-pilot`, ayudas e indicadores del recorrido y resumen derivado de los campos existentes. |

Se reutilizan ProductGallery, CatalogImage, Breadcrumb, ProductCard, Button y ProductConsultation. El ProductDetail de las otras fichas permanece intacto. Los datos originales y las fotografías asignadas se conservan.

## Elementos visuales recuperados de F02

- Título y descripción antes de la galería.
- Dos columnas en escritorio: fotografía e información a la izquierda; panel blanco de consulta a la derecha.
- Resumen blanco debajo de las fotografías en escritorio y después del formulario en móvil.
- Jerarquías tipográficas, bordes redondeados, colores, ayudas desplegables y foco visible coherentes con F02 y la aplicación.
- Galería más compacta, manteniendo las miniaturas y el encuadre proporcional.
- Presentación del recorrido Cantidad → Tu idea → Revisar en Mi consulta.
- Resumen de producto, cantidad, observaciones, precio «Consultar» y estado de guardado.
- Acceso al resumen desde el formulario móvil y regreso al campo de cantidad.

Los indicadores describen el recorrido real: no son pestañas ni simulan un paso de configuración comercial. Cantidad y observaciones permanecen visibles y la revisión efectiva ocurre en Mi consulta.

## Diferencias respecto del prototipo

F02 conserva sus alternativas demostrativas de modelos, materiales, talles, colores y técnicas. La ficha pública no muestra esos selectores: utiliza exclusivamente cantidad y observaciones, que ya existían en R4.

El asesoramiento se solicita mediante las observaciones actuales. No se agregaron campos, variantes, mínimos, combinaciones, precios ni disponibilidad al estado persistente. Las dos preguntas originales conservan sus respuestas pendientes de confirmación.

En F02 el recorrido termina en una revisión de ejemplo. En la ficha real, Agregar, Actualizar y Solicitar presupuesto siguen utilizando las acciones de R4; la revisión y preparación del mensaje permanecen en Mi consulta.

## Comparación antes/después

La referencia anterior se comprobó contra una copia temporal aislada del commit base, compilada con las dependencias ya instaladas y el mismo basePath. No se restauraron ni reemplazaron archivos del proyecto para realizar la comparación.

Las posiciones siguientes se midieron desde el inicio del documento con la consulta vacía y los desplegables cerrados. Se redondean a píxeles:

| Ancho | Título antes | Título después | Campo cantidad antes | Campo cantidad después |
| --- | ---: | ---: | ---: | ---: |
| 320 px | 606 | 238 | 1566 | 1063 |
| 390 px | 647 | 226 | 1469 | 1027 |
| 768 px | 895 | 218 | 1641 | 624 |
| 1024 px | 226 | 218 | 1075 | 624 |
| 1440 px | 226 | 218 | 1077 | 638 |
| 1670 px | 226 | 218 | 1073 | 638 |

En móvil, el visitante encuentra primero el nombre y la descripción. La información secundaria ya no se interpone entre la fotografía y el formulario. En escritorio, el formulario deja de aparecer después de una larga lista de datos pendientes.

### Capturas

| Ancho | Antes | Después |
| --- | --- | --- |
| 320 px | [Captura](capturas/remeras-antes-320.png) | [Captura](capturas/remeras-despues-320.png) |
| 390 px | [Captura](capturas/remeras-antes-390.png) | [Captura](capturas/remeras-despues-390.png) |
| 768 px | [Captura](capturas/remeras-antes-768.png) | [Captura](capturas/remeras-despues-768.png) |
| 1024 px | [Captura](capturas/remeras-antes-1024.png) | [Captura](capturas/remeras-despues-1024.png) |
| 1440 px | [Captura](capturas/remeras-antes-1440.png) | [Captura](capturas/remeras-despues-1440.png) |
| 1670 px | [Captura](capturas/remeras-antes-1670.png) | [Captura](capturas/remeras-despues-1670.png) |

Selección de 20 remeras con observaciones: [celular](capturas/seleccion-20-390.png) y [escritorio](capturas/seleccion-20-1440.png).

## Verificaciones

- Renderizado anterior y nuevo en los seis anchos solicitados, sin imágenes fallidas ni desbordes horizontales.
- Otras 22 fichas comparadas a 390 y 1440 px: 44 vistas sin diferencias visuales detectadas en geometría, tipografía, texto, colores, fondos, padding, radios y distribución. Se descartó como diferencia visual la distinta serialización de un margen automático cuando las posiciones y dimensiones coincidían; el registro conserva ese detalle.
- Portada comparada a 390 y 1440 px: sin diferencias visuales detectadas.
- 21 comprobaciones funcionales sobre la exportación estática con `/Chiks-web`.
- Galería: cambio de miniatura, estado seleccionado y `object-fit: contain`.
- Teclado: cantidad → observaciones, foco visible, apertura de ayudas y preguntas mediante Enter.
- Cantidad inválida: bloquea el presupuesto y conserva observaciones.
- Presupuesto directo: 20 remeras y observaciones correctas en Mi consulta sin pulsar antes Agregar.
- Agregar y actualizar: confirmación, permanencia en la ficha y ausencia de duplicados.
- Recarga: cantidad y observaciones persistidas.
- Conflictos: preservación del borrador, bloqueo de acciones y resolución tanto local como remota, con sincronización entre pestañas.
- Almacenamiento bloqueado: selección en memoria, aviso y estado «Solo en esta sesión», incluida navegación a Mi consulta.
- Observaciones de 2.000 caracteres: contenido completo y sin desbordes en los seis anchos; región desplazable mediante teclado y con foco visible.
- R4: datos temporales, revisión del mensaje y ausencia de enlaces activos de WhatsApp sin número configurado. El botón Copiar se comprobó con un portapapeles simulado para no alterar el del usuario.
- Persistencia: misma clave, versión y esquema de cinco propiedades por producto (`id`, `name`, `path`, `quantity`, `notes`). No se incorporan datos personales.
- Análisis del código: las funciones de edición y limpieza y los callbacks de cambio, envío, validación y resolución de conflictos permanecen iguales, normalizando únicamente los finales de línea para la comparación.
- `npm run lint`: aprobado.
- `npx --no-install tsc --noEmit`: aprobado.
- `npm run build` con las variables existentes de GitHub Pages: aprobado; 48 páginas generadas y postbuild con 44 nombres de segmentos normalizados.
- `node scripts/test-consultation-request.mjs`: aprobado, incluidos mensaje, validaciones, Unicode y alternativa extensa, sin solicitudes externas.
- `git diff --check`: aprobado.

Métricas, resultados y comprobación de archivos protegidos: `verificacion.json`.

## Uso de Impeccable y límites

Se utilizaron las guías disponibles de composición, adaptación, claridad, tipografía y pulido, y se revisaron las capturas y el recorrido renderizado. El motor automático no estaba disponible; no se atribuyen resultados a detectores ni comandos automáticos de Impeccable.

Las pruebas de navegador se realizaron con Chromium y tamaños emulados. No incluyen dispositivos físicos, lectores de pantalla reales ni una recepción comercial por WhatsApp. La copia del mensaje se verificó mediante simulación del portapapeles.

## Protección y efectos compartidos

La variante es opcional y solo se solicita desde Remeras. El comportamiento y el marcado por defecto de ProductSelection se conservan para las otras fichas y para Mi consulta. El CSS está encapsulado; su importación puede incorporarlo al paquete compartido, pero no aplica sus estilos sin las clases del piloto.

No se modificaron ProductConsultation, ConsultationProvider, el sistema de conflictos, las validaciones, el formato del almacenamiento ni el envío R4. Los 14 archivos de F02 y los 37 archivos de E01 se conservaron íntegramente. Header, Footer, Inicio, imágenes originales, datos comerciales y metadatos permanecen intactos.

No se instalaron dependencias ni se realizaron commit, push o deploy.

## Información comercial pendiente

Antes del configurador deben confirmarse con Aldana y Karina:

1. Modelos y materiales ofrecidos para cada modelo.
2. Talles y tablas de medidas reales, con sus correspondencias.
3. Colores y forma de identificar una referencia.
4. Técnicas y ubicaciones compatibles con cada combinación.
5. Cantidades mínimas y su aplicación por producto, diseño o técnica.
6. Cómo debe expresarse una selección pendiente de asesoramiento.
7. Respuestas específicas sobre sublimación y plazos, todavía pendientes en la ficha.

No se implementaron F03.2, F03.3 ni C02.
