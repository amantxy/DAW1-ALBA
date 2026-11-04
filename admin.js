/* Panel de accesos: solo la administradora aprobada. Aprobar, rechazar, quitar acceso y poner una contraseña nueva. */
(function(){
"use strict";
var zona=document.getElementById("zona"),msg=document.getElementById("msg"),dc=document.getElementById("dc"),cfg=window.DAW1_SUPABASE||{},sb=null,yo=null,destino=null;
function esc(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function aviso(t,mal){msg.textContent=t||"";msg.className=t?(mal?"mal":"bien"):""}
function fecha(s){try{return new Date(s).toLocaleString("es-ES",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch(e){return""}}
function fila(p,btns){
 var nombre=p.user_id===yo?"Tú (administradora)":(p.nick||"Cuenta sin nick");
 return '<div class="fila"><div class="q"><b>'+esc(nombre)+'</b>'+(p.mensaje?'<small>«'+esc(p.mensaje)+'»</small>':'')+'<small>Solicitud: '+esc(fecha(p.creado))+'</small></div><div class="bt">'+btns+'</div></div>'}
function b(acc,id,txt,cl){return '<button type="button" class="'+(cl||"")+'" data-a="'+acc+'" data-id="'+esc(id)+'">'+txt+'</button>'}
async function carga(){
 var q=await sb.from("perfiles").select("user_id,nick,estado,es_admin,mensaje,creado").order("creado",{ascending:false});
 if(q.error){zona.innerHTML='<p class="vacio">No se pudo cargar la lista. Recarga la página.</p>';return}
 var L=q.data,pe=L.filter(function(p){return p.estado==="pendiente"}),ap=L.filter(function(p){return p.estado==="aprobado"}),re=L.filter(function(p){return p.estado==="rechazado"});
 var h='<h2>Pendientes <small>('+pe.length+')</small></h2>'+(pe.length?pe.map(function(p){return fila(p,b("aprobado",p.user_id,"Aprobar","ok")+b("rechazado",p.user_id,"Rechazar","no"))}).join(""):'<p class="vacio">No hay solicitudes pendientes.</p>');
 h+='<h2>Con acceso <small>('+ap.length+')</small></h2>'+ap.map(function(p){return fila(p,p.user_id===yo?"":b("clave",p.user_id,"Nueva contraseña")+b("rechazado",p.user_id,"Quitar acceso","no"))}).join("");
 if(re.length)h+='<h2>Rechazadas <small>('+re.length+')</small></h2>'+re.map(function(p){return fila(p,b("aprobado",p.user_id,"Aprobar","ok"))}).join("");
 zona.innerHTML=h;
 [].forEach.call(zona.querySelectorAll("button[data-a]"),function(x){x.onclick=function(){accion(x)}})}
async function accion(x){
 var a=x.dataset.a,id=x.dataset.id;aviso("");
 if(a==="clave"){destino=id;var f=zona.querySelector('[data-id="'+id+'"]').closest(".fila").querySelector("b").textContent;document.getElementById("dn").textContent=f;document.getElementById("c1").value="";document.getElementById("c2").value="";document.getElementById("de").textContent="";dc.showModal();return}
 if(a==="rechazado"&&!confirm("¿Seguro que quieres quitar el acceso a esta cuenta?"))return;
 x.disabled=true;
 var r=await sb.from("perfiles").update({estado:a}).eq("user_id",id);
 if(r.error){aviso("No se pudo guardar el cambio.",true);x.disabled=false;return}
 aviso(a==="aprobado"?"Acceso concedido.":"Acceso retirado.");carga()}
document.getElementById("dx").onclick=function(){dc.close()};
document.getElementById("fc").onsubmit=async function(e){
 e.preventDefault();var a=document.getElementById("c1").value,c=document.getElementById("c2").value,er=document.getElementById("de");er.textContent="";
 if(a.length<8){er.textContent="Debe tener al menos 8 caracteres.";return}
 if(a!==c){er.textContent="Las contraseñas no coinciden.";return}
 var s=await sb.auth.getSession(),t=s.data&&s.data.session&&s.data.session.access_token;
 var r=await fetch(cfg.url+"/functions/v1/admin-clave",{method:"POST",headers:{"Content-Type":"application/json",apikey:cfg.key,Authorization:"Bearer "+t},body:JSON.stringify({user_id:destino,clave:a})}).then(function(x){return x.json().then(function(j){return{ok:x.ok,j:j}})}).catch(function(){return null});
 if(!r||!r.ok){er.textContent=(r&&r.j&&r.j.error)||"No se pudo conectar.";return}
 dc.close();aviso("Contraseña cambiada. Díselo a esa persona por un canal privado.")};
function inicia(A){
 if(!A||!A.admin){zona.innerHTML='<p class="vacio">Esta página es solo para la administradora.</p>';return}
 sb=window.DAW1_SB;yo=A.uid;carga()}
if(window.DAW1_ACC&&window.DAW1_ACC.listo)inicia(window.DAW1_ACC);else document.addEventListener("daw1-acceso",function(e){inicia(e.detail)});
})();
