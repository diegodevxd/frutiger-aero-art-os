/* ==========================================================================
   CONFIGURACIÓN DEL PORTAFOLIO (@moekat)
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
      el.textContent = isOpen ? '* COMISIONES ABIERTAS *' : '[X] COMISIONES CERRADAS [X]';
      el.classList.toggle('is-open', isOpen);
      el.classList.toggle('is-closed', !isOpen);
    });

    root.querySelectorAll('[data-comm-status-gif]').forEach((img) => {
      img.src = isOpen ? this.COMMISSIONS_OPEN_GIF : this.COMMISSIONS_CLOSED_GIF;
      img.alt = isOpen
        ? 'Comisiones abiertas - Getting Online'
        : 'Comisiones cerradas - Anime Girl Running';
    });

    root.querySelectorAll('[data-comm-status-note]').forEach((el) => {
      el.textContent = isOpen
        ? '¡Comisiones disponibles! Revisa tarifas o escríbeme <3'
        : 'Comisiones cerradas por el momento - ¡vuelve pronto <3!';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.PORTFOLIO_CONFIG.applyCommissionStatus();
});
