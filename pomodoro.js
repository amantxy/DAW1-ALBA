/* Pomodoro reutilizable. Uso: POMO.montar(elemento, {compacto:true}) */
(function(){
  var K="pomodoro:v1";
  var CSS=".pomo{background:var(--hoja,#fff);border:1px solid var(--linea,#d7e0ec);border-radius:16px;padding:18px 16px;text-align:center;color:var(--tinta,#0f1b2d);font:16px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;margin:0 0 18px}"+
  ".pomo *{box-sizing:border-box}.pomo .f{display:inline-block;font-weight:700;font-size:.85rem;letter-spacing:.04em;text-transform:uppercase;padding:4px 12px;border-radius:999px;background:var(--cs,#ffeedd);color:var(--c,#ea580c)}"+
  ".pomo .f.d{background:color-mix(in srgb,#16a34a 16%,var(--hoja,#fff));color:#16a34a}"+
  ".pomo .r{font:700 clamp(2.8rem,12vw,4.6rem)/1 ui-monospace,Consolas,monospace;margin:10px 0 8px;font-variant-numeric:tabular-nums}"+
  ".pomo .b{height:8px;background:var(--linea,#d7e0ec);border-radius:999px;overflow:hidden;margin:4px 0 14px}.pomo .b i{display:block;height:100%;width:0;background:var(--c,#ea580c);transition:width .9s linear}"+
  ".pomo .bt{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}"+
  ".pomo button{font:inherit;font-weight:600;border:1px solid var(--linea,#d7e0ec);background:var(--hoja,#fff);color:var(--tinta,#0f1b2d);border-radius:12px;padding:10px 14px;min-height:44px;min-width:100px;cursor:pointer}"+
  ".pomo button.p{background:var(--c,#ea580c);border-color:var(--c,#ea580c);color:#fff}.pomo button:disabled{opacity:.5;cursor:default}.pomo button:focus-visible{outline:3px solid var(--c,#ea580c);outline-offset:2px}"+
  ".pomo input[type=text],.pomo input[type=number]{font:inherit;padding:9px 11px;border:1px solid var(--linea,#d7e0ec);border-radius:10px;background:var(--bg,#f3f6fb);color:var(--tinta,#0f1b2d);min-height:42px;width:100%}"+
  ".pomo label{display:block;font-size:.85rem;color:var(--suave,#52637a);text-align:left}"+
  ".pomo .s{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.pomo .s div{flex:1;min-width:110px;background:var(--cs,#ffeedd);border-radius:12px;padding:8px}.pomo .s b{display:block;font-size:1.3rem;color:var(--c,#ea580c)}.pomo .s span{font-size:.8rem;color:var(--suave,#52637a)}"+
  ".pomo .n{font-size:.82rem;color:var(--suave,#52637a);margin-top:10px}.pomo details{margin-top:12px;text-align:left}.pomo summary{cursor:pointer;font-weight:600}"+
  ".pomo.c{padding:12px 14px;display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:space-between;text-align:left}.pomo.c .r{font-size:2.2rem;margin:0}.pomo.c .x{flex:1;min-width:180px}.pomo.c .bt button{min-width:0;padding:8px 10px;min-height:40px}.pomo.c .fila{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.pomo.c .b{display:none}";

  var cfg={foco:25,corto:5,largo:15};
  var fases={foco:"Foco",corto:"Descanso",largo:"Descanso largo"};
  var hoy=new Date().toDateString();
  var reg={dia:hoy,pom:0,min:0};
  var timer=null, el, $;
  var estado={fase:"foco",restante:25*60,total:25*60,corriendo:false,ciclo:0,fin:0};

  function mmss(s){s=Math.max(0,Math.round(s));var m=Math.floor(s/60),r=s%60;return (m<10?"0":"")+m+":"+(r<10?"0":"")+r}
  function dur(f){return (f==="foco"?cfg.foco:f==="corto"?cfg.corto:cfg.largo)*60}
  function leer(){try{var r=JSON.parse(localStorage.getItem(K)||"null");if(r){if(r.reg&&r.reg.dia===hoy)reg=r.reg;if(r.cfg)cfg=r.cfg}}catch(e){}}
  function guardar(){try{localStorage.setItem(K,JSON.stringify({reg:reg,cfg:cfg}))}catch(e){}}

  function sb(){ return window.DAW1_SB && window.DAW1_ACC && window.DAW1_ACC.uid ? window.DAW1_SB : null }
  function guardaNube(minutos,tarea){
    var c=sb(); if(!c) return;
    try{ c.from("pomodoro_sesiones").insert({tipo:"foco",minutos:minutos,tarea:(tarea||"").slice(0,80)||null}).then(function(){},function(){}) }catch(e){}
  }

  function pinta(){
    $("r").textContent=mmss(estado.restante);
    $("f").textContent=fases[estado.fase];
    $("f").className="f"+(estado.fase==="foco"?"":" d");
    $("p").style.width=(100*(1-estado.restante/estado.total))+"%";
    $("ini").textContent=estado.corriendo?"Corriendo…":(estado.restante<estado.total?"Continuar":"Empezar");
    $("ini").disabled=estado.corriendo; $("pau").disabled=!estado.corriendo;
    $("ciclo").textContent=(estado.ciclo%4)+"/4";
    $("hp").textContent=reg.pom; $("hm").textContent=reg.min;
    document.title=(estado.corriendo?mmss(estado.restante)+" · ":"")+(estado.fase==="foco"?"Foco":"Descanso")+" · Pomodoro";
    $("nota").textContent=sb()?"Los pomodoros completados se guardan en tu cuenta.":"Los contadores se guardan en este navegador. Inicia sesión para guardarlos en tu cuenta.";
  }

  function tic(){
    estado.restante=Math.max(0,Math.round((estado.fin-Date.now())/1000));
    if(estado.restante<=0){ terminaFase(); return }
    pinta();
  }
  function sonar(){
    if(!$("son").checked) return;
    try{ var A=window.AudioContext||window.webkitAudioContext,c=new A();
      [0,.35,.7].forEach(function(t){var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.15;o.start(c.currentTime+t);o.stop(c.currentTime+t+.22)}) }catch(e){}
    try{ if(navigator.vibrate) navigator.vibrate([200,100,200]) }catch(e){}
  }
  function siguiente(f){ clearInterval(timer); timer=null; estado.fase=f; estado.total=dur(f); estado.restante=estado.total; estado.corriendo=false; pinta() }
  function terminaFase(){
    sonar();
    if(estado.fase==="foco"){
      reg.pom++; reg.min+=cfg.foco; estado.ciclo++; guardar();
      guardaNube(cfg.foco,$("tarea").value);
      siguiente(estado.ciclo%4===0?"largo":"corto");
    } else siguiente("foco");
  }
  function arranca(){ if(estado.corriendo) return; estado.corriendo=true; estado.fin=Date.now()+estado.restante*1000; timer=setInterval(tic,250); pinta() }
  function pausa(){ if(!estado.corriendo) return; estado.corriendo=false; clearInterval(timer); timer=null; estado.restante=Math.max(0,Math.round((estado.fin-Date.now())/1000)); pinta() }
  function reinicia(){ clearInterval(timer); timer=null; estado.corriendo=false; estado.total=dur(estado.fase); estado.restante=estado.total; pinta() }
  function ajustes(){
    function v(id,d,mx){var n=parseInt($(id).value,10);if(!(n>0))n=d;return Math.min(mx,n)}
    cfg.foco=v("df",25,120); cfg.corto=v("dc",5,60); cfg.largo=v("dl",15,60); guardar();
    if(!estado.corriendo){ estado.total=dur(estado.fase); estado.restante=estado.total; pinta() }
  }

  function montar(contenedor, opts){
    opts=opts||{};
    el=contenedor;
    if(!document.getElementById("pomo-css")){ var st=document.createElement("style"); st.id="pomo-css"; st.textContent=CSS; document.head.appendChild(st) }
    el.innerHTML='<div class="pomo'+(opts.compacto?" c":"")+'"><div class="x"><div class="fila"><span class="f" id="pf"></span></div>'+
      '<div class="r" id="pr" role="timer" aria-live="off"></div><div class="b"><i id="pp"></i></div>'+
      '<div class="bt"><button class="p" id="pini" type="button">Empezar</button><button id="ppau" type="button" disabled>Pausa</button><button id="preset" type="button">Reiniciar</button><button id="psal" type="button">Saltar</button></div>'+
      (opts.compacto?'':'<div style="margin-top:12px;text-align:left"><label for="ptar">¿Qué estudias ahora?</label><input type="text" id="ptar" maxlength="80" placeholder="Ej.: HTML · formularios"></div>'+
      '<div class="s"><div><b id="php">0</b><span>pomodoros hoy</span></div><div><b id="phm">0</b><span>min de foco hoy</span></div><div><b id="pci">0/4</b><span>ciclo</span></div></div>'+
      '<label class="chk" style="display:flex;gap:8px;align-items:center;margin-top:10px"><input type="checkbox" id="pson" checked> Avisar con sonido</label>'+
      '<details><summary>Ajustar duraciones</summary><div class="s" style="margin-top:8px"><div><label for="pdf">Foco</label><input type="number" id="pdf" min="1" max="120"></div><div><label for="pdc">Corto</label><input type="number" id="pdc" min="1" max="60"></div><div><label for="pdl">Largo</label><input type="number" id="pdl" min="1" max="60"></div></div></details>'+
      '<p class="n" id="pnota"></p>')+'</div></div>';
    leer();
    function g(id){ return el.querySelector("#"+id) }
    $=function(id){
      var map={r:"pr",f:"pf",p:"pp",ini:"pini",pau:"ppau",ciclo:"pci",hp:"php",hm:"phm",son:"pson",df:"pdf",dc:"pdc",dl:"pdl",nota:"pnota",tarea:"ptar"};
      var x=map[id]||id; return g(x)||{};
    };
    $("df").value=cfg.foco; $("dc").value=cfg.corto; $("dl").value=cfg.largo;
    if(!$("tarea").value && !opts.compacto){ try{ $("tarea").value=localStorage.getItem(K+":tarea")||"" }catch(e){} }
    if($("ptar").addEventListener) $("ptar").addEventListener("input",function(){ try{ localStorage.setItem(K+":tarea",this.value) }catch(e){} });
    $("ini").onclick=arranca; $("pau").onclick=pausa; $("preset").onclick=reinicia;
    $("psal").onclick=function(){ if(estado.fase==="foco") siguiente(estado.ciclo%4===3?"largo":"corto"); else siguiente("foco") };
    ["df","dc","dl"].forEach(function(id){ $(id).onchange=ajustes });
    estado.total=dur("foco"); estado.restante=estado.total;
    pinta();
    document.addEventListener("visibilitychange",function(){ if(estado.corriendo) tic() });
    document.addEventListener("daw1-acceso",pinta);
  }
  window.POMO={montar:montar};
})();
