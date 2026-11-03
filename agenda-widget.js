/* Cuenta atrás de la portada: visible para todos. */
(function(){
"use strict";
var C=document.getElementById("proximos"),cfg=window.DAW1_SUPABASE||{},T=window.AG_TEMARIO||[];if(!C)return;
var sb=window.DAW1_SB||(typeof supabase!=="undefined"&&cfg.url?supabase.createClient(cfg.url,cfg.key):null),EV=[];
var MES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
function esc(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function asig(id){return T.filter(function(a){return a.id===id})[0]||{n:id,c:"#64748b"}}
function dif(s){var p=s.split("-"),n=new Date();return Math.round((Date.UTC(+p[0],+p[1]-1,+p[2])-Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()))/864e5)}
function meta(e){if(!e.hora)return null;var p=e.fecha.split("-"),h=e.hora.split(":");return new Date(+p[0],+p[1]-1,+p[2],+h[0],+h[1])}
function vivo(e){if(e.hecho)return false;var m=meta(e);return m?m>new Date():dif(e.fecha)>=0}
function texto(e){var m=meta(e),n=dif(e.fecha);if(m){var s=Math.floor((m-new Date())/1000),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),mi=Math.floor(s%3600/60);return d?"Faltan "+d+" d "+h+" h":h?"Faltan "+h+" h "+mi+" min":"Faltan "+mi+" min"}return n===0?"Es hoy":n===1?"Es mañana":"Faltan "+n+" días"}
function pinta(){var L=EV.filter(vivo).slice(0,6),o='<div class="pr-cab"><h2>Próximos exámenes y entregas</h2><a href="agenda.html">Ver calendario</a></div>';
 if(!L.length)o+='<p class="pr-vac">No hay fechas pendientes.</p>';else o+='<div class="pr-lista">'+L.map(function(e){var a=asig(e.asignatura),p=e.fecha.split("-");return'<a class="pr-ev" style="--ec:'+a.c+'" href="agenda.html?e='+e.id+'"><span class="pr-t"><b>'+esc(e.titulo)+'</b><small>'+(e.tipo==="examen"?"Examen":"Entrega")+' · '+(+p[2])+' '+MES[+p[1]-1]+(e.hora?" · "+e.hora.slice(0,5):"")+'</small></span><span class="pr-c">'+texto(e)+'</span></a>'}).join("")+'</div>';
 C.innerHTML=o}
(async function(){if(!sb){C.innerHTML='<div class="pr-cab"><h2>Próximos exámenes y entregas</h2><a href="agenda.html">Ver calendario</a></div>';return}
 var hoy=new Date(),h=hoy.getFullYear()+"-"+("0"+(hoy.getMonth()+1)).slice(-2)+"-"+("0"+hoy.getDate()).slice(-2);
 var r=await sb.from("agenda").select("id,tipo,asignatura,titulo,fecha,hora,hecho").gte("fecha",h).order("fecha").order("hora");
 if(r.error){C.innerHTML='<div class="pr-cab"><h2>Próximos exámenes y entregas</h2><a href="agenda.html">Ver calendario</a></div>';return}EV=r.data||[];pinta();setInterval(pinta,30000)})();
})();
