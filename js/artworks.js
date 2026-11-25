/* ==========================================================================
   CATALOGO AUTENTICO DE OBRAS (71 piezas originales de Demian Tenorio Rico)
   Incluye los 22 Arcanos Mayores del Tarot de Garfield (0 - XXI) ordenados
   y las 49 obras generales (Digital, Tradicional, Escultura, Bisuteria, Collage, Emotes).
   ========================================================================== */

(function () {
  const ROMAN = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'
  ];

  // 1. Mazo completo de Garfield Tarot: 22 Arcanos Mayores (0. El Loco -> XXI. El Mundo)
  const GARFIELD_TAROT_SPECS = [
    { order: 0, roman: '0', file: 'tyarot20.jpg', name: 'El Loco', en: 'The Fool' },
    { order: 1, roman: 'I', file: 'tyarot21.jpg', name: 'El Mago', en: 'The Magician' },
    { order: 2, roman: 'II', file: 'tyarot22.jpg', name: 'La Gran Sacerdotisa', en: 'The High Priestess' },
    { order: 3, roman: 'III', file: 'tyarot19.jpg', name: 'La Emperatriz', en: 'The Empress' },
    { order: 4, roman: 'IV', file: 'tyarot18.jpg', name: 'El Emperador', en: 'The Emperor' },
    { order: 5, roman: 'V', file: 'tyarot.jpg', name: 'El Hierofante', en: 'The Hierophant' },
    { order: 6, roman: 'VI', file: 'tyarot17.jpg', name: 'Los Enamorados', en: 'The Lovers' },
    { order: 7, roman: 'VII', file: 'tyarot16.jpg', name: 'La Carroza', en: 'The Chariot' },
    { order: 8, roman: 'VIII', file: 'tyarot15.jpg', name: 'La Justicia', en: 'Justice' },
    { order: 9, roman: 'IX', file: 'tyarot14.jpg', name: 'El Ermitaño', en: 'The Hermit' },
    { order: 10, roman: 'X', file: 'tyarot13.jpg', name: 'La Rueda de la Fortuna', en: 'Wheel of Fortune' },
    { order: 11, roman: 'XI', file: 'tyarot12.jpg', name: 'La Fuerza', en: 'Strength' },
    { order: 12, roman: 'XII', file: 'tyarot11.jpg', name: 'El Colgado', en: 'The Hanged Man' },
    { order: 13, roman: 'XIII', file: 'tyarot10.jpg', name: 'La Muerte', en: 'Death' },
    { order: 14, roman: 'XIV', file: 'tyarot9.jpg', name: 'La Templanza', en: 'Temperance' },
    { order: 15, roman: 'XV', file: 'tyarot8.jpg', name: 'El Diablo', en: 'The Devil' },
    { order: 16, roman: 'XVI', file: 'tyarot7.jpg', name: 'La Torre', en: 'The Tower' },
    { order: 17, roman: 'XVII', file: 'tyarot6.jpg', name: 'La Estrella', en: 'The Star' },
    { order: 18, roman: 'XVIII', file: 'tyarot5.jpg', name: 'La Luna', en: 'The Moon' },
    { order: 19, roman: 'XIX', file: 'tyarot4.jpg', name: 'El Sol', en: 'The Sun' },
    { order: 20, roman: 'XX', file: 'tyarot3.jpg', name: 'El Juicio', en: 'Judgement' },
    { order: 21, roman: 'XXI', file: 'tyarot2.jpg', name: 'El Mundo', en: 'The World' }
  ];

  const garfieldTarot = GARFIELD_TAROT_SPECS.map((c) => ({
    id: `tarot-${c.order}`,
    tarotOrder: c.order,
    roman: c.roman,
    cardName: c.name,
    cardEnglish: c.en,
    category: 'tarot',
    categoryLabel: 'Garfield Tarot',
    title: `${c.roman}. ${c.name}`,
    meta: `Arcanos Mayores (${c.en}) • Garfield Tarot • 2024`,
    src: `image/${c.file}`,
    thumb: `image/thumbs/${c.file}`
  }));

  // 2. Categorias generales (49 obras fuera del Tarot de Garfield)
  const generalCategories = [
    { id: 'all', label: 'Todas', count: 49, badge: '* 49 obras' },
    { id: 'dibujo-digital', label: 'Dibujo Digital', count: 15, badge: '+ 15 piezas' },
    { id: 'dibujo-tradicional', label: 'Dibujo Tradicional', count: 10, badge: '/ 10 piezas' },
    { id: 'esculturas', label: 'Esculturas', count: 7, badge: '~ 7 piezas' },
    { id: 'bisuteria', label: 'Bisutería', count: 7, badge: '<3 7 piezas' },
    { id: 'collage', label: 'Collage', count: 7, badge: '# 7 piezas' },
    { id: 'emotes', label: 'Emotes', count: 3, badge: '* 3 PNGs' }
  ];

  const categories = [
    { id: 'all', label: 'Todas', count: 71, badge: '* 71 obras' },
    { id: 'tarot', label: 'Tarot', count: 22, badge: '+ 22 cartas' },
    ...generalCategories.slice(1)
  ];

  const generalArtworks = [];

  // Dibujo Digital (15)
  for (let i = 0; i < 15; i++) {
    generalArtworks.push({
      id: `digital-${i + 1}`,
      category: 'dibujo-digital',
      categoryLabel: 'Dibujo Digital',
      title: `Dibujo Digital ${ROMAN[i]}`,
      meta: 'Dibujo Digital • 2024',
      src: `image/digital${i + 1}.png`,
      thumb: `image/thumbs/digital${i + 1}.jpg`
    });
  }

  // Dibujo Tradicional (10)
  const tradicionalExts = ['jpg', 'jpg', 'png', 'jpg', 'jpg', 'jpg', 'jpg', 'png', 'png', 'png'];
  for (let i = 0; i < 10; i++) {
    const suffix = i === 0 ? '' : String(i + 1);
    generalArtworks.push({
      id: `tradicional-${i + 1}`,
      category: 'dibujo-tradicional',
      categoryLabel: 'Dibujo Tradicional',
      title: `Dibujo Tradicional ${ROMAN[i]}`,
      meta: 'Lápiz y Papel • 2024',
      src: `image/dibujotradicional${suffix}.${tradicionalExts[i]}`,
      thumb: `image/thumbs/dibujotradicional${suffix}.jpg`
    });
  }

  // Esculturas (7)
  const esculturaExts = ['png', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg'];
  const esculturaMats = ['Arcilla', 'Cerámica', 'Arcilla', 'Cerámica', 'Arcilla', 'Cerámica', 'Arcilla'];
  for (let i = 0; i < 7; i++) {
    generalArtworks.push({
      id: `escultura-${i + 1}`,
      category: 'esculturas',
      categoryLabel: 'Esculturas',
      title: `Escultura ${ROMAN[i]}`,
      meta: `${esculturaMats[i]} • 2024`,
      src: `image/escultura${i + 1}.${esculturaExts[i]}`,
      thumb: `image/thumbs/escultura${i + 1}.jpg`
    });
  }

  // Bisuteria (7)
  const bisuteriaExts = ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpeg', 'jpeg'];
  for (let i = 0; i < 7; i++) {
    generalArtworks.push({
      id: `bisuteria-${i + 1}`,
      category: 'bisuteria',
      categoryLabel: 'Bisutería',
      title: `Bisutería ${ROMAN[i]}`,
      meta: 'Bisutería • 2024',
      src: `image/biseturia${i + 1}.${bisuteriaExts[i]}`,
      thumb: `image/thumbs/biseturia${i + 1}.jpg`
    });
  }

  // Collage (7)
  const collageExts = ['jpg', 'png', 'jpg', 'jpg', 'png', 'png', 'jpg'];
  for (let i = 0; i < 7; i++) {
    const suffix = i === 0 ? '' : String(i + 1);
    generalArtworks.push({
      id: `collage-${i + 1}`,
      category: 'collage',
      categoryLabel: 'Collage',
      title: `Collage ${ROMAN[i]}`,
      meta: 'Técnica Mixta • 2024',
      src: `image/collage${suffix}.${collageExts[i]}`,
      thumb: `image/thumbs/collage${suffix}.jpg`
    });
  }

  // Emotes (3)
  [
    { id: 'emote-1', file: 'o0o.png', title: 'Emote o0o' },
    { id: 'emote-2', file: 'GG.png', title: 'Emote GG' },
    { id: 'emote-3', file: 'Chopperpipi.png', title: 'Emote Chopperpipi' }
  ].forEach((em) => {
    generalArtworks.push({
      id: em.id,
      category: 'emotes',
      categoryLabel: 'Emotes',
      title: em.title,
      meta: 'PNG • 2024',
      src: `image/${em.file}`,
      thumb: `image/thumbs/${em.file}`
    });
  });

  const artworks = [...garfieldTarot, ...generalArtworks];

  const featuredIds = ['tarot-5', 'escultura-1', 'digital-1', 'bisuteria-1'];
  const highlightIds = [
    'tarot-5', 'tarot-16', 'digital-1', 'digital-4',
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
    generalCategories,
    garfieldTarot,
    generalArtworks,
    artworks,
    featuredIds,
    highlightIds,
    commissionSheets,
    getById(id) {
      return artworks.find((a) => a.id === id) || artworks[0];
    }
  };
})();
