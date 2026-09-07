/* global require, __dirname, global, localStorage, setTimeout, console, process */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname, '..');
const ts=require(root+'/node_modules/typescript');
const axios=require(root+'/node_modules/axios/dist/node/axios.cjs');
const data=new Map();
global.localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
global.window={addEventListener(){}};
let clears=0;
const cache=new Map();
function load(file){ file=path.resolve(file);
 if(cache.has(file)) return cache.get(file).exports;
 const mod={exports:{}};cache.set(file,mod);
 const source=fs.readFileSync(file,'utf8').replace('import.meta.env.VITE_API_URL','"https://test.invalid/api"');
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const req=id=>id==='axios'?axios:id.endsWith('/queryClient')?{queryClient:{clear(){clears++},cancelQueries(){return Promise.resolve()}}}:id.startsWith('.')?load(path.resolve(path.dirname(file),id+'.ts')):require(root+'/node_modules/'+id);
 new Function('require','module','exports',code)(req,mod,mod.exports);return mod.exports;
}
const session=load(root+'/src/lib/session.ts');
const api=load(root+'/src/api/axios.ts').default;
const schema=load(root+'/src/validations/transaction.schema.ts').transactionSchema;
const input={title:' Rent ',category:' Home ',amount:'12.5001',type:'expense',occurredAt:'2026-09-01'};
assert.equal(schema.parse(input).amount,12.5001);
assert.equal(schema.parse(input).title,'Rent');
for(const amount of ['', '0','-1','1.12345','1000000000000000','Infinity']) assert.equal(schema.safeParse({...input,amount}).success,false,amount);
assert.equal(schema.safeParse({...input,title:' '}).success,false);
assert.equal(schema.safeParse({...input,occurredAt:'2026-02-30'}).success,false);
const user={id:'a',email:'a@test.invalid',currency:'NGN'};
const response=(config,payload,status=200)=>({config,data:payload,status,statusText:'test',headers:{}});
const unauthorized=config=>Promise.reject(new axios.AxiosError('Unauthorized','ERR_BAD_REQUEST',config,{},response(config,{},401)));
const delay=()=>new Promise(r=>setTimeout(r,10));
(async()=>{
 session.setSession({token:'old',user});
 let refreshes=0;
 api.defaults.adapter=async config=>{
  if(config.url==='/auth/refresh'){refreshes++;await delay();return response(config,{token:'new'});}
  if(config.headers.Authorization==='Bearer old') return unauthorized(config);
  return response(config,{ok:true});
 };
 await Promise.all([api.get('/transactions'),api.get('/analytics/summary'),api.get('/analytics/monthly')]);
 assert.equal(refreshes,1);assert.equal(session.getSession().token,'new');
 let changes=0;const unsubscribe=session.subscribeSession(()=>changes++);
 api.defaults.adapter=config=>unauthorized(config);
 await assert.rejects(api.get('/transactions'));
 assert.equal(session.getSession(),null);assert.equal(localStorage.getItem('token'),null);assert.ok(changes>0);unsubscribe();
 session.setSession({token:'old',user});
 let release;const waiting=new Promise(r=>release=r);
 api.defaults.adapter=async config=>{if(config.url==='/auth/refresh'){await waiting;return response(config,{token:'late'});}return unauthorized(config);};
 const pending=api.get('/transactions');await delay();
 session.setSession(null);session.setSession({token:'b-token',user:{...user,id:'b'}});release();
 await assert.rejects(pending);assert.equal(session.getSession().token,'b-token');assert.ok(clears>=4);
 // Network failure must not destroy an otherwise valid session.
 api.defaults.adapter=config=>config.url==='/auth/refresh'?Promise.reject(new axios.AxiosError('Network Error','ERR_NETWORK',config)):unauthorized(config);
 await assert.rejects(api.get('/transactions'));assert.equal(session.getSession().token,'b-token');
 console.log('PASS: amount/date validation, shared concurrent refresh, expiry notification, account cache cleanup, late refresh isolation, network failure preserves session.');
})().catch(e=>{console.error(e);process.exitCode=1});
