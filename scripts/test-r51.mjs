// R5.1: una pestaña aislada; reutiliza CDP y servidor estático de F04.
// Sólo datos sintéticos, sin abrir WhatsApp ni modificar el perfil del usuario.
import fs from 'node:fs/promises';
const support=await fs.readFile(new URL('./test-f04-integration.mjs',import.meta.url),'utf8');
const boundary=support.indexOf('const a=await new Page().init()');
if(boundary<0)throw Error('No se encontró el soporte de F04.');
const prefix=support.slice(0,boundary).replace('docs/f04-final','docs/r5.1');
process.env.F04_CDP_URL??='http://127.0.0.1:9371';
async function verify(Page,base,dir){
 const page=await new Page().init(),results=[];
 const shirt='/productos/indumentaria/remeras-personalizadas',lona='/productos/ficha/lonas';
 const r='guiada-remeras-personalizadas-ficha',l='guiada-lonas-ficha',key='las-chikas-design:consulta:v1';
 let shirtKey,lonaKey;
 const value=id=>page.eval(`document.getElementById(${JSON.stringify(id)}).value`);
 const next=p=>page.click('#'+p+'-next');
 const summary=p=>page.eval(`document.getElementById('${p}-summary').innerText`);
 async function load(route,p){await page.goto(route);await page.wait(`!!document.getElementById('${p}-next')`);}
 async function edit(id,p){await page.click(`li[data-selection-key="${id}"] a[href*="#configuracion="]`);await page.wait(`!!document.getElementById('${p}-next')`);}
 async function test(name,run){
  try{const evidence=await run();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log(name+': correcto');}
  catch(error){results.push({name,passed:false,error:String(error)});throw error;}
  finally{await fs.writeFile(path.join(dir,'resultados.json'),JSON.stringify(results,null,2)+'\n');}
 }
 async function layout(p,column){
  const data=[];
  for(const width of [390,1440]){
   await page.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
   const info=await page.eval(`(()=>{const g=document.querySelector('[data-${column}-column=gallery]'),f=g.parentElement.children[1],s=g.parentElement.children[2];const box=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,bottom:b.bottom}};return{gallery:box(g),form:box(f),summary:box(s),dom:!!(g.compareDocumentPosition(f)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(f.compareDocumentPosition(s)&Node.DOCUMENT_POSITION_FOLLOWING),count:[...document.querySelectorAll('main h2')].filter(e=>e.textContent==='Tu selección').length,overflow:document.documentElement.scrollWidth>innerWidth}})()`);
   assert(info.dom&&!info.overflow);assert.equal(info.count,1);
   if(width===390){assert(info.form.y>=info.gallery.bottom-1);assert(info.summary.y>=info.form.bottom-1);}
   else{assert(info.form.x>info.gallery.x);assert(Math.abs(info.summary.x-info.gallery.x)<2);}
   await page.eval(`document.getElementById('${p}-next').focus();true`);await page.key('Tab',9);
   assert(await page.eval("document.activeElement.checkVisibility()&&getComputedStyle(document.activeElement).outlineStyle!=='none'"));
   data.push({width,...info});
  }
  return data;
 }
 try{
  await load(shirt,r);await page.eval(`localStorage.setItem('${key}',JSON.stringify({version:1,items:[{id:'tazas',name:'Tazas',path:'/productos/ficha/tazas',quantity:30,notes:'Consulta anterior R4'}]}));true`);await load(shirt,r);
  await test('Remeras: 20 → distribución 30 → desactivar conserva 30; un solo control',async()=>{
   await page.fill('#'+r+'-request-model','Modelo solicitado de prueba');await next(r);await page.fill('#'+r+'-quantity',20);
   await page.click('#'+r+'-distribute');
   assert.equal(await page.eval("[...document.querySelectorAll('input[id*=\"-size-solicitado-\"]')].map(e=>e.value).join('')"),'');
   assert.equal(await page.eval("[...document.querySelectorAll('label')].filter(e=>/repartir las cantidades|Distribuir cantidades por talle/.test(e.textContent)).length"),1);
   await page.fill('input[id*="-label-solicitado-"]','Talle solicitado A');await page.fill('input[id*="-size-solicitado-"]',30);
   assert((await summary(r)).includes('30'));await page.click('#'+r+'-distribute');assert.equal(await value(r+'-quantity'),'30');
   await page.click('#'+r+'-distribute');assert.equal(await page.eval("document.querySelector('input[id*=\"-size-solicitado-\"]').value"),'30');
   return {initial:20,distributed:30,afterDisabling:30};
  });
  await test('Remeras: conserva filas, último total válido y no inventa cantidades',async()=>{
   await page.click('#'+r+'-add-size');
   const ids=await page.eval("[...document.querySelectorAll('input[id*=\"-size-solicitado-\"]')].map(e=>e.id)");
   assert.equal(await value(ids[1]),'');
   await page.fill('input[id*="-label-solicitado-"]','Talle A');
   const labels=await page.eval("[...document.querySelectorAll('input[id*=\"-label-solicitado-\"]')].map(e=>e.id)");
   await page.fill('#'+labels[1],'Talle B');await page.fill('#'+ids[0],25);await page.fill('#'+ids[1],5);
   await page.fill('#'+ids[1],'');await next(r);assert.equal(await page.eval('document.activeElement.id'),ids[1]);
   await page.click('#'+r+'-distribute');assert.equal(await value(r+'-quantity'),'30');
   await page.fill('#'+r+'-quantity',40);await page.click('#'+r+'-distribute');
   assert.equal(await value(ids[0]),'25');assert.equal(await value(ids[1]),'');
   await page.fill('#'+ids[1],5);await page.click('#'+r+'-distribute');assert.equal(await value(r+'-quantity'),'30');
   await page.fill('#'+r+'-quantity',0);await next(r);assert.equal(await page.eval('document.activeElement.id'),r+'-quantity');
   await page.fill('#'+r+'-quantity',30);await page.click('#'+r+'-distribute');
   assert(await page.eval("document.querySelector('main').textContent.includes('Distribución recuperada: 30 unidades')"));
  });
  await test('Remeras: responsive y foco a 390/1440',()=>layout(r,'v10'));
  await test('Remeras: guardar, recargar, recuperar talles y editar sin duplicar',async()=>{
   await next(r);await page.click('#'+r+'-technique-dtf');await page.fill('#'+r+'-notes','Observaciones R5.1\n  Con espacios');await next(r);await page.text('Solicitar presupuesto');await page.wait("!!document.getElementById('cliente-fullName')");
   shirtKey=(await page.items()).find(i=>i.id==='remeras-personalizadas').configurationId;
   const token=await page.eval('window.__pageToken');await page.send('Page.reload',{ignoreCache:true});await page.wait(`window.__pageToken!==${JSON.stringify(token)}&&!!document.getElementById('cliente-fullName')`);
   await edit(shirtKey,r);await next(r);assert(await page.eval(`document.getElementById('${r}-distribute').checked`));
   assert.deepEqual(await page.eval("[...document.querySelectorAll('input[id*=\"-size-solicitado-\"]')].map(e=>e.value)"),['25','5']);
   await page.click('#'+r+'-distribute');assert.equal(await value(r+'-quantity'),'30');
   await next(r);await next(r);await page.text('Guardar cambios');await page.wait("!!document.getElementById('cliente-fullName')");
   const saved=(await page.items()).filter(i=>i.id==='remeras-personalizadas');assert.equal(saved.length,1);assert.equal(saved[0].quantity,30);assert.equal(saved[0].configuration.sizes.length,0);
  });
  await load(lona,l);
  await test('Lonas: medidas positivas, modo exclusivo y recuperación del borrador',async()=>{
   await page.click('#'+l+'-material-frontlit');await page.fill('#'+l+'-request-use','Cartel solicitado');await next(l);
   await page.fill('#'+l+'-quantity',2);await page.fill('#'+l+'-width','-1');await next(l);assert.equal(await page.eval('document.activeElement.id'),l+'-width');
   await page.fill('#'+l+'-width','150,5');await page.fill('#'+l+'-height',200);
   assert(await page.eval("document.querySelector('main figure').textContent.includes('150.5 × 200 cm')"));
   await page.click('#'+l+'-measure-advice');assert(!await page.eval(`!!document.getElementById('${l}-width')`));assert(!(await summary(l)).includes('150.5'));
   await page.eval(`document.getElementById('${l}-measure-advice').focus();true`);await page.key('ArrowLeft',37);
   assert(await page.eval(`document.getElementById('${l}-measure-known').checked`));assert.equal(await value(l+'-width'),'150,5');assert.equal(await value(l+'-height'),'200');
   assert(await page.eval("getComputedStyle(document.activeElement.closest('label')).outlineStyle!=='none'"));
   await page.fill('#'+l+'-width','');await page.fill('#'+l+'-height','');await page.click('#'+l+'-measure-advice');await next(l);
   assert(await page.eval(`!!document.getElementById('${l}-request-finish')`));
   await page.fill('#'+l+'-request-finish','Terminación a consultar');await page.click('#'+l+'-design-status-preparado');await page.fill('#'+l+'-notes','Observaciones de lona');
   assert((await summary(l)).includes('Medidas'));assert(!(await summary(l)).includes('150.5'));
  });
  await test('Lonas: responsive y foco a 390/1440',()=>layout(l,'lonas'));
  await test('Lonas: guardar y editar asesoramiento sin dimensiones ni cambios de cantidad',async()=>{
   await next(l);await page.text('Solicitar presupuesto');await page.wait("!!document.getElementById('cliente-fullName')");
   const item=(await page.items()).find(i=>i.id==='lonas');lonaKey=item.configurationId;assert.equal(item.quantity,2);assert(!item.configuration.measurements);assert(item.configuration.advice.includes('measurements'));
   await edit(lonaKey,l);await next(l);assert(await page.eval(`document.getElementById('${l}-measure-advice').checked`));
   assert(!await page.eval(`!!document.getElementById('${l}-width')`));await page.click('#'+l+'-measure-known');
   assert.equal(await value(l+'-width'),'');await page.fill('#'+l+'-width',180);await page.fill('#'+l+'-height',250);
   await page.click('#'+l+'-measure-advice');await page.click('#'+l+'-measure-known');assert.equal(await value(l+'-width'),'180');assert.equal(await value(l+'-height'),'250');
   await next(l);assert.equal(await value(l+'-request-finish'),'Terminación a consultar');await next(l);await page.text('Guardar cambios');await page.wait("!!document.getElementById('cliente-fullName')");
   const saved=(await page.items()).find(i=>i.configurationId===lonaKey);assert.deepEqual(saved.configuration.measurements,{width:180,height:250,unit:'cm'});assert(!saved.configuration.advice.includes('measurements'));assert.equal(saved.quantity,2);
   await edit(lonaKey,l);await next(l);await page.click('#'+l+'-measure-advice');await next(l);await next(l);await page.text('Guardar cambios');await page.wait("!!document.getElementById('cliente-fullName')");
  });
  await test('F04: mensaje único y copia exacta; 30 remeras, lona asesorada y consulta antigua',async()=>{
   await page.fill('#cliente-fullName','Cliente R5.1 de prueba');await page.fill('#cliente-phone','+1 202 555 0199');await page.text('Revisar solicitud');await page.wait("!!document.getElementById('resumen-solicitud-texto')");
   const message=await value('resumen-solicitud-texto');
   for(const expected of ['Remeras Personalizadas','Cantidad total: 30','DTF','Observaciones R5.1','Lonas','Cantidad total: 2','Medidas','Terminación a consultar','Tazas','Consulta anterior R4'])assert(message.includes(expected),expected);
   for(const inactive of ['150.5','180 × 250','200 cm'])assert(!message.includes(inactive),inactive);
   await page.text('Copiar resumen completo');assert.equal(await page.eval('window.__copied'),message);
   assert(!await page.eval("!!document.querySelector('a[href*=\"wa.me\"]')"));
   assert(!await page.eval(`localStorage.getItem('${key}').includes('Cliente R5.1')`));
  });
  await test('F04: cancelar edición conserva la selección original',async()=>{
   const before=await page.items();await edit(lonaKey,l);await next(l);await page.fill('#'+l+'-quantity',99);await page.text('Cancelar edición y volver a Mi consulta');await page.wait("!!document.getElementById('cliente-fullName')");assert.deepEqual(await page.items(),before);
  });
  await test('Tarjeta de Remeras: texto neutral y destino existente intacto',async()=>{
   await page.goto('/productos');const text=await page.eval("document.querySelector('main').innerText");assert(text.includes('Remeras personalizadas con tu logo o diseño para uniformes, egresados y eventos.'));
   assert(await page.eval(`!!document.querySelector('main a[href="${base+shirt}"]')`));
  });
  assert.deepEqual(page.errors,[]);
 }finally{await page.close();if(server)await new Promise(r=>server.close(r));}
}
try{await import('data:text/javascript;base64,'+Buffer.from(prefix+'\nawait ('+verify.toString()+')(Page,base,dir);').toString('base64'));}
catch(error){console.error('R5.1:',error.message);process.exitCode=1;}
