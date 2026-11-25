/* ==========================================================================
   LÓGICA DEL HUB PRINCIPAL (home.html)
   ========================================================================== */

(function () {
  const FILTERS = [
    { name: 'Pastel Kawaii', css: 'none', crt: false },
    { name: 'Durazno Soñador', css: 'sepia(0.16) saturate(1.12) brightness(1.02) hue-rotate(-8deg)', crt: false },
    { name: 'Leche de Lavanda', css: 'hue-rotate(14deg) saturate(0.95) brightness(1.03)', crt: false },
    { name: 'Menta Retro', css: 'hue-rotate(-14deg) contrast(1.04) saturate(1.06)', crt: true },
    { name: 'Gyaru Sepia', css: 'sepia(0.32) contrast(1.06) brightness(1.01)', crt: false }
  ];

  function initFilters() {
    const stage = document.getElementById('homeFilterStage');
    const crt = document.getElementById('crtScanlines');
    const btn = document.getElementById('filterToggleBtn');
    const label = document.getElementById('filterLabel');
    if (!stage || !btn) return;

    let idx = 0;
    try {
      const saved = parseInt(localStorage.getItem('pastel_home_filter') || '0', 10);
      if (!Number.isNaN(saved) && saved >= 0 && saved < FILTERS.length) idx = saved;
    } catch {}

    function applyFilter() {
      const f = FILTERS[idx];
      stage.style.filter = f.css;
      if (crt) crt.classList.toggle('is-active', f.crt);
      if (label) label.textContent = f.name;
      try {
        localStorage.setItem('pastel_home_filter', String(idx));
      } catch {}
    }

    btn.addEventListener('click', () => {
      idx = (idx + 1) % FILTERS.length;
      applyFilter();
    });

    applyFilter();
  }

  function initMobileSidebar() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('homeSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (!btn || !sidebar || !backdrop) return;

    function toggle(open) {
      const next = typeof open === 'boolean' ? open : !sidebar.classList.contains('is-open');
      sidebar.classList.toggle('is-open', next);
      backdrop.classList.toggle('is-open', next);
      btn.setAttribute('aria-expanded', String(next));
    }

    btn.addEventListener('click', () => toggle());
    backdrop.addEventListener('click', () => toggle(false));
    sidebar.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 860) toggle(false);
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggle(false);
    });
  }

  function initRandomShowcase() {
    const data = window.PORTFOLIO_DATA;
    if (!data) return;

    const imgEl = document.getElementById('randomArtImg');
    const titleEl = document.getElementById('randomArtTitle');
    const metaEl = document.getElementById('randomArtMeta');
    const openBtn = document.getElementById('showcaseOpenBtn');
    const shuffleBtn = document.getElementById('shuffleArtBtn');
    const miniPaintBtn = document.getElementById('miniPaintBtn');
    const miniPaintImg = document.getElementById('miniPaintImg');

    let currentIdx = 0;

    function setArtwork(idx) {
      currentIdx = ((idx % data.artworks.length) + data.artworks.length) % data.artworks.length;
      const item = data.artworks[currentIdx];
      if (imgEl) {
        imgEl.src = item.src;
        imgEl.alt = `${item.title} - ${item.meta}`;
      }
      if (miniPaintImg) {
        miniPaintImg.src = item.thumb;
        miniPaintImg.alt = item.title;
      }
      if (titleEl) titleEl.textContent = item.title;
      if (metaEl) metaEl.textContent = `${item.categoryLabel} • ${item.meta}`;
    }

    function pickRandom() {
      let next = Math.floor(Math.random() * data.artworks.length);
      if (next === currentIdx && data.artworks.length > 1) {
        next = (next + 1) % data.artworks.length;
      }
      setArtwork(next);
    }

    if (shuffleBtn) shuffleBtn.addEventListener('click', pickRandom);
    if (miniPaintBtn) miniPaintBtn.addEventListener('click', pickRandom);
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        if (window.PastelLightbox) {
          window.PastelLightbox.open(data.artworks, currentIdx);
        }
      });
    }

    setArtwork(0);
  }

  function initTabs() {
    const tabBtns = Array.from(document.querySelectorAll('#hubTabs [data-tab]'));
    const panels = Array.from(document.querySelectorAll('.hub-panel'));
    if (!tabBtns.length || !panels.length) return;

    function activateTab(name, scrollToTabs = false) {
      const valid = tabBtns.some((b) => b.dataset.tab === name) ? name : 'welcome';
      tabBtns.forEach((btn) => {
        const active = btn.dataset.tab === valid;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.id === `panel-${valid}`);
      });
      if (scrollToTabs) {
        const target = document.getElementById('hubTabs');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });

    document.querySelectorAll('[data-open-tab]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        const tabName = trigger.getAttribute('data-open-tab');
        if (!tabName) return;
        if (trigger.tagName === 'A') e.preventDefault();
        activateTab(tabName, true);
      });
    });

    const params = new URLSearchParams(window.location.search);
    const obra = params.get('obra');
    if (obra) {
      const msgEl = document.getElementById('contactMessage');
      if (msgEl) {
        msgEl.value = `Hola Demian, me interesa encargar una obra similar a: ${obra}.`;
      }
      activateTab('contacto', true);
    } else if (window.location.hash) {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['welcome', 'musica', 'comisiones', 'contacto'].includes(hash)) {
        activateTab(hash, true);
      }
    }
  }

  function initFeaturedAndSheets() {
    const data = window.PORTFOLIO_DATA;
    if (!data) return;

    const featuredItems = data.featuredIds.map((id) => data.getById(id));
    document.querySelectorAll('[data-featured-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-featured-idx') || '0', 10);
        if (window.PastelLightbox) window.PastelLightbox.open(featuredItems, i);
      });
    });

    document.querySelectorAll('[data-sheet-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-sheet-idx') || '0', 10);
        if (window.PastelLightbox) window.PastelLightbox.open(data.commissionSheets, i);
      });
    });
  }

  function initJukebox() {
    const audio = document.getElementById('jukeboxAudio');
    const canvas = document.getElementById('jukeboxCanvas');
    const playBtn = document.getElementById('jukeboxPlayBtn');
    const stopBtn = document.getElementById('jukeboxStopBtn');
    const progress = document.getElementById('jukeboxProgress');
    const fill = document.getElementById('jukeboxProgressFill');
    const vol = document.getElementById('jukeboxVol');
    const timeEl = document.getElementById('jukeboxTime');
    if (!audio || !canvas) return;

    const ctx = canvas.getContext('2d');
    let playing = false;
    let phase = 0;
    let rafId = null;

    function fmt(sec) {
      if (!sec || !Number.isFinite(sec)) return '00:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      const mm = m < 10 ? `0${m}` : String(m);
      const ss = s < 10 ? `0${s}` : String(s);
      return `${mm}:${ss}`;
    }

    function drawBars() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#271236';
      ctx.fillRect(0, 0, w, h);

      const bars = 24;
      const gap = 6;
      const barW = (w - 28 - (bars - 1) * gap) / bars;
      const palette = ['#FF9EC7', '#FFB890', '#FFE07A', '#85E3C3', '#8ED4FF', '#C4AAFF'];

      for (let i = 0; i < bars; i++) {
        const ratio = playing
          ? 0.25 + 0.65 * Math.abs(Math.sin(phase * 1.4 + i * 0.45) * Math.cos(phase * 0.8 + i * 0.22))
          : 0.14 + 0.08 * Math.sin(phase + i * 0.5);
        const bh = ratio * (h - 24);
        const x = 14 + i * (barW + gap);
        const y = h - 10 - bh;
        ctx.fillStyle = palette[i % palette.length];
        ctx.fillRect(x, y, barW, bh);
        ctx.fillStyle = '#FFF9FB';
        ctx.fillRect(x, Math.max(8, y - 3), barW, 2);
      }

      if (playing) {
        phase += 0.09;
        rafId = requestAnimationFrame(drawBars);
      } else {
        rafId = null;
      }
    }

    if (vol) {
      audio.volume = parseFloat(vol.value || '0.75');
      vol.addEventListener('input', () => {
        audio.volume = parseFloat(vol.value);
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play().catch(() => {});
          playing = true;
          playBtn.textContent = '|| Pausa';
          if (!rafId) drawBars();
        } else {
          audio.pause();
          playing = false;
          playBtn.textContent = '> Play';
        }
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        playing = false;
        if (playBtn) playBtn.textContent = '> Play';
        if (fill) fill.style.width = '0%';
        if (timeEl) timeEl.textContent = '00:00';
        drawBars();
      });
    }

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      if (fill) fill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
      if (timeEl) timeEl.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
    });

    audio.addEventListener('ended', () => {
      playing = false;
      if (playBtn) playBtn.textContent = '> Play';
      drawBars();
    });

    if (progress) {
      progress.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const rect = progress.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * audio.duration;
      });
    }

    drawBars();
  }

  function initCompanionWidgets() {
    const clockEl = document.getElementById('liveClock');
    function tick() {
      if (!clockEl) return;
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }
    tick();
    setInterval(tick, 1000);

    const clapBtn = document.getElementById('clapBtn');
    const clapCount = document.getElementById('clapCount');
    if (clapBtn && clapCount) {
      let count = 71;
      try {
        const stored = parseInt(localStorage.getItem('pastel_kudos_count') || '71', 10);
        if (!Number.isNaN(stored) && stored >= 71) count = stored;
      } catch {}
      clapCount.textContent = String(count);

      clapBtn.addEventListener('click', () => {
        count += 1;
        clapCount.textContent = String(count);
        try {
          localStorage.setItem('pastel_kudos_count', String(count));
        } catch {}
      });
    }
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const clearBtn = document.getElementById('clearFormBtn');
    if (!form || !status) return;

    function showStatus(ok, msg) {
      status.className = `form-status ${ok ? 'is-ok' : 'is-err'}`;
      status.textContent = msg;
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        form.reset();
        status.className = 'form-status';
        status.textContent = '';
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const original = submitBtn ? submitBtn.textContent : 'Enviar';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando <3...';
      }

      const fd = new FormData(form);
      const emailVal = fd.get('email');
      if (emailVal) fd.set('_replyto', String(emailVal));

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: fd,
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          showStatus(true, `¡Gracias ${fd.get('name') || ''}! Tu consulta se envió correctamente a Demian.`);
          form.reset();
        } else {
          const data = await res.json().catch(() => null);
          showStatus(false, (data && data.error) || 'No se pudo enviar el formulario. Intenta de nuevo.');
        }
      } catch {
        showStatus(false, 'Error de conexión al enviar. Verifica tu red e inténtalo otra vez.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = original;
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initMobileSidebar();
    initRandomShowcase();
    initTabs();
    initFeaturedAndSheets();
    initJukebox();
    initCompanionWidgets();
    initContactForm();
  });
})();
