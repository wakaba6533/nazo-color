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

    if (answerValue === 'おしどり' && menuOpen && firstPuzzleRoute === 'makuake') {
      return ['red', 'black'];
    }

    if (answerValue === 'おしどり' && menuOpen) {
      return ['red'];
    }

    if (answerValue === 'おしどり' && firstPuzzleRoute === 'makuake') {
      return ['black'];
    }

    return [];
  },
});
