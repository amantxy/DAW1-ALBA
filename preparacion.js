/* Preparación de exámenes dentro de cada asignatura: se crea sola con las fechas del calendario. */
(function(){
"use strict";
var S=document.currentScript,AS=S.dataset.asignatura,MODO=S.dataset.modo||"indice",OMITE=(S.dataset.omite||"").split(",");
var cfg=window.DAW1_SUPABASE||{},P=window.AG_PLAN;
function arranca(){
 var sb=window.DAW1_SB||(typeof supabase!=="undefined"&&cfg.url?supabase.createClient(cfg.url,cfg.key):null);if(!sb||!P)return;
 sb.from("agenda").select("*").eq("asignatura",AS).eq("tipo","examen").eq("hecho",false).gte("fecha",P.iso(new Date())).order("fecha").then(function(r){if(r.error||!r.data)return;var L=r.data.filter(function(e){return OMITE.indexOf(e.fecha)<0});if(L.length)pinta(L)})}
function esc(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function falta(e){var n=P.difDias(P.hoy(),P.deIso(e.fecha));return n===0?"Es hoy":n===1?"Es mañana":"Faltan "+n+" días"}
function hoyToca(e){var H={};try{H=JSON.parse(localStorage.getItem("agenda:"+e.id))||{}}catch(x){}var h=P.iso(new Date()),o=[];P.plan(e).dias.forEach(function(d){if(d.f<=h)d.ts.forEach(function(t){if(!H[t.k])o.push(t)})});if(!o.length){var sig=P.plan(e).dias.filter(function(d){return d.f>h})[0];return{L:sig?sig.ts:[],prox:sig?sig.f:null}}return{L:o,prox:null}}
function bloque(e){var us=P.unidades(e),t=hoyToca(e),raiz=MODO==="indice"||MODO==="pagina"?"../":"",o='<details class="fold prep"'+(MODO==="pagina"?" open":"")+'><summary><span><b>'+esc(e.titulo)+'</b><small>'+esc(P.bonita(e.fecha))+' · '+falta(e)+'</small></span></summary><div class="in">';
 o+=us.length?'<p><b>Entra:</b> '+us.map(function(u){return esc(u.n)}).join(", ")+'</p>':'<p class="prep-av">Todavía no se ha indicado el temario. Sin él, la preparación solo incluye un repaso general.</p>';
 if(t.L.length){o+='<p><b>'+(t.prox?"Lo siguiente, el "+esc(P.bonita(t.prox)):"Hoy toca")+':</b></p><ul class="prep-l">'+t.L.slice(0,5).map(function(x){return'<li>'+(x.url?'<a href="'+esc(raiz+x.url)+'">'+esc(x.t)+'</a>':esc(x.t))+' <small>('+x.min+' min)</small></li>'}).join("")+'</ul>';if(t.L.length>5)o+='<p class="prep-av">Y '+(t.L.length-5)+' tareas más.</p>'}
 o+='<p><a class="prep-b" href="'+raiz+'agenda.html?e='+esc(e.id)+'">Ver la preparación día a día</a></p></div></details>';return o}
function pinta(L){var st=document.createElement("style");st.textContent=".prep-l{margin:4px 0 10px;padding-left:20px}.prep-l li{margin:5px 0}.prep-l small,.prep-av{color:var(--suave)}.prep-b{display:inline-flex;align-items:center;min-height:44px;padding:8px 14px;border-radius:10px;background:var(--c);color:#fff!important;font-weight:600;text-decoration:none}.prep-wrap{margin:0 0 14px}.prep-tit{font-size:1.05rem;margin:0 0 8px}details.fold.prep{margin-top:26px}@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .prep-b{color:#0b1220!important}}:root[data-theme=dark] .prep-b{color:#0b1220!important}";document.head.appendChild(st);var h=L.map(bloque).join("");
 var w=document.createElement("div");w.className="prep-wrap";w.innerHTML=h;
 if(MODO==="pagina"){var cont=document.querySelector(".wrap:not(.cab):not(.hero .wrap)")||document.querySelector("body>.wrap");Array.prototype.forEach.call(document.querySelectorAll("body>.wrap"),function(x){if(x.querySelector(".goal"))cont=x});cont.insertBefore(w,cont.firstChild);return}
 var todas=Array.prototype.slice.call(document.querySelectorAll("body>.wrap>details.fold")),pp=todas.filter(function(d){var b=d.querySelector(":scope>summary b");return b&&/^Ponte a prueba/.test(b.textContent)})[0];
 if(pp){var in0=pp.querySelector(":scope>.in");in0.insertBefore(w,in0.firstChild);pp.open=true;return}
 var cab=document.createElement("details");cab.className="fold";cab.innerHTML='<summary><span><b>Preparación de exámenes</b><small>'+L.length+(L.length>1?" exámenes":" examen")+' · el más cercano: '+esc(P.bonita(L[0].fecha))+'</small></span></summary><div class="in"></div>';cab.querySelector(".in").appendChild(w);var pad=(todas[0]&&todas[0].parentNode)||document.querySelector("body>.wrap");pad.insertBefore(cab,todas[0]||pad.firstChild)}
arranca();
})();
