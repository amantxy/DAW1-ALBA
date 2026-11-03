/* Visor de imágenes: abre en la misma pantalla y permite ampliar con pellizco, doble toque, botones o rueda. */
(function(){
var MAX=6,box,stage,img,cap,origen,s=1,x=0,y=0,baseW=0,baseH=0,conHistoria=false;
var ptrs=new Map(),dist=0,movido=false,ultimoToque=0;
var st=document.createElement("style");
st.textContent='figure img{cursor:zoom-in}figure img:focus-visible{outline:3px solid var(--c);outline-offset:2px}'+
'.vz{position:fixed;inset:0;z-index:1000;background:#05080f;color:#fff;display:flex;flex-direction:column;overscroll-behavior:contain}.vz[hidden]{display:none}'+
'.vz-st{flex:1;min-height:0;position:relative;overflow:hidden;touch-action:none;display:flex;align-items:center;justify-content:center;cursor:grab;user-select:none;-webkit-user-select:none}'+
'.vz-st img{display:block;background:#fff;transform-origin:center;will-change:transform;-webkit-user-drag:none;max-width:none;cursor:inherit}'+
'.vz-bar{display:flex;align-items:center;gap:8px;padding:max(8px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) 8px max(12px,env(safe-area-inset-left))}'+
'.vz-bar button{font:600 1.05rem system-ui,sans-serif;min-width:44px;min-height:44px;border:1px solid #475569;border-radius:10px;background:#172033;color:#fff;cursor:pointer}.vz-bar button:focus-visible{outline:3px solid #fff}'+
'.vz-z{min-width:52px;text-align:center;font:600 .9rem system-ui,sans-serif}.vz-e{flex:1}'+
'.vz-cap{margin:0;padding:8px max(14px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));font:.9rem/1.35 system-ui,sans-serif;color:#cbd5e1;max-height:22vh;overflow:auto}';
document.head.append(st);
function boton(t,et,fn){var b=document.createElement("button");b.type="button";b.textContent=t;b.setAttribute("aria-label",et);b.onclick=fn;return b}
function centro(){var r=stage.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height}}
function pinta(){
 var c=centro(),mx=Math.max(0,(baseW*s-c.w)/2),my=Math.max(0,(baseH*s-c.h)/2);
 x=Math.min(mx,Math.max(-mx,x));y=Math.min(my,Math.max(-my,y));
 img.style.transform="translate("+x+"px,"+y+"px) scale("+s+")";
 box.querySelector(".vz-z").textContent=Math.round(s*100)+" %";
}
function ajusta(){
 if(!img.naturalWidth)return;var c=centro(),r=Math.min(c.w/img.naturalWidth,c.h/img.naturalHeight);
 baseW=img.naturalWidth*r;baseH=img.naturalHeight*r;img.style.width=baseW+"px";img.style.height=baseH+"px";pinta();
}
function zoom(n,px,py){
 n=Math.min(MAX,Math.max(1,n));var c=centro(),dx=(px===undefined?c.x:px)-c.x,dy=(py===undefined?c.y:py)-c.y;
 x=dx-(dx-x)*n/s;y=dy-(dy-y)*n/s;s=n;pinta();
}
function crea(){
 box=document.createElement("div");box.className="vz";box.hidden=true;box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-label","Imagen ampliada");
 var bar=document.createElement("div");bar.className="vz-bar";
 var z=document.createElement("span");z.className="vz-z";z.setAttribute("aria-live","polite");
 var e=document.createElement("span");e.className="vz-e";
 bar.append(boton("−","Reducir",function(){zoom(s/1.5)}),z,boton("+","Ampliar",function(){zoom(s*1.5)}),e,boton("✕","Cerrar",cierra));
 stage=document.createElement("div");stage.className="vz-st";
 img=document.createElement("img");img.draggable=false;img.onload=ajusta;stage.append(img);
 cap=document.createElement("p");cap.className="vz-cap";
 box.append(bar,stage,cap);document.body.append(box);
 stage.addEventListener("pointerdown",function(ev){stage.setPointerCapture(ev.pointerId);ptrs.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});if(ptrs.size===1)movido=false;if(ptrs.size===2){dist=separacion();movido=true}});
 stage.addEventListener("pointermove",function(ev){
  var p=ptrs.get(ev.pointerId);if(!p)return;
  if(ptrs.size===1){var dx=ev.clientX-p.x,dy=ev.clientY-p.y;if(Math.abs(dx)+Math.abs(dy)>0){if(Math.abs(dx)+Math.abs(dy)>3)movido=true;x+=dx;y+=dy;pinta()}p.x=ev.clientX;p.y=ev.clientY}
  else if(ptrs.size===2){p.x=ev.clientX;p.y=ev.clientY;var d=separacion(),a=Array.from(ptrs.values());if(dist)zoom(s*d/dist,(a[0].x+a[1].x)/2,(a[0].y+a[1].y)/2);dist=d}
 });
 function fin(ev){
  if(!ptrs.has(ev.pointerId))return;ptrs.delete(ev.pointerId);dist=0;
  if(ptrs.size||movido||ev.type==="pointercancel")return;
  var t=Date.now();
  if(t-ultimoToque<320){ultimoToque=0;zoom(s>1?1:2.5,ev.clientX,ev.clientY)}else ultimoToque=t;
 }
 stage.addEventListener("pointerup",fin);stage.addEventListener("pointercancel",fin);
 stage.addEventListener("wheel",function(ev){ev.preventDefault();zoom(s*(ev.deltaY<0?1.2:1/1.2),ev.clientX,ev.clientY)},{passive:false});
 box.addEventListener("keydown",function(ev){
  if(ev.key==="Escape")cierra();else if(ev.key==="+"||ev.key==="=")zoom(s*1.5);else if(ev.key==="-")zoom(s/1.5);
  else if(ev.key==="Tab"){var b=box.querySelectorAll("button"),pri=b[0],ult=b[b.length-1];if(ev.shiftKey&&document.activeElement===pri){ev.preventDefault();ult.focus()}else if(!ev.shiftKey&&document.activeElement===ult){ev.preventDefault();pri.focus()}}
 });
 addEventListener("resize",function(){if(!box.hidden)ajusta()});
 addEventListener("popstate",function(){if(!box.hidden){conHistoria=false;cierra()}});
}
function separacion(){var a=Array.from(ptrs.values());return a.length<2?0:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}
function abre(i){
 if(!box)crea();origen=i;s=1;x=0;y=0;ptrs.clear();
 var f=i.closest("figure"),c=f&&f.querySelector("figcaption");cap.textContent=c?c.textContent:"";cap.hidden=!c;
 img.alt=i.alt;box.hidden=false;document.documentElement.style.overflow="hidden";
 img.src=i.currentSrc||i.src;if(img.complete)ajusta();
 try{history.pushState({visor:1},"");conHistoria=true}catch(e){conHistoria=false}
 box.querySelector('[aria-label="Cerrar"]').focus();
}
function cierra(){
 if(!box||box.hidden)return;box.hidden=true;document.documentElement.style.overflow="";
 if(conHistoria){conHistoria=false;history.back()}
 if(origen)origen.focus({preventScroll:true});
}
[].forEach.call(document.querySelectorAll("figure img"),function(i){
 i.tabIndex=0;i.setAttribute("role","button");i.setAttribute("aria-label","Ampliar imagen: "+i.alt);
 i.addEventListener("click",function(){abre(i)});
 i.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();abre(i)}});
});
})();
