# Notas de Estudio de Referencia: `https://reigen.moe`

Estudio estructural, visual e interactivo realizado directamente en el navegador sobre `https://reigen.moe` y sus rutas enlazadas (`/`, `/home`, `/galerie`, `/profil`, `/shrines`, `/journal`, `/oekaki`, `/credit`, además de vistas móviles en `m.reigen.moe`).  
*Propósito:* replicar la arquitectura de navegación, layout, transiciones, animaciones, efectos de cursor/scroll y tono web retro-indie usando únicamente contenido, obras y assets propios de moekat (`@moekat`) bajo una paleta pastel kawaii/gyaru.

---

## 1. Arquitectura Global, Efectos y Navegación

- **Preloader (`#loading`)**: Capa fija `100% × 100%` con fondo de patrón repetido y recuadro central de borde doble (`border: 4px double; box-shadow: 1px 1px, 2px 2px`) + gráfico giratorio/animado. Se desvanece suavemente (`fadeOut`) al terminar de cargar la página.
- **Cursores personalizados**: Cursores distintos para estado normal (`cursor` general) y enlaces/controles (`pointer` personalizado), además de cursor de ayuda (`help`) en widgets informativos.
- **Tooltip que sigue al cursor (`#s-m-t-tooltip`)**: Recuadro flotante estilizado con borde marcado y sombra sólida que lee el atributo `title` (en nuestro rediseño `data-tip`) y sigue la posición del puntero en tiempo real.
- **Partículas flotantes / cayendo (`stars.js`, `flowers.js`)**: Divs generados dinámicamente en la parte superior que descienden con animación `translateY` y rotación lenta (`@keyframes animate`), con limpieza periódica para mantener fluidez.
- **Texto con onda sinusoidal (`wobble.js`) y texto arcoíris (`rainbowtext.js`)**:
  - `wobble`: divide un encabezado en `<span>` por carácter y anima su desplazamiento vertical (`sin(i + t)`).
  - `rainbowtext`: divide el texto por letra y rota los colores por carácter con brillo suave.
- **Transición entre páginas y navegación multi-página**: Navegación clásica por documentos HTML independientes (`/`, `/home`, `/galerie`, `/profil`, `/oekaki`, etc.), apoyada con botones fijos de regreso (`← BACK`) en esquinas estratégicas y enlaces directos desde la barra lateral.
- **Scrollbars personalizados**: Barras delgadas estilizadas con colores del tema en cada contenedor desplazable (`::-webkit-scrollbar` y `scrollbar-color`).
- **Versión móvil**: La referencia redirige por `WURFL.is_mobile` hacia `m.reigen.moe/*` con diseño compacto; en nuestro rediseño unificamos escritorio y teléfono mediante CSS responsivo fluido y menú lateral desplegable sin redirecciones externas.

---

## 2. Desglose Página por Página

### A. Portada / Splash Gate (`/` — `index.html`)
- **Layout**: Pantalla completa centrada (`100vh`) sobre patrón tipográfico repetido en diagonal suave.
- **Esquina superior derecha**: Cajón desplegable (`<details><summary>`) que se abre in-situ para mostrar enlaces/webrings sin salir de la portada.
- **Bloque central**:
  1. Título principal arqueado/WordArt flanqueado por estrellas de colores.
  2. Aviso breve de contenido y compatibilidad (`rated / compatible con móvil`).
  3. 4 bloques tipográficos de colores contrastantes formando un nombre/acrónimo clave.
  4. Subtítulo de bienvenida decorado.
  5. Botón principal `ENTER` flanqueado por flechas animadas hacia el centro (`→ → ENTER ← ←`) apuntando a `/home`.
  6. Contador retro estilo LCD en la parte inferior.
- **Animaciones / Hover**: Lluvia lenta de estrellas (`stars.js`), brillo en el texto de entrada, transición en el botón `ENTER` y tooltip siguiendo al cursor.

