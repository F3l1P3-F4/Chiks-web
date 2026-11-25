// Una pestaña CDP aislada. Reutiliza F04; sólo datos sintéticos y sin envíos.
import fs from 'node:fs/promises';
const support=await fs.readFile(new URL('./test-f04-integration.mjs',import.meta.url),'utf8');
const boundary=support.indexOf('const a=await new Page().init()');
if(boundary<0)throw Error('No se encontró el soporte F04.');
const prefix=support.slice(0,boundary).replace('docs/f04-final','docs/r5-ux02');
process.env.F04_CDP_URL??='http://127.0.0.1:9372';
async function verify(Page,base,dir){
 const page=await new Page().init(),results=[];
 const r='guiada-remeras-personalizadas-ficha',l='guiada-lonas-ficha';
 const shirt='/productos/indumentaria/remeras-personalizadas',lona='/productos/ficha/lonas';
 const key='las-chikas-design:consulta:v1';let first,second,lonaId;
 const val=id=>page.eval(`document.getElementById('${id}').value`);
 const next=p=>page.click('#'+p+'-next');
 async function load(route,p){await page.goto(route);await page.wait(`!!document.getElementById('${p}-next')`);}
 async function edit(id,p){await page.click(`li[data-selection-key="${id}"] a[href*="#configuracion="]`);await page.wait(`!!document.getElementById('${p}-next')`);}
 async function test(name,run){try{const evidence=await run();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log(name+': correcto');}catch(error){results.push({name,passed:false,error:String(error)});throw error;}finally{await fs.writeFile(path.join(dir,'resultados.json'),JSON.stringify(results,null,2)+'\n');}}
 async function layouts(p,column,name){
  const evidence=[];
  for(const width of [390,1440]){
   await page.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
   const info=await page.eval(`(()=>{const g=document.querySelector('[data-${column}-column=gallery]'),f=g.parentElement.children[1],s=g.parentElement.children[2],box=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,bottom:b.bottom}};return{g:box(g),f:box(f),s:box(s),dom:!!(g.compareDocumentPosition(f)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(f.compareDocumentPosition(s)&Node.DOCUMENT_POSITION_FOLLOWING),count:[...document.querySelectorAll('h2')].filter(e=>e.textContent==='Tu selección').length,overflow:document.documentElement.scrollWidth>innerWidth}})()`);
   assert(info.dom&&!info.overflow);assert.equal(info.count,1);if(width===390){assert(info.f.y>=info.g.bottom-1);assert(info.s.y>=info.f.bottom-1);}else{assert(info.f.x>info.g.x);assert(Math.abs(info.s.x-info.g.x)<2);}
   await page.eval(`document.getElementById('${p}-next').focus();true`);await page.key('Tab',9);assert(await page.eval('document.activeElement.checkVisibility()'));
   await page.eval("Promise.all([...document.querySelectorAll('main img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{})})).then(()=>true)");
   assert(await page.eval("[...document.querySelectorAll('main img')].every(i=>i.complete&&i.naturalWidth>0)"));
   await page.shot(name+'-'+width);evidence.push({width,...info});
  }
  return evidence;
 }
 async function message(){await page.fill('#cliente-fullName','Cliente UX02 de prueba');await page.fill('#cliente-phone','+1 202 555 0199');await page.text('Revisar solicitud');await page.wait("!!document.getElementById('resumen-solicitud-texto')");return val('resumen-solicitud-texto');}
 try{
  await page.goto('/mi-consulta');
  await page.eval("localStorage.setItem('las-chikas-design:consulta:v1',JSON.stringify({version:1,items:[{id:'tazas',name:'Tazas',path:'/productos/ficha/tazas',quantity:30,notes:'Selección anterior R4'}]}));true");
  if(process.argv.includes('--before')){for(const width of [390,1440]){
   for(const [name,route] of [['consulta','/mi-consulta'],['remeras','/productos/indumentaria/remeras-personalizadas'],['lonas','/productos/ficha/lonas']]){
    await page.goto(route,width);await page.shot('antes-'+name+'-'+width);
   }
  }return;}
  if(process.argv.includes('--limit-only')){
   const limitItem={id:'remeras-personalizadas',name:'Remeras Personalizadas',path:shirt,quantity:40,notes:'Prueba de límite técnico',configurationId:'cfg-limite-ux02',configuration:{version:1,kind:'remeras',source:'confirmed',choices:{},sizes:Array.from({length:40},(_,i)=>({id:'limite-'+i,label:'Referencia '+i,quantity:1,requested:true})),advice:[]}};
   await page.eval(`localStorage.setItem('${key}',JSON.stringify({version:1,items:[${JSON.stringify(limitItem)}]}));true`);await load(shirt+'#configuracion=cfg-limite-ux02',r);await next(r);
   assert(await page.eval(`document.getElementById('${r}-reference-size-S').disabled&&document.getElementById('${r}-add-size').disabled`));
   await page.click('button[aria-label="Quitar talle solicitado 40"]');assert(!await page.eval(`document.getElementById('${r}-reference-size-S').disabled`));await page.click('#'+r+'-reference-size-S');await page.fill('input[id*="-size-solicitado-"]',1);
   assert(await page.eval(`document.getElementById('${r}-reference-size-M').disabled&&!document.getElementById('${r}-reference-size-S').disabled`));await page.click('#'+r+'-distribute');assert.equal(await val(r+'-quantity'),'40');
   await fs.writeFile(path.join(dir,'limite-talles.json'),JSON.stringify({passed:true,rows:40,total:40})+'\n');console.log('Límite técnico de 40 filas, selección y total conservados: correcto');return;
  }
  const legacy={id:'remeras-personalizadas',name:'Remeras Personalizadas',path:shirt,quantity:7,notes:'Notas anteriores\n  completas',configurationId:'cfg-anterior-ux02',configuration:{version:1,kind:'remeras',source:'confirmed',choices:{},sizes:[{id:'especial-anterior',label:'Especial',quantity:7,requested:true}],requests:{model:'Modelo anterior libre',material:'Material anterior libre'},advice:[]}};
  await page.eval(`(()=>{const data=JSON.parse(localStorage.getItem('${key}'));data.items.push(${JSON.stringify(legacy)});localStorage.setItem('${key}',JSON.stringify(data));return true})()`);await page.goto('/mi-consulta');
  await test('Mi consulta blanca: contraer conserva formularios, borradores y estado accesible',async()=>{
   assert.equal(await page.eval("getComputedStyle(document.getElementById('consulta-panel')).backgroundColor"),'rgb(255, 255, 255)');
   await page.fill('#cliente-fullName','Borrador de cliente');await page.fill('#observaciones-tazas','Borrador de observaciones');
   await page.eval("window.__customerField=document.getElementById('cliente-fullName');window.__notesField=document.getElementById('observaciones-tazas');document.getElementById('consulta-panel-toggle').focus();true");
   const raw=await page.eval(`localStorage.getItem('${key}')`);await page.key('Enter',13);
   assert(!await page.eval("document.getElementById('consulta-panel').open"));assert(!await page.eval("document.getElementById('cliente-fullName').checkVisibility()"));
   const ax=await page.send('Accessibility.getFullAXTree');assert(ax.nodes.some(n=>n.name?.value?.includes('Productos y datos de tu consulta')&&n.properties?.some(p=>p.name==='expanded'&&p.value.value===false)));
   await page.key('Tab',9);assert(!await page.eval("!!document.activeElement.closest('#consulta-panel')"));assert(await page.eval('document.activeElement.checkVisibility()'));
   await page.eval("document.getElementById('consulta-panel-toggle').focus();true");await page.key('Enter',13);
   assert(await page.eval("window.__customerField===document.getElementById('cliente-fullName')&&window.__notesField===document.getElementById('observaciones-tazas')"));
   assert.equal(await val('cliente-fullName'),'Borrador de cliente');assert.equal(await val('observaciones-tazas'),'Borrador de observaciones');assert.equal(await page.eval(`localStorage.getItem('${key}')`),raw);
  });
  await load(shirt,r);
  await test('Remeras: elegir tarjetas, asesoramiento y foco sin escribir modelo/material',async()=>{
   assert(!await page.eval(`!!document.getElementById('${r}-request-model')`));await page.click('#'+r+'-preference-model-recto');await page.key('ArrowRight',39);assert(await page.eval(`document.getElementById('${r}-preference-model-amplio').checked`));
   await page.key('ArrowLeft',37);assert(await page.eval(`document.getElementById('${r}-preference-model-recto').checked`));assert(await page.eval("getComputedStyle(document.activeElement.closest('label')).outlineStyle!=='none'"));
   await page.click('#'+r+'-preference-material-asesoramiento');assert(await page.eval(`document.getElementById('${r}-summary').textContent.includes('Material')`));await page.click('#'+r+'-preference-material-algodon');
   assert(await page.eval(`document.getElementById('${r}-summary').textContent.includes('Corte recto')&&document.getElementById('${r}-summary').textContent.includes('Algodón')`));
  });
  await test('Remeras: composición, selección visible e imágenes a 390/1440',()=>layouts(r,'v10','remeras'));
  await test('Remeras R5.1: 20 → talles 30 → desactivar conserva 30 y reactiva las filas',async()=>{
   await next(r);await page.fill('#'+r+'-quantity',20);await page.click('#'+r+'-distribute');
   assert.equal(await page.eval("[...document.querySelectorAll('label')].filter(e=>/repartir las cantidades|Distribuir cantidades por talle/.test(e.textContent)).length"),1);
   await page.click('#'+r+'-reference-size-S');await page.click('#'+r+'-reference-size-M');
   const ids=await page.eval("[...document.querySelectorAll('input[id*=\"-size-solicitado-\"]')].map(e=>e.id)");assert.equal(ids.length,2);
   assert.equal(await val(ids[0]),'');await page.fill('#'+ids[0],15);await page.fill('#'+ids[1],15);await page.click('#'+r+'-distribute');assert.equal(await val(r+'-quantity'),'30');
   await page.click('#'+r+'-distribute');assert.equal(await val(ids[0]),'15');await page.fill('#'+ids[1],'');await next(r);assert.equal(await page.eval('document.activeElement.id'),ids[1]);
   await page.click('#'+r+'-distribute');assert.equal(await val(r+'-quantity'),'30');await page.click('#'+r+'-distribute');await page.fill('#'+ids[1],15);
   await page.shot('remeras-talles-1440');await next(r);await page.click('#'+r+'-technique-dtf');await page.click('#'+r+'-placement-frente');await page.click('#'+r+'-placement-espalda');await page.click('#'+r+'-color-azul-francia');await page.fill('#'+r+'-notes','Notas de selección visual\n  conservar espacios');await next(r);await page.text('Solicitar presupuesto');await page.wait("!!document.getElementById('cliente-fullName')");
   const item=(await page.items()).find(i=>i.notes.startsWith('Notas de selección'));first=item.configurationId;assert.equal(item.quantity,30);assert.equal(item.configuration.requests.model,'Corte recto');assert.equal(item.configuration.requests.material,'Algodón');assert.equal(item.configuration.placements.length,2);assert.equal(item.configuration.sizes.length,2);
  });
  await load(lona,l);
  await test('Lonas: materiales solicitados y uso seleccionable, sin texto obligatorio',async()=>{
   await page.click('#'+l+'-material-frontlit');await page.click('#'+l+'-preference-use-exterior');assert(!await page.eval(`!!document.getElementById('${l}-request-use')`));
  });
  await test('Lonas: composición e imágenes a 390/1440',()=>layouts(l,'lonas','lonas'));
  await test('Lonas R5.1: medidas exclusivas, borrador recuperable y terminación seleccionable',async()=>{
   await next(l);await page.fill('#'+l+'-quantity',2);await page.fill('#'+l+'-width','-1');await next(l);assert.equal(await page.eval('document.activeElement.id'),l+'-width');
   await page.fill('#'+l+'-width','150,5');await page.fill('#'+l+'-height',200);await page.click('#'+l+'-measure-advice');assert(!await page.eval(`!!document.getElementById('${l}-width')`));
   await page.click('#'+l+'-measure-known');assert.equal(await val(l+'-width'),'150,5');await page.click('#'+l+'-measure-advice');await next(l);
   await page.click('#'+l+'-preference-finish-ojales');await page.click('#'+l+'-design-status-preparado');await page.fill('#'+l+'-notes','Lona con medidas por asesorar');await page.shot('lonas-terminacion-1440');await next(l);await page.text('Solicitar presupuesto');await page.wait("!!document.getElementById('cliente-fullName')");
   const item=(await page.items()).find(i=>i.id==='lonas');lonaId=item.configurationId;assert(!item.configuration.measurements);assert(item.configuration.advice.includes('measurements'));assert.equal(item.configuration.lonaRequest.use,'Exterior');assert.equal(item.configuration.lonaRequest.finish,'Con ojales');
  });
  await test('F04: mensaje único, copia exacta y ausencia de dimensiones inactivas',async()=>{
   const text=await message();for(const expected of ['Corte recto','Algodón','S: 15','M: 15','Cantidad total: 30','Frente y Espalda','DTF','Exterior','Con ojales','Medidas','Selección anterior R4','Modelo anterior libre'])assert(text.includes(expected),expected);
   assert(!text.includes('150.5'));await page.text('Copiar resumen completo');assert.equal(await page.eval('window.__copied'),text);assert(!await page.eval("!!document.querySelector('a[href*=\"wa.me\"]')"));assert(!await page.eval(`localStorage.getItem('${key}').includes('Cliente UX02')`));
  });
  await test('Recarga y edición recuperan tarjetas, talles, color y frente/espalda',async()=>{
   const token=await page.eval('window.__pageToken');await page.send('Page.reload',{ignoreCache:true});await page.wait(`window.__pageToken!==${JSON.stringify(token)}&&!!document.getElementById('cliente-fullName')`);
   await edit(first,r);assert(await page.eval(`document.getElementById('${r}-preference-model-recto').checked&&document.getElementById('${r}-preference-material-algodon').checked`));await next(r);assert(await page.eval(`document.getElementById('${r}-reference-size-S').getAttribute('aria-pressed')==='true'`));
   await next(r);assert(await page.eval(`document.getElementById('${r}-placement-frente').checked&&document.getElementById('${r}-placement-espalda').checked&&document.getElementById('${r}-color-azul-francia').checked`));
   assert.equal(await val(r+'-notes'),'Notas de selección visual\n  conservar espacios');await next(r);await page.text('Guardar cambios');await page.wait("!!document.getElementById('cliente-fullName')");
   await edit(lonaId,l);assert(await page.eval(`document.getElementById('${l}-preference-use-exterior').checked`));await next(l);assert(await page.eval(`document.getElementById('${l}-measure-advice').checked`));await page.click('#'+l+'-measure-known');await page.fill('#'+l+'-width',180);await page.fill('#'+l+'-height',250);await next(l);assert(await page.eval(`document.getElementById('${l}-preference-finish-ojales').checked`));await next(l);await page.text('Guardar cambios');await page.wait("!!document.getElementById('cliente-fullName')");assert((await message()).includes('180 × 250 cm'));
  });
  await test('Compatibilidad de textos y talles anteriores; cancelar conserva el registro',async()=>{
   await edit(legacy.configurationId,r);assert.equal(await val(r+'-request-model'),legacy.configuration.requests.model);assert.equal(await val(r+'-request-material'),legacy.configuration.requests.material);await next(r);assert.equal(await page.eval("document.querySelector('input[id*=\"-label-especial\"]').value"),'Especial');await page.fill('input[id*="-size-especial"]',9);
   await page.text('Cancelar edición y volver a Mi consulta');await page.wait("!!document.getElementById('cliente-fullName')");assert.deepEqual((await page.items()).find(i=>i.configurationId===legacy.configurationId),legacy);
  });
  await test('Múltiples configuraciones no se sobrescriben; edición y eliminación por identidad',async()=>{
   await load(shirt,r);await page.click('#'+r+'-preference-model-amplio');await page.click('#'+r+'-preference-material-poliester');await next(r);await page.fill('#'+r+'-quantity',5);await next(r);await next(r);await page.text('Solicitar presupuesto');await page.wait("!!document.getElementById('cliente-fullName')");
   const item=(await page.items()).find(i=>i.id==='remeras-personalizadas'&&i.quantity===5);second=item.configurationId;assert.equal((await page.items()).find(i=>i.configurationId===first).quantity,30);
   await edit(second,r);await page.click('#'+r+'-preference-model-recto');await next(r);await next(r);await next(r);await page.text('Guardar cambios');await page.wait("!!document.getElementById('cliente-fullName')");assert.equal((await page.items()).find(i=>i.configurationId===second).configuration.requests.model,'Corte recto');
   await page.text('Quitar producto',`li[data-selection-key="${second}"]`);await page.wait(`!document.querySelector('li[data-selection-key="${second}"]')`);assert((await page.items()).some(i=>i.configurationId===first));assert((await page.items()).some(i=>i.configurationId===lonaId));
  });
  await test('Mi consulta abierta/contraída a 390/1440, sin pérdidas ni desbordes',async()=>{
   const before=await page.items();const text=await message();const measurements=[];
   for(const width of [390,1440]){
    await page.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});assert(await page.eval('document.documentElement.scrollWidth<=innerWidth'));
    if(width===1440)assert.equal(await page.eval("getComputedStyle(document.querySelector('li[data-selection-key] > dl > div')).display"),'grid');
    const expanded=await page.eval("document.getElementById('consulta-panel').getBoundingClientRect().height");await page.shot('consulta-abierta-'+width);
    await page.click('#consulta-panel-toggle');assert(!await page.eval("document.getElementById('consulta-panel').open"));
    const collapsed=await page.eval("document.getElementById('consulta-panel').getBoundingClientRect().height");assert(collapsed<expanded);measurements.push({width,expanded,collapsed});
    await page.shot('consulta-contraida-'+width);await page.click('#consulta-panel-toggle');assert.equal(await val('resumen-solicitud-texto'),text);
   }
   assert.deepEqual(await page.items(),before);return measurements;
  });
  assert.deepEqual(page.errors,[]);
 }finally{await page.close();if(server)await new Promise(r=>server.close(r));}
}
try{await import('data:text/javascript;base64,'+Buffer.from(prefix+'\nawait ('+verify.toString()+')(Page,base,dir);').toString('base64'));}
catch(error){console.error('R5-UX02:',error.message);process.exitCode=1;}
