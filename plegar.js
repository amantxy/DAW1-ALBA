/* Convierte la teoría larga en apartados plegables: por h2, h3 o h4 según la página. */
(function(){
"use strict";
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function plegable(cab,top){var d=document.createElement("details");d.className="pleg"+(top?" top":"");var s=document.createElement("summary");cab.parentNode.insertBefore(d,cab);s.appendChild(cab);d.appendChild(s);var c=document.createElement("div");c.className="pleg-c";d.appendChild(c);return c}
function agrupa(raiz,tag,top){var cabs=Array.prototype.filter.call(raiz.children,function(e){return e.tagName===tag});if(cabs.length<2)return false;cabs.forEach(function(h){var sig=[],n=h.nextElementSibling;while(n&&n.tagName!==tag&&!(top&&n.classList.contains("next"))){sig.push(n);n=n.nextElementSibling}var c=plegable(h,top);sig.forEach(function(x){c.appendChild(x)})});return true}
function hazlo(){
 var hecho=0;
 /* Páginas seguidas: un apartado por cada h2 y, dentro, por cada h3 */
 $$(".wrap").forEach(function(w){if(agrupa(w,"H2",true)){hecho++;$$(".pleg.top>.pleg-c",w).forEach(function(c){agrupa(c,"H3",false)})}});
 /* Carpetas con varios subtítulos */
 $$("details.fold>.in").forEach(function(c){if(agrupa(c,"H3",false))hecho++});
 /* Apuntes por secciones */
 $$("section.sec>.body").forEach(function(b){var s=b.parentNode;if(s.closest(".ejgrupo")||/^p-/.test(s.id||""))return;if(/^Ejercicios Cap/.test((s.querySelector("h3")||{}).textContent||""))return;if(agrupa(b,"H4",false))hecho++});
 if(!hecho)return;
 /* Abrir lo que señala un enlace interno */
 function abreDestino(){var id=decodeURIComponent(location.hash.slice(1));if(!id)return;var t=document.getElementById(id);if(!t)return;var d=t.closest("details");while(d){d.open=true;d=d.parentElement&&d.parentElement.closest("details")}t.scrollIntoView()}
 window.addEventListener("hashchange",abreDestino);abreDestino();
 document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(a&&a.getAttribute("href")===location.hash)setTimeout(abreDestino,0)});
 window.addEventListener("beforeprint",function(){$$("details").forEach(function(d){d.dataset.imp=d.open?"1":"";d.open=true})});
 window.addEventListener("afterprint",function(){$$("details").forEach(function(d){d.open=d.dataset.imp==="1"})});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",hazlo);else hazlo();
})();
