// ハンバーガーメニューの共通実装
function initMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const slideMenu = document.querySelector('.slide-menu');
  const closeButton = document.querySelector('.menu-close');
  const menuPanel = document.querySelector('.menu-panel');
  const puzzleStateKey = 'nazo-color-state';
  const currentPath = window.location.pathname;
  const isInHtmlFolder = currentPath.includes('/html/');

  const resolvePageHref = (pageName) => {
    const pageBase = isInHtmlFolder ? '' : 'html/';

    if (pageName.includes('puzzle-01')) return `${pageBase}puzzle-01.html`;
    if (pageName.includes('puzzle-02')) return `${pageBase}puzzle-02.html`;
    if (pageName.includes('puzzle-03')) return `${pageBase}puzzle-03.html`;
    if (pageName.includes('puzzle-04')) return `${pageBase}puzzle-04.html`;
    if (pageName.includes('puzzle-05')) return `${pageBase}puzzle-05.html`;
    return isInHtmlFolder ? '../index.html' : 'index.html';
  };

  const getPuzzleState = () => {
    try {
      const raw = localStorage.getItem(puzzleStateKey);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  };

  const savePuzzleState = (patch) => {
    try {
      const current = getPuzzleState();
      const next = { ...current, ...patch };
      localStorage.setItem(puzzleStateKey, JSON.stringify(next));
    } catch (error) {
      // Ignore storage errors.
    }
  };

  const updateMenuLinks = () => {
    if (!menuPanel) {
      return;
    }

    const state = getPuzzleState();
    const visitedPages = Array.isArray(state.visitedPages) ? state.visitedPages : [];
    const existingLinks = Array.from(menuPanel.querySelectorAll('a'));
    existingLinks.forEach((link) => link.remove());

    const defaultLinks = [
      { href: isInHtmlFolder ? '../index.html' : 'index.html', label: 'HOME' },
      { href: isInHtmlFolder ? 'credit.html' : 'html/credit.html', label: 'CREDIT' },
    ];
    if (isClearPage) {
      defaultLinks.push({ href: isInHtmlFolder ? 'clear_98q4hvu5bweiebvq98w75v.html' : 'html/clear_98q4hvu5bweiebvq98w75v.html', label: 'GAME CLEAR' });
    }
    const puzzleLinks = visitedPages.map((page) => ({
      href: resolvePageHref(page.pageName || ''),
      label: page.label,
      pageName: page.pageName,
    }));

    const items = [...defaultLinks, ...puzzleLinks];
    items.forEach((item) => {
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.label;
      link.dataset.menuPage = item.pageName || '';
      link.addEventListener('click', closeMenu);
      menuPanel.appendChild(link);
    });
  };

  const openMenu = () => {
    slideMenu?.classList.add('is-open');
    menuToggle?.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    slideMenu?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  const handleOutsideTap = (event) => {
    if (!slideMenu?.classList.contains('is-open')) {
      return;
    }

    const target = event.target;
    const isInsideMenu = slideMenu.contains(target) || menuToggle?.contains(target);
    const isSubmitButton = target instanceof HTMLElement && target.classList.contains('puzzle-submit');

    if (!isInsideMenu && !isSubmitButton) {
      closeMenu();
    }
  };

  menuToggle?.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
  document.addEventListener('click', handleOutsideTap);

  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  const isClearPage = pageName.includes('clear_');
  const isPuzzlePage = /puzzle-\d+/.test(pageName);
  const pageLabel = (() => {
    if (pageName.includes('puzzle-01')) return 'Q1';
    if (pageName.includes('puzzle-02')) return 'Q2';
    if (pageName.includes('puzzle-03')) return 'Q3';
    if (pageName.includes('puzzle-04')) return 'Q4';
    if (pageName.includes('puzzle-05')) return 'Q5';
    return 'HOME';
  })();

  const pageHref = resolvePageHref(pageName);

  const state = getPuzzleState();
  const visitedPages = Array.isArray(state.visitedPages) ? state.visitedPages : [];
  const pageAlreadyRecorded = visitedPages.some((entry) => entry.pageName === pageName.replace('.html', ''));
  if (!pageAlreadyRecorded && pageName !== 'index.html' && isPuzzlePage) {
    visitedPages.push({ href: pageHref, label: pageLabel, pageName: pageName.replace('.html', '') });
  }
  savePuzzleState({ visitedPages });
  updateMenuLinks();
}

// DOMContentLoaded時に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenu);
} else {
  initMenu();
}
