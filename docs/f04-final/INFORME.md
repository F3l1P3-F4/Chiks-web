# F04 — Cierre de la integración con Mi consulta

23/11/2026 · rama `desarrollo` · base conservada `355095dbb989432f702480b3116aee09a9083b4f`.

## Resultado

**F04 completada y verificada.** Remeras y Lonas permiten configurar, revisar, guardar, recuperar después de una recarga real, editar desde Mi consulta y preparar un único mensaje junto con otros productos. La disponibilidad comercial de variantes y la recepción real por WhatsApp continúan pendientes; no se inventó ninguna opción ni se configuró un número ficticio.

Este informe retoma F04 después de V10/V10.1. El [diagnóstico previo](DIAGNOSTICO.md) registra qué se encontró antes de editar. El [informe histórico](../f04/INFORME.md) describe fases anteriores y controles que V10 eliminó; no es la guía de la interfaz actual.

## Qué ya existía

- Configuración tipada/versionada de Remeras y Lonas: opciones, distribución por talle, total, medidas/unidad, asesoramiento y observaciones.
- Identidad por selección, varias configuraciones por producto, lectura de consultas antiguas y persistencia mediante `las-chikas-design:consulta:v1`.
- Store con validación, escrituras coordinadas, sincronización, protección de borradores, cambios temporales, eliminaciones y resolución explícita de conflictos.
- Tres pasos compartidos, resumen dinámico y mensajes completos reutilizando el mismo conversor de características.
- Revisión, copia, consentimiento y generación de enlaces de WhatsApp, con alternativa para mensajes extensos y bloqueo cuando falta el número comercial.
- Separación de catálogos confirmados y demostrativos; los catálogos comerciales de opciones aún están vacíos.
- V10.1: galería → formulario → resumen en móvil; galería y resumen a la izquierda, formulario a la derecha en escritorio.

## Qué se completó

1. **Nueva personalización explícita.** Entrar desde el catálogo sin identificador inicia una selección nueva. Ya no recupera silenciosamente la única selección previa. Remeras ofrece «Agregar otra personalización» después de guardar, sin reintroducir el selector eliminado.
2. **Edición desde Mi consulta.** «Editar configuración» abre la ficha correcta con su identificador opaco en `#configuracion=...`. Se recupera esa selección incluso al recargar. Guardar actualiza únicamente esa identidad y vuelve a Mi consulta; cancelar vuelve sin sobrescribirla.
3. **Un único editor comercial.** Las configuraciones guiadas reales se editan en su ficha. Se eliminó el editor guiado duplicado de Mi consulta; los editores clásicos de los otros productos se conservan. El editor de las demostraciones sigue aislado.
4. **Datos de contacto conservados durante la navegación.** Se trasladó el borrador personal a un contexto separado, sólo en memoria de la pestaña. Editar una ficha y volver ya no lo borra. Recargar o cerrar la página sí lo elimina. Nunca entra en localStorage/sessionStorage, el fragmento de URL ni el store de productos.
5. **Revisión después de editar.** Al volver a Mi consulta se conserva el contacto, pero se requiere volver a revisar el mensaje. No se reutiliza una autorización anterior sobre una configuración modificada.
6. **Contraste del conflicto.** Las capturas mostraron botones blancos sobre rosa claro. Se corrigieron únicamente los colores de esos controles dentro del aviso; la resolución se comprobó también con teclado. No se rediseñó la ficha.

## Archivos de esta finalización

### Aplicación

| Archivo | Cambio |
| --- | --- |
| `src/components/ConsultationCustomerDraft.tsx` | Nuevo contexto temporal privado, sin almacenamiento. |
| `src/components/ConsultationProvider.tsx` | Aloja ese contexto sin cambiar el store, su clave o el formato persistente. |
| `src/components/ConsultationRequest.tsx` | Consume el borrador temporal; revisión y consentimiento siguen locales a la pantalla. |
| `src/components/ConsultationCustomerDetails.tsx` | Ayuda de privacidad actualizada al comportamiento real. |
| `src/components/ConsultationReview.tsx` | Edición identificada desde la ficha; conserva eliminación, resumen y edición clásica de R4. |
| `src/components/guided/GuidedProductSelection.tsx` | Nueva selección, fragmento recuperable, guardar/volver, cancelar/volver y otra personalización de Remeras. |
| `src/components/guided/GuidedProductSelection.module.css` | Dos reglas localizadas de contraste de los botones del conflicto. |

### Pruebas y documentación

