/* Calendario, cuenta atrás y táctica de estudio. Todos pueden verlo; solo la dueña edita (lo impone la base de datos). */
(function(){
"use strict";
var DUENA="b95066f5-4a68-45cb-9eef-cfa80cd3c9c4";
var $=function(s){return document.querySelector(s)},app=$("#app"),T=window.AG_TEMARIO||[],cfg=window.DAW1_SUPABASE||{};
var sb=window.DAW1_SB||(typeof supabase!=="undefined"&&cfg.url?supabase.createClient(cfg.url,cfg.key):null);
var EV=[],admin=false,mesV=null,diaSel=null,edit=null;
var MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],DS=["lun","mar","mié","jue","vie","sáb","dom"],DL=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
function esc(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function asig(id){return T.filter(function(a){return a.id===id})[0]||{id:id,n:id,c:"#64748b",u:[]}}
function iso(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function deIso(s){var p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2])}
function suma(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n)}
function difDias(a,b){return Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/864e5)}
function bonita(s){var d=deIso(s);return DL[d.getDay()]+" "+d.getDate()+" de "+MES[d.getMonth()]}
function hoyD(){var n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate())}
function meta(e){if(!e.hora)return null;var p=e.fecha.split("-"),h=e.hora.split(":");return new Date(+p[0],+p[1]-1,+p[2],+h[0],+h[1])}
function pasado(e){var m=meta(e);return m?m<new Date():difDias(hoyD(),deIso(e.fecha))<0}
function pendiente(e){return !e.hecho&&!pasado(e)}
function cuenta(e){var n=difDias(hoyD(),deIso(e.fecha)),m=meta(e);if(e.hecho)return"Hecho";if(pasado(e))return"Ya ha pasado";if(m){var s=Math.floor((m-new Date())/1000),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),mi=Math.floor(s%3600/60);return d?"Faltan "+d+" d "+h+" h":h?"Faltan "+h+" h "+mi+" min":"Faltan "+mi+" min"}if(n===0)return"Es hoy";if(n===1)return"Es mañana";return"Faltan "+n+" días"}
function tarjeta(e){var a=asig(e.asignatura);return'<a class="ev'+(e.hecho?" hec":"")+'" style="--ec:'+a.c+'" href="agenda.html?e='+e.id+'"><span class="tag">'+(e.tipo==="examen"?"Examen":"Entrega")+'</span><b>'+esc(e.titulo)+'</b><small>'+esc(a.n)+' · '+bonita(e.fecha)+(e.hora?" · "+e.hora.slice(0,5):"")+'</small><span class="cuenta" data-c="'+e.id+'">'+cuenta(e)+'</span></a>'}
/* Táctica de estudio */
function unidades(e){var a=asig(e.asignatura);return (e.temario||[]).map(function(id){return a.u.filter(function(u){return u.id===id})[0]}).filter(Boolean)}
function tareas(e){var L=[],us=unidades(e);function add(k,t,url,min){L.push({k:k,t:t,url:url,min:min})}
 if(e.tipo==="entrega"){add("e0","Lee el enunciado y apunta qué te piden y cómo se evalúa",null,15);us.forEach(function(u){u.teoria.forEach(function(x){add("t"+u.id+x[1],"Repasa "+x[0],x[1],30)})});add("e1","Haz un primer borrador completo",null,60);add("e2","Revísalo con el enunciado delante y corrige",null,30);return{base:L,fin:[{k:"e3",t:"Comprueba el formato y entrégalo con tiempo de margen",url:null,min:15}],sim:[]}}
 us.forEach(function(u){if(!u.teoria.length&&!u.prac.length&&!u.test.length)add("x"+u.id,"Estudia «"+u.n+"» con tus apuntes",null,50);u.teoria.forEach(function(x){add("t"+u.id+x[1],"Estudia "+x[0]+" y resume lo importante",x[1],40)});u.prac.forEach(function(x){add("p"+u.id+x[1],"Practica con "+x[0],x[1],35)});u.test.forEach(function(x){add("q"+u.id+x[1],"Haz "+x[0]+" y anota tus fallos",x[1],25)})});
 var pr={},sim=[];us.forEach(function(u){u.test.forEach(function(x){if(!pr[x[1]]){pr[x[1]]=1;sim.push({k:"s"+x[1],t:"Simulacro: haz "+x[0]+" sin mirar los apuntes",url:x[1],min:40})}})});if(!sim.length)sim.push({k:"s0",t:"Simulacro: resuelve ejercicios sin mirar los apuntes y con tiempo limitado",url:null,min:45});
 return{base:L,sim:sim,fin:[{k:"f0",t:"Repaso ligero de tus fallos y resúmenes. Prepara lo que necesites y descansa",url:null,min:30}]}}
