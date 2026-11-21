(function () {
  var DATA = window.DATA;
  /* Progreso guardado en localStorage con el prefijo "aula:".
     progreso.js (el de toda la web) sincroniza las claves "aula:*" con tu cuenta.
       aula:<asignatura>-<n>   = 1        lección completada
       aula:q:<asignatura>-<n> = [0,2]    preguntas del test acertadas alguna vez
       aula:resp               = {fecha: nº de respuestas ese día}
     El modo gaming no guarda nada propio: XP, nivel, racha y logros se calculan con estos datos.
     Solo la preferencia "modo gaming activado" se guarda en este dispositivo (aula-modo). */
  var PREFIJO = 'aula:';
  var progress = {}, scores = {}, resp = {};
  function leeJSON(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function leeProgreso() {
    progress = {}; scores = {}; resp = {};
    try {
      var viejo = localStorage.getItem('aula-daw1-progreso'); /* versión anterior: se migra una vez */
      if (viejo) {
        var o = JSON.parse(viejo) || {};
        Object.keys(o).forEach(function (k) { if (o[k]) localStorage.setItem(PREFIJO + k, '1'); });
        localStorage.removeItem('aula-daw1-progreso');
      }
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k.indexOf(PREFIJO) !== 0 || !localStorage.getItem(k)) continue;
        var nombre = k.slice(PREFIJO.length);
        if (nombre.indexOf('q:') === 0) { var a = leeJSON(k); if (Array.isArray(a)) scores[nombre.slice(2)] = a; }
        else if (nombre === 'resp') { var r = leeJSON(k); if (r && typeof r === 'object') resp = r; }
        else progress[nombre] = 1;
      }
    } catch (e) { /* sin almacenamiento: el progreso dura solo mientras la página está abierta */ }
  }
  function guarda(k, valor) { try { localStorage.setItem(PREFIJO + k, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ } }
  function setDone(k, on) {
    if (on) progress[k] = 1; else delete progress[k];
    try { if (on) localStorage.setItem(PREFIJO + k, '1'); else localStorage.removeItem(PREFIJO + k); } catch (e) { /* sin almacenamiento */ }
  }
  leeProgreso();
  function key(sid, i) { return sid + '-' + (i + 1); }
  function doneCount(s) { var n = 0; s.lessons.forEach(function (_, i) { if (progress[key(s.id, i)]) n++; }); return n; }

  var $ = function (id) { return document.getElementById(id); };
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function colorVar(s) { return 'var(--c-' + s.color + ')'; }

  /* ---------- Modo gaming: XP, niveles, racha, misión y logros ---------- */
  var gaming = false;
  try { gaming = localStorage.getItem('aula-modo') === '1'; } catch (e) { gaming = false; }
  document.body.classList.toggle('gaming', gaming);

  var NIVELES = [
    { xp: 0, n: 'Novato' }, { xp: 100, n: 'Aprendiz' }, { xp: 300, n: 'Junior' }, { xp: 600, n: 'Programador' },
    { xp: 1000, n: 'Dev' }, { xp: 1500, n: 'Senior' }, { xp: 2100, n: 'Arquitecto' }, { xp: 2700, n: 'Leyenda' }
  ];
  var XP_ACIERTO = 10, XP_PERFECTA = 50, XP_MISION = 20, META_DIA = 5;
  var COLORES = ['#0b7a6f', '#c2531b', '#6b4ce0', '#2563c9', '#23813f', '#c23b72', '#a4660f'];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fechaDe(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function hoy() { return fechaDe(new Date()); }
  function diaAnterior(f) { var p = f.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() - 1); return fechaDe(d); }

  function aciertos(sid, i, total) {
    var a = scores[key(sid, i)] || [], vistos = {}, n = 0;
    a.forEach(function (q) { if (typeof q === 'number' && q >= 0 && q < total && !vistos[q]) { vistos[q] = 1; n++; } });
    return n;
  }

  function stats() {
    var correctas = 0, perfectas = 0, completadas = 0;
    var porAsig = {};
    DATA.forEach(function (s) {
      var perf = 0;
      s.lessons.forEach(function (l, i) {
        var n = aciertos(s.id, i, l.quiz.length);
        correctas += n;
        if (n === l.quiz.length) { perfectas++; perf++; }
        if (progress[key(s.id, i)]) completadas++;
      });
      porAsig[s.id] = doneCount(s) === s.lessons.length;
    });
    var dias = Object.keys(resp).filter(function (d) { return resp[d] > 0; }).sort();
    var misiones = dias.filter(function (d) { return resp[d] >= META_DIA; }).length;
    var xp = correctas * XP_ACIERTO + perfectas * XP_PERFECTA + misiones * XP_MISION;
    var nivel = 0;
    NIVELES.forEach(function (n, i) { if (xp >= n.xp) nivel = i; });
    var siguiente = NIVELES[nivel + 1] || null;
    /* racha actual: días seguidos hasta hoy (o hasta ayer, si hoy aún no has respondido) */
    var set = {}; dias.forEach(function (d) { set[d] = 1; });
    var f = set[hoy()] ? hoy() : diaAnterior(hoy()), racha = 0;
    while (set[f]) { racha++; f = diaAnterior(f); }
    /* mejor racha */
    var mejor = 0, cur = 0, prev = null;
    dias.forEach(function (d) { cur = prev && diaAnterior(d) === prev ? cur + 1 : 1; if (cur > mejor) mejor = cur; prev = d; });
    var s0 = { correctas: correctas, perfectas: perfectas, completadas: completadas, misiones: misiones, xp: xp, nivel: nivel, siguiente: siguiente, racha: racha, mejor: mejor, hoy: resp[hoy()] || 0, porAsig: porAsig };
    s0.logros = logros(s0);
    return s0;
  }

  function logros(st) {
    var l = [
      { id: 'primero', t: 'Primer paso', d: 'Completa tu primera lección', ok: st.completadas >= 1, c: '#2563c9' },
      { id: 'diez', t: 'Maratón', d: 'Completa 10 lecciones', ok: st.completadas >= 10, c: '#6b4ce0' },
      { id: 'perfectas', t: 'Perfeccionista', d: '5 tests con todas las respuestas acertadas', ok: st.perfectas >= 5, c: '#c2531b' },
      { id: 'racha', t: 'Constante', d: 'Estudia 3 días seguidos', ok: st.mejor >= 3, c: '#c23b72' },
      { id: 'mision', t: 'Misión cumplida', d: 'Responde ' + META_DIA + ' preguntas en un día', ok: st.misiones >= 1, c: '#23813f' }
    ];
    DATA.forEach(function (s, i) { l.push({ id: 'asig-' + s.id, t: s.name, d: 'Completa todas sus lecciones', ok: !!st.porAsig[s.id], c: COLORES[i % COLORES.length] }); });
    var todo = DATA.every(function (s) { return st.porAsig[s.id]; });
    l.push({ id: 'todo', t: 'Leyenda de DAW 1', d: 'Completa todas las asignaturas', ok: todo, c: '#a4660f' });
    return l;
  }

  function setGaming(on) {
    gaming = on;
    try { localStorage.setItem('aula-modo', on ? '1' : '0'); } catch (e) { /* solo en esta sesión */ }
    document.body.classList.toggle('gaming', on);
    renderHud();
    if (parseRoute().home) render(); else buildNav($('search').value);
  }

  function renderHud() {
    var hud = $('hud');
    if (!gaming) { hud.hidden = true; hud.innerHTML = ''; return; }
    var st = stats(), n = NIVELES[st.nivel];
    var base = n.xp, tope = st.siguiente ? st.siguiente.xp : n.xp;
    var pct = st.siguiente ? Math.round(100 * (st.xp - base) / (tope - base)) : 100;
    hud.hidden = false;
    hud.innerHTML = '';
    hud.appendChild(el('div', { class: 'hud-nivel' }, [el('b', { text: 'Nv ' + (st.nivel + 1) }), el('span', { text: n.n })]));
    hud.appendChild(el('div', { class: 'hud-xp', role: 'img', 'aria-label': st.xp + ' puntos de experiencia' + (st.siguiente ? ', faltan ' + (tope - st.xp) + ' para el nivel ' + (st.nivel + 2) : ', nivel máximo') }, [
      el('div', { class: 'xpbar' }, [el('i', { style: 'width:' + pct + '%' })]),
      el('small', { text: st.xp + ' XP' + (st.siguiente ? ' · faltan ' + (tope - st.xp) + ' para ' + st.siguiente.n : ' · nivel máximo') })
    ]));
    hud.appendChild(el('div', { class: 'hud-dato' }, [el('b', { text: st.racha + (st.racha === 1 ? ' día' : ' días') }), el('span', { text: 'Racha' })]));
    var m = Math.min(st.hoy, META_DIA);
    hud.appendChild(el('div', { class: 'hud-dato' }, [el('b', { text: m + '/' + META_DIA }), el('span', { text: m >= META_DIA ? 'Misión cumplida' : 'Misión del día' })]));
  }

  function toast(msg) {
    var box = $('toasts');
    var t = el('div', { class: 'toast', text: msg });
    box.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3600);
  }

  function reducido() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }

  function confeti() {
    if (reducido()) return;
    try {
      var cv = el('canvas', { class: 'confeti', 'aria-hidden': 'true' });
      cv.width = window.innerWidth; cv.height = window.innerHeight;
      var ctx = cv.getContext && cv.getContext('2d');
      if (!ctx) return;
      document.body.appendChild(cv);
      var ps = [], i;
      for (i = 0; i < 90; i++) ps.push({ x: cv.width / 2 + (Math.random() - 0.5) * 120, y: cv.height * 0.35, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 9 - 2, r: 4 + Math.random() * 5, c: COLORES[i % COLORES.length], g: 0.25 + Math.random() * 0.1 });
      var t0 = null;
      (function paso(t) {
        if (t0 === null) t0 = t;
        var dt = t - t0;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ps.forEach(function (p) { p.vy += p.g; p.x += p.vx; p.y += p.vy; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.r, p.r * 0.6); });
        if (dt < 1800) requestAnimationFrame(paso); else if (cv.parentNode) cv.parentNode.removeChild(cv);
      })(0);
    } catch (e) { /* sin animación */ }
  }

  /* Registra una respuesta. Siempre guarda (así, al activar el modo gaming, ya tienes tu progreso). */
  function registra(sid, idx, qi, acierto, ancla, total) {
    var antes = stats();
    var d = hoy();
    resp[d] = (resp[d] || 0) + 1;
    guarda('resp', resp);
    var k = key(sid, idx);
    if (acierto) {
      var a = scores[k] || [];
      if (a.indexOf(qi) === -1) { a = a.concat([qi]); scores[k] = a; guarda('q:' + k, a); }
    }
    if (aciertos(sid, idx, total) === total && !progress[k]) { setDone(k, true); buildNav($('search').value); refreshDone(); }
    var despues = stats();
    if (!gaming) return;
    var ganado = despues.xp - antes.xp;
    if (ganado > 0 && ancla) {
      var pop = el('span', { class: 'xp-pop', text: '+' + ganado + ' XP', 'aria-hidden': 'true' });
      ancla.appendChild(pop);
      setTimeout(function () { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 1400);
    }
    if (despues.perfectas > antes.perfectas) { toast('Test perfecto: +' + XP_PERFECTA + ' XP'); confeti(); }
    if (despues.misiones > antes.misiones) toast('Misión del día cumplida: +' + XP_MISION + ' XP');
    despues.logros.forEach(function (lg, i) { if (lg.ok && !antes.logros[i].ok) { toast('Logro desbloqueado: ' + lg.t); confeti(); } });
    if (despues.nivel > antes.nivel) { toast('¡Subes al nivel ' + (despues.nivel + 1) + ': ' + NIVELES[despues.nivel].n + '!'); confeti(); }
    renderHud();
  }

  /* ---------- Menú lateral ---------- */
  function buildNav(filter) {
    var nav = $('nav');
    nav.innerHTML = '';
    var q = (filter || '').trim().toLowerCase();
    var route = parseRoute();
    nav.appendChild(el('a', { href: '#inicio', class: 'nav-home' + (route.home ? ' on' : ''), text: 'Inicio' }));
    nav.appendChild(el('button', { type: 'button', class: 'nav-game', 'aria-pressed': gaming ? 'true' : 'false', text: 'Modo gaming: ' + (gaming ? 'activado' : 'desactivado'), onclick: function () { setGaming(!gaming); } }));
    DATA.forEach(function (s) {
      var items = [];
      s.lessons.forEach(function (l, i) {
        if (!q || l.t.toLowerCase().indexOf(q) !== -1 || s.name.toLowerCase().indexOf(q) !== -1) items.push(i);
      });
      if (!items.length) return;
      var d = el('details', { class: 'nav-sub' });
      d.style.setProperty('--c', colorVar(s));
      if (q || (route.s && route.s.id === s.id)) d.open = true;
      d.appendChild(el('summary', null, [
        el('span', { class: 'dot' }),
        el('span', { text: s.name }),
        el('span', { class: 'count', text: (gaming && doneCount(s) === s.lessons.length ? '★ ' : '') + doneCount(s) + '/' + s.lessons.length })
      ]));
      var ul = el('ul', { class: 'nav-lessons' });
      items.forEach(function (i) {
        var on = route.s && route.s.id === s.id && route.i === i;
        var a = el('a', { href: '#' + key(s.id, i), class: on ? 'on' : '' }, [
          el('span', { text: (i + 1) + '. ' + s.lessons[i].t }),
          progress[key(s.id, i)] ? el('span', { class: 'tick', text: '✓', 'aria-label': 'completada' }) : null
        ]);
        ul.appendChild(el('li', null, [a]));
      });
      d.appendChild(ul);
      nav.appendChild(d);
    });
    if (q && !nav.querySelector('.nav-sub')) nav.appendChild(el('p', { class: 'note', text: 'No hay lecciones con ese nombre.' }));
  }

  /* ---------- Rutas ---------- */
  function parseRoute() {
    var h = (location.hash || '#inicio').slice(1);
    var m = /^([a-z]+)-(\d+)$/.exec(h);
    if (m) {
      var s = DATA.filter(function (x) { return x.id === m[1]; })[0];
      var i = parseInt(m[2], 10) - 1;
      if (s && s.lessons[i]) return { s: s, i: i };
    }
    return { home: true };
  }

  /* ---------- Inicio ---------- */
  function aventura() {
    var st = stats();
    var wrap = el('section', { class: 'aventura', 'aria-label': 'Tu aventura' });
    wrap.appendChild(el('h2', { text: 'Tu aventura' }));
    wrap.appendChild(el('p', { class: 'muted', text: 'Cada respuesta acertada da ' + XP_ACIERTO + ' XP, un test perfecto ' + XP_PERFECTA + ' más y la misión del día (' + META_DIA + ' respuestas) ' + XP_MISION + '. Estudia días seguidos para mantener la racha.' }));
    var grid = el('div', { class: 'badges' });
    st.logros.forEach(function (lg) {
      var b = el('div', { class: 'badge' + (lg.ok ? '' : ' off') }, [
        el('span', { class: 'medal', text: lg.ok ? '★' : '·', style: 'background:' + lg.c, 'aria-hidden': 'true' }),
        el('div', null, [el('b', { text: lg.t }), el('small', { text: lg.ok ? 'Conseguido' : lg.d })])
      ]);
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderHome(main) {
    var total = 0, done = 0;
    DATA.forEach(function (s) { total += s.lessons.length; done += doneCount(s); });
    main.appendChild(el('section', { class: 'hero' }, [
      el('h1', { text: 'Aula DAW 1' }),
      el('p', { text: 'Aprende desde cero lo que ves en clase, paso a paso: teoría corta, ejemplos, un editor para probar el código y un test al final de cada lección.' }),
      el('p', { class: 'note', text: 'El contenido es una base general escrita para empezar. Si tu profesorado explica algo distinto, manda su material y se ajusta. Llevas ' + done + ' de ' + total + ' lecciones completadas.' }),
      el('button', { type: 'button', class: 'btn primary gamebtn', 'aria-pressed': gaming ? 'true' : 'false', text: gaming ? 'Desactivar modo gaming' : 'Activar modo gaming', onclick: function () { setGaming(!gaming); } }),
      gaming ? null : el('p', { class: 'muted', text: 'Gana XP, sube de nivel, mantén tu racha y consigue logros mientras estudias.' })
    ]));
    if (gaming) main.appendChild(aventura());
    var cards = el('div', { class: 'cards' });
    DATA.forEach(function (s) {
      var n = doneCount(s);
      var c = el('a', { class: 'card', href: '#' + key(s.id, 0) }, [
        el('h2', { text: s.name }),
        el('p', { text: s.intro }),
        el('div', { class: 'bar' }, [el('i', { style: 'width:' + Math.round(100 * n / s.lessons.length) + '%' })]),
        el('small', { text: (gaming && n === s.lessons.length ? '★ ' : '') + n + ' de ' + s.lessons.length + ' lecciones' })
      ]);
      c.style.setProperty('--c', colorVar(s));
      cards.appendChild(c);
    });
    main.appendChild(cards);
    document.title = 'Aula DAW 1';
  }

  /* ---------- Lección ---------- */
  function codeBox(text) {
    var pre = el('pre');
    pre.textContent = text;
    var btn = el('button', { class: 'copy', type: 'button', text: 'Copiar' });
    btn.addEventListener('click', function () {
      try {
        navigator.clipboard.writeText(text).then(function () { btn.textContent = 'Copiado'; setTimeout(function () { btn.textContent = 'Copiar'; }, 1500); }, function () { btn.textContent = 'No se pudo'; });
      } catch (e) { btn.textContent = 'No se pudo'; }
    });
    return el('div', { class: 'codebox' }, [pre, btn]);
  }

  function xmlTree(node, depth, lines) {
    var pad2 = new Array(depth + 1).join('  ');
    if (node.nodeType === 1) {
      var attrs = '';
      for (var k = 0; k < node.attributes.length; k++) attrs += ' ' + node.attributes[k].name + '="' + node.attributes[k].value + '"';
      var kids = [].slice.call(node.childNodes).filter(function (c) { return c.nodeType === 1 || (c.nodeType === 3 && c.nodeValue.trim()); });
      if (kids.length === 1 && kids[0].nodeType === 3) { lines.push(pad2 + '▸ ' + node.nodeName + attrs + ': ' + kids[0].nodeValue.trim()); return; }
      lines.push(pad2 + '▸ ' + node.nodeName + attrs);
      kids.forEach(function (c) { if (c.nodeType === 1) xmlTree(c, depth + 1, lines); });
    }
  }

  function tryBox(kind, initial) {
    var ta = el('textarea', { spellcheck: 'false', 'aria-label': 'Editor de código' });
    ta.value = initial || (kind === 'html' ? '<h1>Hola</h1>\n<p>Escribe aquí tu HTML.</p>' : '<raiz>\n  <dato>valor</dato>\n</raiz>');
    var out = el('div', { class: 'out' });
    function run() {
      out.innerHTML = '';
      if (kind === 'html') {
        var f = el('iframe', { sandbox: '', title: 'Resultado' });
        f.srcdoc = ta.value;
        out.appendChild(f);
      } else {
        var doc = new DOMParser().parseFromString(ta.value, 'application/xml');
        var pe = doc.getElementsByTagName('parsererror')[0];
        if (pe) {
          out.appendChild(el('div', { class: 'xml-out err', text: '✗ Documento mal formado.\n\n' + pe.textContent.replace(/\s+/g, ' ').trim().slice(0, 300) + '\n\nRevisa que cada etiqueta se cierre y que estén bien anidadas.' }));
        } else {
          var lines = [];
          xmlTree(doc.documentElement, 0, lines);
          out.appendChild(el('div', { class: 'xml-out good', text: '✓ Documento bien formado.\n\nEstructura:\n' + lines.join('\n') }));
        }
      }
    }
    var bar = el('div', { class: 'try-bar' }, [
      el('button', { class: 'btn primary', type: 'button', text: kind === 'html' ? 'Ejecutar' : 'Comprobar', onclick: run }),
      el('button', { class: 'btn', type: 'button', text: 'Restaurar ejemplo', onclick: function () { ta.value = initial || ''; run(); } })
    ]);
    var box = el('div', { class: 'try' }, [el('div', { class: 'try-grid' }, [ta, out]), bar]);
    run();
    return box;
  }

  function binWidget() {
    var dec = el('input', { id: 'bin-dec', type: 'number', min: '0', max: '65535', value: '11', inputmode: 'numeric' });
    var bin = el('input', { id: 'bin-bin', type: 'text', value: '1011', inputmode: 'numeric', maxlength: '16' });
    var hex = el('input', { id: 'bin-hex', type: 'text', readonly: 'readonly', value: 'B' });
    function fromDec() {
      var n = parseInt(dec.value, 10);
      if (isNaN(n) || n < 0) { bin.value = ''; hex.value = ''; return; }
      bin.value = n.toString(2); hex.value = n.toString(16).toUpperCase();
    }
    function fromBin() {
      var v = bin.value.replace(/[^01]/g, '');
      if (v !== bin.value) bin.value = v;
      if (!v) { dec.value = ''; hex.value = ''; return; }
      var n = parseInt(v, 2); dec.value = n; hex.value = n.toString(16).toUpperCase();
    }
    dec.addEventListener('input', fromDec);
    bin.addEventListener('input', fromBin);
    return el('div', { class: 'bin' }, [
      el('div', null, [el('label', { for: 'bin-dec', text: 'Decimal' }), dec]),
      el('div', null, [el('label', { for: 'bin-bin', text: 'Binario' }), bin]),
      el('div', null, [el('label', { for: 'bin-hex', text: 'Hexadecimal' }), hex]),
      el('p', { class: 'hint', text: 'Cambia el decimal o el binario y se actualiza el resto. Prueba con 5, 8, 13 y 255.' })
    ]);
  }

  function quizBox(l, sid, idx) {
    var host = el('div');
    function monta() {
      host.innerHTML = '';
      var answered = 0, correct = 0, total = l.quiz.length;
      var score = el('div', { class: 'score', hidden: 'hidden' });
      l.quiz.forEach(function (q, qi) {
        var box = el('div', { class: 'q' });
        box.appendChild(el('h3', { text: (qi + 1) + '. ' + q.q }));
        var opts = el('div', { class: 'opts' });
        var expl = el('p', { class: 'expl', hidden: 'hidden' });
        var btns = q.o.map(function (txt, oi) {
          var b = el('button', { class: 'opt', type: 'button', text: txt });
          b.addEventListener('click', function () {
            btns.forEach(function (x, xi) {
              x.disabled = true;
              if (xi === q.a) x.classList.add('right');
            });
            if (oi === q.a) correct++; else b.classList.add('wrong');
            expl.hidden = false;
            expl.textContent = (oi === q.a ? '¡Correcto! ' : 'No exacto. ') + (q.e || '');
            answered++;
            registra(sid, idx, qi, oi === q.a, box, total);
            if (answered === total) {
              score.hidden = false;
              score.textContent = '';
              score.appendChild(el('span', { text: 'Resultado: ' + correct + ' de ' + total + (correct === total ? '. ¡Lección dominada!' : '. Repasa la teoría y vuelve a intentarlo. ') }));
              if (correct !== total) score.appendChild(el('button', { class: 'btn', type: 'button', text: 'Repetir test', onclick: monta }));
            }
          });
          return b;
        });
        btns.forEach(function (b) { opts.appendChild(b); });
        box.appendChild(opts); box.appendChild(expl);
        host.appendChild(box);
      });
      host.appendChild(score);
    }
    monta();
    return host;
  }

  var doneBtn = null;
  function refreshDone() {
    if (!doneBtn) return;
    var r = parseRoute();
    if (!r.s) return;
    doneBtn.textContent = progress[key(r.s.id, r.i)] ? '✓ Completada (pulsa para desmarcar)' : 'Marcar como completada';
  }

  function renderLesson(main, s, i) {
    var l = s.lessons[i];
    var wrap = el('article', { class: 'lesson' });
    wrap.style.setProperty('--c', colorVar(s));
    wrap.appendChild(el('div', { class: 'crumbs' }, [el('a', { href: '#inicio', text: 'Inicio' }), document.createTextNode(' / ' + s.name)]));
    wrap.appendChild(el('span', { class: 'chip', text: s.name + ' · lección ' + (i + 1) + ' de ' + s.lessons.length }));
    wrap.appendChild(el('h1', { text: l.t }));
    wrap.appendChild(el('div', { class: 'theory', html: l.h }));
    if (l.widget === 'bin') { wrap.appendChild(el('h2', { text: 'Conversor' })); wrap.appendChild(binWidget()); }
    if (l.code) {
      wrap.appendChild(el('h2', { text: l.try ? 'Ejemplo y editor' : 'Ejemplo' }));
      if (l.try) wrap.appendChild(tryBox(l.try, l.code));
      else {
        wrap.appendChild(codeBox(l.code));
        var donde = s.id === 'prog' ? 'tu IDE de Java' : s.id === 'sistemas' ? 'una terminal de Linux' : (s.id === 'bd' && /SQL/.test(l.t)) ? 'un gestor de bases de datos' : (s.id === 'entornos' && /Algoritmos/.test(l.t)) ? 'PSeInt' : (s.id === 'entornos' && /Java/.test(l.t)) ? 'tu IDE de Java' : null;
        if (donde) wrap.appendChild(el('p', { class: 'note', text: 'Este código no se ejecuta en la web. Cópialo y pruébalo en ' + donde + '.' }));
      }
    }
    if (l.ref) wrap.appendChild(el('p', { class: 'note' }, [document.createTextNode('Teoría completa de tu temario: '), el('a', { href: l.ref.href, text: l.ref.text })]));
    wrap.appendChild(el('h2', { text: 'Comprueba lo que has aprendido' }));
    wrap.appendChild(quizBox(l, s.id, i));
    doneBtn = el('button', { class: 'btn', type: 'button' });
    doneBtn.addEventListener('click', function () {
      var k = key(s.id, i);
      setDone(k, !progress[k]);
      buildNav($('search').value); refreshDone(); renderHud();
    });
    wrap.appendChild(el('div', { class: 'done-row' }, [doneBtn]));
    var prev = i > 0 ? { h: '#' + key(s.id, i - 1), t: '← ' + s.lessons[i - 1].t } : null;
    var next = i < s.lessons.length - 1 ? { h: '#' + key(s.id, i + 1), t: s.lessons[i + 1].t + ' →' } : { h: '#inicio', t: 'Volver al inicio' };
    wrap.appendChild(el('div', { class: 'pager' }, [
      prev ? el('a', { class: 'btn', href: prev.h, text: prev.t }) : el('span'),
      el('a', { class: 'btn primary', href: next.h, text: next.t, style: '--c:' + colorVar(s) })
    ]));
    main.appendChild(wrap);
    refreshDone();
    document.title = l.t + ' · Aula DAW 1';
  }

  function render() {
    var main = $('main');
    main.innerHTML = '';
    doneBtn = null;
    var r = parseRoute();
    if (r.home) renderHome(main); else renderLesson(main, r.s, r.i);
    buildNav($('search').value);
    renderHud();
    $('sidebar').classList.remove('open');
    window.scrollTo(0, 0);
  }

  /* ---------- Eventos ---------- */
  $('search').addEventListener('input', function () { buildNav(this.value); });
  $('menu').addEventListener('click', function () { $('sidebar').classList.toggle('open'); });
  $('theme').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.getAttribute('data-theme') === 'dark' || (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', dark ? 'light' : 'dark');
  });
  window.addEventListener('hashchange', render);
  render();
})();
