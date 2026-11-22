# F03.1B · Experiencia completa de F02 dentro de Remeras

Fecha: 22 de noviembre de 2026. Rama: `desarrollo`.

## Cómo acceder

1. Iniciar el proyecto con `npm run dev`, si el servidor no está activo.
2. Abrir <http://localhost:3000/productos/indumentaria/remeras-personalizadas>.
3. Pulsar **Probar experiencia F02** en el bloque «Prueba local de la ficha».
4. Para regresar al formulario operativo, pulsar **Volver a consulta comercial**.

No se creó otra página, ruta pública ni iframe. El configurador utiliza estado React dentro de la ficha real y comparte su galería, fondo, tipografía, breadcrumbs y estructura.

El activador y el configurador se importan exclusivamente cuando `NODE_ENV` es `development`. En una compilación de producción no se incluye el módulo demostrativo ni sus opciones.

## Funcionalidades incorporadas

| Paso | Controles y comportamiento |
| --- | --- |
| Modelo y material | Corte recto, Corte amplio, Algodón, Poliéster y las alternativas de asesoramiento originales de F02. Tarjetas seleccionables con radios nativos, ayuda y actualización inmediata del resumen. |
| Talles y cantidades | S, M, L y XL como etiquetas ilustrativas; cantidades independientes y total automático. Rechazo de valores negativos, fraccionarios, vacíos o fuera del rango entero seguro al avanzar. |
| Asesoramiento en cantidades | Permite dejar los talles por definir, indicar una cantidad aproximada o marcar que todavía no se conoce. El reparto anterior se conserva al alternar. |
| Personalización | Azul marino, Blanco, Negro; Estampado o Bordado; Frente o Espalda; alternativas de asesoramiento en cada grupo. Todas son opciones de ejemplo copiadas de F02. |
| Observaciones | Texto adicional de hasta 2.000 caracteres, conservando saltos de línea, únicamente en memoria. |
| Navegación | Indicadores de pasos operativos, Anterior y Continuar. Se puede explorar otro paso y regresar; antes de revisar se validan todos los pasos, incluidos los omitidos. |
| Revisión | Muestra todas las decisiones, permite volver a editar o reiniciar y explica que no se guardó ni envió una solicitud. |
| Reinicio | Limpia las elecciones y observaciones demostrativas y vuelve al primer paso. No altera la consulta comercial. |

La comparación del esquema de opciones confirmó que los cinco grupos y sus **16 alternativas** conservan exactamente los valores, etiquetas, ayudas y colores de F02. No se agregaron alternativas comerciales.

## Resumen dinámico

El resumen se deriva del mismo estado que controla los campos. Incluye producto, modelo, material, total, cantidades por talle, color, técnica, ubicación, opciones de asesoramiento solicitadas y observaciones. La cantidad mínima permanece «A confirmar».

No mantiene una copia independiente de las selecciones ni exige guardar para actualizarlo. Los textos extensos se dividen visualmente y disponen de desplazamiento vertical accesible, sin recortarse ni alterar su contenido.

## Protección comercial

La advertencia visible es **«Demostración — opciones pendientes de confirmación comercial»**.

- El configurador no importa ConsultationProvider, no llama a sus acciones y no transforma las selecciones en productos o mensajes de presupuesto.
- No escribe en localStorage o sessionStorage, no abre WhatsApp y no ofrece un botón de envío o agregado al circuito real.
- Las elecciones viven en React y desaparecen al recargar o abandonar la ficha.
- Una sola experiencia queda visible y accesible a la vez. Las dos conservan su instancia montada para proteger los borradores al alternar; los controles de la vista oculta quedan fuera de la navegación por teclado.
- Volver a la consulta comercial recupera su cantidad y observaciones sin incorporar ninguna elección ilustrativa.
- ProductSelection, ProductDetail, ProductConsultation, ConsultationProvider y el formato del mensaje no se modificaron durante F03.1B.
- La protección de producción se hace en el componente de servidor mediante una condición de compilación, no mediante CSS, un parámetro de URL ni una preferencia almacenada en el navegador.

## Archivos de esta etapa

