/* ==========================================================================
   CONFIGURACIÓN DEL PORTAFOLIO (@dmxn_08)
   Cambia COMMISSIONS_OPEN entre true (abiertas) y false (cerradas).
   ========================================================================== */

window.COMMISSIONS_OPEN = true;

window.PORTFOLIO_CONFIG = {
  get COMMISSIONS_OPEN() {
    return Boolean(window.COMMISSIONS_OPEN);
  },
  COMMISSIONS_OPEN_GIF: 'gifs/comm-open.gif',
  COMMISSIONS_CLOSED_GIF: 'gifs/comm-closed.gif',

  applyCommissionStatus(root = document) {
    const isOpen = Boolean(window.COMMISSIONS_OPEN);

    root.querySelectorAll('[data-comm-status-pill]').forEach((el) => {
      el.textContent = isOpen ? '★ COMISIONES ABIERTAS ★' : '✕ COMISIONES CERRADAS ✕';
      el.classList.toggle('is-open', isOpen);
      el.classList.toggle('is-closed', !isOpen);
    });

    root.querySelectorAll('[data-comm-status-gif]').forEach((img) => {
      img.src = isOpen ? this.COMMISSIONS_OPEN_GIF : this.COMMISSIONS_CLOSED_GIF;
      img.alt = isOpen
        ? 'Comisiones abiertas — Getting Online'
        : 'Comisiones cerradas — Anime Girl Running';
    });

    root.querySelectorAll('[data-comm-status-note]').forEach((el) => {
      el.textContent = isOpen
        ? '¡Comisiones disponibles! Revisa tarifas o escríbeme ♡'
        : 'Comisiones cerradas por el momento — ¡vuelve pronto ♡!';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.PORTFOLIO_CONFIG.applyCommissionStatus();
});