- `scripts/test-f04-integration.mjs`: recorridos actualizados de navegador en desarrollo y exportación estática; usa datos sintéticos, dos pestañas y portapapeles simulado. Nunca abre WhatsApp.
- `scripts/test-guided-consultation.mjs`: se agregó una prueba completa de campos estructurados por el camino comercial, con catálogos sintéticos únicamente en memoria del proceso de prueba.
- `docs/f04-final/`: diagnóstico, este informe, resultados de navegador, registro de compilación, auditoría de protección, mensajes y capturas.
- `docs/f04/INFORME.md`: aviso que remite a este cierre y conserva el historial anterior.

No se modificaron en esta finalización el modelo, el store de persistencia, el constructor del mensaje, los catálogos comerciales, ProductSelection ni las validaciones R4. Esos archivos ya tenían trabajo local de etapas anteriores. No se confundieron sus diferencias contra HEAD con cambios nuevos de esta tarea.

## Recorrido A — Remeras

Se agregó una selección de 20 remeras con observaciones multilínea y asesoramiento. Se revisó y guardó, obteniendo un ID estable. Una **recarga real del documento** recuperó cantidad, observaciones y asesoramiento. Desde Mi consulta se editó a 25, conservando identidad y datos personales temporales. También se probó cantidad 99 seguida de cancelación: la selección guardada no cambió.

Se creó una segunda personalización de 30 desde el catálogo. Ambas coexistieron. Se editó sólo la segunda a 35 y se verificó que la primera y Lonas permanecieran idénticas. «Agregar otra personalización» inicia un borrador vacío sin guardar una tercera selección automáticamente.

V10.1 se mantuvo: un único resumen, sin selector de configuraciones, sin controles de demostración ni bloques informativos recuperados. Se verificó el orden DOM galería → formulario → resumen; en escritorio las posiciones CSS mantienen la composición aprobada.

## Recorrido B — Lonas

Se ingresaron 2 unidades, ancho `120,5`, alto `200`, unidad cm, asesoramiento sobre terminación y observaciones. Se guardaron numéricamente las medidas `120.5 × 200 cm` sin alterar las observaciones. Una recarga real recuperó la selección. «Editar configuración» abrió esa misma identidad; se guardaron 3 unidades y `180.5 × 250 cm`, volviendo a Mi consulta sin perder el contacto que se volvió a completar después de recargar.

Se probó ancho negativo: no permitió avanzar, conservó la cantidad y enfocó el campo con el error asociado. No se alteró la composición visual de Lonas ni se incorporaron opciones comerciales ficticias.

## Persistencia, recuperación y compatibilidad R4

- Se mantienen clave y envoltorio v1. No hubo migración ni borrado automático.
- Las selecciones nuevas usan `configurationId`; editar conserva ese identificador. Los registros clásicos continúan usando su clave anterior.
- En navegador se conservó una taza clásica de 30 unidades y se actualizó a 31 desde su editor original. Las configuraciones de Remeras/Lonas siguieron independientes.
- Dos pestañas reales probaron cantidad y observaciones diferentes: el textarea local no se reconstruyó, conservó 2.000 caracteres y mostró ambas versiones. Elegir local y guardar conservó exactamente el texto; elegir remota recuperó espacios y saltos sin recortarlos.
- La eliminación temporal de una configuración, con escrituras bloqueadas, no reapareció al recibir un cambio remoto. La resolución local eliminó únicamente esa identidad.
- Si el navegador rechaza escribir, «Solicitar presupuesto» llega a Mi consulta con la selección en memoria y advertencia de pérdida al recargar. El almacenamiento original permanece intacto. Se verificó que esa selección temporal desaparece tras una recarga real, tal como informa la advertencia.
- Los datos corruptos se advierten y no se sobrescriben. Una consulta vacía no muestra el formulario personal.
- Las pruebas del store también cubren lectura bloqueada, reintento, identidad clásica ampliada, opciones retiradas, duplicados, cantidades/talles/medidas inválidos, observaciones excesivas y aislamiento de demostraciones.

## Mensaje único generado

El siguiente texto proviene de la exportación de producción durante una prueba real de interfaz. **Todos los datos del cliente son sintéticos; no se envió.** La versión íntegra está en [mensaje-produccion.txt](mensaje-produccion.txt), también comparada exactamente con la copia interceptada del navegador.

```text
Solicitud de presupuesto — Las Chikas Design

Datos del cliente
Nombre y apellido: Cliente F04 de prueba
Celular: +1 202 555 0199
Correo electrónico: revision@example.test

Productos seleccionados
1. Tazas
Cantidad: 30
Observaciones: Dos diseños

2. Remeras Personalizadas
Configuración 1 de 2
Cantidad total: 25
Asesoramiento solicitado: Asesoramiento general
Observaciones: Edición de la primera

3. Remeras Personalizadas
Configuración 2 de 2
Cantidad total: 30
Observaciones: Segunda personalización

4. Lonas
Cantidad total: 3
Medidas solicitadas: 180.5 × 250 cm
Asesoramiento solicitado: Terminación
Observaciones: Medidas revisadas para el evento

Comentario general
Consulta conjunta de prueba
```

