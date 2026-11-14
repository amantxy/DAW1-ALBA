/* Pantalla completa solo del editor. Uso: <script src="../pantalla.js" data-objetivo="#selector-del-editor"></script>
   Con la API del navegador, pone en pantalla completa ese elemento. Si no existe (p. ej. iPhone),
   oculta todo lo demás de la página y deja solo el editor a pantalla completa. */
(function(){
  if(window.__pantallaCompleta) return; window.__pantallaCompleta=true;
  var sel=document.currentScript&&document.currentScript.dataset.objetivo;
  var st=document.createElement('style');
  st.textContent='html.pc-fb,html.pc-fb body{height:100%;margin:0}html.pc-fb body{position:fixed;inset:0;overflow:hidden;z-index:9000;background:#fff}'+
    'html.pc-fb .pc-sel{height:100%;width:100%;max-height:none!important}'+
    '#pc-btn{position:fixed;right:10px;bottom:10px;z-index:9999;min-height:44px;padding:8px 14px;border:0;border-radius:10px;background:#1d1812;color:#fff;font:600 .9rem system-ui,sans-serif;box-shadow:0 2px 8px rgb(0 0 0/.3);cursor:pointer;opacity:.92}#pc-btn:focus-visible{outline:3px solid #2563eb;outline-offset:2px}';
  document.head.appendChild(st);
  var b=document.createElement('button'); b.type='button'; b.id='pc-btn';
  var ocultos=[], elFB=null;
  function objetivo(){ return sel ? document.querySelector(sel) : null }
  function enPC(){ return !!document.fullscreenElement || document.documentElement.classList.contains('pc-fb') }
  function pinta(){ b.textContent = enPC() ? '✕ Salir' : '⛶ Pantalla completa'; b.setAttribute('aria-pressed', enPC() ? 'true' : 'false') }
  function aisla(el){
    var n=el;
    while(n && n!==document.body){
      Array.prototype.forEach.call(n.parentElement.children,function(c){
        if(c!==n && c!==b && c.tagName!=='SCRIPT' && c.tagName!=='STYLE'){ ocultos.push([c,c.style.display]); c.style.display='none' }
      });
      n=n.parentElement;
    }
    el.classList.add('pc-sel');
  }
  function restaura(){
    ocultos.forEach(function(p){ p[0].style.display=p[1] }); ocultos=[];
    if(elFB) elFB.classList.remove('pc-sel'); elFB=null;
  }
  function entraFB(){
    var el=objetivo()||document.body;
    elFB=el; aisla(el);
    document.documentElement.classList.add('pc-fb'); pinta();
  }
  function saleFB(){ document.documentElement.classList.remove('pc-fb'); restaura(); pinta() }
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
    /* Dentro de pantalla completa del navegador solo se ve el elemento: el botón se mete dentro para seguir visible */
    var fe=document.fullscreenElement;
    (fe||document.body).appendChild(b); pinta();
  });
  document.body.appendChild(b); pinta();
})();
