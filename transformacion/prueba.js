/* Ponte a prueba: examen aleatorio de 40 preguntas, práctica y repaso de fallos. */
(function(){
var $=function(s){return document.querySelector(s)};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function lee(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function guarda(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function mezcla(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var ut=new URLSearchParams(location.search).get("ut");if(["1","2","3","todas"].indexOf(ut)<0)ut="1";
var box=$("#juego"),sel=$("#ut");sel.value=ut;sel.onchange=function(){location.search="?ut="+sel.value};
var UNIS=ut==="todas"?[1,2,3]:[+ut],P=[];UNIS.forEach(function(u){BANCO[u].forEach(function(q,i){P.push({u:u,i:i,q:q})})});
var KF="tsp:p"+ut;
function datos(){return lee(KF,{best:0,fails:{}})}
function clave(p){return p.u+"-"+p.i}
function resumen(){var d=datos(),f=P.filter(function(p){return d.fails[clave(p)]}).length;$("#res").textContent=P.length+" preguntas · Mejor examen: "+d.best+" de 40 · Por repasar: "+f;$("#btF").disabled=!f}
function opcs(p){return mezcla(p.q.slice(1))}
function examen(){
 var L=mezcla(P).slice(0,40);box.textContent="";box.append(el("p","lead","Elige una respuesta en cada pregunta y corrige al final. No penaliza."));
 var cont=el("p","sc","0 de "+L.length+" respondidas");box.append(cont);var res=[];
 L.forEach(function(p,n){var w=el("div","q");w.append(el("p","qt",(n+1)+". "+p.q[0]));var ops=el("div","ops");opcs(p).forEach(function(t){var b=el("button","op",t);b.type="button";b.onclick=function(){[].forEach.call(ops.children,function(x){x.classList.remove("sel")});b.classList.add("sel");res[n]=t;cont.textContent=res.filter(Boolean).length+" de "+L.length+" respondidas"};ops.append(b)});w.append(ops);box.append(w)});
 var fin=el("button","p","Corregir examen");fin.type="button";fin.onclick=function(){
  var sin=L.length-res.filter(Boolean).length;if(sin&&!confirm("Te quedan "+sin+" sin responder. ¿Corregir igualmente?"))return;
  var ok=0,d=datos(),salida=[];L.forEach(function(p,n){var bien=res[n]===p.q[1];if(bien){ok++;delete d.fails[clave(p)]}else{d.fails[clave(p)]=true;salida.push({p:p,tu:res[n]})}});
  d.best=Math.max(d.best||0,ok);guarda(KF,d);box.textContent="";
  box.append(el("h3","","Resultado: "+ok+" de "+L.length+" ("+(ok/L.length*10).toFixed(1).replace(".",",")+" sobre 10)"));box.append(el("p","lead","Nota orientativa, sin penalización por errores."));
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
$("#btP").onclick=function(){practica(P)};
$("#btF").onclick=function(){var d=datos();practica(P.filter(function(p){return d.fails[clave(p)]}))};
resumen();
})();
