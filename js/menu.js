// ハンバーガーメニューの共通実装
function initMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const slideMenu = document.querySelector('.slide-menu');
  const closeButton = document.querySelector('.menu-close');
  const menuLinks = document.querySelectorAll('.menu-panel a');

  const openMenu = () => {
    slideMenu?.classList.add('is-open');
    menuToggle?.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    slideMenu?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

// DOMContentLoaded時に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenu);
} else {
  initMenu();
}
