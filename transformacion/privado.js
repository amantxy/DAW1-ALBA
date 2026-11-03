/* Zona privada de cada unidad: solo se carga con la sesión iniciada. */
(function(){
var box=document.getElementById("zona"),n=box&&box.dataset.ut,sb=window.DAW1_SB,ultimo;
if(!sb)return;
function muestra(v){[].forEach.call(document.querySelectorAll("[data-priv]"),function(e){e.hidden=!v})
 if(v&&location.hash==="#privado"){var d=document.getElementById("privado");if(d){d.open=true;d.scrollIntoView()}}}
document.addEventListener("daw1-auth",function(e){muestra(!!e.detail)});
sb.auth.getSession().then(function(r){muestra(!!r.data.session)});
if(!box)return;
var SHIM='<script>(function(){try{window.localStorage.length;return}catch(e){}var m={};Object.defineProperty(window,"localStorage",{value:{getItem:function(k){return k in m?m[k]:null},setItem:function(k,v){m[k]=String(v)},removeItem:function(k){delete m[k]},clear:function(){m={}}}})})();<\/script>';
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function aviso(t){box.textContent="";box.append(el("p","lead",t))}
function subir(){var a=el("a","bt","Subir material a esta unidad");a.href="../docs.html?s=transformacion&u=UT"+n;return a}
function abreHtml(d,caja,boton){boton.disabled=true;sb.storage.from("documentos").download(d.ruta).then(function(r){boton.disabled=false;if(r.error){caja.textContent="No se pudo abrir.";return}return r.data.text().then(function(t){caja.textContent="";caja.append(el("p","lead","Lo que escribas aquí no se guarda al cerrar. Usa su botón de descarga si lo tiene."));var f=document.createElement("iframe");f.setAttribute("sandbox","allow-scripts allow-modals allow-downloads allow-forms");f.title=d.titulo;f.className="fr";f.srcdoc=/<head[^>]*>/i.test(t)?t.replace(/<head[^>]*>/i,function(m){return m+SHIM}):SHIM+t;caja.append(f)})})}
async function pinta(u){
 var id=u&&u.id;if(id===ultimo)return;ultimo=id;
 if(!u){box.textContent="";return}
 aviso("Cargando…");
 try{
  var q=await Promise.all([sb.from("documentos").select("*").eq("asignatura","transformacion").eq("unidad","UT"+n).order("titulo"),sb.from("contenido_privado").select("html").eq("clave","u"+n).maybeSingle()]);
  if(q[0].error)throw q[0].error;if(q[1].error)throw q[1].error;
  box.textContent="";var docs=q[0].data||[];
  box.append(el("h3","","Material de clase"));
  if(!docs.length){box.append(el("p","lead","Aún no has subido el material de esta unidad."))}
  for(var i=0;i<docs.length;i++){(function(d){
   var w=el("div","pv");w.append(el("b","",d.titulo));
   if(d.tipo==="video"){var v=document.createElement("video");v.controls=true;v.playsInline=true;v.preload="metadata";w.append(v);sb.storage.from("documentos").createSignedUrl(d.ruta,10800).then(function(r){if(!r.error)v.src=r.data.signedUrl})}
   else if(d.tipo==="html"){var c=el("div"),b=el("button","bt2","Abrir "+d.titulo);b.type="button";b.onclick=function(){abreHtml(d,c,b)};w.append(b,c)}
   else{var a=el("a","","Abrir en Mis documentos");a.href="../docs.html?s=transformacion#"+d.id;w.append(a)}
   box.append(w)})(docs[i])}
  box.append(subir());
  if(q[1].data){var p=el("div");p.innerHTML=typeof DOMPurify!=="undefined"?DOMPurify.sanitize(q[1].data.html):"";box.append(p)}
 }catch(e){ultimo=undefined;aviso("No se pudo cargar. Comprueba la conexión y recarga.")}
}
document.addEventListener("daw1-auth",function(e){pinta(e.detail)});
sb.auth.getSession().then(function(r){pinta(r.data.session?r.data.session.user:null)});
})();
