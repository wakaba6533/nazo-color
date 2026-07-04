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

const COLOR_DISPLAY_MAP = {
  red: '赤',
  blue: '青',
  black: '黒',
  white: '白',
  green: '緑',
  purple: '紫',
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

const highlightRedInCredit = () => {
  if (!isMenuOpen()) {
    return;
  }

  // Find the CREDIT link in the menu
  const creditLink = Array.from(document.querySelectorAll('.menu-panel a')).find(
    (link) => link.textContent.trim() === 'CREDIT'
  );

  if (!creditLink) {
    return;
  }

  // Replace "RED" with a highlighted version
  const originalText = creditLink.textContent;
  const regex = /RED/i;

  if (regex.test(originalText)) {
    creditLink.innerHTML = originalText.replace(
      regex,
      '<span class="credit-red-highlight">RED</span>'
    );

    // Remove highlight after 1.5 seconds
    setTimeout(() => {
      creditLink.textContent = originalText;
    }, 1500);
  }
};

const showColorDetectionMessage = (colorNames) => {
  if (!Array.isArray(colorNames) || !colorNames.length) {
    return;
  }

  const answerInput = document.querySelector('#answer-input');
  if (!answerInput) {
    return;
  }

  // Create message container
  const messageContainer = document.createElement('div');
  messageContainer.className = 'color-detection-message';
  messageContainer.id = 'color-detection-message';

  // Build message text
  const colorTexts = colorNames.map(color => COLOR_DISPLAY_MAP[color] || color).join('、');
  messageContainer.textContent = `${colorTexts} を検出しました`;

  // body直下に追加
  document.body.appendChild(messageContainer);

  // Submitボタンの位置を取得
  const submitButton = document.querySelector(".puzzle-submit");
  if (!submitButton) return;

  const rect = submitButton.getBoundingClientRect();

  // サイズ取得
  messageContainer.style.visibility = "hidden";
  messageContainer.classList.add("visible");

  const messageRect = messageContainer.getBoundingClientRect();

  // Submitボタンの真上に配置
  messageContainer.style.left =
    `${rect.right - messageRect.width}px`;

  messageContainer.style.top =
    `${Math.max(16, rect.top - messageRect.height - 12)}px`;

  messageContainer.style.visibility = "";

  // Trigger animation
  requestAnimationFrame(() => {
    messageContainer.classList.add("visible");
  });

  // Remove message after 1.5 seconds
  setTimeout(() => {
    messageContainer.classList.remove("visible");

    setTimeout(() => {
      messageContainer.remove();
    }, 250);

  }, 1250);
};

const hasSelectedColors = ({
  required = [],
  forbidden = [],
}) => {
  const selected = [...document.querySelectorAll("select")]
    .map(select => select.value);

  return (
    required.every(color => selected.includes(color)) &&
    forbidden.every(color => !selected.includes(color))
  );
};

const initPuzzlePage = ({
  correctAnswer,
  nextPage,
  requiredColor,
  colorMatcher,
  answerNormalizer,
  transitionDelay = 3000,
  colorResolver,
  answerMatcher,
  onCorrectAnswer,
  requirePuzzleState = false,
}) => {
  if (requirePuzzleState && !getPuzzleState().firstPuzzleRoute) {
    window.location.replace('../index.html');
    return;
  }

  const answerInput = document.querySelector('#answer-input');
  const submitButton = document.querySelector('.puzzle-submit');
  const resultDisplay = document.querySelector('#puzzle-result');
  let resultTimer;

  if (!answerInput || !submitButton || !resultDisplay) {
    return;
  }

  let processingOverlay = document.getElementById('puzzle-processing-overlay');
  if (!processingOverlay) {
    processingOverlay = document.createElement('div');
    document.body.appendChild(processingOverlay);
  }

  const normalizeAnswer = (value) => {
    const raw = answerNormalizer ? answerNormalizer(value) : value.trim();
    return raw;
  };
  
  const showResult = (type) => {
    clearTimeout(resultTimer);

    resultDisplay.innerHTML = '';
    resultDisplay.className = `puzzle-result ${type}`;
    resultDisplay.classList.remove('hidden');
    resultDisplay.classList.add('visible');

    const icon = document.createElement('img');
    const iconPath = window.location.pathname.includes('/html/') ? '../images/' : 'images/';
    icon.src = type === 'success' ? `${iconPath}maru.png` : `${iconPath}batsu.png`;
    icon.alt = type === 'success' ? '正解' : '不正解';
    icon.className = 'puzzle-result-icon';
    resultDisplay.appendChild(icon);

    resultTimer = setTimeout(() => {
      resultDisplay.classList.remove('visible');
      resultDisplay.classList.add('hidden');
    }, 2000);
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
    // まず通常の色判定
    let colors = findLayerColorsToFade();

    // 必要なら追加・変更
    if (typeof colorResolver === 'function') {
      colors = colorResolver(answerValue, {
        menuOpen: isMenuOpen(),
        firstPuzzleRoute: getPuzzleState().firstPuzzleRoute,
      }, colors);
    }

    return colors;
  };

  const evaluateAnswer = (hiddenColors, answerValue) => {
    const answerMatch = resolveAnswerMatch(answerValue, hiddenColors);
    const colorMatch = colorMatcher
      ? colorMatcher(hiddenColors)
      : (!requiredColor || hiddenColors.includes(requiredColor));

    if (answerMatch && colorMatch) {
      showResult('success');
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
      }, 2000);
    } else {
      showResult('error');
      setTimeout(() => {
        restoreColorLayers();
        resultDisplay.classList.remove('visible');
        resultDisplay.classList.add('hidden');
        submitButton.disabled = false;
        answerInput.disabled = false;
      }, 2000);
    }
  };

  const submitHandler = () => {
    submitButton.disabled = true;
    answerInput.disabled = true;
    processingOverlay.classList.add('is-visible');

    const answerValue = normalizeAnswer(answerInput.value).trim();
    const colorsToFade = resolveColorsToFade(answerValue);
    const didFade = fadeColorLayers(colorsToFade);

    // Show detected colors
    if (colorsToFade.length > 0) {
      showColorDetectionMessage(colorsToFade);
    }

    highlightRedInCredit();

    setTimeout(() => {
      processingOverlay.classList.remove('is-visible');
      evaluateAnswer(didFade ? colorsToFade : [], answerValue);
    }, 1500);
  };

  submitButton.addEventListener('click', submitHandler);
  answerInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitHandler();
    }
  });
};
