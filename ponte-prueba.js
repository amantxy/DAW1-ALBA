/* Ponte a prueba común: nivel, 40 al azar sin repetir o todas, práctica y repaso de fallos. */
(function(){
var cfg=document.currentScript.dataset,PREF=cfg.clave,PARAM=cfg.param,VIEJO=+cfg.viejo||40;
var $=function(s){return document.querySelector(s)};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function lee(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function guarda(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function mezcla(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var Q=new URLSearchParams(location.search),ut=Q.get(PARAM);if(["1","2","3","todas"].indexOf(ut)<0)ut="1";
var nv=Q.get("nivel");if(["F","M","D"].indexOf(nv)<0)nv="";
var cant=Q.get("n")==="todas"?"todas":"40";
var box=$("#juego"),sel=$("#ut"),sN=$("#nv"),sC=$("#cant");sel.value=ut;
function va(){var p=new URLSearchParams();p.set(PARAM,sel.value);if(sN.value)p.set("nivel",sN.value);if(sC.value==="todas")p.set("n","todas");location.search="?"+p}
sel.onchange=sN.onchange=sC.onchange=va;
var UNIS=ut==="todas"?[1,2,3]:[+ut],TODAS=[],visto={};
UNIS.forEach(function(u){BANCO[u].forEach(function(q,i){var k=q[0].trim().toLowerCase();if(visto[k])return;visto[k]=1;TODAS.push({u:u,i:i,q:q,n:NIVEL[u].charAt(i)})})});
var NOM={F:"Fácil",M:"Medio",D:"Difícil"};
function cuenta(n){return TODAS.filter(function(p){return p.n===n}).length}
sN.options[0].textContent="Todos los niveles ("+TODAS.length+")";
["F","M","D"].forEach(function(n,i){sN.options[i+1].textContent=NOM[n]+" ("+cuenta(n)+")"});
sN.value=nv;
var P=nv?TODAS.filter(function(p){return p.n===nv}):TODAS;
sC.options[1].textContent="Todas ("+P.length+")";sC.value=cant;
var KF=PREF+ut;
function datos(){var d=lee(KF,{best:0,fails:{}});if(d.nota===undefined)d.nota=d.best?d.best/VIEJO*10:0;return d}
function coma(n){return n.toFixed(1).replace(".",",")}
function clave(p){return p.u+"-"+p.i}
function resumen(){var d=datos(),f=P.filter(function(p){return d.fails[clave(p)]}).length,c=cant==="todas"?P.length:Math.min(40,P.length);
 $("#res").textContent=c+" preguntas en el test"+(cant==="40"&&P.length<40?" (de este nivel solo hay "+P.length+")":"")+" · Mejor nota: "+coma(d.nota||0)+" sobre 10 · Por repasar: "+f;$("#btF").disabled=!f}
function opcs(p){return mezcla(p.q.slice(1))}
function lista(){var L=mezcla(P);return cant==="todas"?L:L.slice(0,40)}
function examen(){
 var L=lista();box.textContent="";box.append(el("p","lead","Elige una respuesta en cada pregunta y corrige al final. No penaliza."));
 var cont=el("p","sc","0 de "+L.length+" respondidas");box.append(cont);var res=[];
 L.forEach(function(p,n){var w=el("div","q");w.append(el("p","qt",(n+1)+". "+p.q[0]));var ops=el("div","ops");opcs(p).forEach(function(t){var b=el("button","op",t);b.type="button";b.onclick=function(){[].forEach.call(ops.children,function(x){x.classList.remove("sel")});b.classList.add("sel");res[n]=t;cont.textContent=res.filter(Boolean).length+" de "+L.length+" respondidas"};ops.append(b)});w.append(ops);box.append(w)});
 var fin=el("button","p","Corregir test");fin.type="button";fin.onclick=function(){
  var sin=L.length-res.filter(Boolean).length;if(sin&&!confirm("Te quedan "+sin+" sin responder. ¿Corregir igualmente?"))return;
  var ok=0,d=datos(),salida=[];L.forEach(function(p,n){var bien=res[n]===p.q[1];if(bien){ok++;delete d.fails[clave(p)]}else{d.fails[clave(p)]=true;salida.push({p:p,tu:res[n]})}});
  var nota=ok/L.length*10;d.nota=Math.max(d.nota||0,nota);guarda(KF,d);box.textContent="";
  box.append(el("h3","","Resultado: "+ok+" de "+L.length+" ("+coma(nota)+" sobre 10)"));box.append(el("p","lead","Nota orientativa, sin penalización por errores."));
  if(salida.length){box.append(el("h3","","Preguntas falladas"));salida.forEach(function(x){var w=el("div","q ko");w.append(el("p","qt",x.p.q[0]));if(x.tu)w.append(el("p","","Tu respuesta: "+x.tu));w.append(el("p","bien","Correcta: "+x.p.q[1]));box.append(w)})}
  resumen();box.scrollIntoView()};box.append(fin);box.scrollIntoView();
}
function practica(L){
 var idx=0,ok=0;L=mezcla(L);
 function una(){box.textContent="";if(idx>=L.length){box.append(el("h3","","Has terminado: "+ok+" de "+L.length+" correctas"));resumen();return}
  var p=L[idx];box.append(el("p","sc","Pregunta "+(idx+1)+" de "+L.length+" · "+ok+" correctas"));var w=el("div","q");w.append(el("p","qt",p.q[0]));var ops=el("div","ops"),fb=el("p","fb");fb.setAttribute("role","status");var hecho=false,sig=el("button","p","Siguiente");sig.type="button";sig.hidden=true;sig.onclick=function(){idx++;una()};
  opcs(p).forEach(function(t){var b=el("button","op",t);b.type="button";b.onclick=function(){if(hecho)return;hecho=true;var bien=t===p.q[1],d=datos();if(bien){ok++;delete d.fails[clave(p)];b.classList.add("si");fb.textContent="Correcto."}else{d.fails[clave(p)]=true;b.classList.add("no");fb.textContent="No es correcto. La respuesta es: "+p.q[1]+"."}guarda(KF,d);sig.hidden=false;resumen()};ops.append(b)});
  w.append(ops,fb,sig);box.append(w)}
 una();box.scrollIntoView();
}
$("#btE").onclick=examen;
$("#btP").onclick=function(){practica(lista())};
$("#btF").onclick=function(){var d=datos();practica(P.filter(function(p){return d.fails[clave(p)]}))};
resumen();
})();
