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
      if (q.code) caja.appendChild(bloqueCodigo(q.code));
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
    '....hhhh....', '...hhhhhh...', '...hsssss...', '...sesses...', '...ssssss...', '....bbbb....', '..bbbbbbbb..', '..sbbbbbbs..',
    '..sbbbbbbs..', '....pppp....', '....p..p....', '...kk..kk...'];
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
    ingles: { n: 'Dragoncito Gramatical', f: [
      '.m........m.', '.mm......mm.', '..mmmmmmmm..', '.mmwwmmwwmm.', '.mmwkmmwkmm.', '.mmmmmmmmmm.',
      '.mmmkrrkmmm.', '.dmmmmmmmmd.', 'dmmmmmmmmmmd', '.mmmmmmmmmm.', '.mm..mm..mm.', '.dd..dd..dd.'] }
  };
  function oscuro(hex) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function f(x) { x = Math.round(x * 0.65); return (x < 16 ? '0' : '') + x.toString(16); }
    return '#' + f(r) + f(g) + f(b);
  }
  var EMBLEMA = { marcas: '</>', prog: '{ }', entornos: 'bug', sistemas: '0101', bd: 'DB', tsp: '€', ingles: 'Aa' };
  function sprite(ctx, filas, x, y, px, pal) {
    for (var r = 0; r < filas.length; r++) for (var c = 0; c < filas[r].length; c++) {
      var ch = filas[r][c];
      if (ch !== '.' && pal[ch]) { ctx.fillStyle = pal[ch]; ctx.fillRect(Math.round(x + c * px), Math.round(y + r * px), px, px); }
    }
  }
  function escena(color, sid, jefe) {
    var W = 320, H = 150;
    var cv = el('canvas', { class: 'jg-escena', width: String(W), height: String(H), role: 'img', 'aria-label': jefe ? 'Combate contra el jefe' : 'Tu héroe frente a un monstruo' });
    var g = cv.getContext && cv.getContext('2d');
    var est = { hx: 0, ex: 0, flash: 0, tiemb: 0, hp: 1, fin: '', t0: Date.now(), ataque: 0, proy: null };
    var hijo = function () { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; };
    function dibuja() {
      if (!g) return;
      var t = (Date.now() - est.t0) / 1000, quieto = hijo();
      var cielo = g.createLinearGradient(0, 0, 0, H);
      cielo.addColorStop(0, '#5ec8ff'); cielo.addColorStop(1, '#d6f1ff');
      g.fillStyle = cielo; g.fillRect(0, 0, W, H);
      /* sol y nubes */
      g.fillStyle = '#ffd43b'; g.fillRect(272, 12, 22, 22); g.fillStyle = '#ffe98a'; g.fillRect(276, 16, 14, 14);
      g.fillStyle = '#fff';
      [[20, 24], [130, 40], [215, 18]].forEach(function (c) { var dx = quieto ? 0 : ((t * 6 + c[0]) % 360) - 20 - c[0]; var x = c[0] + dx; g.fillRect(x, c[1], 44, 12); g.fillRect(x + 8, c[1] - 8, 26, 10); g.fillRect(x + 4, c[1] + 12, 36, 4); });
      /* colinas */
      g.fillStyle = '#7ddc7a'; g.fillRect(0, 104, W, 14); g.fillRect(40, 98, 70, 6); g.fillRect(190, 96, 90, 8);
      /* suelo de césped y ladrillos */
      g.fillStyle = '#35b34a'; g.fillRect(0, 118, W, 8);
      g.fillStyle = '#8a4b1f'; g.fillRect(0, 126, W, 24);
      g.fillStyle = '#b8692d';
      for (var kx = 0; kx < W; kx += 32) { g.fillRect(kx + 1, 128, 30, 9); g.fillRect(kx + 17, 139, 30, 9); g.fillRect(kx - 15, 139, 30, 9); }
      var by = quieto ? 0 : Math.sin(t * 3) * 2;
      var hx = 40 + est.hx, ex = 232 + est.ex;
      sprite(g, HEROE, hx, 70 + by, 4, { h: '#4a2c17', s: '#f2c9a0', e: '#111', b: color, p: '#334155', k: '#111' });
      var blanco = est.flash > 0;
      var mon = { m: blanco ? '#ffffff' : color, d: blanco ? '#ffffff' : oscuro(color), w: '#fff', k: '#111', y: '#ffd43b', r: '#e60012' };
      var sh = est.tiemb > 0 ? (est.tiemb % 2 ? 3 : -3) : 0;
      var px = jefe ? 5 : 4, mx = jefe ? 226 : 232, my = jefe ? 58 : 66;
      var def = MONSTRUOS[sid] || MONSTRUOS.marcas;
      sprite(g, def.f, mx + est.ex + sh, my - by, px, mon);
      if (jefe) { g.fillStyle = '#ffd43b'; g.fillRect(mx + est.ex + sh + 12, my - by - 12, 36, 8); g.fillRect(mx + est.ex + sh + 12, my - by - 20, 6, 8); g.fillRect(mx + est.ex + sh + 27, my - by - 24, 6, 12); g.fillRect(mx + est.ex + sh + 42, my - by - 20, 6, 8); }
      g.fillStyle = '#1b2230'; g.font = 'bold 12px monospace'; g.textAlign = 'center';
      g.fillText(EMBLEMA[sid] || '?', mx + est.ex + 6 * px, my - by - (jefe ? 30 : 8));
      /* barra de vida del monstruo */
      var bx = jefe ? 226 : 232; g.fillStyle = '#1b2230'; g.fillRect(bx - 2, 8, 64, 8);
      g.fillStyle = '#e5484d'; g.fillRect(bx - 1, 9, Math.max(0, 62 * est.hp), 6);
      if (est.proy) { g.fillStyle = '#ffd43b'; g.fillRect(est.proy.x, 92, 10, 4); g.fillRect(est.proy.x - 6, 93, 4, 2); }
      if (est.fin === 'win') { g.fillStyle = '#e60012'; g.font = 'bold 20px sans-serif'; g.fillText('¡VICTORIA!', W / 2, 34); }
      if (est.fin === 'lose') { g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = 'bold 18px sans-serif'; g.fillText('DERROTA', W / 2, 78); }
    }
    var id = null;
    function bucle() {
      if (!cv.isConnected) { id = null; return; }
      if (est.proy) { est.proy.x += 12; if (est.proy.x > 226) { est.proy = null; est.flash = 5; est.tiemb = 8; } }
      if (est.flash > 0) est.flash--;
      if (est.tiemb > 0) est.tiemb--;
      if (est.hx > 0) est.hx = Math.max(0, est.hx - 6);
      if (est.hx < 0) est.hx = Math.min(0, est.hx + 3);
      if (est.ex > 0) est.ex = Math.max(0, est.ex - 4);
      dibuja();
      id = requestAnimationFrame(bucle);
    }
    function arranca() { if (!id && typeof requestAnimationFrame === 'function') id = requestAnimationFrame(bucle); }
    dibuja();
    setTimeout(arranca, 0);
    return {
      el: cv,
      golpea: function (hp) { if (typeof hp === 'number') est.hp = Math.max(0, hp); est.proy = { x: 90 }; est.hx = 14; arranca(); },
      recibe: function () { est.ex = -26; est.hx = -10; est.flash = 0; arranca(); },
      vida: function (hp) { est.hp = Math.max(0, hp); dibuja(); },
      fin: function (r) { est.fin = r; if (r === 'win') est.hp = 0; dibuja(); }
    };
  }

  /* ---------- Entrada común ---------- */
  function construye(d, ctx) {
    var f = { orden: orden, parejas: parejas, hueco: hueco, error: error, clasifica: clasifica, escribe: escribe, binario: binario };
    if (d.tipo === 'preguntas') return preguntas(d.data.qs.map(function (q) { return q; }), ctx, {});
    return f[d.tipo](d.data, ctx);
  }
  function limpia() { timers.forEach(function (t) { clearInterval(t); }); timers = []; }

  window.JUEGO = { enemigo: function (sid) { return (MONSTRUOS[sid] || MONSTRUOS.marcas).n; }, escena: escena, construye: construye, preguntas: preguntas, limpia: limpia, mezcla: mezcla };
})();
