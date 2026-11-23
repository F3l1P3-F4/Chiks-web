// F04: datos sintéticos, adaptadores en memoria; sin contactos ni envíos externos.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { createRequire } from 'node:module';
const load = createRequire(import.meta.url);
const previous = load.extensions['.ts'];
load.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const results=[];
async function test(name, run) { await run();results.push({name,passed:true}); }
try {
  const { createConsultationStore, parseConsultation, CONSULTATION_STORAGE_KEY } = load('../src/lib/consultationStore.ts');
  const { itemKey, selectionVersion, validateConfiguration, unavailableOptions } = load('../src/lib/consultationConfiguration.ts');
  const { buildConsultationMessage } = load('../src/lib/consultationMessage.ts');
  const { demoCatalogs } = load('../src/data/guidedDemoCatalogs.ts');
  const { buildWhatsAppAction } = load('../src/lib/whatsapp.ts');
  const products=[{id:'remeras-personalizadas',name:'Remeras Personalizadas',path:'/productos/indumentaria/remeras-personalizadas'},{id:'lonas',name:'Lonas',path:'/productos/ficha/lonas'},{id:'tazas',name:'Tazas',path:'/productos/ficha/tazas'}];
  const old={...products[0],quantity:20,notes:'Texto anterior\nCon espacios  y áéíóú'};
  const mug={...products[2],quantity:30,notes:''};
  const customer={fullName:'Cliente de prueba',phone:'+1 202 555 0199',email:'',comment:''};
  const config=(kind='remeras',source='confirmed')=>({version:1,kind,source,choices:{},sizes:[],advice:['general']});
  const shirt=(key='cfg-prueba-0001',extra={})=>({...products[0],configurationId:key,quantity:20,notes:'Texto\n  completo  ',configuration:config(),...extra});
  const state=store=>store.stateFromSnapshot(store.getSnapshot());
  let raw=JSON.stringify({version:1,items:[old,mug]}),blocked=false,readBlocked=false;
  const adapter={read:()=>{if(readBlocked)throw Error('blocked');return raw;},write:value=>{if(blocked)throw Error('blocked');raw=value;}};
  const a=createConsultationStore(products,adapter),b=createConsultationStore(products,adapter);
  await test('Compatibilidad v1 y clave intactas, sin migración destructiva',()=>{
    assert.equal(CONSULTATION_STORAGE_KEY,'las-chikas-design:consulta:v1');assert.deepEqual(state(a).items,[old,mug]);assert.equal(itemKey(old),old.id);
  });
  await test('Dos configuraciones, edición, recarga y eliminación independientes',async()=>{
    assert.equal(await a.save(shirt(),null),'saved');assert.equal(await a.save(shirt('cfg-prueba-0002',{quantity:25}),null),'saved');
    assert.equal(state(a).items.length,4);assert.deepEqual(state(a).items.slice(0,2),[old,mug]);
    const reload=createConsultationStore(products,adapter);assert.deepEqual(state(reload).items,state(a).items);
    const first=state(a).items.find(i=>itemKey(i)==='cfg-prueba-0001');assert.equal(await a.save({...first,quantity:22},first),'saved');
    assert.equal(state(a).items.find(i=>itemKey(i)==='cfg-prueba-0002').quantity,25);
    assert.equal(await a.remove('cfg-prueba-0002',state(a).items.find(i=>itemKey(i)==='cfg-prueba-0002')),'saved');assert.equal(state(a).items.length,3);
  });
  await test('Selección anterior ampliada conserva identidad y no duplica',async()=>{
    const original=state(a).items.find(i=>itemKey(i)===old.id);assert.equal(await a.save({...original,configuration:config()},original),'saved');assert.equal(state(a).items.length,3);assert.equal(state(a).items.filter(i=>itemKey(i)===old.id).length,1);
  });
  await test('Sincronización normal y conflicto de cantidades y configuración completa',async()=>{
    const base=state(a).items.find(i=>itemKey(i)==='cfg-prueba-0001');blocked=true;
    const local={...base,quantity:24,notes:'x'.repeat(2000),configuration:{...base.configuration,advice:['sizes']}};
    assert.equal(await a.save(local,base),'temporary');blocked=false;
    assert.equal(await b.save({...base,quantity:26,configuration:{...base.configuration,advice:['color']}},base),'saved');a.onStorage(raw);
    assert.equal(state(a).conflicts.length,1);assert.equal(state(a).items.find(i=>itemKey(i)===itemKey(base)).notes.length,2000);
    assert.equal(await a.retry(),'conflict');assert.equal(await a.resolve(itemKey(base),'local'),'saved');assert.deepEqual(state(b).items,state(a).items);
    assert.equal(state(a).items.find(i=>itemKey(i)===itemKey(base)).notes,local.notes);
  });
  await test('Eliminación temporal, lectura bloqueada y conflicto remoto no resucitan selección',async()=>{
    const base=state(a).items.find(i=>itemKey(i)==='cfg-prueba-0001');blocked=true;assert.equal(await a.remove(itemKey(base),base),'temporary');blocked=false;
    assert.equal(await b.save({...base,quantity:29},base),'saved');readBlocked=true;a.onStorage(raw);assert(!state(a).items.some(i=>itemKey(i)===itemKey(base)));assert.equal(state(a).conflicts.length,1);assert.equal(state(a).readable,false);
    readBlocked=false;assert.equal(await a.resolve(itemKey(base),'remote'),'saved');assert.equal(state(a).items.find(i=>itemKey(i)===itemKey(base)).quantity,29);
  });
  await test('Recuperación tras bloqueo y borrado temporal persistido',async()=>{
    const base=state(a).items.find(i=>itemKey(i)==='cfg-prueba-0001');blocked=true;assert.equal(await a.remove(itemKey(base),base),'temporary');a.onStorage(raw);assert(!state(a).items.some(i=>itemKey(i)===itemKey(base)));blocked=false;assert.equal(await a.retry(),'saved');assert(!JSON.parse(raw).items.some(i=>itemKey(i)===itemKey(base)));
  });
  await test('Cantidad, talles, medidas, compatibilidad y límites de observaciones',async()=>{
    for(const quantity of [0,-1,1.5,Infinity,Number.MAX_SAFE_INTEGER+1])await assert.rejects(a.save(shirt('cfg-invalid-0001',{quantity}),null));
    await assert.rejects(a.save(shirt('cfg-invalid-0001',{notes:'x'.repeat(2001)}),null));
    const fixture={...demoCatalogs.remeras,source:'confirmed'};
    const item=shirt('cfg-size-00001',{configuration:{...config(),choices:{model:{id:'recto',label:'Corte recto'}},sizes:[{id:'S',label:'S',quantity:5},{id:'M',label:'M',quantity:10},{id:'L',label:'L',quantity:5}]}});
    assert.equal(validateConfiguration(item,fixture),null);assert.match(validateConfiguration({...item,quantity:21},fixture),/total/);
    for(const dimensions of [{width:0,height:100,unit:'cm'},{width:1,height:-2,unit:'m'},{width:1,height:2,unit:'mm'}])assert(validateConfiguration({...products[1],configurationId:'cfg-medida-0001',quantity:2,notes:'',configuration:{...config('lonas'),measurements:dimensions}}));
    assert(validateConfiguration(shirt('cfg-kind-00001',{configuration:config('lonas')})));
    assert.equal(validateConfiguration({...products[1],configurationId:'cfg-medida-0001',quantity:2,notes:'',configuration:{...config('lonas'),measurements:{width:1.25,height:2.5,unit:'m'}}}),null);
  });
  await test('Opciones retiradas se conservan, se señalan y bloquean el envío',()=>{
    const item=shirt('cfg-retirada-001',{configuration:{...config(),choices:{material:{id:'anterior',label:'Material anterior'}}}});
    const parsed=parseConsultation(JSON.stringify({version:1,items:[item]}),products);assert.deepEqual(parsed.items[0],item);assert.equal(unavailableOptions(item.configuration).length,1);assert.throws(()=>buildConsultationMessage([item],customer));
  });
  await test('Datos corruptos o duplicados no se sobrescriben ni se borran',async()=>{
    for(const bad of ['{',JSON.stringify({version:99,items:[]}),JSON.stringify({version:1,items:[old,{...mug,quantity:-1}]}),JSON.stringify({version:1,items:[old,old]})]){
      raw=bad;assert(state(a).storageIssue);assert.equal(await a.save(shirt('cfg-corrupta-001'),null),'conflict');assert.equal(raw,bad);
    }raw=JSON.stringify({version:1,items:[old,mug]});
  });
  await test('Demostraciones aisladas, rechazadas por almacenamiento y mensaje comerciales',async()=>{
    let demoRaw=null;const demo=createConsultationStore(products,{read:()=>demoRaw,write:value=>{demoRaw=value;}},demoCatalogs.remeras);
    const item=shirt('cfg-demo-00001',{configuration:{...config('remeras','demo'),choices:{model:{id:'recto',label:'Corte recto'}}}});
    const commercialBefore=raw;assert.equal(await demo.save(item,null),'saved');assert.equal(raw,commercialBefore);await assert.rejects(a.save(item,null));assert.throws(()=>buildConsultationMessage([item],customer));assert(parseConsultation(demoRaw,products).storageIssue);
    assert.match(buildConsultationMessage(state(demo).items,customer,demoCatalogs.remeras),/DEMOSTRACIÓN AISLADA/);
  });
  await test('Mensaje completo, múltiples variantes, espacios y alternativa extensa',()=>{
    const first=shirt('cfg-msg-00001'),second=shirt('cfg-msg-00002',{quantity:30,notes:'y'.repeat(2000)}),lona={...products[1],configurationId:'cfg-msg-lona01',quantity:3,notes:'Conservar saltos\n\n  y espacios',configuration:{...config('lonas'),measurements:{width:150.5,height:75,unit:'cm'}}};
    const message=buildConsultationMessage([first,second,lona,mug],customer);assert(message.includes('Configuración 1 de 2'));assert(message.includes('Configuración 2 de 2'));assert(message.includes('Medidas solicitadas: 150.5 × 75 cm'));assert(message.includes(first.notes));assert(message.includes(lona.notes));assert(message.includes('Cantidad: 30'));assert.equal(buildWhatsAppAction('12025550123',message).prefilled,false);
  });
  await test('Propiedades ajenas y datos personales excluidos de la persistencia',async()=>{
    await a.save({...shirt('cfg-privacidad-01'),email:'privado@example.test',fullName:'Persona',configuration:{...config(),phone:'123456789'}},null);
    assert(!raw.includes('privado@example.test'));assert(!raw.includes('fullName'));assert(!raw.includes('phone'));
    assert.notEqual(selectionVersion(shirt()),selectionVersion(shirt('cfg-prueba-0001',{configuration:{...config(),advice:['material']}})));
  });
  await test('Campos completos: guardar, recargar, editar y mensaje único por el camino comercial',async()=>{
    // Catálogos sintéticos sólo en este proceso de pruebas. NO constituyen aprobación
    // comercial y nunca se escriben en src/data ni se incorporan al bundle público.
    const { confirmedCatalogs } = load('../src/data/guidedCatalogs.ts');
    const originals = { ...confirmedCatalogs };
    try {
      for (const kind of ['remeras','lonas']) confirmedCatalogs[kind] = { ...demoCatalogs[kind], source:'confirmed' };
      let fullRaw=null;
      const storage={read:()=>fullRaw,write:value=>{fullRaw=value;}};
      const fullStore=createConsultationStore(products,storage);
      const choices=kind=>Object.fromEntries(Object.entries(confirmedCatalogs[kind].fields).map(([field,options])=>[field,{id:options[0].id,label:options[0].label}]));
      const complete=shirt('cfg-full-shirt01',{configuration:{...config(),choices:choices('remeras'),sizes:[{id:'S',label:'S',quantity:5},{id:'M',label:'M',quantity:10},{id:'L',label:'L',quantity:5}],advice:['customization']}});
      const second=shirt('cfg-full-shirt02',{quantity:30,notes:'Segunda variante independiente',configuration:{...config(),choices:{model:{id:'amplio',label:'Corte amplio'}}}});
      const banner={...products[1],configurationId:'cfg-full-lona001',quantity:2,notes:'Conservar texto\n  con espacios',configuration:{...config('lonas'),choices:choices('lonas'),measurements:{width:150,height:250,unit:'cm'},advice:['finish']}};
      for(const item of [complete,second,banner,mug])assert.equal(await fullStore.save(item,null),'saved');
      const recovered=createConsultationStore(products,storage);assert.deepEqual(state(recovered).items,state(fullStore).items);
      const prior=state(recovered).items.find(i=>i.configurationId===complete.configurationId);
      const edited={...prior,quantity:22,configuration:{...prior.configuration,sizes:[{id:'S',label:'S',quantity:7},{id:'M',label:'M',quantity:10},{id:'L',label:'L',quantity:5}]}};
      assert.equal(await recovered.save(edited,prior),'saved');
      const after=state(createConsultationStore(products,storage)).items;assert.deepEqual(after.find(i=>i.configurationId===second.configurationId),second);
      const message=buildConsultationMessage(after,customer);
      for(const line of ['Modelo: Corte recto','Material: Algodón','Color: Azul marino','Técnica de personalización: Estampado','Ubicación del diseño: Frente','Talles y cantidades: S: 7 · M: 10 · L: 5','Cantidad total: 22','Material: Frontlit','Uso previsto: Interior','Terminación: Con ojales','Diseño: Tengo una idea o diseño','Medidas solicitadas: 150 × 250 cm','Asesoramiento solicitado: Terminación','Configuración 1 de 2','Configuración 2 de 2',banner.notes])assert(message.includes(line),line);
      assert.equal(message.split('Modelo: Corte recto').length-1,1);assert(!message.includes('undefined'));assert(!message.includes('DEMOSTRACIÓN'));assert(!fullRaw.includes(customer.fullName));
    } finally { Object.assign(confirmedCatalogs,originals); }
  });
  console.log(JSON.stringify({passed:true,tests:results},null,2));
} finally { if(previous)load.extensions['.ts']=previous;else delete load.extensions['.ts']; }
