/* Programa de práctica: editor de pseudocódigo y de diagrama, consola y comprobación. */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)},P=window.PSEINT,A=window.AZAR;
function lee(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function guarda(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
var NOM={F:"Fácil",M:"Medio",D:"Difícil"},BORR="lab-borrador",KP="ed:lab";
var modo="codigo",ej=null,arbol=[],uid=1,solLista=false,sesion=null;
var ta=$("#cod"),hl=$("#hl"),gu=$("#gut"),con=$("#consola"),res=$("#result"),cmp=$("#cmp");

/* ---------- Editor ---------- */
var KW=/\b(Proceso|FinProceso|Algoritmo|FinAlgoritmo|SubProceso|FinSubProceso|Definir|Como|Dimension|Leer|Escribir|Sin Saltar|Si|Entonces|Sino|SiNo|FinSi|Segun|Hacer|De Otro Modo|FinSegun|Mientras|FinMientras|Repetir|Hasta Que|Para|Hasta|Con Paso|FinPara|Por Valor|Por Referencia)\b/gi,TI=/\b(Entero|Real|Logico|Caracter|Cadena|Verdadero|Falso|MOD|Y|O|NO)\b/g;
function escH(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function pintaCod(){var v=ta.value;hl.innerHTML=v.split("\n").map(function(l){var m=/^(.*?)(\/\/.*)?$/.exec(l),a=m[1],c=m[2]||"",o="",ps=a.split(/("[^"]*"?|'[^']*'?)/);ps.forEach(function(p,i){if(i%2){o+='<span class="s">'+escH(p)+"</span>";return}var e=escH(p).replace(/\b\d+(\.\d+)?\b/g,'<span class="n">$&</span>');e=e.replace(KW,'<span class="k">$&</span>').replace(TI,'<span class="t">$&</span>');o+=e});if(c)o+='<span class="c">'+escH(c)+"</span>";return o}).join("\n")+"\n";
 var n=v.split("\n").length,s="";for(var i=1;i<=n;i++)s+=i+"\n";gu.textContent=s;sinc();borrador()}
function sinc(){hl.scrollTop=ta.scrollTop;hl.scrollLeft=ta.scrollLeft;gu.scrollTop=ta.scrollTop}
ta.addEventListener("input",pintaCod);ta.addEventListener("scroll",sinc);
ta.addEventListener("keydown",function(e){if(e.key==="Tab"){e.preventDefault();pon("    ")}else if(e.key==="Enter"){var ini=ta.value.lastIndexOf("\n",ta.selectionStart-1)+1,m=/^\s*/.exec(ta.value.slice(ini,ta.selectionStart));e.preventDefault();pon("\n"+m[0])}});
function pon(t){var a=ta.selectionStart,b=ta.selectionEnd,c=t.indexOf("|");if(c>=0)t=t.replace("|","");ta.value=ta.value.slice(0,a)+t+ta.value.slice(b);var p=a+(c>=0?c:t.length);ta.selectionStart=ta.selectionEnd=p;ta.focus();pintaCod()}
function ponBloque(t){var a=ta.selectionStart,ini=ta.value.lastIndexOf("\n",a-1)+1,m=/^\s*/.exec(ta.value.slice(ini,a)),sang=m[0];pon(t.split("\n").join("\n"+sang))}
var CMD={Definir:"Definir | Como Entero;",Leer:"Leer |;",Escribir:'Escribir "|";',"<-":" <- ",Si:"Si | Entonces\n    \nSino\n    \nFinSi",Segun:"Segun | Hacer\n    1:\n        \n    De Otro Modo:\n        \nFinSegun",Mientras:"Mientras | Hacer\n    \nFinMientras",Repetir:"Repetir\n    |\nHasta Que ",Para:"Para i <- 1 Hasta | Hacer\n    \nFinPara"};
[].forEach.call(document.querySelectorAll("#cmds button"),function(b){b.onclick=function(){var k=b.textContent;if(CMD[k]){if(CMD[k].indexOf("\n")>=0)ponBloque(CMD[k]);else pon(CMD[k])}else pon(k)}});

/* ---------- Diagrama editable ---------- */
function codigoDe(L,sang){var o="",s=sang||"    ";(L||[]).forEach(function(n){switch(n.t){
 case"Definir":o+=s+"Definir "+n.txt+";\n";break;case"Dimension":o+=s+"Dimension "+n.txt+";\n";break;case"Leer":o+=s+"Leer "+n.txt+";\n";break;case"Escribir":o+=s+"Escribir "+n.txt+";\n";break;case"Asignar":o+=s+n.txt+";\n";break;
 case"Si":o+=s+"Si "+n.txt+" Entonces\n"+codigoDe(n.body,s+"    ");if(n.sino&&n.sino.length)o+=s+"Sino\n"+codigoDe(n.sino,s+"    ");o+=s+"FinSi\n";break;
 case"Mientras":o+=s+"Mientras "+n.txt+" Hacer\n"+codigoDe(n.body,s+"    ")+s+"FinMientras\n";break;
 case"Repetir":o+=s+"Repetir\n"+codigoDe(n.body,s+"    ")+s+"Hasta Que "+n.txt+"\n";break;
 case"Para":o+=s+"Para "+n.txt+" Hacer\n"+codigoDe(n.body,s+"    ")+s+"FinPara\n";break}});return o}
function codigoArbol(){return"Proceso Solucion\n"+codigoDe(arbol)+"FinProceso\n"}
function listaDe(id){if(id==="raiz")return arbol;var q=id.split(":"),n=buscaN(arbol,+q[0]);return n&&n[q[1]]}
function buscaN(L,u){for(var i=0;i<L.length;i++){var n=L[i];if(n.uid===u)return n;var x=buscaN(n.body||[],u)||buscaN(n.sino||[],u);if(x)return x}return null}
function quitaN(L,u){for(var i=0;i<L.length;i++){if(L[i].uid===u){L.splice(i,1);return true}if(quitaN(L[i].body||[],u)||quitaN(L[i].sino||[],u))return true}return false}
function maxU(L){var m=0;(L||[]).forEach(function(n){m=Math.max(m,n.uid||0,maxU(n.body),maxU(n.sino))});return m}
function pintaFlujo(){$("#flujoEd").innerHTML=P.diagrama("Proceso Solucion",arbol,{edit:true});$("#codgen").textContent=codigoArbol();borrador()}
var AY={Definir:["Definir","a, b Como Entero"],Leer:["Leer","a"],Escribir:["Escribir",'"Resultado: ", a'],Asignar:["Asignar","a <- a + 1"],Si:["Si (condición)","a > 0"],Mientras:["Mientras (condición)","a > 0"],Repetir:["Repetir hasta que (condición)","a > 0"],Para:["Para","i <- 1 Hasta 5"],Dimension:["Dimension","v[3]"]};
var dlgP=$("#dlgPal"),dlgT=$("#dlgTxt"),pend=null;
$("#flujoEd").addEventListener("click",function(e){var i=e.target.closest(".ins"),b=e.target.closest(".bl");
 if(i){pend={lista:i.dataset.lista,i:+i.dataset.i};dlgP.showModal();return}
 if(b){var n=buscaN(arbol,+b.dataset.uid);if(!n)return;pend={uid:n.uid};abreTxt(n.t,n.txt);return}});
[].forEach.call(document.querySelectorAll("#dlgPal button[data-t]"),function(b){b.onclick=function(){dlgP.close();pend.t=b.dataset.t;abreTxt(b.dataset.t,"")}});
$("#palCan").onclick=function(){dlgP.close()};
function abreTxt(t,v){$("#txtTit").textContent=AY[t][0];var inp=$("#txtVal");inp.value=v;inp.placeholder="Ejemplo: "+AY[t][1];$("#txtAyu").textContent="Ejemplo: "+AY[t][1];$("#txtBor").hidden=!pend.uid;$("#txtErr").textContent="";pend.tipo=t;dlgT.showModal();inp.focus()}
$("#txtCan").onclick=function(){dlgT.close()};
$("#txtBor").onclick=function(){quitaN(arbol,pend.uid);dlgT.close();pintaFlujo()};
$("#txtFrm").onsubmit=function(e){e.preventDefault();var v=$("#txtVal").value.trim().replace(/;+\s*$/,"");if(!v){$("#txtErr").textContent="Escribe el contenido del bloque.";return}
 var prueba={t:pend.tipo,txt:v,body:[],sino:[]};try{P.analiza("Proceso X\n"+codigoDe([prueba])+"FinProceso")}catch(x){$("#txtErr").textContent=x.message;return}
 if(pend.uid){buscaN(arbol,pend.uid).txt=v}else{var n={t:pend.tipo,txt:v,uid:uid++};if(["Si","Mientras","Repetir","Para"].indexOf(n.t)>=0){n.body=[];if(n.t==="Si")n.sino=[]}listaDe(pend.lista).splice(pend.i,0,n)}
 dlgT.close();pintaFlujo()};

/* ---------- Ejercicio ---------- */
function fuente(){return modo==="codigo"?ta.value:codigoArbol()}
function pintaEj(){$("#ejTit").textContent=ej.titulo;$("#ejNiv").textContent=NOM[ej.nivel];$("#ejTxt").textContent=ej.enun;res.textContent="";con.textContent="";$("#solBox").hidden=true;$("#btSol").hidden=!solLista;$("#verDiag").textContent="";var u=ej.usa.filter(function(x){return x!=="Dimension"&&x!=="SubProceso"});$("#ejUsa").textContent=u.length?"Debes usar: "+u.join(", ")+".":"";marcador()}
function marcador(){var d=lee(KP,{hechos:{},total:0});$("#marc").textContent="Resueltos: "+d.total}
function vacia(){ta.value="Proceso Solucion\n    \nFinProceso";arbol=[];pintaCod();pintaFlujo()}
function nuevo(){ej=A.nuevo($("#niv").value,modo,ej&&ej.id);solLista=false;vacia();pintaEj();borrador();$("#ejer").scrollIntoView({block:"start"})}
function borrador(){if(ej)guarda(BORR,{ej:ej,cod:ta.value,arbol:arbol,modo:modo,sol:solLista})}
function cambiaModo(m){modo=m;[["#mCod","codigo"],["#mFlu","flujo"]].forEach(function(x){$(x[0]).setAttribute("aria-pressed",String(x[1]===m))});$("#zonaCod").hidden=m!=="codigo";$("#zonaFlu").hidden=m!=="flujo";if(ej&&m==="flujo"&&A.plantillas.some(function(p){return p.id===ej.id&&p.solo}))nuevo();pintaFlujo();borrador()}
$("#mCod").onclick=function(){cambiaModo("codigo")};$("#mFlu").onclick=function(){cambiaModo("flujo")};
$("#btNuevo").onclick=nuevo;$("#niv").onchange=nuevo;$("#btVaciar").onclick=function(){if(confirm("¿Borrar lo que llevas de este ejercicio?"))vacia()};

/* ---------- Ejecutar ---------- */
function compila(){try{return P.analiza(fuente())}catch(e){if(!e.pseint)throw e;con.textContent="";con.append(el("div","er","Línea "+e.linea+": "+e.message));return null}}
function ejecuta(){res.textContent="";con.textContent="";var pr=compila();if(!pr){con.scrollIntoView({block:"nearest"});return}var linea=el("div","sl");con.append(linea);var io={sale:function(t){var ps=t.split("\n");ps.forEach(function(p,i){if(i>0){linea=el("div","sl");con.append(linea)}linea.textContent+=p})},azar:Math.random},g=P.corre(pr,io);
 function sigue(v){var r;try{r=v===undefined?g.next():g.next(v)}catch(e){if(!e.pseint)throw e;con.append(el("div","er","Línea "+e.linea+": "+e.message));return}
  if(r.done){con.append(el("div","fi","*** Ejecución finalizada ***"));return}
  var f=el("form","ent"),i=el("input");i.autocomplete="off";i.autocapitalize="off";i.setAttribute("spellcheck","false");i.setAttribute("aria-label","Dato para "+r.value.nom);var b=el("button","","Enviar");f.append(el("span","","> "),i,b);con.append(f);i.focus();f.onsubmit=function(e){e.preventDefault();var tx=i.value;f.remove();con.append(el("div","ing","> "+tx));linea=el("div","sl");con.append(linea);sigue(tx)}}
 sigue();con.scrollIntoView({block:"nearest"})}
$("#btRun").onclick=ejecuta;$("#btRun2").onclick=ejecuta;
function comprueba(){con.textContent="";res.textContent="";var pr=compila();if(!pr){solLista=true;$("#btSol").hidden=false;borrador();return}
 var ok=0,tot=ej.pruebas.length;ej.pruebas.forEach(function(t,i){var r=P.ejecuta(pr,t.e.map(String),function(){return.5}),c=r.error?{ok:false}:P.compara(r.salida,t.esp.s,t.esp.no);if(c.ok&&r.leidas<t.e.length)c={ok:false,poco:true};if(c.ok)ok++;
  var w=el("div","pr "+(c.ok?"bien":"mal"));w.append(el("b","",(c.ok?"✓ ":"✗ ")+"Prueba "+(i+1)));w.append(el("div","",t.e.length?"Entradas: "+t.e.join(", "):"Sin entradas"));
  if(!c.ok){if(r.error)w.append(el("div","","Línea "+r.error.linea+": "+r.error.msg));else if(c.poco)w.append(el("div","","El programa no ha leído todos los datos."));else if(c.sobra)w.append(el("div","","No debería aparecer «"+c.sobra+"»."));else w.append(el("div","","Falta en la salida: «"+c.falta+"»."));w.append(el("pre","",r.salida||"(sin salida)"))}
  res.append(w)});
 var fal=P.usa(pr,ej.usa);if(fal.length)res.prepend(el("div","pr mal","Falta usar: "+fal.join(", ")+"."));
 var todo=ok===tot&&!fal.length;res.prepend(el("h3","",todo?"¡Correcto! Has superado las "+tot+" pruebas.":"Has superado "+ok+" de "+tot+" pruebas."));
 if(todo){var d=lee(KP,{hechos:{},total:0});d.total=(d.total||0)+1;d.hechos=d.hechos||{};d.hechos[ej.id]=(d.hechos[ej.id]||0)+1;guarda(KP,d);marcador()}
 solLista=true;$("#btSol").hidden=false;borrador();res.scrollIntoView({block:"nearest"})}
$("#btCheck").onclick=comprueba;$("#btCheck2").onclick=comprueba;
$("#btSol").onclick=function(){var b=$("#solBox");b.hidden=false;$("#solCod").textContent=ej.sol;var pr=P.analiza(ej.sol);$("#solFlu").innerHTML=P.flujoDe(pr);b.scrollIntoView({block:"nearest"})};
$("#btDiag").onclick=function(){var d=$("#verDiag");d.textContent="";try{d.innerHTML=P.flujoDe(P.analiza(ta.value))}catch(e){if(!e.pseint)throw e;d.append(el("div","er","Línea "+e.linea+": "+e.message))}};

/* ---------- Inicio ---------- */
var b=lee(BORR,null);
if(b&&b.ej&&b.ej.pruebas){ej=b.ej;ta.value=b.cod||"";arbol=b.arbol||[];uid=maxU(arbol)+1;solLista=!!b.sol;modo=b.modo==="flujo"?"flujo":"codigo";pintaCod();cambiaModo(modo);pintaEj()}
else{ej=A.nuevo("",modo);vacia();cambiaModo("codigo");pintaEj()}
})();
