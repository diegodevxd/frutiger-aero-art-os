# Portafolio Visual - moekat (`@moekat`)

Rediseño completo del portafolio artístico de **moekat (`@moekat`)**, estudiante de la Licenciatura en Artes Visuales en la Universidad de Guanajuato. Inspirado en la arquitectura clásica web 1999-2004 y `reigen.moe`, reinterpretado con una paleta **pastel kawaii / gyaru** y construido al 100% con obras, textos, láminas y música propios de la colección.

> La versión anterior estilo Windows XP / Frutiger Aero OS permanece intacta en el historial de Git (rama `main`).

## Páginas del sitio

- `index.html` - Portada de entrada con lluvia de estrellas pastel, cajón desplegable de redes y accesos rápidos, vista previa de piezas, bloques `M O E K A T`, botones `88×31` y contador local.
- `home.html` - Hub principal con barra lateral fija (`NAVIGATION`), submenú de Galería / Galería Garfield, widget mini-lienzo interactivo, selector de 5 filtros pastel persistentes (`FILTRO`), showcase aleatoria, *Artist Statement*, avatar OC de Garfield (`image/dibujotradicional9.png`), Jukebox para `music/WorldFrutti.mp3`, resumen de comisiones y formulario de contacto.
- `galerie.html` - Galería dividida en dos secciones (`?tab=general` y `?tab=garfield`):
  - **Galería** (`49` obras): Dibujo Digital (`15`), Dibujo Tradicional (`10`), Esculturas (`7`), Bisutería (`7`), Collage (`7`) y Emotes (`3`) con filtros, buscador, paginación y Lightbox a resolución completa.
  - **Galería Garfield** (`22` Arcanos Mayores): baraja completa del Tarot de Garfield ordenada de `0. El Loco` a `XXI. El Mundo` con subtítulos y decorada exclusivamente con GIFs en `gifs/garfield/`.
- `profil.html` - Semblanza, avatar OC de Garfield (`image/dibujotradicional9.png`), ficha técnica de moekat (`@moekat`), dato interactivo al hacer clic, rejilla de 10 obras destacadas, cinta marquee de estampillas, disciplinas y *Artist Statement* en formato Q&A.
- `comisiones.html` - Tarifas en MXN, paquetes promocionales de Emotes, reglas (`Sí puedo hacer / No puedo hacer`), estado dinámico con GIF (`js/config.js`) y láminas originales ampliables.
- `oekaki.html` - Lienzo interactivo HTML5 con pincel, borrador, deshacer, paleta de 20 colores pastel/tinta, descarga PNG (`lienzo-moekat.png`) y guardado local de bocetos.

## Configuración de Comisiones y GIFs

- El estado de comisiones (abiertas o cerradas) se controla desde una sola bandera en `js/config.js`: `window.COMMISSIONS_OPEN = true` (`gifs/comm-open.gif`) o `false` (`gifs/comm-closed.gif`).
- Todos los GIFs, azulejos de fondo, botones `88×31` y stickers decorativos están almacenados localmente en `gifs/` (sin hotlinks externos).

## Paleta Pastel (Tokens en `css/tokens.css`)

- **Fondos y superficies:** Crema rosado (`#FFF9FB`), Blush (`#FFF0F6`), Durazno cálido (`#FFF6EE`) y Ciruela (`#3B1E4F`).
- **Acentos pastel:** Rosa bebé (`#FFD6E8` / `#FF9EC7`), Lavanda (`#E8DCFF` / `#C4AAFF`), Menta (`#CDF7E7` / `#85E3C3`), Durazno (`#FFE4D1`), Azul cielo (`#D6F0FF`) y Amarillo mantequilla (`#FFF5BE`).
- **Contraste tipográfico:** Tinta ciruela (`#2D173B`) sobre fondos claros y crema claro (`#FFF9FB`) / mantequilla (`#FFF5BE`) sobre paneles ciruela.

## Cómo ejecutarlo localmente

No requiere compilación ni dependencias externas.

1. Abre directamente `index.html` en tu navegador, **o**
2. Sirve el directorio con un servidor estático local:

```bash
python -m http.server 8000
```

Luego visita `http://localhost:8000/index.html`.

## Documentación y capturas

- Notas de estudio de referencia: [docs/reference-notes.md](docs/reference-notes.md)
- Mapeo de contenido e inventario de las 71 obras: [docs/content-map.md](docs/content-map.md)
- Capturas en escritorio y móvil: `docs/screenshots/`
