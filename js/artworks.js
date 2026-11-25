/* ==========================================================================
   CATÁLOGO AUTÉNTICO DE OBRAS (71 piezas originales de Demian Tenorio Rico)
   ========================================================================== */

(function () {
  const ROMAN = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    'XXI', 'XXII'
  ];

  const categories = [
    { id: 'all', label: 'Todas', count: 71, badge: '* 71 obras' },
    { id: 'tarot', label: 'Tarot', count: 22, badge: '+ 22 cartas' },
    { id: 'dibujo-digital', label: 'Dibujo Digital', count: 15, badge: '+ 15 piezas' },
    { id: 'dibujo-tradicional', label: 'Dibujo Tradicional', count: 10, badge: '/ 10 piezas' },
    { id: 'esculturas', label: 'Esculturas', count: 7, badge: '~ 7 piezas' },
    { id: 'bisuteria', label: 'Bisutería', count: 7, badge: '<3 7 piezas' },
    { id: 'collage', label: 'Collage', count: 7, badge: '# 7 piezas' },
    { id: 'emotes', label: 'Emotes', count: 3, badge: '* 3 PNGs' }
  ];

  const artworks = [];

  // 1. Tarot (22)
  for (let i = 0; i < 22; i++) {
    const suffix = i === 0 ? '' : String(i + 1);
    artworks.push({
      id: `tarot-${i + 1}`,
      category: 'tarot',
      categoryLabel: 'Tarot',
      title: `Tarot ${ROMAN[i]}`,
      meta: 'Arte Digital • 2024',
      src: `image/tyarot${suffix}.jpg`,
      thumb: `image/thumbs/tyarot${suffix}.jpg`
    });
  }

  // 2. Dibujo Digital (15)
  for (let i = 0; i < 15; i++) {
    artworks.push({
      id: `digital-${i + 1}`,
      category: 'dibujo-digital',
      categoryLabel: 'Dibujo Digital',
      title: `Dibujo Digital ${ROMAN[i]}`,
      meta: 'Dibujo Digital • 2024',
      src: `image/digital${i + 1}.png`,
      thumb: `image/thumbs/digital${i + 1}.jpg`
    });
  }

  // 3. Dibujo Tradicional (10)
  const tradicionalExts = ['jpg', 'jpg', 'png', 'jpg', 'jpg', 'jpg', 'jpg', 'png', 'png', 'png'];
  for (let i = 0; i < 10; i++) {
    const suffix = i === 0 ? '' : String(i + 1);
    artworks.push({
      id: `tradicional-${i + 1}`,
      category: 'dibujo-tradicional',
      categoryLabel: 'Dibujo Tradicional',
      title: `Dibujo Tradicional ${ROMAN[i]}`,
      meta: 'Lápiz y Papel • 2024',
      src: `image/dibujotradicional${suffix}.${tradicionalExts[i]}`,
      thumb: `image/thumbs/dibujotradicional${suffix}.jpg`
    });
  }

  // 4. Esculturas (7)
  const esculturaExts = ['png', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg'];
  const esculturaMats = ['Arcilla', 'Cerámica', 'Arcilla', 'Cerámica', 'Arcilla', 'Cerámica', 'Arcilla'];
  for (let i = 0; i < 7; i++) {
    artworks.push({
      id: `escultura-${i + 1}`,
      category: 'esculturas',
      categoryLabel: 'Esculturas',
      title: `Escultura ${ROMAN[i]}`,
      meta: `${esculturaMats[i]} • 2024`,
      src: `image/escultura${i + 1}.${esculturaExts[i]}`,
      thumb: `image/thumbs/escultura${i + 1}.jpg`
    });
  }

  // 5. Bisutería (7)
  const bisuteriaExts = ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpeg', 'jpeg'];
  for (let i = 0; i < 7; i++) {
    artworks.push({
      id: `bisuteria-${i + 1}`,
      category: 'bisuteria',
      categoryLabel: 'Bisutería',
      title: `Bisutería ${ROMAN[i]}`,
      meta: 'Bisutería • 2024',
      src: `image/biseturia${i + 1}.${bisuteriaExts[i]}`,
      thumb: `image/thumbs/biseturia${i + 1}.jpg`
    });
  }

  // 6. Collage (7)
  const collageExts = ['jpg', 'png', 'jpg', 'jpg', 'png', 'png', 'jpg'];
  for (let i = 0; i < 7; i++) {
    const suffix = i === 0 ? '' : String(i + 1);
    artworks.push({
      id: `collage-${i + 1}`,
      category: 'collage',
      categoryLabel: 'Collage',
      title: `Collage ${ROMAN[i]}`,
      meta: 'Técnica Mixta • 2024',
      src: `image/collage${suffix}.${collageExts[i]}`,
      thumb: `image/thumbs/collage${suffix}.jpg`
    });
  }

  // 7. Emotes (3)
  [
    { id: 'emote-1', file: 'o0o.png', title: 'Emote o0o' },
    { id: 'emote-2', file: 'GG.png', title: 'Emote GG' },
    { id: 'emote-3', file: 'Chopperpipi.png', title: 'Emote Chopperpipi' }
  ].forEach((em) => {
    artworks.push({
      id: em.id,
      category: 'emotes',
      categoryLabel: 'Emotes',
      title: em.title,
      meta: 'PNG • 2024',
      src: `image/${em.file}`,
      thumb: `image/thumbs/${em.file}`
    });
  });

  const featuredIds = ['tarot-1', 'escultura-1', 'digital-1', 'bisuteria-1'];
  const highlightIds = [
    'tarot-1', 'tarot-7', 'digital-1', 'digital-4',
    'tradicional-1', 'escultura-1', 'bisuteria-1', 'collage-1',
    'emote-2', 'emote-3'
  ];

  const commissionSheets = [
    {
      title: 'Tabla de Precios (MXN)',
      meta: 'Comisiones • Demian Tenorio',
      src: 'Comisiones/Comisiones%20tablita.png'
    },
    {
      title: 'Reglas y Condiciones',
      meta: 'Comisiones • Demian Tenorio',
      src: 'Comisiones/Comisiones%20reglas.png'
    },
    {
      title: 'Ejemplos de Acabado y Emotes',
      meta: 'Comisiones • Demian Tenorio',
      src: 'Comisiones/Comisiones%20ejemplos%20y%20emotes.png'
    }
  ];

  window.PORTFOLIO_DATA = {
    categories,
    artworks,
    featuredIds,
    highlightIds,
    commissionSheets,
    getById(id) {
      return artworks.find((a) => a.id === id) || artworks[0];
    }
  };
})();
