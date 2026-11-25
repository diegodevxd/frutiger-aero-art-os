/* ==========================================================================
   GALERÍA CON FILTROS, BÚSQUEDA, PAGINACIÓN (25/pág) Y LIGHTBOX (galerie.html)
   ========================================================================== */

(function () {
  const PAGE_SIZE = 25;

  document.addEventListener('DOMContentLoaded', () => {
    const data = window.PORTFOLIO_DATA;
    if (!data) return;

    const filtersWrap = document.getElementById('galleryFilters');
    const gridEl = document.getElementById('galleryGrid');
    const searchEl = document.getElementById('gallerySearch');
    const densityBtn = document.getElementById('galleryDensityBtn');
    const statsEl = document.getElementById('galleryStats');
    const prevBtn = document.getElementById('galPrevBtn');
    const nextBtn = document.getElementById('galNextBtn');
    const pageInfo = document.getElementById('galPageInfo');

    let activeCat = 'all';
    let searchQuery = '';
    let currentPage = 1;
    let isLarge = false;

    const params = new URLSearchParams(window.location.search);
    const paramCat = params.get('cat');
    if (paramCat && data.categories.some((c) => c.id === paramCat)) {
      activeCat = paramCat;
    }

    function renderFilterPills() {
      if (!filtersWrap) return;
      filtersWrap.innerHTML = '';
      data.categories.forEach((cat) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `cat-pill${cat.id === activeCat ? ' is-active' : ''}`;
        btn.textContent = `${cat.label} (${cat.count})`;
        btn.setAttribute('aria-pressed', String(cat.id === activeCat));
        btn.addEventListener('click', () => {
          activeCat = cat.id;
          currentPage = 1;
          renderFilterPills();
          renderGallery();
        });
        filtersWrap.appendChild(btn);
      });
    }

    function getFilteredItems() {
      const q = searchQuery.trim().toLowerCase();
      return data.artworks.filter((item) => {
        const matchCat = activeCat === 'all' || item.category === activeCat;
        const matchQuery =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.meta.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q);
        return matchCat && matchQuery;
      });
    }

    function renderGallery() {
      if (!gridEl) return;
      const filtered = getFilteredItems();
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      const start = (currentPage - 1) * PAGE_SIZE;
      const pageItems = filtered.slice(start, start + PAGE_SIZE);

      const activeCategoryObj = data.categories.find((c) => c.id === activeCat) || data.categories[0];
      if (statsEl) {
        statsEl.innerHTML =
          `Nº DE OBRAS: <strong>${filtered.length}</strong> / ${data.artworks.length}<br>` +
          `CATEGORÍA: <strong>${activeCategoryObj.label.toUpperCase()}</strong>`;
      }

      if (pageInfo) pageInfo.textContent = `PÁG ${currentPage} / ${totalPages}`;
      if (prevBtn) prevBtn.disabled = currentPage <= 1;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

      gridEl.innerHTML = '';

      if (pageItems.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'gallery-empty';
        empty.innerHTML = `<strong>No se encontraron obras para "${searchQuery}"</strong><br>Prueba limpiando el buscador o cambiando de categoría ♡`;
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
        ph.textContent = '✦';
        gridEl.appendChild(ph);
      }
    }

    if (searchEl) {
      searchEl.addEventListener('input', () => {
        searchQuery = searchEl.value || '';
        currentPage = 1;
        renderGallery();
      });
    }

    if (densityBtn && gridEl) {
      densityBtn.addEventListener('click', () => {
        isLarge = !isLarge;
        gridEl.classList.toggle('is-large', isLarge);
        densityBtn.textContent = isLarge ? 'Vista: 5 cols' : 'Vista: Amplia';
        renderGallery();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage -= 1;
          renderGallery();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const filtered = getFilteredItems();
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        if (currentPage < totalPages) {
          currentPage += 1;
          renderGallery();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    renderFilterPills();
    renderGallery();
  });
})();