function plan(e){var t=tareas(e),ini=deIso((e.created_at||iso(new Date())).slice(0,10)),hoy=hoyD(),fe=deIso(e.fecha);if(ini>hoy)ini=hoy;var D=[],n=difDias(ini,fe);
 if(n<=0){return{dias:[{f:iso(hoy),ts:t.base.concat(t.sim,t.fin)}],min:0}}
 for(var i=0;i<n;i++)D.push({f:iso(suma(ini,i)),ts:[]});
 var nor=n,fin=[];
 if(n>=2){nor--;D[n-1].ts=t.fin.slice();fin=[]}else fin=t.fin;
 if(n>=4&&t.sim.length){nor--;D[n-2].ts=t.sim.slice()}else fin=t.sim.concat(fin);
 var L=t.base.concat(fin),tot=L.reduce(function(a,x){return a+x.min},0),ac=0;L.forEach(function(x){var ix=Math.min(nor-1,Math.floor(ac/(tot||1)*nor));D[ix].ts.push(x);ac+=x.min});
 var vistas=[];D.forEach(function(d,i){if(i<nor&&!d.ts.length&&vistas.length){var p=vistas[vistas.length-1];d.ts.push({k:"r"+d.f,t:"Repaso corto de lo anterior: "+p.t.replace(/^(Estudia|Practica con|Haz|Repasa) /,""),url:p.url,min:15})}d.ts.forEach(function(x){if(x.k.charAt(0)!=="r")vistas.push(x)})});
 var max=D.reduce(function(a,d){return Math.max(a,d.ts.reduce(function(b,x){return b+x.min},0))},0);return{dias:D,min:max}}
function leeH(id){try{return JSON.parse(localStorage.getItem("agenda:"+id))||{}}catch(x){return{}}}
function guardaH(id,o){try{localStorage.setItem("agenda:"+id,JSON.stringify(o))}catch(x){}}
function tarea(id,x,H){return'<label class="tar'+(H[x.k]?" ok":"")+'"><input type="checkbox" data-k="'+esc(x.k)+'"'+(H[x.k]?" checked":"")+'><span>'+(x.url?'<a href="'+esc(x.url)+'">'+esc(x.t)+'</a>':esc(x.t))+' <small style="color:var(--suave)">('+x.min+' min)</small></span></label>'}
function vistaEv(e){var a=asig(e.asignatura),us=unidades(e),H=leeH(e.id),p=plan(e),hoy=iso(hoyD());$("#tit").textContent=e.titulo;document.title=e.titulo;$("#vol").href="agenda.html";
 var todas=[];p.dias.forEach(function(d){d.ts.forEach(function(x){todas.push(x)})});var hech=todas.filter(function(x){return H[x.k]}).length,pct=todas.length?Math.round(hech*100/todas.length):0,atr=[];p.dias.forEach(function(d){if(d.f<hoy)d.ts.forEach(function(x){if(!H[x.k])atr.push(x)})});
 var o='<div class="plan-c" style="--ec:'+a.c+'"><span class="tag">'+(e.tipo==="examen"?"Examen":"Entrega")+'</span><h2>'+esc(a.n)+'</h2><p style="margin:2px 0">'+bonita(e.fecha)+(e.hora?" a las "+e.hora.slice(0,5):"")+'</p><p class="cuenta" data-c="'+e.id+'" style="font-weight:700;font-size:1.2rem;margin:4px 0;color:'+a.c+'">'+cuenta(e)+'</p>';
 if(us.length)o+='<p style="margin:6px 0 0"><b>Entra:</b> '+us.map(function(u){return esc(u.n)}).join(", ")+'</p>';if(e.notas)o+='<p style="margin:6px 0 0;white-space:pre-line">'+esc(e.notas)+'</p>';
 if(admin)o+='<div class="f" style="justify-content:flex-start"><button type="button" class="b" id="evEd">Editar</button><button type="button" class="b" id="evHe">'+(e.hecho?"Marcar como pendiente":"Marcar como hecho")+'</button></div>';o+='</div>';
 if(!e.hecho&&!pasado(e)){o+='<div class="sec2"><h2>Táctica de estudio</h2>';
  if(!us.length&&e.tipo==="examen")o+='<div class="nota">Todavía no se ha indicado el temario. La táctica será más útil cuando se elija.</div>';
  o+='<div class="barra" role="img" aria-label="'+pct+' % hecho"><i style="width:'+pct+'%"></i></div><p style="margin:0 0 8px;color:var(--suave)">'+hech+' de '+todas.length+' tareas hechas. Se guardan en este navegador.</p>';
  if(p.min>e.minutos)o+='<div class="nota">Vas justa de tiempo: algún día necesitarás unos '+p.min+' minutos, más de los '+e.minutos+' previstos.</div>';
  if(atr.length)o+='<div class="dp hoy"><h3>Pendiente de días anteriores</h3>'+atr.map(function(x){return tarea(e.id,x,H)}).join("")+'</div>';
  p.dias.forEach(function(d,i){if(d.f<hoy)return;var m=d.ts.reduce(function(s,x){return s+x.min},0);o+='<div class="dp'+(d.f===hoy?" hoy":"")+'"><h3>'+(d.f===hoy?"Hoy, ":"")+bonita(d.f)+' <small>· '+m+' min</small></h3>'+d.ts.map(function(x){return tarea(e.id,x,H)}).join("")+'</div>'});
  o+='<div class="dp"><h3>'+bonita(e.fecha)+'</h3><p style="margin:0">'+(e.tipo==="examen"?"¡Día del examen! Lee cada pregunta con calma y empieza por lo que mejor sepas.":"Último día para entregar.")+'</p></div></div>'}
 app.innerHTML=o;
 app.querySelectorAll(".tar input").forEach(function(c){c.onchange=function(){var h=leeH(e.id);if(c.checked)h[c.dataset.k]=1;else delete h[c.dataset.k];guardaH(e.id,h);var y=window.scrollY;vistaEv(e);window.scrollTo(0,y)}});
 if(admin){$("#evEd").onclick=function(){abre(e)};$("#evHe").onclick=async function(){var r=await sb.from("agenda").update({hecho:!e.hecho}).eq("id",e.id);if(!r.error){e.hecho=!e.hecho;vistaEv(e)}}}}
