/* Editor de diagramas Entidad-Relación. Funciona con ratón, teclado y pantalla táctil. */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)},NS="http://www.w3.org/2000/svg",CLAVE="bd:er:";
var svg=$("#lienzo"),msg=$("#msg");
var M={n:[],l:[],next:1},sel=null,selL=null,con=null,hist=[],futuro=[],vista={x:-20,y:-20,z:1},actual=null,solucionVista=false;
var TIPOS={ent:"Entidad",deb:"Entidad débil",rel:"Relación",atr:"Atributo",clave:"Atributo clave",multi:"Atributo multivaluado",deriv:"Atributo derivado",opc:"Atributo opcional",jer:"Jerarquía"};
function esAtr(k){return k==="atr"||k==="clave"||k==="multi"||k==="deriv"||k==="opc"}
function esEnt(k){return k==="ent"||k==="deb"}
function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function norm(t){return String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]/g,"")}
function guardaLS(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function leeLS(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function aviso(t,mal){msg.textContent=t||"";msg.className=mal?"mal":""}
function nodo(id){for(var i=0;i<M.n.length;i++)if(M.n[i].id===id)return M.n[i];return null}
/* Medidas */
function ancho(n){var c=(n.t||"").length;if(esEnt(n.k))return Math.max(96,c*9+28);if(n.k==="rel")return Math.max(104,c*9+56);if(n.k==="jer")return 76;return Math.max(84,c*8.2+30)}
function alto(n){if(esEnt(n.k))return 46;if(n.k==="rel")return 66;if(n.k==="jer")return 54;return 42}
function borde(n,tx,ty){var dx=tx-n.x,dy=ty-n.y,w=ancho(n)/2,h=alto(n)/2,d=Math.hypot(dx,dy)||1,t;
 if(esEnt(n.k))t=Math.min(dx?w/Math.abs(dx):1e9,dy?h/Math.abs(dy):1e9);
 else if(n.k==="rel")t=1/((Math.abs(dx)/w+Math.abs(dy)/h)||1);
 else if(n.k==="jer")t=Math.min(dx?w/Math.abs(dx):1e9,dy?h/Math.abs(dy):1e9)*.8;
 else t=1/(Math.sqrt(dx*dx/(w*w)+dy*dy/(h*h))||1);
 return{x:n.x+dx*t,y:n.y+dy*t,d:d}}
/* Dibujo */
function pieza(n,marcado){var w=ancho(n),h=alto(n),x=n.x,y=n.y,o="",st=marcado?"#c026d3":"#1f2a44",sw=marcado?3:1.8,f;
 if(esEnt(n.k)){o+='<rect x="'+(x-w/2)+'" y="'+(y-h/2)+'" width="'+w+'" height="'+h+'" rx="2" fill="#dbeafe" stroke="'+st+'" stroke-width="'+sw+'"/>';if(n.k==="deb")o+='<rect x="'+(x-w/2+4)+'" y="'+(y-h/2+4)+'" width="'+(w-8)+'" height="'+(h-8)+'" fill="none" stroke="'+st+'" stroke-width="1.4"/>'}
 else if(n.k==="rel")o+='<path d="M'+x+' '+(y-h/2)+'L'+(x+w/2)+' '+y+'L'+x+' '+(y+h/2)+'L'+(x-w/2)+' '+y+'Z" fill="#fef3c7" stroke="'+st+'" stroke-width="'+sw+'"/>';
 else if(n.k==="jer")o+='<path d="M'+(x-w/2)+' '+(y-h/2)+'H'+(x+w/2)+'L'+x+' '+(y+h/2)+'Z" fill="#fef9c3" stroke="'+st+'" stroke-width="'+sw+'"/>';
 else{f=n.k==="clave"?"#fde68a":"#e0f2fe";o+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+(w/2)+'" ry="'+(h/2)+'" fill="'+f+'" stroke="'+st+'" stroke-width="'+sw+'"'+(n.k==="deriv"||n.k==="opc"?' stroke-dasharray="6 4"':"")+'/>';if(n.k==="multi")o+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+(w/2-4)+'" ry="'+(h/2-4)+'" fill="none" stroke="'+st+'" stroke-width="1.3"/>'}
 var fs=esEnt(n.k)||n.k==="rel"?14:13,dy=n.k==="jer"?-5:4.8,txt=n.t||(n.k==="jer"?"":"");
 o+='<text x="'+x+'" y="'+(y+dy)+'" text-anchor="middle" font-size="'+fs+'" font-weight="'+(esEnt(n.k)?700:500)+'"'+(n.k==="clave"?' text-decoration="underline"':"")+' fill="#14202b">'+esc(txt)+'</text>';
 if(n.k==="rel"){var tot=total(n);if(tot)o+='<text x="'+x+'" y="'+(y+h/2+15)+'" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">'+tot+'</text>'}
 return o}
function maximo(c){var m=/,\s*([^)]+)\)/.exec(c||"");return m?m[1].trim().toLowerCase():""}
function total(r){var ls=M.l.filter(function(l){return l.a===r.id||l.b===r.id}).filter(function(l){return esEnt((nodo(l.a===r.id?l.b:l.a)||{}).k)&&l.c});if(ls.length!==2)return"";var a=maximo(ls[0].c),b=maximo(ls[1].c);if(!a||!b)return"";if(a==="n"&&b==="n")return"N:M";return(a==="n"?"N":a)+":"+(b==="n"?"N":b)}
function curvas(l){var i=0,t=0;M.l.forEach(function(o){if((o.a===l.a&&o.b===l.b)||(o.a===l.b&&o.b===l.a)){if(o.id===l.id)i=t;t++}});return t>1?(i-(t-1)/2)*70:0}
function trazo(l){var a=nodo(l.a),b=nodo(l.b);if(!a||!b)return"";var of=curvas(l),dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,mx=(a.x+b.x)/2-dy/d*of,my=(a.y+b.y)/2+dx/d*of,p=of?"M"+a.x+" "+a.y+"Q"+mx+" "+my+" "+b.x+" "+b.y:"M"+a.x+" "+a.y+"L"+b.x+" "+b.y,marc=selL===l.id,o='<path d="'+p+'" fill="none" stroke="'+(marc?"#c026d3":"#1f2a44")+'" stroke-width="'+(marc?3:1.6)+'"/><path class="hit" data-l="'+l.id+'" d="'+p+'" fill="none" stroke="transparent" stroke-width="22"/>';
 if(l.c){var e=esEnt(a.k)?a:b,r=e===a?b:a,bb=borde(e,e===a?mx:mx,e===a?my:my),ux=(mx-bb.x),uy=(my-bb.y),n=Math.hypot(ux,uy)||1,dist=Math.min(26,n*.55),lx=bb.x+ux/n*dist-uy/n*12,ly=bb.y+uy/n*dist+ux/n*12;o+='<text class="card" data-l="'+l.id+'" x="'+lx+'" y="'+(ly+4)+'" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1d4ed8" stroke="#fff" stroke-width="3.5" paint-order="stroke">'+esc(l.c)+'</text>'}
 return o}
