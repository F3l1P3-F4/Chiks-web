// Prueba dirigida: una página, un navegador, dos capturas. Reutiliza CDP de F04.
import fs from 'node:fs/promises';
const existing=await fs.readFile(new URL('./test-f04-integration.mjs',import.meta.url),'utf8');
const boundary=existing.indexOf('const a=await new Page().init()');
if(boundary<0)throw Error('No se encontró el soporte de F04.');
const prefix=existing.slice(0,boundary).replace('docs/f04-final','docs/v12');
process.env.F04_CDP_URL??='http://127.0.0.1:9368';
async function verify(Page,origin,base,dir){
  const page=await new Page().init(),results=[];const route='/productos/ficha/lonas',p='guiada-lonas-ficha',key='las-chikas-design:consulta:v1';let first,second;
  async function test(name,run){await run();results.push({name,passed:true});console.log(name+': correcto');}
  async function next(){await page.click('#'+p+'-next');}
  async function query(){await page.click('header a[href$="/mi-consulta"]');await page.wait("!!document.getElementById('cliente-fullName')");}
  async function edit(id){await page.click(`li[data-selection-key="${id}"] a[href*="#configuracion="]`);await page.wait(`!!document.getElementById('${p}-material-frontlit')`);}
  try{
    await page.goto('/mi-consulta');await page.eval(`localStorage.setItem('${key}',JSON.stringify({version:1,items:[{id:'tazas',name:'Tazas',path:'/productos/ficha/tazas',quantity:30,notes:'Consulta anterior'}]}))`);
    await page.goto('/productos/indumentaria/remeras-personalizadas');await page.wait("!!document.getElementById('guiada-remeras-personalizadas-ficha-preference-model-recto')");
    await test('Regresión mínima de Remeras V11: guardar 20 y conservar controles',async()=>{
      await page.click('#guiada-remeras-personalizadas-ficha-preference-model-otra');await page.fill('#guiada-remeras-personalizadas-ficha-request-model','Modelo solicitado V11');await page.click('#guiada-remeras-personalizadas-ficha-next');await page.fill('#guiada-remeras-personalizadas-ficha-quantity',20);await page.click('#guiada-remeras-personalizadas-ficha-next');await page.click('#guiada-remeras-personalizadas-ficha-technique-dtf');await page.click('#guiada-remeras-personalizadas-ficha-placement-frente');await page.click('#guiada-remeras-personalizadas-ficha-next');await page.text('Solicitar presupuesto');await page.wait("!!document.getElementById('cliente-fullName')");assert.equal((await page.items()).find(i=>i.id==='remeras-personalizadas').quantity,20);
    });
    await page.goto(route);await page.wait(`!!document.getElementById('${p}-material-frontlit')`);
    await test('Entrada directa, materiales solicitados y uso libre sin demostración',async()=>{
      const text=await page.eval("document.querySelector('main').innerText");for(const forbidden of ['Prueba aislada','Demostración aislada','Volver a consulta comercial','Tus configuraciones de este producto','Nueva configuración','opciones pendientes de confirmación','Información del producto'])assert(!text.includes(forbidden),forbidden);
      for(const id of ['frontlit','blackout','mesh'])await page.click('#'+p+'-material-'+id);await page.click('#'+p+'-material-asesoramiento');await page.click('#'+p+'-material-frontlit');await page.click('#'+p+'-preference-use-otra');await page.fill('#'+p+'-request-use','Cartel para evento solicitado');await next();
    });
    await test('Dimensiones positivas en cm, cantidad y esquema dinámico',async()=>{
      await page.fill('#'+p+'-quantity',0);await next();assert.equal(await page.eval('document.activeElement.id'),p+'-quantity');await page.fill('#'+p+'-quantity',2);await page.fill('#'+p+'-width','-1');await next();assert.equal(await page.eval('document.activeElement.id'),p+'-width');await page.fill('#'+p+'-width','150,5');await page.fill('#'+p+'-height','200');await page.fill('#'+p+'-request-measurementsNotes','Revisar medidas al colocar');await page.click('#'+p+'-measure-advice');assert(!await page.eval(`!!document.getElementById('${p}-width')`));await page.click('#'+p+'-measure-known');assert.equal(await page.eval(`document.getElementById('${p}-width').value`),'150,5');assert(await page.eval("document.querySelector('main figure').textContent.includes('150.5 × 200 cm')"));await next();
    });
    await test('Terminación libre, diseño y resumen único',async()=>{
      await page.click('#'+p+'-preference-finish-otra');await page.fill('#'+p+'-request-finish','Terminación a consultar según colocación');await page.click('#'+p+'-design-status-preparado');await page.fill('#'+p+'-notes','Observaciones V12\nConservar espacios  ');
      const text=await page.eval(`document.getElementById('${p}-summary').innerText`);for(const value of ['Material solicitado','Frontlit','Cartel para evento solicitado','150.5 × 200 cm','Terminación a consultar','Tengo un diseño preparado','Observaciones V12'])assert(text.includes(value),value);
    });
    await test('390 y 1440: orden DOM/visual, teclado, sin desbordes; dos capturas',async()=>{
      for(const width of [390,1440]){
        await page.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
        const v=await page.eval("(()=>{const g=document.querySelector('[data-lonas-column=gallery]');const f=g.parentElement.children[1],s=g.parentElement.children[2];const r=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,bottom:b.bottom}};return{g:r(g),f:r(f),s:r(s),dom:!!(g.compareDocumentPosition(f)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(f.compareDocumentPosition(s)&Node.DOCUMENT_POSITION_FOLLOWING),count:[...document.querySelectorAll('main h2')].filter(e=>e.textContent==='Tu selección').length,overflow:document.documentElement.scrollWidth>innerWidth}})()");assert(v.dom&&!v.overflow);assert.equal(v.count,1);if(width<768){assert(v.f.y>=v.g.bottom);assert(v.s.y>=v.f.bottom);}else{assert(v.f.x>v.g.x);assert(Math.abs(v.s.x-v.g.x)<2);}
        await page.eval(`document.getElementById('${p}-next').focus()`);await page.key('Tab',9);assert(await page.eval('document.activeElement.checkVisibility()'));await page.shot('lonas-'+width);
      }
    });
    await test('Guardar, recargar y recuperar todas las características',async()=>{
      await next();await page.text('Agregar a mi consulta');await page.wait(`JSON.parse(localStorage.getItem('${key}')).items.some(i=>i.id==='lonas')`);first=(await page.items()).find(i=>i.id==='lonas').configurationId;await query();const token=await page.eval('window.__pageToken');await page.send('Page.reload',{ignoreCache:true});await page.wait(`window.__pageToken!==${JSON.stringify(token)}&&!!document.getElementById('cliente-fullName')`);await edit(first);assert.equal(await page.eval(`document.getElementById('${p}-request-use').value`),'Cartel para evento solicitado');assert(await page.eval(`document.getElementById('${p}-material-frontlit').checked`));await next();assert.equal(await page.eval(`document.getElementById('${p}-width').value`),'150.5');await next();assert.equal(await page.eval(`document.getElementById('${p}-request-finish').value`),'Terminación a consultar según colocación');await page.text('Volver a Mi consulta');await page.wait("!!document.getElementById('cliente-fullName')");
    });
    await test('Cancelar no sobrescribe; editar actualiza sólo su identidad',async()=>{
      const before=await page.items();await edit(first);await next();await page.fill('#'+p+'-quantity',99);await page.text('Cancelar edición y volver a Mi consulta');await page.wait("!!document.getElementById('cliente-fullName')");assert.deepEqual(await page.items(),before);await edit(first);await next();await page.fill('#'+p+'-quantity',4);await page.fill('#'+p+'-width',180);await next();await next();await page.text('Guardar cambios');await page.wait("!!document.getElementById('cliente-fullName')");assert.equal((await page.items()).find(i=>i.configurationId===first).quantity,4);
    });
    await test('Segunda configuración independiente y mensaje único con Remeras y R4',async()=>{
      await page.goto(route);await page.wait(`!!document.getElementById('${p}-material-mesh')`);await page.click('#'+p+'-material-mesh');await next();await page.fill('#'+p+'-quantity',3);await page.fill('#'+p+'-width',90);await page.fill('#'+p+'-height',120);await next();await page.click('#'+p+'-preference-finish-otra');await page.fill('#'+p+'-request-finish','Consultar otra terminación');await next();await page.text('Solicitar presupuesto');await page.wait("!!document.getElementById('cliente-fullName')");const items=await page.items();second=items.find(i=>i.id==='lonas'&&i.configurationId!==first).configurationId;assert.equal(items.filter(i=>i.id==='lonas').length,2);assert.equal(items.find(i=>i.configurationId===first).quantity,4);
      await page.fill('#cliente-fullName','Cliente V12 de prueba');await page.fill('#cliente-phone','+1 202 555 0199');await page.text('Revisar solicitud');await page.wait("!!document.getElementById('resumen-solicitud-texto')");const message=await page.eval("document.getElementById('resumen-solicitud-texto').value");for(const value of ['Remeras Personalizadas','Modelo solicitado V11','DTF','Tazas','Cantidad: 30','Material solicitado: Frontlit','Material solicitado: Mesh','180 × 200 cm','90 × 120 cm','Configuración 1 de 2','Configuración 2 de 2','Observaciones V12','Cliente V12 de prueba'])assert(message.includes(value),value);await page.text('Copiar resumen completo');assert.equal(await page.eval('window.__copied'),message);assert(!await page.eval("!!document.querySelector('a[href*=\"wa.me\"]')"));await fs.writeFile(path.join(dir,'mensaje-prueba.txt'),message+'\n');
    });
    await test('Eliminar sólo una configuración',async()=>{await page.text('Quitar producto',`li[data-selection-key="${second}"]`);await page.wait(`!document.querySelector('li[data-selection-key="${second}"]')`);assert((await page.items()).some(i=>i.configurationId===first));assert.equal((await page.items()).filter(i=>i.id==='lonas').length,1);});
    assert.deepEqual(page.errors,[]);await fs.writeFile(path.join(dir,'resultados.json'),JSON.stringify(results,null,2)+'\n');
  }finally{await page.close();if(server)await new Promise(r=>server.close(r));}
}
try{await import('data:text/javascript;base64,'+Buffer.from(prefix+'\nawait ('+verify.toString()+')(Page,origin,base,dir);').toString('base64'));}catch(e){console.error('V12:',e.message);process.exitCode=1;}
