/* Pantalla completa del editor, con un icono en la esquina superior derecha del recuadro.
   Uso: <script src="../pantalla.js" data-objetivo="#selector-del-editor"></script>
   Con la API del navegador amplía ese elemento. Sin API (p. ej. iPhone), oculta el resto de la página. */
(function(){
  if(window.__pantallaCompleta) return; window.__pantallaCompleta=true;
  var sel=document.currentScript&&document.currentScript.dataset.objetivo;
  var st=document.createElement('style');
  st.textContent=
    'html.pc-fb,html.pc-fb body{height:100%;margin:0}'+
    'html.pc-fb body{position:fixed;inset:0;overflow:hidden;z-index:9000;background:#fff!important;background-image:none!important}'+
    '.pc-anc{max-width:none!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;border:0!important;background:none!important;box-shadow:none!important;border-radius:0!important;min-height:0!important;max-height:none!important;overflow:visible!important}'+
    '.pc-sel{display:flex!important;flex-direction:column!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;min-height:0!important;margin:0!important;border:0!important;border-radius:0!important;box-sizing:border-box!important;overflow:auto!important}'+
    '.pc-sel .ed,.pc-sel textarea{flex:1 1 auto!important;height:auto!important;min-height:0!important;max-height:none!important}'+
    '.pc-sel textarea.ed{height:100%!important}'+
    '#pc-btn{position:absolute;z-index:9999;width:40px;height:40px;padding:0;margin:0;border:0;border-radius:8px;background:rgb(29 24 18/.82);color:#fff;font:600 18px/1 system-ui,sans-serif;cursor:pointer;display:none;box-shadow:0 1px 4px rgb(0 0 0/.3)}'+
    '#pc-btn.pc-dentro{top:8px;right:8px;left:auto}'+
    '#pc-ventana{position:absolute;z-index:9999;height:40px;padding:0 10px;margin:0;border:0;border-radius:8px;background:rgb(29 24 18/.82);color:#fff;font:600 13px/1 system-ui,sans-serif;cursor:pointer;display:none;white-space:nowrap}'+
    '#pc-btn:focus-visible{outline:3px solid #2563eb;outline-offset:2px}';
  document.head.appendChild(st);
  var solo=/[?&]solo=editor(?:&|$)/.test(location.search);
  var sinIcono=!!(document.currentScript&&document.currentScript.dataset.sinIcono!==undefined);
  var bv=document.createElement('button'); bv.type='button'; bv.id='pc-ventana';
  bv.textContent='⧉ Ventana aparte'; bv.title='Abrir el editor en una ventana nueva, para la segunda pantalla';
  bv.setAttribute('aria-label','Abrir el editor en una ventana aparte');
  var b=document.createElement('button'); b.type='button'; b.id='pc-btn';
  var ocultos=[], cur=null;
  function objetivo(){ return sel ? document.querySelector(sel) : null }
  function enPC(){ return !!document.fullscreenElement || document.documentElement.classList.contains('pc-fb') }
  function pinta(){
    var on=enPC();
    b.textContent = on ? '✕' : '⛶';
    b.title = on ? 'Salir de pantalla completa' : 'Pantalla completa';
    b.setAttribute('aria-label', b.title);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  function posiciona(){
    if(solo){ b.style.display='none'; bv.style.display='none'; return }
    var el=objetivo();
    if(!el || el.getBoundingClientRect().height===0){ b.style.display='none'; bv.style.display='none'; return }
    var r=el.getBoundingClientRect(), fb=document.documentElement.classList.contains('pc-fb');
    var x=r.right+(fb?0:window.scrollX), y=r.top+(fb?0:window.scrollY)+8;
    if(b.parentNode===document.body && !sinIcono){ b.style.display='block'; b.style.top=y+'px'; b.style.left=(x-48)+'px' }
    bv.style.display='block'; bv.style.top=y+'px';
    bv.style.left=(x-48-8-bv.offsetWidth)+'px';
  }
  bv.onclick=function(){
    var u=new URL(location.href); u.hash=''; u.searchParams.set('solo','editor');
    window.open(u.toString(),'_blank','width=960,height=720');
  };
  function marca(el){
    cur=el; el.classList.add('pc-sel');
    for(var n=el.parentElement; n && n!==document.body; n=n.parentElement) n.classList.add('pc-anc');
  }
  function aisla(el){
    var n=el;
    while(n && n!==document.body){
      Array.prototype.forEach.call(n.parentElement.children,function(c){
        if(c!==n && c!==b && c!==bv && c.tagName!=='SCRIPT' && c.tagName!=='STYLE'){ ocultos.push([c,c.style.display]); c.style.display='none' }
      });
      n=n.parentElement;
    }
  }
  function limpia(){
    if(!cur) return;
    cur.classList.remove('pc-sel');
    for(var n=cur.parentElement; n && n!==document.body; n=n.parentElement) n.classList.remove('pc-anc');
    cur=null;
  }
  function entraFB(){
    var el=objetivo()||document.body;
    aisla(el); marca(el);
    document.documentElement.classList.add('pc-fb'); pinta(); posiciona();
  }
  function saleFB(){
    document.documentElement.classList.remove('pc-fb');
    ocultos.forEach(function(p){ p[0].style.display=p[1] }); ocultos=[];
    limpia(); pinta(); posiciona();
  }
  b.onclick=function(){
    if(enPC()){
      if(document.fullscreenElement){ document.exitFullscreen(); return }
      saleFB(); return;
    }
    var el=objetivo();
    if(el && document.fullscreenEnabled && el.requestFullscreen){
      var p=el.requestFullscreen(); if(p&&p.catch) p.catch(entraFB); return;
    }
    entraFB();
  };
  document.addEventListener('fullscreenchange', function(){
    var fe=document.fullscreenElement;
    if(fe){
      marca(fe);
      if(fe.tagName!=='TEXTAREA'){ fe.appendChild(b); b.classList.add('pc-dentro'); b.style.display='block' }
    } else {
      limpia(); document.body.appendChild(b); b.classList.remove('pc-dentro');
    }
    pinta(); posiciona();
  });
  window.addEventListener('scroll',posiciona,{passive:true});
  window.addEventListener('resize',posiciona);
  document.addEventListener('click',function(){ setTimeout(posiciona,0) },true);
  setInterval(posiciona,400);
  document.body.appendChild(b); document.body.appendChild(bv); pinta(); posiciona();
  if(solo){ document.title='Editor · '+document.title; entraFB() }
})();
