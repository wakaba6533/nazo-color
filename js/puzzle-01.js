initPuzzlePage({
  correctAnswer: ['まくあけ', 'りあおう'],
  nextPage: 'puzzle-02.html',
  requiredColor: '',
  answerMatcher: (answerValue, hiddenColors) => {
    if (answerValue === 'まくあけ') {
      return hiddenColors.includes('red');
    }

    if (answerValue === 'りあおう') {
      return hiddenColors.includes('red') && hiddenColors.includes('blue');
    }

    return false;
  },
  colorResolver: (answerValue) => {
    if (answerValue === 'まくあけ') {
      return ['red'];
    }

    if (answerValue === 'りあおう') {
      return ['red', 'blue'];
    }

    return [];
  },
  onCorrectAnswer: (answerValue) => {
    savePuzzleState({
      firstPuzzleRoute: answerValue === 'りあおう' ? 'riaou' : 'makuake',
    });
  },
});
