# R5.1 — Correcciones prioritarias de R5

Verificado el 23 de noviembre de 2026, rama `desarrollo`, base `8f050d1`.

## Causa y corrección

- **Remeras:** dos controles cambiaban la misma distribución con acciones distintas. El control genérico no actualizaba el total. Ahora hay un único control para talles solicitados; el borrador conserva el último total válido y las filas al desactivar/reactivar. Las filas nuevas empiezan sin cantidad. La recuperación de una distribución anuncia el total que vuelve a utilizarse.
- **Lonas:** el pedido de asesoramiento y la activación de dimensiones eran dos decisiones independientes. Ahora dos radios excluyentes controlan ambas cosas conjuntamente. En modo asesoramiento no se validan ni se guardan dimensiones inactivas. Los números escritos se conservan sólo en el borrador abierto al alternar de modo. Al guardar asesoramiento y recuperar después, las dimensiones inactivas no se recuperan porque no se persistieron. El esquema indica «Medidas a definir».
- **Destacado de Remeras:** se retiró la afirmación sobre algodón/poliéster y serigrafía/sublimación. Texto actual: «Remeras personalizadas con tu logo o diseño para uniformes, egresados y eventos.» No cambian productos ni destinos.

La normalización del borrador de Lonas también interpreta consultas anteriores que contengan a la vez dimensiones y asesoramiento sobre medidas: muestra asesoramiento como modo activo y conserva las dimensiones en memoria para recuperarlas si se elige indicarlas. No modifica automáticamente el registro guardado.

## Verificación ejecutada

| Comprobación | Resultado |
| --- | --- |
| ESLint y TypeScript (`--noEmit --incremental false`) | Correctos |
| `node scripts/test-guided-consultation.mjs` | 15 grupos correctos: compatibilidad R4, variantes, conflictos, almacenamiento bloqueado, datos corruptos, configuraciones y mensaje |
| `node scripts/test-consultation-request.mjs` | Correcto: mensaje, validaciones, Unicode, enlaces y alternativa extensa; sin envíos |
| Compilación con `GITHUB_ACTIONS=true`, `GITHUB_REPOSITORY=F3l1P3-F4/Chiks-web` | Correcta; 48 páginas generadas, exportación estática y postbuild de 44 segmentos |
| `node scripts/test-r51.mjs --production` | 10 grupos correctos en una pestaña aislada sobre la exportación `/Chiks-web`; evidencia en `resultados.json` |

El navegador verificó explícitamente:

1. Cantidad 20 → distribución 30 → desactivar → cantidad 30; reactivación conserva filas.
2. Filas nuevas vacías, cantidades inválidas, conservación del último total válido y anuncio de recuperación.
3. Guardado, recarga, recuperación y edición de Remeras sin duplicaciones.
4. Dimensiones inválidas enfocan el campo; 150,5 × 200 cm se recuperan al alternar los modos en el mismo borrador.
5. Asesoramiento sin dimensiones permite avanzar y guardar; recuperación del modo, edición a 180 × 250 cm y vuelta a asesoramiento sin alterar cantidad ni terminación.
6. Mensaje único y copia exacta con 30 remeras, 2 lonas asesoradas y una consulta antigua de Tazas; sin números de dimensiones inactivas ni datos personales persistidos.
7. Cancelar edición conserva el registro anterior.
8. Orden DOM y disposición visual a 390/1440 px, un único resumen, sin desbordes; Tab, flechas de radios y foco visible.
9. Nuevo texto de la tarjeta y enlace original.

La prueba V12 se ajustó al nuevo comportamiento excluyente: activa asesoramiento y vuelve a indicar medidas antes de esperar dimensiones. No se repitió su batería completa ni se generaron capturas; los recorridos afectados están cubiertos por la prueba dirigida R5.1.

El primer intento de abrir Chromium no habilitó CDP. Se abrió después un único proceso aislado. Dos aserciones iniciales de la prueba se corrigieron: el atributo de galería de Remeras es `data-v10-column` y el foco del radio se dibuja en su tarjeta contenedora. La ejecución final pasó los diez grupos, sin excepciones de la aplicación.

## Límites y pendientes

- Sin cambios en la arquitectura F04, clave de almacenamiento, Inicio C03, fotografías, otras 21 fichas, dependencias o despliegue.
- Las pruebas de sincronización y almacenamiento bloqueado fueron de modelo mediante las pruebas existentes; no se repitió una batería de navegador con varias pestañas.
- El número comercial continúa sin configurar. Se comprobó la ausencia del enlace de WhatsApp y la copia del mensaje, no una recepción real.
- Permanecen pendientes las validaciones comerciales y el contenido identificados en R5. No se implementan otros hallazgos.
- Los cambios locales previos de `AGENTS.md` y documentación/capturas de F04/V11 se conservaron. Sin commit, push ni deploy.
