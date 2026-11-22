# C03 — Hero y simplificación del Inicio

Fecha: 22/11/2026. Rama: `desarrollo`. HEAD conservado: `c57794753c9ca86ef269b9185aec1a1e0c525ea8`.

## Resultado

Los tres cambios se implementaron juntos: se retiró la sección inferior de Trabajos realizados de Inicio, se reemplazó la grilla del hero por una fotografía protagonista con navegación manual y se reforzó la composición tipográfica del bloque izquierdo. No se modificaron textos ni destinos de los dos botones existentes.

El hero comparte dos columnas desde 768 px. En celular muestra texto, botones y fotografía en una columna. El título crece moderadamente (máximo 88 px frente a 80 px anteriores); conserva familia, cursiva editorial, colores y resaltado fucsia. El subtítulo dispone de hasta 480 px y los botones tienen más espacio, con dos columnas y saltos naturales de texto en pantallas pequeñas. No se cortan las palabras del título.

La mejora no se basa solamente en reducir altura: una imagen permite apreciar el trabajo mejor que cuatro miniaturas, reduce la competencia visual y equilibra el peso del título. En tablet se evita la antigua composición vertical excesivamente larga. El hero aumenta ligeramente de altura en algunos tamaños para dar espacio a la imagen; la altura total de Inicio disminuye en los seis tamaños comprobados.

## Archivos de aplicación

| Archivo | Cambio |
| --- | --- |
| `src/app/page.tsx` | Integra HeroWorkCarousel, retira grilla fotográfica y sección inferior de Trabajos realizados. |
| `src/app/Hero.module.css` | Distribución responsive, jerarquía tipográfica, separación y botones locales del hero. |
| `src/components/HeroWorkCarousel.tsx` | Nuevo componente de carrusel, reutiliza datos existentes de trabajos. |
| `src/components/HeroWorkCarousel.module.css` | Marco, fundido y controles accesibles exclusivos del carrusel. |

Documentación añadida: este informe, cuatro archivos JSON de evidencia, veinte capturas y dos copias exactas del estado anterior en `docs/c03/estado-anterior/`.

## Carrusel y fotografías

Un marco estable de proporción 8:5 muestra una sola fotografía activa. El recorte utiliza `object-fit: cover`, sin deformar los archivos. La primera foto tiene un encuadre local de 75% horizontal y 60% vertical para acercar el estampado; las demás conservan los encuadres definidos en `src/data/trabajos.ts`. La galería interna no recibe este ajuste.

Se reutilizan estas cinco imágenes, en el orden existente de trabajos:

1. `public/images/productos/indumentaria-corporativa.webp` — remeras estampadas.
2. `public/images/optimizadas/vidriera.webp` — gráfica de vidriera.
3. `public/images/trabajos/trabajo-03-stand.webp` — stand.
4. `public/images/productos/ploteo-vehicular.webp` — ploteo vehicular.
5. `public/images/optimizadas/merchandising.webp` — taza y cintas.

No se alteraron fotografías originales, datos compartidos ni asociaciones. Tampoco se eliminaron las fotografías que antes aparecían en el hero.

El cambio de imagen es manual, con fundido de 320 ms. Durante el fundido se superponen temporalmente la imagen saliente y la entrante dentro del mismo marco; sólo la activa se expone a tecnologías de asistencia. La capa saliente se elimina al finalizar. Mientras carga la siguiente foto se conserva la anterior, evitando un marco vacío. Si falla una carga aparece un aviso neutro y es posible seguir navegando.

Los controles anterior/siguiente tienen 44 × 44 px y nombres accesibles. La secuencia vuelve al inicio al avanzar desde la última foto, únicamente por interacción del usuario. Con el marco enfocado funcionan flechas izquierda/derecha e Inicio/Fin. En táctil se puede deslizar horizontalmente sin bloquear el desplazamiento vertical ni el zoom. El indicador 01 / 05 anuncia los cambios. El enlace discreto «Ver trabajos» abre la ruta existente `/trabajos-realizados`.

No hay reproducción automática. Se respeta movimiento reducido, incluso si cambia durante un fundido. Al ocultar la pestaña se detiene la animación y no se reinicia al regresar. La primera imagen se precarga; las otras se renderizan al seleccionarlas.

## Sección inferior y protección

Se retiraron de Inicio el título TRABAJOS REALIZADOS, su carrusel y su acceso inferior. Soluciones queda a 24 px de Proceso en los seis tamaños. No se tocaron el contenido, los estilos ni las proporciones de estas dos secciones.

C02 seguía sin commit al comenzar. Para conservar ese trabajo pendiente se mantuvieron intactos `HomeWorkCarousel.tsx`, su módulo CSS y `docs/c02/`. El componente queda sin uso en Inicio y no se incorpora al código exportado. También se guardaron copias del Inicio y Hero.module.css previos, cotejadas por SHA-256 con el estado inicial. Una limpieza definitiva de estos archivos queda fuera de esta tarea.

La comparación de hashes sobre los 298 archivos iniciales confirma: sólo cambiaron los dos archivos existentes de Inicio y Hero; 296 permanecen idénticos y no hay eliminaciones. Los 37 archivos locales de E01 permanecen intactos. F02, F03, R4, catálogo, fichas, Header, Footer, fotografías y galería interna no fueron modificados. Evidencia: [proteccion-proyecto.json](proteccion-proyecto.json).