function pinta(){var o="";M.l.forEach(function(l){o+=trazo(l)});M.n.forEach(function(n){o+='<g class="n" data-n="'+n.id+'">'+pieza(n,sel===n.id||con===n.id)+'</g>'});$("#capa").innerHTML=o;aplicaVista();barra()}
function aplicaVista(){var r=svg.getBoundingClientRect();svg.setAttribute("viewBox",vista.x+" "+vista.y+" "+(r.width||800)/vista.z+" "+(r.height||500)/vista.z)}
function barra(){var hay=!!sel;$("#ctx").hidden=!hay&&!selL;$("#btCon").hidden=!hay;$("#btEdit").textContent=selL?"Cardinalidad":"Editar";var n=nodo(sel);$("#ctxNom").textContent=con?"Toca el elemento que quieres unir":n?TIPOS[n.k]+(n.t?": "+n.t:""):selL?"Línea":"";$("#btDes").disabled=!hist.length;$("#btReh").disabled=!futuro.length}
/* Historial y guardado */
function foto(){hist.push(JSON.stringify(M));if(hist.length>80)hist.shift();futuro=[]}
function guarda(){if(actual===undefined)return;guardaLS(CLAVE+(actual?actual.id:"libre"),M)}
function cambio(){guarda();pinta()}
function deshacer(){if(!hist.length)return;futuro.push(JSON.stringify(M));M=JSON.parse(hist.pop());sel=selL=con=null;cambio()}
function rehacer(){if(!futuro.length)return;hist.push(JSON.stringify(M));M=JSON.parse(futuro.pop());sel=selL=con=null;cambio()}
/* Crear y unir */
function centro(){var r=svg.getBoundingClientRect();return{x:vista.x+r.width/vista.z/2,y:vista.y+r.height/vista.z/2}}
function nuevo(k){foto();var c=centro(),base=nodo(sel),x,y;
 if(base&&esAtr(k)){var ya=M.l.filter(function(l){return l.a===base.id||l.b===base.id}).length,an=-Math.PI/2+ya*.9;x=base.x+Math.cos(an)*120;y=base.y+Math.sin(an)*100}
 else{var j=M.n.length%6;x=c.x-60+j*24;y=c.y-50+j*24}
 var n={id:M.next++,k:k,x:Math.round(x),y:Math.round(y),t:""};M.n.push(n);if(base&&esAtr(k)&&(esEnt(base.k)||base.k==="rel"||esAtr(base.k)))M.l.push({id:M.next++,a:base.id,b:n.id,c:""});
 if(k==="jer"){sel=n.id;selL=null;cambio();return}
 var padre=base&&esAtr(k)?base.id:null;sel=padre||n.id;selL=null;cambio();editaNodo(n,true,padre)}
