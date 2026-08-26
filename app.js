/* Valentin Rodin — portfolio interactions. No dependencies. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- theme toggle ---------- */
  var toggle = document.getElementById('themeToggle');
  var stored = null;
  try { stored = localStorage.getItem('vr-theme'); } catch (e) {}
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.setAttribute('data-theme', stored);
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      var current = document.documentElement.getAttribute('data-theme') || (systemLight ? 'light' : 'dark');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('vr-theme', next); } catch (e) {}
    });
  }

  /* ---------- nav background on scroll ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    Array.prototype.forEach.call(revealables, function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 4) * 55 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- project disclosures ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.disclose'), function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    var label = btn.querySelector('.disclose__text');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
      if (label) label.textContent = open ? 'Full description' : 'Close description';
    });
  });

  /* ---------- video lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var frame = document.getElementById('lightboxFrame');
  var closeBtn = document.getElementById('lightboxClose');
  var lastTrigger = null;

  function openVideo(id, aspect, title) {
    if (!lightbox || !frame) return;
    frame.setAttribute('data-aspect', aspect || '16:9');
    frame.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(id) +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="' +
      String(title || 'Video').replace(/"/g, '&quot;') +
      '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    lightbox.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    if (closeBtn) closeBtn.focus();
  }

  function closeVideo() {
    if (!lightbox || !frame || lightbox.hidden) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    var finish = function () {
      lightbox.hidden = true;
      frame.innerHTML = '';
      if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
    };
    if (reduced) finish();
    else window.setTimeout(finish, 260);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.player'), function (btn) {
    btn.addEventListener('click', function () {
      lastTrigger = btn;
      openVideo(
        btn.getAttribute('data-video'),
        btn.getAttribute('data-aspect'),
        btn.getAttribute('data-title')
      );
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeVideo();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeVideo();
  });
})();
