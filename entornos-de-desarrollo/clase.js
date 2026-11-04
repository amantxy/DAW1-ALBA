(function(){
"use strict";
var $=function(s){return document.querySelector(s)},A=window.AZAR,P=window.PSEINT,E=window.EXPLICA,M=window.EJ_CLASE,NOM={F:"Fácil",M:"Medio",D:"Difícil"},K="ed:clase:nivel",ult=null;
function lee(){try{return localStorage.getItem(K)||""}catch(e){return""}}
function guarda(v){try{localStorage.setItem(K,v)}catch(e){}}
function ejemplos(x){var o=[];try{var prog=P.analiza(x.sol);x.pruebas.slice(0,2).forEach(function(p){var r=P.ejecuta(prog,p.e.map(String));if(r.error)return;var L=r.salida.replace(/\n$/,"").split("\n");if(L.length>12)L=L.slice(0,10).concat(["…"]);o.push((p.e.length?"Si el usuario escribe: "+p.e.join(", ")+"\n":"")+"El programa muestra:\n"+L.join("\n"))})}catch(e){}return o}
function nuevo(){
 var x=A.nuevo($("#niv").value,"codigo",ult);ult=x.id;var m=M[x.id]||{},e=E.esc;
 var h='<span class="niv">'+NOM[x.nivel]+'</span><h2>'+e(x.titulo)+'</h2><p>'+e(x.enun)+'</p>';
 h+='<p><b>Datos del problema</b></p><ul><li><b>Entrada:</b> '+(m.e||"")+'</li><li><b>Proceso:</b> '+(m.p||"")+'</li><li><b>Salida:</b> '+(m.s||"")+'</li></ul>';
 if(m.v)h+='<p><b>Variables necesarias:</b> '+m.v+'</p>';
 if(x.usa&&x.usa.length)h+='<p><b>Estructuras que se espera usar:</b> '+x.usa.map(function(u){return"<code>"+e(u)+"</code>"}).join(", ")+'.</p>';
 if(m.q&&m.q.length)h+='<p><b>Aspectos a tener en cuenta</b></p><ul>'+m.q.map(function(q){return"<li>"+q+"</li>"}).join("")+'</ul>';
 h+='<details class="sol"><summary>Ver solución en PSeInt</summary><div><pre class="code">'+e(x.sol)+'</pre><details class="com"><summary>Explicación comentada</summary><div class="ec-c">'+E.html(x.sol,{ejemplos:ejemplos(x)})+'</div></details></div></details>';
 $("#ej").innerHTML=h}
$("#niv").value=lee();$("#niv").onchange=function(){guarda(this.value);ult=null;nuevo()};
$("#otro").onclick=nuevo;nuevo();
})();
