# Solicitudes de presupuesto por WhatsApp — R4.4

## Configuración comercial

Falta confirmar con Aldana y Karina el número autorizado, el código de país y que tenga una cuenta de WhatsApp activa. No se asignó ningún número comercial ni personal de prueba.

- Desarrollo local: agregar `NEXT_PUBLIC_WHATSAPP_NUMBER` en `.env.local`, en la raíz del proyecto, y reiniciar `npm run dev`.
- GitHub Pages: definir la variable de repositorio `NEXT_PUBLIC_WHATSAPP_NUMBER` en Settings → Secrets and variables → Actions → Variables. El workflow existente la pasa al paso de compilación.
- Hosting futuro: definir la misma variable en el entorno de compilación.

Usar el número completo en formato internacional con código de país. Se aceptan dígitos, `+` o prefijo `00`, espacios, guiones y paréntesis. La normalización elimina separadores y el prefijo internacional, sin adivinar el país ni convertir números nacionales. El resultado debe contener entre 8 y 15 dígitos y no empezar por cero. Para un celular argentino, confirmar expresamente el formato internacional de WhatsApp; no agregar automáticamente códigos ni eliminar partes del número nacional.

La validación es sintáctica: no demuestra que el número pertenezca al negocio ni que tenga WhatsApp. La variable es pública y Next.js la incorpora durante la compilación. Cambiarla requiere volver a compilar y publicar cuando se autorice. `.env.local` permanece ignorado por Git. Sin variable, o con un valor inválido, la compilación funciona, se avisa que el canal está pendiente y se permite revisar y copiar el resumen; no se genera un destino ficticio.

## Circuito

1. Agregar productos desde sus fichas y guardar cantidades y observaciones.
2. En `/mi-consulta`, resolver conflictos de sincronización y guardar los borradores de productos.
3. Completar «Tus datos» y pulsar «Revisar solicitud».
4. Revisar el mensaje completo: encabezado, datos de contacto, productos con cantidades y observaciones, y comentario general. Los campos opcionales vacíos se omiten.
5. Copiar el resumen si se desea. Para abrir WhatsApp, leer el aviso de privacidad y marcar la aceptación.
6. Abrir la conversación, revisar o pegar el mensaje en WhatsApp y pulsar Enviar allí.

La vista previa y el mensaje usan la misma función. Los cambios posteriores invalidan la revisión y la aceptación; antes de copiar o abrir WhatsApp se relee el estado vigente del proveedor, incluyendo cambios pendientes y conflictos, incluso si aún no se procesó un evento entre pestañas. Ninguna acción borra la selección ni confirma recepción o entrega.

## Privacidad

Los datos personales y la revisión permanecen en memoria de la página. No se agregan a localStorage, sessionStorage, bases de datos, analítica, consola ni URLs internas. Se mantienen mientras se editan o sincronizan los productos y se descartan al recargar o abandonar la página. El almacenamiento de productos mantiene su clave y formato existentes.

El enlace de mensaje precargado transfiere el contenido mediante una URL externa de WhatsApp. Esa URL puede quedar en el historial del navegador, registros de red o sistemas de WhatsApp; la codificación de URL no cifra ni oculta los datos. La página lo informa antes de habilitar el enlace y no lo muestra en el documento hasta la aceptación explícita. Los enlaces usan `noopener noreferrer` y `referrerPolicy="no-referrer"` y no incorporan parámetros de seguimiento. No se precarga ni se abre WhatsApp automáticamente.

Como alternativa, el cliente puede copiar el mensaje y abrir el chat sin texto precargado. Eso evita incluir el contenido en la URL; al pegar y enviar, se comparte con WhatsApp y el negocio. Copiar también coloca los datos en el portapapeles del dispositivo, y solo se hace a pedido del cliente. Si el navegador deniega el portapapeles, se selecciona el resumen completo y se explica cómo copiarlo manualmente.

## Mensajes extensos

Se usa un umbral conservador de 2.000 caracteres para la URL ya codificada, incluyendo el destino. Es una decisión de compatibilidad del sitio, no un límite oficial documentado de WhatsApp. Si se supera, se conserva el texto completo y se ofrece copiar y abrir el chat sin texto para pegarlo manualmente. No se truncan productos, observaciones ni comentarios. La vista previa tiene desplazamiento interno para evitar extender innecesariamente la página.

## Verificación y límites

- Funciones puras: `node scripts/test-consultation-request.mjs`.
- Comprobaciones técnicas: `npm run lint`, `node node_modules/typescript/bin/tsc --noEmit --incremental false`, `npm run build -- --webpack` (incluye el postbuild existente).
- Pruebas de interfaz: consulta vacía, un producto y varios, datos inválidos, revisión y cambios posteriores, conflictos y borradores, copiado y denegación del portapapeles, configuración ausente, enlaces interceptados sin contactar WhatsApp, conservación de la selección, privacidad, teclado y anchos de 320 a 1670 px. La configuración inválida se comprueba mediante pruebas de la normalización; produce el mismo estado de canal no configurado.
- El portapapeles se emula en la sesión de pruebas para comprobar el texto íntegro y los permisos denegados sin sobrescribir el portapapeles del equipo. Los enlaces externos se interceptan antes de acceder a WhatsApp.
- Los datos ficticios de pruebas usan un número del rango reservado 202-555-01xx. No constituyen configuración comercial ni destinatario de una entrega. Ninguna prueba autoriza enviar mensajes reales.

Quedan pendientes la confirmación del número comercial, su configuración para la publicación autorizada y una prueba real con Karina en WhatsApp móvil y Web. Una exportación estática no puede verificar la existencia de la cuenta, la apertura efectiva de la app, que el cliente pulse Enviar ni la recepción. Bloqueadores y permisos del navegador pueden afectar la apertura o el copiado. Si el almacenamiento de productos está bloqueado, los cambios temporales conservan las advertencias de R4.2.1.

Referencia técnica: [Click to chat — Centro de ayuda de WhatsApp](https://faq.whatsapp.com/5913398998672934).

## Resultado de la verificación — 18/11/2026

- ESLint, TypeScript, funciones puras y exportación estática con basePath: satisfactorios. El postbuild existente completó su comprobación.
- Interfaz verificada en Edge automatizado, con enlaces externos interceptados: un producto y varios, datos incompletos y correo inválido, revisión exacta, consentimiento, cantidades y observaciones distintas, actualización remota y relectura sin evento, borradores y conflictos, vuelta a edición, mensajes extensos, copiado íntegro y permiso denegado, conservación de productos y limpieza de datos personales al recargar.
- Comprobados etiquetas, foco y teclado, capturas de escritorio y celular y ausencia de desbordes entre 320 y 1670 px. Sin errores de hidratación en la sesión limpia.
- Comprobados la compilación y la interfaz sin número configurado, la alternativa de copiado, los destinos de los botones y la conservación de noindex y la exclusión del sitemap de `/mi-consulta`.
- La compilación local final quedó sin número comercial ni de prueba. Dos aperturas fueron interceptadas (mensaje precargado y chat sin texto); ninguna accedió a WhatsApp. No se realizó una entrega comercial real.

**Veredicto técnico: R4.4 IMPLEMENTADA.** La entrega comercial sigue pendiente de confirmar y configurar el número autorizado y realizar una prueba real con la destinataria.
