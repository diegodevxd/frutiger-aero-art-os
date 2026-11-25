# Portafolio Visual — Demian Tenorio Rico (`@dmxn_08`)

Rediseño completo del portafolio artístico de **Demian Tenorio Rico (`@dmxn_08`)**, estudiante de la Licenciatura en Artes Visuales en la Universidad de Guanajuato. Inspirado en la estructura multipágina, transiciones y micro-interacciones de `reigen.moe`, reinterpretado con una paleta **pastel kawaii / gyaru** y construido al 100% con obras, textos, láminas y música propios del autor.

> La versión anterior estilo Windows XP / Frutiger Aero OS permanece intacta en el historial de Git (rama `main`).

## Páginas del sitio

- `index.html` — Portada de entrada con lluvia de estrellas pastel, cajón desplegable de redes y accesos rápidos, vista previa de piezas y contador local.
- `home.html` — Hub principal con barra lateral fija (`NAVEGACIÓN`), widget mini-lienzo interactivo, selector de 5 filtros pastel persistentes (`FILTRO ✦`), showcase **`Obra al azar ✦`**, *Artist Statement*, Jukebox para `music/WorldFrutti.mp3`, resumen de comisiones y formulario de contacto Formspree.
- `galerie.html` — Archivo completo de **71 obras** (`Tarot 22`, `Dibujo Digital 15`, `Dibujo Tradicional 10`, `Esculturas 7`, `Bisutería 7`, `Collage 7`, `Emotes 3`) con filtros, buscador, paginación (25 por página) y Lightbox a resolución completa.
- `profil.html` — Semblanza, ficha técnica de artista, dato interactivo al hacer clic, rejilla de 10 obras destacadas, cinta marquee de estampillas, disciplinas y *Artist Statement* en formato Q&A.
- `comisiones.html` — Tarifas en MXN, paquetes promocionales de Emotes, reglas (`Sí puedo hacer / No puedo hacer`), estado dinámico con GIF (`js/config.js`) y láminas originales ampliables.
- `oekaki.html` — Lienzo interactivo HTML5 con pincel, borrador, deshacer, paleta de 20 colores pastel/tinta, descarga PNG y guardado local de bocetos.

## Configuración de Comisiones y GIFs

- El estado de comisiones (abiertas o cerradas) se controla desde una sola bandera en `js/config.js`: `window.COMMISSIONS_OPEN = true` (`gifs/comm-open.gif`) o `false` (`gifs/comm-closed.gif`).
- Todos los GIFs y stickers decorativos están almacenados localmente en `gifs/` (sin hotlinks externos).

## Paleta Pastel (Tokens en `css/tokens.css`)

- **Fondos y superficies:** Crema rosado (`#FFF9FB`), Blush (`#FFF0F6`), Durazno cálido (`#FFF6EE`) y Ciruela aterciopelado (`#452459`).
- **Acentos pastel:** Rosa bebé (`#FFD6E8` / `#FF9EC7`), Lavanda (`#E8DCFF` / `#C4AAFF`), Menta (`#CDF7E7` / `#85E3C3`), Durazno (`#FFE4D1`), Azul cielo (`#D6F0FF`) y Amarillo mantequilla (`#FFF5BE`).
- **Contraste tipográfico:** Tinta ciruela (`#3B234A`) sobre fondos claros y crema claro (`#FFF9FB`) sobre paneles ciruela.

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
