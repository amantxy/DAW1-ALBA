/* Sincroniza el progreso de una página de estudio con la cuenta de Supabase.
   Uso: <script src="../progreso.js" data-pagina="nombre" data-claves="clave1,prefijo*"></script> */
(function(){
var S=document.currentScript,P=S.dataset.pagina,C=S.dataset.claves.split(","),cfg=window.DAW1_SUPABASE||{};
if(!P||!cfg.url||!cfg.key||typeof supabase==="undefined")return;
var sb=window.DAW1_SB=supabase.createClient(cfg.url,cfg.key),user=null,gen=0,corriendo=false,otra=false,temp=0;
var setI=Storage.prototype.setItem,delI=Storage.prototype.removeItem,META="sync:"+P;
function coincide(k){return C.some(function(c){return c.slice(-1)==="*"?k.indexOf(c.slice(0,-1))===0:k===c})}
function meta(){try{var m=JSON.parse(localStorage.getItem(META))||{};return user&&m.uid&&m.uid!==user.id?{dirty:m.dirty}:m}catch(e){return{}}}
function guardaMeta(m){try{setI.call(localStorage,META,JSON.stringify(m))}catch(e){}}
function foto(){var o={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(coincide(k)){try{o[k]=JSON.parse(localStorage.getItem(k))}catch(e){}}}}catch(e){}return o}
function canon(v){if(Array.isArray(v))return v.map(canon);if(v&&typeof v==="object"){var o={};Object.keys(v).sort().forEach(function(k){o[k]=canon(v[k])});return o}return v}
function igual(a,b){return JSON.stringify(canon(a))===JSON.stringify(canon(b))}
function una(a,b){
 if(typeof a==="number"&&typeof b==="number")return Math.max(a,b);
 if(Array.isArray(a)&&Array.isArray(b)){var u=[];a.concat(b).forEach(function(x){if(!u.some(function(y){return igual(x,y)}))u.push(x)});return u}
 if(a&&b&&typeof a==="object"&&typeof b==="object"){var o={};Object.keys(a).concat(Object.keys(b)).forEach(function(k){o[k]=k in a&&k in b?una(a[k],b[k]):(k in a?a[k]:b[k])});return o}
 return b}
function aplica(d){try{var v=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(coincide(k)&&!(k in d))v.push(k)}
 v.forEach(function(k){delI.call(localStorage,k)});Object.keys(d).forEach(function(k){setI.call(localStorage,k,JSON.stringify(d[k]))})}catch(e){}}
async function sube(d,g){
 var r=await sb.from("progreso").upsert({user_id:user.id,pagina:P,datos:d},{onConflict:"user_id,pagina"}).select("updated_at").single();
 if(r.error)throw r.error;
 guardaMeta({uid:user.id,base:r.data.updated_at,dirty:g!==gen})}
async function sincroniza(){
 if(!user||P==="portada")return;if(corriendo){otra=true;return}corriendo=true;
 var recarga=false;
 try{
  var g=gen,q=await sb.from("progreso").select("datos,updated_at").eq("pagina",P).maybeSingle();
  if(q.error)throw q.error;
  var row=q.data,m=meta(),l=foto(),hay=Object.keys(l).length>0;
  if(!row){if(hay)await sube(l,g);else guardaMeta({uid:user.id,dirty:false})}
  else if(row.updated_at===m.base){
   if(m.dirty){if(igual(l,row.datos))guardaMeta({uid:user.id,base:m.base,dirty:g!==gen});else await sube(l,g)}}
  else{
   var d=(m.dirty||!m.base)?una(l,row.datos):row.datos;
   if(igual(d,row.datos))guardaMeta({uid:user.id,base:row.updated_at,dirty:g!==gen});else await sube(d,g);
   if(!igual(d,l)){aplica(d);recarga=true}}
  }
 catch(e){}
 corriendo=false;
 if(recarga){location.reload();return}
 if(otra){otra=false;sincroniza()}}
