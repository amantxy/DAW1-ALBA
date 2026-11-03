/* Modo claro u oscuro elegido en la portada, y lo que solo se muestra con sesión iniciada. */
(function(){
var K="daw1-tema",root=document.documentElement,orig=new WeakMap();
function lee(){try{return localStorage.getItem(K)}catch(e){return null}}
function recorre(reglas,t){[].forEach.call(reglas||[],function(r){
 if(r.media&&r.cssRules){if(!orig.has(r))orig.set(r,r.media.mediaText);var o=orig.get(r);
  if(/prefers-color-scheme:\s*dark/.test(o))r.media.mediaText=t==="dark"?"all":t==="light"?"not all":o;}
})}
function aplica(t){
 if(t){root.setAttribute("data-theme",t);root.style.colorScheme=t}else{root.removeAttribute("data-theme");root.style.colorScheme=""}
 [].forEach.call(document.styleSheets,function(s){try{recorre(s.cssRules,t)}catch(e){}});
}
function oscuro(){var t=lee();return t?t==="dark":matchMedia("(prefers-color-scheme:dark)").matches}
function hayCuenta(){try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^sb-.*-auth-token$/.test(k)&&localStorage.getItem(k))return true}}catch(e){}return false}
window.DAW1_CUENTA=hayCuenta;
aplica(lee());
function listo(){
 aplica(lee());
 var si=hayCuenta();[].forEach.call(document.querySelectorAll("[data-cuenta]"),function(e){e.hidden=!si});
 var b=document.getElementById("tema");if(!b)return;
 function pinta(){var d=oscuro();b.textContent=d?"☀":"☾";b.setAttribute("aria-label",d?"Cambiar a modo claro":"Cambiar a modo oscuro");b.title=b.getAttribute("aria-label")}
 b.onclick=function(){var n=oscuro()?"light":"dark";try{localStorage.setItem(K,n)}catch(e){}aplica(n);pinta()};pinta();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",listo);else listo();
})();
