const normalizeAnswer3 = (value) => {
  const variants = ['子供', '子ども', 'KODOMO', 'kodomo', 'こども', 'ＫＯＤＯＭＯ'];
  const normalized = value.toLowerCase().replace(/\s/g, '');
  if (variants.some(v => v.toLowerCase().replace(/\s/g, '') === normalized)) {
    return 'こども';
  }
  return value;
};

initPuzzlePage({
  correctAnswer: 'こども',
  nextPage: 'puzzle_g9dk2.html',
  requirePuzzleState: true,
  answerNormalizer: normalizeAnswer3,

  colorMatcher: () =>
    hasSelectedColors({
      required: ['red'],
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
