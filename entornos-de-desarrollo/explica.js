/* Explicación comentada de un algoritmo en PSeInt: va línea a línea y dice qué hace cada una.
   Se usa en las soluciones ya resueltas y en los ejercicios al azar. */
(function(raiz){
"use strict";
var TIPOS={real:"número con decimales",entero:"número entero",numero:"número",numerico:"número",caracter:"texto",cadena:"texto",texto:"texto",logico:"lógico (Verdadero o Falso)"};
function esc(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function partes(s){/* separa por comas fuera de comillas y paréntesis */
 var o=[],d=0,q=false,a="";for(var i=0;i<s.length;i++){var c=s[i];if(c==='"')q=!q;if(!q){if(c==="("||c==="[")d++;if(c===")"||c==="]")d--;if(c===","&&d===0){o.push(a.trim());a="";continue}}a+=c}
 if(a.trim())o.push(a.trim());return o}
function cond(c){return c.replace(/\bMOD\b/g,"MOD")}
function escribe(arg){
 var sin=/\s+Sin\s+Saltar\s*$/i.test(arg);arg=arg.replace(/\s+Sin\s+Saltar\s*$/i,"");
 var P=partes(arg),t=P.map(function(p){return/^".*"$/.test(p)?"«"+p.slice(1,-1)+"»":"el valor de <code>"+esc(p)+"</code>"});
 var lit=P.length===1&&/^".*"$/.test(P[0]);
 var h=lit?"Muestra el mensaje "+t[0]+(/[.:!?]»$/.test(t[0])?"":"."):"Muestra "+t.join(" y luego ")+", todo seguido en la misma línea.";
 if(sin)h+=" Con <code>Sin Saltar</code> no baja a la línea siguiente, y lo próximo que se escriba continúa justo detrás.";
 return h}
function asigna(v,e,ctx){
 var m;e=e.trim();
 if(/^(Verdadero|Falso)$/i.test(e))return"Pone el indicador <code>"+esc(v)+"</code> a "+(/^v/i.test(e)?"Verdadero":"Falso")+".";
 if(/^-?\d+(\.\d+)?$/.test(e)&&ctx.ini)return"Inicializa <code>"+esc(v)+"</code> a "+esc(e)+": así empieza desde un valor conocido en lugar de basura.";
 if((m=e.match(/^(\w+)\s*\+\s*1$/))&&m[1]===v)return"Suma 1 a <code>"+esc(v)+"</code>: avanza el contador.";
 if((m=e.match(/^(\w+)\s*-\s*1$/))&&m[1]===v)return"Resta 1 a <code>"+esc(v)+"</code>.";
 if((m=e.match(/^(\w+)\s*([+-])\s*(.+)$/))&&m[1]===v)return(m[2]==="+"?"Suma":"Resta")+" <code>"+esc(m[3])+"</code> al valor que ya tenía <code>"+esc(v)+"</code> y lo vuelve a guardar en ella (acumula).";
 if(/^[A-Za-z_]\w*$/.test(e))return"Copia el valor de <code>"+esc(e)+"</code> en <code>"+esc(v)+"</code>.";
 if(/^-?\d+(\.\d+)?$/.test(e))return"Guarda el valor "+esc(e)+" en <code>"+esc(v)+"</code>.";
 if(/^TRUNC\(/i.test(e))return"Calcula <code>"+esc(e)+"</code> (<code>TRUNC</code> quita los decimales) y lo guarda en <code>"+esc(v)+"</code>.";
 if(/^".*"$/.test(e))return"Guarda en <code>"+esc(v)+"</code> el texto "+esc(e.replace(/^"|"$/g,"«").replace(/«$/,"»"))+".";
 return"Calcula <code>"+esc(e)+"</code> y guarda el resultado en <code>"+esc(v)+"</code>."}
function analiza(code){
 var L=code.replace(/\r/g,"").split("\n"),F=[],ind0=null;
 for(var i=0;i<L.length;i++){
  var raw=L[i].replace(/\t/g,"    ");if(!raw.trim())continue;
  var s=raw.trim(),ind=raw.length-raw.replace(/^ +/,"").length;if(ind0===null)ind0=ind;
  F.push({s:s,ind:Math.max(0,Math.round((ind-ind0)/4)),n:i+1})}
 var out=[],ctx={ini:false},ant=null;
 for(var k=0;k<F.length;k++){
  var f=F[k],s=f.s,m,txt=null,code1=s,cola=null;
  if(/^(Fin(Si|Para|Mientras|Segun)|Fin\s+Segun)\b/i.test(s))continue;
  if((m=s.match(/^(Algoritmo|Proceso)\s+(\w+)/i)))txt="Empieza el programa y le da el nombre <b>"+esc(m[2])+"</b>. Todo lo que hay hasta <code>Fin"+m[1]+"</code> pertenece a él.";
  else if((m=s.match(/^SubProceso\s+(.*)$/i)))txt="Define un <b>subproceso</b> (una función): <code>"+esc(m[1])+"</code>. Lo que va antes de <code>&lt;-</code> es el valor que devuelve y lo que va entre paréntesis, los datos que recibe.";
  else if(/^FinSubProceso/i.test(s))txt="Fin del subproceso: devuelve el valor guardado en la variable de resultado.";
  else if((m=s.match(/^Fin(Algoritmo|Proceso)/i))){txt="Fin del programa."}
  else if((m=s.match(/^Definir\s+(.+?)\s+Como\s+(\w+)\s*;?$/i))){var T=TIPOS[m[2].toLowerCase()]||m[2];txt="Declara <code>"+esc(m[1])+"</code> como "+(m[1].indexOf(",")>=0?"variables de tipo ":"variable de tipo ")+"<b>"+esc(m[2])+"</b> ("+T+")."}
  else if((m=s.match(/^Dimension\s+(\w+)\s*\[(\d+)\]/i)))txt="Crea el array <code>"+esc(m[1])+"</code> con "+m[2]+" posiciones: varias casillas bajo un mismo nombre, que se distinguen por su número entre corchetes."
  else if((m=s.match(/^Escribir\s+(.*?);?$/i))){
   var nx=F[k+1];var lm=nx&&nx.s.match(/^Leer\s+(.+?);?$/i);
   txt=escribe(m[1]);if(lm&&nx.ind===f.ind)txt=txt.replace(/, todo seguido en la misma línea\.$/,".")+" La línea siguiente recoge la respuesta."}
  else if((m=s.match(/^Leer\s+(.+?);?$/i)))txt="Se detiene y espera a que el usuario escriba un valor. Lo que escriba se guarda en <code>"+esc(m[1])+"</code>.";
  else if((m=s.match(/^Si\s+(.*)\s+Entonces$/i)))txt="Pregunta si <code>"+esc(cond(m[1]))+"</code>. Si es verdadero se ejecuta el bloque que sigue; si es falso, se salta.";
  else if(/^Si\s*No$/i.test(s))txt="Rama contraria: se ejecuta solo cuando la condición del <code>Si</code> anterior ha dado falso.";
  else if((m=s.match(/^Mientras\s+(.*)\s+Hacer$/i)))txt="Repite el bloque <b>mientras</b> se cumpla <code>"+esc(cond(m[1]))+"</code>. Se comprueba antes de cada vuelta, de modo que si desde el principio es falsa no se ejecuta ninguna vez.";
  else if(/^Repetir$/i.test(s))txt="Empieza un bucle que se ejecuta <b>al menos una vez</b>; la condición se comprueba al final.";
  else if((m=s.match(/^Hasta\s+Que\s+(.*?);?$/i)))txt="Fin del bucle: vuelve a dar otra vuelta hasta que se cumpla <code>"+esc(cond(m[1]))+"</code>.";
  else if((m=s.match(/^Para\s+(\w+)\s*<-\s*(.+?)\s+Hasta\s+(.+?)(\s+Con\s+Paso\s+(\S+))?\s+Hacer$/i)))txt="Bucle contado: <code>"+esc(m[1])+"</code> empieza valiendo "+esc(m[2])+" y sube"+(m[5]?" de "+esc(m[5])+" en "+esc(m[5]):" de uno en uno")+" hasta "+esc(m[3])+" (incluido). El cuerpo se repite una vez por cada valor.";
  else if((m=s.match(/^Segun\s+(.*)\s+Hacer$/i)))txt="Según el valor de <code>"+esc(m[1])+"</code> se elige una de las opciones de abajo.";
  else if((m=s.match(/^(.+):$/)) && !/\s/.test(m[1].replace(/^"[^"]*"$/,"x")) )txt="Si el valor es <code>"+esc(m[1])+"</code>, se ejecuta lo que hay debajo.";
  else if(/^De\s+Otro\s+Modo:?$/i.test(s))txt="Cualquier otro valor que no coincida con las opciones anteriores entra aquí.";
  else if((m=s.match(/^([\w\[\]]+)\s*<-\s*(.+?);?$/))){
   var prev=out.length&&out[out.length-1].raw;ctx.ini=/^-?\d+(\.\d+)?$/.test(m[2].trim())&&!out.some(function(o){return o.var===m[1]&&o.asig});
   txt=asigna(m[1],m[2],ctx);out.push({code:code1,txt:txt,ind:f.ind,var:m[1],asig:true,raw:s});continue}
  else if((m=s.match(/^Retornar\s+(.*?);?$/i)))txt="Devuelve <code>"+esc(m[1])+"</code>.";
  if(txt==null)txt="Instrucción: <code>"+esc(s)+"</code>.";
  var item={code:code1,txt:txt,ind:f.ind,raw:s};
  if(/^Escribir/i.test(s)&&F[k+1]&&/^Leer\s+(.+?);?$/i.test(F[k+1].s)&&F[k+1].ind===f.ind){item.code=s+"\n"+F[k+1].s;item.txt=txt.replace(/ La línea siguiente recoge la respuesta\.$/,"").replace(/([^.!?])$/,"$1.")+" Después, <code>"+esc(F[k+1].s)+"</code> guarda lo que escriba el usuario en <code>"+esc(F[k+1].s.replace(/^Leer\s+|;$/gi,""))+"</code>.";k++}
  out.push(item)}
 return out}
function html(code,o){
 o=o||{};var it=analiza(code),ov=o.notas||{},h="";
 if(o.idea)h+='<p><b>Idea clave.</b> '+o.idea+'</p>';
 h+='<ol class="ec">';
 it.forEach(function(x){
  var key=x.code.split("\n")[0].trim().replace(/;$/,"");var t=ov[key]!=null?ov[key]:ov[x.raw.replace(/;$/,"")];
  var c=(t!=null?t:x.txt);
  h+='<li style="--n:'+x.ind+'"><code>'+esc(x.code)+'</code><span>'+c+'</span></li>'});
 h+='</ol>';
 if(o.ejemplos&&o.ejemplos.length){h+='<p><b>Pruébalo con valores concretos.</b></p>'+o.ejemplos.map(function(e){return'<pre class="code ej">'+esc(e)+'</pre>'}).join("")}
 if(o.ojo)h+='<p class="nota"><b>Ojo.</b> '+o.ojo+'</p>';
 return h}
var api={analiza:analiza,html:html,esc:esc};
raiz.EXPLICA=api;if(typeof module!=="undefined")module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
