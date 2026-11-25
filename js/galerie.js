/* ==========================================================================
   GALERIA EN SECCIONES (galerie.html)
   Seccion 1: Galeria General (53 obras + filtros + paginacion + lightbox)
   Seccion 2: Galeria Garfield (22 Arcanos Mayores 0-XXI + sorteo de carta)
   Secciones extra: Portafolio, Bitacora Piedra, Bitacora Dibujo y Dioramas
   (visor secuencial page-flip + miniaturas lazy, datos en pdf-galleries.js).
   ========================================================================== */

(function () {
  const PAGE_SIZE = 25;
  const EXTRA_MODES = ['portafolio', 'piedra', 'dibujo', 'dioramas'];

  const MODE_TITLES = {
    general: 'C:\\MOEKAT\\GALERIE.HTM :: ARCHIVO VISUAL (53 OBRAS)',
    garfield: 'C:\\MOEKAT\\GARFIELD_TAROT.HTM :: 22 ARCANOS MAYORES (0 - XXI)',
    portafolio: 'C:\\MOEKAT\\PORTAFOLIO.HTM :: 24 LAMINAS (2 TOMOS)',
    piedra: 'C:\\MOEKAT\\BITACORA_PIEDRA.HTM :: 18 PAGINAS',
    dibujo: 'C:\\MOEKAT\\BITACORA_DIBUJO.HTM :: 1 LAMINA',
    dioramas: 'C:\\MOEKAT\\DIORAMAS.HTM :: 9 FOTOS + 1 VIDEO'
  };

  const MODE_MARQUEES = {
    general: [
      '* Galería visual de moekat (@moekat)',
      '* Dibujo Digital & Tradicional',
      '* Esculturas, Bisutería y Collage',
      '* Clic en cualquier obra para ampliar'
    ],
    garfield: [
      '* Galería Garfield :: Tarot (0 - XXI)',
      '* 22 Arcanos Mayores ilustrados por @moekat',
      '* De 0. El Loco a XXI. El Mundo',
      '* Clic en cualquier carta para ampliar'
    ],
    portafolio: [
      '* Portafolio 2026 de moekat (@moekat)',
      '* 24 láminas en 2 tomos',
      '* Escultura, grabado, acuarela y diorama',
      '* Visor secuencial estilo libro'
    ],
    piedra: [
      '* Bitácora :: Escultura en piedra',
      '* Bocetos, referencias y proceso completo',
      '* 18 páginas de archivo',
      '* Usa las flechas o las miniaturas'
    ],
    dibujo: [
      '* Bitácora :: Dibujo',
      '* Lámina de estudios y bocetos',
      '* Archivo de moekat (@moekat)',
      '* Clic para ampliar'
    ],
    dioramas: [
      '* Dioramas de moekat (@moekat)',
      '* Maquetas y escenas en miniatura',
      '* 9 fotos + recorrido en video',
      '* Clic en cada foto para ampliar'
    ]
  };

  document.addEventListener('DOMContentLoaded', () => {
    const data = window.PORTFOLIO_DATA;
    if (!data) return;

    const winTitle = document.getElementById('galWinTitle');
    const marqueeTrack = document.getElementById('galMarqueeTrack');
    const secGeneral = document.getElementById('gallerySectionGeneral');
    const secGarfield = document.getElementById('gallerySectionGarfield');
    const tabs = Array.from(document.querySelectorAll('.gallery-mode-tab[data-mode]'));
    const extraSections = {};
    EXTRA_MODES.forEach((key) => {
      extraSections[key] = document.getElementById(`gallerySection${key.charAt(0).toUpperCase()}${key.slice(1)}`);
    });

    const filtersWrap = document.getElementById('galleryFilters');
    const gridEl = document.getElementById('galleryGrid');
    const searchEl = document.getElementById('gallerySearch');
    const densityBtn = document.getElementById('galleryDensityBtn');
    const countEl = document.getElementById('galStatCount');
    const catEl = document.getElementById('galStatCat');
    const prevBtn = document.getElementById('galPrevBtn');
    const nextBtn = document.getElementById('galNextBtn');
    const pageInfo = document.getElementById('galPageInfo');

    const tarotGridEl = document.getElementById('garfieldTarotGrid');
    const drawTarotBtn = document.getElementById('drawTarotBtn');

    let activeMode = 'general';
    let activeCat = 'all';
    let searchQuery = '';
    let currentPage = 1;
    let isLarge = false;

    const renderedExtras = new Set();

    const params = new URLSearchParams(window.location.search);
    const paramTab = params.get('tab');
    const paramCat = params.get('cat');

    if (paramTab === 'garfield' || paramCat === 'tarot') {
      activeMode = 'garfield';
    } else if (EXTRA_MODES.includes(paramTab)) {
      activeMode = paramTab;
    } else if (paramCat && data.generalCategories.some((c) => c.id === paramCat)) {
      activeCat = paramCat;
    }

    function updateChrome(mode) {
      document.body.setAttribute('data-gallery-mode', mode);

      tabs.forEach((tab) => {
        const isActive = tab.dataset.mode === mode;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
      });

      if (secGeneral) secGeneral.hidden = mode !== 'general';
      if (secGarfield) secGarfield.hidden = mode !== 'garfield';
      EXTRA_MODES.forEach((key) => {
        const sec = extraSections[key];
        if (sec) sec.hidden = mode !== key;
      });

      if (winTitle) winTitle.textContent = MODE_TITLES[mode] || MODE_TITLES.general;

      if (marqueeTrack) {
        const segs = MODE_MARQUEES[mode] || MODE_MARQUEES.general;
        const htmlSegs = [...segs, ...segs]
          .map((s) => `<span class="mq-seg">${s}</span>`)
          .join('');
        marqueeTrack.innerHTML = htmlSegs;
      }
    }

    function setMode(mode, syncUrl = true) {
      activeMode = mode === 'garfield' || EXTRA_MODES.includes(mode) ? mode : 'general';
      updateChrome(activeMode);

      if (activeMode !== 'general' && activeMode !== 'garfield') {
        renderExtraGallery(activeMode);
      }

      if (syncUrl && window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        if (activeMode === 'general') {
          url.searchParams.delete('tab');
          if (activeCat !== 'all') url.searchParams.set('cat', activeCat);
          else url.searchParams.delete('cat');
        } else {
          url.searchParams.set('tab', activeMode);
          url.searchParams.delete('cat');
        }
        window.history.replaceState({}, '', url.toString());
      }
    }

    /* ----------------------------------------------------------------------
       Galeria general (filtros, busqueda, paginacion)
       ---------------------------------------------------------------------- */
    function renderFilterButtons() {
      if (!filtersWrap) return;
      filtersWrap.innerHTML = '';
      data.generalCategories.forEach((cat) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `cat-btn${cat.id === activeCat ? ' is-active' : ''}`;
        btn.textContent = `${cat.label} (${cat.count})`;
        btn.setAttribute('aria-pressed', String(cat.id === activeCat));
        btn.addEventListener('click', () => {
          activeCat = cat.id;
          currentPage = 1;
          renderFilterButtons();
          renderGeneralGallery();
        });
        filtersWrap.appendChild(btn);
      });
    }

    function getFilteredGeneral() {
      const q = searchQuery.trim().toLowerCase();
      return data.generalArtworks.filter((item) => {
        const matchCat = activeCat === 'all' || item.category === activeCat;
        const matchQuery =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.meta.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q);
        return matchCat && matchQuery;
      });
    }

    function renderGeneralGallery() {
      if (!gridEl) return;
      const filtered = getFilteredGeneral();
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      const start = (currentPage - 1) * PAGE_SIZE;
      const pageItems = filtered.slice(start, start + PAGE_SIZE);

      const activeCategoryObj =
        data.generalCategories.find((c) => c.id === activeCat) || data.generalCategories[0];
      if (countEl) countEl.textContent = `${filtered.length} / ${data.generalArtworks.length}`;
      if (catEl) catEl.textContent = activeCategoryObj.label;
      if (pageInfo) pageInfo.textContent = `Pag ${currentPage} / ${totalPages}`;
      if (prevBtn) prevBtn.disabled = currentPage <= 1;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

      gridEl.innerHTML = '';

      if (pageItems.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'gallery-empty';
        empty.innerHTML = `<strong>No se encontraron obras para "${searchQuery}"</strong><br>Prueba limpiando el buscador o cambiando de categoría &lt;3`;
        gridEl.appendChild(empty);
        return;
      }

      pageItems.forEach((item, localIdx) => {
        const globalIdx = start + localIdx;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'art-tile';
        btn.setAttribute('data-tip', `${item.title} • ${item.meta}`);
        btn.setAttribute('aria-label', `Abrir ${item.title} (${item.meta})`);

        const img = document.createElement('img');
        img.src = item.thumb;
        img.alt = item.title;
        img.loading = 'lazy';
        img.decoding = 'async';

        const badge = document.createElement('span');
        badge.className = 'art-tile-badge';
        badge.textContent = item.title;

        btn.appendChild(img);
        btn.appendChild(badge);
        btn.addEventListener('click', () => {
          if (window.PastelLightbox) {
            window.PastelLightbox.open(filtered, globalIdx);
          }
        });
        gridEl.appendChild(btn);
      });

      const cols = isLarge ? 3 : 5;
      const remainder = pageItems.length % cols;
      const fillerCount = remainder === 0 ? 0 : cols - remainder;
      for (let k = 0; k < fillerCount; k++) {
        const ph = document.createElement('div');
        ph.className = 'art-placeholder';
        ph.setAttribute('aria-hidden', 'true');
        ph.textContent = '*';
        gridEl.appendChild(ph);
      }
    }

    /* ----------------------------------------------------------------------
       Galeria Garfield (tarot)
       ---------------------------------------------------------------------- */
    function renderGarfieldTarot() {
      if (!tarotGridEl) return;
      const deck = data.garfieldTarot || [];
      tarotGridEl.innerHTML = '';

      deck.forEach((card, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tarot-card';
        btn.setAttribute('data-tarot-order', String(card.tarotOrder));
        btn.setAttribute('data-tip', `${card.title} (${card.cardEnglish})`);
        btn.setAttribute('aria-label', `Ver carta ${card.title} (${card.cardEnglish})`);

        const head = document.createElement('div');
        head.className = 'tarot-card-head';
        const numSpan = document.createElement('span');
        numSpan.className = 'tarot-card-num';
        numSpan.textContent = card.roman;
        const typeSpan = document.createElement('span');
        typeSpan.textContent = 'Arcano Mayor';
        head.appendChild(numSpan);
        head.appendChild(typeSpan);

        const imgBox = document.createElement('div');
        imgBox.className = 'tarot-card-img-box';
        const img = document.createElement('img');
        img.src = card.thumb;
        img.alt = `${card.title} - Garfield Tarot por moekat`;
        img.loading = 'lazy';
        img.decoding = 'async';
        imgBox.appendChild(img);

        const caption = document.createElement('div');
        caption.className = 'tarot-card-caption';
        const titleEl = document.createElement('strong');
        titleEl.textContent = card.cardName;
        const subEl = document.createElement('span');
        subEl.textContent = `${card.roman} | ${card.cardEnglish}`;
        caption.appendChild(titleEl);
        caption.appendChild(subEl);

        btn.appendChild(head);
        btn.appendChild(imgBox);
        btn.appendChild(caption);

        btn.addEventListener('click', () => {
          if (window.PastelLightbox) {
            window.PastelLightbox.open(deck, idx);
          }
        });

        tarotGridEl.appendChild(btn);
      });
    }

    /* ----------------------------------------------------------------------
       Secciones extra: Portafolio / Bitacoras (page-flip + miniaturas)
       ---------------------------------------------------------------------- */
    function renderPageflipGroup(group) {
      const pages = group.pages || [];
      const groupEl = document.createElement('section');
      groupEl.className = 'pageflip-group';

      const title = document.createElement('h3');
      title.className = 'pageflip-group-title';
      title.textContent = group.title;
      const count = document.createElement('span');
      count.textContent = `(${pages.length} láminas)`;
      title.appendChild(count);
      groupEl.appendChild(title);

      const flip = document.createElement('div');
      flip.className = 'pageflip';

      const stage = document.createElement('div');
      stage.className = 'pageflip-stage';

      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'pageflip-arrow';
      prev.setAttribute('aria-label', 'Lámina anterior');
      prev.textContent = '<<';

      const imageBtn = document.createElement('button');
      imageBtn.type = 'button';
      imageBtn.className = 'pageflip-image-btn';
      imageBtn.setAttribute('aria-label', 'Abrir lámina en el visor');
      const stageImg = document.createElement('img');
      stageImg.alt = group.title;
      stageImg.loading = 'eager';
      stageImg.decoding = 'async';
      imageBtn.appendChild(stageImg);

      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'pageflip-arrow';
      next.setAttribute('aria-label', 'Lámina siguiente');
      next.textContent = '>>';

      stage.appendChild(prev);
      stage.appendChild(imageBtn);
      stage.appendChild(next);

      const controls = document.createElement('div');
      controls.className = 'pageflip-controls';
      const counter = document.createElement('span');
      counter.className = 'pageflip-counter';
      const openBtn = document.createElement('button');
      openBtn.type = 'button';
      openBtn.className = 'candy-btn butter';
      openBtn.textContent = '[+] Abrir en visor';
      controls.appendChild(counter);
      controls.appendChild(openBtn);

      const thumbs = document.createElement('div');
      thumbs.className = 'pageflip-thumbs';
      thumbs.setAttribute('aria-label', `Miniaturas de ${group.title}`);

      let index = 0;
      const thumbButtons = [];

      function renderStage() {
        const page = pages[index];
        if (!page) return;
        stageImg.src = page.src;
        stageImg.alt = `${page.title} · ${page.meta}`;
        counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`;
        prev.disabled = index <= 0;
        next.disabled = index >= pages.length - 1;
        thumbButtons.forEach((tb, i) => tb.classList.toggle('is-active', i === index));
      }

      function go(delta) {
        const target = Math.min(pages.length - 1, Math.max(0, index + delta));
        if (target === index) return;
        index = target;
        renderStage();
      }

      pages.forEach((page, i) => {
        const tb = document.createElement('button');
        tb.type = 'button';
        tb.className = 'pageflip-thumb';
        tb.setAttribute('aria-label', `Ver ${page.title}`);
        tb.title = page.title;
        const timg = document.createElement('img');
        timg.src = page.thumb;
        timg.alt = page.title;
        timg.loading = 'lazy';
        timg.decoding = 'async';
        tb.appendChild(timg);
        tb.addEventListener('click', () => {
          index = i;
          renderStage();
        });
        thumbs.appendChild(tb);
        thumbButtons.push(tb);
      });

      prev.addEventListener('click', () => go(-1));
      next.addEventListener('click', () => go(1));
      imageBtn.addEventListener('click', () => {
        if (window.PastelLightbox) window.PastelLightbox.open(pages, index);
      });
      openBtn.addEventListener('click', () => {
        if (window.PastelLightbox) window.PastelLightbox.open(pages, index);
      });

      flip.appendChild(stage);
      flip.appendChild(controls);
      flip.appendChild(thumbs);
      groupEl.appendChild(flip);

      renderStage();
      return groupEl;
    }

    function renderDioramas(extra, body) {
      const images = extra.images || [];
      const grid = document.createElement('div');
      grid.className = 'diorama-grid';

      images.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'art-tile';
        btn.setAttribute('data-tip', `${item.title} • ${item.meta}`);
        btn.setAttribute('aria-label', `Abrir ${item.title}`);

        const img = document.createElement('img');
        img.src = item.thumb;
        img.alt = item.title;
        img.loading = 'lazy';
        img.decoding = 'async';

        const badge = document.createElement('span');
        badge.className = 'art-tile-badge';
        badge.textContent = item.title;

        btn.appendChild(img);
        btn.appendChild(badge);
        btn.addEventListener('click', () => {
          if (window.PastelLightbox) window.PastelLightbox.open(images, idx);
        });
        grid.appendChild(btn);
      });
      body.appendChild(grid);

      if (extra.video && extra.video.src) {
        const frame = document.createElement('div');
        frame.className = 'video-frame';

        const vTitle = document.createElement('p');
        vTitle.className = 'video-frame-title';
        vTitle.textContent = `:: ${extra.video.title || 'Diorama en video'} ::`;

        const video = document.createElement('video');
        video.controls = true;
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('muted', '');
        if (extra.video.poster) video.poster = extra.video.poster;

        const source = document.createElement('source');
        source.src = extra.video.src;
        source.type = 'video/mp4';
        video.appendChild(source);

        const caption = document.createElement('p');
        caption.className = 'video-frame-caption';
        caption.textContent = extra.video.meta || 'Video · moekat';

        frame.appendChild(vTitle);
        frame.appendChild(video);
        frame.appendChild(caption);
        body.appendChild(frame);
      }
    }

    function renderExtraGallery(key) {
      if (renderedExtras.has(key)) return;
      const extra = (window.PDF_GALLERIES || {})[key];
      const section = extraSections[key];
      if (!extra || !section) return;
      renderedExtras.add(key);

      const introEl = section.querySelector('.extra-gallery-intro');
      const badgesEl = section.querySelector('.extra-gallery-badges');
      const body = section.querySelector('[data-extra-body]');
      if (!introEl || !body) return;

      introEl.textContent = extra.intro || '';

      if (badgesEl) {
        badgesEl.innerHTML = '';
        const totalPages = (extra.groups || []).reduce((acc, g) => acc + (g.pages ? g.pages.length : 0), 0);
        const badges = key === 'dioramas'
          ? [`${(extra.images || []).length} fotos`, '1 video', 'Carga diferida']
          : [`${totalPages} láminas`, 'Visor secuencial', 'Carga diferida'];
        badges.forEach((txt, i) => {
          const b = document.createElement('span');
          b.className = `pastel-badge ${i === 1 ? 'lavender' : 'butter'}`;
          b.textContent = txt;
          badgesEl.appendChild(b);
        });
      }

      body.innerHTML = '';
      if (key === 'dioramas') {
        renderDioramas(extra, body);
      } else {
        (extra.groups || []).forEach((group) => {
          body.appendChild(renderPageflipGroup(group));
        });
      }
    }

    /* ----------------------------------------------------------------------
       Eventos de UI
       ---------------------------------------------------------------------- */
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => setMode(tab.dataset.mode, true));
    });

    if (drawTarotBtn) {
      drawTarotBtn.addEventListener('click', () => {
        const deck = data.garfieldTarot || [];
        if (!deck.length || !window.PastelLightbox) return;
        const idx = Math.floor(Math.random() * deck.length);
        window.PastelLightbox.open(deck, idx);
      });
    }

    if (searchEl) {
      searchEl.addEventListener('input', () => {
        searchQuery = searchEl.value || '';
        currentPage = 1;
        renderGeneralGallery();
      });
    }

    if (densityBtn && gridEl) {
      densityBtn.addEventListener('click', () => {
        isLarge = !isLarge;
        gridEl.classList.toggle('is-large', isLarge);
        densityBtn.textContent = isLarge ? 'Vista: 5 cols' : 'Vista: Amplia';
        renderGeneralGallery();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage -= 1;
          renderGeneralGallery();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const filtered = getFilteredGeneral();
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        if (currentPage < totalPages) {
          currentPage += 1;
          renderGeneralGallery();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    renderFilterButtons();
    renderGeneralGallery();
    renderGarfieldTarot();
    setMode(activeMode, false);
  });
})();
