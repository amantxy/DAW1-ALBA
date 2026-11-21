(function () {
  var DATA = window.DATA;
  /* Progreso guardado en localStorage con el prefijo "aula:".
     progreso.js (el de toda la web) sincroniza las claves "aula:*" con tu cuenta.
       aula:<asignatura>-<n>   = 1        lección completada
       aula:q:<asignatura>-<n> = [0,2]    preguntas del test acertadas alguna vez
       aula:resp               = {fecha: nº de respuestas ese día}
       aula:foco               = {fecha: nº de pomodoros ese día}
     El modo gaming no guarda nada propio: XP, nivel, racha y logros se calculan con estos datos.
     Solo el modo elegido (estudio o gaming) se guarda en este dispositivo (aula-modo). */
  var PREFIJO = 'aula:';
  var progress = {}, scores = {}, resp = {}, foco = {}, estrellas = {}, jefes = {};
  function leeJSON(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function leeProgreso() {
    progress = {}; scores = {}; resp = {}; foco = {}; estrellas = {}; jefes = {};
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
        else if (nombre === 'foco') { var fo = leeJSON(k); if (fo && typeof fo === 'object') foco = fo; }
        else if (nombre.indexOf('e:') === 0) { var ne = leeJSON(k); if (typeof ne === 'number' && ne >= 1) estrellas[nombre.slice(2)] = Math.min(3, ne); }
        else if (nombre.indexOf('j:') === 0) { var nj = leeJSON(k); if (typeof nj === 'number' && nj >= 1) jefes[nombre.slice(2)] = Math.min(3, nj); }
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
  try { var modo0 = localStorage.getItem('aula-modo'); gaming = (modo0 === 'gaming' || modo0 === '1'); } catch (e) { gaming = false; }
  document.body.classList.toggle('gaming', gaming);
  document.body.classList.toggle('estudio', !gaming);

  var NIVELES = [
    { xp: 0, n: 'Novato' }, { xp: 150, n: 'Aprendiz' }, { xp: 500, n: 'Junior' }, { xp: 1100, n: 'Programador' }, { xp: 2000, n: 'Dev' },
    { xp: 3200, n: 'Senior' }, { xp: 4800, n: 'Arquitecto' }, { xp: 6800, n: 'Maestro' }, { xp: 9000, n: 'Leyenda' }
  ];
  var XP_NIVEL = 60, XP_ESTRELLA = 40, XP_JEFE = 150, XP_JEFE_ESTRELLA = 150, XP_ACIERTO = 10, XP_PERFECTA = 50, XP_MISION = 20, META_DIA = 5;
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
    var nivelesHechos = 0, tresEstrellas = 0, estrellasTot = 0, jefesHechos = 0, xpJuego = 0;
    DATA.forEach(function (s) {
      s.lessons.forEach(function (l, i) {
        var e = estrellas[key(s.id, i)] || 0;
        if (e) { nivelesHechos++; estrellasTot += e; xpJuego += XP_NIVEL + e * XP_ESTRELLA; if (e === 3) tresEstrellas++; }
      });
      var j = jefes[s.id] || 0;
      if (j) { jefesHechos++; estrellasTot += j; xpJuego += XP_JEFE + j * XP_JEFE_ESTRELLA; }
    });
    var dias = Object.keys(resp).filter(function (d) { return resp[d] > 0; }).sort();
    var misiones = dias.filter(function (d) { return resp[d] >= META_DIA; }).length;
    var xp = correctas * XP_ACIERTO + perfectas * XP_PERFECTA + misiones * XP_MISION + xpJuego;
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
    var s0 = { correctas: correctas, perfectas: perfectas, completadas: completadas, misiones: misiones, xp: xp, nivel: nivel, siguiente: siguiente, racha: racha, mejor: mejor, nivelesHechos: nivelesHechos, tresEstrellas: tresEstrellas, estrellasTot: estrellasTot, jefesHechos: jefesHechos, hoy: resp[hoy()] || 0, porAsig: porAsig };
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
    l.push({ id: 'estrellas', t: 'Tres estrellas', d: 'Supera 5 niveles con las 3 vidas intactas', ok: st.tresEstrellas >= 5, c: '#a4660f' });
    l.push({ id: 'jefe1', t: 'Cazador de jefes', d: 'Derrota a tu primer jefe', ok: st.jefesHechos >= 1, c: '#c23b72' });
    l.push({ id: 'jefes', t: 'Rey de las mazmorras', d: 'Derrota a los ' + DATA.length + ' jefes', ok: st.jefesHechos >= DATA.length, c: '#6b4ce0' });
    DATA.forEach(function (s, i) { l.push({ id: 'asig-' + s.id, t: s.name, d: 'Completa todas sus lecciones', ok: !!st.porAsig[s.id], c: COLORES[i % COLORES.length] }); });
    var todo = DATA.every(function (s) { return st.porAsig[s.id]; });
    l.push({ id: 'todo', t: 'Leyenda de DAW 1', d: 'Completa todas las asignaturas', ok: todo, c: '#a4660f' });
    return l;
  }

  function setGaming(on) {
    gaming = on;
    if (on) paraTm();
    try { localStorage.setItem('aula-modo', on ? 'gaming' : 'estudio'); } catch (e) { /* solo en esta sesión */ }
    document.body.classList.toggle('gaming', on);
    document.body.classList.toggle('estudio', !on);
    renderHud();
    if (parseRoute().home) render(); else buildNav($('search').value);
  }

  /* ---------- Modo estudio: temporizador de concentración (25 min + 5 de descanso) ---------- */
  var FOCO_SEG = 25 * 60, DESC_SEG = 5 * 60;
  var tm = { fase: 'foco', resta: FOCO_SEG, id: null };
  var tmEl = null, tmFase = null, tmBtn = null;
  function fmt(seg) { return pad(Math.floor(seg / 60)) + ':' + pad(seg % 60); }
  function pintaTm() {
    if (tmEl) tmEl.textContent = fmt(tm.resta);
    if (tmFase) tmFase.textContent = tm.fase === 'foco' ? 'Concentración' : 'Descanso';
    if (tmBtn) tmBtn.textContent = tm.id ? 'Pausar' : (tm.resta === (tm.fase === 'foco' ? FOCO_SEG : DESC_SEG) ? 'Iniciar' : 'Continuar');
  }
  function paraTm() { if (tm.id) { clearInterval(tm.id); tm.id = null; } }
  function tickTm() {
    tm.resta--;
    if (tm.resta > 0) { pintaTm(); return; }
    paraTm();
    if (tm.fase === 'foco') {
      var d = hoy(); foco[d] = (foco[d] || 0) + 1; guarda('foco', foco);
      toast('Pomodoro completado. Descansa 5 minutos.');
      tm.fase = 'descanso'; tm.resta = DESC_SEG;
    } else {
      toast('Descanso terminado. Vuelve a concentrarte 25 minutos.');
      tm.fase = 'foco'; tm.resta = FOCO_SEG;
    }
    renderHud();
  }
  function barraEstudio(hud) {
    hud.hidden = false;
    hud.innerHTML = '';
    var total = 0, hechas = 0;
    DATA.forEach(function (s) { total += s.lessons.length; hechas += doneCount(s); });
    tmEl = el('span', { class: 'tiempo', 'aria-live': 'off' });
    tmFase = el('span', { class: 'fase' });
    tmBtn = el('button', { type: 'button', class: 'btn primary', onclick: function () {
      if (tm.id) paraTm(); else tm.id = setInterval(tickTm, 1000);
      pintaTm();
    } });
    hud.appendChild(el('div', { class: 'hud-reloj' }, [tmFase, tmEl]));
    hud.appendChild(el('div', { class: 'hud-botones' }, [
      tmBtn,
      el('button', { type: 'button', class: 'btn', text: 'Reiniciar', onclick: function () { paraTm(); tm.fase = 'foco'; tm.resta = FOCO_SEG; pintaTm(); } })
    ]));
    var n = foco[hoy()] || 0;
    hud.appendChild(el('div', { class: 'hud-dato' }, [el('b', { text: n + (n === 1 ? ' pomodoro' : ' pomodoros') }), el('span', { text: 'Hoy' })]));
    hud.appendChild(el('div', { class: 'hud-dato' }, [el('b', { text: hechas + '/' + total }), el('span', { text: 'Lecciones completadas' })]));
    pintaTm();
  }

  function selectorModo() {
    var wrap = el('div', { class: 'seg', role: 'group', 'aria-label': 'Modo de estudio' });
    [['estudio', 'Estudio'], ['gaming', 'Gaming']].forEach(function (m) {
      var on = (m[0] === 'gaming') === gaming;
      wrap.appendChild(el('button', { type: 'button', class: 'seg-b' + (on ? ' on' : ''), 'data-m': m[0], 'aria-pressed': on ? 'true' : 'false', text: m[1], onclick: function () { if (!on) setGaming(m[0] === 'gaming'); } }));
    });
    return wrap;
  }

  function renderHud() {
    var hud = $('hud');
    hud.className = 'hud ' + (gaming ? 'hud-gaming' : 'hud-estudio');
    if (!gaming) { barraEstudio(hud); return; }
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
    hud.appendChild(el('div', { class: 'hud-dato' }, [el('b', { text: '★ ' + st.estrellasTot }), el('span', { text: 'Estrellas' })]));
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
    if (!gaming && aciertos(sid, idx, total) === total && !progress[k]) { setDone(k, true); buildNav($('search').value); refreshDone(); }
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
    nav.appendChild(selectorModo());
    DATA.forEach(function (s) {
      var items = [];
      s.lessons.forEach(function (l, i) {
        if (!q || l.t.toLowerCase().indexOf(q) !== -1 || s.name.toLowerCase().indexOf(q) !== -1) items.push(i);
      });
      if (!items.length) return;
      var d = el('details', { class: 'nav-sub' });
      d.style.setProperty('--c', colorVar(s));
      if (q || (route.s && route.s.id === s.id) || (route.jefe && route.jefe.id === s.id)) d.open = true;
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
          gaming && estrellas[key(s.id, i)] ? el('span', { class: 'tick est', text: '★'.repeat(estrellas[key(s.id, i)]), 'aria-label': estrellas[key(s.id, i)] + ' estrellas' }) : (progress[key(s.id, i)] ? el('span', { class: 'tick', text: '✓', 'aria-label': 'completada' }) : null)
        ]);
        ul.appendChild(el('li', null, [a]));
      });
      if (gaming && !q) ul.appendChild(el('li', null, [el('a', { href: '#jefe-' + s.id, class: (route.jefe && route.jefe.id === s.id ? 'on ' : '') + 'nav-jefe' }, [el('span', { text: 'Jefe: ' + (window.JEFES && window.JEFES[s.id] || 'Jefe final') }), jefes[s.id] ? el('span', { class: 'tick est', text: '★'.repeat(jefes[s.id]) }) : null])]));
      d.appendChild(ul);
      nav.appendChild(d);
    });
    if (q && !nav.querySelector('.nav-sub')) nav.appendChild(el('p', { class: 'note', text: 'No hay lecciones con ese nombre.' }));
  }

  /* ---------- Rutas ---------- */
  function parseRoute() {
    var h = (location.hash || '#inicio').slice(1);
    var mj = /^jefe-([a-z]+)$/.exec(h);
    if (mj) { var sj = DATA.filter(function (x) { return x.id === mj[1]; })[0]; if (sj) return { jefe: sj }; }
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
      selectorModo(),
      el('p', { class: 'muted', text: gaming ? 'Modo gaming: ganas XP, subes de nivel, mantienes tu racha y consigues logros.' : 'Modo estudio: vista tranquila con temporizador de concentración (25 minutos de estudio y 5 de descanso). Cambia a gaming cuando quieras puntos y logros.' })
    ]));
    if (gaming) main.appendChild(aventura());
    if (gaming) { main.appendChild(mapa()); document.title = 'Aula DAW 1'; return; }
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


  /* ---------- Modo gaming: niveles, jefes y mapa ---------- */
  function colorHex(s) { return COLORES[DATA.indexOf(s) % COLORES.length]; }
  function estrellasTxt(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
  function corazones(n) {
    var w = el('span', { class: 'vidas', role: 'img', 'aria-label': n + (n === 1 ? ' vida' : ' vidas') });
    for (var i = 0; i < 3; i++) w.appendChild(el('span', { class: i < n ? 'viva' : 'muerta', text: i < n ? '♥' : '♡', 'aria-hidden': 'true' }));
    return w;
  }
  function nivelCompleto(s) { return s.lessons.every(function (_, i) { return (estrellas[key(s.id, i)] || 0) >= 1; }); }

  /* Un combate (nivel o jefe). cfg: {titulo, color, sid, jefe, fases:[function(ctx)->nodo], alGanar(estrellas), siguiente:{h,t}, repite:function} */
  function combate(host, cfg) {
    JUEGO.limpia();
    host.innerHTML = '';
    var vidas = 3, fase = 0, fin = false, golpes = 0, hp = 1;
    var esc = JUEGO.escena(cfg.color, cfg.sid, !!cfg.jefe);
    var vid = el('div', { class: 'nivel-vidas' });
    var info = el('b', { class: 'nivel-fase' });
    var cuerpo = el('div', { class: 'nivel-cuerpo' });
    var escBox = el('div', { class: 'nivel-escena' }, [esc.el, el('div', { class: 'nivel-barra' }, [info, vid])]);
    host.appendChild(escBox); host.appendChild(cuerpo);
    function pintaVidas() { vid.innerHTML = ''; vid.appendChild(corazones(vidas)); }
    pintaVidas();
    var ctx = {
      vivo: function () { return vidas > 0 && !fin; },
      acierto: function () { golpes++; hp = Math.max(0.12, hp - 0.12); esc.golpea(hp); },
      perder: function () {
        if (fin) return vidas;
        vidas--; pintaVidas(); esc.recibe();
        if (vidas <= 0) derrota();
        return vidas;
      },
      listo: function () { fase++; if (fase >= cfg.fases.length) victoria(); else muestra(); }
    };
    function muestra() {
      cuerpo.innerHTML = '';
      info.textContent = cfg.nombres[fase];
      cuerpo.appendChild(cfg.fases[fase](ctx));
    }
    function derrota() {
      fin = true; JUEGO.limpia(); esc.fin('lose');
      cuerpo.innerHTML = '';
      cuerpo.appendChild(el('div', { class: 'nivel-fin mal' }, [
        el('h3', { text: 'Te has quedado sin vidas' }),
        el('p', { text: cfg.jefe ? 'El jefe resiste. Repasa las lecciones de la asignatura y vuelve a intentarlo.' : 'No pasa nada: repasa la teoría de arriba y vuelve a intentarlo.' }),
        el('button', { type: 'button', class: 'btn primary', text: 'Reintentar', onclick: cfg.repite })
      ]));
    }
    function victoria() {
      fin = true; JUEGO.limpia(); esc.fin('win');
      var antes = stats();
      cfg.alGanar(vidas);
      var despues = stats();
      var xp = despues.xp - antes.xp;
      cuerpo.innerHTML = '';
      var botones = [el('a', { class: 'btn primary', href: cfg.siguiente.h, text: cfg.siguiente.t })];
      if (vidas < 3) botones.push(el('button', { type: 'button', class: 'btn', text: 'Repetir para más estrellas', onclick: cfg.repite }));
      cuerpo.appendChild(el('div', { class: 'nivel-fin bien' }, [
        el('h3', { text: cfg.jefe ? '¡Jefe derrotado!' : '¡Nivel superado!' }),
        el('p', { class: 'estrellas-grandes', 'aria-label': vidas + ' de 3 estrellas', text: estrellasTxt(vidas) }),
        el('p', { text: xp > 0 ? '+' + xp + ' XP' : 'Ya tenías esta puntuación o una mejor.' }),
        el('div', { class: 'done-row' }, botones)
      ]));
      confeti();
      if (despues.nivel > antes.nivel) toast('¡Subes al nivel ' + (despues.nivel + 1) + ': ' + NIVELES[despues.nivel].n + '!');
      despues.logros.forEach(function (lg, i) { if (lg.ok && !antes.logros[i].ok) toast('Logro desbloqueado: ' + lg.t); });
      buildNav($('search').value); renderHud();
    }
    muestra();
  }

  function pantallaInicio(host, o) {
    host.innerHTML = '';
    var cab = [el('h3', { text: o.titulo }), el('p', { text: o.texto })];
    if (o.record) cab.push(el('p', { class: 'estrellas-grandes', text: 'Mejor: ' + estrellasTxt(o.record) }));
    cab.push(el('p', { class: 'muted' }, [document.createTextNode('Tienes '), corazones(3), document.createTextNode(' Cada fallo cuesta una vida; las estrellas son las vidas que te quedan al ganar.')]));
    if (o.bloqueo) cab.push(el('p', { class: 'note', text: o.bloqueo }));
    else cab.push(el('button', { type: 'button', class: 'btn primary', text: o.boton, onclick: o.empieza }));
    host.appendChild(el('div', { class: 'nivel-intro' }, cab));
  }

  function nivelJuego(s, i, l) {
    var k = key(s.id, i), reto = window.RETOS && window.RETOS[k];
    var host = el('section', { class: 'nivel', 'aria-label': 'Nivel del modo gaming' });
    var siguiente = i < s.lessons.length - 1 ? { h: '#' + key(s.id, i + 1), t: 'Siguiente nivel →' } : { h: '#jefe-' + s.id, t: 'Ir al jefe →' };
    function inicio() {
      pantallaInicio(host, {
        titulo: 'Nivel ' + (i + 1) + ': ' + l.t,
        texto: 'Te enfrentas a ' + JUEGO.enemigo(s.id) + '. Calentamiento con las preguntas de la lección y después el reto «' + (reto ? reto.t : 'final') + '».',
        record: estrellas[k] || 0, boton: 'Empezar nivel', empieza: juega
      });
    }
    function juega() {
      var fases = [function (ctx) { return JUEGO.preguntas(l.quiz, ctx, { onResp: function (qi, ok, caja) { registra(s.id, i, qi, ok, caja, l.quiz.length); } }); }];
      var nombres = ['Calentamiento'];
      if (reto) { fases.push(function (ctx) { var w = el('div'); w.appendChild(el('h3', { class: 'jg-titulo', text: reto.t })); w.appendChild(JUEGO.construye(reto, ctx)); return w; }); nombres.push('Reto'); }
      combate(host, {
        color: colorHex(s), sid: s.id, jefe: false, fases: fases, nombres: nombres, siguiente: siguiente, repite: juega,
        alGanar: function (v) {
          if (v > (estrellas[k] || 0)) { estrellas[k] = v; guarda('e:' + k, v); }
          setDone(k, true);
        }
      });
    }
    inicio();
    return host;
  }

  function renderJefe(main, s) {
    var nombre = (window.JEFES && window.JEFES[s.id]) || 'Jefe final';
    var wrap = el('article', { class: 'lesson jefe-pagina' });
    wrap.style.setProperty('--c', colorVar(s));
    wrap.appendChild(el('div', { class: 'crumbs' }, [el('a', { href: '#inicio', text: 'Inicio' }), document.createTextNode(' / ' + s.name)]));
    wrap.appendChild(el('span', { class: 'chip', text: s.name + ' · jefe final' }));
    wrap.appendChild(el('h1', { text: nombre }));
    var host = el('section', { class: 'nivel', 'aria-label': 'Combate contra el jefe' });
    var faltan = s.lessons.map(function (_, i) { return i; }).filter(function (i) { return !(estrellas[key(s.id, i)] > 0); });
    function juega() {
      var pool = [];
      s.lessons.forEach(function (l) { l.quiz.forEach(function (q) { pool.push(q); }); });
      pool = JUEGO.mezcla(pool).slice(0, 10);
      combate(host, {
        color: colorHex(s), sid: s.id, jefe: true, nombres: ['Combate'], siguiente: { h: '#inicio', t: 'Volver al mapa' }, repite: juega,
        fases: [function (ctx) { return JUEGO.preguntas(pool, ctx, { tiempo: 20, hp: true, jefe: nombre, onResp: function () { var d = hoy(); resp[d] = (resp[d] || 0) + 1; guarda('resp', resp); } }); }],
        alGanar: function (v) { if (v > (jefes[s.id] || 0)) { jefes[s.id] = v; guarda('j:' + s.id, v); } }
      });
    }
    pantallaInicio(host, {
      titulo: nombre,
      texto: 'Diez preguntas de toda la asignatura, 20 segundos cada una. Cada acierto le quita vida al jefe; si fallas, esa pregunta vuelve una vez más.',
      record: jefes[s.id] || 0, boton: 'Combatir', empieza: juega,
      bloqueo: faltan.length ? 'El jefe está bloqueado. Supera antes los niveles: ' + faltan.map(function (i) { return (i + 1) + ' (' + s.lessons[i].t + ')'; }).join(', ') + '.' : null
    });
    wrap.appendChild(host);
    wrap.appendChild(el('div', { class: 'pager' }, [el('a', { class: 'btn', href: '#' + key(s.id, s.lessons.length - 1), text: '← Último nivel' }), el('a', { class: 'btn primary', href: '#inicio', text: 'Mapa', style: '--c:' + colorVar(s) })]));
    main.appendChild(wrap);
    document.title = nombre + ' · Aula DAW 1';
  }

  function mapa() {
    var wrap = el('section', { class: 'mapa', 'aria-label': 'Mapa de aventura' });
    wrap.appendChild(el('h2', { text: 'Mapa de aventura' }));
    wrap.appendChild(el('p', { class: 'muted', text: 'Supera cada nivel (calentamiento y reto) para llegar al jefe de la asignatura. Ganas ' + XP_NIVEL + ' XP por nivel más ' + XP_ESTRELLA + ' por estrella, y ' + XP_JEFE + ' más ' + XP_JEFE_ESTRELLA + ' por estrella al derrotar a un jefe.' }));
    DATA.forEach(function (s) {
      var fila = el('div', { class: 'mapa-asig' });
      fila.style.setProperty('--c', colorVar(s));
      fila.appendChild(el('h3', null, [el('span', { class: 'dot' }), document.createTextNode(s.name)]));
      var ruta = el('div', { class: 'mapa-ruta' });
      s.lessons.forEach(function (l, i) {
        var e = estrellas[key(s.id, i)] || 0;
        ruta.appendChild(el('a', { href: '#' + key(s.id, i), class: 'nodo' + (e ? ' hecho' : ''), title: l.t, 'aria-label': 'Nivel ' + (i + 1) + ': ' + l.t + ', ' + e + ' estrellas' }, [el('b', { text: String(i + 1) }), el('small', { text: estrellasTxt(e) })]));
      });
      var abierto = nivelCompleto(s), j = jefes[s.id] || 0;
      ruta.appendChild(el('a', { href: '#jefe-' + s.id, class: 'nodo jefe' + (abierto ? '' : ' lock') + (j ? ' hecho' : ''), 'aria-label': 'Jefe ' + (window.JEFES && window.JEFES[s.id] || '') + (abierto ? '' : ', bloqueado') }, [el('b', { text: 'Jefe' }), el('small', { text: abierto ? estrellasTxt(j) : 'bloqueado' })]));
      fila.appendChild(ruta);
      wrap.appendChild(fila);
    });
    return wrap;
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
    if (gaming) { wrap.appendChild(el('h2', { text: 'Tu nivel' })); wrap.appendChild(nivelJuego(s, i, l)); }
    else { wrap.appendChild(el('h2', { text: 'Comprueba lo que has aprendido' })); wrap.appendChild(quizBox(l, s.id, i)); }
    doneBtn = el('button', { class: 'btn', type: 'button' });
    doneBtn.addEventListener('click', function () {
      var k = key(s.id, i);
      setDone(k, !progress[k]);
      buildNav($('search').value); refreshDone(); renderHud();
    });
    if (!gaming) wrap.appendChild(el('div', { class: 'done-row' }, [doneBtn]));
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
    JUEGO.limpia();
    var r = parseRoute();
    if (r.home) renderHome(main); else if (r.jefe) renderJefe(main, r.jefe); else renderLesson(main, r.s, r.i);
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
