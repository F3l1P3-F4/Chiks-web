# F04 — Diagnóstico previo a la finalización

23/11/2026. Rama `desarrollo`, HEAD `355095d`. Hay trabajo local previo de F04, V10 y V10.1; C02 y E01 se conservan sin limpiar.

## Ya implementado

- Modelo tipado y versionado de configuraciones, identidad por selección y múltiples configuraciones por producto.
- Persistencia con la clave original `las-chikas-design:consulta:v1`, lectura de registros anteriores, validación y protección de datos corruptos.
- Sincronización, pendientes en memoria, eliminaciones temporales y resolución explícita de conflictos.
- Recorrido guiado reutilizable, resumen dinámico, ayudas y validaciones por producto.
- Constructor de mensaje único con características estructuradas, datos personales, copia, consentimiento y alternativa para mensajes extensos.
- Separación entre opciones confirmadas (actualmente vacías) y demostrativas, con bloqueo de demostraciones en el circuito comercial.
- Vista definitiva de Remeras: galería → formulario → resumen en móvil, dos columnas en escritorio.

## Brechas verificadas en el código

1. Remeras recupera automáticamente la única selección existente al entrar sin identificador. Como V10 quitó su selector, una segunda personalización puede acabar editando la primera en vez de crear una selección independiente.
2. Mi consulta ofrece «Ver ficha» y un editor guiado desplegable. La nueva consigna requiere una acción Editar que regrese al configurador con la selección identificada, y que guardar o cancelar conserve la identidad correcta.
3. Los datos de contacto viven en ConsultationRequest. Al salir de Mi consulta para editar una ficha se desmonta ese componente y se pierden. Deben conservarse en memoria de la pestaña durante la navegación, sin entrar al almacenamiento persistente.
4. Las pruebas de navegador anteriores esperan controles que V10 eliminó. Se necesita un recorrido de integración actualizado que respete V10.1.

## Intervención prevista

- Reutilizar store, modelo y constructor de mensaje existentes; no realizar otra migración.
- Diferenciar la entrada de catálogo (personalización nueva) de la edición identificada desde Mi consulta. Mantener el identificador en un fragmento de URL sin datos personales para recuperar la edición al recargar.
- Ofrecer una acción de agregar otra personalización, sin selector ni controles de demostración en Remeras.
- Dirigir Editar a la ficha correspondiente y volver a Mi consulta al guardar/cancelar una edición.
- Mantener los datos personales en un contexto separado, sólo en memoria de la pestaña, y actualizar su ayuda de privacidad. La revisión y el consentimiento se vuelven a pedir tras editar.
- Ejecutar recorridos reales de Remeras y Lonas, variantes, compatibilidad, conflictos, bloqueo de almacenamiento, responsive, calidad y exportación estática.

No se aprueban opciones comerciales nuevas ni se configura un número ficticio de WhatsApp. La recepción real seguirá pendiente del número comercial.
