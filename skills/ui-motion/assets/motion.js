/* ui-motion runtime. No library.
   - Eased mouse wheel + soft magnet to [data-section] starts + anchor glide (fine pointer, motion allowed)
   - Scroll-driven transition between every two sections (rounded card opens, previous eases back)
   - Reveal once ([data-reveal]), loop pausing ([data-loop]), pause control ([data-motion-toggle])
   - Spotlight ([data-spotlight]) and tilt ([data-tilt]) for fine pointers
   Scroll position stays the real window scroll: no fake scroller, no pinning, no custom scrollbar. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  var fineMQ = matchMedia('(hover: hover) and (pointer: fine)');
  var CFG = {
    tau: 0.2,           // easing time constant (s): one wheel step settles in about 1s
    magnet: 0.12,       // glide to a section start when within 12% of the screen height
    idle: 160,          // ms without wheel input before the magnet decides
    shrink: 0.05,       // previous section scales down 5%
    fade: 0.45,         // previous section becomes 45% lighter
    inset: 0.04,        // incoming section starts inset 4% of the width on each side
    radius: 32          // incoming section starts with 32px top corners
  };

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function maxScroll() { return Math.max(0, root.scrollHeight - innerHeight); }
  function sections() { return Array.prototype.slice.call(document.querySelectorAll('[data-section]')); }
  function docTop(el) { return el.getBoundingClientRect().top + scrollY; }

  /* ---------- Reveal once ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if (reduceMQ.matches || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var count = new Map();
      revealEls.forEach(function (el) {
        var n = count.get(el.parentNode) || 0;
        if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', Math.min(n, 4)); // at most 4 steps
        count.set(el.parentNode, n + 1);
      });
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
      revealEls.forEach(function (el) { rio.observe(el); });
    }
  }

  /* ---------- Loops pause off screen ---------- */
  var loopEls = document.querySelectorAll('[data-loop]');
  if (loopEls.length && 'IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-playing', e.isIntersecting); });
    }, { threshold: 0 });
    loopEls.forEach(function (el) { lio.observe(el); });
  }
  var userPaused = false;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) root.classList.add('motion-paused'); else if (!userPaused) root.classList.remove('motion-paused');
  });
  document.querySelectorAll('[data-motion-toggle]').forEach(function (btn) {
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', function () {
      userPaused = !userPaused;
      root.classList.toggle('motion-paused', userPaused);
      btn.setAttribute('aria-pressed', String(userPaused));
    });
  });

  /* ---------- Spotlight and tilt (fine pointer only) ---------- */
  function initPointerEffects() {
    document.querySelectorAll('[data-spotlight]').forEach(function (el) {
      var tx = 50, ty = 50, x = 50, y = 50, raf = 0;
      function tick() {
        x += (tx - x) * 0.18; y += (ty - y) * 0.18;               // soft follow, never glued to the cursor
        el.style.setProperty('--mx', x.toFixed(2) + '%');
        el.style.setProperty('--my', y.toFixed(2) + '%');
        raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.1) ? requestAnimationFrame(tick) : 0;
      }
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width * 100; ty = (e.clientY - r.top) / r.height * 100;
        if (!raf) raf = requestAnimationFrame(tick);
      });
      el.addEventListener('pointerenter', function () { el.style.setProperty('--spot-on', '1'); });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--spot-on', '0'); });
    });
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 6;     // degrees, keep at 6 or less
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', (px * max * 2).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-py * max * 2).toFixed(2) + 'deg');
      });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- Eased wheel, magnet, anchor glide ---------- */
  var enabled = false, raf = 0, target = 0, pos = 0, lastSet = 0, lastT = 0, idleTimer = 0, onDone = null;

  function isMouseWheel(e) {
    if (e.deltaMode !== 0) return true;                       // line or page deltas: a wheel
    var d = Math.abs(e.deltaY);
    return d >= 50 && Number.isInteger(e.deltaY);             // trackpads send small or fractional deltas
  }
  function scrollableAncestor(el, dy) {
    for (; el && el !== document.body && el !== root; el = el.parentElement) {
      if (el.nodeType !== 1) continue;
      var oy = getComputedStyle(el).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) {
        if ((dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight) || (dy < 0 && el.scrollTop > 0)) return true;
      }
      if (el.tagName === 'IFRAME' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') return true;
    }
    return false;
  }
  function frame(t) {
    if (Math.abs(scrollY - lastSet) > 2) { stop(); return; }  // scrollbar, keyboard or find-in-page moved the page
    var dt = Math.min(0.05, (t - (lastT || t)) / 1000) || 0.016; lastT = t;
    pos += (target - pos) * (1 - Math.exp(-dt / CFG.tau));
    if (Math.abs(target - pos) < 0.5) pos = target;
    window.scrollTo(0, pos); lastSet = scrollY;
    if (pos === target) { var cb = onDone; stop(); if (cb) cb(); return; }
    raf = requestAnimationFrame(frame);
  }
  function glide(to, done) {
    if (!raf) { pos = scrollY; lastSet = scrollY; lastT = 0; }
    target = clamp(to, 0, maxScroll()); onDone = done || null;
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; onDone = null; }

  function magnet() {
    if (raf) return;
    var y = scrollY, best = null, bestD = Infinity;
    var pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    sections().forEach(function (s) {
      if (s.getAttribute('data-snap') === 'off') return;
      var d = Math.abs(docTop(s) - pad - y);
      if (d < bestD) { bestD = d; best = s; }
    });
    if (best && bestD > 1 && bestD <= innerHeight * CFG.magnet) glide(docTop(best) - pad);
  }
  function onWheel(e) {
    if (!enabled || e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (scrollableAncestor(e.target, e.deltaY)) return;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(magnet, CFG.idle);                // trackpad: native scroll, magnet after it settles
    if (!isMouseWheel(e)) { stop(); return; }
    var dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1);
    e.preventDefault();
    glide((raf ? target : scrollY) + dy);
  }
  function onAnchor(e) {
    if (!enabled || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    var el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    var pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    if (!el.matches('a, button, input, select, textarea, [tabindex]')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });           // focus moves at once; the glide only animates the view
    glide(docTop(el) - pad);
    history.pushState(null, '', '#' + id);
  }
  function cancelOnInput() { stop(); }

  /* ---------- Section transitions ---------- */
  var tRaf = 0;
  function applyTransitions() {
    tRaf = 0;
    var list = sections(), vh = innerHeight, vw = root.clientWidth;
    for (var i = 1; i < list.length; i++) {
      var cur = list[i], prev = list[i - 1];
      var top = cur.getBoundingClientRect().top;
      var p = clamp((vh - top) / vh, 0, 1);                  // 0: next section just appears; 1: it reached the top
      if (top > vh * 1.5 || top < -vh) { if (cur.style.clipPath) cur.style.clipPath = ''; continue; }
      var x = (1 - p) * vw * CFG.inset, r = (1 - p) * CFG.radius;
      cur.style.clipPath = p >= 1 ? '' : 'inset(0 ' + x.toFixed(1) + 'px 0 ' + x.toFixed(1) + 'px round ' + r.toFixed(1) + 'px ' + r.toFixed(1) + 'px 0 0)';
      if (prev.hasAttribute('data-no-recede')) continue;
      prev.style.transform = p > 0 ? 'scale(' + (1 - CFG.shrink * p).toFixed(4) + ')' : '';
      prev.style.opacity = p > 0 ? (1 - CFG.fade * p).toFixed(3) : '';
    }
  }
  function onScroll() { if (!tRaf) tRaf = requestAnimationFrame(applyTransitions); }
  function clearTransitions() {
    sections().forEach(function (s) { s.style.clipPath = ''; s.style.transform = ''; s.style.opacity = ''; });
  }

  /* ---------- Enable / disable with the media queries ---------- */
  function update() {
    var want = !reduceMQ.matches && fineMQ.matches;
    if (want === enabled) return;
    enabled = want;
    root.classList.toggle('is-eased', enabled);
    if (enabled) {
      addEventListener('wheel', onWheel, { passive: false });
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll, { passive: true });
      ['keydown', 'mousedown', 'touchstart'].forEach(function (t) { addEventListener(t, cancelOnInput, { passive: true }); });
      document.addEventListener('click', onAnchor);
      applyTransitions();
    } else {
      stop();
      removeEventListener('wheel', onWheel, { passive: false });
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      ['keydown', 'mousedown', 'touchstart'].forEach(function (t) { removeEventListener(t, cancelOnInput); });
      document.removeEventListener('click', onAnchor);
      clearTransitions();
    }
  }
  if (fineMQ.matches && !reduceMQ.matches) initPointerEffects();
  [reduceMQ, fineMQ].forEach(function (mq) { mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update); });
  update();
})();
