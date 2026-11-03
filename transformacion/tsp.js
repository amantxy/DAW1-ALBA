/* Autoevaluación, tarjetas, progreso de Transformación. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function lee(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function guarda(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
$$("[data-prog]").forEach(function(s){var d=lee("tsp:q"+s.dataset.prog,{});s.textContent="Autoevaluación: "+Object.keys(d).filter(function(k){return d[k]}).length+" de "+s.dataset.total});
function abre(){var d=location.hash&&document.getElementById(location.hash.slice(1));if(d&&d.tagName==="DETAILS"){d.open=true;d.scrollIntoView()}}
addEventListener("hashchange",abre);abre();
var D=$("#datos");if(!D)return;D=JSON.parse(D.textContent);
var KQ="tsp:q"+D.n,ok=lee(KQ,{});
function nota(){$("#score").textContent=Object.keys(ok).filter(function(k){return ok[k]}).length+" de "+D.quiz.length+" correctas"}
D.quiz.forEach(function(q,i){
 var w=el("div","q");w.append(el("p","qt",(i+1)+". "+q.q));var bs=el("div","ops"),fb=el("p","fb");fb.setAttribute("role","status");
 q.o.forEach(function(t,n){var b=el("button","op",t);b.type="button";b.onclick=function(){$$(".op",bs).forEach(function(x){x.classList.remove("si","no")});var bien=n===q.a;b.classList.add(bien?"si":"no");w.classList.toggle("ok",bien);w.classList.toggle("ko",!bien);fb.textContent=(bien?"Correcto. ":"No es correcto. La respuesta es: "+q.o[q.a]+". ")+q.e;if(bien){ok[i]=true;guarda(KQ,ok);nota()}};bs.append(b)});
 w.append(bs,fb);$("#quizbox").append(w);if(ok[i]){bs.children[q.a].classList.add("si");w.classList.add("ok")}});
nota();
$("#rs").onclick=function(){if(confirm("¿Empezar de nuevo la autoevaluación?")){ok={};guarda(KQ,ok);location.reload()}};
var KF="tsp:f"+D.n,sabe=lee(KF,{}),i=0,vuelta=false,V=D.cards,card=$("#fc");
function pinta(){var c=V[i];card.querySelector("b").textContent=vuelta?c[1]:c[0];card.querySelector("small").textContent=vuelta?"Definición":"Concepto · pulsa para girar";card.classList.toggle("back",vuelta);$("#fcn").textContent=(i+1)+" de "+V.length+" · Te sabes "+Object.keys(sabe).filter(function(k){return sabe[k]}).length;$("#fck").textContent=sabe[c[0]]?"Quitar de «me la sé»":"Me la sé"}
card.onclick=function(){vuelta=!vuelta;pinta()};
$("#fcp").onclick=function(){i=(i-1+V.length)%V.length;vuelta=false;pinta()};
$("#fcs").onclick=function(){i=(i+1)%V.length;vuelta=false;pinta()};
$("#fck").onclick=function(){var k=V[i][0];sabe[k]=!sabe[k];guarda(KF,sabe);pinta()};
pinta();
})();
