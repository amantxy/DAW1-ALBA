/* Pantalla de acceso: nada del sitio se muestra sin una cuenta aprobada por la administradora.
   Se carga en el <head> de todas las páginas. Entra con nick (o correo) y contraseña.
   Aviso: es un muro de acceso en el navegador, no una caja fuerte: las páginas siguen en un repositorio público. */
(function(){
"use strict";
var S=document.currentScript,BASE=S.src.replace(/acceso\.js(\?.*)?$/,""),DOMINIO="acceso.invalid";
var root=document.documentElement,sb=null,cfg=null,acc=null,ov=null,pestana="entrar",comprobando=false;
window.DAW1_ACC={listo:false,admin:false,nick:null,uid:null,email:null};
function lee(k){try{return localStorage.getItem(k)}catch(e){return null}}
function escribe(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}
function tokenUid(){try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^sb-.*-auth-token$/.test(k)){var j=JSON.parse(localStorage.getItem(k));if(j&&j.user&&j.user.id)return j.user.id}}}catch(e){}return null}

var css=document.createElement("style");
css.textContent="html.acc-cerrado body{display:none!important}"+
"#acc{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;background:#0f1b2d;font:16px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f1b2d}"+
"#acc .ac-c{width:min(100%,400px);background:#fff;border-radius:16px;padding:22px 20px;box-shadow:0 10px 40px rgb(0 0 0/.35)}"+
"#acc h1{margin:0 0 2px;font-size:1.4rem}#acc p{margin:6px 0}#acc .ac-s{color:#52637a;font-size:.92rem}"+
"#acc .ac-t{display:flex;gap:6px;margin:14px 0 6px}#acc .ac-t button{flex:1}"+
"#acc label{display:block;font-weight:600;font-size:.9rem;margin:10px 0 3px}"+
"#acc input,#acc textarea{display:block;width:100%;box-sizing:border-box;font:16px system-ui,sans-serif;min-height:46px;padding:9px 12px;border:1px solid #c5d0df;border-radius:10px;background:#fff;color:#0f1b2d}"+
"#acc button{font:600 1rem system-ui,sans-serif;min-height:46px;padding:8px 14px;border-radius:10px;border:1px solid #c5d0df;background:#fff;color:#0f1b2d;cursor:pointer}"+
"#acc button.p{width:100%;margin-top:14px;background:#1e293b;border-color:#1e293b;color:#fff}#acc button.on{background:#1e293b;border-color:#1e293b;color:#fff}#acc button:disabled{opacity:.6;cursor:default}"+
"#acc .ac-e{min-height:1.3em;color:#b91c1c;font-size:.92rem;margin:8px 0 0}#acc .ac-o{color:#15803d;font-weight:600}"+
"#acc .ac-b{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}#acc .ac-b button{flex:1}"+
".ac-dlg{border:1px solid #d7e0ec;border-radius:14px;padding:18px;width:min(92vw,380px);background:#fff;color:#0f1b2d;font:16px/1.5 system-ui,sans-serif}.ac-dlg::backdrop{background:rgb(0 0 0/.5)}"+
".ac-dlg h3{margin:0 0 6px}.ac-dlg label{display:block;font-weight:600;font-size:.9rem;margin:10px 0 3px}.ac-dlg input{display:block;width:100%;box-sizing:border-box;font:16px system-ui,sans-serif;min-height:46px;padding:9px 12px;border:1px solid #c5d0df;border-radius:10px;background:#fff;color:#0f1b2d}"+
".ac-dlg .f{display:flex;gap:8px;justify-content:flex-end;margin-top:14px;flex-wrap:wrap}.ac-dlg button{font:600 1rem system-ui,sans-serif;min-height:46px;padding:8px 14px;border-radius:10px;border:1px solid #c5d0df;background:#fff;color:#0f1b2d;cursor:pointer}.ac-dlg button.p{background:#1e293b;border-color:#1e293b;color:#fff}.ac-dlg .ac-e{min-height:1.3em;color:#b91c1c;font-size:.92rem;margin:8px 0 0}.ac-dlg .ac-o{color:#15803d;font-weight:600}"+
"#sesion .ac-lnk{font:600 .88rem/1.1 system-ui,sans-serif;min-height:40px;display:inline-flex;align-items:center;border:1px solid #ffffff55;border-radius:10px;background:#ffffff1f;color:#fff;padding:6px 10px;text-decoration:none;white-space:nowrap}"+
"#sesion{display:inline-flex;gap:8px;align-items:center}"+
".ac-ins{display:inline-block;margin-left:6px;min-width:1.4em;padding:0 6px;border-radius:999px;background:#b91c1c;color:#fff;font-size:.8rem;text-align:center}";
document.head.appendChild(css);