| Archivo | Cambio |
| --- | --- |
| `src/components/RemerasProductDetail.tsx` | Reutiliza las mismas piezas de galería y selección; importa la vista de prueba únicamente durante el desarrollo. |
| `src/components/RemerasDevelopmentPreview.tsx` | Nuevo selector local de modo y configurador React completo, con estado independiente de R4. |
| `src/components/RemerasDevelopmentPreview.module.css` | Nuevos estilos encapsulados de la experiencia guiada, controles, resumen y foco. |
| `docs/f03.1b/` | Informe, resultados de verificación y ocho capturas. |

Los cambios pendientes de F03.1 se conservaron. Los archivos originales de F02, E01 y la documentación anterior permanecieron intactos.

## Validación realizada

- **31 comprobaciones funcionales** de la demostración, navegación, validaciones, conservación del estado, reinicio, separación de modos y regresión básica de R4.
- **36 combinaciones de estado y ancho**: los tres pasos, la revisión, asesoramiento y observaciones extensas, en 320, 390, 768, 1024, 1440 y 1670 px. Sin desbordes horizontales, imágenes fallidas ni excepciones JavaScript.
- Teclado: radios mediante flechas, foco al detectar errores, cambios de paso, retorno al formulario comercial y 12 avances con Tab sin ingresar en sus controles ocultos.
- Foco del paso activo diferenciado mediante contorno de 3 px. Selección con toque emulado a 320 px.
- Cantidades S: 8 y M: 12 → 20; valores negativos y fraccionarios bloqueados; asesoramiento con cantidad conocida o por definir; conservación al retroceder.
- Observaciones de 2.000 caracteres completas, con estado independiente del borrador comercial.
- El almacenamiento permaneció idéntico durante los recorridos demostrativos, las revisiones y los reinicios.
- Regresión R4: presupuesto directo de 20 remeras, actualización a 25, persistencia al recargar y eliminación. No se incorporan opciones demostrativas ni propiedades nuevas a los productos persistidos.
- Comparación de las **23 fichas de producción en 390 y 1440 px**, 46 vistas: sin diferencias detectadas en geometría, tipografía, texto, colores, fondos, padding, radios y distribución respecto de F03.1.
- Presupuesto directo probado también sobre la exportación estática con `/Chiks-web`.
- Compilación final: 48 páginas estáticas y postbuild correcto con 44 nombres de segmentos normalizados.
- Inspección de los **333 archivos HTML, RSC, JavaScript y CSS exportados**: sin identificadores del configurador, activador ni alternativas demostrativas. En el navegador de producción tampoco hay controles de prueba.
- ESLint, TypeScript, pruebas existentes del mensaje R4.4 y `git diff --check`: aprobados.

Resultados y comprobación de archivos protegidos: `verificacion.json`.

## Capturas

| Estado | Escritorio, 1440 px | Celular, 390 px |
| --- | --- | --- |
| Modelo y material | [Captura](capturas/paso-1-1440.png) | [Captura](capturas/paso-1-390.png) |
| Talles y cantidades | [Captura](capturas/paso-2-1440.png) | [Captura](capturas/paso-2-390.png) |
| Personalización y observaciones | [Captura](capturas/paso-3-1440.png) | [Captura](capturas/paso-3-390.png) |
| Revisión | [Captura](capturas/revision-1440.png) | [Captura](capturas/revision-390.png) |

Son capturas del servidor de desarrollo; puede aparecer el indicador de Next.js. Las elecciones mostradas son ejemplos.

## Diferencias respecto de F02 y límites

Se conserva la experiencia funcional de Remeras. Se añadieron observaciones, el producto y la síntesis de asesoramiento en el resumen, además del selector de modo local. La galería es la real de la ficha y su selección es independiente del reinicio de las elecciones demostrativas. Lonas continúa únicamente en el prototipo original.

Se aplicaron las guías de Impeccable y se revisó el resultado renderizado; no se ejecutó su motor automático. Las comprobaciones de navegador corresponden a Chromium con teclado, tamaños y toque emulados, sin pruebas en dispositivos físicos o lectores de pantalla reales. No se realizó ningún envío ni recepción comercial.

La demostración no confirma disponibilidad, compatibilidades, talles, precios ni mínimos. La integración comercial de variantes sigue pendiente y no forma parte de esta etapa.

No se instalaron dependencias ni se realizaron commit, push o deploy. No se avanzó a otras etapas.
