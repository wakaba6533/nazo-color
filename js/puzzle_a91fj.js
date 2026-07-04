const normalizeAnswer1 = (value) => {
  const variants = {
    'まくあけ': ['幕開け', '幕明け', '幕あけ', 'マクアケ', 'まくあけ'],
    'りあおう': ['リアオウ', 'リア王', 'りあおう'],
  };

  const normalized = value.toLowerCase().replace(/\s/g, '');
  for (const [key, list] of Object.entries(variants)) {
    if (list.some(v => v.toLowerCase().replace(/\s/g, '') === normalized)) {
      return key;
    }
  }
  return value;
};

initPuzzlePage({
  correctAnswer: ['まくあけ', 'りあおう'],
  nextPage: 'puzzle_c2k8c.html',
  requirePuzzleState: false,
  answerNormalizer: normalizeAnswer1,

  answerMatcher: (answerValue) => {
    return answerValue === 'まくあけ' || answerValue === 'りあおう';
  },
  colorMatcher: (hiddenColors) => {
    const answerValue = normalizeAnswer1(
      document.querySelector('#answer-input').value
    ).trim();

    if (answerValue === 'まくあけ') {
      return (
        hiddenColors.includes('red') &&
        !hiddenColors.includes('blue') &&
        !hiddenColors.includes('black')
      );
    }
    if (answerValue === 'りあおう') {
      return (
        hiddenColors.includes('red') &&
        hiddenColors.includes('blue') &&
        !hiddenColors.includes('black')
      );
    }

    return false;
  },
  colorResolver: (answerValue, context, colors) => {
    const result = [...colors];

    if (!result.includes('red')) {
      result.push('red');
    }

    if (answerValue === 'りあおう' && !result.includes('blue')) {
      result.push('blue');
    }

    return result;
  },
  onCorrectAnswer: (answerValue) => {
    savePuzzleState({
      firstPuzzleRoute: answerValue === 'りあおう' ? 'riaou' : 'makuake',
    });
  },
});