function une(a,b){var A=nodo(a),B=nodo(b);if(!A||!B||a===b&&!(a===b))return false;
 if(a===b){aviso("Para una relación reflexiva, une el rombo dos veces con la misma entidad.",true);return false}
 var kA=A.k,kB=B.k;
 if(esEnt(kA)&&esEnt(kB)){aviso("Dos entidades no se unen directamente: pon una relación (rombo) entre ellas.",true);return false}
 if(kA==="rel"&&kB==="rel"){aviso("Dos relaciones no se unen entre sí.",true);return false}
 if(kA==="jer"&&kB==="jer"||kA==="jer"&&kB==="rel"||kB==="jer"&&kA==="rel"){aviso("La jerarquía se une con entidades.",true);return false}
 if(esAtr(kA)&&kB==="jer"||esAtr(kB)&&kA==="jer"){aviso("Un atributo no se une a una jerarquía.",true);return false}
 var rep=M.l.filter(function(l){return(l.a===a&&l.b===b)||(l.a===b&&l.b===a)}).length,rx=(kA==="rel"&&esEnt(kB))||(kB==="rel"&&esEnt(kA));
 if(rep&&!rx){aviso("Ya están unidos.",true);return false}if(rep>=2){aviso("Ya hay dos líneas entre ellos.",true);return false}
 foto();var l={id:M.next++,a:a,b:b,c:""};M.l.push(l);aviso("");
 if(rx){selL=l.id;sel=null;cambio();editaLinea(l)}else cambio();return true}
