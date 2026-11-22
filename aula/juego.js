/* Motor de retos del modo gaming de Aula DAW 1.
   Cada reto recibe sus datos (d) y un contexto (ctx):
     ctx.vivo()    -> true mientras el jugador tenga vidas y el nivel siga en juego
     ctx.perder()  -> quita una vida (el nivel decide qué pasa al llegar a 0)
     ctx.listo()   -> el reto se ha superado
   Todos los retos devuelven un elemento DOM. */
(function () {
  var timers = [];

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function mezcla(a) {
    var b = a.slice(), i, j, t;
    for (i = b.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = b[i]; b[i] = b[j]; b[j] = t; }
    return b;
  }
  function rango(n) { var r = []; for (var i = 0; i < n; i++) r.push(i); return r; }
  function sacude(nodo) {
    nodo.classList.remove('sacude');
    void nodo.offsetWidth;
    nodo.classList.add('sacude');
  }
  function aviso(host) {
    var p = el('p', { class: 'jg-aviso', role: 'status', 'aria-live': 'polite' });
    host.appendChild(p);
    return function (txt, tipo) { p.textContent = txt || ''; p.className = 'jg-aviso' + (tipo ? ' ' + tipo : ''); };
  }
  function enunciado(d) { return d.intro ? el('p', { class: 'jg-intro', text: d.intro }) : null; }
  function bloqueCodigo(txt) { return el('pre', { class: 'jg-code' }, [el('code', { text: txt })]); }

  /* ---------- Ordenar ---------- */
  function orden(d, ctx) {
    var n = d.items.length, resp = [];
    var host = el('div', { class: 'jg-reto' });
    host.appendChild(enunciado(d));
    var cls = d.codigo ? ' jg-mono' : '';
    var dispon = el('div', { class: 'jg-pool' });
    var lista = el('ol', { class: 'jg-seq' });
    var msg = aviso(host);
    var orig = mezcla(rango(n));
    var ya = orig.every(function (x, p) { return x === p; });
    if (ya) orig = orig.reverse();
    function pinta() {
      dispon.innerHTML = ''; lista.innerHTML = '';
      orig.forEach(function (ix) {
        if (resp.indexOf(ix) !== -1) return;
        dispon.appendChild(el('button', { type: 'button', class: 'jg-chip' + cls, text: d.items[ix], onclick: function () { if (!ctx.vivo()) return; resp.push(ix); msg(''); pinta(); } }));
      });
      resp.forEach(function (ix, p) {
        lista.appendChild(el('li', null, [el('button', { type: 'button', class: 'jg-chip puesto' + cls, text: d.items[ix], title: 'Pulsa para quitarlo', onclick: function () { if (!ctx.vivo()) return; resp.splice(p, 1); msg(''); pinta(); } })]));
      });
      if (!resp.length) lista.appendChild(el('li', { class: 'jg-vacio', text: 'Pulsa las piezas en el orden correcto.' }));
    }
    var btn = el('button', { type: 'button', class: 'btn primary', text: 'Comprobar orden', onclick: function () {
      if (!ctx.vivo()) return;
      if (resp.length < n) { msg('Faltan ' + (n - resp.length) + ' piezas por colocar.', 'info'); return; }
      var bien = 0; resp.forEach(function (x, p) { if (x === p) bien++; });
      if (bien === n) { msg('¡Orden correcto!', 'ok'); ctx.listo(); return; }
      msg('Tienes ' + bien + ' de ' + n + ' en su sitio. Pierdes una vida; vuelve a ordenar.', 'mal');
      resp = []; pinta(); sacude(host); ctx.perder();
    } });
    host.appendChild(el('h4', { class: 'jg-sub', text: 'Piezas' }));
    host.appendChild(dispon);
    host.appendChild(el('h4', { class: 'jg-sub', text: 'Tu orden' }));
    host.appendChild(lista);
    host.appendChild(btn);
    pinta();
    return host;
  }

  /* ---------- Parejas ---------- */
  function parejas(d, ctx) {
    var host = el('div', { class: 'jg-reto' });
    host.appendChild(enunciado(d));
    var msg = aviso(host);
    var izq = el('div', { class: 'jg-col' }), der = el('div', { class: 'jg-col' });
    var sel = null, hechas = 0, total = d.pares.length;
    var bi = [], bd = [];
    d.pares.forEach(function (p, i) {
      var b = el('button', { type: 'button', class: 'jg-par', text: p[0], onclick: function () {
        if (!ctx.vivo() || b.disabled) return;
        bi.forEach(function (x) { x.classList.remove('sel'); });
        sel = i; b.classList.add('sel'); msg('');
      } });
      bi.push(b); izq.appendChild(b);
    });
    mezcla(rango(total)).forEach(function (i) {
      var b = el('button', { type: 'button', class: 'jg-par', text: d.pares[i][1], onclick: function () {
        if (!ctx.vivo() || b.disabled) return;
        if (sel === null) { msg('Elige primero un elemento de la izquierda.', 'info'); return; }
        if (sel === i) {
          bi[i].disabled = true; b.disabled = true;
          bi[i].classList.remove('sel'); bi[i].classList.add('ok'); b.classList.add('ok');
          sel = null; hechas++; msg(''); if (ctx.acierto) ctx.acierto();
          if (hechas === total) { msg('¡Todas las parejas encontradas!', 'ok'); ctx.listo(); }
        } else {
          bi.forEach(function (x) { x.classList.remove('sel'); });
          sel = null; sacude(b); msg('Esa no es la pareja. Pierdes una vida.', 'mal'); ctx.perder();
        }
      } });
      bd.push(b); der.appendChild(b);
    });
    host.appendChild(el('div', { class: 'jg-dos' }, [izq, der]));
    return host;
  }

  /* ---------- Completar huecos en un código ---------- */
  function hueco(d, ctx) {
    var host = el('div', { class: 'jg-reto' });
    host.appendChild(enunciado(d));
    var msg = aviso(host);
    var pre = el('pre', { class: 'jg-code' });
    var code = el('code');
    var sels = [];
    d.code.split(/(\[\[\d+\]\])/).forEach(function (parte) {
      var m = /^\[\[(\d+)\]\]$/.exec(parte);
      if (!m) { code.appendChild(document.createTextNode(parte)); return; }
      var h = d.huecos[+m[1]];
      var s = el('select', { class: 'jg-sel', 'aria-label': 'Hueco ' + (+m[1] + 1) });
      s.appendChild(el('option', { value: '-1', text: '…' }));
      h.o.forEach(function (t, i) { s.appendChild(el('option', { value: String(i), text: t })); });
      sels.push({ s: s, a: h.a });
      code.appendChild(s);
    });
    pre.appendChild(code);
    host.appendChild(pre);
    host.appendChild(el('button', { type: 'button', class: 'btn primary', text: 'Comprobar', onclick: function () {
      if (!ctx.vivo()) return;
      var bien = 0, vacios = 0;
      sels.forEach(function (x) {
        var v = parseInt(x.s.value, 10);
        x.s.classList.remove('ok', 'mal');
        if (v === -1) vacios++;
        else if (v === x.a) { bien++; x.s.classList.add('ok'); } else x.s.classList.add('mal');
      });
      if (vacios) { msg('Rellena todos los huecos antes de comprobar.', 'info'); return; }
      if (bien === sels.length) { msg('¡Código completo!', 'ok'); sels.forEach(function (x) { x.s.disabled = true; }); ctx.listo(); return; }
      msg('Aciertas ' + bien + ' de ' + sels.length + '. Corrige los marcados en rojo. Pierdes una vida.', 'mal');
      sacude(host); ctx.perder();
    } }));
    return host;
  }

  /* ---------- Cazar errores ---------- */
  function error(d, ctx) {
    var host = el('div', { class: 'jg-reto' });
    host.appendChild(enunciado(d));
    var msg = aviso(host);
    var marcadas = {};
    var caja = el('div', { class: 'jg-lineas' });
    d.lines.forEach(function (t, i) {
      caja.appendChild(el('button', { type: 'button', class: 'jg-linea', 'aria-pressed': 'false', onclick: function () {
        if (!ctx.vivo()) return;
        marcadas[i] = !marcadas[i];
        this.classList.toggle('sel', !!marcadas[i]);
        this.setAttribute('aria-pressed', marcadas[i] ? 'true' : 'false');
      } }, [el('span', { class: 'jg-n', text: String(i + 1) }), el('code', { text: t })]));
    });
    host.appendChild(caja);
    host.appendChild(el('button', { type: 'button', class: 'btn primary', text: 'Comprobar errores', onclick: function () {
      if (!ctx.vivo()) return;
      var sel = Object.keys(marcadas).filter(function (k) { return marcadas[k]; }).map(Number);
      if (!sel.length) { msg('Marca las líneas que crees que tienen un error.', 'info'); return; }
      var aciertos = sel.filter(function (x) { return d.bugs.indexOf(x) !== -1; }).length;
      if (aciertos === d.bugs.length && sel.length === d.bugs.length) { msg('¡Los ' + d.bugs.length + ' errores encontrados!', 'ok'); ctx.listo(); return; }
      msg('Has marcado ' + sel.length + ' líneas y aciertas ' + aciertos + ' de ' + d.bugs.length + ' errores. Pierdes una vida.', 'mal');
      sacude(host); ctx.perder();
    } }));
    return host;
  }

  /* ---------- Clasificar ---------- */
  function clasifica(d, ctx) {
    var host = el('div', { class: 'jg-reto' });
    host.appendChild(enunciado(d));
    var msg = aviso(host);
    var cola = mezcla(d.items), pos = 0;
    var progreso = el('p', { class: 'jg-prog' });
    var tarjeta = el('div', { class: 'jg-tarjeta' });
    var grupos = el('div', { class: 'jg-grupos' });
    d.cats.forEach(function (c, ci) {
      grupos.appendChild(el('button', { type: 'button', class: 'btn jg-cat', text: c, onclick: function () {
        if (!ctx.vivo() || pos >= cola.length) return;
        if (cola[pos][1] === ci) {
          pos++; msg(''); if (ctx.acierto) ctx.acierto();
          if (pos >= cola.length) { tarjeta.textContent = '¡Todo clasificado!'; progreso.textContent = ''; msg('¡Clasificación perfecta!', 'ok'); ctx.listo(); return; }
          pinta();
        } else {
          sacude(tarjeta); msg('No es «' + c + '». Pierdes una vida.', 'mal'); ctx.perder();
        }
      } }));
    });
    function pinta() { tarjeta.textContent = cola[pos][0]; progreso.textContent = (pos + 1) + ' de ' + cola.length; }
    host.appendChild(progreso); host.appendChild(tarjeta); host.appendChild(grupos);
    pinta();
    return host;
  }

  /* ---------- Escribir código con corrección automática ---------- */
  function escribe(d, ctx) {
    var host = el('div', { class: 'jg-reto' });
    host.appendChild(enunciado(d));
    var msg = aviso(host);
    var ta = el('textarea', { class: 'jg-ta', rows: '9', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Escribe aquí tu código' });
    ta.value = d.start || '';
    var lista = el('ul', { class: 'jg-checks' });
    var items = d.checks.map(function (c) { var li = el('li', { text: c.d }); lista.appendChild(li); return li; });
    var prev = null;
    if (d.lang === 'html') {
      prev = el('iframe', { class: 'jg-prev', title: 'Vista previa', sandbox: '' });
      var t = null;
      var pinta = function () { prev.setAttribute('srcdoc', ta.value); };
      ta.addEventListener('input', function () { clearTimeout(t); t = setTimeout(pinta, 250); });
      pinta();
    }
    function analiza(txt) {
      if (d.lang === 'xml') {
        var x = new DOMParser().parseFromString(txt, 'application/xml');
        return x;
      }
      return new DOMParser().parseFromString(txt, 'text/html');
    }
    host.appendChild(el('div', { class: 'jg-escribe' }, [
      el('div', null, [el('h4', { class: 'jg-sub', text: 'Tu código' }), ta]),
      el('div', null, [el('h4', { class: 'jg-sub', text: 'Debe cumplir' }), lista, prev ? el('h4', { class: 'jg-sub', text: 'Vista previa' }) : null, prev])
    ]));
    host.appendChild(el('button', { type: 'button', class: 'btn primary', text: 'Comprobar', onclick: function () {
      if (!ctx.vivo()) return;
      var txt = ta.value, doc, ok = 0;
      try { doc = analiza(txt); } catch (e) { doc = null; }
      d.checks.forEach(function (c, i) {
        var r = false;
        try { r = !!c.f(doc, txt); } catch (e) { r = false; }
        items[i].className = r ? 'ok' : 'mal';
        items[i].textContent = (r ? '✓ ' : '✗ ') + c.d;
        if (r) ok++;
      });
      if (ok === d.checks.length) { msg('¡Todos los requisitos cumplidos!', 'ok'); ta.readOnly = true; ctx.listo(); return; }
      msg('Cumples ' + ok + ' de ' + d.checks.length + ' requisitos. Pierdes una vida; corrige y vuelve a comprobar.', 'mal');
      sacude(host); ctx.perder();
    } }));
    host._ta = ta;
    return host;
  }

  /* ---------- Binario ---------- */
  function binario(d, ctx) {
    var host = el('div', { class: 'jg-reto' });
    host.appendChild(enunciado(d));
    var msg = aviso(host);
    var total = d.total || 5, hechas = 0, actual = null;
    var prog = el('p', { class: 'jg-prog' });
    var prob = el('p', { class: 'jg-tarjeta mono' });
    var inp = el('input', { type: 'text', class: 'jg-inp', inputmode: 'numeric', autocomplete: 'off', 'aria-label': 'Tu respuesta' });
    function nuevo() {
      var dec = 3 + Math.floor(Math.random() * 60);
      var aBin = Math.random() < 0.5;
      actual = aBin ? { txt: 'Pasa a binario el número ' + dec, r: dec.toString(2) } : { txt: 'Pasa a decimal el binario ' + dec.toString(2), r: String(dec) };
      prob.textContent = actual.txt; inp.value = ''; prog.textContent = 'Problema ' + (hechas + 1) + ' de ' + total;
      host._resp = actual.r;
    }
    function comprueba() {
      if (!ctx.vivo()) return;
      var v = inp.value.trim().replace(/^0+(?=\d)/, '');
      if (v === actual.r) {
        hechas++; msg(''); if (ctx.acierto) ctx.acierto();
        if (hechas >= total) { msg('¡Cinco de cinco!', 'ok'); ctx.listo(); return; }
        nuevo();
      } else { sacude(prob); msg('No es correcto. Pierdes una vida.', 'mal'); ctx.perder(); }
    }
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') comprueba(); });
    host.appendChild(prog); host.appendChild(prob);
    host.appendChild(el('div', { class: 'jg-fila' }, [inp, el('button', { type: 'button', class: 'btn primary', text: 'Responder', onclick: comprueba })]));
    host.appendChild(el('p', { class: 'hint', text: 'Pista: 1, 2, 4, 8, 16, 32 son los valores de cada posición, de derecha a izquierda.' }));
    nuevo();
    return host;
  }

  /* ---------- Preguntas (calentamiento, predicciones y jefe) ----------
     o.tiempo   segundos por pregunta (0 = sin límite)
     o.onResp   function(indice, acierto)
     o.hp       true: muestra la barra de vida del jefe (cada acierto la baja; un fallo devuelve la pregunta a la cola, una vez)
     o.jefe     nombre del jefe para la barra */
  function preguntas(qs, ctx, o) {
    o = o || {};
    var host = el('div', { class: 'jg-reto' });
    var cola = qs.map(function (q, i) { return { q: q, i: i, rep: false }; });
    var total = qs.length, derrotadas = 0;
    var cabecera = el('div', { class: 'jg-cab' });
    var caja = el('div', { class: 'jg-pregunta' });
    host.appendChild(cabecera); host.appendChild(caja);
    var idT = null;
    function paraT() { if (idT) { clearInterval(idT); var k = timers.indexOf(idT); if (k !== -1) timers.splice(k, 1); idT = null; } }
    function barra() {
      cabecera.innerHTML = '';
      if (o.hp) {
        var rest = total - derrotadas;
        cabecera.appendChild(el('div', { class: 'jg-hp', role: 'img', 'aria-label': (o.jefe || 'Jefe') + ': ' + rest + ' de ' + total + ' puntos de vida' }, [
          el('b', { text: o.jefe || 'Jefe' }), el('div', { class: 'jg-hpbar' }, [el('i', { style: 'width:' + Math.round(100 * rest / total) + '%' })]), el('small', { text: rest + '/' + total })
        ]));
      } else {
        cabecera.appendChild(el('p', { class: 'jg-prog', text: 'Pregunta ' + Math.min(derrotadas + 1, total) + ' de ' + total }));
      }
    }
    function siguiente() {
      paraT();
      if (!cola.length) { ctx.listo(); return; }
      var it = cola[0];
      var q = it.q;
      var orden = mezcla(rango(q.o.length));
      caja.innerHTML = '';
      barra();
      var reloj = null, relojBarra = null;
      if (o.tiempo) {
        relojBarra = el('i');
        reloj = el('div', { class: 'jg-reloj', role: 'timer' }, [relojBarra]);
        caja.appendChild(reloj);
      }
      caja.appendChild(el('h3', { class: 'jg-q', text: q.q }));
      var cod = q.code || q.codigo || q.ejemplo || q.ej;
      if (cod) { caja.appendChild(bloqueCodigo(cod)); if (q.deLeccion) caja.insertBefore(el('p', { class: 'jg-cap', text: 'Ejemplo de la lección' }), caja.lastChild); }
      else if (/\b(este|siguiente|anterior|del|el)\s+(ejemplo|c[oó]digo|fragmento|programa|script)\b/i.test(q.q) && window.console) console.warn('Pregunta que habla de un ejemplo pero no lo incluye:', q.q);
      var opts = el('div', { class: 'opts' });
      var expl = el('p', { class: 'expl', hidden: 'hidden' });
      var cont = el('button', { type: 'button', class: 'btn primary', text: 'Continuar', hidden: 'hidden', onclick: function () {
        if (!ctx.vivo()) return;
        siguiente();
      } });
      var respondida = false;
      var btns = [];
      function resuelve(oi, porTiempo) {
        if (respondida || !ctx.vivo()) return;
        respondida = true; paraT();
        var ok = oi === q.a;
        btns.forEach(function (b) { b.b.disabled = true; if (b.oi === q.a) b.b.classList.add('right'); if (b.oi === oi && !ok) b.b.classList.add('wrong'); });
        expl.hidden = false;
        expl.textContent = (porTiempo ? 'Se acabó el tiempo. ' : (ok ? '¡Correcto! ' : 'No exacto. ')) + (q.e || '');
        cola.shift();
        if (ok) { derrotadas++; if (ctx.acierto) ctx.acierto(); }
        else if (o.hp && !it.rep) { it.rep = true; cola.push(it); }
        else derrotadas++; /* fallo sin repetición: la pregunta se da por vista */
        if (o.onResp) o.onResp(it.i, ok, caja);
        if (o.hp) barra();
        if (!ok) { sacude(caja); var vidas = ctx.perder(); if (vidas <= 0) return; }
        if (!cola.length) { cont.textContent = o.hp ? '¡Golpe final!' : 'Terminar'; }
        cont.hidden = false;
        try { cont.focus(); } catch (e) { /* sin foco */ }
      }
      orden.forEach(function (oi) {
        var b = el('button', { type: 'button', class: 'opt', text: q.o[oi], onclick: function () { resuelve(oi, false); } });
        btns.push({ b: b, oi: oi }); opts.appendChild(b);
      });
      caja.appendChild(opts); caja.appendChild(expl); caja.appendChild(cont);
      if (o.tiempo) {
        var fin = Date.now() + o.tiempo * 1000;
        idT = setInterval(function () {
          if (!host.isConnected) { paraT(); return; }
          var r = fin - Date.now();
          relojBarra.style.width = Math.max(0, 100 * r / (o.tiempo * 1000)) + '%';
          if (r <= 0) resuelve(-1, true);
        }, 200);
        timers.push(idT);
      }
    }
    siguiente();
    return host;
  }


  /* ---------- Escenario 2D (canvas): héroe contra monstruo ---------- */
  var HEROE = [
    '.....hhHHhh.....',
    '...hhHHHhhhhh...',
    '..hhHHHhhhhhhh..',
    '..hhhhhhhhhhhh..',
    '..hhsssssssshh..',
    '..hshhhsshhhsh..',
    '..sswwesswwess..',
    '..SsweessweesS..',
    '..sscsssSsscss..',
    '...sssMssMsss...',
    '...ssssMMssss...',
    '...ssssssssss...',
    '.....SSSSSS.....',
    '.bbbbbbbbbbbbbb.',
    '.bbbbbbbbbbbbbb.',
    '.bbbbbbbbbbbbbb.',
    '.ssnnnnBBnnnnss.',
    '....pppkkppp....',
    '....pppkkppp....',
    '...kkkk..kkkk...'];
  var MONSTRUOS = {
    marcas: { n: 'Etiqueta Traviesa', f: [
      '..mmmmmmmm..', '.mmmmmmmmmm.', 'mmwwmmmmwwmm', 'mmwkmmmmwkmm', 'mmmmmmmmmmmm', 'mmmkmmmmkmmm',
      'mmkmmmmmmkmm', 'mmmkmmmmkmmm', '.mmmmmmmmmm.', '.mm......mm.', '.mm......mm.', 'kkk......kkk'] },
    prog: { n: 'Robot Compilón', f: [
      '.....rr.....', '.....dd.....', '.mmmmmmmmmm.', '.mwwmmmmwwm.', '.mwkmmmmwkm.', '.mmmmmmmmmm.',
      '.mkkkkkkkkm.', '.mkwkwkwkwm.', '.mmmmmmmmmm.', 'dmmmmmmmmmmd', '.mm..mm..mm.', '.dd......dd.'] },
    entornos: { n: 'Bicho del Código', f: [
      'k..........k', '.k...mm...k.', '..k.mmmm.k..', '...mwmmwm...', '..mmkmmkmm..', 'k.mmmmmmmm.k',
      '.kmmdmmdmmk.', '..mmmmmmmm..', 'k.mmdmmdmm.k', '.k.mmmmmm.k.', 'k...m..m...k', '............'] },
    sistemas: { n: 'Chip Gruñón', f: [
      '..k.k..k.k..', '.mmmmmmmmmm.', 'kmwwmmmmwwmk', '.mwkmmmmwkm.', 'kmmmmmmmmmmk', '.mmmkkkkmmm.',
      'kmmmkwwkmmmk', '.mmmkkkkmmm.', 'kmmmmmmmmmmk', '.mmmmmmmmmm.', '..k.k..k.k..', '............'] },
    bd: { n: 'Barril de Datos', f: [
      '..dddddddd..', '.dmmmmmmmmd.', '.dmmmmmmmmd.', '.mmwwmmwwmm.', '.mmwkmmwkmm.', '.dmmmmmmmmd.',
      '.mmmkkkkmmm.', '.dmmmmmmmmd.', '.mmmmmmmmmm.', '.dmmmmmmmmd.', '.mmmmmmmmmm.', '..dddddddd..'] },
    tsp: { n: 'Monedón', f: [
      '....mmmm....', '...mmmmmm...', '....dddd....', '...mmmmmm...', '..mmmmmmmm..', '.mmwwmmwwmm.',
      '.mmwkmmwkmm.', '.mmmmyymmmm.', '.mmmyyyymmm.', '.mmmmyymmmm.', '..mmmmmmmm..', '...dd..dd...'] },
    despliegue: { n: 'Servidor Pulpo', f: [
      '...k.mm.k...', '..kmmmmmmk..', '.kmmmmmmmmk.', '.mmwwmmwwmm.', '.mmwkmmwkmm.', '.mmmmmmmmmm.',
      '.mmkkkkkkmm.', '..mmmmmmmm..', '.m.m.mm.m.m.', 'm..m.mm.m..m', 'm..d.mm.d..m', '.d..d..d..d.'] },
    ingles: { n: 'Dragoncito Gramatical', f: [
      '.m........m.', '.mm......mm.', '..mmmmmmmm..', '.mmwwmmwwmm.', '.mmwkmmwkmm.', '.mmmmmmmmmm.',
      '.mmmkrrkmmm.', '.dmmmmmmmmd.', 'dmmmmmmmmmmd', '.mmmmmmmmmm.', '.mm..mm..mm.', '.dd..dd..dd.'] }
  };
  function oscuro(hex) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function f(x) { x = Math.round(x * 0.65); return (x < 16 ? '0' : '') + x.toString(16); }
    return '#' + f(r) + f(g) + f(b);
  }
  var EMBLEMA = { marcas: '</>', prog: '{ }', entornos: 'bug', sistemas: '0101', bd: 'DB', tsp: '€', despliegue: 'SSH', ingles: 'Aa' };
  /* Sprite de alta calidad: contorno oscuro, luz arriba-izquierda y sombra abajo */
  function sprite(ctx, filas, x, y, px, pal, sinContorno) {
    var R = filas.length, C = filas[0].length;
    function occ(r, c) { if (r < 0 || c < 0 || r >= R || c >= C) return false; var ch = filas[r][c]; return ch !== '.' && !!pal[ch]; }
    var r, c, ch, X, Y;
    if (!sinContorno) {
      ctx.fillStyle = 'rgba(20,24,40,.92)';
      for (r = 0; r < R; r++) for (c = 0; c < C; c++) if (occ(r, c)) {
        X = Math.round(x + c * px); Y = Math.round(y + r * px);
        if (!occ(r - 1, c)) ctx.fillRect(X - 1, Y - 1.5, px + 2, 2.5);
        if (!occ(r + 1, c)) ctx.fillRect(X - 1, Y + px - 1, px + 2, 2.5);
        if (!occ(r, c - 1)) ctx.fillRect(X - 1.5, Y - 1, 2.5, px + 2);
        if (!occ(r, c + 1)) ctx.fillRect(X + px - 1, Y - 1, 2.5, px + 2);
      }
    }
    for (r = 0; r < R; r++) for (c = 0; c < C; c++) {
      ch = filas[r][c];
      if (ch !== '.' && pal[ch]) { ctx.fillStyle = pal[ch]; ctx.fillRect(Math.round(x + c * px), Math.round(y + r * px), px, px); }
    }
    for (r = 0; r < R; r++) for (c = 0; c < C; c++) {
      ch = filas[r][c];
      if (ch === '.' || !pal[ch] || ch === 'k' || ch === 'w' || ch === 'e') continue;
      X = Math.round(x + c * px); Y = Math.round(y + r * px);
      if (!occ(r - 1, c)) { ctx.fillStyle = 'rgba(255,255,255,.38)'; ctx.fillRect(X, Y, px, Math.max(1.5, px * 0.3)); }
      if (!occ(r, c - 1)) { ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(X, Y, Math.max(1.5, px * 0.25), px); }
      if (!occ(r + 1, c)) { ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(X, Y + px - Math.max(1.5, px * 0.3), px, Math.max(1.5, px * 0.3)); }
      if (!occ(r, c + 1)) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(X + px - Math.max(1.5, px * 0.25), Y, Math.max(1.5, px * 0.25), px); }
    }
  }
  function brillo(g, x, y, r, c0, c1) {
    var gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, c0); gr.addColorStop(1, c1);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
  }
  function sombra(g, x, y, w) {
    g.save(); g.translate(x, y); g.scale(1, 0.22);
    brillo(g, 0, 0, w, 'rgba(0,0,0,.45)', 'rgba(0,0,0,0)');
    g.restore();
  }
  /* Cara del monstruo: brillo en los ojos, cejas de enfado y ojos de dolor al ser golpeado */
  function caraMonstruo(g, filas, x, y, px, dolor, t) {
    var r, c, filaOjos = -1;
    for (r = 0; r < filas.length && filaOjos < 0; r++) if (/w{2}/.test(filas[r]) && r + 1 < filas.length && /k/.test(filas[r + 1])) filaOjos = r;
    if (filaOjos < 0) return;
    var fila = filas[filaOjos], ojos = [], re = /w+/g, m;
    while ((m = re.exec(fila))) ojos.push([m.index, m[0].length]);
    ojos.forEach(function (o, i) {
      var ox = x + o[0] * px, oy = y + filaOjos * px, ow = o[1] * px;
      if (dolor) {
        rect(g, ox, oy, ow, px * 2, 'rgba(20,24,40,0)');
        g.strokeStyle = '#111'; g.lineWidth = 1.8; g.beginPath();
        g.moveTo(ox + 1, oy + 1); g.lineTo(ox + ow - 1, oy + px * 2 - 1); g.moveTo(ox + ow - 1, oy + 1); g.lineTo(ox + 1, oy + px * 2 - 1); g.stroke();
      } else {
        rect(g, ox + ow - px * 0.9, oy + px * 1.05, px * 0.5, px * 0.5, '#fff');
      }
      var izq = i < ojos.length / 2;
      g.strokeStyle = '#111'; g.lineWidth = 2.2; g.beginPath();
      if (izq) { g.moveTo(ox - 1, oy - px * 0.9); g.lineTo(ox + ow + 1, oy - px * 0.1); } else { g.moveTo(ox - 1, oy - px * 0.1); g.lineTo(ox + ow + 1, oy - px * 0.9); }
      g.stroke();
    });
  }
  /* Temas de escenario: cada asignatura tiene su mundo */
  var TEMAS = {
    marcas:     { c1: '#4fc3f7', c2: '#e1f5fe', lejos: '#7fbf9a', medio: '#4caf6a', suelo: '#35b34a', tierra: '#8a4b1f', ladr: '#b8692d', deco: 'arboles', noche: false },
    prog:       { c1: '#3b1d4a', c2: '#ff8a3d', lejos: '#5a2a3c', medio: '#8a3a2a', suelo: '#c2531b', tierra: '#4a1f12', ladr: '#7a2e17', deco: 'volcan', noche: true },
    entornos:   { c1: '#1d1b4b', c2: '#7a5cff', lejos: '#2e2a6e', medio: '#4a3fa8', suelo: '#6b4ce0', tierra: '#2a2160', ladr: '#3b2f86', deco: 'cristales', noche: true },
    sistemas:   { c1: '#07162e', c2: '#124a8a', lejos: '#0d2b57', medio: '#16427c', suelo: '#2563c9', tierra: '#0b1f3f', ladr: '#12305e', deco: 'circuito', noche: true },
    bd:         { c1: '#8fe3a8', c2: '#effbe9', lejos: '#9fd9a6', medio: '#5cbf6c', suelo: '#23813f', tierra: '#5b3a1a', ladr: '#7a4d22', deco: 'torres', noche: false },
    tsp:        { c1: '#ff9a8b', c2: '#ffe3a3', lejos: '#c97b9a', medio: '#a14d7a', suelo: '#c23b72', tierra: '#4a2038', ladr: '#6b2d50', deco: 'ciudad', noche: false },
    despliegue: { c1: '#0b3b4a', c2: '#5fd0e8', lejos: '#1b6a80', medio: '#128099', suelo: '#0e7490', tierra: '#0a2f3a', ladr: '#14505f', deco: 'servidores', noche: true },
    ingles:     { c1: '#ffcf70', c2: '#fff3d6', lejos: '#c8a36a', medio: '#a4660f', suelo: '#c98a2b', tierra: '#5a3a10', ladr: '#8a5a1a', deco: 'castillo', noche: false }
  };
  function rect(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }

  function decorado(g, tema, W, t, quieto) {
    var d = tema.deco, i, x, h;
    if (d === 'arboles') {
      for (i = 0; i < 6; i++) { x = i * 62 - ((quieto ? 0 : t * 4) % 62) + 10; rect(g, x + 8, 92, 6, 18, '#6b4423'); rect(g, x, 76, 22, 20, '#2e8b57'); rect(g, x + 4, 68, 14, 12, '#3fae6a'); }
    } else if (d === 'volcan') {
      g.fillStyle = tema.lejos; g.beginPath(); g.moveTo(40, 112); g.lineTo(100, 52); g.lineTo(160, 112); g.fill();
      rect(g, 92, 52, 16, 6, '#ffb347'); rect(g, 96 + Math.sin(t * 4) * 2, 44 - (t * 10 % 8), 8, 8, '#ff6b35');
      g.fillStyle = tema.medio; g.beginPath(); g.moveTo(190, 112); g.lineTo(240, 70); g.lineTo(300, 112); g.fill();
    } else if (d === 'cristales') {
      for (i = 0; i < 7; i++) { x = i * 50 + 10; h = 26 + (i * 13 % 22); g.fillStyle = i % 2 ? '#9d8cff' : '#6b4ce0'; g.beginPath(); g.moveTo(x, 112); g.lineTo(x + 9, 112 - h); g.lineTo(x + 18, 112); g.fill(); }
    } else if (d === 'circuito') {
      g.fillStyle = 'rgba(80,170,255,.35)';
      for (i = 0; i < 8; i++) { rect(g, i * 44 + 6, 60 + (i % 3) * 14, 30, 2, 'rgba(80,170,255,.35)'); rect(g, i * 44 + 36, 60 + (i % 3) * 14, 2, 22, 'rgba(80,170,255,.35)'); rect(g, i * 44 + 33, 80 + (i % 3) * 14, 8, 8, 'rgba(120,200,255,.55)'); }
      var pu = quieto ? 0 : (t * 60) % W; rect(g, pu, 63, 8, 2, '#7dd3fc');
    } else if (d === 'torres') {
      for (i = 0; i < 5; i++) { x = i * 70 + 14; rect(g, x, 82, 22, 30, '#8ed3a0'); rect(g, x, 82, 22, 4, '#bfe9c8'); rect(g, x, 94, 22, 2, '#6cbf85'); rect(g, x, 104, 22, 2, '#6cbf85'); }
    } else if (d === 'ciudad') {
      for (i = 0; i < 12; i++) { x = i * 28 - 4; h = 24 + ((i * 17) % 34); rect(g, x, 112 - h, 22, h, '#7a3b63'); for (var wv = 0; wv < h - 8; wv += 9) { rect(g, x + 4, 112 - h + 4 + wv, 4, 4, (i + wv) % 3 ? '#ffd98a' : '#5c2a4a'); rect(g, x + 13, 112 - h + 4 + wv, 4, 4, (i * wv) % 4 ? '#5c2a4a' : '#ffd98a'); } }
    } else if (d === 'servidores') {
      for (i = 0; i < 6; i++) { x = i * 56 + 8; rect(g, x, 66, 28, 46, '#0a2f3a'); rect(g, x + 2, 68, 24, 42, '#12566a'); for (var r = 0; r < 4; r++) { rect(g, x + 4, 71 + r * 10, 20, 7, '#0a2f3a'); rect(g, x + 6, 73 + r * 10, 3, 3, ((Math.floor(t * 3) + i + r) % 3) ? '#5ef38c' : '#ff5f5f'); } }
    } else if (d === 'castillo') {
      rect(g, 130, 66, 60, 46, '#d4b483'); for (i = 0; i < 4; i++) rect(g, 130 + i * 16, 60, 10, 8, '#d4b483'); rect(g, 154, 90, 12, 22, '#6b3f12'); rect(g, 120, 52, 16, 60, '#c8a36a'); rect(g, 184, 52, 16, 60, '#c8a36a'); rect(g, 120, 46, 16, 8, '#e60012'); rect(g, 184, 46, 16, 8, '#e60012');
    }
  }

  /* ---------- Dibujo vectorial chibi (héroe y monstruos) ---------- */
  function claro(hex, f) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function m(x) { x = Math.round(x + (255 - x) * f); return (x < 16 ? '0' : '') + x.toString(16); }
    return '#' + m(r) + m(g) + m(b);
  }
  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }
  function lg(g, x0, y0, x1, y1, a, b) { var q = g.createLinearGradient(x0, y0, x1, y1); q.addColorStop(0, a); q.addColorStop(1, b); return q; }
  function rg(g, x, y, r0, r1, a, b) { var q = g.createRadialGradient(x, y, r0, x, y, r1); q.addColorStop(0, a); q.addColorStop(1, b); return q; }
  function ovalo(g, x, y, rx, ry, fill) { g.fillStyle = fill; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 6.283); g.fill(); }
  function trazo(g, c, w) { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); }

  function heroeVec(g, X, gy, o) {
    var c = o.color, bob = o.by, rojo = o.rojo;
    var piel = rojo ? '#ffb4ac' : '#ffe2c4', pielO = rojo ? '#f08a80' : '#f1bb90', tun = rojo ? '#e5484d' : c;
    var ch = !!o.chica;
    var pelo0 = ch ? '#b0693a' : '#8a5630', pelo1 = ch ? '#5a2f14' : '#3a2010';
    var hy = gy - 47 + bob, ond = o.quieto ? 0 : Math.sin(o.t * 5) * 2;
    /* pelo largo por detrás (chica) */
    if (ch) { rr(g, X - 23, hy - 6, 46, 40, 16); g.fillStyle = lg(g, 0, hy - 6, 0, hy + 34, pelo0, pelo1); g.fill(); }
    /* capa */
    g.fillStyle = lg(g, X - 20, gy - 40, X - 6, gy - 10, claro(oscuro(tun), 0.1), oscuro(oscuro(tun)));
    g.beginPath(); g.moveTo(X - 7, gy - 32 + bob); g.quadraticCurveTo(X - 24 + ond, gy - 26 + bob, X - 22 + ond * 1.5, gy - 8); g.lineTo(X - 3, gy - 12); g.closePath(); g.fill();
    /* piernas y botas */
    [-1, 1].forEach(function (d) {
      rr(g, X + d * 5.2 - 4.2, gy - 13, 8.4, 13, 3.5); g.fillStyle = lg(g, 0, gy - 13, 0, gy, '#4a4f6e', '#1d2133'); g.fill();
      rr(g, X + d * 5.2 - 5, gy - 5, 10, 5, 2.5); g.fillStyle = '#5a3a1a'; g.fill();
    });
    /* falda (chica) */
    if (ch) { g.fillStyle = lg(g, X - 15, gy - 19 + bob, X + 15, gy - 8, claro(tun, 0.2), oscuro(tun)); g.beginPath(); g.moveTo(X - 10.5, gy - 19 + bob); g.lineTo(X - 16, gy - 8); g.quadraticCurveTo(X, gy - 5, X + 16, gy - 8); g.lineTo(X + 10.5, gy - 19 + bob); g.closePath(); g.fill(); trazo(g, 'rgba(20,24,40,.5)', 0.9); }
    /* cuerpo */
    rr(g, X - 10.5, gy - 31 + bob, 21, 21, 8); g.fillStyle = lg(g, X - 10, gy - 31, X + 10, gy - 10, claro(tun, 0.25), oscuro(tun)); g.fill(); trazo(g, 'rgba(20,24,40,.55)', 1);
    rr(g, X - 10.5, gy - 19 + bob, 21, 3.2, 1.2); g.fillStyle = '#6b4423'; g.fill();
    rr(g, X - 3, gy - 20 + bob, 6, 5.4, 1.4); g.fillStyle = lg(g, 0, gy - 20, 0, gy - 14, '#ffe27a', '#d9a21b'); g.fill();
    /* brazo izquierdo */
    ovalo(g, X - 12.5, gy - 23 + bob, 3.6, 6.5, tun); ovalo(g, X - 12.5, gy - 16.5 + bob, 3.1, 3.1, piel);
    /* cabeza: pelo de atrás, orejas, cara */
    ovalo(g, X, hy - 2, 22, 21.5, lg(g, 0, hy - 22, 0, hy + 20, pelo0, pelo1));
    ovalo(g, X - 19.8, hy + 4, 3.6, 4.2, pielO); ovalo(g, X + 19.8, hy + 4, 3.6, 4.2, pielO);
    g.fillStyle = rg(g, X - 6, hy - 7, 2, 24, piel, pielO); g.beginPath(); g.arc(X, hy, 19.6, 0, 6.283); g.fill(); trazo(g, 'rgba(120,70,40,.45)', 0.9);
    /* mejillas */
    [-1, 1].forEach(function (d) { ovalo(g, X + d * 12.5, hy + 9.5, 5.2, 3.2, rg(g, X + d * 12.5, hy + 9.5, 0.5, 5.5, 'rgba(255,110,130,.6)', 'rgba(255,110,130,0)')); });
    /* ojos */
    [-1, 1].forEach(function (d) {
      var ex = X + d * 8.6, ey = hy + 3.5;
      if (rojo) { g.beginPath(); g.moveTo(ex - d * 4, ey - 4); g.lineTo(ex + d * 3.5, ey); g.lineTo(ex - d * 4, ey + 4); trazo(g, '#2a1608', 2); }
      else if (o.win) { g.beginPath(); g.moveTo(ex - 4.5, ey + 2.5); g.quadraticCurveTo(ex, ey - 5, ex + 4.5, ey + 2.5); trazo(g, '#2a1608', 2); }
      else if (!o.quieto && (o.t * 0.9) % 1 > 0.93) { g.beginPath(); g.moveTo(ex - 5, ey + 1); g.quadraticCurveTo(ex, ey + 4, ex + 5, ey + 1); trazo(g, '#2a1608', 2); }
      else {
        ovalo(g, ex, ey, 5.6, 6.6, '#ffffff');
        ovalo(g, ex + 0.9, ey + 0.7, 4.3, 5.6, rg(g, ex + 0.9, ey + 3, 0.5, 6, '#8fd3ff', '#1d56c4'));
        ovalo(g, ex + 1, ey + 0.8, 2.2, 3.2, '#0b1630');
        ovalo(g, ex - 0.8, ey - 2.2, 1.8, 1.8, '#ffffff'); ovalo(g, ex + 2.2, ey + 2.8, 0.9, 0.9, 'rgba(255,255,255,.85)');
        g.beginPath(); g.ellipse(ex, ey, 5.6, 6.6, 0, 3.4, 6.0); trazo(g, '#2a1608', 2);
        g.beginPath(); g.moveTo(ex - d * 4.8, ey - 9.5); g.quadraticCurveTo(ex, ey - 11.5 + (d > 0 ? 0 : 0), ex + d * 4.5, ey - 9.2); trazo(g, '#5a3a1a', 1.5);
      }
    });
    /* nariz y boca */
    ovalo(g, X + 1.5, hy + 10.2, 0.9, 0.7, '#d9926a');
    if (rojo) { ovalo(g, X + 1, hy + 14.5, 2.6, 3.2, '#5a1a1a'); ovalo(g, X + 1, hy + 16, 1.6, 1.2, '#e5484d'); }
    else if (o.win) { g.fillStyle = '#7a1f1f'; g.beginPath(); g.arc(X + 1, hy + 12.5, 4, 0, 3.1416); g.closePath(); g.fill(); rect(g, X - 2, hy + 12.5, 6, 1.6, '#ffffff'); }
    else { g.beginPath(); g.arc(X + 1, hy + 11.2, 3.2, 0.2, 2.9); trazo(g, '#8a2a2a', 1.4); }
    /* flequillo con mechones y ahoge */
    g.fillStyle = lg(g, X - 20, hy - 24, X + 20, hy + 2, pelo0, pelo1);
    g.beginPath(); g.moveTo(X - 21, hy + 3); g.quadraticCurveTo(X - 24, hy - 21, X, hy - 23); g.quadraticCurveTo(X + 24, hy - 21, X + 21, hy + 3);
    g.lineTo(X + 17, hy - 3); g.lineTo(X + 12, hy - 11); g.lineTo(X + 8, hy - 5); g.lineTo(X + 3, hy - 13); g.lineTo(X - 2, hy - 5); g.lineTo(X - 7, hy - 12); g.lineTo(X - 12, hy - 4); g.lineTo(X - 17, hy - 8); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(X + 2, hy - 22); g.quadraticCurveTo(X + 6 + ond * 0.4, hy - 31, X + 12, hy - 30); g.quadraticCurveTo(X + 8, hy - 26, X + 9, hy - 21); g.closePath(); g.fillStyle = pelo0; g.fill();
    g.beginPath(); g.moveTo(X - 14, hy - 14); g.quadraticCurveTo(X - 6, hy - 20, X + 2, hy - 18); trazo(g, 'rgba(255,214,160,.55)', 1.4);
    /* lazo (chica) */
    if (ch) { var bx0 = X - 13, by0 = hy - 17; g.fillStyle = '#e5484d'; g.beginPath(); g.moveTo(bx0, by0); g.lineTo(bx0 - 9, by0 - 6); g.lineTo(bx0 - 9, by0 + 6); g.closePath(); g.fill(); g.beginPath(); g.moveTo(bx0, by0); g.lineTo(bx0 + 9, by0 - 6); g.lineTo(bx0 + 9, by0 + 6); g.closePath(); g.fill(); ovalo(g, bx0, by0, 3, 3, '#b3262b'); }
    /* brazo derecho y espada */
    var sx = X + 16, sy = gy - 22 + bob;
    ovalo(g, X + 12.8, gy - 25 + bob, 3.6, 6, tun);
    g.fillStyle = lg(g, sx - 2, 0, sx + 2.5, 0, '#ffffff', '#9fb3c8'); g.beginPath(); g.moveTo(sx - 2, sy - 2); g.lineTo(sx - 2, sy - 28); g.lineTo(sx + 0.3, sy - 35); g.lineTo(sx + 2.6, sy - 28); g.lineTo(sx + 2.6, sy - 2); g.closePath(); g.fill(); trazo(g, 'rgba(60,80,110,.6)', 0.7);
    rect(g, sx - 0.2, sy - 28, 0.8, 24, 'rgba(110,130,160,.7)');
    rr(g, sx - 5, sy - 2, 10, 3.4, 1.5); g.fillStyle = '#ffd43b'; g.fill();
    rr(g, sx - 1.2, sy + 1, 3.4, 6, 1.4); g.fillStyle = '#7a4420'; g.fill();
    ovalo(g, sx + 0.5, sy + 3, 3.4, 3.2, piel);
    if (!o.quieto) brillo(g, sx + 0.3, sy - 32 + Math.sin(o.t * 5) * 2, 7, 'rgba(255,255,255,.85)', 'rgba(255,255,255,0)');
  }

  function monstruoVec(g, sid, cx, gy, R, color, o) {
    var cl = claro(color, 0.4), co = oscuro(color), cy = gy - R;
    var a = o.quieto ? 0 : Math.sin(o.t * 4) * 0.03;
    g.save(); g.translate(cx, gy); g.scale(1 - a, 1 + a); g.translate(-cx, -gy - (o.quieto ? 0 : 0));
    var cuerpo = lg(g, cx - R, cy - R, cx + R, cy + R, cl, co), borde = 'rgba(20,24,40,.7)';
    var fx = cx, fy = cy - R * 0.08, i;
    function pies() { [-1, 1].forEach(function (d) { ovalo(g, cx + d * R * 0.5, gy - 3, R * 0.3, 4.2, co); trazo(g, borde, 0.9); }); }
    if (sid === 'marcas') {
      [-1, 1].forEach(function (d) { g.fillStyle = co; g.beginPath(); g.moveTo(cx + d * R * 0.35, cy - R * 0.8); g.lineTo(cx + d * R * 0.85, cy - R * 1.35); g.lineTo(cx + d * R * 0.9, cy - R * 0.55); g.closePath(); g.fill(); });
      pies(); rr(g, cx - R, cy - R * 0.95, R * 2, R * 1.85, R * 0.55); g.fillStyle = cuerpo; g.fill(); trazo(g, borde, 1.2);
    } else if (sid === 'prog') {
      g.beginPath(); g.moveTo(cx, cy - R * 0.9); g.lineTo(cx, cy - R * 1.35); trazo(g, '#555', 1.6); brillo(g, cx, cy - R * 1.42, 5, '#ff9a9a', '#e60012');
      [-1, 1].forEach(function (d) { ovalo(g, cx + d * R * 1.02, cy, 3.2, R * 0.3, '#8a94a6'); });
      pies(); rr(g, cx - R * 0.95, cy - R * 0.95, R * 1.9, R * 1.8, R * 0.35); g.fillStyle = lg(g, cx - R, cy - R, cx + R, cy + R, '#e8edf5', '#7c889c'); g.fill(); trazo(g, borde, 1.2);
      rr(g, cx - R * 0.72, cy - R * 0.62, R * 1.44, R * 1.15, R * 0.25); g.fillStyle = color; g.fill(); trazo(g, borde, 0.9); fy = cy - R * 0.04;
    } else if (sid === 'entornos') {
      for (i = -1; i <= 1; i++) [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(cx + d * R * 0.8, cy + i * R * 0.35); g.lineTo(cx + d * R * 1.3, cy + i * R * 0.55 + 3); g.lineTo(cx + d * R * 1.4, cy + i * R * 0.55 + R * 0.35); trazo(g, co, 2.2); });
      [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(cx + d * R * 0.3, cy - R * 0.85); g.quadraticCurveTo(cx + d * R * 0.5, cy - R * 1.5, cx + d * R * 0.95, cy - R * 1.4); trazo(g, co, 1.8); ovalo(g, cx + d * R * 0.95, cy - R * 1.4, 2.6, 2.6, '#ffd43b'); });
      pies(); ovalo(g, cx, cy, R * 1.0, R * 0.98, cuerpo); g.beginPath(); g.ellipse(cx, cy, R, R * 0.98, 0, 0, 6.283); trazo(g, borde, 1.2);
      ovalo(g, cx - R * 0.55, cy + R * 0.55, 3, 3, co); ovalo(g, cx + R * 0.58, cy + R * 0.5, 2.4, 2.4, co);
    } else if (sid === 'sistemas') {
      for (i = 0; i < 5; i++) { var pp = cx - R * 0.8 + i * R * 0.4; rect(g, pp - 1.6, cy - R * 1.2, 3.2, R * 0.3, '#c9ced8'); rect(g, cx - R * 1.2, pp - cx + cy - 1.6, R * 0.3, 3.2, '#c9ced8'); rect(g, cx + R * 0.9, pp - cx + cy - 1.6, R * 0.3, 3.2, '#c9ced8'); }
      pies(); rr(g, cx - R * 0.95, cy - R * 0.95, R * 1.9, R * 1.85, 6); g.fillStyle = cuerpo; g.fill(); trazo(g, borde, 1.2);
      ovalo(g, cx - R * 0.7, cy - R * 0.7, 2.5, 2.5, 'rgba(255,255,255,.7)');
    } else if (sid === 'bd') {
      pies(); g.fillStyle = cuerpo; g.beginPath(); g.moveTo(cx - R * 0.95, cy - R * 0.8); g.lineTo(cx - R * 0.95, cy + R * 0.8); g.quadraticCurveTo(cx, cy + R * 1.2, cx + R * 0.95, cy + R * 0.8); g.lineTo(cx + R * 0.95, cy - R * 0.8); g.closePath(); g.fill(); trazo(g, borde, 1.2);
      ovalo(g, cx, cy - R * 0.8, R * 0.95, R * 0.3, cl); g.beginPath(); g.ellipse(cx, cy - R * 0.8, R * 0.95, R * 0.3, 0, 0, 6.283); trazo(g, borde, 1.2);
      g.beginPath(); g.moveTo(cx - R * 0.95, cy + R * 0.35); g.quadraticCurveTo(cx, cy + R * 0.7, cx + R * 0.95, cy + R * 0.35); trazo(g, co, 1.6); fy = cy - R * 0.2;
    } else if (sid === 'tsp') {
      pies(); g.fillStyle = rg(g, cx - R * 0.3, cy - R * 0.4, 2, R * 1.2, '#fff2a8', '#d9a21b'); g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.fill(); trazo(g, borde, 1.3);
      g.beginPath(); g.arc(cx, cy, R * 0.82, 0, 6.283); trazo(g, 'rgba(150,100,10,.55)', 1.4);
    } else if (sid === 'despliegue') {
      for (i = -2; i <= 2; i++) { var tx = cx + i * R * 0.38, mv = o.quieto ? 0 : Math.sin(o.t * 3 + i) * 3; g.beginPath(); g.moveTo(tx, cy + R * 0.6); g.quadraticCurveTo(tx + mv, cy + R * 1.0, tx + mv * 1.5 + i * 2, gy - 2); trazo(g, co, 4.2); }
      rr(g, cx - R * 0.95, cy - R * 0.95, R * 1.9, R * 1.65, R * 0.3); g.fillStyle = lg(g, cx - R, cy - R, cx + R, cy + R, claro(color, 0.3), co); g.fill(); trazo(g, borde, 1.2);
      for (i = 0; i < 3; i++) ovalo(g, cx + R * 0.55 - i * 6, cy - R * 0.72, 1.9, 1.9, ((Math.floor(o.t * 3) + i) % 3) ? '#5ef38c' : '#ff5f5f');
    } else {
      [-1, 1].forEach(function (d) { g.fillStyle = co; g.beginPath(); g.moveTo(cx + d * R * 0.7, cy - R * 0.2); g.lineTo(cx + d * R * 1.65, cy - R * 0.9); g.lineTo(cx + d * R * 1.35, cy + R * 0.3); g.closePath(); g.fill(); trazo(g, borde, 1); });
      [-1, 1].forEach(function (d) { g.fillStyle = '#fff3d6'; g.beginPath(); g.moveTo(cx + d * R * 0.45, cy - R * 0.85); g.lineTo(cx + d * R * 0.7, cy - R * 1.35); g.lineTo(cx + d * R * 0.8, cy - R * 0.75); g.closePath(); g.fill(); trazo(g, borde, 1); });
      pies(); ovalo(g, cx, cy, R, R * 0.98, cuerpo); g.beginPath(); g.ellipse(cx, cy, R, R * 0.98, 0, 0, 6.283); trazo(g, borde, 1.2);
      ovalo(g, cx, cy + R * 0.5, R * 0.55, R * 0.4, '#ffe9b0');
    }
    /* cara chibi: ojos grandes con brillo, cejas de enfado, boca con dientes */
    var gap = R * 0.43, rx = R * 0.25, ry = R * 0.3, ey = fy - R * 0.02;
    [-1, 1].forEach(function (d) {
      var ex = fx + d * gap;
      if (o.dolor) { g.beginPath(); g.moveTo(ex - rx, ey - ry * 0.7); g.lineTo(ex + rx, ey + ry * 0.7); g.moveTo(ex + rx, ey - ry * 0.7); g.lineTo(ex - rx, ey + ry * 0.7); trazo(g, '#111', 2.2); }
      else {
        ovalo(g, ex, ey, rx, ry, '#ffffff'); ovalo(g, ex - rx * 0.25, ey + ry * 0.1, rx * 0.62, ry * 0.72, '#111a2b');
        ovalo(g, ex - rx * 0.5, ey - ry * 0.32, rx * 0.26, rx * 0.26, '#ffffff'); ovalo(g, ex - rx * 0.05, ey + ry * 0.4, rx * 0.12, rx * 0.12, 'rgba(255,255,255,.8)');
        g.beginPath(); g.ellipse(ex, ey, rx, ry, 0, 0, 6.283); trazo(g, 'rgba(20,24,40,.7)', 0.9);
      }
      g.beginPath(); g.moveTo(ex + d * rx * 1.4, ey - ry * 1.6); g.lineTo(ex - d * rx * 1.3, ey - ry * 0.95); trazo(g, '#111', 2.4);
    });
    var my2 = fy + R * 0.5;
    if (o.dolor) { ovalo(g, fx, my2, R * 0.17, R * 0.2, '#3a0f12'); }
    else {
      g.fillStyle = '#3a0f12'; g.beginPath(); g.moveTo(fx - R * 0.42, my2 - R * 0.12); g.quadraticCurveTo(fx, my2 + R * 0.38, fx + R * 0.42, my2 - R * 0.12); g.closePath(); g.fill();
      g.fillStyle = '#fff'; for (i = 0; i < 4; i++) { var tx2 = fx - R * 0.33 + i * R * 0.22; g.beginPath(); g.moveTo(tx2, my2 - R * 0.1); g.lineTo(tx2 + R * 0.1, my2 + R * 0.12 + (i % 2) * 2); g.lineTo(tx2 + R * 0.2, my2 - R * 0.1); g.closePath(); g.fill(); }
    }
    g.restore();
    if (o.jefe) {
      g.fillStyle = lg(g, 0, cy - R * 1.6, 0, cy - R * 1.1, '#ffe27a', '#d9a21b');
      g.beginPath(); g.moveTo(cx - R * 0.55, cy - R * 1.0); g.lineTo(cx - R * 0.6, cy - R * 1.5); g.lineTo(cx - R * 0.25, cy - R * 1.2); g.lineTo(cx, cy - R * 1.6); g.lineTo(cx + R * 0.25, cy - R * 1.2); g.lineTo(cx + R * 0.6, cy - R * 1.5); g.lineTo(cx + R * 0.55, cy - R * 1.0); g.closePath(); g.fill(); trazo(g, 'rgba(120,80,0,.8)', 1);
      ovalo(g, cx, cy - R * 1.2, 2.2, 2.2, '#e60012');
    }
  }

  /* ---------- Muñeco elegible: estilo (píxel / intermedio / chibi) y género (chico / chica) ---------- */
  var PREF = { estilo: 'medio', genero: 'chico' };
  (function () {
    var ini = null; try { ini = localStorage.getItem('aula-estilo'); } catch (e0) { /* sin almacenamiento */ }
    if (ini === 'pixel' || ini === 'medio') PREF.estilo = ini; else if (ini === 'suave') PREF.estilo = 'chibi';
    try {
      var gd = JSON.parse(localStorage.getItem('aula-heroe'));
      if (gd && /^(pixel|medio|chibi)$/.test(gd.estilo)) PREF.estilo = gd.estilo;
      if (gd && /^(chico|chica)$/.test(gd.genero)) PREF.genero = gd.genero;
    } catch (e) { /* sin almacenamiento local */ }
  })();
  var ESCENAS = [], OYENTES = [];
  function ssDe(est) { return est === 'pixel' ? 1 : (est === 'chibi' ? 4 : 2); }
  function claseDe(est) { return 'jg-escena' + (est === 'chibi' ? '' : ' jg-pixel'); }

  /* Muñeco pixel art (12 columnas, mira a la derecha). m = túnica de la asignatura */
  var PIX_CHICO = [
    '...hhhhhh...', '..hhhhhhhh.g', '.hhhhhhhhhhg', '.hhppppppphg', '.hppwkppwkpg', '.ppppppppppg', '..pppprppp.g',
    '..mmmmmmm.yy', '.mmmmmmmmm.p', '.mmbbbbbmmm.', '..mmmmmmmm..', '..mmmmmmmm..', '..nn....nn..', '..nn....nn..', '.oooo..oooo.'];
  var PIX_CHICA = [
    '.rr.hhhhhh..', '.rrhhhhhhh.g', 'hhhhhhhhhhhg', 'hhhppppppphg', 'hhppwkppwkhg', 'hhpppppppphg', 'hhpppprppphg',
    'hhmmmmmmm.yy', 'hhmmmmmmmm.p', '.hmmbbbbmm..', '.mmmmmmmmmm.', 'mmmmmmmmmmmm', '..pp....pp..', '.oooo..oooo.'];
  function heroePixel(g, X, gy, o) {
    var f = o.chica ? PIX_CHICA : PIX_CHICO, px = 4;
    var pal = { h: o.chica ? '#7a3f1c' : '#8a5630', p: o.rojo ? '#ffb4ac' : '#ffe2c4', k: '#1b2230', w: '#ffffff', r: '#d9453b',
      m: o.rojo ? '#e5484d' : o.color, b: '#6b4423', y: '#ffd43b', g: '#e4ecf5', n: '#3a3f66', o: '#5a3a1a' };
    sprite(g, f, Math.round(X - 6 * px), Math.round(gy - f.length * px + (o.quieto ? 0 : o.by)), px, pal);
  }
  /* Intermedio: el dibujo chibi, pero a media resolución y ampliado sin suavizar */
  var OC = null, OCS = 0.6;
  function heroeMedio(g, X, gy, o) {
    if (!OC) { OC = document.createElement('canvas'); OC.width = Math.ceil(80 * OCS); OC.height = Math.ceil(93 * OCS); }
    var oc = OC.getContext('2d');
    oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, OC.width, OC.height); oc.setTransform(OCS, 0, 0, OCS, 0, 0);
    heroeVec(oc, 40, 86, o);
    g.imageSmoothingEnabled = false;
    g.drawImage(OC, 0, 0, OC.width, OC.height, X - 40, gy - 86, OC.width / OCS, OC.height / OCS);
    g.imageSmoothingEnabled = true;
  }
  function monstruoPixel(g, sid, mx, gy, px, color, o) {
    var fr = (MONSTRUOS[sid] || MONSTRUOS.marcas).f;
    var pal = { m: color, d: oscuro(color), w: '#ffffff', k: '#1b2230', y: '#ffd43b', r: '#e5484d' };
    var y = Math.round(gy - fr.length * px + (o.quieto ? 0 : o.by));
    sprite(g, fr, mx, y, px, pal);
    caraMonstruo(g, fr, mx, y, px, o.dolor, o.t);
    if (o.jefe) { rect(g, mx + 2 * px, y - 7, 8 * px, 5, '#ffd43b'); [2, 5, 8].forEach(function (c) { rect(g, mx + c * px, y - 12, px, 6, '#ffd43b'); }); rect(g, mx + 5 * px, y - 5, px, 3, '#e60012'); }
  }
  function ponHeroe(p) {
    if (p && /^(pixel|medio|chibi)$/.test(p.estilo)) PREF.estilo = p.estilo;
    if (p && /^(chico|chica)$/.test(p.genero)) PREF.genero = p.genero;
    try { localStorage.setItem('aula-heroe', JSON.stringify(PREF)); } catch (e) { /* sin almacenamiento local */ }
    ESCENAS = ESCENAS.filter(function (e) { return e.cv.isConnected; });
    ESCENAS.forEach(function (e) { e.redibuja(); });
    OYENTES.forEach(function (f) { f(); });
  }
  function estilosHeroe() {
    if (document.getElementById('jg-heroe-css')) return;
    var st = document.createElement('style'); st.id = 'jg-heroe-css';
    st.textContent = '.jg-heroe{display:flex;flex-wrap:wrap;gap:8px 18px;margin:8px 0}.jg-heroe-fila{display:flex;gap:6px;align-items:center;flex-wrap:wrap}' +
      '.jg-heroe-fila>span{font-weight:700;font-size:.9rem;opacity:.8}.jg-opt{cursor:pointer;border:2px solid #8895aa;background:transparent;color:inherit;border-radius:10px;padding:8px 12px;font:inherit;font-weight:700;min-height:40px}' +
      '.jg-opt.on{background:#e60012;border-color:#fff;color:#fff}';
    document.head.appendChild(st);
  }
  function selectorHeroe() {
    estilosHeroe();
    var host = el('div', { class: 'jg-heroe', role: 'group', 'aria-label': 'Elige tu muñeco' });
    var grupos = [['Estilo', 'estilo', [['pixel', 'Píxel'], ['medio', 'Intermedio'], ['chibi', 'Chibi']]], ['Muñeco', 'genero', [['chico', 'Chico'], ['chica', 'Chica']]]];
    var btns = [];
    grupos.forEach(function (gr) {
      var fila = el('div', { class: 'jg-heroe-fila' }, [el('span', { text: gr[0] })]);
      gr[2].forEach(function (op) {
        var b = el('button', { type: 'button', class: 'jg-opt', text: op[1], onclick: function () { var q = {}; q[gr[1]] = op[0]; ponHeroe(q); } });
        btns.push({ b: b, k: gr[1], v: op[0] }); fila.appendChild(b);
      });
      host.appendChild(fila);
    });
    function pinta() { btns.forEach(function (x) { var on = PREF[x.k] === x.v; x.b.classList.toggle('on', on); x.b.setAttribute('aria-pressed', on ? 'true' : 'false'); }); }
    OYENTES.push(pinta); pinta();
    return host;
  }

  function escena(color, sid, jefe, sinSelector) {
    var W = 320, H = 150, SS = ssDe(PREF.estilo);
    var cv = el('canvas', { class: claseDe(PREF.estilo), width: String(W * SS), height: String(H * SS), role: 'img', 'aria-label': jefe ? 'Combate contra el jefe' : 'Tu héroe frente a ' + (MONSTRUOS[sid] || MONSTRUOS.marcas).n });
    var g = cv.getContext && cv.getContext('2d');
    var tema = TEMAS[sid] || TEMAS.marcas;
    var est = { hx: 0, ex: 0, flash: 0, tiemb: 0, hp: 1, fin: '', t0: Date.now(), proy: null, ps: [], nums: [], entra: jefe ? 60 : 24, golpeH: 0, ultimo: 0 };
    var estrellas = [];
    for (var si = 0; si < 28; si++) estrellas.push({ x: (si * 97) % W, y: (si * 53) % 80, f: si % 5 });
    var hijo = function () { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; };
    function chispas(x, y, n, c) { for (var i = 0; i < n; i++) est.ps.push({ x: x, y: y, vx: (Math.random() - 0.3) * 5, vy: -Math.random() * 4 - 1, v: 18 + Math.random() * 10, c: c }); }
    function dibuja() {
      if (!g) return;
      var t = (Date.now() - est.t0) / 1000, quieto = hijo();
      var estH = PREF.estilo, ssN = ssDe(estH);
      if (ssN !== SS) { SS = ssN; cv.width = W * SS; cv.height = H * SS; }
      if (cv.className !== claseDe(estH)) cv.className = claseDe(estH);
      g.setTransform(SS, 0, 0, SS, 0, 0);
      /* cielo */
      var cielo = g.createLinearGradient(0, 0, 0, H);
      cielo.addColorStop(0, tema.c1); cielo.addColorStop(0.75, tema.c2);
      g.fillStyle = cielo; g.fillRect(0, 0, W, H);
      if (tema.noche) {
        estrellas.forEach(function (s) { var br = quieto || (Math.floor(t * 2) + s.f) % 4 ? '#ffffff' : '#9aa7c7'; brillo(g, s.x, s.y, s.f % 2 ? 2.2 : 1.4, br, 'rgba(255,255,255,0)'); });
        brillo(g, 284, 22, 34, 'rgba(255,247,194,.35)', 'rgba(255,247,194,0)');
        g.save(); g.beginPath(); g.rect(0, 0, W, H); g.arc(290, 19, 9, 0, 6.283); g.clip('evenodd');
        g.fillStyle = '#fff7c2'; g.beginPath(); g.arc(284, 22, 10, 0, 6.283); g.fill(); g.restore();
      } else {
        brillo(g, 283, 23, 46, 'rgba(255,240,150,.7)', 'rgba(255,240,150,0)');
        brillo(g, 283, 23, 12, '#fff6b8', '#ffd43b');
        [[20, 24, 1], [130, 40, 0.8], [215, 18, 1.1]].forEach(function (c) {
          var x = quieto ? c[0] : ((t * 6 + c[0]) % 380) - 40, k = c[2];
          g.fillStyle = 'rgba(255,255,255,.95)'; g.beginPath();
          g.arc(x, c[1] + 10, 9 * k, 0, 6.283); g.arc(x + 12 * k, c[1] + 4, 12 * k, 0, 6.283); g.arc(x + 26 * k, c[1] + 10, 10 * k, 0, 6.283); g.arc(x + 14 * k, c[1] + 12, 12 * k, 0, 6.283); g.fill();
          g.fillStyle = 'rgba(160,190,230,.35)'; g.fillRect(x - 6, c[1] + 17 * k, 44 * k, 3);
        });
      }
      /* parallax: lejos, decorado, medio */
      var off1 = quieto ? 0 : (t * 3) % 80, off2 = quieto ? 0 : (t * 8) % 60;
      g.fillStyle = tema.lejos;
      for (var a = -1; a < 6; a++) { var ax = a * 80 - off1; g.beginPath(); g.moveTo(ax, 114); g.lineTo(ax + 40, 84 - (a % 2) * 8); g.lineTo(ax + 80, 114); g.fill(); g.fillStyle = 'rgba(255,255,255,.14)'; g.beginPath(); g.moveTo(ax + 40, 84 - (a % 2) * 8); g.lineTo(ax + 52, 98 - (a % 2) * 5); g.lineTo(ax + 40, 100); g.fill(); g.fillStyle = tema.lejos; }
      var neb = g.createLinearGradient(0, 80, 0, 118); neb.addColorStop(0, 'rgba(255,255,255,0)'); neb.addColorStop(1, tema.noche ? 'rgba(120,140,220,.22)' : 'rgba(255,255,255,.4)');
      g.fillStyle = neb; g.fillRect(0, 80, W, 38);
      decorado(g, tema, W, t, quieto);
      var lom = g.createLinearGradient(0, 98, 0, 120); lom.addColorStop(0, tema.medio); lom.addColorStop(1, tema.suelo);
      g.fillStyle = lom;
      for (var b = -1; b < 7; b++) { var bx2 = b * 60 - off2; g.beginPath(); g.moveTo(bx2, 120); g.quadraticCurveTo(bx2 + 30, 96, bx2 + 60, 120); g.fill(); }
      /* suelo */
      var gs = g.createLinearGradient(0, 118, 0, 128); gs.addColorStop(0, tema.suelo); gs.addColorStop(1, tema.medio);
      g.fillStyle = gs; g.fillRect(0, 118, W, 9);
      rect(g, 0, 118, W, 2, 'rgba(255,255,255,.45)');
      var tg = g.createLinearGradient(0, 126, 0, H); tg.addColorStop(0, tema.tierra); tg.addColorStop(1, 'rgba(0,0,0,.9)');
      g.fillStyle = tema.tierra; g.fillRect(0, 126, W, 24); g.fillStyle = tg; g.fillRect(0, 126, W, 24);
      var sc = quieto ? 0 : (t * 30) % 32;
      for (var kx = -32; kx < W; kx += 32) {
        [[kx + 1 - sc, 128], [kx + 17 - sc, 139], [kx - 15 - sc, 139]].forEach(function (p) {
          rect(g, p[0], p[1], 30, 9, tema.ladr); rect(g, p[0], p[1], 30, 1.5, 'rgba(255,255,255,.28)'); rect(g, p[0], p[1] + 7.5, 30, 1.5, 'rgba(0,0,0,.3)');
        });
      }
      g.fillStyle = tema.suelo;
      for (var hb = -1; hb < 40; hb++) { var hxp = hb * 9 - ((quieto ? 0 : t * 30) % 9); g.beginPath(); g.moveTo(hxp, 119); g.lineTo(hxp + 2, 114 - (hb % 3)); g.lineTo(hxp + 4, 119); g.fill(); }
      /* personajes */
      var by = quieto ? 0 : Math.sin(t * 3) * 2;
      var entr = Math.max(0, est.entra) * (jefe ? 4 : 3);
      var hx = 40 + est.hx, px = jefe ? 5 : 4, mx = (jefe ? 226 : 232) + est.ex + entr;
      var rojo = est.golpeH > 0, blanco = est.flash > 0, sh = est.tiemb > 0 ? (est.tiemb % 2 ? 3 : -3) : 0;
      var R = jefe ? 31 : 25, mcx = mx + 6 * px + sh;
      sombra(g, hx + 24, 121, 30); sombra(g, mcx, 121, R + 10);
      /* aura del jefe */
      if (jefe && !quieto) { var ra = 8 + Math.sin(t * 4) * 3; brillo(g, mcx, 119 - R, 56 + ra, 'rgba(229,72,77,.38)', 'rgba(229,72,77,0)'); }
      var ho = { color: color, rojo: rojo, win: est.fin === 'win', by: by, t: t, quieto: quieto, chica: PREF.genero === 'chica' };
      var mo = { t: t, dolor: blanco || est.tiemb > 0, jefe: jefe, quieto: quieto, by: by };
      if (estH === 'pixel') { heroePixel(g, hx + 24, 119, ho); monstruoPixel(g, sid, mx + sh, 119, px, blanco ? '#ffffff' : color, mo); }
      else {
        if (estH === 'medio') heroeMedio(g, hx + 24, 119, ho); else heroeVec(g, hx + 24, 119, ho);
        monstruoVec(g, sid, mcx, 119, R, blanco ? '#ffffff' : color, mo);
      }
      g.fillStyle = '#1b2230'; g.font = 'bold 12px monospace'; g.textAlign = 'center';
      g.fillText(EMBLEMA[sid] || '?', mcx, 119 - 2 * R - (jefe ? 22 : 8) - by);
      /* barra de vida con marco */
      var bx = jefe ? 226 : 232; rect(g, bx - 3, 6, 68, 12, '#1b2230'); rect(g, bx - 1, 8, 64, 8, '#4a1f23');
      rect(g, bx - 1, 8, Math.max(0, 64 * est.hp), 8, est.hp > 0.5 ? '#3ddc84' : (est.hp > 0.25 ? '#ffd43b' : '#e5484d')); rect(g, bx - 1, 8, Math.max(0, 64 * est.hp), 2, 'rgba(255,255,255,.5)');
      /* proyectil con estela */
      if (est.proy) { var px0 = est.proy.x; brillo(g, px0 + 6, 94, 26, 'rgba(255,230,120,.6)', 'rgba(255,212,59,0)'); rect(g, px0 - 22, 93, 18, 2, 'rgba(255,212,59,.3)'); rect(g, px0 - 10, 92, 10, 4, 'rgba(255,212,59,.65)'); brillo(g, px0 + 6, 94, 7, '#ffffff', '#ffd43b'); }
      /* partículas */
      est.ps.forEach(function (p) { g.globalAlpha = Math.min(1, p.v / 10); brillo(g, p.x, p.y, 3.5, '#ffffff', p.c); }); g.globalAlpha = 1;
      /* números de daño */
      g.textAlign = 'center'; g.font = 'bold 14px sans-serif';
      est.nums.forEach(function (n) { g.globalAlpha = Math.min(1, n.v / 12); g.fillStyle = '#1b2230'; g.fillText(n.s, n.x + 1, n.y + 1); g.fillStyle = n.c; g.fillText(n.s, n.x, n.y); }); g.globalAlpha = 1;
      var vg = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.38)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      /* final */
      if (est.fin === 'win') { g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(0, 0, W, H); g.font = 'bold 22px sans-serif'; g.fillStyle = '#1b2230'; g.fillText('¡VICTORIA!', W / 2 + 1, 41); g.fillStyle = '#e60012'; g.fillText('¡VICTORIA!', W / 2, 40); }
      if (est.fin === 'lose') { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = 'bold 20px sans-serif'; g.fillText('DERROTA', W / 2, H / 2); }
    }
    ESCENAS.push({ cv: cv, redibuja: function () { dibuja(); } });
    var id = null;
    function bucle() {
      if (!cv.isConnected) { id = null; return; }
      if (est.entra > 0) est.entra--;
      if (est.proy) { est.proy.x += 12; if (est.proy.x > 226) { chispas(236, 92, 14, tema.noche ? '#ffe98a' : '#ff9d2e'); est.nums.push({ x: 250, y: 80, s: est.proy.s || '¡Golpe!', c: '#ffd43b', v: 30 }); est.proy = null; est.flash = 5; est.tiemb = 8; } }
      if (est.flash > 0) est.flash--;
      if (est.tiemb > 0) est.tiemb--;
      if (est.golpeH > 0) est.golpeH--;
      if (est.hx > 0) est.hx = Math.max(0, est.hx - 6);
      if (est.hx < 0) est.hx = Math.min(0, est.hx + 3);
      if (est.ex > 0) est.ex = Math.max(0, est.ex - 4);
      if (est.ex < 0) est.ex = Math.min(0, est.ex + 4);
      est.ps.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.v--; });
      est.ps = est.ps.filter(function (p) { return p.v > 0; });
      est.nums.forEach(function (n) { n.y -= 0.8; n.v--; });
      est.nums = est.nums.filter(function (n) { return n.v > 0; });
      dibuja();
      id = requestAnimationFrame(bucle);
    }
    function arranca() { if (!id && typeof requestAnimationFrame === 'function') id = requestAnimationFrame(bucle); }
    dibuja();
    setTimeout(function () {
      /* el selector de muñeco aparece encima de la escena, en cualquier pantalla del juego */
      var pr = cv.previousElementSibling;
      if (!sinSelector && cv.parentNode && !(pr && pr.classList && pr.classList.contains('jg-heroe'))) cv.parentNode.insertBefore(selectorHeroe(), cv);
      arranca();
    }, 0);
    return {
      el: cv,
      golpea: function (hp) { if (typeof hp === 'number') est.hp = Math.max(0, hp); est.proy = { x: 90 }; est.hx = 14; arranca(); },
      recibe: function () { est.ex = -26; est.hx = -10; est.flash = 0; est.golpeH = 10; chispas(60, 90, 8, '#e5484d'); est.nums.push({ x: 64, y: 70, s: '¡Ay!', c: '#ff6b6b', v: 30 }); arranca(); },
      vida: function (hp) { est.hp = Math.max(0, hp); dibuja(); },
      fin: function (r) { est.fin = r; if (r === 'win') { est.hp = 0; chispas(250, 90, 40, '#ffd43b'); arranca(); } dibuja(); }
    };
  }

  /* ---------- Entrada común ---------- */
  function construye(d, ctx) {
    var f = { orden: orden, parejas: parejas, hueco: hueco, error: error, clasifica: clasifica, escribe: escribe, binario: binario };
    if (d.tipo === 'preguntas') return preguntas(d.data.qs.map(function (q) { return q; }), ctx, {});
    return f[d.tipo](d.data, ctx);
  }
  function limpia() { timers.forEach(function (t) { clearInterval(t); }); timers = []; }

  window.JUEGO = { heroe: { get: function () { return { estilo: PREF.estilo, genero: PREF.genero }; }, set: ponHeroe, selector: selectorHeroe }, enemigo: function (sid) { return (MONSTRUOS[sid] || MONSTRUOS.marcas).n; }, escena: escena, construye: construye, preguntas: preguntas, limpia: limpia, mezcla: mezcla };
})();
