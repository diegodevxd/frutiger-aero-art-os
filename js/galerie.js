/* ==========================================================================
   GALERIA EN DOS SECCIONES (galerie.html)
   Seccion 1: Galeria General (49 obras + filtros + paginacion + lightbox)
   Seccion 2: Galeria Garfield (22 Arcanos Mayores 0-XXI + sorteo de carta)
   ========================================================================== */

(function () {
  const PAGE_SIZE = 25;

  document.addEventListener('DOMContentLoaded', () => {
    const data = window.PORTFOLIO_DATA;
    if (!data) return;

    const winTitle = document.getElementById('galWinTitle');
    const marqueeTrack = document.getElementById('galMarqueeTrack');
    const tabGeneral = document.getElementById('tabBtnGeneral');
    const tabGarfield = document.getElementById('tabBtnGarfield');
    const secGeneral = document.getElementById('gallerySectionGeneral');
    const secGarfield = document.getElementById('gallerySectionGarfield');

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

    const params = new URLSearchParams(window.location.search);
    const paramTab = params.get('tab');
    const paramCat = params.get('cat');

    if (paramTab === 'garfield' || paramCat === 'tarot') {
      activeMode = 'garfield';
    } else if (paramCat && data.generalCategories.some((c) => c.id === paramCat)) {
      activeCat = paramCat;
    }

    function updateChrome(mode) {
      document.body.setAttribute('data-gallery-mode', mode);
      const isGarf = mode === 'garfield';

      if (tabGeneral) {
        tabGeneral.classList.toggle('is-active', !isGarf);
        tabGeneral.setAttribute('aria-selected', String(!isGarf));
      }
      if (tabGarfield) {
        tabGarfield.classList.toggle('is-active', isGarf);
        tabGarfield.setAttribute('aria-selected', String(isGarf));
      }
      if (secGeneral) secGeneral.hidden = isGarf;
      if (secGarfield) secGarfield.hidden = !isGarf;

      if (winTitle) {
        winTitle.textContent = isGarf
          ? 'C:\\DMXN_08\\GARFIELD_TAROT.HTM :: 22 ARCANOS MAYORES (0 - XXI)'
          : 'C:\\DMXN_08\\GALERIE.HTM :: ARCHIVO VISUAL (49 OBRAS)';
      }

      if (marqueeTrack) {
        const line = isGarf
          ? '* GALERIA GARFIELD :: MAZO COMPLETO DE TAROT * 22 ARCANOS MAYORES * DE 0. EL LOCO A XXI. EL MUNDO * DIBUJOS ORIGINALES DE @DMXN_08 *'
          : '* GALERIA DE DEMIAN TENORIO (@DMXN_08) * DIBUJO DIGITAL * TRADICIONAL * ESCULTURAS * BISUTERIA * COLLAGE * EMOTES * CLIC EN CUALQUIER OBRA PARA AMPLIAR *';
        marqueeTrack.innerHTML = `<span>${line}</span><span>${line}</span>`;
      }
    }

    function setMode(mode, syncUrl = true) {
      activeMode = mode === 'garfield' ? 'garfield' : 'general';
      updateChrome(activeMode);

      if (syncUrl && window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        if (activeMode === 'garfield') {
          url.searchParams.set('tab', 'garfield');
          url.searchParams.delete('cat');
        } else {
          url.searchParams.delete('tab');
          if (activeCat !== 'all') url.searchParams.set('cat', activeCat);
        }
        window.history.replaceState({}, '', url.toString());
      }
    }

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
      if (catEl) catEl.textContent = activeCategoryObj.label.toUpperCase();
      if (pageInfo) pageInfo.textContent = `PAG ${currentPage} / ${totalPages}`;
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
        img.loading = 'eager';
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
        typeSpan.textContent = 'ARCANO MAYOR';
        head.appendChild(numSpan);
        head.appendChild(typeSpan);

        const imgBox = document.createElement('div');
        imgBox.className = 'tarot-card-img-box';
        const img = document.createElement('img');
        img.src = card.thumb;
        img.alt = `${card.title} - Garfield Tarot por Demian Tenorio`;
        img.loading = 'eager';
        img.decoding = 'async';
        imgBox.appendChild(img);

        const caption = document.createElement('div');
        caption.className = 'tarot-card-caption';
        const titleEl = document.createElement('strong');
        titleEl.textContent = card.cardName;
        const subEl = document.createElement('span');
        subEl.textContent = `${card.roman} | ${card.cardEnglish.toUpperCase()}`;
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

    if (tabGeneral) {
      tabGeneral.addEventListener('click', () => setMode('general', true));
    }
    if (tabGarfield) {
      tabGarfield.addEventListener('click', () => setMode('garfield', true));
    }

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