function marca(){gen++;var m=meta();m.dirty=true;guardaMeta(m);clearTimeout(temp);if(user)temp=setTimeout(sincroniza,1500)}
Storage.prototype.setItem=function(k,v){setI.call(this,k,v);if(this===localStorage&&coincide(k))marca()};
Storage.prototype.removeItem=function(k){delI.call(this,k);if(this===localStorage&&coincide(k))marca()};
/* ---- interfaz ---- */
var caja=document.getElementById("sesion"),bt=null;
function estado(){}
function pinta(){if(bt)bt.textContent=user?"Salir":"Iniciar sesión"}
if(caja){
var st=document.createElement("style");
st.textContent="#pgd{border:1px solid #d7e0ec;border-radius:14px;padding:20px;width:min(92vw,380px);background:#fff;color:#0f1b2d;font:16px/1.5 system-ui,sans-serif}#pgd::backdrop{background:rgb(0 0 0/.5)}#pgd input{display:block;width:100%;box-sizing:border-box;font:inherit;min-height:44px;margin:8px 0;padding:8px 12px;border:1px solid #d7e0ec;border-radius:10px;background:#fff;color:#0f1b2d}#pgd .f{display:flex;justify-content:flex-end;gap:10px;margin-top:8px}#pgd button{font:inherit;font-weight:600;min-height:44px;padding:8px 14px;border-radius:10px;border:1px solid #d7e0ec;background:#fff;color:#0f1b2d;cursor:pointer}#pgd button.p{background:#1e293b;border-color:#1e293b;color:#fff}#pge{color:#c0392b;font-size:.9rem;min-height:1.2em}";
document.head.appendChild(st);
bt=document.createElement("button");bt.type="button";caja.append(bt);
var dl=document.createElement("dialog");dl.id="pgd";dl.innerHTML='<form id="pgf"><b>Entra con tu cuenta</b><input type="email" id="pgm" autocomplete="username" placeholder="Correo" aria-label="Correo" required><input type="password" id="pgp" autocomplete="current-password" placeholder="Contraseña" aria-label="Contraseña" required><div id="pge"></div><div class="f"><button type="button" id="pgc">Cancelar</button><button class="p">Entrar</button></div></form>';document.body.appendChild(dl);
dl.querySelector("#pgc").onclick=function(){dl.close()};
dl.querySelector("#pgf").onsubmit=async function(e){e.preventDefault();var er=dl.querySelector("#pge"),b=dl.querySelector("button.p");er.textContent="";b.disabled=true;
 var r=await sb.auth.signInWithPassword({email:dl.querySelector("#pgm").value.trim(),password:dl.querySelector("#pgp").value}).catch(function(x){return{error:x}});b.disabled=false;
 if(r.error){er.textContent=/invalid login/i.test(r.error.message||"")?"Correo o contraseña incorrectos.":"No se pudo conectar. Inténtalo de nuevo.";return}
 dl.querySelector("#pgp").value="";dl.close()};
bt.onclick=async function(){if(!user){dl.showModal();return}clearTimeout(temp);await sincroniza();if(meta().dirty&&!confirm("Hay cambios sin guardar en tu cuenta. ¿Salir igualmente?"))return;await sb.auth.signOut();limpia();location.reload()};
}
/* Al salir, el progreso no se queda visible en este navegador. */
function limpia(){var G={programacion:["fc-known"],"lenguajes-de-marcas":["lm:"],ingles:["en:"],transformacion:["tsp:"],"bases-de-datos":["bd:"],"entornos-de-desarrollo":["ed:"],"sistemas-informaticos":["si:"],agenda:["agenda:"],"ide-java":["ide:"]};try{Object.keys(G).forEach(function(p){var m;try{m=JSON.parse(localStorage.getItem("sync:"+p))||{}}catch(e){m={}}if(m.dirty&&p!==P)return;for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i);if(G[p].some(function(x){return k.indexOf(x)===0}))delI.call(localStorage,k)}delI.call(localStorage,"sync:"+p)})}catch(e){}}
function cambia(u){var nuevo=(u&&u.id)!==(user&&user.id);user=u;document.dispatchEvent(new CustomEvent("daw1-auth",{detail:u}));if(!nuevo)return;pinta();if(user)sincroniza()}
sb.auth.onAuthStateChange(function(ev,s){setTimeout(function(){cambia(s?s.user:null)},0)});
pinta();
addEventListener("online",sincroniza);
document.addEventListener("visibilitychange",function(){if(user){clearTimeout(temp);sincroniza()}});
})();
