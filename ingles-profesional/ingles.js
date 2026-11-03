/* Ejercicios, tarjetas, audio y progreso del temario de inglés. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function lee(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function guarda(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function norm(s){return String(s).toLowerCase().replace(/[’`]/g,"'").replace(/\s+/g," ").trim()}
/* ---- audio ---- */
var voz=window.speechSynthesis&&window.SpeechSynthesisUtterance;
function habla(t){if(!voz)return;speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="en-GB";u.rate=.92;speechSynthesis.speak(u)}
$$("[data-say]").forEach(function(b){if(!voz){b.hidden=true;return}b.onclick=function(e){e.preventDefault();habla(b.dataset.say)}});
/* ---- portada: progreso por unidad ---- */
$$("[data-prog]").forEach(function(s){var n=s.dataset.prog,t=+s.dataset.total,d=lee("en:u"+n,{}),h=Object.keys(d).filter(function(k){return d[k]&&k.charAt(0)==="e"}).length;s.textContent="Ejercicios: "+h+" de "+t});
var D=$("#datos");
function abreHash(){var d=location.hash&&document.getElementById(location.hash.slice(1));if(d&&d.tagName==="DETAILS"){d.open=true;d.scrollIntoView()}}
addEventListener("hashchange",abreHash);abreHash();
if(!D)return;
D=JSON.parse(D.textContent);
var KEY="en:u"+D.n,hechas=lee(KEY,{});
function marcador(){var c=Object.keys(hechas).filter(function(k){return hechas[k]&&k.charAt(0)==="e"}).length;$("#score").textContent=c+" de "+D.ex.length+" correctas"}
/* ---- preguntas ---- */
function pregunta(box,q,clave,i){
 var w=el("div","q");w.append(el("p","qt",(i+1)+". "+q.q));
 var fb=el("p","fb");fb.setAttribute("role","status");
 function resuelve(ok,res){w.classList.toggle("ok",ok);w.classList.toggle("ko",!ok);fb.textContent=(ok?"Correcto. ":"No es correcto. La respuesta es: "+res+". ")+(q.e||"");if(ok){hechas[clave]=true;guarda(KEY,hechas);if(clave.charAt(0)==="e")marcador()}}
 if(q.o){var bs=el("div","ops");q.o.forEach(function(t,n){var b=el("button","op",t);b.type="button";b.onclick=function(){$$(".op",bs).forEach(function(x){x.classList.remove("si","no")});b.classList.add(n===q.a?"si":"no");resuelve(n===q.a,q.o[q.a])};bs.append(b)});w.append(bs);
  if(hechas[clave]){bs.children[q.a].classList.add("si");w.classList.add("ok")}}
 else{var f=el("form","fill"),inp=el("input");inp.type="text";inp.autocomplete="off";inp.autocapitalize="off";inp.setAttribute("spellcheck","false");inp.setAttribute("aria-label","Tu respuesta");var ok=el("button","p","Comprobar");f.append(inp,ok);
  f.onsubmit=function(e){e.preventDefault();if(!inp.value.trim())return;resuelve(q.t.some(function(a){return norm(a)===norm(inp.value)}),q.t[0])};w.append(f);
  if(hechas[clave]){inp.value=q.t[0];w.classList.add("ok")}}
 w.append(fb);box.append(w)}
D.qs.forEach(function(q,i){pregunta($("#qs"),q,"r"+i,i)});
D.ex.forEach(function(q,i){pregunta($("#ex"),q,"e"+i,i)});
marcador();
$("#rs").onclick=function(){if(!confirm("¿Empezar de nuevo los ejercicios de esta unidad?"))return;Object.keys(hechas).forEach(function(k){if(k.charAt(0)==="e")delete hechas[k]});guarda(KEY,hechas);location.reload()};
/* ---- tarjetas ---- */
var KF="en:f"+D.n,sabe=lee(KF,{}),idx=0,vuelta=false,card=$("#fc"),V=D.vocab;
function pinta(){var c=V[idx];card.querySelector("b").textContent=vuelta?c[1]:c[0];card.querySelector("small").textContent=vuelta?"Español":"Inglés · pulsa para girar";card.classList.toggle("back",vuelta);$("#fcn").textContent=(idx+1)+" de "+V.length+" · Te sabes "+Object.keys(sabe).filter(function(k){return sabe[k]}).length;$("#fck").textContent=sabe[c[0]]?"Quitar de «me la sé»":"Me la sé"}
card.onclick=function(){vuelta=!vuelta;pinta()};
$("#fcp").onclick=function(){idx=(idx-1+V.length)%V.length;vuelta=false;pinta()};
$("#fcs").onclick=function(){idx=(idx+1)%V.length;vuelta=false;pinta()};
$("#fck").onclick=function(){var k=V[idx][0];sabe[k]=!sabe[k];guarda(KF,sabe);pinta()};
var fa=$("#fca");if(!voz)fa.hidden=true;else fa.onclick=function(){habla(V[idx][0])};
pinta();
/* ---- tu texto ---- */
var KW="en:w"+D.n,ta=$("#tx"),te;ta.value=lee(KW,"");ta.oninput=function(){clearTimeout(te);te=setTimeout(function(){guarda(KW,ta.value)},500)};
})();
