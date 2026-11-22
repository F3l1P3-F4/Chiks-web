'use strict';

// F02: datos DEMOSTRATIVOS. No importar este esquema en el catálogo público.
// Nada de este archivo confirma disponibilidad, mínimos ni condiciones comerciales.
(() => {
  const advice = ['asesoramiento', 'Necesito asesoramiento', 'Podés seguir sin decidir esto ahora.'];
  const products = {
    remeras: {
      title: 'Remeras personalizadas',
      description: 'Remeras personalizadas para uniformes, egresados, eventos y merchandising.',
      steps: ['Modelo y material', 'Talles y cantidades', 'Personalización'],
      stepTitles: ['Elegí una base para tu idea', '¿Cómo repartirías las prendas?', 'Dale forma a la personalización'],
      stepHelp: ['Explorá alternativas de ejemplo. Si todavía no sabés cuál elegir, podés pedir asesoramiento.', 'Probá distintas cantidades por talle. No es una tabla de medidas ni confirma talles disponibles.', 'Elegí referencias para conversar. No se verifica la compatibilidad entre material y técnica en este prototipo.'],
      fields: {
        modelo: { label: 'Modelo', options: [['recto', 'Corte recto', 'Ejemplo de silueta de líneas rectas.'], ['amplio', 'Corte amplio', 'Ejemplo de silueta más holgada.'], advice] },
        material: { label: 'Material', options: [['algodon', 'Algodón', 'Explorá una alternativa de fibra natural.'], ['poliester', 'Poliéster', 'Explorá una alternativa de fibra sintética.'], advice] },
        color: { label: 'Color de referencia', options: [['azul', 'Azul marino', '', '#07134b'], ['blanco', 'Blanco', '', '#fff'], ['negro', 'Negro', '', '#20222a'], advice] },
        tecnica: { label: '¿Cómo imaginás aplicar tu diseño?', options: [['estampado', 'Estampado', 'Como referencia, un diseño impreso sobre la prenda.'], ['bordado', 'Bordado', 'Como referencia, un diseño realizado con hilos.'], advice] },
        ubicacion: { label: 'Ubicación del diseño', options: [['frente', 'Frente', 'Referencia para la parte delantera.'], ['espalda', 'Espalda', 'Referencia para la parte trasera.'], advice] },
      },
      stages: [['modelo', 'material'], [], ['color', 'tecnica', 'ubicacion']],
    },
    lonas: {
      title: 'Lonas',
      description: 'Impresión ecosolvente para cartelería, fondos y cerramientos. Explorá cómo definir una pieza a medida.',
      steps: ['Material y uso', 'Medidas y cantidad', 'Terminaciones'],
      stepTitles: ['Contanos qué tenés en mente', 'Dale una medida a tu idea', 'Pensá cómo se colocaría'],
      stepHelp: ['Los nombres de materiales existen en el catálogo. Su selección aquí es demostrativa y necesita validación.', 'Usá centímetros. Si no sabés las medidas finales, podés dejar esa decisión para una conversación.', 'Probá cómo pedirías una terminación y ayuda con el diseño. Las posibilidades reales se deben confirmar.'],
      fields: {
        material: { label: 'Material de referencia', options: [['frontlit', 'Frontlit', 'Referencia: superficie continua para impresión frontal.'], ['blackout', 'Blackout', 'Referencia: una lona que busca bloquear el paso de luz.'], ['mesh', 'Mesh', 'Referencia: una superficie con pequeños orificios.'], advice] },
        uso: { label: '¿Dónde imaginás usarla?', options: [['interior', 'Interior', 'Un espacio bajo techo.'], ['exterior', 'Exterior', 'Un espacio al aire libre.'], advice] },
        terminacion: { label: 'Terminación de referencia', options: [['ojales', 'Con ojales', 'Pequeñas aberturas para pensar una forma de sujeción.'], ['sin-ojales', 'Sin ojales', 'Sin esas aberturas en el esquema de ejemplo.'], advice] },
        diseno: { label: '¿Cómo está tu diseño?', options: [['preparado', 'Tengo una idea o diseño', 'Quiero conversar sobre cómo adaptarlo.'], ['ayuda', 'Necesito ayuda para definirlo', 'Quiero orientación antes de avanzar.']] },
      },
      stages: [['material', 'uso'], [], ['terminacion', 'diseno']],
    },
  };

  const createState = () => ({ step: 0, answers: {}, sizes: { S: '0', M: '0', L: '0', XL: '0' }, sizeAdvice: false, quantityUnknown: false, total: '', width: '', height: '', measureAdvice: false, reviewed: false, photo: 0 });
  const states = { remeras: createState(), lonas: createState() };
  const root = document.getElementById('prototype');
  const numberFormat = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });
  let active = 'remeras';
  let statusTimer;
  const escape = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const state = () => states[active];
  const product = () => products[active];
  const numeric = (value) => Number(String(value).trim().replace(',', '.'));
  const positiveInteger = (value) => String(value).trim() !== '' && Number.isSafeInteger(Number(value)) && Number(value) > 0;
  const validSizes = () => Object.values(state().sizes).every((value) => String(value).trim() !== '' && Number.isSafeInteger(Number(value)) && Number(value) >= 0) && Number.isSafeInteger(sizeTotal());
  const sizeTotal = () => Object.values(state().sizes).reduce((sum, value) => sum + Number(value), 0);
  const validMeasure = (value) => /^\d+(?:[.,]\d{1,2})?$/.test(String(value).trim()) && Number.isFinite(numeric(value)) && numeric(value) > 0;
  const arrow = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';

  function field(key) {
    const config = product().fields[key];
    return `<fieldset><legend>${config.label}</legend><div class="choice-grid">${config.options.map(([value, label, help, color]) => `
      <label class="choice${value === 'asesoramiento' ? ' advice' : ''}${color ? ' swatch-choice' : ''}">
        <input type="radio" id="${key}-${value}" name="${key}" value="${value}"${state().answers[key] === value ? ' checked' : ''}>
        ${color ? `<span class="color-dot" style="background:${color}" aria-hidden="true"></span>` : ''}
        <span><strong>${label}</strong>${help ? `<small>${help}</small>` : ''}</span>
      </label>`).join('')}</div></fieldset>`;
  }

  function quantityField() {
    return `<label class="check-line"><input id="quantity-unknown" type="checkbox"${state().quantityUnknown ? ' checked' : ''}><span>Todavía no sé la cantidad</span></label>
      <div id="total-field" class="form-field"${state().quantityUnknown ? ' hidden' : ''}>
        <label for="total-quantity">${active === 'remeras' ? 'Cantidad total aproximada' : 'Cantidad de piezas'}</label>
        <input id="total-quantity" data-value="total" type="number" min="1" step="1" max="${Number.MAX_SAFE_INTEGER}" inputmode="numeric" value="${escape(state().total)}" aria-describedby="quantity-help">
      </div><p id="quantity-help" class="field-help">No hay una cantidad mínima comercial definida en este ejemplo.</p>`;
  }

  function sizeFields() {
    return `<fieldset><legend>Talles de ejemplo</legend>
      <label class="check-line"><input id="size-advice" type="checkbox"${state().sizeAdvice ? ' checked' : ''}><span>Necesito ayuda para definir los talles</span></label>
      <div id="size-distribution"${state().sizeAdvice ? ' hidden' : ''}>
        <div class="quantity-grid">${Object.entries(state().sizes).map(([size, amount]) => `<div class="quantity-cell"><label for="size-${size}">${size}<span class="sr-only">, cantidad</span></label><input id="size-${size}" data-size="${size}" type="number" min="0" step="1" max="${Number.MAX_SAFE_INTEGER}" inputmode="numeric" value="${escape(amount)}" aria-describedby="sizes-help"></div>`).join('')}</div>
        <p class="total-line"><span>Total de prendas</span><strong id="size-total">${validSizes() ? numberFormat.format(sizeTotal()) : 'Revisá las cantidades'}</strong></p>
      </div>
      <div id="size-advice-total"${state().sizeAdvice ? '' : ' hidden'}>${quantityField()}</div>
      <details class="context-help"><summary>¿Qué pasa si todavía no conozco los talles?</summary><p>Marcá la opción de ayuda y, si la sabés, indicá una cantidad total. Una futura tabla de medidas deberá validarse para cada modelo; este ejemplo no usa equivalencias de talles.</p></details>
      <p id="sizes-help" class="field-help">S, M, L y XL son etiquetas de muestra. No representan una oferta ni una tabla de talles confirmada.</p>
    </fieldset>`;
  }

  function measureFields() {
    return `<fieldset><legend>Medidas de la pieza</legend>
      <label class="check-line"><input id="measure-advice" type="checkbox"${state().measureAdvice ? ' checked' : ''}><span>Necesito ayuda para definir las medidas</span></label>
      <div id="measure-inputs" class="measure-fields"${state().measureAdvice ? ' hidden' : ''}>
        <div class="form-field"><label for="measure-width">Ancho</label><div class="input-unit"><input id="measure-width" data-value="width" type="text" inputmode="decimal" maxlength="12" value="${escape(state().width)}" aria-describedby="measure-help"><span aria-hidden="true">cm</span></div></div>
        <div class="form-field"><label for="measure-height">Alto</label><div class="input-unit"><input id="measure-height" data-value="height" type="text" inputmode="decimal" maxlength="12" value="${escape(state().height)}" aria-describedby="measure-help"><span aria-hidden="true">cm</span></div></div>
      </div>
      <p id="measure-help" class="field-help">Medidas en centímetros. Podés usar coma o punto y hasta dos decimales. No se calculan precios ni límites de fabricación.</p>
    </fieldset>
    <fieldset><legend>Cantidad</legend>${quantityField()}</fieldset>`;
  }

  function photoBlock() {
    if (active === 'remeras') {
      const photos = [
        ['../../public/images/productos/indumentaria-corporativa.webp', 'Remeras con estampados corporativos, fotografía del catálogo'],
        ['../../public/images/productos/indumentaria-clubes.webp', 'Remera personalizada para un club, fotografía del catálogo'],
      ];
      const chosen = photos[state().photo];
      return `<div class="product-media"><img id="main-photo" src="${chosen[0]}" alt="${chosen[1]}" width="1800" height="790"></div>
        <details class="product-facts"><summary>Ver fotos y detalles de referencia</summary><div class="photo-thumbs" role="group" aria-label="Fotografías actuales del catálogo">${photos.map(([src], index) => `<button type="button" data-photo="${index}" aria-pressed="${state().photo === index}" aria-label="Ver fotografía ${index + 1}" aria-controls="main-photo"><img src="${src}" alt="" width="76" height="54"></button>`).join('')}</div>
        <p>Fotografías actuales del catálogo. Las selecciones de ejemplo no modifican estas imágenes. El nombre, la descripción y las fotos son referencias existentes; los campos configurables son demostrativos.</p></details>`;
    }
    return `<div class="product-media scheme" role="img" aria-label="Esquema orientativo de las medidas de una lona; no es una fotografía">
      <p class="scheme-width" id="scheme-width">Ancho a definir</p>
      <div class="scheme-board" id="scheme-board"><span>Área de impresión</span><i class="scheme-corner" hidden></i><i class="scheme-corner" hidden></i><i class="scheme-corner" hidden></i><i class="scheme-corner" hidden></i></div>
      <p class="scheme-height" id="scheme-height">Alto a definir</p>
    </div><p class="photo-caption">Esquema orientativo · No es una fotografía.</p><details class="product-facts"><summary>Cómo leer este esquema</summary><p>El rectángulo relaciona ancho y alto con una proporción aproximada. No previsualiza una impresión. Los puntos representan la opción de ojales, sin confirmar cantidad ni posición real. Lonas todavía no tiene una fotografía específica asignada.</p></details>`;
  }

  function rows() {
    const s = state();
    const choice = (key) => {
      const option = product().fields[key].options.find(([value]) => value === s.answers[key]);
      return [product().fields[key].label, option?.[1] ?? 'A elegir', !option];
    };
    if (active === 'remeras') {
      const quantity = s.sizeAdvice ? s.quantityUnknown ? 'Por definir con asesoramiento' : positiveInteger(s.total) ? `${numberFormat.format(Number(s.total))} prendas` : 'A indicar' : validSizes() && sizeTotal() > 0 ? `${numberFormat.format(sizeTotal())} prendas` : 'A indicar';
      const distribution = s.sizeAdvice ? 'Necesito asesoramiento' : validSizes() && sizeTotal() > 0 ? Object.entries(s.sizes).filter(([, amount]) => Number(amount) > 0).map(([size, amount]) => `${size}: ${numberFormat.format(Number(amount))}`).join(' · ') : 'Sin repartir';
      return [choice('modelo'), choice('material'), ['Cantidad', quantity, quantity === 'A indicar'], ['Talles', distribution, distribution === 'Sin repartir'], choice('color'), choice('tecnica'), choice('ubicacion'), ['Cantidad mínima', 'A confirmar', true]];
    }
    const known = !s.measureAdvice && validMeasure(s.width) && validMeasure(s.height);
    return [choice('material'), choice('uso'), ['Medidas', s.measureAdvice ? 'Necesito asesoramiento' : known ? `${numberFormat.format(numeric(s.width))} × ${numberFormat.format(numeric(s.height))} cm` : 'A indicar', !s.measureAdvice && !known], ['Cantidad', s.quantityUnknown ? 'Por definir con asesoramiento' : positiveInteger(s.total) ? `${numberFormat.format(Number(s.total))} piezas` : 'A indicar', !s.quantityUnknown && !positiveInteger(s.total)], choice('terminacion'), choice('diseno'), ['Cantidad mínima', 'A confirmar', true]];
  }

  function fillRows(target) {
    target.replaceChildren(...rows().map(([label, value, pending]) => {
      const row = document.createElement('div');
      row.className = 'summary-row';
      const term = document.createElement('dt');
      term.textContent = label;
      const detail = document.createElement('dd');
      detail.textContent = value;
      if (pending) detail.className = 'pending';
      row.append(term, detail);
      return row;
    }));
  }

  function announce(message) {
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { const node = document.getElementById('selection-status'); if (node) node.textContent = message; }, 250);
  }

  function updateSummary() {
    fillRows(document.getElementById('summary-values'));
    const total = document.getElementById('size-total');
    if (total) total.textContent = validSizes() ? numberFormat.format(sizeTotal()) : 'Revisá las cantidades';
    if (active === 'lonas') {
      const known = !state().measureAdvice && validMeasure(state().width) && validMeasure(state().height);
      document.getElementById('scheme-width').textContent = !state().measureAdvice && validMeasure(state().width) ? `Ancho: ${numberFormat.format(numeric(state().width))} cm` : 'Ancho a definir';
      document.getElementById('scheme-height').textContent = !state().measureAdvice && validMeasure(state().height) ? `Alto: ${numberFormat.format(numeric(state().height))} cm` : 'Alto a definir';
      document.querySelector('.scheme').setAttribute('aria-label', `Esquema orientativo de una lona. ${document.getElementById('scheme-width').textContent}. ${document.getElementById('scheme-height').textContent}. No es una fotografía.`);
      document.getElementById('scheme-board').style.aspectRatio = known ? String(Math.max(.55, Math.min(1.85, numeric(state().width) / numeric(state().height)))) : '1.5';
      document.querySelectorAll('.scheme-corner').forEach((node) => { node.hidden = state().answers.terminacion !== 'ojales'; });
    }
  }

  function errorFor(step) {
    const missing = product().stages[step].find((key) => !state().answers[key]);
    if (missing) return { message: `Elegí una opción en «${product().fields[missing].label}» o indicá que necesitás ayuda.`, selector: `[name="${missing}"]` };
    if (step !== 1) return null;
    if (active === 'remeras' && !state().sizeAdvice) {
      if (!validSizes() || sizeTotal() <= 0) return { message: 'Indicá al menos una prenda con cantidades enteras desde cero, o marcá que necesitás ayuda con los talles.', selector: '[data-size]' };
      return null;
    }
    if (active === 'lonas' && !state().measureAdvice) {
      if (!validMeasure(state().width)) return { message: 'Ingresá un ancho mayor que cero en centímetros, con hasta dos decimales, o pedí ayuda para definir las medidas.', selector: '#measure-width' };
      if (!validMeasure(state().height)) return { message: 'Ingresá un alto mayor que cero en centímetros, con hasta dos decimales, o pedí ayuda para definir las medidas.', selector: '#measure-height' };
    }
    if (!state().quantityUnknown && !positiveInteger(state().total)) return { message: 'Indicá una cantidad entera mayor que cero, o marcá «Todavía no sé la cantidad». Esto no define un mínimo comercial.', selector: '#total-quantity' };
    return null;
  }

  function showError(error) {
    const node = document.getElementById('step-error');
    node.textContent = error.message;
    node.hidden = false;
    const control = document.querySelector(error.selector);
    control.setAttribute('aria-invalid', 'true');
    const describedBy = control.getAttribute('aria-describedby') ?? '';
    control.setAttribute('aria-describedby', `${describedBy} step-error`.trim());
    control.focus();
  }

  function moveStep(index, focus = true) {
    state().step = index;
    state().reviewed = false;
    document.getElementById('configurador').hidden = false;
    document.getElementById('seleccion-resumen').hidden = false;
    document.getElementById('revision').hidden = true;
    document.querySelector('.skip-link').href = '#configurador';
    document.querySelector('.skip-link').textContent = 'Ir a las opciones del producto';
    document.querySelectorAll('[data-step]').forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    document.getElementById('step-content').innerHTML = `<h3 id="step-heading" class="step-title" tabindex="-1">${product().stepTitles[index]}</h3><p class="step-help">${product().stepHelp[index]}</p><p id="step-error" role="alert" class="error" hidden></p>${index === 1 ? active === 'remeras' ? sizeFields() : measureFields() : product().stages[index].map(field).join('')}${index === 2 ? '<p class="notice">Son referencias para evaluar la experiencia. No confirman técnicas, colores ni terminaciones disponibles.</p>' : ''}`;
    document.getElementById('back-step').hidden = index === 0;
    document.getElementById('next-step').innerHTML = `<span>${index === 2 ? 'Revisar selección de ejemplo' : 'Continuar'}</span>${arrow}`;
    updateSummary();
    if (focus) {
      const heading = document.getElementById('step-heading');
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: 'start' });
    }
  }

  function review() {
    for (let i = 0; i < product().steps.length; i += 1) {
      const error = errorFor(i);
      if (error) { moveStep(i); showError(error); return; }
    }
    state().reviewed = true;
    document.getElementById('configurador').hidden = true;
    document.getElementById('seleccion-resumen').hidden = true;
    document.getElementById('revision').hidden = false;
    document.querySelector('.skip-link').href = '#revision';
    document.querySelector('.skip-link').textContent = 'Ir a la revisión de ejemplo';
    fillRows(document.getElementById('review-values'));
    document.getElementById('review-heading').focus();
    document.getElementById('revision').scrollIntoView({ block: 'start' });
    announce('Selección de ejemplo lista para revisar. No se guardó ni se envió.');
  }

  function render(focus = false) {
    clearTimeout(statusTimer);
    const p = product();
    document.title = `F02 · ${p.title} | Las Chikas Design`;
    document.querySelectorAll('[data-example]').forEach((link) => {
      if (link.dataset.example === active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    root.innerHTML = `<div class="product-heading"><h1 id="product-title" tabindex="-1">${p.title}</h1><p>${p.description}</p></div>
      <div class="workspace">
        <section class="product-view" aria-label="Referencia visual del producto">${photoBlock()}</section>
        <section id="configurador" class="configurator panel" aria-labelledby="config-title" tabindex="-1">
          <div class="config-top"><h2 id="config-title">Armá tu ejemplo</h2><button id="reset-example" class="small-link" type="button">Reiniciar</button></div>
          <ol class="step-nav" aria-label="Pasos de selección">${p.steps.map((label, i) => `<li><button type="button" data-step="${i}" aria-controls="step-content"><span>Paso ${i + 1}</span>${label}</button></li>`).join('')}</ol>
          <div id="step-content"></div>
          <div class="actions"><button id="back-step" class="button secondary" type="button">Anterior</button><button id="next-step" class="button primary" type="button"></button></div>
          <a class="summary-link" href="#seleccion-resumen">Ver mi resumen de ejemplo</a>
        </section>
        <aside id="seleccion-resumen" class="summary panel" aria-labelledby="summary-title" tabindex="-1"><h2 id="summary-title">Tu selección de ejemplo</h2><p class="intro">Se actualiza mientras probás las opciones.</p><dl id="summary-values"></dl><p class="footnote">Precio, disponibilidad y condiciones: a confirmar con el equipo. El prototipo no calcula presupuestos.</p></aside>
        <section id="revision" class="review-panel panel" aria-labelledby="review-heading" hidden><h2 id="review-heading" tabindex="-1">Revisá tu selección</h2><p>Este sería el resumen que revisarías antes de una consulta futura.</p><dl id="review-values" class="review-list"></dl><p class="notice"><strong>Fin de la demostración.</strong> No se agregó nada a Mi consulta, no se guardó información y no se envió una solicitud. Todas las opciones siguen pendientes de validación comercial.</p><div class="actions"><button id="edit-example" class="button primary" type="button">Volver a editar</button><button id="reset-review" class="small-link" type="button">Reiniciar ejemplo</button></div></section>
      </div><p id="selection-status" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p>`;
    moveStep(state().step, false);
    if (focus) document.getElementById('product-title').focus({ preventScroll: true });
  }

  root.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.step !== undefined) { moveStep(Number(button.dataset.step)); return; }
    if (button.dataset.photo !== undefined) {
      state().photo = Number(button.dataset.photo);
      const image = document.getElementById('main-photo');
      image.src = button.querySelector('img').src;
      image.alt = state().photo ? 'Remera personalizada para un club, fotografía del catálogo' : 'Remeras con estampados corporativos, fotografía del catálogo';
      document.querySelectorAll('[data-photo]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      return;
    }
    if (button.id === 'reset-example' || button.id === 'reset-review') { states[active] = createState(); render(); document.getElementById('config-title').setAttribute('tabindex', '-1'); document.getElementById('config-title').focus(); announce('Ejemplo reiniciado.'); return; }
    if (button.id === 'back-step') moveStep(state().step - 1);
    if (button.id === 'edit-example') moveStep(2);
    if (button.id === 'next-step') {
      if (state().step === 2) review();
      else { const error = errorFor(state().step); if (error) showError(error); else moveStep(state().step + 1); }
    }
  });

  root.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const error = document.getElementById('step-error');
    if (error) error.hidden = true;
    root.querySelectorAll('[aria-invalid]').forEach((control) => control.removeAttribute('aria-invalid'));
    if (input.type === 'radio') { state().answers[input.name] = input.value; announce(`${product().fields[input.name].label}: ${product().fields[input.name].options.find(([value]) => value === input.value)[1]}. Resumen actualizado.`); }
    if (input.id === 'size-advice') { state().sizeAdvice = input.checked; document.getElementById('size-distribution').hidden = input.checked; document.getElementById('size-advice-total').hidden = !input.checked; announce(input.checked ? 'Talles con asesoramiento. Podés indicar una cantidad aproximada o dejarla por definir.' : 'Podés repartir las prendas por talle.'); }
    if (input.id === 'measure-advice') { state().measureAdvice = input.checked; document.getElementById('measure-inputs').hidden = input.checked; announce(input.checked ? 'Medidas por definir con asesoramiento.' : 'Podés indicar ancho y alto en centímetros.'); }
    if (input.id === 'quantity-unknown') { state().quantityUnknown = input.checked; document.getElementById('total-field').hidden = input.checked; announce(input.checked ? 'Cantidad por definir con asesoramiento.' : 'Podés indicar la cantidad.'); }
    updateSummary();
  });

  root.addEventListener('input', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (input.dataset.size) state().sizes[input.dataset.size] = input.value;
    else if (input.dataset.value) state()[input.dataset.value] = input.value;
    else return;
    input.removeAttribute('aria-invalid');
    const error = document.getElementById('step-error');
    if (error) error.hidden = true;
    updateSummary();
    announce('Resumen de ejemplo actualizado.');
  });

  function selectExample(focus) {
    const hash = location.hash.slice(1);
    // Los enlaces a secciones internas no cambian el producto activo.
    if (hash === 'remeras' || hash === 'lonas') { active = hash; render(focus); }
    else if (!root.children.length) render(false);
  }
  window.addEventListener('hashchange', () => selectExample(true));
  selectExample(false);
})();