function esc(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function cierra(){root.classList.add("acc-cerrado")}
function abre(){root.classList.remove("acc-cerrado");if(ov){ov.remove();ov=null}}
function pon(h){if(!ov){ov=document.createElement("div");ov.id="acc";root.appendChild(ov)}ov.innerHTML='<div class="ac-c">'+h+'</div>';return ov}

function pantallaCarga(txt){pon('<h1>DAW 1 · ALBA</h1><p class="ac-s">'+esc(txt||"Comprobando acceso…")+'</p>')}
function pantallaAcceso(msg,ok){
 cierra();
 var ent=pestana==="entrar";
 pon('<h1>DAW 1 · ALBA</h1><p class="ac-s">Material de estudio privado. Entra con tu cuenta o pide acceso.</p>'+
 '<div class="ac-t"><button type="button" data-t="entrar" class="'+(ent?"on":"")+'">Entrar</button><button type="button" data-t="pedir" class="'+(ent?"":"on")+'">Solicitar acceso</button></div>'+
 '<form id="acf" novalidate>'+(ent?
  '<label for="ac-n">Nick o correo</label><input id="ac-n" autocomplete="username" autocapitalize="none" spellcheck="false" required>'+
  '<label for="ac-p">Contraseña</label><input id="ac-p" type="password" autocomplete="current-password" required>'
 :
  '<label for="ac-n">Nick que quieres usar</label><input id="ac-n" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20" required><p class="ac-s" style="margin:3px 0 0">3 a 20 caracteres: letras sin tilde, números, punto, guion o guion bajo.</p>'+
  '<label for="ac-m">¿Quién eres?</label><input id="ac-m" maxlength="200" placeholder="Nombre y clase, para que te reconozca" required>'+
  '<label for="ac-p">Contraseña (mínimo 8)</label><input id="ac-p" type="password" autocomplete="new-password" required>'+
  '<label for="ac-p2">Repite la contraseña</label><input id="ac-p2" type="password" autocomplete="new-password" required>')+
 '<p class="ac-e'+(ok?" ac-o":"")+'" id="ac-e" role="alert">'+esc(msg||"")+'</p><button class="p" id="ac-go">'+(ent?"Entrar":"Enviar solicitud")+'</button></form>');
 [].forEach.call(ov.querySelectorAll("[data-t]"),function(b){b.onclick=function(){pestana=b.dataset.t;pantallaAcceso()}});
 ov.querySelector("#acf").onsubmit=function(e){e.preventDefault();ent?entra():pide()};
 var f=ov.querySelector("#ac-n");if(f&&!msg)try{f.focus()}catch(x){}
}
function pantallaEstado(e){
 cierra();
 var t=e==="rechazado"?"<h1>Sin acceso</h1><p>Tu solicitud no ha sido aceptada.</p>":"<h1>Solicitud enviada</h1><p>Tu cuenta está pendiente de aprobación. Cuando la administradora la acepte, podrás entrar con tu nick y contraseña.</p>";
 pon(t+'<div class="ac-b">'+(e==="rechazado"?"":'<button type="button" id="ac-re">Comprobar de nuevo</button>')+'<button type="button" id="ac-sal">Salir</button></div><p class="ac-e" id="ac-e"></p>');
 var r=ov.querySelector("#ac-re");if(r)r.onclick=function(){comprueba(true)};
 ov.querySelector("#ac-sal").onclick=sal;
}
function err(t){var e=ov&&ov.querySelector("#ac-e");if(e){e.className="ac-e";e.textContent=t}}
function ocupa(si){var b=ov&&ov.querySelector("#ac-go");if(b)b.disabled=!!si}

function carga(url,ok){var s=document.createElement("script");s.src=url;s.onload=ok;s.onerror=function(){if(!sb)fallo()};document.head.appendChild(s)}
function fallo(){if(root.classList.contains("acc-cerrado")){pon('<h1>DAW 1 · ALBA</h1><p>No se pudo conectar para comprobar tu acceso.</p><div class="ac-b"><button type="button" id="ac-rt">Reintentar</button></div>');ov.querySelector("#ac-rt").onclick=function(){location.reload()}}}
function cliente(){
 if(window.DAW1_SB)return sb=window.DAW1_SB;
 if(typeof supabase==="undefined"||!cfg||!cfg.url)return null;
 return sb=window.DAW1_SB=supabase.createClient(cfg.url,cfg.key)}
function arranca(){
 var siguiente=function(){
  cfg=window.DAW1_SUPABASE;
  var lib=function(){if(!cliente())return fallo();sb.auth.onAuthStateChange(function(ev){if(ev==="SIGNED_OUT"){escribe("acc:ok",null);window.DAW1_ACC.listo=false;pestana="entrar";pantallaAcceso()}});comprueba()};
  if(typeof supabase!=="undefined")lib();else carga("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js",lib)};
 if(window.DAW1_SUPABASE)siguiente();else carga(BASE+"supabase-config.js",siguiente)}

async function comprueba(manual){
 if(comprobando)return;comprobando=true;
 try{
  var s=await sb.auth.getSession(),ses=s.data&&s.data.session;
  if(!ses){escribe("acc:ok",null);pantallaAcceso();return}
  var q=await sb.from("perfiles").select("nick,estado,es_admin").eq("user_id",ses.user.id).maybeSingle();
  if(q.error)throw q.error;
  var p=q.data;
  if(!p||p.estado==="pendiente"){escribe("acc:ok",null);pantallaEstado("pendiente");if(manual)err("Sigue pendiente.");return}
  if(p.estado==="rechazado"){escribe("acc:ok",null);pantallaEstado("rechazado");return}
  var A=window.DAW1_ACC;A.listo=true;A.admin=!!p.es_admin;A.nick=p.nick;A.uid=ses.user.id;A.email=ses.user.email;
  escribe("acc:ok",ses.user.id);abre();document.dispatchEvent(new CustomEvent("daw1-acceso",{detail:A}));extras()
 }catch(e){
  if(lee("acc:ok")&&lee("acc:ok")===tokenUid()){/* sin conexión: se mantiene el acceso ya comprobado */}
  else fallo()
 }finally{comprobando=false}}

async function entra(){
 var n=ov.querySelector("#ac-n").value.trim().toLowerCase(),p=ov.querySelector("#ac-p").value;
 if(!n||!p){err("Escribe tu nick y tu contraseña.");return}
 ocupa(true);
 var email=n.indexOf("@")>0?n:n+"@"+DOMINIO;
 var r=await sb.auth.signInWithPassword({email:email,password:p}).catch(function(x){return{error:x}});
 if(r.error){ocupa(false);err(/invalid login/i.test(r.error.message||"")?"Nick o contraseña incorrectos.":"No se pudo conectar. Inténtalo de nuevo.");return}
 pantallaCarga();comprueba()}

async function pide(){
 var n=ov.querySelector("#ac-n").value.trim().toLowerCase(),m=ov.querySelector("#ac-m").value.trim(),p=ov.querySelector("#ac-p").value,p2=ov.querySelector("#ac-p2").value;
 if(!/^[a-z0-9_.-]{3,20}$/.test(n)){err("El nick debe tener de 3 a 20 caracteres: letras sin tilde, números, punto, guion o guion bajo.");return}
 if(m.length<2){err("Dime quién eres para que pueda reconocerte.");return}
 if(p.length<8){err("La contraseña debe tener al menos 8 caracteres.");return}
 if(p!==p2){err("Las contraseñas no coinciden.");return}
 ocupa(true);
 var r=await fetch(cfg.url+"/functions/v1/solicitar-acceso",{method:"POST",headers:{"Content-Type":"application/json",apikey:cfg.key},body:JSON.stringify({nick:n,clave:p,mensaje:m})}).then(function(x){return x.json().then(function(j){return{ok:x.ok,j:j}})}).catch(function(){return null});
 if(!r){ocupa(false);err("No se pudo conectar. Inténtalo de nuevo.");return}
 if(!r.ok){ocupa(false);err((r.j&&r.j.error)||"No se pudo enviar la solicitud.");return}
 pestana="entrar";pantallaAcceso("Solicitud enviada. Cuando la administradora la acepte, entra con tu nick y contraseña.",true)}

async function sal(){try{await sb.auth.signOut()}catch(e){}escribe("acc:ok",null);location.reload()}

/* ---- Mi cuenta y accesos en la portada ---- */
var dlg=null;
function dialogoCuenta(){
 if(!dlg){dlg=document.createElement("dialog");dlg.className="ac-dlg";document.body.appendChild(dlg)}
 var A=window.DAW1_ACC;
 dlg.innerHTML='<form id="cf" novalidate><h3>Mi cuenta</h3><p style="margin:0;color:#52637a">'+esc(A.nick?"Nick: "+A.nick:A.email||"")+'</p><label for="cp1">Nueva contraseña (mínimo 8)</label><input id="cp1" type="password" autocomplete="new-password"><label for="cp2">Repite la contraseña</label><input id="cp2" type="password" autocomplete="new-password"><p class="ac-e" id="ce" role="alert"></p><div class="f"><button type="button" id="cx">Cerrar</button><button class="p">Cambiar contraseña</button></div></form>';
 dlg.querySelector("#cx").onclick=function(){dlg.close()};
 dlg.querySelector("#cf").onsubmit=async function(e){e.preventDefault();var er=dlg.querySelector("#ce"),a=dlg.querySelector("#cp1").value,b=dlg.querySelector("#cp2").value;er.className="ac-e";
  if(a.length<8){er.textContent="Debe tener al menos 8 caracteres.";return}
  if(a!==b){er.textContent="Las contraseñas no coinciden.";return}
  var r=await sb.auth.updateUser({password:a}).catch(function(x){return{error:x}});
  if(r.error){er.textContent=/same/i.test(r.error.message||"")?"Es igual que la actual. Elige otra.":"No se pudo cambiar. Prueba con otra o vuelve a entrar.";return}
  dlg.querySelector("#cp1").value="";dlg.querySelector("#cp2").value="";er.className="ac-e ac-o";er.textContent="Contraseña cambiada."};
 dlg.showModal()}
async function extras(){
 var caja=document.getElementById("sesion");if(!caja||document.getElementById("ac-cuenta"))return;
 var A=window.DAW1_ACC,b=document.createElement("button");b.type="button";b.id="ac-cuenta";b.textContent="Mi cuenta";b.onclick=dialogoCuenta;caja.insertBefore(b,caja.firstChild);
 if(A.admin){var a=document.createElement("a");a.id="ac-admin";a.href="admin.html";a.textContent="Accesos";a.className="ac-lnk";caja.insertBefore(a,caja.firstChild);
  var n=null;try{n=await sb.from("perfiles").select("user_id",{count:"exact",head:true}).eq("estado","pendiente")}catch(e){}
  if(n&&n.count){var i=document.createElement("span");i.className="ac-ins";i.textContent=n.count;i.setAttribute("aria-label",n.count+" solicitudes pendientes");a.appendChild(i)}}}

/* Arranque: si ya había una cuenta comprobada en este navegador, la página se ve de inmediato y se revalida en segundo plano. */
var ptoken=tokenUid(),previo=lee("acc:ok");
if(ptoken&&previo===ptoken){/* optimista */}
else{cierra();if(ptoken)pantallaCarga();else{pantallaAcceso()}}
arranca();
})();
