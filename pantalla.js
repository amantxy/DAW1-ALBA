/* Pantalla completa solo del editor. Uso: <script src="../pantalla.js" data-objetivo="#selector-del-editor"></script>
   Con la API del navegador pone en pantalla completa ese elemento. Si la API no existe (p. ej. iPhone),
   oculta el resto de la página y deja solo el editor, a todo el ancho y alto. */
(function(){
  if(window.__pantallaCompleta) return; window.__pantallaCompleta=true;
  var sel=document.currentScript&&document.currentScript.dataset.objetivo;
  var hogarSel=(document.currentScript&&document.currentScript.dataset.boton)||'';
  var st=document.createElement('style');
  st.textContent=
    'html.pc-fb,html.pc-fb body{height:100%;margin:0}'+
    'html.pc-fb body{position:fixed;inset:0;overflow:hidden;z-index:9000;background:#fff!important;background-image:none!important}'+
    '.pc-anc{max-width:none!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;border:0!important;background:none!important;box-shadow:none!important;border-radius:0!important;min-height:0!important;max-height:none!important;overflow:visible!important}'+
    '.pc-sel{display:flex!important;flex-direction:column!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;min-height:0!important;margin:0!important;border:0!important;border-radius:0!important;box-sizing:border-box!important;overflow:auto!important}'+
    '.pc-sel .ed,.pc-sel textarea{flex:1 1 auto!important;height:auto!important;min-height:0!important;max-height:none!important}'+
    '.pc-sel textarea.ed{height:100%!important}'+
    '#pc-btn.pc-en-barra{position:static;margin-left:auto;align-self:center;box-shadow:none;opacity:1;min-height:40px;padding:6px 10px;font-size:.85rem;white-space:nowrap}'+
    '#pc-btn{position:fixed;right:10px;bottom:10px;z-index:9999;min-height:44px;padding:8px 14px;border:0;border-radius:10px;background:#1d1812;color:#fff;font:600 .9rem system-ui,sans-serif;box-shadow:0 2px 8px rgb(0 0 0/.3);cursor:pointer;opacity:.92}#pc-btn:focus-visible{outline:3px solid #2563eb;outline-offset:2px}';
  document.head.appendChild(st);
  var b=document.createElement('button'); b.type='button'; b.id='pc-btn';
  var ocultos=[], cur=null;
  function objetivo(){ return sel ? document.querySelector(sel) : null }
  function enPC(){ return !!document.fullscreenElement || document.documentElement.classList.contains('pc-fb') }
  function pinta(){ b.textContent = enPC() ? '✕ Salir' : '⛶ Pantalla completa'; b.setAttribute('aria-pressed', enPC() ? 'true' : 'false') }
  function marca(el){
    cur=el; el.classList.add('pc-sel');
    for(var n=el.parentElement; n && n!==document.body; n=n.parentElement) n.classList.add('pc-anc');
  }
  function aisla(el){
    var n=el;
    while(n && n!==document.body){
      Array.prototype.forEach.call(n.parentElement.children,function(c){
        if(c!==n && c!==b && c.tagName!=='SCRIPT' && c.tagName!=='STYLE'){ ocultos.push([c,c.style.display]); c.style.display='none' }
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
  function enBody(){ document.body.appendChild(b); b.classList.remove('pc-en-barra') }
  function enHogar(){ var h=hogarSel&&document.querySelector(hogarSel); if(h){ h.appendChild(b); b.classList.add('pc-en-barra') } else enBody() }
  function entraFB(){
    var el=objetivo()||document.body;
    enBody(); aisla(el); marca(el);
    document.documentElement.classList.add('pc-fb'); pinta();
  }
  function saleFB(){
    document.documentElement.classList.remove('pc-fb');
    ocultos.forEach(function(p){ p[0].style.display=p[1] }); ocultos=[];
    limpia(); enHogar(); pinta();
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
    if(fe){ marca(fe); if(fe.tagName!=='TEXTAREA'){ fe.appendChild(b); b.classList.remove('pc-en-barra') } }
    else { limpia(); enHogar() }
    pinta();
  });
  enHogar(); pinta();
})();
