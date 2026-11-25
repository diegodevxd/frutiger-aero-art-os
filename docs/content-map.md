# Mapeo de Contenido del Portafolio (`docs/content-map.md`)

Inventario completo del contenido auténtico de **moekat (`@moekat`)** extraído de `image/`, `Comisiones/` y `music/`, junto con su ubicación exacta en el rediseño web retro pastel.

---

## 1. Mapa de Secciones (Referencia vs. Nuestro Rediseño)

| Sección de `reigen.moe` | Página en nuestro sitio | Contenido de moekat asignado | Estado |
| :--- | :--- | :--- | :--- |
| `/` (Splash Entry Gate) | `index.html` | Título `MOEKAT`, aviso de archivo (71 obras, apto PC y móvil), bloques `M O E K A T`, cajón desplegable superior con redes y accesos, miniaturas de vista previa (`tyarot`, `digital1`, `escultura1`, `biseturia1`), CTA `ENTRAR → home.html` y contador local. | **Construida** |
| `/home` (Hub Principal + Navegación lateral + Showcase aleatorio + Tabs + Jukebox + Columna derecha) | `home.html` | Barra lateral fija (`NAVIGATION`, submenú de `GALERIA (71)` y redes), widget mini-lienzo interactivo, selector de 5 filtros pastel (`FILTRO`), Showcase **`OBRA AL AZAR`** con las 71 piezas, Tabs (`BIENVENIDX` con avatar OC Garfield `image/dibujotradicional9.png`, *Artist Statement*, 4 obras seleccionadas y disciplinas; `MUSICA` reproduciendo `music/WorldFrutti.mp3`; `COMISIONES` con resumen MXN y láminas; `CONTACTO` con formulario Formspree), tarjeta de bienvenida con avatar OC Garfield `image/dibujotradicional9.png`, estado `COMISIONES ABIERTAS` + aplauso interactivo. | **Construida** |
| `/galerie` (Galería general + Galería Garfield Tarot + Lightbox) | `galerie.html` | Dividida en dos secciones mediante pestañas: **Galería** (`49` obras generales con filtros, buscador, paginación y stickers pastel) y **Galería Garfield** (`22` Arcanos Mayores del Tarot de Garfield ordenados `0. El Loco` -> `XXI. El Mundo`, decorada exclusivamente con GIFs de `gifs/garfield/`), con Lightbox completo. | **Construida** |
| `/profil` (Perfil con bordes de encaje, ficha, dato interactivo, 10 favoritas, marquee de estampillas y Q&A) | `profil.html` | Semblanza completa (*moekat / `@moekat`, artista transgénero y guanajuatense, Lic. Artes Visuales UG 2023*), avatar oficial OC Garfield `image/dibujotradicional9.png`, ficha técnica, certificado simbólico del archivo, emote interactivo `o0o.png` que cicla 7 datos reales, rejilla `2×5` de 10 obras destacadas, marquee de estampillas, disciplinas y Q&A. | **Construida** |
| *(Sección de comisiones)* | `comisiones.html` | Información de `Comisiones/`: Tabla de precios MXN, paquetes de Emotes, reglas `SÍ PUEDO HACER` / `NO PUEDO HACER`, estado dinámico con GIF (`js/config.js`), 3 láminas clicables en Lightbox y enlace a contacto. | **Construida** |
| `/oekaki` (Drawbox / Lienzo interactivo) | `oekaki.html` | Lienzo HTML5 (`520×420`), `Deshacer`, `Limpiar`, `Borrador`, tamaño de pincel, paleta de 20 colores + selector libre, descarga PNG (`lienzo-moekat.png`) y guardado local de bocetos en `localStorage`. | **Construida** |

---

## 2. Secciones Omitidas y Razones

