(function () {
  var DATA = window.DATA;
  var STORE_KEY = 'aula-daw1-progreso';
  var progress = {};
  try { progress = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; } catch (e) { progress = {}; }
  function saveProgress() { try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* sin almacenamiento */ } }
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

  /* ---------- Menú lateral ---------- */
  function buildNav(filter) {
    var nav = $('nav');
    nav.innerHTML = '';
    var q = (filter || '').trim().toLowerCase();
    var route = parseRoute();
    nav.appendChild(el('a', { href: '#inicio', class: 'nav-home' + (route.home ? ' on' : ''), text: 'Inicio' }));
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
        el('span', { class: 'count', text: doneCount(s) + '/' + s.lessons.length })
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
  function renderHome(main) {
    var total = 0, done = 0;
    DATA.forEach(function (s) { total += s.lessons.length; done += doneCount(s); });
    main.appendChild(el('section', { class: 'hero' }, [
      el('h1', { text: 'Aula DAW 1' }),
      el('p', { text: 'Aprende desde cero lo que ves en clase, paso a paso: teoría corta, ejemplos, un editor para probar el código y un test al final de cada lección.' }),
      el('p', { class: 'note', text: 'El contenido es una base general escrita para empezar. Si tu profesorado explica algo distinto, manda su material y se ajusta. Llevas ' + done + ' de ' + total + ' lecciones completadas.' })
    ]));
    var cards = el('div', { class: 'cards' });
    DATA.forEach(function (s) {
      var n = doneCount(s);
      var c = el('a', { class: 'card', href: '#' + key(s.id, 0) }, [
        el('h2', { text: s.name }),
        el('p', { text: s.intro }),
        el('div', { class: 'bar' }, [el('i', { style: 'width:' + Math.round(100 * n / s.lessons.length) + '%' })]),
        el('small', { text: n + ' de ' + s.lessons.length + ' lecciones' })
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
    var pad = new Array(depth + 1).join('  ');
    if (node.nodeType === 1) {
      var attrs = '';
      for (var k = 0; k < node.attributes.length; k++) attrs += ' ' + node.attributes[k].name + '="' + node.attributes[k].value + '"';
      var kids = [].slice.call(node.childNodes).filter(function (c) { return c.nodeType === 1 || (c.nodeType === 3 && c.nodeValue.trim()); });
      if (kids.length === 1 && kids[0].nodeType === 3) { lines.push(pad + '▸ ' + node.nodeName + attrs + ': ' + kids[0].nodeValue.trim()); return; }
      lines.push(pad + '▸ ' + node.nodeName + attrs);
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
    var wrap = el('div');
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
          if (answered === total) {
            score.hidden = false;
            score.textContent = 'Resultado: ' + correct + ' de ' + total + (correct === total ? '. ¡Lección dominada!' : '. Repasa la teoría y vuelve a intentarlo.');
            if (correct === total && !progress[key(sid, idx)]) { progress[key(sid, idx)] = 1; saveProgress(); buildNav($('search').value); refreshDone(); }
          }
        });
        return b;
      });
      btns.forEach(function (b) { opts.appendChild(b); });
      box.appendChild(opts); box.appendChild(expl);
      wrap.appendChild(box);
    });
    wrap.appendChild(score);
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
        if (s.id === 'prog' || s.id === 'entornos' && /Java/.test(l.t) || s.id === 'bd' || s.id === 'sistemas' || s.id === 'entornos') {
          wrap.appendChild(el('p', { class: 'note', text: 'Este código no se ejecuta en la web. Cópialo y pruébalo en tu entorno: ' + (s.id === 'bd' ? 'un gestor de bases de datos' : s.id === 'sistemas' ? 'una terminal de Linux' : s.id === 'entornos' && /Algoritmos/.test(l.t) ? 'PSeInt' : s.id === 'ingles' ? 'tu correo' : 'tu IDE de Java') + '.' }));
        }
      }
    }
    wrap.appendChild(el('h2', { text: 'Comprueba lo que has aprendido' }));
    wrap.appendChild(quizBox(l, s.id, i));
    doneBtn = el('button', { class: 'btn', type: 'button' });
    doneBtn.addEventListener('click', function () {
      var k = key(s.id, i);
      if (progress[k]) delete progress[k]; else progress[k] = 1;
      saveProgress(); buildNav($('search').value); refreshDone();
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
