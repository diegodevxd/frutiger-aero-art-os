/* ==========================================================================
   LIENZO KAWAII / DRAWBOX (oekaki.html)
   ========================================================================== */

(function () {
  const SWATCHES = [
    '#3B234A', '#684978', '#FF9EC7', '#C43B7B', '#FFFFFF',
    '#E8DCFF', '#6E46B8', '#CDF7E7', '#1A7A5E', '#FFF5BE',
    '#FFE4D1', '#FF9B71', '#D6F0FF', '#246DA8', '#FFE07A',
    '#F9C6D9', '#B8E0D2', '#D8B4F8', '#FCA5A5', '#1F2937'
  ];

  const STORAGE_KEY = 'pastel_oekaki_doodles_v1';

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('oekakiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const swatchGrid = document.getElementById('swatchGrid');
    const customColor = document.getElementById('customColor');
    const brushSize = document.getElementById('brushSize');
    const brushSizeVal = document.getElementById('brushSizeVal');
    const undoBtn = document.getElementById('undoBtn');
    const clearBtn = document.getElementById('clearBtn');
    const eraserBtn = document.getElementById('eraserBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const saveLocalBtn = document.getElementById('saveLocalBtn');
    const doodleGallery = document.getElementById('doodleGallery');
    const doodleCount = document.getElementById('doodleCount');

    let currentColor = '#3B234A';
    let isEraser = false;
    let drawing = false;
    let history = [];

    function resetCanvas() {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function pushHistory() {
      if (history.length >= 25) history.shift();
      history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    function setActiveColor(hex, eraserMode = false) {
      isEraser = eraserMode;
      if (!eraserMode) {
        currentColor = hex;
        if (customColor) customColor.value = hex;
      }
      if (eraserBtn) eraserBtn.classList.toggle('plum', isEraser);
      if (swatchGrid) {
        swatchGrid.querySelectorAll('.swatch-btn').forEach((b) => {
          b.classList.toggle('is-active', !isEraser && b.dataset.color === hex);
        });
      }
    }

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const pt = e.touches && e.touches.length ? e.touches[0] : e;
      return {
        x: ((pt.clientX - rect.left) / rect.width) * canvas.width,
        y: ((pt.clientY - rect.top) / rect.height) * canvas.height
      };
    }

    function startStroke(e) {
      e.preventDefault();
      pushHistory();
      drawing = true;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = parseInt(brushSize ? brushSize.value : '5', 10);
      ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
      ctx.lineTo(p.x + 0.01, p.y + 0.01);
      ctx.stroke();
    }

    function moveStroke(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    function endStroke() {
      if (!drawing) return;
      drawing = false;
      ctx.closePath();
    }

    function loadSavedDoodles() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
      } catch {
        return [];
      }
    }

    function renderDoodles() {
      if (!doodleGallery) return;
      const items = loadSavedDoodles();
      if (doodleCount) doodleCount.textContent = String(items.length);
      doodleGallery.innerHTML = '';

      if (!items.length) {
        const p = document.createElement('p');
        p.textContent = 'Aún no guardas bocetos en este navegador. ¡Dibuja algo y pulsa "Guardar aquí"!';
        doodleGallery.appendChild(p);
        return;
      }

      items.forEach((entry, idx) => {
        const card = document.createElement('div');
        card.className = 'doodle-card';

        const img = document.createElement('img');
        img.src = entry.dataUrl;
        img.alt = `Boceto ${idx + 1}`;

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'candy-btn butter';
        delBtn.textContent = 'Borrar';
        delBtn.addEventListener('click', () => {
          const next = loadSavedDoodles().filter((_, i) => i !== idx);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {}
          renderDoodles();
        });

        card.appendChild(img);
        card.appendChild(delBtn);
        doodleGallery.appendChild(card);
      });
    }

    resetCanvas();
    pushHistory();

    if (swatchGrid) {
      SWATCHES.forEach((hex) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'swatch-btn';
        b.dataset.color = hex;
        b.style.backgroundColor = hex;
        b.setAttribute('aria-label', `Color ${hex}`);
        b.addEventListener('click', () => setActiveColor(hex, false));
        swatchGrid.appendChild(b);
      });
      setActiveColor('#3B234A', false);
    }

    if (customColor) {
      customColor.addEventListener('input', () => setActiveColor(customColor.value, false));
    }

    if (brushSize && brushSizeVal) {
      brushSize.addEventListener('input', () => {
        brushSizeVal.textContent = `${brushSize.value}px`;
      });
    }

    if (eraserBtn) {
      eraserBtn.addEventListener('click', () => setActiveColor(currentColor, !isEraser));
    }

    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        if (history.length > 0) {
          const prev = history.pop();
          ctx.putImageData(prev, 0, 0);
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        pushHistory();
        resetCanvas();
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.download = 'lienzo-dmxn_08.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      });
    }

    if (saveLocalBtn) {
      saveLocalBtn.addEventListener('click', () => {
        const list = loadSavedDoodles();
        list.unshift({ dataUrl: canvas.toDataURL('image/png'), at: Date.now() });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 12)));
        } catch {}
        renderDoodles();
      });
    }

    canvas.addEventListener('mousedown', startStroke);
    canvas.addEventListener('mousemove', moveStroke);
    window.addEventListener('mouseup', endStroke);
    canvas.addEventListener('touchstart', startStroke, { passive: false });
    canvas.addEventListener('touchmove', moveStroke, { passive: false });
    window.addEventListener('touchend', endStroke);

    renderDoodles();
  });
})();