function borra(){if(sel){foto();var id=sel;M.n=M.n.filter(function(n){return n.id!==id});M.l=M.l.filter(function(l){return l.a!==id&&l.b!==id});sel=null;con=null;cambio()}else if(selL){foto();var il=selL;M.l=M.l.filter(function(l){return l.id!==il});selL=null;cambio()}}
/* Diálogos */
var dN=$("#dlgNodo"),dL=$("#dlgLinea"),enEd=null,enLi=null,esNuevo=false,padreEd=null;
function editaNodo(n,nuevoEl,padre){enEd=n;esNuevo=!!nuevoEl;padreEd=padre||null;$("#nTit").textContent=nuevoEl?"Nombre":TIPOS[n.k];$("#nNom").value=n.t||"";var s=$("#nTipo"),o=esEnt(n.k)?["ent","deb"]:esAtr(n.k)?["atr","clave","multi","deriv","opc"]:[n.k];s.innerHTML=o.map(function(k){return'<option value="'+k+'"'+(k===n.k?" selected":"")+'>'+TIPOS[k]+'</option>'}).join("");$("#nTipoC").hidden=o.length<2;dN.showModal();$("#nNom").focus();$("#nNom").select()}
function editaLinea(l){enLi=l;var A=nodo(l.a),B=nodo(l.b),rx=(A.k==="rel"&&esEnt(B.k))||(B.k==="rel"&&esEnt(A.k));$("#lCards").hidden=!rx;$("#lNo").hidden=rx;Array.prototype.forEach.call(document.querySelectorAll("#lCards button"),function(b){b.setAttribute("aria-pressed",String(b.dataset.c===l.c))});var e=esEnt(A.k)?A:B;$("#lEnt").textContent=rx?(e.t||"esta entidad"):"";dL.showModal()}
$("#nFrm").addEventListener("submit",function(ev){ev.preventDefault();if(!enEd)return;var t=$("#nNom").value.trim();if(!t&&!esNuevo&&enEd.k!=="jer"){$("#nNom").focus();return}if(!esNuevo)foto();enEd.t=t;enEd.k=$("#nTipo").value||enEd.k;dN.close();enEd=null;cambio()});
$("#nCan").onclick=function(){dN.close();if(esNuevo&&enEd&&!enEd.t){var id=enEd.id;M.n=M.n.filter(function(n){return n.id!==id});M.l=M.l.filter(function(l){return l.a!==id&&l.b!==id});if(sel===id)sel=null;hist.pop()}enEd=null;cambio()};
Array.prototype.forEach.call(document.querySelectorAll("#lCards button"),function(b){b.onclick=function(){if(!enLi)return;foto();enLi.c=b.dataset.c;dL.close();enLi=null;cambio()}});
$("#lBor").onclick=function(){dL.close();selL=enLi&&enLi.id;enLi=null;borra()};$("#lCan").onclick=function(){dL.close();enLi=null};
/* Barra */
Array.prototype.forEach.call(document.querySelectorAll("#pal button"),function(b){b.onclick=function(){con=null;aviso("");nuevo(b.dataset.k)}});
$("#btDes").onclick=deshacer;$("#btReh").onclick=rehacer;
$("#btCon").onclick=function(){con=sel;aviso("");pinta()};
$("#btEdit").onclick=function(){if(sel)editaNodo(nodo(sel));else if(selL)editaLinea(M.l.filter(function(l){return l.id===selL})[0])};
$("#btBor").onclick=borra;
$("#btMas").onclick=function(){zoom(1.25)};$("#btMen").onclick=function(){zoom(.8)};$("#btAju").onclick=ajusta;
function zoom(f,cx,cy){var r=svg.getBoundingClientRect();cx=cx===undefined?r.width/2:cx;cy=cy===undefined?r.height/2:cy;var ax=vista.x+cx/vista.z,ay=vista.y+cy/vista.z;vista.z=Math.max(.25,Math.min(3,vista.z*f));vista.x=ax-cx/vista.z;vista.y=ay-cy/vista.z;aplicaVista()}
function caja(m){var a=1e9,b=1e9,c=-1e9,d=-1e9;m.n.forEach(function(n){a=Math.min(a,n.x-ancho(n)/2);b=Math.min(b,n.y-alto(n)/2);c=Math.max(c,n.x+ancho(n)/2);d=Math.max(d,n.y+alto(n)/2+18)});return{a:a-30,b:b-30,c:c+30,d:d+30}}
function ajusta(){if(!M.n.length){vista={x:-20,y:-20,z:1};aplicaVista();return}var k=caja(M),r=svg.getBoundingClientRect();vista.z=Math.max(.25,Math.min(1.4,Math.min(r.width/(k.c-k.a),r.height/(k.d-k.b))));vista.x=(k.a+k.c)/2-r.width/vista.z/2;vista.y=(k.b+k.d)/2-r.height/vista.z/2;aplicaVista()}
/* Puntero */
var pts={},arr=null,pincha=null;var ultimo={};
function aLienzo(e){var r=svg.getBoundingClientRect();return{x:vista.x+(e.clientX-r.left)/vista.z,y:vista.y+(e.clientY-r.top)/vista.z}}
svg.addEventListener("pointerdown",function(e){svg.setPointerCapture(e.pointerId);pts[e.pointerId]={x:e.clientX,y:e.clientY};var ids=Object.keys(pts);
 if(ids.length===2){var p=pts[ids[0]],q=pts[ids[1]];pincha={d:Math.hypot(p.x-q.x,p.y-q.y),z:vista.z};arr=null;return}
 var g=e.target.closest&&e.target.closest("[data-n]"),li=e.target.closest&&e.target.closest("[data-l]"),o=aLienzo(e);
 if(g){var n=nodo(+g.dataset.n);arr={t:"n",n:n,dx:o.x-n.x,dy:o.y-n.y,sx:e.clientX,sy:e.clientY,mov:false,ya:sel===n.id}}
 else if(li)arr={t:"l",id:+li.dataset.l,sx:e.clientX,sy:e.clientY,mov:false};
 else arr={t:"f",vx:vista.x,vy:vista.y,sx:e.clientX,sy:e.clientY,mov:false}});
svg.addEventListener("pointermove",function(e){if(pts[e.pointerId])pts[e.pointerId]={x:e.clientX,y:e.clientY};var ids=Object.keys(pts);
 if(pincha&&ids.length===2){var p=pts[ids[0]],q=pts[ids[1]],r=svg.getBoundingClientRect();var nz=Math.max(.25,Math.min(3,pincha.z*Math.hypot(p.x-q.x,p.y-q.y)/(pincha.d||1)));zoom(nz/vista.z,(p.x+q.x)/2-r.left,(p.y+q.y)/2-r.top);return}
 if(!arr)return;var dx=e.clientX-arr.sx,dy=e.clientY-arr.sy;if(!arr.mov&&Math.hypot(dx,dy)<5)return;
 if(!arr.mov){arr.mov=true;if(arr.t==="n")foto()}
 if(arr.t==="n"){var o=aLienzo(e);arr.n.x=Math.round(o.x-arr.dx);arr.n.y=Math.round(o.y-arr.dy);pinta()}
 else if(arr.t==="f"){vista.x=arr.vx-dx/vista.z;vista.y=arr.vy-dy/vista.z;aplicaVista()}});
