const normalizeAnswer2 = (value) => {
  const variants = ['風呂敷', '風呂敷き', 'フロシキ', 'ふろしき'];
  const normalized = value.toLowerCase().replace(/\s/g, '');
  if (variants.some(v => v.toLowerCase().replace(/\s/g, '') === normalized)) {
    return 'ふろしき';
  }
  return value;
};

initPuzzlePage({
  correctAnswer: 'ふろしき',
  nextPage: 'puzzle_ea92j.html',
  requirePuzzleState: true,
  answerNormalizer: normalizeAnswer2,

  colorMatcher: () =>
    hasSelectedColors({
      required: ['purple'],
      forbidden: ['blue', 'green', 'black'],
    }),

  colorResolver: (answerValue, context, colors) => {
    const result = [...colors];

    if (context.menuOpen && !result.includes('red')) {
      result.push('red');
    }

    return result;
  },
});