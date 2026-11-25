// Reutiliza el navegador CDP de F04; sólo datos sintéticos y dos capturas solicitadas.
import fs from 'node:fs/promises';
const existing = await fs.readFile(new URL('./test-f04-integration.mjs', import.meta.url), 'utf8');
const boundary = existing.indexOf('const a=await new Page().init()');
if (boundary < 0) throw Error('No se encontró el soporte de navegador de F04.');
const prefix = existing.slice(0, boundary).replace('docs/f04-final', 'docs/v11');
process.env.F04_CDP_URL ??= 'http://127.0.0.1:9366';
async function validate(Page, origin, base, dir) {
  const page = await new Page().init();
  const product = '/productos/indumentaria/remeras-personalizadas';
  const p = 'guiada-remeras-personalizadas-ficha';
  const key = 'las-chikas-design:consulta:v1';
  const results = [];
  async function test(name, action) { await action();results.push({name,passed:true});console.log(name+': correcto'); }
  async function next() { await page.click('#'+p+'-next'); }
  async function query() { await page.click('header a[href$="/mi-consulta"]');await page.wait("!!document.getElementById('cliente-fullName')"); }
  async function edit(id) { await page.click(`li[data-selection-key="${id}"] a[href*="#configuracion="]`);await page.wait(`!!document.getElementById('${p}-preference-model-recto')`); }
  let id;
  try {
    await page.goto('/mi-consulta');await page.eval(`localStorage.setItem('${key}',JSON.stringify({version:1,items:[]}))`);await page.goto(product);await page.wait(`!!document.getElementById('${p}-preference-model-recto')`);
    await test('Modelo y material libres mediante Otra preferencia; asesoramiento',async()=>{
      await page.click('#'+p+'-preference-model-otra');await page.fill('#'+p+'-request-model','Corte amplio solicitado');await page.click('#'+p+'-preference-material-otra');await page.fill('#'+p+'-request-material','Tela suave a confirmar');await page.click('#'+p+'-advice-general');
      assert(!await page.eval("document.querySelector('main').innerText.includes('opciones pendientes de confirmación')"));
    });
    await test('Talles propios, cantidades positivas y total automático',async()=>{
      await next();await page.fill('#'+p+'-quantity',20);await page.click('#'+p+'-distribute');await next();assert.equal(await page.eval('document.activeElement.id'),p+'-add-size');await page.click('#'+p+'-add-size');
      await page.fill('input[id*="-label-solicitado-"]','Referencia A');await page.fill('input[id*="-size-solicitado-"]',8);await page.click('#'+p+'-add-size');
      const labels=await page.eval("[...document.querySelectorAll('input[id*=\"-label-solicitado-\"]')].map(e=>e.id)");const quantities=await page.eval("[...document.querySelectorAll('input[id*=\"-size-solicitado-\"]')].map(e=>e.id)");
      await page.fill('#'+labels[1],'Referencia B');await page.fill('#'+quantities[1],12);await page.fill('#'+p+'-request-sizesNotes','Confirmar equivalencias de talles');
      await page.click('#'+p+'-distribute');assert.equal(await page.eval(`document.getElementById('${p}-quantity').value`),'20');await page.click('#'+p+'-distribute');await next();
    });
    await test('Tarjetas de técnica/color, asesoramiento y frente más espalda',async()=>{
      await page.click('#'+p+'-technique-vinilo');await page.click('#'+p+'-technique-asesoramiento');assert(await page.eval(`document.getElementById('${p}-technique-asesoramiento').checked`));await page.click('#'+p+'-technique-dtf');
      await page.click('#'+p+'-placement-frente');await page.click('#'+p+'-placement-espalda');
      for(const color of ['blanco','rojo','negro','amarillo','gris-shogin','gris-oscuro','azul-oscuro','azul-francia','naranja','verde'])await page.click('#'+p+'-color-'+color);
      await page.click('#'+p+'-color-asesoramiento');await page.click('#'+p+'-color-azul-francia');await page.fill('#'+p+'-notes','Diseño del equipo. Consultar ubicación especial.\nConservar este texto.');
      const summary=await page.eval(`document.getElementById('${p}-summary').innerText`);for(const value of ['Corte amplio solicitado','Tela suave a confirmar','20','Referencia A: 8','Referencia B: 12','DTF','Frente y Espalda','Azul Francia'])assert(summary.includes(value),value);
      assert(!summary.includes('Personalización ·'));assert(await page.eval("document.querySelector('main').innerText.includes('Muestras digitales orientativas')"));
    });
    await test('V10.1: celular y escritorio, controles por teclado, dos capturas',async()=>{
      for(const width of [390,1440]){
        await page.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
        const positions=await page.eval("(()=>{const g=document.querySelector('[data-v10-column=gallery]');const f=g.parentElement.children[1],s=g.parentElement.children[2];const r=e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,bottom:b.bottom}};return{g:r(g),f:r(f),s:r(s),summaries:[...document.querySelectorAll('main h2')].filter(e=>e.textContent==='Tu selección').length,overflow:document.documentElement.scrollWidth>innerWidth,order:!!(g.compareDocumentPosition(f)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(f.compareDocumentPosition(s)&Node.DOCUMENT_POSITION_FOLLOWING)}})()");
        assert(positions.order&&!positions.overflow);assert.equal(positions.summaries,1);if(width<768){assert(positions.f.y>=positions.g.bottom);assert(positions.s.y>=positions.f.bottom);}else{assert(positions.f.x>positions.g.x);assert(Math.abs(positions.s.x-positions.g.x)<2);}
        await page.eval(`document.getElementById('${p}-placement-frente').focus()`);await page.key('Tab',9);assert(await page.eval("document.activeElement.checkVisibility()"));assert(await page.eval("getComputedStyle(document.activeElement).outlineStyle!=='none'||getComputedStyle(document.activeElement.closest('label')).outlineStyle!=='none'"));
        await page.shot('remeras-'+width);
      }
    });
    await test('Guardar, recargar y recuperar todas las elecciones en Mi consulta',async()=>{
      await next();await page.text('Agregar a mi consulta');await page.wait(`JSON.parse(localStorage.getItem('${key}')).items.length===1`);const item=(await page.items())[0];id=item.configurationId;
      assert.equal(item.quantity,20);assert.equal(item.configuration.sizes.length,2);assert.equal(item.configuration.choices.technique.id,'dtf');assert.equal(item.configuration.placements.length,2);assert(!item.configuration.advice.includes('color'));assert(!item.configuration.advice.includes('customization'));
      await query();const token=await page.eval('window.__pageToken');await page.send('Page.reload',{ignoreCache:true});await page.wait(`window.__pageToken!==${JSON.stringify(token)}&&!!document.getElementById('cliente-fullName')`);await edit(id);
      assert.equal(await page.eval(`document.getElementById('${p}-request-model').value`),'Corte amplio solicitado');await next();assert.equal(await page.eval("document.querySelector('input[id*=\"-label-solicitado-\"]').value"),'Referencia A');await next();assert(await page.eval(`document.getElementById('${p}-placement-frente').checked&&document.getElementById('${p}-placement-espalda').checked&&document.getElementById('${p}-technique-dtf').checked&&document.getElementById('${p}-color-azul-francia').checked`));
    });
    await test('Editar sin duplicar y generar/copiar un único mensaje completo',async()=>{
      await page.click('#'+p+'-technique-vinilo');await page.fill('#'+p+'-notes','Texto editado de V11');await next();await page.text('Guardar cambios');await page.wait("!!document.getElementById('cliente-fullName')");assert.equal((await page.items()).length,1);assert.equal((await page.items())[0].configurationId,id);
      await page.fill('#cliente-fullName','Cliente V11 de prueba');await page.fill('#cliente-phone','+1 202 555 0199');await page.text('Revisar solicitud');await page.wait("!!document.getElementById('resumen-solicitud-texto')");const message=await page.eval("document.getElementById('resumen-solicitud-texto').value");
      for(const value of ['Modelo solicitado: Corte amplio solicitado','Material solicitado: Tela suave a confirmar','Cantidad total: 20','Referencia A: 8 · Referencia B: 12','Confirmar equivalencias de talles','Color: Azul Francia','Técnica de personalización: Estampa vinilo','Ubicación del diseño: Frente y Espalda','Texto editado de V11','Cliente V11 de prueba'])assert(message.includes(value),value);
      await page.text('Copiar resumen completo');assert.equal(await page.eval('window.__copied'),message);await fs.writeFile(path.join(dir,'mensaje-prueba.txt'),message+'\n');
    });
    assert.deepEqual(page.errors,[]);await fs.writeFile(path.join(dir,'resultados.json'),JSON.stringify(results,null,2)+'\n');
  } finally { await page.close();if(server)await new Promise(r=>server.close(r)); }
}
try { await import('data:text/javascript;base64,'+Buffer.from(prefix+'\nawait ('+validate.toString()+')(Page,origin,base,dir);').toString('base64')); }
catch(error) { console.error('V11:',error.message);process.exitCode=1; }
