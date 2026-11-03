/* Intérprete de pseudocódigo al estilo de PSeInt (perfil estricto) y diagramas de flujo en SVG.
   Funciona en el navegador y en Node. No es PSeInt: reproduce la sintaxis del manual de la unidad. */
(function(raiz){
"use strict";
function Err(linea,msg){var e=new Error(msg);e.linea=linea;e.pseint=true;return e}
var RES=["proceso","finproceso","algoritmo","finalgoritmo","subproceso","finsubproceso","funcion","finfuncion","definir","como","dimension","leer","escribir","si","entonces","sino","finsi","segun","hacer","de","otro","modo","finsegun","mientras","finmientras","repetir","hasta","que","para","con","paso","finpara","verdadero","falso","y","o","no","mod","sin","saltar","bajar","por","valor","referencia"];
var TIPOS={entero:"Entero",numero:"Real",numerico:"Real",real:"Real",logico:"Logico",caracter:"Texto",texto:"Texto",cadena:"Texto"};
function sinAcento(s){return s.normalize("NFD").replace(/[̀-ͯ]/g,"")}

/* ---------- Léxico ---------- */
function tokens(txt,ln){
 var t=[],i=0,n=txt.length;
 while(i<n){var c=txt[i];
  if(/\s/.test(c)){i++;continue}
  if(c==='"'||c==="'"){var j=txt.indexOf(c,i+1);if(j<0)throw Err(ln,"Falta cerrar las comillas.");t.push({k:"txt",v:txt.slice(i+1,j)});i=j+1;continue}
  if(c==="“"||c==="”")throw Err(ln,"Usa comillas rectas (\"), no comillas tipográficas.");
  var m=/^\d+(\.\d+)?/.exec(txt.slice(i));if(m){t.push({k:"num",v:parseFloat(m[0])});i+=m[0].length;continue}
  m=/^[A-Za-z_áéíóúÁÉÍÓÚñÑüÜ][A-Za-z0-9_áéíóúÁÉÍÓÚñÑüÜ]*/.exec(txt.slice(i));
  if(m){t.push({k:"id",v:m[0],l:sinAcento(m[0]).toLowerCase()});i+=m[0].length;continue}
  var d=txt.substr(i,2);
  if(["<-","<=",">=","<>","==","!=","&&","||"].indexOf(d)>=0){t.push({k:"op",v:d});i+=2;continue}
  if("+-*/^%=<>()[],;:&|~←".indexOf(c)>=0){t.push({k:"op",v:c==="←"?"<-":c});i++;continue}
  throw Err(ln,"Carácter no reconocido: «"+c+"».");
 }
 return t}
/* Separa una línea en instrucciones por «;» fuera de comillas, y quita comentarios. */
function limpia(l){var q=null,o="";for(var i=0;i<l.length;i++){var c=l[i];if(q){if(c===q)q=null;o+=c;continue}if(c==='"'||c==="'"){q=c;o+=c;continue}if(c==="/"&&l[i+1]==="/")break;o+=c}return o}
function trozos(l){var q=null,o=[],a="";for(var i=0;i<l.length;i++){var c=l[i];if(q){if(c===q)q=null;a+=c;continue}if(c==='"'||c==="'"){q=c;a+=c;continue}if(c===";"){o.push({t:a,pc:true});a="";continue}a+=c}if(a.trim())o.push({t:a,pc:false});return o}

/* ---------- Expresiones ---------- */
function PE(ts,ln){this.ts=ts;this.i=0;this.ln=ln}
PE.prototype={
 ver:function(){return this.ts[this.i]},
 esOp:function(v){var t=this.ver();return t&&t.k==="op"&&t.v===v},
 esId:function(v){var t=this.ver();return t&&t.k==="id"&&t.l===v},
 expr:function(){return this.o()},
 o:function(){var a=this.y();while(this.esId("o")||this.esOp("|")||this.esOp("||")){this.i++;a={e:"bin",op:"o",a:a,b:this.y(),l:this.ln}}return a},
 y:function(){var a=this.no();while(this.esId("y")||this.esOp("&")||this.esOp("&&")){this.i++;a={e:"bin",op:"y",a:a,b:this.no(),l:this.ln}}return a},
 no:function(){if(this.esId("no")||this.esOp("~")){this.i++;return{e:"no",a:this.no(),l:this.ln}}return this.cmp()},
 cmp:function(){var a=this.sum();var t=this.ver();while(t&&t.k==="op"&&["=","==","<>","!=","<",">","<=",">="].indexOf(t.v)>=0){this.i++;var op=t.v==="=="?"=":t.v==="!="?"<>":t.v;a={e:"bin",op:op,a:a,b:this.sum(),l:this.ln};t=this.ver()}return a},
 sum:function(){var a=this.mul();while(this.esOp("+")||this.esOp("-")){var op=this.ts[this.i++].v;a={e:"bin",op:op,a:a,b:this.mul(),l:this.ln}}return a},
 mul:function(){var a=this.un();while(this.esOp("*")||this.esOp("/")||this.esOp("%")||this.esId("mod")){var t=this.ts[this.i++];var op=(t.k==="id"||t.v==="%")?"mod":t.v;a={e:"bin",op:op,a:a,b:this.un(),l:this.ln}}return a},
 un:function(){if(this.esOp("-")){this.i++;return{e:"neg",a:this.un(),l:this.ln}}if(this.esOp("+")){this.i++;return this.un()}return this.pot()},
 pot:function(){var a=this.atom();if(this.esOp("^")){this.i++;return{e:"bin",op:"^",a:a,b:this.un(),l:this.ln}}return a},
 args:function(cierra){var v=[];if(this.esOp(cierra)){this.i++;return v}for(;;){v.push(this.expr());if(this.esOp(",")){this.i++;continue}if(this.esOp(cierra)){this.i++;return v}throw Err(this.ln,"Falta cerrar con «"+cierra+"».")}},
 atom:function(){var t=this.ver();if(!t)throw Err(this.ln,"Falta un valor en la expresión.");this.i++;
  if(t.k==="num")return{e:"lit",v:t.v};if(t.k==="txt")return{e:"lit",v:t.v};
  if(t.k==="op"&&t.v==="("){var x=this.expr();if(!this.esOp(")"))throw Err(this.ln,"Falta cerrar el paréntesis.");this.i++;return x}
  if(t.k==="id"){if(t.l==="verdadero")return{e:"lit",v:true};if(t.l==="falso")return{e:"lit",v:false};
   if(RES.indexOf(t.l)>=0)throw Err(this.ln,"«"+t.v+"» es una palabra reservada; aquí se esperaba un valor.");
   if(this.esOp("(")){this.i++;return{e:"call",n:t.l,nom:t.v,a:this.args(")"),l:this.ln}}
   if(this.esOp("[")){this.i++;return{e:"idx",n:t.l,nom:t.v,a:this.args("]"),l:this.ln}}
   return{e:"var",n:t.l,nom:t.v,l:this.ln}}
  throw Err(this.ln,"Expresión mal formada cerca de «"+t.v+"».")},
 fin:function(){if(this.i<this.ts.length){var t=this.ts[this.i];throw Err(this.ln,"Sobra algo en la línea cerca de «"+t.v+"».")}}
};
function exprDe(ts,ln){if(!ts.length)throw Err(ln,"Falta la expresión.");var p=new PE(ts,ln),x=p.expr();p.fin();return x}
function corta(ts,fn){for(var i=0;i<ts.length;i++)if(fn(ts[i]))return i;return -1}
function esK(t,v){return t.k==="id"&&t.l===v}

/* ---------- Instrucciones ---------- */
function analiza(src){
 var L=src.split("\n"),q=[];
 L.forEach(function(raw,i){var l=limpia(raw);trozos(l).forEach(function(tr){var s=tr.t.trim();if(s)q.push({ln:i+1,s:s,pc:tr.pc,ts:tokens(s,i+1)})})});
 var pos=0,prog={subs:{},main:null,ver:src};
 function fin(){return pos>=q.length}
 function primera(x){return x.ts[0]&&x.ts[0].k==="id"?x.ts[0].l:""}
 function pideSinPc(x,que){if(x.pc)throw Err(x.ln,"«"+que+"» no lleva punto y coma.")}
 function pidePc(x){if(!x.pc)throw Err(x.ln,"Falta el punto y coma al final de la instrucción.")}
 function bloque(cierres,que,ini){var o=[];for(;;){if(fin())throw Err(ini,"Falta cerrar «"+que+"» (se esperaba "+cierres[0]+").");var x=q[pos],p=primera(x);if(cierres.indexOf(p)>=0)return o;o.push(instr())}}
 function txt(ts){return reconstruye(ts)}
 function instr(){
  var x=q[pos],ts=x.ts,ln=x.ln,p=primera(x);pos++;
  if(p==="definir"){pidePc(x);var c=corta(ts,function(t){return esK(t,"como")});if(c<0)throw Err(ln,"Definir necesita «Como» y un tipo: Definir edad Como Entero;");var ti=ts[c+1];if(!ti||ti.k!=="id"||!TIPOS[ti.l]||ts.length>c+2)throw Err(ln,"Tipo no válido. Usa Entero, Real, Logico, Caracter o Cadena.");var ns=[];for(var i=1;i<c;i+=2){var t=ts[i];if(!t||t.k!=="id"||RES.indexOf(t.l)>=0)throw Err(ln,"Nombre de variable no válido en Definir.");ns.push({n:t.l,nom:t.v});if(i+1<c&&!(ts[i+1].k==="op"&&ts[i+1].v===","))throw Err(ln,"Separa los nombres con comas.")}if(!ns.length)throw Err(ln,"Definir necesita al menos un nombre.");return{t:"Definir",l:ln,ns:ns,tipo:TIPOS[ti.l],txt:txt(ts.slice(1))}}
  if(p==="dimension"){pidePc(x);var pa=new PE(ts.slice(1),ln),ds=[];for(;;){var nt=pa.ver();if(!nt||nt.k!=="id")throw Err(ln,"Dimension necesita un nombre: Dimension notas[3];");pa.i++;if(!pa.esOp("[")&&!pa.esOp("("))throw Err(ln,"Dimension necesita corchetes: Dimension notas[3];");var cc=pa.esOp("[")?"]":")";pa.i++;ds.push({n:nt.l,nom:nt.v,a:pa.args(cc)});if(pa.esOp(",")){pa.i++;continue}break}pa.fin();return{t:"Dimension",l:ln,ds:ds,txt:txt(ts.slice(1))}}
  if(p==="leer"){pidePc(x);var pl=new PE(ts.slice(1),ln),vs=[];for(;;){var lv=pl.atom();if(lv.e!=="var"&&lv.e!=="idx")throw Err(ln,"Leer necesita una variable sin comillas.");vs.push(lv);if(pl.esOp(",")){pl.i++;continue}break}pl.fin();return{t:"Leer",l:ln,vs:vs,txt:txt(ts.slice(1))}}
  if(p==="escribir"){pidePc(x);var es=ts.slice(1),ss=false,n=es.length;if(n>=2&&esK(es[n-2],"sin")&&(esK(es[n-1],"saltar")||esK(es[n-1],"bajar"))){ss=true;es=es.slice(0,n-2)}if(!es.length)throw Err(ln,"Escribir necesita qué mostrar.");var pe=new PE(es,ln),xs=[];for(;;){xs.push(pe.expr());if(pe.esOp(",")){pe.i++;continue}break}pe.fin();return{t:"Escribir",l:ln,xs:xs,ss:ss,txt:txt(es)}}
  if(p==="si"){pideSinPc(x,"Si ... Entonces");var ce=corta(ts,function(t){return esK(t,"entonces")});if(ce<0)throw Err(ln,"Si necesita «Entonces» al final de la línea.");if(ce!==ts.length-1)throw Err(ln,"Escribe las instrucciones en la línea siguiente a «Entonces».");var cond=exprDe(ts.slice(1,ce),ln),b=bloque(["sino","finsi"],"Si",ln),e=null;if(primera(q[pos])==="sino"){pideSinPc(q[pos],"Sino");pos++;e=bloque(["finsi"],"Sino",ln)}pideSinPc(q[pos],"FinSi");pos++;return{t:"Si",l:ln,c:cond,body:b,sino:e||[],txt:txt(ts.slice(1,ce))}}
  if(p==="mientras"){pideSinPc(x,"Mientras ... Hacer");var ch=corta(ts,function(t){return esK(t,"hacer")});if(ch<0||ch!==ts.length-1)throw Err(ln,"Mientras necesita «Hacer» al final de la línea.");var cm=exprDe(ts.slice(1,ch),ln),bm=bloque(["finmientras"],"Mientras",ln);pideSinPc(q[pos],"FinMientras");pos++;return{t:"Mientras",l:ln,c:cm,body:bm,txt:txt(ts.slice(1,ch))}}
  if(p==="repetir"){pideSinPc(x,"Repetir");if(ts.length>1)throw Err(ln,"Repetir va solo en su línea.");var br=bloque(["hasta"],"Repetir",ln),h=q[pos];pos++;if(!h.ts[1]||!esK(h.ts[1],"que"))throw Err(h.ln,"Se esperaba «Hasta Que condición».");return{t:"Repetir",l:ln,lc:h.ln,c:exprDe(h.ts.slice(2),h.ln),body:br,txt:txt(h.ts.slice(2))}}
  if(p==="para"){pideSinPc(x,"Para ... Hacer");var ha=corta(ts,function(t){return esK(t,"hasta")}),hc=corta(ts,function(t){return esK(t,"hacer")});if(ha<0||hc<0||hc!==ts.length-1)throw Err(ln,"Forma: Para i <- 1 Hasta 5 Hacer");if(!ts[1]||ts[1].k!=="id"||!ts[2]||ts[2].v!=="<-")throw Err(ln,"Forma: Para i <- 1 Hasta 5 Hacer");var cp=corta(ts,function(t){return esK(t,"con")}),finE=cp>=0?cp:hc,paso=null;if(cp>=0){if(!esK(ts[cp+1]||{},"paso"))throw Err(ln,"Se esperaba «Con Paso».");paso=exprDe(ts.slice(cp+2,hc),ln)}var bp=bloque(["finpara"],"Para",ln);pideSinPc(q[pos],"FinPara");pos++;return{t:"Para",l:ln,n:ts[1].l,nom:ts[1].v,a:exprDe(ts.slice(3,ha),ln),b:exprDe(ts.slice(ha+1,finE),ln),p:paso,body:bp,txt:txt(ts.slice(1,hc))}}
  if(p==="segun"){pideSinPc(x,"Segun ... Hacer");var hs=corta(ts,function(t){return esK(t,"hacer")});if(hs<0||hs!==ts.length-1)throw Err(ln,"Forma: Segun opcion Hacer");var ex=exprDe(ts.slice(1,hs),ln),casos=[],otro=null;
   for(;;){if(fin())throw Err(ln,"Falta cerrar «Segun» con FinSegun.");var y=q[pos],py=primera(y);if(py==="finsegun"){pideSinPc(y,"FinSegun");pos++;break}
    if(py==="de"){var dp=corta(y.ts,function(t){return t.k==="op"&&t.v===":"});if(dp<0)throw Err(y.ln,"Se esperaba «De Otro Modo:».");var res=y.ts.slice(dp+1);if(res.length){q[pos]={ln:y.ln,s:"",pc:y.pc,ts:res}}else pos++;otro=casosCuerpo(y.ln);continue}
    var dc=corta(y.ts,function(t){return t.k==="op"&&t.v===":"});if(dc<0)throw Err(y.ln,"Cada opción de Segun termina con dos puntos: 1:");var vals=[],pv=new PE(y.ts.slice(0,dc),y.ln);for(;;){vals.push(pv.expr());if(pv.esOp(",")){pv.i++;continue}break}pv.fin();var rs=y.ts.slice(dc+1);if(rs.length){q[pos]={ln:y.ln,s:"",pc:y.pc,ts:rs}}else pos++;casos.push({vals:vals,txt:txt(y.ts.slice(0,dc)),body:casosCuerpo(y.ln)})}
   return{t:"Segun",l:ln,x:ex,casos:casos,otro:otro||[],txt:txt(ts.slice(1,hs))}}
  /* Llamada a subproceso o asignación */
  var fl=corta(ts,function(t){return t.k==="op"&&t.v==="<-"});
  if(fl>=0){pidePc(x);var pd=new PE(ts.slice(0,fl),ln),dest=pd.atom();pd.fin();if(dest.e!=="var"&&dest.e!=="idx")throw Err(ln,"A la izquierda de <- debe haber una variable.");return{t:"Asignar",l:ln,d:dest,x:exprDe(ts.slice(fl+1),ln),txt:txt(ts)}}
  if(ts[0]&&ts[0].k==="id"&&ts[1]&&ts[1].v==="("&&RES.indexOf(ts[0].l)<0){pidePc(x);var pc=new PE(ts,ln),ca=pc.atom();pc.fin();return{t:"Llamar",l:ln,x:ca,txt:txt(ts)}}
  if(ts[0]&&ts[0].k==="id"&&ts[1]&&ts[1].v==="=")throw Err(ln,"Para asignar usa <- (el signo = compara).");
  if(ts[0]&&ts[0].k==="id"&&RES.indexOf(ts[0].l)>=0)throw Err(ln,"«"+ts[0].v+"» no se esperaba aquí. Revisa el bloque en el que está.");
  throw Err(ln,"No se entiende la instrucción «"+x.s+"».")}
 function casosCuerpo(ln){var o=[];for(;;){if(fin())throw Err(ln,"Falta cerrar «Segun» con FinSegun.");var y=q[pos],p=primera(y);if(p==="finsegun"||p==="de")return o;if(corta(y.ts,function(t){return t.k==="op"&&t.v===":"})>=0&&y.ts.some(function(t){return t.k==="op"&&t.v===":"})&&!/^(escribir|leer)$/.test(p))return o;o.push(instr())}}
 while(!fin()){var x=q[pos],p=primera(x),ln=x.ln;
  if(p==="proceso"||p==="algoritmo"){pideSinPc(x,"Proceso");if(prog.main)throw Err(ln,"Solo puede haber un Proceso principal.");if(!x.ts[1]||x.ts[1].k!=="id"||x.ts.length>2)throw Err(ln,"Proceso necesita un nombre, sin espacios: Proceso Saludo");pos++;var c1=p==="proceso"?"finproceso":"finalgoritmo",b1=bloque([c1],p==="proceso"?"Proceso":"Algoritmo",ln);pideSinPc(q[pos],"FinProceso");pos++;prog.main={t:"Principal",nom:x.ts[1].v,body:b1,l:ln};continue}
  if(p==="subproceso"||p==="funcion"){pideSinPc(x,"SubProceso");pos++;var ts=x.ts.slice(1),ret=null,fl=corta(ts,function(t){return t.k==="op"&&(t.v==="<-"||t.v==="=")});if(fl>=0){ret=ts[0].l;ts=ts.slice(fl+1)}if(!ts[0]||ts[0].k!=="id")throw Err(ln,"SubProceso necesita un nombre.");var nom=ts[0],ps=[];if(ts[1]&&ts[1].v==="("){var k=2,ac=null;while(k<ts.length&&ts[k].v!==")"){var tp=ts[k];if(tp.k==="op"&&tp.v===","){k++;continue}if(tp.k!=="id")throw Err(ln,"Parámetro no válido.");var pr={n:tp.l,nom:tp.v,ref:false,defecto:true};k++;if(ts[k]&&esK(ts[k],"por")){pr.defecto=false;pr.ref=esK(ts[k+1]||{},"referencia");k+=2}ps.push(pr)}}var c2=p==="subproceso"?"finsubproceso":"finfuncion",b2=bloque([c2],"SubProceso",ln);pideSinPc(q[pos],"FinSubProceso");pos++;prog.subs[nom.l]={nom:nom.v,ret:ret,ps:ps,body:b2,l:ln};continue}
  throw Err(ln,"Todo debe estar dentro de Proceso o SubProceso.")}
 if(!prog.main)throw Err(1,"Falta el bloque Proceso ... FinProceso.");
 return prog}
function reconstruye(ts){var o="";ts.forEach(function(t,i){var s=t.k==="txt"?"\""+t.v+"\"":t.k==="num"?String(t.v):t.v;var p=i?ts[i-1]:null;var sinEsp=!p||t.v===","||t.v===")"||t.v==="]"||t.v===":"||(p.k==="op"&&(p.v==="("||p.v==="["))||(t.k==="op"&&(t.v==="("||t.v==="[")&&p.k==="id");o+=(sinEsp?"":" ")+s});return o}

/* ---------- Ejecución ---------- */
function fmt(v){if(typeof v==="boolean")return v?"Verdadero":"Falso";if(typeof v==="number"){if(!isFinite(v))return String(v);return String(+v.toFixed(10))}return String(v)}
function tipoDe(v){return typeof v==="number"?"Numero":typeof v==="boolean"?"Logico":"Texto"}
function crea(tipo){return{tipo:tipo,v:undefined}}
function cuentaDe(c,ln){if(c.dims)throw Err(ln,"Es un arreglo: indica el índice.");return c}
function* corre(prog,io){
 var pasos=0;
 function tic(ln){if(++pasos>200000)throw Err(ln,"El programa no termina: revisa la condición del ciclo.")}
 function busca(amb,n,nom,ln){var c=amb[n];if(!c)throw Err(ln,"La variable «"+nom+"» no está definida. En perfil Estricto hay que usar Definir antes.");return c}
 function* indices(amb,x,c){if(!c.dims)throw Err(x.l,"«"+x.nom+"» no tiene Dimension: declara el arreglo antes de usarlo.");if(x.a.length!==c.dims.length)throw Err(x.l,"Número de índices incorrecto en «"+x.nom+"».");var id=0;for(var i=0;i<x.a.length;i++){var v=yield* ev(amb,x.a[i]);if(typeof v!=="number"||v!==Math.floor(v))throw Err(x.l,"El índice debe ser un número entero.");if(v<0||v>=c.dims[i])throw Err(x.l,"Índice fuera del arreglo «"+x.nom+"»: "+v+". Con base 0 va de 0 a "+(c.dims[i]-1)+".");id=id*c.dims[i]+v}return id}
 function asignaA(c,val,ln,nom){if(c.tipo==="Entero"){if(typeof val!=="number")throw Err(ln,"No coinciden los tipos: «"+nom+"» es Entero.");if(val!==Math.floor(val))throw Err(ln,"No coinciden los tipos: «"+nom+"» es Entero y el valor "+fmt(val)+" tiene decimales. Usa Real o TRUNC.");return val}if(c.tipo==="Real"&&typeof val!=="number")throw Err(ln,"No coinciden los tipos: «"+nom+"» es Real.");if(c.tipo==="Logico"&&typeof val!=="boolean")throw Err(ln,"No coinciden los tipos: «"+nom+"» es Logico.");if(c.tipo==="Texto"&&typeof val!=="string")throw Err(ln,"No coinciden los tipos: «"+nom+"» es de texto.");return val}
 function* guarda(amb,d,val,ln){var c=busca(amb,d.n,d.nom,ln);if(d.e==="idx"){var i=yield* indices(amb,d,c);c.vals[i]=c.tipo?asignaA(c,val,ln,d.nom):val;return}cuentaDe(c,ln);if(c.tipo){c.v=asignaA(c,val,ln,d.nom)}else{c.v=val;c.tipo=typeof val==="number"?"Real":typeof val==="boolean"?"Logico":"Texto"}}
 function num(v,ln,q){if(typeof v!=="number")throw Err(ln,q+" necesita números.");return v}
 var FN={rc:function(a,l){num(a[0],l,"RC");if(a[0]<0)throw Err(l,"RC: raíz de un número negativo.");return Math.sqrt(a[0])},raiz:function(a,l){return FN.rc(a,l)},abs:function(a,l){return Math.abs(num(a[0],l,"ABS"))},ln:function(a,l){if(num(a[0],l,"LN")<=0)throw Err(l,"LN necesita un número positivo.");return Math.log(a[0])},exp:function(a,l){return Math.exp(num(a[0],l,"EXP"))},sen:function(a,l){return Math.sin(num(a[0],l,"SEN"))},cos:function(a,l){return Math.cos(num(a[0],l,"COS"))},tan:function(a,l){return Math.tan(num(a[0],l,"TAN"))},atan:function(a,l){return Math.atan(num(a[0],l,"ATAN"))},asen:function(a,l){return Math.asin(num(a[0],l,"ASEN"))},acos:function(a,l){return Math.acos(num(a[0],l,"ACOS"))},trunc:function(a,l){return Math.trunc(num(a[0],l,"TRUNC"))},redon:function(a,l){return Math.round(num(a[0],l,"REDON"))},azar:function(a,l){return Math.floor(io.azar()*num(a[0],l,"AZAR"))},
  longitud:function(a,l){if(typeof a[0]!=="string")throw Err(l,"Longitud necesita texto.");return a[0].length},subcadena:function(a,l){if(typeof a[0]!=="string")throw Err(l,"Subcadena necesita texto.");return a[0].slice(a[1]-1,a[2])},mayusculas:function(a){return String(a[0]).toUpperCase()},minusculas:function(a){return String(a[0]).toLowerCase()},concatenar:function(a){return String(a[0])+String(a[1])},convertiranumero:function(a){return parseFloat(a[0])},convertiratexto:function(a){return fmt(a[0])}};
 var NARGS={subcadena:3,concatenar:2};
 function* ev(amb,x){
  switch(x.e){
   case"lit":return x.v;
   case"var":{var c=busca(amb,x.n,x.nom,x.l);if(c.dims)throw Err(x.l,"«"+x.nom+"» es un arreglo: indica el índice.");if(c.v===undefined)throw Err(x.l,"La variable «"+x.nom+"» no tiene valor. Asígnale uno o léela antes de usarla.");return c.v}
   case"idx":{var ca=busca(amb,x.n,x.nom,x.l),i=yield* indices(amb,x,ca),v=ca.vals[i];if(v===undefined)throw Err(x.l,"La casilla de «"+x.nom+"» no tiene valor todavía.");return v}
   case"neg":return -num(yield* ev(amb,x.a),x.l,"El signo -");
   case"no":{var n=yield* ev(amb,x.a);if(typeof n!=="boolean")throw Err(x.l,"NO necesita un valor lógico.");return !n}
   case"bin":{
    if(x.op==="y"||x.op==="o"){var a=yield* ev(amb,x.a);if(typeof a!=="boolean")throw Err(x.l,(x.op==="y"?"Y":"O")+" necesita condiciones lógicas.");if(x.op==="y"&&!a)return false;if(x.op==="o"&&a)return true;var b=yield* ev(amb,x.b);if(typeof b!=="boolean")throw Err(x.l,(x.op==="y"?"Y":"O")+" necesita condiciones lógicas.");return b}
    var p=yield* ev(amb,x.a),q=yield* ev(amb,x.b);
    switch(x.op){
     case"+":if(typeof p==="string"||typeof q==="string"){if(typeof p!==typeof q)throw Err(x.l,"No se puede sumar texto y número.");return p+q}num(p,x.l,"+");num(q,x.l,"+");return p+q;
     case"-":return num(p,x.l,"-")-num(q,x.l,"-");case"*":return num(p,x.l,"*")*num(q,x.l,"*");
     case"/":num(p,x.l,"/");if(num(q,x.l,"/")===0)throw Err(x.l,"División por cero.");return p/q;
     case"^":return Math.pow(num(p,x.l,"^"),num(q,x.l,"^"));
     case"mod":num(p,x.l,"MOD");num(q,x.l,"MOD");if(q===0)throw Err(x.l,"MOD por cero.");if(p!==Math.floor(p)||q!==Math.floor(q))throw Err(x.l,"MOD necesita números enteros.");return p%q;
     default:if(typeof p!==typeof q)throw Err(x.l,"No se puede comparar "+tipoDe(p)+" con "+tipoDe(q)+".");
      switch(x.op){case"=":return p===q;case"<>":return p!==q;case"<":return p<q;case">":return p>q;case"<=":return p<=q;case">=":return p>=q}}}
   case"call":{var sb=prog.subs[x.n];if(sb){var r=yield* llama(amb,sb,x);return r}var fn=FN[x.n];if(!fn)throw Err(x.l,"No existe la función o subproceso «"+x.nom+"».");var nn=NARGS[x.n]||1;if(x.a.length!==nn)throw Err(x.l,x.nom+" necesita "+nn+" argumento"+(nn>1?"s":"")+".");var ar=[];for(var j=0;j<x.a.length;j++)ar.push(yield* ev(amb,x.a[j]));return fn(ar,x.l)}
  }
  throw Err(x.l,"Expresión no válida.")}
 function* llama(amb,sb,x){
  if(x.a.length!==sb.ps.length)throw Err(x.l,sb.nom+" necesita "+sb.ps.length+" argumento(s).");
  var loc={};
  for(var i=0;i<sb.ps.length;i++){var pa=sb.ps[i],ar=x.a[i];
   if(ar.e==="var"&&amb[ar.n]&&amb[ar.n].dims){loc[pa.n]=amb[ar.n];continue}
   if(pa.ref){if(ar.e==="var"){var cv=busca(amb,ar.n,ar.nom,x.l);loc[pa.n]=cv;continue}if(ar.e==="idx"){var ci=busca(amb,ar.n,ar.nom,x.l),ix=yield* indices(amb,ar,ci);loc[pa.n]=(function(arr,k,tipo){return{tipo:tipo,get v(){return arr[k]},set v(w){arr[k]=w}}})(ci.vals,ix,ci.tipo);continue}throw Err(x.l,"Por Referencia necesita una variable.")}
   var val=yield* ev(amb,ar);loc[pa.n]={tipo:typeof val==="number"?(val===Math.floor(val)&&ar.e==="var"&&amb[ar.n]&&amb[ar.n].tipo==="Entero"?"Entero":"Real"):typeof val==="boolean"?"Logico":"Texto",v:val}}
  yield* cuerpo(loc,sb.body);
  if(sb.ret){var c=loc[sb.ret];if(!c||c.v===undefined)throw Err(sb.l,"El subproceso «"+sb.nom+"» no ha dado valor a «"+sb.ret+"».");return c.v}
  return undefined}
 function* cuerpo(amb,L){for(var i=0;i<L.length;i++)yield* una(amb,L[i])}
 function* una(amb,s){tic(s.l);
  switch(s.t){
   case"Definir":s.ns.forEach(function(n){if(amb[n.n])throw Err(s.l,"La variable «"+n.nom+"» ya está definida.");amb[n.n]=crea(s.tipo)});return;
   case"Dimension":for(var i=0;i<s.ds.length;i++){var d=s.ds[i],c=amb[d.n];if(!c)throw Err(s.l,"Define el tipo de «"+d.nom+"» antes de Dimension: Definir "+d.nom+" Como Real;");var dm=[],tot=1;for(var j=0;j<d.a.length;j++){var v=yield* ev(amb,d.a[j]);if(v<=0||v!==Math.floor(v))throw Err(s.l,"La dimensión debe ser un entero positivo.");dm.push(v);tot*=v}if(tot>100000)throw Err(s.l,"Arreglo demasiado grande.");c.dims=dm;c.vals=new Array(tot)}return;
   case"Asignar":{var val=yield* ev(amb,s.x);yield* guarda(amb,s.d,val,s.l);return}
   case"Escribir":{var o="";for(var k=0;k<s.xs.length;k++)o+=fmt(yield* ev(amb,s.xs[k]));io.sale(o+(s.ss?"":"\n"));return}
   case"Leer":for(var q=0;q<s.vs.length;q++){var t=s.vs[q],cc=busca(amb,t.n,t.nom,s.l);var raw=yield{leer:true,nom:t.nom,linea:s.l};var tx=String(raw).trim(),w;
     var ti=cc.tipo;if(ti==="Texto")w=String(raw);else if(ti==="Logico"){var lw=sinAcento(tx).toLowerCase();if(lw==="verdadero"||lw==="v")w=true;else if(lw==="falso"||lw==="f")w=false;else throw Err(s.l,"Se esperaba Verdadero o Falso para «"+t.nom+"».")}else{if(!/^[-+]?\d+(\.\d+)?$/.test(tx))throw Err(s.l,"Se esperaba un número para «"+t.nom+"» y se recibió «"+tx+"».");w=parseFloat(tx);if(ti==="Entero"&&w!==Math.floor(w))throw Err(s.l,"«"+t.nom+"» es Entero y se ha introducido "+tx+".")}
     yield* guarda(amb,t,w,s.l)}return;
   case"Si":{var cd=yield* ev(amb,s.c);if(typeof cd!=="boolean")throw Err(s.l,"La condición debe ser Verdadera o Falsa.");yield* cuerpo(amb,cd?s.body:s.sino);return}
   case"Mientras":for(;;){tic(s.l);var cm=yield* ev(amb,s.c);if(typeof cm!=="boolean")throw Err(s.l,"La condición debe ser Verdadera o Falsa.");if(!cm)return;yield* cuerpo(amb,s.body)}
   case"Repetir":for(;;){yield* cuerpo(amb,s.body);tic(s.lc);var cr=yield* ev(amb,s.c);if(typeof cr!=="boolean")throw Err(s.lc,"La condición debe ser Verdadera o Falsa.");if(cr)return}
   case"Para":{var cp=busca(amb,s.n,s.nom,s.l);var a=num(yield* ev(amb,s.a),s.l,"Para"),b=num(yield* ev(amb,s.b),s.l,"Para"),st=s.p?num(yield* ev(amb,s.p),s.l,"Para"):(1);if(st===0)throw Err(s.l,"El paso no puede ser 0.");for(var x=a;st>0?x<=b:x>=b;x+=st){tic(s.l);cp.v=asignaA(cp,x,s.l,s.nom);yield* cuerpo(amb,s.body);if(cp.v!==x)x=cp.v}return}
   case"Segun":{var sv=yield* ev(amb,s.x);if(typeof sv!=="number")throw Err(s.l,"En perfil Estricto, Segun usa una variable numérica.");for(var u=0;u<s.casos.length;u++)for(var m=0;m<s.casos[u].vals.length;m++){if((yield* ev(amb,s.casos[u].vals[m]))===sv){yield* cuerpo(amb,s.casos[u].body);return}}yield* cuerpo(amb,s.otro);return}
   case"Llamar":{var sbr=prog.subs[s.x.n];if(!sbr)throw Err(s.l,"No existe el subproceso «"+s.x.nom+"».");yield* llama(amb,sbr,s.x);return}
  }}
 yield* cuerpo({},prog.main.body);
}
/* Ejecuta con una lista de entradas. Devuelve {salida,error,leidas}. */
function ejecuta(prog,entradas,azar){
 var salida="",i=0,io={sale:function(t){salida+=t},azar:azar||Math.random},g=corre(prog,io),paso;
 try{paso=g.next();while(!paso.done){if(i>=entradas.length)return{salida:salida,error:{linea:paso.value.linea,msg:"El programa pide más datos de los previstos en la prueba."},leidas:i};paso=g.next(entradas[i++])}return{salida:salida,error:null,leidas:i}}
 catch(e){if(e.pseint)return{salida:salida,error:{linea:e.linea,msg:e.message},leidas:i};throw e}}

/* ---------- Comprobación ---------- */
function norm(s){return sinAcento(String(s)).toLowerCase().replace(/\s+/g," ")}
/* Tokens esperados, en orden: números (con margen) o textos. «no» son textos prohibidos. */
function compara(salida,esp,no){
 var s=norm(salida),pos=0;
 for(var i=0;i<esp.length;i++){var t=esp[i];
  if(typeof t==="number"){var re=/-?\d+(\.\d+)?/g,m,ok=false;re.lastIndex=pos;while((m=re.exec(s))){var prev=s[m.index-1];if(prev&&/[a-z0-9_]/.test(prev))continue;if(Math.abs(parseFloat(m[0])-t)<=Math.max(.011,Math.abs(t)*.001)){pos=m.index+m[0].length;ok=true;break}}if(!ok)return{ok:false,falta:String(t)}}
  else{var k=s.indexOf(norm(t),pos);if(k<0)return{ok:false,falta:t};pos=k+norm(t).length}}
 if(no)for(var j=0;j<no.length;j++)if(s.indexOf(norm(no[j]))>=0)return{ok:false,sobra:no[j]};
 return{ok:true}}
function usa(prog,tipos){var vistos={};function rec(L){(L||[]).forEach(function(s){vistos[s.t]=true;rec(s.body);rec(s.sino);rec(s.otro);(s.casos||[]).forEach(function(c){rec(c.body)})})}rec(prog.main.body);Object.keys(prog.subs).forEach(function(k){vistos.SubProceso=true;rec(prog.subs[k].body)});return tipos.filter(function(t){return !vistos[t]})}

/* ---------- Diagrama de flujo ---------- */
var CH=8.2,AL=34,SEP=24;
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function ancho(t,min){return Math.max(min||70,Math.min(t.length,46)*CH+26)}
function corto(t){return t.length>46?t.slice(0,44)+"…":t}
function texto(cx,cy,t,col){return '<text x="'+cx+'" y="'+(cy+5)+'" text-anchor="middle" fill="'+(col||"#14202b")+'">'+esc(corto(t))+'</text>'}
function flecha(x1,y1,x2,y2){return '<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" class="ln"/>'}
function punta(x,y){return '<path d="M'+(x-5)+' '+(y-8)+'L'+(x+5)+' '+(y-8)+'L'+x+' '+y+'z" class="pt"/>'}
function caja(n,op){
 var t=n.t,tx=n.txt||"",w,lab=tx;
 if(t==="Leer"||t==="Escribir"){w=ancho(lab)+22;return{w:w,h:AL,cx:w/2,draw:function(x,y){return g(n,op,'<path d="M'+(x+14)+' '+y+'H'+(x+w)+'L'+(x+w-14)+' '+(y+AL)+'H'+x+'z" fill="'+(t==="Leer"?"#ffd9e6":"#d7f5dc")+'" stroke="'+(t==="Leer"?"#c2185b":"#2e7d32")+'"/>'+texto(x+w/2,y+AL/2,lab)+marca(x+w-8,y+6,t==="Leer"))}}}
 if(t==="Inicio"||t==="Fin"){w=ancho(lab,110);return{w:w,h:AL,cx:w/2,draw:function(x,y){return'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+AL+'" rx="17" fill="#fde8cf" stroke="#b86a12"/>'+texto(x+w/2,y+AL/2,lab)}}}
 if(t==="Definir")lab="Definir "+tx;if(t==="Dimension")lab="Dimension "+tx;
 w=ancho(lab);return{w:w,h:AL,cx:w/2,draw:function(x,y){return g(n,op,'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+AL+'" fill="#fff8cc" stroke="#a8912c"/>'+texto(x+w/2,y+AL/2,lab))}}}
function marca(x,y,entra){return entra?'<path d="M'+x+' '+(y+8)+'l-8 -8m0 0h6m-6 0v6" class="mk"/>':'<path d="M'+(x-8)+' '+(y+8)+'l8 -8m0 0h-6m6 0v6" class="mk"/>'}
function g(n,op,s){return op&&op.edit&&n.uid?'<g class="bl" data-uid="'+n.uid+'">'+s+'</g>':s}
function rombo(n,op,lab,col){var w=Math.max(120,Math.min(lab.length,46)*CH+66),h=64;return{w:w,h:h,draw:function(x,y){return g(n,op,'<path d="M'+(x+w/2)+' '+y+'L'+(x+w)+' '+(y+h/2)+'L'+(x+w/2)+' '+(y+h)+'L'+x+' '+(y+h/2)+'z" fill="'+(col||"#e7ddfb")+'" stroke="#6a45b8"/>'+texto(x+w/2,y+h/2,lab))}}}
function mas(x,y,lista,i,op){return op&&op.edit?'<g class="ins" data-lista="'+lista+'" data-i="'+i+'"><circle cx="'+x+'" cy="'+y+'" r="15" fill="transparent"/><circle cx="'+x+'" cy="'+y+'" r="10" class="insc"/><path d="M'+(x-5)+' '+y+'H'+(x+5)+'M'+x+' '+(y-5)+'V'+(y+5)+'" class="insm"/></g>':""}
function bloque(L,op,lista){
 L=L||[];var it=L.map(function(n){return nodo(n,op)}),der=0,izq=0;it.forEach(function(k){izq=Math.max(izq,k.cx);der=Math.max(der,k.w-k.cx)});
 var e=op&&op.edit?SEP+12:SEP;if(!it.length){izq=Math.max(izq,14);der=Math.max(der,14)}
 var h=it.reduce(function(a,k){return a+k.h+e},e);
 return{w:izq+der,h:h,cx:izq,draw:function(x,y){var o="",cy=y,c=x+izq,idl=lista;for(var i=0;i<it.length;i++){o+=flecha(c,cy,c,cy+e)+punta(c,cy+e)+mas(c,cy+e/2-3,idl,i,op);cy+=e;o+=it[i].draw(c-it[i].cx,cy);cy+=it[i].h}o+=flecha(c,cy,c,cy+e)+mas(c,cy+e/2,idl,it.length,op);return o}}}
function nodo(n,op){
 if(n.t==="Si"){var r=rombo(n,op,n.txt),V=bloque(n.body,op,n.uid+":body"),F=bloque(n.sino,op,n.uid+":sino"),hh=Math.max(V.h,F.h),gap=26;
  var lw=Math.max(F.w,0),rw=Math.max(V.w,0);var half=r.w/2,wL=Math.max(lw,half*.4),wR=Math.max(rw,half*.4);var tot=wL+gap+wR,cx=wL+gap/2;tot=Math.max(tot,r.w);if(cx<half){cx=half}var w=Math.max(cx+gap/2+wR,cx+half);
  var cF=cx-gap/2-F.w+F.cx,cV=cx+gap/2+V.cx;if(cF>cx-half-8){cF=cx-half-8}if(cF-F.cx<0){var dl=F.cx-cF;cF+=dl;cx+=dl;cV+=dl;w+=dl}if(cV<cx+half+8){cV=cx+half+8}w=Math.max(w,cV+V.w-V.cx+2,cx+half);
  var H=r.h+hh+14;
  return{w:w,h:H,cx:cx,draw:function(x,y){var o=r.draw(x+cx-r.w/2,y),my=y+r.h/2,ty=y+r.h+4,by=ty+hh;
   o+='<path d="M'+(x+cx+half)+' '+my+'H'+(x+cV)+'V'+ty+'" class="ln"/><path d="M'+(x+cx-half)+' '+my+'H'+(x+cF)+'V'+ty+'" class="ln"/>'+'<text x="'+(x+cx+half+6)+'" y="'+(my-6)+'" class="et">V</text><text x="'+(x+cx-half-14)+'" y="'+(my-6)+'" class="et">F</text>';
   o+=V.draw(x+cV-V.cx,ty)+F.draw(x+cF-F.cx,ty);
   o+='<path d="M'+(x+cV)+' '+(ty+V.h)+'V'+by+'M'+(x+cF)+' '+(ty+F.h)+'V'+by+'M'+(x+cF)+' '+by+'H'+(x+cV)+'M'+(x+cx)+' '+by+'V'+(y+H)+'" class="ln"/>';return o}}}
 if(n.t==="Mientras"||n.t==="Para"){var lab=n.txt,rm=rombo(n,op,lab,n.t==="Para"?"#ddf0fb":null),B=bloque(n.body,op,n.uid+":body"),hl=Math.max(rm.w/2,B.cx),hr=Math.max(rm.w/2,B.w-B.cx),mg=24,cm=hl+mg,w2=hl+hr+2*mg,H2=rm.h+B.h+22;
  return{w:w2,h:H2,cx:cm,draw:function(x,y){var c=x+cm,o=rm.draw(c-rm.w/2,y),my=y+rm.h/2,by=y+rm.h+B.h;o+=flecha(c,y+rm.h,c,y+rm.h+2)+B.draw(c-B.cx,y+rm.h+2);
   o+='<path d="M'+c+' '+(by+2)+'H'+(x+6)+'V'+my+'H'+(c-rm.w/2)+'" class="ln"/>'+punta2(c-rm.w/2,my);
   o+='<path d="M'+(c+rm.w/2)+' '+my+'H'+(x+w2-6)+'V'+(y+H2-8)+'H'+c+'V'+(y+H2)+'" class="ln"/>';
   o+='<text x="'+(c+6)+'" y="'+(y+rm.h+13)+'" class="et">'+(n.t==="Para"?"":"V")+'</text><text x="'+(c+rm.w/2+6)+'" y="'+(my-6)+'" class="et">'+(n.t==="Para"?"fin":"F")+'</text>';return o}}}
 if(n.t==="Repetir"){var rr=rombo(n,op,n.txt),Bb=bloque(n.body,op,n.uid+":body"),hl2=Math.max(rr.w/2,Bb.cx),hr2=Math.max(rr.w/2,Bb.w-Bb.cx),mg2=24,c3=hl2+mg2,w3=hl2+hr2+mg2+4,H3=Bb.h+rr.h+10;
  return{w:w3,h:H3,cx:c3,draw:function(x,y){var c=x+c3,o=Bb.draw(c-Bb.cx,y),ry=y+Bb.h;o+=rr.draw(c-rr.w/2,ry);var my=ry+rr.h/2;
   o+='<path d="M'+(c-rr.w/2)+' '+my+'H'+(x+6)+'V'+(y+2)+'H'+c+'" class="ln"/>'+'<text x="'+(c-rr.w/2-14)+'" y="'+(my-6)+'" class="et">F</text>'+flecha(c,ry+rr.h,c,y+H3)+'<text x="'+(c+6)+'" y="'+(ry+rr.h+10)+'" class="et">V</text>';return o}}}
 if(n.t==="Segun"){var rs=rombo(n,op,n.txt),cs=(n.casos||[]).map(function(k){return{txt:k.txt,b:bloque(k.body,op,"")}});cs.push({txt:"De otro modo",b:bloque(n.otro,op,"")});
  var anchos=cs.map(function(k){return Math.max(k.b.w,k.txt.length*CH+12)+18}),tw=anchos.reduce(function(a,b){return a+b},0),hs=0;cs.forEach(function(k){hs=Math.max(hs,k.b.h)});var ws=Math.max(tw,rs.w),cxs=ws/2,Hs=rs.h+26+hs+14;
  return{w:ws,h:Hs,cx:cxs,draw:function(x,y){var o=rs.draw(x+cxs-rs.w/2,y),ax=x+(ws-tw)/2,ty=y+rs.h+14,by=ty+12+hs,cc=[];cs.forEach(function(k,i){var cc1=ax+anchos[i]/2;cc.push(cc1);o+='<text x="'+cc1+'" y="'+(ty+8)+'" text-anchor="middle" class="et">'+esc(k.txt)+'</text>'+k.b.draw(cc1-k.b.cx,ty+12)+'<path d="M'+cc1+' '+(ty+12+k.b.h)+'V'+by+'" class="ln"/>';ax+=anchos[i]});
   o+='<path d="M'+(x+cxs)+' '+(y+rs.h)+'V'+(y+rs.h+6)+'M'+cc[0]+' '+(y+rs.h+6)+'H'+cc[cc.length-1]+'M'+cc[0]+' '+by+'H'+cc[cc.length-1]+'M'+(x+cxs)+' '+by+'V'+(y+Hs)+'" class="ln"/>';cc.forEach(function(c){o+=flecha(c,y+rs.h+6,c,ty-4)});return o}}}
 return caja(n,op)}
function punta2(x,y){return '<path d="M'+(x-8)+' '+(y-5)+'L'+(x-8)+' '+(y+5)+'L'+x+' '+y+'z" class="pt"/>'}
var CSS='text{font:14px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.ln{fill:none;stroke:#b3261e;stroke-width:1.6}.pt{fill:#b3261e}.et{font-size:12px;font-weight:700;fill:#6a45b8}.mk{fill:none;stroke:#1a237e;stroke-width:1.4}.insc{fill:#0e7490}.insm{stroke:#fff;stroke-width:2}.ins,.bl{cursor:pointer}.bl:hover path,.bl:hover rect{stroke-width:2.4}';
/* Genera el SVG de una lista de bloques ({t,txt,body,sino...}). */
function diagrama(titulo,L,op){op=op||{};var ini=caja({t:"Inicio",txt:titulo}),fin=caja({t:"Fin",txt:op.fin||"FinProceso"}),b=bloque(L,op,op.lista||"raiz");var cx=Math.max(ini.cx,b.cx,fin.cx),w=cx+Math.max(ini.w-ini.cx,b.w-b.cx,fin.w-fin.cx)+24,h=ini.h+b.h+fin.h+24;var X=cx+12;
 var s=ini.draw(X-ini.cx,12)+b.draw(X-b.cx,12+ini.h)+punta(X,12+ini.h+b.h)+fin.draw(X-fin.cx,12+ini.h+b.h);
 return'<svg xmlns="http://www.w3.org/2000/svg" width="'+Math.ceil(w)+'" height="'+Math.ceil(h)+'" viewBox="0 0 '+Math.ceil(w)+' '+Math.ceil(h)+'" role="img" aria-label="Diagrama de flujo de '+esc(titulo)+'"><style>'+CSS+'</style><rect width="100%" height="100%" fill="#fff"/>'+s+'</svg>'}
function flujoDe(prog){return diagrama("Proceso "+prog.main.nom,prog.main.body)}

raiz.PSEINT={analiza:analiza,corre:corre,ejecuta:ejecuta,compara:compara,usa:usa,diagrama:diagrama,flujoDe:flujoDe,fmt:fmt,RES:RES};
if(typeof module!=="undefined")module.exports=raiz.PSEINT;
})(typeof window!=="undefined"?window:globalThis);
