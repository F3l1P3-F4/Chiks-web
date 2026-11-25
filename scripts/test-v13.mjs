// V13: inventario desde el AST del catálogo; una pestaña aislada y soporte CDP de F04.
import fs from 'node:fs/promises';
import ts from 'typescript';
const source=ts.createSourceFile('catalogEntries.ts',await fs.readFile('src/data/catalogEntries.ts','utf8'),ts.ScriptTarget.Latest,true);
let inventory=[];
function visit(node){if(ts.isVariableDeclaration(node)&&node.name.getText(source)==='catalogEntries'){
 const object=ts.isSatisfiesExpression(node.initializer)?node.initializer.expression:node.initializer;
 inventory=object.properties.map(property=>({id:property.name.text,title:property.initializer.properties.find(p=>p.name.getText(source)==='title').initializer.text,category:property.initializer.properties.find(p=>p.name.getText(source)==='categorySlug').initializer.text,hasPhoto:property.initializer.properties.some(p=>p.name.getText(source)==='photo')})).filter(p=>!['remeras-personalizadas','lonas'].includes(p.id));
}ts.forEachChild(node,visit);}visit(source);
if(inventory.length!==21)throw Error('Se esperaban 21 fichas generales.');
const support=await fs.readFile(new URL('./test-f04-integration.mjs',import.meta.url),'utf8');
const boundary=support.indexOf('const a=await new Page().init()');if(boundary<0)throw Error('Falta soporte F04.');
const prefix=support.slice(0,boundary).replace('docs/f04-final','docs/v13');
process.env.F04_CDP_URL??='http://127.0.0.1:9373';
async function verify(Page,base,dir,inventory){
 const page=await new Page().init(),results=[],links=new Set(),expected=new Map();
 const key='las-chikas-design:consulta:v1',val=id=>page.eval(`document.getElementById('${id}').value`);
 async function test(name,run){try{const evidence=await run();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log(name+': correcto');}catch(error){results.push({name,passed:false,error:String(error)});throw error;}finally{await fs.writeFile(path.join(dir,'resultados.json'),JSON.stringify(results,null,2)+'\n');}}
 async function ready(id){await page.wait(`!!document.getElementById('cantidad-${id}')&&!document.getElementById('cantidad-${id}').disabled`);}
 async function query(){await page.click('header a[href$="/mi-consulta"]');await page.wait("!!document.getElementById('cliente-fullName')");}
 try{
  if(process.argv.includes('--before')){
   const measurements=[];
   for(const id of ['tazas','vidrieras'])for(const width of [390,1440]){
    await page.goto('/productos/ficha/'+id,width);await page.wait(`!!document.getElementById('cantidad-${id}')`);
    measurements.push({id,width,quantityTop:await page.eval(`document.getElementById('cantidad-${id}').getBoundingClientRect().top+scrollY`)});await page.shot('antes-'+id+'-'+width);
   }
   await fs.writeFile(path.join(dir,'antes.json'),JSON.stringify(measurements,null,2)+'\n');return;
  }
  await page.goto('/mi-consulta');await page.eval(`localStorage.setItem('${key}',JSON.stringify({version:1,items:[]}));true`);
  for(const [index,product] of inventory.entries())await test(product.id+': ficha, responsive, teclado y guardado',async()=>{
   await page.goto('/productos/ficha/'+product.id);await ready(product.id);
   assert.equal(await page.eval("document.querySelectorAll('main h1').length"),1);assert.equal(await page.eval("document.querySelector('main h1').textContent.trim()"),product.title);
   assert.equal(await page.eval("[...document.querySelectorAll('main h2')].filter(e=>e.textContent==='Prepará tu consulta').length"),1);
   assert(!await page.eval("document.querySelector('[data-product-facts]').open"));assert(!await page.eval("document.querySelector('main').innerText.includes('Datos pendientes de confirmación')"));
   const found=await page.eval("[...document.querySelectorAll('main a[href]')].map(e=>e.getAttribute('href'))");for(const href of found)if(href.startsWith(base+'/'))links.add(href.split('#')[0]);
   await page.eval("Promise.all([...document.querySelectorAll('main img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{})})).then(()=>true)");
   assert(await page.eval("[...document.querySelectorAll('main img')].every(i=>i.complete&&i.naturalWidth>0)"));
   const measurements=[];
   for(const width of [390,1440]){
    await page.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
    const info=await page.eval(`(()=>{const g=document.querySelector('[aria-label="Fotografías del producto"]'),f=document.querySelector('[data-general-consultation]'),q=document.getElementById('cantidad-${product.id}'),facts=document.querySelector('[data-product-facts]'),r=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y+scrollY,bottom:b.bottom+scrollY,width:b.width,height:b.height}};return{gallery:r(g),form:r(f),quantity:r(q),facts:r(facts),overflow:document.documentElement.scrollWidth>innerWidth,dom:!!(g.compareDocumentPosition(f)&Node.DOCUMENT_POSITION_FOLLOWING),labels:q.labels.length,white:getComputedStyle(f).backgroundColor}})()`);
    assert(!info.overflow&&info.dom);assert.equal(info.labels,1);assert.equal(info.white,'rgb(255, 255, 255)');assert(info.facts.y>=info.form.bottom-1);assert(info.gallery.width>250&&info.gallery.height>180);
    if(width===390)assert(info.form.y>=info.gallery.bottom);else{assert(info.form.x>info.gallery.x);assert(Math.abs(info.gallery.y-info.form.y)<2);}
    measurements.push({width,...info});
   }
   await page.eval(`document.getElementById('cantidad-${product.id}').focus();true`);await page.key('Tab',9);assert.equal(await page.eval('document.activeElement.id'),'observaciones-'+product.id);assert(await page.eval("getComputedStyle(document.activeElement).outlineStyle!=='none'"));
   const quantity=index+2,notes='V13 '+product.id+'\nConservar esta observación';await page.fill('#cantidad-'+product.id,quantity);await page.fill('#observaciones-'+product.id,notes);await page.text('Agregar a mi consulta');
   await page.wait(`JSON.parse(localStorage.getItem('${key}')).items.some(i=>i.id==='${product.id}'&&i.quantity===${quantity})`);expected.set(product.id,{quantity,notes});
   assert.equal((await page.items()).find(i=>i.id===product.id).notes,notes);
   if(['tazas','vidrieras','camperas'].includes(product.id))for(const width of [390,1440]){await page.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await page.shot(product.id+'-'+width);}
   return {category:product.category,photo:product.hasPhoto,measurements};
  });
  await test('Enlaces internos de las 21 fichas',async()=>{
   for(const href of links){const response=await fetch(origin+href);assert.equal(response.status,200,href);}return {checked:links.size};
  });
  await test('Mi consulta: las 21 selecciones y edición desde la ficha sin agregar primero',async()=>{
   await query();assert.equal((await page.items()).length,21);assert.equal(await page.eval("document.querySelectorAll('li[data-selection-key]').length"),21);
   await page.fill('#cliente-fullName','Cliente V13 de prueba');await page.fill('#cliente-phone','+1 202 555 0199');
   await page.click(`li[data-selection-key="tazas"] a[href="${base}/productos/ficha/tazas"]`);await ready('tazas');assert.equal(await val('cantidad-tazas'),String(expected.get('tazas').quantity));assert.equal(await val('observaciones-tazas'),expected.get('tazas').notes);
   const before=await page.items();await page.fill('#cantidad-tazas',0);await page.text('Solicitar presupuesto');assert.equal(await page.eval('document.activeElement.id'),'cantidad-tazas');assert.deepEqual(await page.items(),before);
   await page.fill('#cantidad-tazas',20);await page.fill('#observaciones-tazas','V13 tazas actualizadas');await page.text('Solicitar presupuesto');await page.wait("!!document.getElementById('cliente-fullName')");expected.set('tazas',{quantity:20,notes:'V13 tazas actualizadas'});assert.equal((await page.items()).filter(i=>i.id==='tazas').length,1);assert.equal((await page.items()).find(i=>i.id==='tazas').quantity,20);assert.equal(await val('cliente-fullName'),'Cliente V13 de prueba');
  });
  await test('Borrador descartado al volver; edición y eliminación desde Mi consulta',async()=>{
   await page.click(`li[data-selection-key="tazas"] a[href="${base}/productos/ficha/tazas"]`);await ready('tazas');await page.fill('#cantidad-tazas',99);await query();assert.equal((await page.items()).find(i=>i.id==='tazas').quantity,20);
   await page.fill('#cantidad-tazas',21);await page.text('Actualizar mi consulta','li[data-selection-key=tazas]');await page.wait(`JSON.parse(localStorage.getItem('${key}')).items.find(i=>i.id==='tazas').quantity===21`);expected.get('tazas').quantity=21;
   await page.text('Quitar producto','li[data-selection-key=gorras]');await page.wait("!document.querySelector('li[data-selection-key=gorras]')");assert.equal((await page.items()).length,20);
   await page.goto('/productos/ficha/gorras');await ready('gorras');await page.fill('#cantidad-gorras',expected.get('gorras').quantity);await page.fill('#observaciones-gorras',expected.get('gorras').notes);await page.text('Solicitar presupuesto');await page.wait("!!document.getElementById('cliente-fullName')");
  });
  await test('Recarga, mensaje único con 21 productos y copia exacta',async()=>{
   const token=await page.eval('window.__pageToken');await page.send('Page.reload',{ignoreCache:true});await page.wait(`window.__pageToken!==${JSON.stringify(token)}&&!!document.getElementById('cliente-fullName')`);
   const items=await page.items();assert.equal(items.length,21);for(const item of items)assert.deepEqual({quantity:item.quantity,notes:item.notes},expected.get(item.id));assert.equal(await val('cliente-fullName'),'');
   await page.fill('#cliente-fullName','Cliente V13 de prueba');await page.fill('#cliente-phone','+1 202 555 0199');await page.text('Revisar solicitud');await page.wait("!!document.getElementById('resumen-solicitud-texto')");const message=await val('resumen-solicitud-texto');
   for(const [id,{notes}] of expected){assert(message.includes(notes),id);}for(const product of inventory)assert(message.includes(product.title));await page.text('Copiar resumen completo');assert.equal(await page.eval('window.__copied'),message);assert(!await page.eval("!!document.querySelector('a[href*=\"wa.me\"]')"));assert(!await page.eval(`localStorage.getItem('${key}').includes('Cliente V13')`));
  });
  await test('Remeras y Lonas: controles aprobados y correcciones conservadas',async()=>{
   await page.goto('/productos/indumentaria/remeras-personalizadas');await page.wait("!!document.getElementById('guiada-remeras-personalizadas-ficha-preference-model-recto')");assert(!await page.eval("!!document.querySelector('[data-general-product]')"));
   await page.goto('/productos/ficha/lonas');await page.wait("!!document.getElementById('guiada-lonas-ficha-material-frontlit')");await page.click('#guiada-lonas-ficha-next');await page.click('#guiada-lonas-ficha-measure-advice');assert(!await page.eval("!!document.getElementById('guiada-lonas-ficha-width')"));assert(!await page.eval("!!document.querySelector('[data-general-product]')"));
  });
  assert.deepEqual(page.errors,[]);
 }finally{await page.close();if(server)await new Promise(r=>server.close(r));}
}
try{await import('data:text/javascript;base64,'+Buffer.from(prefix+'\nawait ('+verify.toString()+')(Page,base,dir,'+JSON.stringify(inventory)+');').toString('base64'));}
catch(error){console.error('V13:',error.message);process.exitCode=1;}