| Elemento omitido | Origen | Razón por la que se omite |
| :--- | :--- | :--- |
| `/shrines` | `reigen.moe` | No hay contenido separado de fandoms/shrines en el portafolio aparte del Tarot de Garfield e ilustración. |
| `/journal` | `reigen.moe` | No existen entradas de diario en el proyecto; inventar entradas violaría usar solo contenido real. |
| `/credit` | `reigen.moe` | Créditos externos propios de `reigen.moe` que no aplican al proyecto. |
| Webrings, Neighbors, Fanlist, Guestbook, Chatbox externo, Selfship | `reigen.moe` | Servicios comunitarios externos sin cuentas equivalentes. |
| Subdominio móvil separado (`m.reigen.moe`) | `reigen.moe` | Sustituido por CSS responsivo unificado en las mismas 6 páginas. |
| Escritorio Windows XP retro | Versión anterior del repo | Sustituido por el rediseño old-web pastel; accesible en el historial de Git (`main`). |

---

## 3. Inventario Completo de Assets en `image/`, `Comisiones/` y `music/`

### A. Obras en `image/` (71 piezas totales)

#### 1. Tarot (`tarot` — 22 obras)
| # | Título | Archivo completo | Miniatura | Técnica / Año |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Tarot I | `image/tyarot.jpg` | `image/thumbs/tyarot.jpg` | Arte Digital • 2024 |
| 2 | Tarot II | `image/tyarot2.jpg` | `image/thumbs/tyarot2.jpg` | Arte Digital • 2024 |
| 3 | Tarot III | `image/tyarot3.jpg` | `image/thumbs/tyarot3.jpg` | Arte Digital • 2024 |
| 4 | Tarot IV | `image/tyarot4.jpg` | `image/thumbs/tyarot4.jpg` | Arte Digital • 2024 |
| 5 | Tarot V | `image/tyarot5.jpg` | `image/thumbs/tyarot5.jpg` | Arte Digital • 2024 |
| 6 | Tarot VI | `image/tyarot6.jpg` | `image/thumbs/tyarot6.jpg` | Arte Digital • 2024 |
| 7 | Tarot VII | `image/tyarot7.jpg` | `image/thumbs/tyarot7.jpg` | Arte Digital • 2024 |
| 8 | Tarot VIII | `image/tyarot8.jpg` | `image/thumbs/tyarot8.jpg` | Arte Digital • 2024 |
| 9 | Tarot IX | `image/tyarot9.jpg` | `image/thumbs/tyarot9.jpg` | Arte Digital • 2024 |
| 10 | Tarot X | `image/tyarot10.jpg` | `image/thumbs/tyarot10.jpg` | Arte Digital • 2024 |
| 11 | Tarot XI | `image/tyarot11.jpg` | `image/thumbs/tyarot11.jpg` | Arte Digital • 2024 |
| 12 | Tarot XII | `image/tyarot12.jpg` | `image/thumbs/tyarot12.jpg` | Arte Digital • 2024 |
| 13 | Tarot XIII | `image/tyarot13.jpg` | `image/thumbs/tyarot13.jpg` | Arte Digital • 2024 |
| 14 | Tarot XIV | `image/tyarot14.jpg` | `image/thumbs/tyarot14.jpg` | Arte Digital • 2024 |
| 15 | Tarot XV | `image/tyarot15.jpg` | `image/thumbs/tyarot15.jpg` | Arte Digital • 2024 |
| 16 | Tarot XVI | `image/tyarot16.jpg` | `image/thumbs/tyarot16.jpg` | Arte Digital • 2024 |
| 17 | Tarot XVII | `image/tyarot17.jpg` | `image/thumbs/tyarot17.jpg` | Arte Digital • 2024 |
| 18 | Tarot XVIII | `image/tyarot18.jpg` | `image/thumbs/tyarot18.jpg` | Arte Digital • 2024 |
| 19 | Tarot XIX | `image/tyarot19.jpg` | `image/thumbs/tyarot19.jpg` | Arte Digital • 2024 |
| 20 | Tarot XX | `image/tyarot20.jpg` | `image/thumbs/tyarot20.jpg` | Arte Digital • 2024 |
| 21 | Tarot XXI | `image/tyarot21.jpg` | `image/thumbs/tyarot21.jpg` | Arte Digital • 2024 |
| 22 | Tarot XXII | `image/tyarot22.jpg` | `image/thumbs/tyarot22.jpg` | Arte Digital • 2024 |

