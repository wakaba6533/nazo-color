const COLOR_NAME_MAP = {
  青: 'blue',
  あお: 'blue',
  ブルー: 'blue',
  blue: 'blue',
  赤: 'red',
  あか: 'red',
  レッド: 'red',
  red: 'red',
  黒: 'black',
  くろ: 'black',
  ブラック: 'black',
  black: 'black',
  白: 'white',
  しろ: 'white',
  ホワイト: 'white',
  white: 'white',
  緑: 'green',
  みどり: 'green',
  グリーン: 'green',
  green: 'green',
  紫: 'purple',
  むらさき: 'purple',
  パープル: 'purple',
  purple: 'purple',
};

const PUZZLE_STATE_STORAGE_KEY = 'nazo-color-state';

const getPuzzleState = () => {
  try {
    const raw = localStorage.getItem(PUZZLE_STATE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
};

const savePuzzleState = (patch) => {
  try {
    const current = getPuzzleState();
    const next = { ...current, ...patch };
    localStorage.setItem(PUZZLE_STATE_STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    // Ignore storage errors.
  }
};

const isMenuOpen = () => !!document.querySelector('.slide-menu.is-open');

const normalizeColorName = (value) => {
  if (!value) {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[\s\u3000]/g, '')
    .replace(/[.,。!?！?]/g, '');

  return COLOR_NAME_MAP[normalized] || null;
};

const findColorNamesInText = (value) => {
  const normalized = (value || '').toLowerCase();
  return Object.keys(COLOR_NAME_MAP).filter((name) => normalized.includes(name));
};

const getTextColorCandidates = () => {
  const candidates = [];
  const answerInput = document.querySelector('#answer-input');

  if (answerInput && answerInput.value) {
    const matchedNames = findColorNamesInText(answerInput.value);
    matchedNames.forEach((name) => {
      const normalizedName = normalizeColorName(name);
      if (normalizedName) {
        candidates.push(normalizedName);
      }
    });
  }

  document.querySelectorAll('[data-color-text]').forEach((element) => {
    const matchedNames = findColorNamesInText(element.dataset.colorText);
    matchedNames.forEach((name) => {
      const normalizedName = normalizeColorName(name);
      if (normalizedName) {
        candidates.push(normalizedName);
      }
    });
  });

  document.querySelectorAll('select').forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];
    const optionValue = selectedOption?.value || selectedOption?.textContent;
    const matchedNames = findColorNamesInText(optionValue);
    matchedNames.forEach((name) => {
      const normalizedName = normalizeColorName(name);
      if (normalizedName) {
        candidates.push(normalizedName);
      }
    });
  });

  return [...new Set(candidates)];
};

const findLayerColorsToFade = (colorNames) => {
  const images = Array.from(document.querySelectorAll('.puzzle-image img[data-color-name]:not(.fade-out)'));
  if (!images.length) {
    return [];
  }

  if (Array.isArray(colorNames) && colorNames.length) {
    return colorNames.filter((color) => images.some((img) => img.dataset.colorName === color));
  }

  const candidates = getTextColorCandidates();
  const availableColors = images.map((img) => img.dataset.colorName);
  const matchedColors = candidates.filter((color, index) => availableColors.includes(color) && candidates.indexOf(color) === index);

  if (matchedColors.length) {
    return matchedColors;
  }

  return [];
};

const fadeColorLayers = (colorNames) => {
  if (!Array.isArray(colorNames) || !colorNames.length) {
    return false;
  }

  const images = Array.from(document.querySelectorAll('.puzzle-image img[data-color-name]'));
  const toFade = images.filter((img) => colorNames.includes(img.dataset.colorName));

  if (!toFade.length) {
    return false;
  }

  toFade.forEach((img) => {
    img.classList.add('fade-out');
    img.dataset.hiddenByPuzzle = 'true';
  });

  return true;
};

const restoreColorLayers = () => {
  document.querySelectorAll('.puzzle-image img.fade-out').forEach((img) => {
    img.classList.remove('fade-out');
    delete img.dataset.hiddenByPuzzle;
  });
};

const initPuzzlePage = ({
  correctAnswer,
  nextPage,
  requiredColor,
  answerNormalizer,
  transitionDelay = 3000,
  colorResolver,
  answerMatcher,
  onCorrectAnswer,
}) => {
  const answerInput = document.querySelector('#answer-input');
  const submitButton = document.querySelector('.puzzle-submit');
  const resultDisplay = document.querySelector('#puzzle-result');
  let resultTimer;

  if (!answerInput || !submitButton || !resultDisplay) {
    return;
  }

  const normalizeAnswer = (value) => {
    const raw = answerNormalizer ? answerNormalizer(value) : value.trim();
    return raw;
  };
  
  const showResult = (text, type) => {
    clearTimeout(resultTimer);

    resultDisplay.textContent = text;
    resultDisplay.className = `puzzle-result ${type}`;

    resultDisplay.classList.remove("hidden");

    resultTimer = setTimeout(() => {
        resultDisplay.classList.add("hidden");
    }, 3000);
  };

  const resolveAnswerMatch = (answerValue, hiddenColors) => {
    if (typeof answerMatcher === 'function') {
      return answerMatcher(answerValue, hiddenColors, {
        menuOpen: isMenuOpen(),
        firstPuzzleRoute: getPuzzleState().firstPuzzleRoute,
      });
    }

    if (Array.isArray(correctAnswer)) {
      return correctAnswer.includes(answerValue);
    }

    return answerValue === correctAnswer;
  };

  const resolveColorsToFade = (answerValue) => {
    if (typeof colorResolver === 'function') {
      const overrideColors = colorResolver(answerValue, {
        menuOpen: isMenuOpen(),
        firstPuzzleRoute: getPuzzleState().firstPuzzleRoute,
      });

      if (Array.isArray(overrideColors) && overrideColors.length) {
        return findLayerColorsToFade(overrideColors);
      }
    }

    return findLayerColorsToFade();
  };

  const evaluateAnswer = (hiddenColors, answerValue) => {
    const answerMatch = resolveAnswerMatch(answerValue, hiddenColors);
    const colorMatch = !requiredColor || hiddenColors.includes(requiredColor);

    if (answerMatch && colorMatch) {
      showResult('正解', 'success');
      answerInput.disabled = true;
      submitButton.disabled = true;

      if (typeof onCorrectAnswer === 'function') {
        onCorrectAnswer(answerValue, {
          menuOpen: isMenuOpen(),
          firstPuzzleRoute: getPuzzleState().firstPuzzleRoute,
        });
      }

      setTimeout(() => {
        window.location.href = nextPage;
      }, transitionDelay);
    } else {
      showResult('不正解', 'error');
      setTimeout(() => {
        restoreColorLayers();
      }, 500);
      submitButton.disabled = false;
      answerInput.disabled = false;
    }
  };

  const submitHandler = () => {
    submitButton.disabled = true;
    answerInput.disabled = true;

    const answerValue = normalizeAnswer(answerInput.value).trim();
    const colorsToFade = resolveColorsToFade(answerValue);
    const didFade = fadeColorLayers(colorsToFade);

    setTimeout(() => {
      evaluateAnswer(didFade ? colorsToFade : [], answerValue);
    }, didFade ? 1000 : 0);
  };

  submitButton.addEventListener('click', submitHandler);
  answerInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitHandler();
    }
  });
};
