const blackImage = document.querySelector('#puzzle-5-black');
const puzzleState = JSON.parse(localStorage.getItem('nazo-color-state') || '{}');
if (blackImage) {
  blackImage.src = puzzleState.firstPuzzleRoute === 'riaou'
    ? '../images/5_black_riaou.png'
    : '../images/5_black.png';
}

initPuzzlePage({
  correctAnswer: 'おしどり',
  nextPage: 'clear_98q4hvu5bweiebvq98w75v.html',
  requiredColor: '',
  answerMatcher: (answerValue, hiddenColors, context) => {
    const menuOpen = !!context?.menuOpen;
    const firstPuzzleRoute = context?.firstPuzzleRoute;

    return answerValue === 'おしどり' && menuOpen && firstPuzzleRoute === 'riaou';
  },
  colorResolver: (answerValue, context) => {
    const menuOpen = !!context?.menuOpen;
    const firstPuzzleRoute = context?.firstPuzzleRoute;

    if (menuOpen && firstPuzzleRoute === 'makuake') {
      return ['red', 'black'];
    }

    if (menuOpen && firstPuzzleRoute === 'riaou') {
      return ['red'];
    }

    if (firstPuzzleRoute === 'makuake') {
      return ['black'];
    }

    return [];
  },
});