/* Calendario */
function vistaCal(){var pen=EV.filter(pendiente).sort(function(a,b){return(a.fecha+(a.hora||"")).localeCompare(b.fecha+(b.hora||""))}),o='<div class="sec2"><div class="calcab"><h2 style="text-transform:none">Cuenta atrás</h2>'+(admin?'<button type="button" class="b p" id="btN">+ Añadir</button>':"")+'</div>'+(pen.length?'<div class="cd">'+pen.map(tarjeta).join("")+'</div>':'<p>No hay fechas pendientes.</p>')+'</div>';
 var y=mesV.getFullYear(),m=mesV.getMonth(),pri=new Date(y,m,1),hu=(pri.getDay()+6)%7,nd=new Date(y,m+1,0).getDate(),h=iso(hoyD());
 o+='<div class="sec2"><div class="calcab"><button type="button" class="b" id="mP" aria-label="Mes anterior">‹</button><h2>'+MES[m]+' '+y+'</h2><button type="button" class="b" id="mH">Hoy</button><button type="button" class="b" id="mS" aria-label="Mes siguiente">›</button></div><div class="mes">'+DS.map(function(d){return'<div class="ds">'+d+'</div>'}).join("");
 for(var i=0;i<hu;i++)o+='<div class="dia vac"></div>';
 for(var d=1;d<=nd;d++){var f=iso(new Date(y,m,d)),es=EV.filter(function(e){return e.fecha===f});o+='<button type="button" class="dia'+(f===h?" hoy":"")+'" data-f="'+f+'" aria-pressed="'+(f===diaSel)+'" aria-label="'+d+' de '+MES[m]+(es.length?", "+es.length+" evento"+(es.length>1?"s":""):"")+'"><span>'+d+'</span><span class="pts">'+es.map(function(e){return'<i class="pt'+(e.tipo==="entrega"?" ent":"")+'" style="--ec:'+asig(e.asignatura).c+'"></i>'}).join("")+'</span>'+es.map(function(e){return'<span class="chip" style="--ec:'+asig(e.asignatura).c+'">'+esc(e.titulo)+'</span>'}).join("")+'</button>'}
 o+='</div><div class="ley"><span><i class="pt" style="--ec:#64748b"></i> Examen</span><span><i class="pt ent" style="--ec:#64748b"></i> Entrega</span></div></div>';
 if(diaSel){var ds=EV.filter(function(e){return e.fecha===diaSel});o+='<div class="sec2"><div class="calcab"><h2 style="text-transform:none">'+bonita(diaSel)+'</h2>'+(admin?'<button type="button" class="b" id="btD">+ Añadir este día</button>':"")+'</div>'+(ds.length?'<div class="cd">'+ds.map(tarjeta).join("")+'</div>':'<p>Nada este día.</p>')+'</div>'}
 var pa=EV.filter(function(e){return!pendiente(e)}).sort(function(a,b){return b.fecha.localeCompare(a.fecha)});if(pa.length)o+='<details class="fold"><summary><span><b>Pasados y hechos</b></span></summary><div class="in"><div class="cd">'+pa.map(tarjeta).join("")+'</div></div></details>';
 app.innerHTML=o;
 $("#mP").onclick=function(){mesV=new Date(y,m-1,1);vistaCal()};$("#mS").onclick=function(){mesV=new Date(y,m+1,1);vistaCal()};$("#mH").onclick=function(){mesV=hoyD();diaSel=null;vistaCal()};
 app.querySelectorAll(".dia[data-f]").forEach(function(b){b.onclick=function(){diaSel=diaSel===b.dataset.f?null:b.dataset.f;vistaCal()}});
 if($("#btN"))$("#btN").onclick=function(){abre(null)};if($("#btD"))$("#btD").onclick=function(){abre(null,diaSel)}}
