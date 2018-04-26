'use strict';
// Зависит от slider.js
(function () {
  var filterEffectLevel;
  var currentFilter;
  var filterParameters = {
    NONE: {
      CSS: ''
    },
    CHROME: {
      MIN: 0,
      MAX: 1,
      CSS_START: 'filter: grayscale(',
      CSS_END: ');'
    },
    SEPIA: {
      MIN: 0,
      MAX: 1,
      CSS_START: 'filter: sepia(',
      CSS_END: ');'
    },
    MARVIN: {
      MIN: 0,
      MAX: 100, // %
      CSS_START: 'filter: invert(',
      CSS_END: '%);'
    },
    PHOBOS: {
      MIN: 0,
      MAX: 3, // px
      CSS_START: 'filter: blur(',
      CSS_END: 'px);'
    },
    HEAT: {
      MIN: 1,
      MAX: 3,
      CSS_START: 'filter: brightness(',
      CSS_END: ');'
    }
  };

  var FILTERS_LOOKUP_DICTIONARY = {
    'effects__preview--none': 'NONE',
    'effects__preview--chrome': 'CHROME',
    'effects__preview--sepia': 'SEPIA',
    'effects__preview--marvin': 'MARVIN',
    'effects__preview--phobos': 'PHOBOS',
    'effects__preview--heat': 'HEAT'
  };

  var uploadSection = document.querySelector('.img-upload');
  var picturePreview = uploadSection.querySelector('.img-upload__preview img');
  var filtersList = uploadSection.querySelector('.effects__list');
  var sliderPin = uploadSection.querySelector('.scale__pin');

  function setDefaultValues() {
    updateFilterEffectLevel();
    currentFilter = 'NONE';
  }

  function updateFilterEffectLevel() {
    filterEffectLevel = parseInt(window.slider.sliderValue, 10);
  }

  function appendFiltersEventListeners() {
    var filterControls = filtersList.querySelectorAll('.effects__preview');

    filterControls.forEach(function (filterIcon) {
      filterIcon.addEventListener('click', function (evt) {
        onFilterClick(evt);
      });
    });
  }

  function onFilterClick(evt) {
    var currentFilterCSSClass = evt.currentTarget.classList[1];
    currentFilter = FILTERS_LOOKUP_DICTIONARY[currentFilterCSSClass];
    updateFilterEffectLevel();
    applyCurrentFilter();
  }

  function calculateFilterValue() {
    var min = filterParameters[currentFilter].MIN;
    var max = filterParameters[currentFilter].MAX;
    return (max - min) * (filterEffectLevel / 100) + min;
  }

  function getFilterCSSString() {
    if (currentFilter === 'NONE') {
      return filterParameters.NONE.CSS;
    }

    var CSSStart = filterParameters[currentFilter].CSS_START;
    var CSSEnd = filterParameters[currentFilter].CSS_END;

    return CSSStart + calculateFilterValue() + CSSEnd;
  }

  function applyCurrentFilter() {
    picturePreview.setAttribute('style', getFilterCSSString());
  }

  // Реализует применение фильтра при движении слайдера
  function onSliderClick() {
    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      updateFilterEffectLevel();
      applyCurrentFilter();
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  setDefaultValues();
  appendFiltersEventListeners();
  sliderPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    onSliderClick();
  });
})();