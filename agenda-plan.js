/* Reparte el temario de un examen o entrega en tareas por días. */
window.AG_PLAN=(function(){
"use strict";
var T=window.AG_TEMARIO||[],MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],DL=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
function asig(id){return T.filter(function(a){return a.id===id})[0]||{id:id,n:id,c:"#64748b",u:[]}}
function iso(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function deIso(s){var p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2])}
function suma(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n)}
function difDias(a,b){return Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/864e5)}
function hoyD(){var n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate())}
function bonita(s){var d=deIso(s);return DL[d.getDay()]+" "+d.getDate()+" de "+MES[d.getMonth()]}
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
return{asig:asig,iso:iso,deIso:deIso,difDias:difDias,hoy:hoyD,bonita:bonita,unidades:unidades,tareas:tareas,plan:plan}})();
