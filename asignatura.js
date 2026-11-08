/* Panel de asignatura: buscador dentro de la asignatura + generador de resumen/esquema descargable.
   Se carga desde la portada de cada asignatura: <script src="../asignatura.js" defer></script> */
(function(){
  var CSS=
  "#asig-panel{position:fixed;left:0;top:0;bottom:0;width:300px;overflow:auto;background:var(--hoja,#fff);border-right:1px solid var(--linea,#d7e0ec);padding:16px 14px 40px;z-index:50;font:15px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--tinta,#0f1b2d)}"+
  "#asig-panel h3{margin:14px 0 6px;font-size:.95rem;color:var(--c,#2563eb);display:flex;align-items:center;gap:6px}"+
  "#asig-panel h3:first-child{margin-top:4px}"+
  "#asig-panel label{display:block;font-size:.82rem;color:var(--suave,#52637a);margin:8px 0 3px}"+
  "#asig-panel input[type=text],#asig-panel input[type=number],#asig-panel select{width:100%;font:inherit;padding:9px 10px;border:1px solid var(--linea,#d7e0ec);border-radius:10px;background:var(--bg,#f3f6fb);color:var(--tinta,#0f1b2d);min-height:42px}"+
  "#asig-panel button{font:inherit;font-weight:600;border:1px solid var(--c,#2563eb);background:var(--c,#2563eb);color:#fff;border-radius:10px;padding:10px 12px;min-height:44px;cursor:pointer;width:100%;margin-top:10px}"+
  "#asig-panel button.sec{background:var(--hoja,#fff);color:var(--c,#2563eb)}"+
  "#asig-panel button:disabled{opacity:.6;cursor:wait}"+
  "#asig-panel .r{margin-top:10px;display:flex;flex-direction:column;gap:6px}"+
  "#asig-panel .r a{display:block;text-decoration:none;color:inherit;border:1px solid var(--linea,#d7e0ec);border-radius:10px;padding:8px 10px;background:var(--cs,#eef4ff)}"+
  "#asig-panel .r a b{display:block;color:var(--c,#2563eb);font-size:.88rem}"+
  "#asig-panel .r a span{font-size:.85rem;color:var(--suave,#52637a)}"+
  "#asig-panel mark{background:#fde68a;color:#111;border-radius:3px;padding:0 2px}"+
  "#asig-panel .e{font-size:.83rem;color:var(--suave,#52637a);margin-top:6px;min-height:1.2em}"+
  "#asig-panel .fila{display:grid;grid-template-columns:1fr 1fr;gap:8px}"+
  "#asig-panel .lista{max-height:220px;overflow:auto;border:1px solid var(--linea,#d7e0ec);border-radius:10px;padding:6px 8px;background:var(--bg,#f3f6fb)}"+
  "#asig-panel .op{display:flex;gap:6px;align-items:flex-start;margin:4px 0;color:var(--tinta,#0f1b2d)}"+
  "#asig-panel .op input{width:auto;margin-top:3px;min-height:0}"+
  "#asig-toggle{display:none;position:fixed;right:14px;bottom:14px;z-index:60;border:0;border-radius:999px;padding:12px 16px;background:var(--c,#2563eb);color:#fff;font:600 15px system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.25);min-height:48px;cursor:pointer}"+
  "@media (min-width:1100px){body.asig-p{padding-left:300px}}"+
  "@media (max-width:1099px){#asig-panel{transform:translateX(-105%);transition:transform .2s;width:min(88vw,340px);box-shadow:0 0 30px rgba(0,0,0,.3)}body.asig-open #asig-panel{transform:none}#asig-toggle{display:block}}"+
  "@media (prefers-reduced-motion:reduce){#asig-panel{transition:none!important}}";

  var EXCLUIR=/ponte|ejercicios|practica|diagramas|ide\.html|index\.html|-azar|banco/i;
  var cache=null, cargando=null;
  var $=function(id){return document.getElementById(id)};

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function norm(s){return String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}
  function limpia(s){return String(s||"").replace(/🔊|←\s*Volver|Volver/g,"").replace(/\s+/g," ").trim()}
  function frases(t,n){var p=t.split(/(?<=[.!?])\s+/);return p.slice(0,n).join(" ")}
  function nombreAsig(){var h=document.querySelector("h1");return limpia(h?h.textContent:document.title)||"asignatura"}
  function slug(s){return norm(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"documento"}

  function fuentesUrls(){
    var urls=[location.href.split("#")[0]], vistos={};
    vistos[urls[0]]=1;
    Array.prototype.forEach.call(document.querySelectorAll('a[href$=".html"]'),function(a){
      var h=a.getAttribute("href");
      if(!h||h.indexOf("/")!==-1||EXCLUIR.test(h))return;
      var u=new URL(h,location.href).href.split("#")[0];
      if(!vistos[u]){vistos[u]=1;urls.push(u)}
    });
    if(urls.length>1&&/index\.html$/.test(urls[0]))urls.shift();
    return urls;
  }

  function extraeBloques(doc){
    var raiz=doc.body||doc;
    Array.prototype.forEach.call(raiz.querySelectorAll("script,style,nav,pre,code,table,svg,button,input,select,textarea,.back,#pomo,#asig-panel"),function(n){n.parentNode&&n.parentNode.removeChild(n)});
    var sel="h1,h2,h3,h4,summary,p,li,dt,dd";
    var nodos=Array.prototype.filter.call(raiz.querySelectorAll(sel),function(el){
      var p=el.parentElement;
      while(p){ if(p.matches&&p.matches(sel)) return false; p=p.parentElement }
      return true;
    });
    var out=[];
    nodos.forEach(function(el){
      var t=limpia(el.textContent);
      if(t.length<3)return;
      var tag=el.tagName.toLowerCase();
      if(/^h[1-4]$/.test(tag)) out.push({k:"h",n:+tag[1],t:t});
      else if(tag==="summary") out.push({k:"h",n:3,t:t});
      else if(tag==="p") out.push({k:"p",t:t});
      else if(tag==="li") out.push({k:"li",t:t});
      else if(tag==="dt") out.push({k:"dt",t:t});
      else if(tag==="dd") out.push({k:"li",t:t});
    });
    return out;
  }

  function cargaFuentes(onProgreso){
    if(cache)return Promise.resolve(cache);
    if(cargando)return cargando;
    var urls=fuentesUrls(), res=[], hechos=0;
    cargando=Promise.all(urls.map(function(u,i){
      return fetch(u,{credentials:"same-origin"}).then(function(r){return r.ok?r.text():""}).catch(function(){return ""})
        .then(function(html){
          var doc=new DOMParser().parseFromString(html,"text/html");
          var titulo=limpia((doc.querySelector("h1")||{}).textContent||(doc.title||"").replace(/·.*/,"")||u.split("/").pop());
          res[i]={url:u,titulo:titulo,bloques:html?extraeBloques(doc):[]};
          hechos++; if(onProgreso)onProgreso(hechos,urls.length);
        });
    })).then(function(){ cache=res.filter(function(p){return p.bloques.length}); return cache });
    return cargando;
  }

  function nivelTexto(bloque,nivel){
    if(bloque.k==="h")return [bloque];
    if(nivel==="basico")return bloque.k==="p"?[{k:"p",t:frases(bloque.t,1)}]:(bloque.k==="dt"?[bloque]:[]);
    if(nivel==="medio")return bloque.k==="p"?[{k:"p",t:frases(bloque.t,3)}]:[{k:"li",t:frases(bloque.t,2)}];
    return [bloque];
  }

  function construyeResumen(paginas,nivel){
    var lineas=[];
    paginas.forEach(function(pg){
      lineas.push({k:"H1",t:pg.titulo});
      pg.bloques.forEach(function(b){
        if(b.k==="h"&&norm(b.t)===norm(pg.titulo))return;
        nivelTexto(b,nivel).forEach(function(x){
          if(x.k==="h")lineas.push({k:"h",n:Math.min(x.n+1,4),t:x.t});
          else if(x.k==="p")lineas.push({k:"p",t:x.t});
          else lineas.push({k:"b",t:x.t});
        });
      });
    });
    return lineas;
  }

  function paresDe(pg){
    var cartas=[], bl=pg.bloques;
    for(var i=0;i<bl.length;i++){
      var b=bl[i];
      if(b.k==="dt"){
        var r=[]; for(var j=i+1;j<bl.length&&bl[j].k==="li";j++) r.push(bl[j].t);
        if(r.length) cartas.push([b.t,r.join(" "),"dt"]);
      }else if(b.k==="h"&&b.n>=2&&b.n<=3&&norm(b.t)!==norm(pg.titulo)){
        var p=null;
        for(var k=i+1;k<bl.length&&bl[k].k!=="h";k++){ if(bl[k].k==="p"){p=bl[k].t;break} }
        if(p) cartas.push([b.t,p,"h"]);
      }
    }
    return cartas.filter(function(c){return c[1].length>=15});
  }

  function tarjetasDe(paginas,nivel){
    var lineas=[], lim=nivel==="basico"?1:(nivel==="medio"?2:99);
    paginas.forEach(function(pg){
      var cartas=paresDe(pg);
      if(!cartas.length)return;
      lineas.push({k:"H1",t:pg.titulo});
      cartas.forEach(function(c){
        lineas.push({k:"h",n:3,t:c[0]});
        lineas.push({k:"p",t:frases(c[1],lim)});
      });
    });
    return lineas;
  }

  function construyeEsquema(paginas,nivel){
    var arbol=[];
    paginas.forEach(function(pg){
      var raiz={t:pg.titulo,n:0,hijos:[]};
      var pila=[raiz];
      pg.bloques.forEach(function(b){
        if(b.k==="h"&&norm(b.t)===norm(pg.titulo))return;
        if(b.k==="h"){
          var n=Math.min(b.n,4);
          while(pila.length>1&&pila[pila.length-1].n>=n)pila.pop();
          var nodo={t:b.t,n:n,hijos:[]};
          pila[pila.length-1].hijos.push(nodo);pila.push(nodo);
        }else if(nivel!=="basico"){
          var padre=pila[pila.length-1];
          if(b.k==="p"&&nivel==="detallado")padre.hijos.push({t:frases(b.t,1),n:9,hijos:[],nota:true});
          else if(b.k==="li"||b.k==="dt")padre.hijos.push({t:nivel==="medio"?frases(b.t,1):b.t,n:9,hijos:[]});
        }
      });
      arbol.push(raiz);
    });
    var filas=[];
    (function walk(nodos,prof){
      nodos.forEach(function(x){
        filas.push({prof:prof,t:x.t,h:x.n<9&&x.n>0,raiz:x.n===0});
        walk(x.hijos,prof+1);
      });
    })(arbol,0);
    return filas;
  }

  function aMarkdown(tipo,datos,meta){
    var s="# "+meta.titulo+"\n\n";
    if(tipo==="resumen"){
      datos.forEach(function(l){
        if(l.k==="H1")s+="\n## "+l.t+"\n\n";
        else if(l.k==="h")s+="\n"+"#".repeat(Math.min(l.n+1,6))+" "+l.t+"\n\n";
        else if(l.k==="p")s+=l.t+"\n\n";
        else s+="- "+l.t+"\n";
      });
    }else{
      datos.forEach(function(f){
        if(f.raiz)s+="\n## "+f.t+"\n\n";
        else s+="  ".repeat(Math.max(0,f.prof-1))+"- "+(f.h?"**"+f.t+"**":f.t)+"\n";
      });
    }
    return s;
  }

  function aTexto(tipo,datos,meta){
    var s=meta.titulo.toUpperCase()+"\n"+"=".repeat(Math.min(meta.titulo.length,70))+"\n\n";
    if(tipo==="resumen"){
      datos.forEach(function(l){
        if(l.k==="H1")s+="\n"+l.t.toUpperCase()+"\n"+"-".repeat(Math.min(l.t.length,70))+"\n";
        else if(l.k==="h")s+="\n"+l.t+"\n";
        else if(l.k==="p")s+="\n"+l.t+"\n";
        else s+="  * "+l.t+"\n";
      });
    }else{
      datos.forEach(function(f){
        if(f.raiz)s+="\n"+f.t.toUpperCase()+"\n";
        else s+="  ".repeat(Math.max(0,f.prof-1))+(f.h?"":"- ")+f.t+"\n";
      });
    }
    return s;
  }

  var PDF_CDN="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  function cargaJsPDF(){
    if(window.jspdf)return Promise.resolve(window.jspdf.jsPDF);
    return new Promise(function(ok,ko){
      var s=document.createElement("script");s.src=PDF_CDN;s.async=true;
      s.onload=function(){window.jspdf?ok(window.jspdf.jsPDF):ko(new Error("jsPDF"))};s.onerror=function(){ko(new Error("red"))};
      document.head.appendChild(s);
    });
  }
  function pdfSeguro(s){
    return String(s).replace(/[→⇒]/g,"->").replace(/[•·]/g,"-").replace(/[^\x09\x0A\x0D\x20-\x7E -ÿ€–—‘’“”…]/g,"");
  }
  function aPDF(tipo,datos,meta,jsPDF){
    var doc=new jsPDF({unit:"mm",format:"a4"});
    var W=210,M=18,y=M,ancho=W-2*M,LH=5.6;
    function pagina(){doc.addPage();y=M}
    function escribe(txt,opt){
      opt=opt||{};
      doc.setFont("helvetica",opt.bold?"bold":"normal");
      doc.setFontSize(opt.size||10.5);
      var c=opt.color||[30,30,30];if(typeof c==="number")c=[c,c,c];doc.setTextColor(c[0],c[1],c[2]);
      var x=M+(opt.sangria||0);
      var lineas=doc.splitTextToSize(pdfSeguro(txt),ancho-(opt.sangria||0));
      lineas.forEach(function(l){
        if(y>H-M){pagina()}
        doc.text(l,x,y);y+=opt.lh||LH;
      });
      y+=opt.after||0;
    }
    var H=297;
    escribe(meta.titulo,{bold:true,size:18,color:[15,40,70],after:2,lh:8});
    escribe("Asignatura: "+meta.asig+" · "+(meta.etiqueta||(tipo==="resumen"?"Resumen":"Esquema mental"))+" · Nivel: "+meta.nivelTxt,{size:9,color:[110,110,110],after:4});
    doc.setDrawColor(234,88,12);doc.setLineWidth(.6);doc.line(M,y,W-M,y);y+=6;
    if(tipo==="resumen"){
      datos.forEach(function(l){
        if(l.k==="H1"){y+=3;escribe(l.t,{bold:true,size:14,color:[30,78,121],after:1,lh:7})}
        else if(l.k==="h"){y+=1.5;escribe(l.t,{bold:true,size:11.5,color:[30,78,121],lh:6})}
        else if(l.k==="p"){escribe(l.t,{after:1.5})}
        else {escribe("•  "+l.t,{sangria:4,after:.5})}
      });
    }else{
      datos.forEach(function(f){
        if(f.raiz){y+=3;escribe(f.t,{bold:true,size:14,color:[30,78,121],after:1,lh:7})}
        else{
          var sang=Math.min(4+(f.prof-1)*6,40);
          escribe((f.h?"":"•  ")+f.t,{bold:!!f.h,size:f.h?11:10.5,sangria:sang,after:.8,color:f.h?[30,78,121]:30});
        }
      });
    }
    var total=doc.getNumberOfPages();
    for(var i=1;i<=total;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(120,120,120);doc.text("Página "+i+" de "+total,W-M,292,{align:"right"})}
    return doc.output("blob");
  }

  var recogidos=null;
  function descarga(blob,nombre){
    if(recogidos){ recogidos.push({blob:blob,nombre:nombre}); return }
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);a.download=nombre;
    document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000);
  }


  function seccionesDe(pg){
    var out=[];
    pg.bloques.forEach(function(b,i){ if(b.k==="h"&&b.n<=2)out.push({i:i,t:b.t}) });
    if(!out.length)pg.bloques.forEach(function(b,i){ if(b.k==="h"&&b.n<=3&&out.length<40)out.push({i:i,t:b.t}) });
    return out;
  }
  function trozoSeccion(pg,i){
    var n=pg.bloques[i].n, j=i+1;
    while(j<pg.bloques.length&&!(pg.bloques[j].k==="h"&&pg.bloques[j].n<=n))j++;
    return {url:pg.url,titulo:pg.titulo+" · "+pg.bloques[i].t,bloques:pg.bloques.slice(i,j)};
  }
  function rellenaSel(){
    var alc=$("asig-alc").value, box=$("asig-sel");
    box.innerHTML="";
    if(alc==="todo"){ return }
    cargaFuentes().then(function(paginas){
      if(alc==="paginas"){
        box.innerHTML='<label>Marca las páginas</label><div class="lista">'+paginas.map(function(p,k){
          return '<label class="op"><input type="checkbox" data-k="'+k+'" checked> '+esc(p.titulo)+'</label>'}).join("")+'</div>';
      }else{
        box.innerHTML='<label for="asig-pg">Página</label><select id="asig-pg">'+paginas.map(function(p,k){return '<option value="'+k+'">'+esc(p.titulo)+'</option>'}).join("")+'</select>'+
          '<label for="asig-sec">Apartado</label><select id="asig-sec"></select>';
        $("asig-pg").onchange=rellenaSecciones;
        rellenaSecciones();
      }
    });
  }
  function rellenaSecciones(){
    cargaFuentes().then(function(paginas){
      var pg=paginas[+$("asig-pg").value]; var ss=seccionesDe(pg);
      $("asig-sec").innerHTML='<option value="all">Toda la página</option>'+ss.map(function(x){return '<option value="'+x.i+'">'+esc(x.t)+'</option>'}).join("");
    });
  }
  function seleccion(){
    return cargaFuentes().then(function(paginas){
      var alc=$("asig-alc").value;
      if(alc==="paginas"){
        var marcadas=[].slice.call(document.querySelectorAll('#asig-sel input[type=checkbox]:checked')).map(function(c){return paginas[+c.getAttribute("data-k")]});
        if(!marcadas.length)throw new Error("sin contenido");
        return marcadas;
      }
      if(alc==="apartado"){
        var pg=paginas[+$("asig-pg").value], sec=$("asig-sec").value;
        return [sec==="all"?pg:trozoSeccion(pg,+sec)];
      }
      return paginas;
    });
  }

  function mostrarVista(items){
    var caja=$("asig-vista");
    if(!caja){
      caja=document.createElement("div"); caja.id="asig-vista";
      caja.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;display:flex;align-items:center;justify-content:center;padding:14px";
      caja.innerHTML='<div style="background:var(--hoja,#fff);color:var(--tinta,#0f1b2d);border-radius:14px;max-width:960px;width:100%;max-height:92vh;display:flex;flex-direction:column;overflow:hidden"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--linea,#d7e0ec)"><b>Vista previa</b><button type="button" id="asig-vcerrar" style="width:auto;margin:0;padding:8px 14px">Cerrar</button></div><div id="asig-vcont" style="overflow:auto;padding:14px;display:flex;flex-direction:column;gap:18px"></div></div>';
      document.body.appendChild(caja);
      $("asig-vcerrar").onclick=function(){ cerrarVista() };
      caja.addEventListener("click",function(e){ if(e.target===caja)cerrarVista() });
    }
    var cont=$("asig-vcont"); cont.innerHTML=""; caja.style.display="flex";
    window.__urlsVista=[];
    items.forEach(function(it){
      var url=URL.createObjectURL(it.blob); window.__urlsVista.push(url);
      var sec=document.createElement("div");
      var cab=document.createElement("div"); cab.style.cssText="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:6px";
      cab.innerHTML='<span style="font-size:.9rem;color:var(--suave,#52637a)">'+esc(it.nombre)+'</span>';
      var bd=document.createElement("button"); bd.type="button"; bd.textContent="Descargar este archivo"; bd.style.cssText="width:auto;margin:0;padding:8px 12px"; bd.onclick=function(){descarga(it.blob,it.nombre)};
      cab.appendChild(bd); sec.appendChild(cab);
      if(/\.png$/i.test(it.nombre)){ var im=document.createElement("img"); im.src=url; im.alt=it.nombre; im.style.cssText="max-width:100%;height:auto;border:1px solid var(--linea,#d7e0ec);border-radius:8px"; sec.appendChild(im) }
      else if(/\.pdf$/i.test(it.nombre)){ var fr=document.createElement("iframe"); fr.src=url; fr.style.cssText="width:100%;height:70vh;border:1px solid var(--linea,#d7e0ec);border-radius:8px"; sec.appendChild(fr) }
      else { var pre=document.createElement("pre"); pre.style.cssText="white-space:pre-wrap;font:14px/1.5 ui-monospace,Consolas,monospace;margin:0;padding:12px;background:var(--bg,#f3f6fb);border-radius:8px;max-height:70vh;overflow:auto"; it.blob.text().then(function(t){ pre.textContent=t }); sec.appendChild(pre) }
      cont.appendChild(sec);
    });
  }
  function cerrarVista(){
    var caja=$("asig-vista"); if(caja)caja.style.display="none";
    (window.__urlsVista||[]).forEach(function(u){ URL.revokeObjectURL(u) }); window.__urlsVista=[];
    var cont=$("asig-vcont"); if(cont)cont.innerHTML="";
  }
  function generar(vista){
    var tipo=$("asig-tipo").value, fmt=$("asig-fmt").value, nivel=$("asig-niv").value, alc=$("asig-alc").value;
    var estado=$("asig-est"), btn=$("asig-gen"), btnV=$("asig-ver");
    recogidos=vista?[]:null;
    btn.disabled=true; btnV.disabled=true; estado.textContent=vista?"Preparando vista previa…":"Preparando contenido…";
    cargaFuentes(function(h,t){estado.textContent="Leyendo páginas "+h+" de "+t+"…"}).then(function(){ return seleccion() }).then(function(sel){
      if(!sel.length)throw new Error("sin contenido");
      var etiqueta=tipo==="tarjetas"?"Tarjetas de repaso":(tipo==="resumen"?"Resumen":"Esquema mental");
      var meta={titulo:etiqueta+" · "+nombreAsig(),etiqueta:etiqueta,asig:nombreAsig(),nivelTxt:{basico:"básico",medio:"medio",detallado:"detallado"}[nivel]};
      if(tipo==="tarjetas"&&fmt==="png") fmt="pdf";
      if(fmt==="png"){ tipo="esquema" }
      var datos=tipo==="esquema"?construyeEsquema(sel,nivel):(tipo==="tarjetas"?tarjetasDe(sel,nivel):construyeResumen(sel,nivel));
      var docTipo=tipo==="esquema"?"esquema":"resumen";
      if(!datos.length)throw new Error("sin contenido");
      if(fmt==="png"){
        estado.textContent="Creando imagen…";
        var trozos=[], seg=null;
        datos.forEach(function(f){ if(f.raiz){ seg=[]; trozos.push({t:f.t,filas:seg}) } if(seg)seg.push(f) });
        var lista=[];
        trozos.forEach(function(tz,ti){
          var n=0;
          for(var st=0; st<tz.filas.length; st+=(st===0?60:59)){
            var parte=st===0?tz.filas.slice(0,60):[tz.filas[0]].concat(tz.filas.slice(st,st+59));
            lista.push({filas:parte,titulo:meta.titulo+" · "+tz.t+(n||tz.filas.length>60?" (parte "+(n+1)+")":""),num:ti+1,n:n+1});
            n++;
          }
        });
        if(!lista.length)throw new Error("sin contenido");
        estado.textContent="Creando "+lista.length+" imagen(es)…";
        return lista.reduce(function(prev,it){
          return prev.then(function(){
            var m={titulo:it.titulo,asig:meta.asig,nivelTxt:meta.nivelTxt,color:colorAsig()};
            return aPNG(it.filas,m).then(function(b){
              descarga(b,slug(nombreAsig())+"-esquema-"+nivel+"-unidad"+it.num+(it.n>1?"-parte"+it.n:"")+".png");
              return recogidos?null:new Promise(function(r){setTimeout(r,700)});
            });
          });
        },Promise.resolve());
      }
      var base=slug(nombreAsig())+"-"+(tipo==="tarjetas"?"tarjetas":(tipo==="resumen"?"resumen":"esquema"))+"-"+nivel;
      if(fmt==="pdf"){
        estado.textContent="Creando PDF…";
        return cargaJsPDF().then(function(JS){ descarga(aPDF(docTipo,datos,meta,JS),base+".pdf") });
      }
      if(fmt==="md"){descarga(new Blob([aMarkdown(docTipo,datos,meta)],{type:"text/markdown;charset=utf-8"}),base+".md")}
      else{descarga(new Blob([aTexto(docTipo,datos,meta)],{type:"text/plain;charset=utf-8"}),base+".txt")}
    }).then(function(){
      if(recogidos&&recogidos.length){ var it=recogidos; recogidos=null; mostrarVista(it); estado.textContent="Vista previa lista. Puedes descargar cada archivo desde ahí." }
      else { recogidos=null; estado.textContent=vista?"No hay nada que previsualizar.":"Descargado." }
    }).catch(function(e){ recogidos=null;
      if(e&&e.message==="red")estado.textContent="No se pudo cargar el generador de PDF (sin conexión). Prueba con Markdown o TXT.";
      else if(e&&e.message==="png")estado.textContent="Tu navegador no pudo crear la imagen. Prueba con un nivel más básico o con PDF.";
      else estado.textContent="No he encontrado contenido para generar el documento.";
    }).then(function(){btn.disabled=false; btnV.disabled=false});
  }

  function buscar(){
    var q=$("asig-q").value.trim(), out=$("asig-res");
    if(q.length<2){out.innerHTML="";$("asig-qest").textContent="Escribe al menos 2 letras.";return}
    $("asig-qest").textContent="Buscando…";
    cargaFuentes().then(function(paginas){
      var nq=norm(q), hits=[];
      paginas.forEach(function(pg){
        pg.bloques.forEach(function(b){
          var nt=norm(b.t), i=nt.indexOf(nq);
          if(i===-1)return;
          var a=Math.max(0,i-60), z=Math.min(b.t.length,i+q.length+80);
          var fr=(a>0?"…":"")+b.t.slice(a,z)+(z<b.t.length?"…":"");
          var re=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"ig");
          hits.push({pg:pg,html:esc(fr).replace(new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"ig"),function(m){return "<mark>"+m+"</mark>"})});
        });
      });
      var vistos={};
      var lista=hits.filter(function(h){var k=h.pg.url+h.html;if(vistos[k])return false;vistos[k]=1;return true}).slice(0,40);
      $("asig-qest").textContent=lista.length?(hits.length+" coincidencias"+(hits.length>40?" (mostrando 40)":"")):"Sin resultados.";
      out.innerHTML=lista.map(function(h){return '<a href="'+esc(h.pg.url)+'"><b>'+esc(h.pg.titulo)+'</b><span>'+h.html+'</span></a>'}).join("");
    });
  }


  function recorta(ctx,txt,max){
    if(ctx.measureText(txt).width<=max)return txt;
    var t=txt;while(t.length>1&&ctx.measureText(t+"…").width>max)t=t.slice(0,-1);
    return t+"…";
  }
  function colorAsig(){
    var el=document.querySelector(".hero")||document.body;
    var c=getComputedStyle(el).backgroundColor||"";
    var m=c.match(/\d+(\.\d+)?/g);
    if(m&&m.length>=3&&!(+m[3]===0&&m.length>3))return [+m[0],+m[1],+m[2]];
    return [37,99,235];
  }
  function mezcla(c,blanco){ return "rgb("+c.map(function(v){return Math.round(v+(255-v)*blanco)}).join(",")+")" }
  function aPNG(filas,meta){
    return new Promise(function(ok,ko){
      try{
        var base=meta.color||[37,99,235];
        var oscuro="rgb("+base.map(function(v){return Math.round(v*0.35)}).join(",")+")";
        var c=document.createElement("canvas"), ctx=c.getContext("2d");
        var DPR=1, M=26, H_ROW=36, BW=300, BH=30, SANG=330, CAB=96;
        var maxP=0; filas.forEach(function(f){ if(f.prof>maxP)maxP=f.prof });
        var W=M*2+(maxP+1)*SANG+BW-SANG+30, Hh=CAB+M+filas.length*H_ROW+50;
        c.width=W*DPR; c.height=Hh*DPR; ctx.scale(DPR,DPR);
        // fondo y cabecera de color de la asignatura
        var fondo=ctx.createLinearGradient(0,0,0,Hh); fondo.addColorStop(0,mezcla(base,.93)); fondo.addColorStop(1,"#ffffff");
        ctx.fillStyle=fondo; ctx.fillRect(0,0,W,Hh);
        var cab=ctx.createLinearGradient(0,0,W,0); cab.addColorStop(0,"rgb("+base.join(",")+")"); cab.addColorStop(1,mezcla(base,.25));
        ctx.fillStyle=cab; ctx.fillRect(0,0,W,CAB);
        ctx.fillStyle="#ffffff"; ctx.font="700 24px system-ui, Arial, sans-serif"; ctx.textBaseline="alphabetic";
        ctx.fillText(recorta(ctx,meta.titulo,W-2*M),M,44);
        ctx.font="14px system-ui, Arial, sans-serif"; ctx.globalAlpha=.9;
        ctx.fillText("Esquema mental · "+meta.asig+" · nivel "+meta.nivelTxt,M,70); ctx.globalAlpha=1;
        var y0=CAB+M;
        var pos=[], pila=[];
        filas.forEach(function(f,i){
          var x=M+f.prof*SANG, y=y0+i*H_ROW;
          pos[i]={x:x,y:y};
          while(pila.length&&filas[pila[pila.length-1]].prof>=f.prof)pila.pop();
          if(pila.length){
            var pp=pos[pila[pila.length-1]];
            ctx.beginPath(); ctx.strokeStyle=mezcla(base,.45); ctx.lineWidth=2;
            var x1=pp.x+BW, y1=pp.y+BH/2, x2=x, y2=y+BH/2, mx=(x1+x2)/2;
            ctx.moveTo(x1,y1); ctx.bezierCurveTo(mx,y1,mx,y2,x2,y2); ctx.stroke();
          }
          pila.push(i);
          var d=f.prof, esR=f.raiz, esS=f.h;
          ctx.save();
          ctx.shadowColor="rgba(0,0,0,.10)"; ctx.shadowBlur=6; ctx.shadowOffsetY=2;
          ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(x,y,BW,BH,9); else ctx.rect(x,y,BW,BH);
          if(esR){ ctx.fillStyle="rgb("+base.join(",")+")"; ctx.fill(); }
          else if(esS&&d===1){ ctx.fillStyle=mezcla(base,.78); ctx.fill(); }
          else if(esS){ ctx.fillStyle="#ffffff"; ctx.fill(); ctx.shadowColor="transparent"; ctx.strokeStyle=mezcla(base,.5); ctx.lineWidth=1.5; ctx.stroke(); }
          else { ctx.fillStyle=mezcla(base,.9); ctx.fill(); }
          ctx.restore();
          ctx.fillStyle=esR?"#ffffff":(esS&&d===1?oscuro:"#1f2937");
          ctx.font=(esR||esS?"700 ":"")+(esR?"15px":"13px")+" system-ui, Arial, sans-serif";
          ctx.textBaseline="middle";
          ctx.fillText(recorta(ctx,pdfSeguro(f.t),BW-16),x+9,y+BH/2+1);
          ctx.textBaseline="alphabetic";
        });
        c.toBlob(function(b){ b?ok(b):ko(new Error("png")) },"image/png");
      }catch(e){ ko(e) }
    });
  }

  function limpiaTitulo(t){return String(t).replace(/^\s*(\d+(\.\d+)*\.?|[IVX]+\.)\s*/,"").replace(/[?¿!¡:]+/g," ").replace(/\s+/g," ").trim()}
  function guionPodcast(lineas,meta){
    var g=[{v:"A",t:"Bienvenidos al repaso de "+meta.asig+". Hoy vamos a repasarlo paso a paso."}];
    var pendiente=null;
    lineas.forEach(function(l){
      if(l.k==="H1"){ g.push({v:"A",t:"Empezamos con "+limpiaTitulo(l.t)+"."}) }
      else if(l.k==="h"){ g.push({v:"A",t:"Ahora hablemos de: "+limpiaTitulo(l.t)+"."}) }
      else if(l.k==="p"||l.k==="b"){ g.push({v:"B",t:(l.k==="b"?"Punto clave: ":"")+l.t}) }
    });
    g.push({v:"A",t:"Hasta aquí el repaso. ¡Mucho ánimo con el examen!"});
    return g;
  }
  var reproduciendo=null;
  function hablarGuion(g){
    if(!("speechSynthesis" in window)){ $("asig-est").textContent="Tu navegador no tiene voz (speechSynthesis)."; return }
    speechSynthesis.cancel();
    var voces=speechSynthesis.getVoices().filter(function(v){return /^es/i.test(v.lang)});
    var vA=voces[0]||null, vB=voces[1]||voces[0]||null;
    var i=0, ok=0;
    function siguiente(){
      if(i>=g.length){ $("asig-est").textContent="Podcast terminado."; reproduciendo=null; return }
      var l=g[i++], u=new SpeechSynthesisUtterance(l.t);
      u.lang="es-ES"; u.rate=1.02;
      if(l.v==="A"){ u.pitch=1.15; if(vA)u.voice=vA }
      else { u.pitch=0.9; if(vB)u.voice=vB }
      u.onend=siguiente; u.onerror=function(){ siguiente() };
      $("asig-est").textContent="Reproduciendo "+i+" de "+g.length+"…";
      speechSynthesis.speak(u);
    }
    reproduciendo=true; siguiente();
  }
  function detener(){ if(window.speechSynthesis)speechSynthesis.cancel(); reproduciendo=null; $("asig-est").textContent="Detenido." }
  function podcast(){
    seleccion().then(function(sel){
      var lineas=construyeResumen(sel,$("asig-niv").value);
      var meta={asig:nombreAsig()};
      return guionPodcast(lineas,meta);
    }).then(function(g){ window.__guion=g; hablarGuion(g) })
      .catch(function(){ $("asig-est").textContent="No he encontrado contenido para el podcast." });
  }
  function descargaGuion(){
    seleccion().then(function(sel){
      var g=guionPodcast(construyeResumen(sel,$("asig-niv").value),{asig:nombreAsig()});
      var txt="Guion de podcast · "+nombreAsig()+"\n\n"+g.map(function(l){return (l.v==="A"?"Locutora A: ":"Locutor B: ")+l.t}).join("\n\n")+"\n";
      descarga(new Blob([txt],{type:"text/plain;charset=utf-8"}),slug(nombreAsig())+"-guion-podcast.txt");
      $("asig-est").textContent="Guion descargado.";
    });
  }

  function monta(){
    var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
    document.body.classList.add("asig-p");
    var p=document.createElement("aside");p.id="asig-panel";p.setAttribute("aria-label","Herramientas de la asignatura");
    p.innerHTML=
      '<h3>🔎 Buscar en la asignatura</h3>'+
      '<label for="asig-q">Palabra o frase</label><input type="text" id="asig-q" placeholder="Ej.: etiqueta, TCP, colspan">'+
      '<button type="button" class="sec" id="asig-bq">Buscar</button><div class="e" id="asig-qest"></div><div class="r" id="asig-res"></div>'+
      '<h3>📝 Resumen y esquema</h3>'+
      '<label for="asig-tipo">Qué quieres</label><select id="asig-tipo"><option value="resumen">Resumen</option><option value="esquema">Esquema mental</option><option value="tarjetas">Tarjetas de repaso</option></select>'+
      '<div class="fila"><div><label for="asig-fmt">Formato</label><select id="asig-fmt"><option value="pdf">PDF</option><option value="md">Markdown (.md)</option><option value="txt">Texto (.txt)</option><option value="png">Imagen PNG (esquema)</option></select></div>'+
      '<div><label for="asig-niv">Nivel</label><select id="asig-niv"><option value="basico">Básico</option><option value="medio" selected>Medio</option><option value="detallado">Detallado</option></select></div></div>'+
      '<label for="asig-alc">Alcance</label><select id="asig-alc"><option value="todo">Toda la asignatura</option><option value="paginas">Páginas marcadas</option><option value="apartado">Un apartado concreto</option></select><div id="asig-sel"></div>'+
      '<div class="fila"><button type="button" class="sec" id="asig-ver">Previsualizar</button><button type="button" id="asig-gen">Descargar</button></div><div class="e" id="asig-est"></div>'+
      '<h3>🎙 Podcast</h3><div class="fila"><button type="button" class="sec" id="asig-pl">▶ Reproducir</button><button type="button" class="sec" id="asig-st">■ Detener</button></div><button type="button" class="sec" id="asig-gs">Descargar guion (.txt)</button><p class="e">Lee el temario con dos voces del navegador. El audio no se descarga: depende de las voces de tu dispositivo.</p>'+
      '<p class="e">Se crea a partir del texto de las páginas de la asignatura. Cuanto más detallado el nivel, más texto incluye.</p>';
    document.body.appendChild(p);
    var t=document.createElement("button");t.id="asig-toggle";t.type="button";t.textContent="🔎 Herramientas";
    t.onclick=function(){document.body.classList.toggle("asig-open")};
    document.body.appendChild(t);
    $("asig-bq").onclick=buscar;
    $("asig-q").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();buscar()}});
    $("asig-gen").onclick=function(){generar(false)};
    $("asig-ver").onclick=function(){generar(true)};
    $("asig-alc").onchange=rellenaSel;
    $("asig-pl").onclick=podcast; $("asig-st").onclick=detener; $("asig-gs").onclick=descargaGuion;
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",monta);else monta();
})();