function suelta(e){delete pts[e.pointerId];if(Object.keys(pts).length<2)pincha=null;if(!arr)return;var a=arr;arr=null;
 if(a.mov){if(a.t==="n")guarda();return}
 if(a.t==="n"){if(con&&con!==a.n.id){var or=con;con=null;ultimo={};une(or,a.n.id);if(!selL)sel=or;pinta();return}if(con===a.n.id){con=null;aviso("Para una relación reflexiva, une el rombo dos veces con la misma entidad.",true);pinta();return}
  var ahora=Date.now(),doblen=ultimo.id===a.n.id&&ahora-ultimo.t<450;ultimo={id:a.n.id,t:ahora};sel=a.n.id;selL=null;pinta();if(doblen){ultimo={};editaNodo(a.n)}}
 else if(a.t==="l"){con=null;var ah=Date.now(),doble=ultimo.l===a.id&&ah-ultimo.t<450;ultimo={l:a.id,t:ah};selL=a.id;sel=null;pinta();if(doble)editaLinea(M.l.filter(function(l){return l.id===a.id})[0])}
 else{ultimo={};sel=selL=con=null;aviso("");pinta()}}
svg.addEventListener("pointerup",suelta);svg.addEventListener("pointercancel",function(e){delete pts[e.pointerId];arr=null;pincha=null});
svg.addEventListener("wheel",function(e){e.preventDefault();var r=svg.getBoundingClientRect();zoom(e.deltaY<0?1.1:.9,e.clientX-r.left,e.clientY-r.top)},{passive:false});
document.addEventListener("keydown",function(e){if(dN.open||dL.open)return;var t=(e.target.tagName||"").toLowerCase();if(t==="input"||t==="select"||t==="textarea")return;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?rehacer():deshacer();return}
 if(e.key==="Delete"||e.key==="Backspace"){if(sel||selL){e.preventDefault();borra()}}
 else if(e.key==="Escape"){con=sel=selL=null;pinta()}
 else if(e.key==="Enter"&&sel){e.preventDefault();editaNodo(nodo(sel))}
 else if(sel&&/^Arrow/.test(e.key)){e.preventDefault();var n=nodo(sel),s=e.shiftKey?30:10;foto();if(e.key==="ArrowUp")n.y-=s;if(e.key==="ArrowDown")n.y+=s;if(e.key==="ArrowLeft")n.x-=s;if(e.key==="ArrowRight")n.x+=s;cambio()}});