#### 2. Dibujo Digital (`dibujo-digital` — 15 obras)
| # | Título | Archivo completo | Miniatura | Técnica / Año |
| :--- | :--- | :--- | :--- | :--- |
| 23–37 | Dibujo Digital I – XV | `image/digital1.png` … `image/digital15.png` | `image/thumbs/digital1.jpg` … `image/thumbs/digital15.jpg` | Dibujo Digital • 2024 |

#### 3. Dibujo Tradicional (`dibujo-tradicional` — 10 obras)
| # | Título | Archivo completo | Miniatura | Técnica / Año |
| :--- | :--- | :--- | :--- | :--- |
| 38 | Dibujo Tradicional I | `image/dibujotradicional.jpg` | `image/thumbs/dibujotradicional.jpg` | Lápiz y Papel • 2024 |
| 39 | Dibujo Tradicional II | `image/dibujotradicional2.jpg` | `image/thumbs/dibujotradicional2.jpg` | Lápiz y Papel • 2024 |
| 40 | Dibujo Tradicional III | `image/dibujotradicional3.png` | `image/thumbs/dibujotradicional3.jpg` | Lápiz y Papel • 2024 |
| 41 | Dibujo Tradicional IV | `image/dibujotradicional4.jpg` | `image/thumbs/dibujotradicional4.jpg` | Lápiz y Papel • 2024 |
| 42 | Dibujo Tradicional V | `image/dibujotradicional5.jpg` | `image/thumbs/dibujotradicional5.jpg` | Lápiz y Papel • 2024 |
| 43 | Dibujo Tradicional VI | `image/dibujotradicional6.jpg` | `image/thumbs/dibujotradicional6.jpg` | Lápiz y Papel • 2024 |
| 44 | Dibujo Tradicional VII | `image/dibujotradicional7.jpg` | `image/thumbs/dibujotradicional7.jpg` | Lápiz y Papel • 2024 |
| 45 | Dibujo Tradicional VIII | `image/dibujotradicional8.png` | `image/thumbs/dibujotradicional8.jpg` | Lápiz y Papel • 2024 |
| 46 | Dibujo Tradicional IX | `image/dibujotradicional9.png` | `image/thumbs/dibujotradicional9.jpg` | Lápiz y Papel • 2024 |
| 47 | Dibujo Tradicional X | `image/dibujotradicional10.png` | `image/thumbs/dibujotradicional10.jpg` | Lápiz y Papel • 2024 |

#### 4. Esculturas (`esculturas` — 7 obras)
| # | Título | Archivo completo | Miniatura | Técnica / Año |
| :--- | :--- | :--- | :--- | :--- |
| 48 | Escultura I | `image/escultura1.png` | `image/thumbs/escultura1.jpg` | Arcilla • 2024 |
| 49 | Escultura II | `image/escultura2.jpg` | `image/thumbs/escultura2.jpg` | Cerámica • 2024 |
| 50 | Escultura III | `image/escultura3.jpg` | `image/thumbs/escultura3.jpg` | Arcilla • 2024 |
| 51 | Escultura IV | `image/escultura4.jpg` | `image/thumbs/escultura4.jpg` | Cerámica • 2024 |
| 52 | Escultura V | `image/escultura5.jpg` | `image/thumbs/escultura5.jpg` | Arcilla • 2024 |
| 53 | Escultura VI | `image/escultura6.jpg` | `image/thumbs/escultura6.jpg` | Cerámica • 2024 |
| 54 | Escultura VII | `image/escultura7.jpg` | `image/thumbs/escultura7.jpg` | Arcilla • 2024 |