No aparecen materiales, talles ni terminaciones seleccionadas porque todavía no se ofrecen comercialmente. «Terminación» aquí es una solicitud de asesoramiento, no una terminación confirmada.

En una prueba del store separada se habilitó un catálogo **sintético sólo dentro del proceso de pruebas** para verificar modelo, material, talles S/M/L con cantidades, color, técnica, ubicación, material/uso/terminación/diseño de Lonas y medidas. Guardar → nuevo store → editar → nuevo store → mensaje conservó todos esos campos y sólo modificó la variante elegida. Ese catálogo no se escribió en el proyecto ni se incluyó en el sitio.

## Verificaciones ejecutadas

| Comprobación | Resultado y evidencia |
| --- | --- |
| ESLint | `npm run lint`, sin errores. |
| TypeScript | `npx tsc --noEmit`, sin errores. También lo verifica la compilación de producción. |
| Store y configuración | `node scripts/test-guided-consultation.mjs`: 13 grupos correctos. |
| Constructor R4.4 / WhatsApp | `node scripts/test-consultation-request.mjs`: mensaje exacto, opcionales, validaciones, Unicode, número y alternativa extensa correctos; sin solicitudes externas. |
| Navegador de desarrollo | 16 grupos correctos, [resultados](navegador-desarrollo.json). |
| Exportación estática | 16 grupos correctos bajo `/Chiks-web`, [resultados](navegador-produccion.json). |
| Compilación y postbuild | `GITHUB_ACTIONS=true`, `GITHUB_REPOSITORY=F3l1P3-F4/Chiks-web`, `npm run build`; [registro](compilacion.txt). |
| Responsive | Remeras y Lonas a 320, 390, 768, 1024, 1440 y 1670 px; sin desbordes horizontales. Remeras conserva V10.1 y resumen único. |
| Teclado y accesibilidad | Enter para avanzar y resolver conflicto, Tab, foco visible, etiquetas y errores vinculados; cantidad/ancho inválidos enfocan el campo correcto. Contraste de los botones de conflicto medido en el navegador, superior a 4.5:1. |
| Mensaje y privacidad | Mensaje conjunto de cuatro selecciones, copia exacta, alternativa cuando falla el portapapeles, contacto aislado entre pestañas y fuera del almacenamiento; se borra al recargar. |
| Producción sin demostraciones | Sin controles ni opciones F02 de prueba en las páginas; búsqueda del catálogo demostrativo en HTML/JS exportados. |
| Protecciones | Comparación SHA-256 contra el inventario anterior a esta tarea: sin eliminaciones; protegidos intactos. Ver `proteccion-proyecto.json`. |

Las verificaciones de navegador usan Chromium local con emulación de ancho; se inspeccionaron las capturas. No equivalen a pruebas en teléfonos físicos, Safari o lectores de pantalla. El portapapeles de prueba se interceptó; el permiso real depende del navegador del cliente.

## Capturas

Comparables entre desarrollo y producción:

- [Remeras móvil](capturas/produccion-remeras-390.png) · [Remeras escritorio](capturas/produccion-remeras-1440.png).
- [Lonas móvil](capturas/produccion-lonas-390.png) · [Lonas escritorio](capturas/produccion-lonas-1440.png).
- [Conflicto con 2.000 caracteres](capturas/produccion-conflicto-390.png).
- [Revisión del mensaje](capturas/produccion-mensaje-390.png).

Los informes JSON registran posiciones de galería/formulario/resumen en los seis anchos, orden DOM y ausencia de desbordes. No se cambió el archivo de composición V10.1 ni sus estilos.

## Decisiones y límites pendientes

1. Aldana y Karina deben aprobar modelos, materiales, talles, colores, técnicas, ubicaciones, usos y terminaciones. Las listas comerciales siguen vacías; se puede consultar con cantidad, observaciones y asesoramiento, y medidas solicitadas en Lonas.
2. Confirmar y configurar `NEXT_PUBLIC_WHATSAPP_NUMBER` para la compilación comercial y comprobar recepción real. Actualmente se revisa y copia el mensaje; no se afirma que fue enviado.
3. No se agregaron mínimos, precios, límites de fabricación ni condiciones. Se conservó la información existente.
4. Los datos personales se conservan sólo en memoria. Una recarga real los elimina deliberadamente; los productos persistidos sí se recuperan.
5. P01 (archivos de diseño) sigue pendiente de decisión; no se implementó.
6. No se modificaron Inicio/C03, Header/Footer, Soluciones, Trabajos, las otras 21 fichas, fotografías, F02, E01 ni sobrantes de C02. No se instaló nada ni se realizaron commit, push o deploy.

La tarea se detiene aquí. No se inició R5.