window.addEventListener("resize",aplicaVista);
/* Archivos */
function baja(blob,nom){var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=nom;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1500)}
function textoSVG(m){var mv=M,k;M=m;var o="";M.l.forEach(function(l){o+=trazo(l)});M.n.forEach(function(n){o+=pieza(n,false)});k=caja(M);M=mv;o=o.replace(/<path class="hit"[^>]*\/>/g,"");return{s:'<svg xmlns="'+NS+'" viewBox="'+k.a+' '+k.b+' '+(k.c-k.a)+' '+(k.d-k.b)+'" width="'+Math.round(k.c-k.a)+'" height="'+Math.round(k.d-k.b)+'" font-family="system-ui,Segoe UI,Arial,sans-serif"><rect x="'+k.a+'" y="'+k.b+'" width="100%" height="100%" fill="#fff"/>'+o+'</svg>',w:k.c-k.a,h:k.d-k.b}}
function nombre(){return actual?actual.id:"diagrama"}
$("#btPng").onclick=function(){if(!M.n.length){aviso("Todavía no hay nada que exportar.",true);return}var t=textoSVG(M),i=new Image;i.onload=function(){var c=document.createElement("canvas");c.width=t.w*2;c.height=t.h*2;var x=c.getContext("2d");x.scale(2,2);x.drawImage(i,0,0,t.w,t.h);c.toBlob(function(b){baja(b,nombre()+".png")})};i.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(t.s)};
$("#btSvg").onclick=function(){if(!M.n.length){aviso("Todavía no hay nada que exportar.",true);return}baja(new Blob([textoSVG(M).s],{type:"image/svg+xml"}),nombre()+".svg")};
$("#btGua").onclick=function(){baja(new Blob([JSON.stringify(M,null,1)],{type:"application/json"}),nombre()+".er.json")};
$("#btAbr").onclick=function(){$("#arch").click()};
$("#arch").onchange=function(e){var f=e.target.files[0];e.target.value="";if(!f)return;var r=new FileReader;r.onload=function(){try{var d=JSON.parse(r.result);if(!Array.isArray(d.n)||!Array.isArray(d.l))throw 0;d.n.forEach(function(n){if(!TIPOS[n.k]||typeof n.x!=="number"||typeof n.y!=="number")throw 0;n.t=String(n.t||"")});foto();M=d;M.next=d.n.concat(d.l).reduce(function(a,o){return Math.max(a,o.id+1)},1);sel=selL=con=null;cambio();ajusta()}catch(x){aviso("Ese archivo no es un diagrama válido.",true)}};r.readAsText(f)};
$("#btVac").onclick=function(){if(!M.n.length)return;foto();M={n:[],l:[],next:1};sel=selL=con=null;cambio();aviso("Lienzo vacío. Si ha sido sin querer, pulsa Deshacer.")};
var zona=$("#zona");$("#btFull").onclick=function(){var on=zona.classList.toggle("full");document.body.classList.toggle("sinscroll",on);this.textContent=on?"Salir":"Pantalla completa";aplicaVista();ajusta()};
/* Solución a partir del enunciado */
var nombreBase=function(s){return s.split("|")[0]};
function modeloSolucion(ej){var m={n:[],l:[],next:1},pos={},por={},Y=270,X=430;function nu(k,x,y,t){var n={id:m.next++,k:k,x:Math.round(x),y:Math.round(y),t:t};m.n.push(n);return n}function li(a,b,c){m.l.push({id:m.next++,a:a,b:b,c:c||""})}
 ej.ent.forEach(function(e){var n=nu(e.deb?"deb":"ent",120+e.p[0]*X,120+e.p[1]*Y,e.n);por[e.n]=n});
 (ej.rel||[]).forEach(function(r,ir){var xs=0,ys=0,pz=r.con.map(function(c){return por[c[0]]});var un=r.con[0][0]===r.con[r.con.length-1][0]&&r.con.length===2;pz.forEach(function(p){xs+=p.x;ys+=p.y});var cx=xs/pz.length,cy=ys/pz.length;var ig=(ej.rel||[]).slice(0,ir).filter(function(o){return o.con.length===r.con.length&&o.con.every(function(c,i){return c[0]===r.con[i][0]})}).length;if(un){cy-=165}cy+=ig*(ig%2?110:-110)+(ig?0:0);var n=nu("rel",cx,cy,r.n);r.con.forEach(function(c){li(n.id,por[c[0]].id,c[1])});(r.a||[]).forEach(function(a,i){var q=nu("atr",cx+(i-(r.a.length-1)/2)*120,cy+(un?-90:-92),nombreBase(a));li(n.id,q.id)})});
 (ej.jer||[]).forEach(function(j){var s=por[j.sup],t=nu("jer",s.x,s.y+120,"");li(t.id,s.id);j.subs.forEach(function(x){li(t.id,por[x].id)})});
 ej.ent.forEach(function(e){var n=por[e.n],vec=m.l.filter(function(l){return(l.a===n.id||l.b===n.id)}).map(function(l){return nodo2(m,l.a===n.id?l.b:l.a)}),angs=vec.map(function(v){return Math.atan2(v.y-n.y,v.x-n.x)}),cands=[Math.PI/2,-Math.PI/2,Math.PI,0],b=cands[0],mej=-1;cands.forEach(function(c){var d=angs.length?Math.min.apply(null,angs.map(function(a){var x=Math.abs(a-c)%(2*Math.PI);return x>Math.PI?2*Math.PI-x:x})):9;if(d>mej+.01){mej=d;b=c}});var k=e.a.length,sp=Math.min(2.3,1*(k-1)),rx=Math.max(135,k*42),ry=105;e.a.forEach(function(a,i){var an=k>1?b-sp/2+sp*i/(k-1):b,q=nu((e.pk||[]).indexOf(a)>=0?"clave":(e.multi||[]).indexOf(a)>=0?"multi":(e.der||[]).indexOf(a)>=0?"deriv":"atr",n.x+Math.cos(an)*rx,n.y+Math.sin(an)*ry,nombreBase(a));li(n.id,q.id)})});
 var mn=caja2(m);m.n.forEach(function(n){n.x-=mn.a-40;n.y-=mn.b-40});return m}