#### 5. Bisutería (`bisuteria` — 7 obras)
| # | Título | Archivo completo | Miniatura | Técnica / Año |
| :--- | :--- | :--- | :--- | :--- |
| 55 | Bisutería I | `image/biseturia1.jpg` | `image/thumbs/biseturia1.jpg` | Bisutería • 2024 |
| 56 | Bisutería II | `image/biseturia2.jpg` | `image/thumbs/biseturia2.jpg` | Bisutería • 2024 |
| 57 | Bisutería III | `image/biseturia3.jpg` | `image/thumbs/biseturia3.jpg` | Bisutería • 2024 |
| 58 | Bisutería IV | `image/biseturia4.jpg` | `image/thumbs/biseturia4.jpg` | Bisutería • 2024 |
| 59 | Bisutería V | `image/biseturia5.jpg` | `image/thumbs/biseturia5.jpg` | Bisutería • 2024 |
| 60 | Bisutería VI | `image/biseturia6.jpeg` | `image/thumbs/biseturia6.jpg` | Bisutería • 2024 |
| 61 | Bisutería VII | `image/biseturia7.jpeg` | `image/thumbs/biseturia7.jpg` | Bisutería • 2024 |

#### 6. Collage (`collage` — 7 obras)
| # | Título | Archivo completo | Miniatura | Técnica / Año |
| :--- | :--- | :--- | :--- | :--- |
| 62 | Collage I | `image/collage.jpg` | `image/thumbs/collage.jpg` | Técnica Mixta • 2024 |
| 63 | Collage II | `image/collage2.png` | `image/thumbs/collage2.jpg` | Técnica Mixta • 2024 |
| 64 | Collage III | `image/collage3.jpg` | `image/thumbs/collage3.jpg` | Técnica Mixta • 2024 |
| 65 | Collage IV | `image/collage4.jpg` | `image/thumbs/collage4.jpg` | Técnica Mixta • 2024 |
| 66 | Collage V | `image/collage5.png` | `image/thumbs/collage5.jpg` | Técnica Mixta • 2024 |
| 67 | Collage VI | `image/collage6.png` | `image/thumbs/collage6.jpg` | Técnica Mixta • 2024 |
| 68 | Collage VII | `image/collage7.jpg` | `image/thumbs/collage7.jpg` | Técnica Mixta • 2024 |

#### 7. Emotes (`emotes` — 3 obras)
| # | Título | Archivo completo | Miniatura | Técnica / Año |
| :--- | :--- | :--- | :--- | :--- |
| 69 | Emote o0o | `image/o0o.png` | `image/thumbs/o0o.png` | PNG • 2024 |
| 70 | Emote GG | `image/GG.png` | `image/thumbs/GG.png` | PNG • 2024 |
| 71 | Emote Chopperpipi | `image/Chopperpipi.png` | `image/thumbs/Chopperpipi.png` | PNG • 2024 |

### B. Otros Assets Propios
- `Comisiones/Comisiones tablita.png` → Tabla de precios MXN en `comisiones.html` y `home.html`.
- `Comisiones/Comisiones reglas.png` → Reglas "Sí puedo hacer / No puedo hacer" y redes en `comisiones.html` y `home.html`.
- `Comisiones/Comisiones ejemplos y emotes.png` → Ejemplos de acabado (Lineart / Color base / Renderizado) y paquetes de emotes en `comisiones.html` y `home.html`.
- `music/WorldFrutti.mp3` → Pista oficial del Jukebox en `home.html`.

### C. Identidad, Avatar y Enlaces Externos Pendientes de Confirmación
- **Usuario / Nombre en el sitio:** moekat (`@moekat`).
- **Avatar / OC oficial:** Garfield (`image/dibujotradicional9.png`).
- **Formación e identidad:** Artista visual transgénero y guanajuatense; ingresó en 2023 a la Licenciatura en Artes Visuales en la Universidad de Guanajuato.
- **URLs externas heredadas (mantenidas sin modificar hasta confirmación):** Instagram `https://instagram.com/demi.demiau`, Twitter/X `https://x.com/Chicharron_08`, TikTok `https://tiktok.com/@dmxn_08`, Formspree `https://formspree.io/f/xrbapazl`.
