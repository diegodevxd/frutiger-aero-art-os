/* ==========================================================================
   PERFIL DE ARTISTA (profil.html) - Dato interactivo, 10 obras & estampillas
   ========================================================================== */

(function () {
  const ARTIST_FACTS = [
    'Soy moekat (@moekat), artista transgénero y guanajuatense.',
    'En 2023 ingresé a la Licenciatura en Artes Visuales en la Universidad de Guanajuato.',
    'Mi portafolio reúne 71 piezas entre Tarot (22 cartas), Ilustración Digital y Tradicional, Escultura, Bisutería, Collage y Emotes.',
    'Mis esculturas alternan arcilla y cerámica, explorando formas lúdicas y coloridas.',
    'Mi estilo se nutre del arte semirrealista y de la energía creativa de los fandoms en internet.',
    'Uso la sátira, lo cómico y lo absurdo para crear contraste entre lo real y lo irreal.',
    'Acepto comisiones de Retrato, Medio cuerpo, Cuerpo completo y paquetes de Emotes en MXN.'
  ];

  document.addEventListener('DOMContentLoaded', () => {
    const data = window.PORTFOLIO_DATA;
    const factBtn = document.getElementById('funfactBtn');
    const factCopy = document.getElementById('funfactCopy');
    const favGrid = document.getElementById('favoritesGrid');
    const stampTrack = document.getElementById('stampTrack');

    let factIdx = 0;
    if (factBtn && factCopy) {
      factBtn.addEventListener('click', () => {
        factIdx = (factIdx + 1) % ARTIST_FACTS.length;
        factCopy.textContent = ARTIST_FACTS[factIdx];
      });
    }

    if (data && favGrid) {
      const highlights = data.highlightIds.map((id) => data.getById(id));
      favGrid.innerHTML = '';
      highlights.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'fav-square';
        btn.setAttribute('data-tip', `${item.title} (${item.categoryLabel})`);
        btn.setAttribute('aria-label', `Ver ${item.title}`);

        const img = document.createElement('img');
        img.src = item.thumb;
        img.alt = item.title;
        img.decoding = 'async';

        btn.appendChild(img);
        btn.addEventListener('click', () => {
          if (window.PastelLightbox) window.PastelLightbox.open(highlights, idx);
        });
        favGrid.appendChild(btn);
      });
    }

    if (data && stampTrack) {
      const stampIds = [
        'tarot-5', 'tarot-20', 'tarot-10', 'digital-1', 'digital-2', 'digital-5',
        'tradicional-1', 'tradicional-4', 'escultura-1', 'escultura-2',
        'bisuteria-1', 'collage-1', 'emote-1', 'emote-2'
      ];
      const list = stampIds.map((id) => data.getById(id));
      const doubled = [...list, ...list];
      stampTrack.innerHTML = '';
      doubled.forEach((item, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'stamp-item';
        if (idx >= list.length) wrap.setAttribute('aria-hidden', 'true');
        const img = document.createElement('img');
        img.src = item.thumb;
        img.alt = idx >= list.length ? '' : item.title;
        img.decoding = 'async';
        wrap.appendChild(img);
        stampTrack.appendChild(wrap);
      });
    }
  });
})();
