# V11 — Controles interactivos de Remeras

23/11/2026. Rama `desarrollo`, base `31692a9`. Sin commit, push ni deploy.

## Implementación

Se conserva la composición V10/V10.1, el único resumen y los tres pasos de F04. No se modifica el prototipo F02 ni se restaura el selector de demostraciones.

1. **Modelo y material:** texto libre opcional, hasta 120 caracteres por campo, más asesoramiento y ayuda contextual. Expresan lo solicitado por el cliente, no disponibilidad confirmada. Si posteriormente se aprueban opciones en el catálogo, este mismo bloque utiliza tarjetas; seleccionar una reemplaza la descripción libre correspondiente.
2. **Talles y cantidad:** cantidad entera positiva o distribución en filas de talles escritos por el cliente. Cada fila requiere nombre y cantidad positiva; no se permiten etiquetas duplicadas. El total se calcula sumando las filas, evitando totales contradictorios. Al desactivar la distribución, se conserva ese total. Incluye asesoramiento y observaciones específicas de hasta 500 caracteres. No se ofrecen S/M/L/XL como stock confirmado ni se inventan mínimos.
3. **Personalización:** tarjetas para Estampa vinilo, DTF y asesoramiento; frente y espalda como casillas independientes; diez colores definidos en la consigna y asesoramiento. Las muestras digitales son orientativas y no se atribuyen códigos Pantone. Se mantienen las observaciones generales de hasta 2.000 caracteres y las ayudas existentes.

Colores: Blanco, Rojo, Negro, Amarillo, Gris shogin, Gris oscuro, Azul oscuro, Azul Francia, Naranja y Verde. No se añadieron técnicas distintas de las indicadas en V11.

## Datos y compatibilidad

Se mantiene la clave `las-chikas-design:consulta:v1`, su envoltorio y las identidades de las selecciones. No hay segundo almacenamiento ni migración destructiva.

El modelo añade campos opcionales: `requests` para modelo/material solicitados y notas de talles; `requested: true` para distinguir talles escritos por el cliente; `placements` para seleccionar frente y espalda conjuntamente. Los registros anteriores siguen siendo válidos. La ubicación singular anterior se puede editar con los nuevos controles sin duplicar la información.

El resumen, Mi consulta y el mensaje reutilizan `configurationRows`. Muestran únicamente decisiones presentes, con rótulos «Modelo solicitado» y «Material solicitado» para el texto libre. Se mantienen edición, cancelación, varias configuraciones, borradores, conflictos y el contexto temporal de datos personales de F04.

El [mensaje generado con datos sintéticos](mensaje-prueba.txt) contiene 20 prendas repartidas en dos referencias solicitadas, modelo/material libres, color, técnica, frente y espalda, asesoramiento y observaciones. Se verificó la copia exacta sin enviar nada.

## Archivos

- Nuevo: `src/components/guided/RemerasConfigurationFields.tsx`.
- Modificados: `src/components/guided/GuidedProductSelection.tsx` y su CSS, `src/data/guidedCatalogs.ts`, `src/lib/consultationConfiguration.ts`.
- Pruebas: nuevo `scripts/test-v11.mjs`; ampliación de `scripts/test-guided-consultation.mjs`; selector de asesoramiento más preciso y espera de fuentes con resultado booleano en `scripts/test-f04-integration.mjs`.
- Evidencia: `docs/v11/resultados.json`, `mensaje-prueba.txt` y exactamente dos capturas.

No se modificaron los componentes de Inicio/C03, Header, Footer, la composición RemerasGuidedWorkspace, las fichas de Lonas/otros productos, ProductSelection, ConsultationProvider ni el mecanismo de envío. Los cambios compartidos de datos/controlador son los necesarios para transportar los nuevos campos. `AGENTS.md` ya tenía cambios de O02 y se conservó.

## Verificaciones

- ESLint y TypeScript: correctos.
- Compilación estática y postbuild con `/Chiks-web`: correctos, 48 páginas generadas y 44 nombres de segmentos normalizados. Sin publicación.
- `test-guided-consultation.mjs`: 14 grupos correctos, incluido un nuevo caso V11 de guardar, recuperar, editar y generar mensaje con solicitudes, talles propios y dos ubicaciones. También comprueba rechazo de cantidades incoherentes, talles duplicados, texto excesivo y ubicaciones no autorizadas.
- `test-consultation-request.mjs`: correcto; mensaje, opcionales, Unicode, enlaces y alternativa para mensajes extensos, sin solicitudes externas.
- `test-v11.mjs`: seis recorridos correctos. Campos libres; talles/total; las diez muestras de color, ambas técnicas y asesoramiento; frente/espalda simultáneos; resumen; guardado, recarga, edición y copia. Resultados en `resultados.json`.
- V10.1: orden DOM y visual galería → formulario → resumen a 390 px; galería/resumen a la izquierda y formulario a la derecha a 1440 px. Un resumen y sin desbordes. Teclado y foco visible comprobados, incluido el contorno de las tarjetas con foco.
- Se inspeccionaron las dos capturas actuales; no se abrieron capturas históricas ni se generó una batería de imágenes.

**Límite de la regresión adicional:** el recorrido general de navegador de F04 quedó interrumpido por falta de memoria/bloqueo de un renderer del entorno. En un intento reanudado se observaron correctos los casos de conflictos local/remoto, eliminación temporal, escrituras bloqueadas, medidas inválidas de Lonas y datos corruptos. No se declara aprobado el script completo ni se confunde ese intento con el recorrido V11, que sí finalizó con seis casos correctos. Las pruebas dirigidas del modelo y del mensaje finalizaron correctamente. No se cambiaron funcionalidades de producción para eludir el fallo del entorno.

## Pendientes comerciales

- Aprobar modelos, materiales, tabla de medidas y talles disponibles; actualmente se recibe una solicitud libre, sin prometerlos.
- Confirmar tono definitivo y disponibilidad de colores. Las muestras hexadecimales son aproximaciones de pantalla.
- Confirmar compatibilidades de materiales/diseños/técnicas, precios, mínimos y condiciones; no se inventaron reglas.
- Configurar el número comercial y realizar una recepción real de WhatsApp. Esta tarea no envió consultas.
- P01, carga de archivos de diseño, sigue fuera de alcance.

Capturas: [celular 390 px](capturas/remeras-390.png) y [escritorio 1440 px](capturas/remeras-1440.png).