### B. Hub Principal (`/home` — `home.html`)
- **Layout general**: Grid de dos columnas principales en escritorio:
  - **Barra lateral izquierda fija (`.nav`)**: Fondo oscuro de alto contraste flanqueado por un borde rayado tipo caramelo/arcade.
    - Arriba: **Mini-ventana estilo Paint** con dibujo ilustrado; es interactiva y permite recargar la obra destacada del panel principal.
    - Título **`NAVIGATION`** con efecto `wobble`.
    - Caja **`ON-SITE`** (fondo oscuro, borde arcoíris animado, viñetas `✦`/`*`, fondo brillante al `:hover` con cambio tipográfico y desplazamiento suave).
    - Caja **`OFF-SITE`** con estética gemela para redes externas y contacto.
    - Bloque de **badges/stickers `88×31`** al pie de la barra lateral.
  - **Área principal desplazable (`.next-nav`)**:
    - **Botón flotante superior derecho (`TOGGLE FILTER`)**: Cicla entre 5 filtros CSS (`saturate`, `sepia`, `hue-rotate`, escala de grises, modo escaneo/CRT) y persiste la selección en `localStorage`.
    - **Hero Banner ancho superior**: Ilustración panorámica enmarcada en toda la anchura del contenedor.
    - **Marquesina continua (`.marquee`)**: Cinta horizontal con el nombre del sitio repitiéndose sin pausa.
    - **Grid interior de 2 columnas**:
      - *Columna central*:
        1. **Showcase de Obra Aleatoria**: Título con animación arcoíris (`rainbowtext`), icono/flor decorativa giratoria en esquina superior izquierda (`animation: rotate`), marco principal mostrando una obra aleatoria con botón **`RANDOM ARTWORK`** para rotar piezas.
        2. **Sub-banner horizontal** con estética web retro (`Psychic Web`) y lema del artista.
        3. **Barra de pestañas interactivas** (`WELCOME`, `UPDATE`, `JUKEBOX`, `CHATBOX`, `FANLIST`, `WEBRING`, `NEIGHBOR`) que alternan el panel visible debajo sin recargar la página:
           - *Welcome*: texto de presentación + citas/preguntas frecuentes.
           - *Jukebox*: reproductor de audio con título de pista, barra de progreso clicable, botones `<`, `PLAY/PAUSE`, `>` y visualizador/letras.
           - *Resto de pestañas*: listas, registros y enlaces comunitarios externos.
      - *Columna derecha (compañera)*:
        1. Tarjeta de **Bienvenida** con avatar/ilustración pequeña, bio corta y contador de días/reloj.
        2. Bloque de **Estado (`status: ★ ONLINE ★`) + botón de aplausos/kudos (`clap`)** con contador.
        3. Tarjeta explicativa del **botón de filtro** con miniatura de ejemplo.
        4. Columna de **mini-banners clicables** y sellos decorativos al pie.

### C. Galería (`/galerie` — `galerie.html`)
- **Layout**: Dos columnas centradas en escritorio (en móvil se apilan):
  - **Botón fijo `← Back`** arriba a la izquierda.
  - **Columna izquierda sticky (`.desc-box`)**:
    - Título gráfico llamativo arriba (`WordArt` desbordando ligeramente el borde superior).
    - Caja con **borde degradado arcoíris** y doble contorno exterior (`outline: double 4px`).
    - Bloque de métricas (`Nº OF DRAWINGS UPLOADED`, `LAST UPDATED`).
    - Instrucciones, advertencias/leyenda de miniaturas y nota de uso.
    - Barra de paginación inferior **`← PREV ☆ NEXT →`**.
  - **Columna derecha (`.box`)**:
    - Marco biselado con fondo texturizado y rejilla de **5 columnas** de miniaturas cuadradas (`1:1`), completando las celdas vacías finales con placeholders de rayas diagonales para mantener el bloque geométrico.
- **Hover, Visor y Transiciones**:
  - Al pasar el cursor sobre cada miniatura: inclinación (`transform: rotate(5deg)`), contorno punteado luminoso (`outline: white dashed 4px`), resplandor brillante y tooltip con el título.
  - Al hacer clic: se abre un **visor modal / Lightbox** a pantalla completa con la obra en alta resolución, barra de herramientas (zoom, siguiente/anterior, cerrar con `ESC` o clic fuera).

### D. Perfil (`/profil` — `profil.html`)
- **Layout**: Fondo rosa pastel estampado con lluvia sutil de flores/pétalos (`flowers.js`) y botón fijo `← Back` abajo a la izquierda.
- **Encabezado**: Título inclinado **`about me`** flanqueado por 2 retratos cuadrados, sobre una cinta ajedrezada y un lazo/moño decorativo anclado en la esquina superior izquierda del marco principal.
- **Caja principal con borde de encaje (`border-image` festoneado)**:
  - **Sub-bloque izquierdo**:
    - Fila de **micro-badges** de identidad e intereses.
    - Mini tarjeta enmarcada tipo **"Certificado"** con ilustración pequeña y texto conmemorativo.
    - **Semblanza** con palabras clave resaltadas en pastel.
    - **Caja interactiva "Dato curioso"**: botón/personaje clicable que rota hechos o curiosidades al hacer clic.
    - **Rejilla de 10 cuadros (`2 × 5`)** mostrando elementos/obras favoritas en formato cuadrado.
  - **Sub-bloque derecho (`CHARACTER PROFILE`)**:
    - Retrato destacado en marco con borde decorativo.
    - Tabla de ficha técnica con filas alternadas (`nombre`, `apodo`, `ubicación`, `técnicas`, etc.).
