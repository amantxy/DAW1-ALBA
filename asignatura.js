/* Panel de asignatura: buscador dentro de la asignatura + generador de resumen/esquema descargable.
   Se carga desde la portada de cada asignatura: <script src="../asignatura.js" defer></script> */
(function(){
  var CSS=
  "#asig-panel{position:fixed;left:0;top:0;bottom:0;width:300px;overflow:auto;background:var(--hoja,#fff);border-right:1px solid var(--linea,#d7e0ec);padding:16px 14px 40px;z-index:50;font:15px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--tinta,#0f1b2d)}"+
  "#asig-panel h3{margin:14px 0 6px;font-size:.95rem;color:var(--c,#2563eb);display:flex;align-items:center;gap:6px}"+
  "#asig-panel h3:first-child{margin-top:4px}"+
  "#asig-panel label{display:block;font-size:.82rem;color:var(--suave,#52637a);margin:8px 0 3px}"+
  "#asig-panel input[type=text],#asig-panel select{width:100%;font:inherit;padding:9px 10px;border:1px solid var(--linea,#d7e0ec);border-radius:10px;background:var(--bg,#f3f6fb);color:var(--tinta,#0f1b2d);min-height:42px}"+
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
    escribe("Asignatura: "+meta.asig+" · "+(tipo==="resumen"?"Resumen":"Esquema mental")+" · Nivel: "+meta.nivelTxt,{size:9,color:[110,110,110],after:4});
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

  function descarga(blob,nombre){
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);a.download=nombre;
    document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000);
  }

  function generar(){
    var tipo=$("asig-tipo").value, fmt=$("asig-fmt").value, nivel=$("asig-niv").value, alc=$("asig-alc").value;
    var estado=$("asig-est"), btn=$("asig-gen");
    btn.disabled=true; estado.textContent="Preparando contenido…";
    cargaFuentes(function(h,t){estado.textContent="Leyendo páginas "+h+" de "+t+"…"}).then(function(paginas){
      var sel=paginas;
      if(alc==="actual"){
        var actual=location.href.split("#")[0];
        sel=paginas.filter(function(p){return p.url===actual});
        if(!sel.length)sel=paginas.slice(0,1);
      }
      if(!sel.length)throw new Error("sin contenido");
      var meta={titulo:(tipo==="resumen"?"Resumen":"Esquema mental")+" · "+nombreAsig(),asig:nombreAsig(),nivelTxt:{basico:"básico",medio:"medio",detallado:"detallado"}[nivel]};
      var datos=tipo==="resumen"?construyeResumen(sel,nivel):construyeEsquema(sel,nivel);
      var base=slug(nombreAsig())+"-"+(tipo==="resumen"?"resumen":"esquema")+"-"+nivel;
      if(fmt==="pdf"){
        estado.textContent="Creando PDF…";
        return cargaJsPDF().then(function(JS){ descarga(aPDF(tipo,datos,meta,JS),base+".pdf") });
      }
      if(fmt==="md"){descarga(new Blob([aMarkdown(tipo,datos,meta)],{type:"text/markdown;charset=utf-8"}),base+".md")}
      else{descarga(new Blob([aTexto(tipo,datos,meta)],{type:"text/plain;charset=utf-8"}),base+".txt")}
    }).then(function(){estado.textContent="Descargado."}).catch(function(e){
      estado.textContent=e&&e.message==="red"?"No se pudo cargar el generador de PDF (sin conexión). Prueba con Markdown o TXT.":"No he encontrado contenido para generar el documento.";
    }).then(function(){btn.disabled=false});
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

  function monta(){
    var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
    document.body.classList.add("asig-p");
    var p=document.createElement("aside");p.id="asig-panel";p.setAttribute("aria-label","Herramientas de la asignatura");
    p.innerHTML=
      '<h3>🔎 Buscar en la asignatura</h3>'+
      '<label for="asig-q">Palabra o frase</label><input type="text" id="asig-q" placeholder="Ej.: etiqueta, TCP, colspan">'+
      '<button type="button" class="sec" id="asig-bq">Buscar</button><div class="e" id="asig-qest"></div><div class="r" id="asig-res"></div>'+
      '<h3>📝 Resumen y esquema</h3>'+
      '<label for="asig-tipo">Qué quieres</label><select id="asig-tipo"><option value="resumen">Resumen</option><option value="esquema">Esquema mental</option></select>'+
      '<div class="fila"><div><label for="asig-fmt">Formato</label><select id="asig-fmt"><option value="pdf">PDF</option><option value="md">Markdown (.md)</option><option value="txt">Texto (.txt)</option></select></div>'+
      '<div><label for="asig-niv">Nivel</label><select id="asig-niv"><option value="basico">Básico</option><option value="medio" selected>Medio</option><option value="detallado">Detallado</option></select></div></div>'+
      '<label for="asig-alc">Alcance</label><select id="asig-alc"><option value="todo">Toda la asignatura</option><option value="actual">Solo esta página</option></select>'+
      '<button type="button" id="asig-gen">Generar y descargar</button><div class="e" id="asig-est"></div>'+
      '<p class="e">Se crea a partir del texto de las páginas de la asignatura. Cuanto más detallado el nivel, más texto incluye.</p>';
    document.body.appendChild(p);
    var t=document.createElement("button");t.id="asig-toggle";t.type="button";t.textContent="🔎 Herramientas";
    t.onclick=function(){document.body.classList.toggle("asig-open")};
    document.body.appendChild(t);
    $("asig-bq").onclick=buscar;
    $("asig-q").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();buscar()}});
    $("asig-gen").onclick=generar;
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",monta);else monta();
})();
