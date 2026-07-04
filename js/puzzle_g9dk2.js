const normalizeAnswer4 = (value) => {
  const variants = ['緑', 'ミドリ', 'みどり'];
  const normalized = value.toLowerCase().replace(/\s/g, '');
  if (variants.some(v => v.toLowerCase().replace(/\s/g, '') === normalized)) {
    return 'みどり';
  }
  return value;
};

initPuzzlePage({
  correctAnswer: 'みどり',
  nextPage: 'puzzle_i4n0q.html',
  requirePuzzleState: true,
  answerNormalizer: normalizeAnswer4,

  colorMatcher: (hiddenColors) =>
    hiddenColors.length === 1 &&
    hiddenColors[0] === 'green',

  colorResolver: (answerValue, context, colors) => {
    const result = [...colors];

    if (context.menuOpen && !result.includes('red')) {
      result.push('red');
    }

    return result;
  },
});