function nodo2(m,id){for(var i=0;i<m.n.length;i++)if(m.n[i].id===id)return m.n[i]}
function caja2(m){var mv=M;M=m;var k=caja(m);M=mv;return k}
/* Comprobar */
function coincide(esp,txt){return esp.split("|").some(function(x){var a=norm(x),b=norm(txt);return a===b||a+"s"===b||a===b+"s"||a+"es"===b})}
function comprueba(ej){var R=[],bien=0,tot=0,ents=M.n.filter(function(n){return esEnt(n.k)}),usadas={};function r(ok,t){tot++;if(ok)bien++;R.push({ok:ok,t:t})}
 function vec(id){return M.l.filter(function(l){return l.a===id||l.b===id}).map(function(l){return{n:nodo(l.a===id?l.b:l.a),c:l.c}})}
 var mapa={};
 ej.ent.forEach(function(e){var h=ents.filter(function(n){return coincide(e.n,n.t)})[0];r(!!h,h?"Entidad "+e.n:"Falta la entidad "+e.n);if(!h)return;mapa[e.n]=h;usadas[h.id]=1;if(!!e.deb!==(h.k==="deb"))r(false,e.n+(e.deb?" debe ser una entidad débil":" no es una entidad débil"));else if(e.deb)r(true,e.n+" es una entidad débil");
  var at=vec(h.id).map(function(v){return v.n}).filter(function(n){return esAtr(n.k)});e.a.forEach(function(a){var q=at.filter(function(x){return coincide(a,x.t)})[0],nb=nombreBase(a);if(!q){r(false,"Falta el atributo "+nb+" en "+e.n);return}var pk=(e.pk||[]).indexOf(a)>=0,mu=(e.multi||[]).indexOf(a)>=0,de=(e.der||[]).indexOf(a)>=0;if(pk&&q.k!=="clave")r(false,nb+" debe ser clave en "+e.n);else if(mu&&q.k!=="multi")r(false,nb+" debe ser multivaluado");else if(de&&q.k!=="deriv")r(false,nb+" debe ser derivado");else if(!pk&&!mu&&!de&&q.k==="clave")r(false,nb+" no es la clave de "+e.n);else r(true,"Atributo "+nb+" de "+e.n)})});
 ents.forEach(function(n){if(!usadas[n.id]&&n.t)R.push({av:1,t:"«"+n.t+"» no está en la solución modelo. Puede ser válida si la justificas."})});
 var rs=M.n.filter(function(n){return n.k==="rel"}),usadaR={};
 (ej.rel||[]).forEach(function(er){var clave=er.con.map(function(c){return norm(c[0])}).sort().join(),cand=rs.filter(function(n){if(usadaR[n.id])return false;var v=vec(n.id).filter(function(x){return esEnt(x.n.k)});return v.map(function(x){return ej.ent.map(function(e){return coincide(e.n,x.n.t)?norm(e.n):""}).join("")||norm(x.n.t)}).sort().join()===clave});
  var nom=er.con.map(function(c){return c[0]}).join(" y ");if(!cand.length){r(false,"Falta la relación «"+er.n+"» entre "+nom);return}
  function puntos(n){var v=vec(n.id).filter(function(x){return esEnt(x.n.k)}),e=er.con.slice(),p=0;v.forEach(function(x){for(var i=0;i<e.length;i++)if(coincide(e[i][0],x.n.t)&&norm(e[i][1])===norm(x.c||"")){p++;e.splice(i,1);return}});return p}
  cand.sort(function(a,b){return puntos(b)-puntos(a)});var h=cand[0];usadaR[h.id]=1;r(true,"Relación entre "+nom);
  var v=vec(h.id).filter(function(x){return esEnt(x.n.k)}),pend=er.con.slice();pend.forEach(function(c){var i,x=null;for(i=0;i<v.length;i++)if(coincide(c[0],v[i].n.t)&&norm(v[i].c||"")===norm(c[1])){x=v.splice(i,1)[0];break}if(x)r(true,"Cardinalidad "+c[1]+" junto a "+c[0]);else{for(i=0;i<v.length;i++)if(coincide(c[0],v[i].n.t)){v.splice(i,1);break}r(false,"Revisa la cardinalidad junto a "+c[0]+" en «"+er.n+"»")}});
  var at=vec(h.id).map(function(x){return x.n}).filter(function(n){return esAtr(n.k)});(er.a||[]).forEach(function(a){r(at.some(function(x){return coincide(a,x.t)}),(at.some(function(x){return coincide(a,x.t)})?"Atributo ":"Falta el atributo ")+nombreBase(a)+" de la relación «"+er.n+"»")})});
 (ej.jer||[]).forEach(function(j){var t=M.n.filter(function(n){return n.k==="jer"}).filter(function(n){var v=vec(n.id).map(function(x){return x.n.t});return coincide(j.sup,v.join("|"))||v.some(function(x){return coincide(j.sup,x)})})[0];r(!!t,t?"Jerarquía de "+j.sup:"Falta la jerarquía de "+j.sup);if(t)j.subs.forEach(function(s){var ok=vec(t.id).some(function(x){return coincide(s,x.n.t)});r(ok,(ok?"Subtipo ":"Falta el subtipo ")+s)})});
 return{R:R,bien:bien,tot:tot}}
