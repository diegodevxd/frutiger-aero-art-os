/* ==========================================================================
   EFECTOS COMPARTIDOS — Preloader, Transición entre páginas, Wobble, Rainbow,
   Partículas pastel, Destellos del cursor, Tooltip flotante y Lightbox.
   ========================================================================== */

(function () {
  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isCoarsePointer = () =>
    window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  /* ----------------------------------------------------------------------
     1. Preloader (#loading) & Cortina de Transición (.page-veil)
     ---------------------------------------------------------------------- */
  function hidePreloader() {
    const loader = document.getElementById('loading');
    if (loader && !loader.classList.contains('is-loaded')) {
      loader.classList.add('is-loaded');
    }
  }

  function initPreloaderAndTransitions() {
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 120);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 150), { once: true });
      setTimeout(hidePreloader, 520);
    }

    let veil = document.querySelector('.page-veil');
    if (!veil) {
      veil = document.createElement('div');
      veil.className = 'page-veil';
      veil.setAttribute('aria-hidden', 'true');
      document.body.appendChild(veil);
    }

    window.addEventListener('pageshow', () => {
      veil.classList.remove('is-entering');
      hidePreloader();
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.hasAttribute('download') || link.getAttribute('target') === '_blank') return;

      const rawHref = link.getAttribute('href') || '';
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('javascript:')) return;

      let targetUrl;
      try {
        targetUrl = new URL(rawHref, window.location.href);
      } catch {
        return;
      }

      if (targetUrl.origin !== window.location.origin) return;
      if (targetUrl.pathname === window.location.pathname && targetUrl.hash) return;

      if (prefersReducedMotion()) return;

      e.preventDefault();
      veil.classList.add('is-entering');
      setTimeout(() => {
        window.location.href = targetUrl.href;
      }, 175);
    });
  }

  /* ----------------------------------------------------------------------
     2. Texto Wobble ([data-wobble]) y Arcoíris Pastel ([data-rainbow])
     ---------------------------------------------------------------------- */
  function splitTextEffect(selector, className) {
    document.querySelectorAll(selector).forEach((el) => {
      if (el.dataset.fxApplied === '1') return;
      const text = el.textContent || '';
      el.dataset.fxApplied = '1';
      el.setAttribute('aria-label', text);
      el.textContent = '';

      let charIdx = 0;
      const tokens = text.split(/(\s+)/);
      tokens.forEach((tok) => {
        if (/^\s+$/.test(tok)) {
          const space = document.createTextNode(' ');
          el.appendChild(space);
          charIdx += tok.length;
          return;
        }
        const wordWrap = document.createElement('span');
        wordWrap.style.display = 'inline-block';
        wordWrap.style.whiteSpace = 'nowrap';
        wordWrap.setAttribute('aria-hidden', 'true');
        Array.from(tok).forEach((ch) => {
          const span = document.createElement('span');
          span.className = className;
          span.style.setProperty('--char-i', String(charIdx++));
          span.textContent = ch;
          wordWrap.appendChild(span);
        });
        el.appendChild(wordWrap);
      });
    });
  }

  /* ----------------------------------------------------------------------
     3. Tooltip flotante pastel que sigue al cursor ([data-tip])
     ---------------------------------------------------------------------- */
  function initCursorTooltip() {
    if (isCoarsePointer()) return;

    let tip = document.getElementById('pastel-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'pastel-tooltip';
      tip.setAttribute('role', 'tooltip');
      document.body.appendChild(tip);
    }

    let currentTarget = null;

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-tip]');
      if (!target) return;
      const msg = target.getAttribute('data-tip');
      if (!msg) return;
      currentTarget = target;
      tip.textContent = msg;
      tip.classList.add('is-visible');
    });

    document.addEventListener('mouseout', (e) => {
      if (!currentTarget) return;
      const related = e.relatedTarget ? e.relatedTarget.closest('[data-tip]') : null;
      if (related !== currentTarget) {
        currentTarget = null;
        tip.classList.remove('is-visible');
      }
    });

    document.addEventListener(
      'mousemove',
      (e) => {
        if (!currentTarget) return;
        const offset = 16;
        const rect = tip.getBoundingClientRect();
        const maxLeft = Math.max(8, window.innerWidth - rect.width - 10);
        const maxTop = Math.max(8, window.innerHeight - rect.height - 10);
        const x = Math.min(e.clientX + offset, maxLeft);
        const y = Math.min(e.clientY + offset, maxTop);
        tip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------------------
     4. Lluvia suave de estrellas / flores pastel (body[data-particles])
     ---------------------------------------------------------------------- */
  const PARTICLE_SVGS = {
    starPink: `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.2 6.7.6-5 4.4 1.5 6.6L12 16.3 6.2 19.8l1.5-6.6-5-4.4 6.7-.6z" fill="#FFD6E8" stroke="#E68CB7" stroke-width="1.4"/></svg>`,
    starButter: `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 6.4 6.6.6-5 4.4 1.4 6.6-5.4-3.4-5.4 3.4 1.4-6.6-5-4.4 6.6-.6z" fill="#FFF5BE" stroke="#E5B942" stroke-width="1.4"/></svg>`,
    heartLav: `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.7-9-9.5C1.9 7.8 4.4 4.5 7.8 4.5c1.9 0 3.4 1 4.2 2.4.8-1.4 2.3-2.4 4.2-2.4 3.4 0 5.9 3.3 4.8 7-1.5 4.8-9 9.5-9 9.5z" fill="#E8DCFF" stroke="#B492F5" stroke-width="1.5"/></svg>`,
    flowerMint: `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="6" r="4" fill="#FFD6E8"/><circle cx="18" cy="11" r="4" fill="#E8DCFF"/><circle cx="15.5" cy="17.5" r="4" fill="#CDF7E7"/><circle cx="8.5" cy="17.5" r="4" fill="#D6F0FF"/><circle cx="6" cy="11" r="4" fill="#FFE4D1"/><circle cx="12" cy="12" r="3.4" fill="#FFE07A"/></svg>`
  };

  function initFallingParticles() {
    const mode = document.body.getAttribute('data-particles');
    if (!mode || prefersReducedMotion()) return;

    const layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    const poolKeys =
      mode === 'flowers'
        ? ['flowerMint', 'heartLav', 'starPink']
        : ['starPink', 'starButter', 'heartLav'];

    function spawnCharm() {
      if (document.hidden || layer.childElementCount >= 16) return;
      const el = document.createElement('div');
      el.className = 'falling-charm';
      const key = poolKeys[Math.floor(Math.random() * poolKeys.length)];
      el.innerHTML = PARTICLE_SVGS[key];
      el.style.left = `${Math.round(Math.random() * 96)}%`;
      const scale = 0.72 + Math.random() * 0.65;
      el.style.transform = `scale(${scale.toFixed(2)})`;
      const dur = 7.5 + Math.random() * 5;
      el.style.animationDuration = `${dur.toFixed(2)}s`;
      layer.appendChild(el);
      setTimeout(() => {
        el.remove();
      }, dur * 1000 + 200);
    }

    for (let i = 0; i < 6; i++) {
      setTimeout(spawnCharm, i * 240);
    }
    setInterval(spawnCharm, 900);
  }

  /* ----------------------------------------------------------------------
     5. Rastro sutil de destellos pastel al mover el cursor
     ---------------------------------------------------------------------- */
  function initCursorSparkles() {
    if (prefersReducedMotion() || isCoarsePointer()) return;
    const symbols = ['*', '<3', '+', 'o'];
    const colors = ['#E68CB7', '#B492F5', '#5AC8A6', '#F4A261', '#6BB8EE'];
    let lastTime = 0;

    document.addEventListener(
      'mousemove',
      (e) => {
        const now = performance.now();
        if (now - lastTime < 85) return;
        lastTime = now;

        const spark = document.createElement('span');
        spark.className = 'cursor-sparkle';
        spark.setAttribute('aria-hidden', 'true');
        spark.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        spark.style.color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 680);
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------------------
     6. Revelado al hacer scroll (.reveal)
     ---------------------------------------------------------------------- */
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ----------------------------------------------------------------------
     7. Lightbox universal para obras y láminas de comisiones
     ---------------------------------------------------------------------- */
  function createLightbox() {
    let modal = document.getElementById('pastelLightbox');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pastelLightbox';
      modal.className = 'lightbox';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'lbTitle');
      modal.innerHTML = `
        <div class="lightbox-dialog">
          <div class="lightbox-header">
            <span class="lightbox-counter" id="lbCounter">1 / 1</span>
            <button type="button" class="lightbox-close" id="lbCloseBtn" aria-label="Cerrar visor">×</button>
          </div>
          <div class="lightbox-stage" id="lbStage">
            <img id="lbImage" class="lightbox-img" alt="">
          </div>
          <div class="lightbox-footer">
            <div class="lightbox-meta-wrap">
              <h3 id="lbTitle">Obra</h3>
              <p id="lbMeta">Archivo visual • @moekat</p>
            </div>
            <div class="lightbox-actions">
              <button type="button" class="candy-btn lavender" id="lbPrevBtn" aria-label="Obra anterior">&lt;&lt; Anterior</button>
              <button type="button" class="candy-btn lavender" id="lbNextBtn" aria-label="Siguiente obra">Siguiente &gt;&gt;</button>
              <button type="button" class="candy-btn mint" id="lbZoomBtn">[+] Acercar</button>
              <a class="candy-btn" id="lbCommissionLink" href="home.html#contacto">&lt;3 Encargar similar</a>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const imgEl = modal.querySelector('#lbImage');
    const titleEl = modal.querySelector('#lbTitle');
    const metaEl = modal.querySelector('#lbMeta');
    const counterEl = modal.querySelector('#lbCounter');
    const zoomBtn = modal.querySelector('#lbZoomBtn');
    const commissionLink = modal.querySelector('#lbCommissionLink');
    const stage = modal.querySelector('#lbStage');

    let items = [];
    let index = 0;
    let zoomed = false;

    function render() {
      const current = items[index];
      if (!current) return;
      imgEl.src = current.src;
      imgEl.alt = current.title || 'Obra de moekat';
      imgEl.classList.toggle('is-zoomed', zoomed);
      titleEl.textContent = current.title || 'Obra';
      metaEl.textContent = current.meta || 'Archivo visual';
      counterEl.textContent = `${index + 1} / ${items.length}`;
      zoomBtn.textContent = zoomed ? '[-] Ajustar' : '[+] Acercar';
      const q = encodeURIComponent(`${current.title} (${current.meta || 'Portafolio'})`);
      commissionLink.href = `home.html?obra=${q}#contacto`;

      const single = items.length <= 1;
      modal.querySelector('#lbPrevBtn').hidden = single;
      modal.querySelector('#lbNextBtn').hidden = single;
    }

    function open(list, startIdx = 0) {
      if (!Array.isArray(list) || list.length === 0) return;
      items = list;
      index = ((startIdx % list.length) + list.length) % list.length;
      zoomed = false;
      render();
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function step(delta) {
      if (items.length <= 1) return;
      index = (index + delta + items.length) % items.length;
      zoomed = false;
      render();
    }

    modal.querySelector('#lbCloseBtn').addEventListener('click', close);
    modal.querySelector('#lbPrevBtn').addEventListener('click', () => step(-1));
    modal.querySelector('#lbNextBtn').addEventListener('click', () => step(1));
    zoomBtn.addEventListener('click', () => {
      zoomed = !zoomed;
      render();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      }
    });

    let touchX = 0;
    stage.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length === 1) touchX = e.touches[0].clientX;
      },
      { passive: true }
    );
    stage.addEventListener(
      'touchend',
      (e) => {
        if (zoomed || !e.changedTouches.length) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );

    return { open, close, step };
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPreloaderAndTransitions();
    splitTextEffect('[data-wobble]', 'wobble-char');
    splitTextEffect('[data-rainbow]', 'rainbow-char');
    initCursorTooltip();
    initFallingParticles();
    initCursorSparkles();
    initScrollReveal();
    window.PastelLightbox = createLightbox();
  });
})();