## Comparación de alturas

Mediciones de documento completo en Chromium, viewport de 1.000 px de alto y escala 1. Los valores enteros son alturas del documento, incluyendo Header y Footer. Evidencia detallada con alturas de main y hero: [comparacion-visual.json](comparacion-visual.json).

| Ancho | Inicio antes | Inicio después | Reducción |
| --- | ---: | ---: | ---: |
| 320 px | 4.076 px | 3.842 px | 234 px |
| 390 px | 4.086 px | 3.796 px | 290 px |
| 768 px | 3.054 px | 2.433 px | 621 px |
| 1024 px | 2.092 px | 1.871 px | 221 px |
| 1440 px | 1.941 px | 1.837 px | 104 px |
| 1670 px | 1.637 px | 1.523 px | 114 px |

En 390 px la distancia desde el final del título al inicio de la primera foto pasa de 225,9 a 172,7 px; en 320 px pasa de 248,8 a 197,3 px. La imagen protagonista es mayor, por lo que ocupa más altura útil que una miniatura. No se oculta contenido para conseguir la reducción.

## Capturas antes y después

| Vista | Antes | Después |
| --- | --- | --- |
| Hero 320 | [Antes](capturas/hero-320-before.png) | [Después](capturas/hero-320-after.png) |
| Hero 390 | [Antes](capturas/hero-390-before.png) | [Después](capturas/hero-390-after.png) |
| Hero 768 | [Antes](capturas/hero-768-before.png) | [Después](capturas/hero-768-after.png) |
| Hero 1024 | [Antes](capturas/hero-1024-before.png) | [Después](capturas/hero-1024-after.png) |
| Hero 1440 | [Antes](capturas/hero-1440-before.png) | [Después](capturas/hero-1440-after.png) |
| Hero 1670 | [Antes](capturas/hero-1670-before.png) | [Después](capturas/hero-1670-after.png) |
| Inicio completo 390 | [Antes](capturas/inicio-390-before.png) | [Después](capturas/inicio-390-after.png) |
| Inicio completo 1440 | [Antes](capturas/inicio-1440-before.png) | [Después](capturas/inicio-1440-after.png) |
| Galería interna 390 | [Antes](capturas/trabajos-390-before.png) | [Después](capturas/trabajos-390-after.png) |
| Galería interna 1440 | [Antes](capturas/trabajos-1440-before.png) | [Después](capturas/trabajos-1440-after.png) |

## Verificaciones realizadas

- ESLint: correcto (`npm run lint`).
- TypeScript: correcto (`npx tsc --noEmit`).
- Compilación de producción y exportación: correctas, 48 páginas generadas. Ejecutada con entorno equivalente a Pages para comprobar `/Chiks-web`.
- Postbuild existente: correcto, 44 nombres de segmentos normalizados; no se modificó su implementación.
- Trece grupos de pruebas interactivas correctos: imágenes, estabilidad del marco, fundido, navegación manual, teclado, foco, ausencia de autoplay, movimiento reducido, pestaña oculta, gestos, fallo de imagen, carga inicial y enlaces. Véase [pruebas-interactivas.json](pruebas-interactivas.json).
- Las cinco fotografías se probaron en los seis anchos: 30 estados en reposo, cada uno con una sola imagen, marco estable y carga correcta.
- Sin desbordamientos horizontales, cortes de palabras ni botones demasiado pequeños en los seis tamaños.
- Se compararon posición relativa, dimensiones, contenido y estilos calculados de Header, Soluciones, Proceso y Footer: 24 comparaciones iguales. La galería interna también permanece igual en seis anchos.
- Cinco grupos de pruebas de producción correctos sobre un servidor estático local: HTML inicial y precarga; fotos y enlaces con basePath; galería interna en seis tamaños; ausencia de errores de ejecución/carga; ausencia del antiguo carrusel inferior y de controles demostrativos F03 en la exportación. Véase [verificacion-produccion.json](verificacion-produccion.json).
- Los enlaces originales del hero conservan sus destinos: catálogo `/productos` y consulta `/mi-consulta`. El nuevo enlace a trabajos responde correctamente también en la exportación con `/Chiks-web`.
- `git diff --check`: correcto. Rama y HEAD sin cambios. No se instalaron dependencias ni se hicieron commits, push, merge o deploy.

## Método y límites

Se utilizaron las guías disponibles de Impeccable para layout, polish, typeset y adapt. Su lanzador no estuvo operativo; se leyeron las guías y el contexto del proyecto directamente. No se atribuyen estas verificaciones a un detector automático de Impeccable.

Las pruebas visuales y de interacción se ejecutaron en Chromium con tamaños de pantalla emulados. Los gestos se enviaron mediante eventos táctiles del navegador; la prueba de pestaña oculta utilizó cambio real de pestaña. El fallo de imagen se provocó mediante un evento de error para verificar el estado de respaldo. No se probaron dispositivos físicos, Safari ni un lector de pantalla real.

No quedan fallos observados dentro de C03. Queda pendiente la revisión del resultado por el usuario y, cuando se autorice, decidir si se archivan o retiran definitivamente los archivos no utilizados de C02. No se inició ninguna otra etapa.