function muestra(res){var o='<p class="nota-r"><b>'+res.bien+' de '+res.tot+'</b> elementos coinciden con la solución modelo.'+(res.bien===res.tot?" ¡Perfecto!":"")+'</p><ul class="res">';res.R.forEach(function(x){o+='<li class="'+(x.av?"av":x.ok?"ok":"ko")+'">'+esc(x.t)+'</li>'});$("#result").innerHTML=o+'</ul>'}
$("#btCom").onclick=function(){if(!actual)return;var res=comprueba(actual);muestra(res);$("#btSol").hidden=false;var h=leeLS(CLAVE+"hechos")||{};if(res.bien===res.tot){h[actual.id]=1;guardaLS(CLAVE+"hechos",h);lista()}};
$("#btSol").onclick=function(){var b=$("#solBox");b.hidden=!b.hidden;this.textContent=b.hidden?"Ver la solución":"Ocultar la solución";if(!b.hidden){var t=textoSVG(modeloSolucion(actual));$("#solFig").innerHTML='<img alt="Solución modelo del diagrama" src="data:image/svg+xml;charset=utf-8,'+encodeURIComponent(t.s)+'" width="'+Math.round(t.w)+'" height="'+Math.round(t.h)+'">'}};
$("#btCarSol").onclick=function(){foto();M=modeloSolucion(actual);sel=selL=con=null;cambio();ajusta();aviso("Solución cargada en el lienzo. Deshacer recupera tu diagrama.")};
/* Selección de ejercicio */
var NIV={F:"Fácil",M:"Medio",D:"Difícil"},selEj=$("#ejSel");
function lista(){var h=leeLS(CLAVE+"hechos")||{},v=selEj.value;selEj.innerHTML='<option value="">Lienzo libre</option>'+ER_EJ.map(function(e){return'<option value="'+e.id+'">'+(h[e.id]?"✓ ":"")+NIV[e.niv]+" · "+esc(e.tit)+'</option>'}).join("");selEj.value=v}
function abre(id){actual=ER_EJ.filter(function(e){return e.id===id})[0]||null;var d=leeLS(CLAVE+(id||"libre"));M=d&&Array.isArray(d.n)?d:{n:[],l:[],next:1};hist=[];futuro=[];sel=selL=con=null;$("#enun").hidden=!actual;$("#btCom").hidden=!actual;$("#btSol").hidden=true;$("#solBox").hidden=true;$("#btSol").textContent="Ver la solución";$("#result").innerHTML="";aviso("");if(actual){$("#ejNiv").textContent=NIV[actual.niv];$("#ejTit").textContent=actual.tit;$("#ejTxt").textContent=actual.enun}pinta();ajusta();try{localStorage.setItem(CLAVE+"ultimo",JSON.stringify(id||""))}catch(e){}}
selEj.onchange=function(){abre(selEj.value)};
$("#btAzar").onclick=function(){var nv=$("#ejNivel").value,p=ER_EJ.filter(function(e){return(!nv||e.niv===nv)&&(!actual||e.id!==actual.id)});if(!p.length)return;var e=p[Math.floor(Math.random()*p.length)];selEj.value=e.id;abre(e.id)};
window.ER={modelo:function(){return M},carga:function(m){M=m;cambio()},comprueba:comprueba,modeloSolucion:modeloSolucion,textoSVG:textoSVG,ejercicios:ER_EJ};
lista();var u=leeLS(CLAVE+"ultimo"),q=new URLSearchParams(location.search).get("ej");var ini=q&&ER_EJ.some(function(e){return e.id===q})?q:(typeof u==="string"?u:"");if(!ER_EJ.some(function(e){return e.id===ini}))ini=ini?"":ER_EJ[0].id;selEj.value=ini;abre(ini);
})();
