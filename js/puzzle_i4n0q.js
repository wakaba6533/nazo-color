const blackImage = document.querySelector('#puzzle-5-black');
const puzzleState = JSON.parse(localStorage.getItem('nazo-color-state') || '{}');
if (blackImage) {
  blackImage.src = puzzleState.firstPuzzleRoute === 'riaou'
    ? '../images/5_black_riaou.png'
    : '../images/5_black.png';
}

const normalizeAnswer5 = (value) => {
  const variants = ['オシドリ', 'おしどり', '鴛鴦'];
  const normalized = value.toLowerCase().replace(/\s/g, '');
  if (variants.some(v => v.toLowerCase().replace(/\s/g, '') === normalized)) {
    return 'おしどり';
  }
  return value;
};

initPuzzlePage({
  correctAnswer: 'おしどり',
  nextPage: 'clear_vu5bw.html',
  requirePuzzleState: true,
  answerNormalizer: normalizeAnswer5,

  answerMatcher: (answerValue, hiddenColors, context) => {
    const menuOpen = !!context?.menuOpen;
    const firstPuzzleRoute = context?.firstPuzzleRoute;

    return answerValue === 'おしどり' && menuOpen && firstPuzzleRoute === 'riaou';
  },

  colorResolver: (answerValue, context, colors) => {
    const result = [...colors];

    const menuOpen = !!context?.menuOpen;
    const firstPuzzleRoute = context?.firstPuzzleRoute;

    result.push('green');

    if (menuOpen && !result.includes('red')) {
      result.push('red');
    }

    if (firstPuzzleRoute === 'makuake' && !result.includes('black')) {
      result.push('black');
    }

    if (firstPuzzleRoute === 'riaou' && !result.includes('blue')) {
      result.push('blue');
    }

    return result;
  },
});
