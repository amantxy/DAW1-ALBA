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
  function sprite(ctx, filas, x, y, px, pal) {
    for (var r = 0; r < filas.length; r++) for (var c = 0; c < filas[r].length; c++) {
      var ch = filas[r][c];
      if (ch !== '.' && pal[ch]) { ctx.fillStyle = pal[ch]; ctx.fillRect(Math.round(x + c * px), Math.round(y + r * px), px, px); }
    }
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

  function escena(color, sid, jefe) {
    var W = 320, H = 150;
    var cv = el('canvas', { class: 'jg-escena', width: String(W), height: String(H), role: 'img', 'aria-label': jefe ? 'Combate contra el jefe' : 'Tu héroe frente a ' + (MONSTRUOS[sid] || MONSTRUOS.marcas).n });
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
      /* cielo */
      var cielo = g.createLinearGradient(0, 0, 0, H);
      cielo.addColorStop(0, tema.c1); cielo.addColorStop(0.75, tema.c2);
      g.fillStyle = cielo; g.fillRect(0, 0, W, H);
      if (tema.noche) {
        estrellas.forEach(function (s) { var br = quieto || (Math.floor(t * 2) + s.f) % 4 ? '#ffffff' : '#9aa7c7'; rect(g, s.x, s.y, s.f % 2 ? 2 : 1, s.f % 2 ? 2 : 1, br); });
        rect(g, 276, 14, 16, 16, '#fff7c2'); rect(g, 282, 12, 10, 16, tema.c1);
      } else {
        rect(g, 272, 12, 22, 22, '#ffd43b'); rect(g, 276, 16, 14, 14, '#ffe98a');
        g.fillStyle = 'rgba(255,255,255,.95)';
        [[20, 24], [130, 40], [215, 18]].forEach(function (c) { var x = quieto ? c[0] : ((t * 6 + c[0]) % 380) - 40; rect(g, x, c[1], 44, 12, '#fff'); rect(g, x + 8, c[1] - 8, 24, 10, '#fff'); rect(g, x + 4, c[1] + 12, 36, 4, 'rgba(255,255,255,.6)'); });
      }
      /* parallax: lejos, decorado, medio */
      var off1 = quieto ? 0 : (t * 3) % 80, off2 = quieto ? 0 : (t * 8) % 60;
      g.fillStyle = tema.lejos;
      for (var a = -1; a < 6; a++) { var ax = a * 80 - off1; g.beginPath(); g.moveTo(ax, 112); g.lineTo(ax + 40, 84 - (a % 2) * 8); g.lineTo(ax + 80, 112); g.fill(); }
      decorado(g, tema, W, t, quieto);
      g.fillStyle = tema.medio;
      for (var b = -1; b < 7; b++) { var bx2 = b * 60 - off2; g.beginPath(); g.moveTo(bx2, 118); g.quadraticCurveTo(bx2 + 30, 98, bx2 + 60, 118); g.fill(); }
      /* suelo */
      rect(g, 0, 118, W, 8, tema.suelo); rect(g, 0, 118, W, 2, 'rgba(255,255,255,.35)');
      rect(g, 0, 126, W, 24, tema.tierra);
      var sc = quieto ? 0 : (t * 30) % 32;
      for (var kx = -32; kx < W; kx += 32) { rect(g, kx + 1 - sc, 128, 30, 9, tema.ladr); rect(g, kx + 17 - sc, 139, 30, 9, tema.ladr); rect(g, kx - 15 - sc, 139, 30, 9, tema.ladr); }
      /* personajes */
      var by = quieto ? 0 : Math.sin(t * 3) * 2;
      var entr = Math.max(0, est.entra) * (jefe ? 4 : 3);
      var hx = 40 + est.hx, px = jefe ? 5 : 4, mx = (jefe ? 226 : 232) + est.ex + entr, my = jefe ? 58 : 66;
      /* sombras */
      g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(hx + 2, 119, 44, 4); g.fillRect(mx + 4, 119, 12 * px - 8, 4);
      /* héroe (se pone rojo si lo golpean) */
      var rojo = est.golpeH > 0;
      sprite(g, HEROE, hx, 70 + by, 4, { h: '#4a2c17', s: rojo ? '#ff9a9a' : '#f2c9a0', e: '#111', b: rojo ? '#e5484d' : color, p: '#334155', k: '#111' });
      /* espada brillante */
      rect(g, hx + 46, 84 + by, 3, 14, '#e8eef5'); rect(g, hx + 44, 96 + by, 7, 3, '#ffd43b');
      /* aura del jefe */
      var blanco = est.flash > 0;
      if (jefe && !quieto) { var ra = 8 + Math.sin(t * 4) * 3; g.fillStyle = 'rgba(229,72,77,.18)'; g.beginPath(); g.arc(mx + 6 * px, my + 6 * px, 44 + ra, 0, 6.283); g.fill(); }
      var mon = { m: blanco ? '#ffffff' : color, d: blanco ? '#ffffff' : oscuro(color), w: '#fff', k: '#111', y: '#ffd43b', r: '#e60012' };
      var sh = est.tiemb > 0 ? (est.tiemb % 2 ? 3 : -3) : 0;
      var def = MONSTRUOS[sid] || MONSTRUOS.marcas;
      var squash = quieto ? 0 : Math.sin(t * 4) * 1.5;
      sprite(g, def.f, mx + sh, my - by + squash, px, mon);
      /* parpadeo de ojos */
      if (!quieto && Math.floor(t * 1.7) % 6 === 0 && (t * 1.7) % 1 < 0.15) rect(g, mx + sh + px * 3, my - by + squash + px * 3, px * 6, px, color);
      if (jefe) { rect(g, mx + sh + 12, my - by - 12, 36, 8, '#ffd43b'); rect(g, mx + sh + 12, my - by - 20, 6, 8, '#ffd43b'); rect(g, mx + sh + 28, my - by - 20, 6, 8, '#ffd43b'); rect(g, mx + sh + 42, my - by - 20, 6, 8, '#ffd43b'); }
      g.fillStyle = '#1b2230'; g.font = 'bold 12px monospace'; g.textAlign = 'center';
      g.fillText(EMBLEMA[sid] || '?', mx + 6 * px, my - by - (jefe ? 30 : 8));
      /* barra de vida con marco */
      var bx = jefe ? 226 : 232; rect(g, bx - 3, 6, 68, 12, '#1b2230'); rect(g, bx - 1, 8, 64, 8, '#4a1f23');
      rect(g, bx - 1, 8, Math.max(0, 64 * est.hp), 8, est.hp > 0.5 ? '#3ddc84' : (est.hp > 0.25 ? '#ffd43b' : '#e5484d')); rect(g, bx - 1, 8, Math.max(0, 64 * est.hp), 2, 'rgba(255,255,255,.5)');
      /* proyectil con estela */
      if (est.proy) { var px0 = est.proy.x; rect(g, px0 - 18, 93, 14, 2, 'rgba(255,212,59,.35)'); rect(g, px0 - 8, 92, 8, 4, 'rgba(255,212,59,.7)'); rect(g, px0, 90, 12, 8, '#ffd43b'); rect(g, px0 + 3, 92, 6, 4, '#fff'); }
      /* partículas */
      est.ps.forEach(function (p) { g.globalAlpha = Math.min(1, p.v / 10); rect(g, p.x, p.y, 3, 3, p.c); }); g.globalAlpha = 1;
      /* números de daño */
      g.textAlign = 'center'; g.font = 'bold 14px sans-serif';
      est.nums.forEach(function (n) { g.globalAlpha = Math.min(1, n.v / 12); g.fillStyle = '#1b2230'; g.fillText(n.s, n.x + 1, n.y + 1); g.fillStyle = n.c; g.fillText(n.s, n.x, n.y); }); g.globalAlpha = 1;
      /* final */
      if (est.fin === 'win') { g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(0, 0, W, H); g.font = 'bold 22px sans-serif'; g.fillStyle = '#1b2230'; g.fillText('¡VICTORIA!', W / 2 + 1, 41); g.fillStyle = '#e60012'; g.fillText('¡VICTORIA!', W / 2, 40); }
      if (est.fin === 'lose') { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = 'bold 20px sans-serif'; g.fillText('DERROTA', W / 2, H / 2); }
    }
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
    setTimeout(arranca, 0);
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

  window.JUEGO = { enemigo: function (sid) { return (MONSTRUOS[sid] || MONSTRUOS.marcas).n; }, escena: escena, construye: construye, preguntas: preguntas, limpia: limpia, mezcla: mezcla };
})();
