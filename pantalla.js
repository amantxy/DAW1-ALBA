/* Botón de pantalla completa para las herramientas (IDE, PSeInt, editor de práctica).
   Usa la API del navegador si existe; si no (p. ej. iPhone), amplía la página a toda la pantalla con CSS. */
(function(){
  if(window.__pantallaCompleta) return; window.__pantallaCompleta=true;
  var st=document.createElement('style');
  st.textContent='html.pc-fb,html.pc-fb body{height:100%;margin:0}html.pc-fb body{position:fixed;inset:0;overflow:auto;z-index:9000;background:var(--bg,#fff)}'+
    '#pc-btn{position:fixed;right:10px;bottom:10px;z-index:9999;min-height:44px;padding:8px 14px;border:0;border-radius:10px;background:#1d1812;color:#fff;font:600 .9rem system-ui,sans-serif;box-shadow:0 2px 8px rgb(0 0 0/.3);cursor:pointer;opacity:.92}#pc-btn:focus-visible{outline:3px solid #2563eb;outline-offset:2px}';
  document.head.appendChild(st);
  var b=document.createElement('button'); b.type='button'; b.id='pc-btn';
  function enPC(){ return !!document.fullscreenElement || document.documentElement.classList.contains('pc-fb') }
  function pinta(){ b.textContent = enPC() ? '✕ Salir de pantalla completa' : '⛶ Pantalla completa'; b.setAttribute('aria-pressed', enPC() ? 'true' : 'false') }
  function fallback(){ document.documentElement.classList.toggle('pc-fb'); pinta() }
  b.onclick=function(){
    try{
      if(document.fullscreenEnabled){
        if(document.fullscreenElement){ document.exitFullscreen(); return }
        var p=document.documentElement.requestFullscreen(); if(p&&p.catch) p.catch(fallback); return
      }
    }catch(e){}
    fallback();
  };
  document.addEventListener('fullscreenchange', pinta);
  document.body.appendChild(b); pinta();
})();