/* Formulario */
var dl=$("#dlg");
function temario(sel){var a=asig($("#fA").value);$("#fTem").innerHTML=a.u.map(function(u){return'<label><input type="checkbox" value="'+u.id+'"'+((sel||[]).indexOf(u.id)>=0?" checked":"")+'> <span>'+esc(u.n)+'</span></label>'}).join("")||"<span>Sin temario</span>"}
function autoT(){var t=document.querySelector('[name=tipo]:checked').value,a=asig($("#fA").value);return(t==="examen"?"Examen de ":"Entrega de ")+a.n}
var tituloAuto=true;
function abre(e,f){edit=e;$("#dT").textContent=e?"Editar":"Añadir";$("#er").textContent="";$("#fA").innerHTML=T.map(function(a){return'<option value="'+a.id+'">'+esc(a.n)+'</option>'}).join("");document.querySelector('[name=tipo][value='+(e?e.tipo:"examen")+']').checked=true;$("#fA").value=e?e.asignatura:T[0].id;temario(e?e.temario:[]);$("#fT").value=e?e.titulo:autoT();tituloAuto=!e;$("#fF").value=e?e.fecha:(f||"");$("#fH").value=e&&e.hora?e.hora.slice(0,5):"";$("#fM").value=e?e.minutos:60;$("#fN").value=e?e.notas:"";$("#dBor").hidden=!e;dl.showModal()}
$("#fT").oninput=function(){tituloAuto=false};
function cambiaA(){temario([]);if(tituloAuto)$("#fT").value=autoT()}
$("#fA").onchange=cambiaA;document.querySelectorAll("[name=tipo]").forEach(function(r){r.onchange=function(){if(tituloAuto)$("#fT").value=autoT()}});
$("#dCan").onclick=function(){dl.close()};
$("#dBor").onclick=async function(){if(!edit||!confirm("¿Borrar «"+edit.titulo+"»?"))return;var r=await sb.from("agenda").delete().eq("id",edit.id);if(r.error){$("#er").textContent="No se ha podido borrar.";return}dl.close();location.href="agenda.html"};
$("#frm").onsubmit=async function(ev){ev.preventDefault();var fila={tipo:document.querySelector("[name=tipo]:checked").value,asignatura:$("#fA").value,titulo:$("#fT").value.trim(),fecha:$("#fF").value,hora:$("#fH").value||null,temario:Array.prototype.map.call($("#fTem").querySelectorAll("input:checked"),function(c){return c.value}),minutos:+$("#fM").value,notas:$("#fN").value.trim()};if(!fila.titulo||!fila.fecha)return;var b=this.querySelector(".p");b.disabled=true;var r=edit?await sb.from("agenda").update(fila).eq("id",edit.id).select().single():await sb.from("agenda").insert(fila).select().single();b.disabled=false;if(r.error){$("#er").textContent="No se ha podido guardar. Comprueba que has iniciado sesión.";return}dl.close();location.href="agenda.html?e="+r.data.id};
/* Inicio */
async function inicio(){mesV=hoyD();if(!sb){app.innerHTML="<p>No se ha podido conectar con el calendario.</p>";return}
 try{var s=await sb.auth.getSession();admin=!!(s.data&&s.data.session&&s.data.session.user&&s.data.session.user.id===DUENA)}catch(x){}
 var r=await sb.from("agenda").select("*").order("fecha");if(r.error){app.innerHTML="<p>No se ha podido cargar el calendario. Inténtalo de nuevo.</p>";return}EV=r.data||[];
 var id=new URLSearchParams(location.search).get("e"),e=EV.filter(function(x){return x.id===id})[0];if(id&&e)vistaEv(e);else vistaCal();
 setInterval(function(){document.querySelectorAll("[data-c]").forEach(function(n){var q=EV.filter(function(x){return x.id===n.dataset.c})[0];if(q)n.textContent=cuenta(q)})},30000)}
window.AGENDA={plan:plan,tareas:tareas};inicio();
})();