- **Cinta Marquee de Estampillas (`.stamp`)**: Carrusel infinito horizontal de sellos rectangulares (`99×56px`) que se desplaza continuamente.
- **Caja inferior de encaje (`.second-box`)**: Grid de 2 columnas:
  - Izquierda: bloques/tarjetas de afinidades o disciplinas.
  - Derecha: cuestionario estilo **Q&A** con preguntas en rosa intenso y respuestas indentadas con borde izquierdo punteado.

### E. Drawbox / Lienzo (`/oekaki` — `oekaki.html`)
- **Layout**: Contenedor centrado sobre fondo oscuro estampado.
- **Componentes**:
  - Título WordArt grande arriba (`おえかきボード`).
  - Enlace `Return to Homepage` arriba a la derecha.
  - Área izquierda: `<canvas>` blanco con borde punteado llamativo (`border: 2px dashed`) para dibujar libremente con ratón o tacto.
  - Barra derecha de herramientas: botones `UNDO` y `CLEAR`, slider de tamaño de pincel, paleta cuadrada de **20 colores (4×5)** + selector de color libre, y botón `SUBMIT`.
  - Sección inferior: galería desplegable de dibujos enviados.

### F. Secciones Adicionales en `reigen.moe` (`/shrines`, `/journal`, `/credit`)
- **`/shrines`**: Página azul intensa centrada con 3 tarjetas rectangulares anchas apiladas en blanco y negro tramado (*dithered*) dedicadas a personajes/música favorita.
- **`/journal`**: Blog personal bilingüe en 2 columnas sobre fondo negro con portada estilo revista e índice por año (`2025`, `2026`).
- **`/credit`**: Página centrada en negro con ilustración monocromática superior, filas de botones `88×31` de recursos externos (98.css, GifCities, DeviantArt, cursors-4u, etc.) y lista de créditos técnicos.

---

## 3. Reglas de Adaptación al Proyecto de moekat (`@moekat`)

1. **Cero assets externos de `reigen.moe`**: Ninguna imagen, icono, cursor, GIF, fuente descargada de terceros (`file.garden`, `dimden.dev`) ni texto ajeno se reutiliza. Todo elemento decorativo (encajes, moños, cursores pastel, estrellas, corazones, sellos) es SVG/CSS original; todo arte es de `image/` y `Comisiones/`; la música es `music/WorldFrutti.mp3`.
2. **Estética pastel kawaii / gyaru con alto contraste**: Se reemplazan los neones agresivos (`#00ff00`, `#ff0000`, `#0000ff`) y filtros saturados por crema rosada (`#FFF9FB`), rosa bebé (`#FFD6E8`), lavanda (`#E8DCFF`), menta (`#CDF7E7`), durazno (`#FFE4D1`) y azul cielo suave (`#D6F0FF`), usando tinta ciruela profunda (`#3B234A`) y ciruela aterciopelada (`#452459`) para garantizar legibilidad >= 4.5:1.
3. **Solo secciones con contenido real**: Se omiten `shrines`, `journal`, `credit`, `webrings`, `guestbook`, `fanlist`, `neighbors`, `chatbox` y `selfship`, integrando en su lugar `comisiones.html` para mostrar las tablas y reglas reales de `Comisiones/` y manteniendo el formulario real de Formspree para contacto.
4. **Criterios anti-diseño-IA y artesanía late-90s / early-2000s (`design-taste-frontend`)**: Solo 2 familias tipográficas (`Pixelify Sans` + `Verdana`), lectura cómoda (`>= 13px` etiquetas y `16px` cuerpo), eliminación del preloader `#loading` y violeta `#5C35A6` por ciruela pastel `#7E1F64`, tablas HTML densas biseladas en lugar de tarjetas uniformes de IA, marquesinas superiores de ancho completo y Bitácora con scroll enmarcada (`inset`).
