'use strict';
(function () {
  var currentResizeValue;

  var RESIZE_STEP = 25;
  var RESIZE_VALUE_BOUNDARIES = {
    MIN: 25,
    MAX: 100
  };

  var resizeSection = document.querySelector('.resize');
  var resizeValue = resizeSection.querySelector('.resize__control--value');
  var resizeIncreaseButton = resizeSection.querySelector('.resize__control--plus');
  var resizeDecreaseButton = resizeSection.querySelector('.resize__control--minus');
  var picturePreview = document.querySelector('.img-upload__preview img');

  function validateValueBoundaries() {
    function checkBoundaries(value) {
      if (value > RESIZE_VALUE_BOUNDARIES.MAX) {
        return RESIZE_VALUE_BOUNDARIES.MAX;
      }
      if (value < RESIZE_VALUE_BOUNDARIES.MIN) {
        return RESIZE_VALUE_BOUNDARIES.MIN;
      }
      return value;
    }

    currentResizeValue = checkBoundaries(currentResizeValue);
  }

  function updateValueField() {
    resizeValue.setAttribute('value', currentResizeValue + '%');
  }

  function updateResizeStyle() {
    picturePreview.setAttribute('style',
        'transform: scale(' + currentResizeValue / 100 + ')'
    );
  }

  function applyResize() {
    validateValueBoundaries();
    updateValueField();
    updateResizeStyle();
  }

  function onIncreaseClick() {
    currentResizeValue += RESIZE_STEP;
    applyResize();
  }

  function onDecreaseClick() {
    currentResizeValue -= RESIZE_STEP;
    applyResize();
  }

  currentResizeValue = parseInt(resizeValue.value, 10);

  resizeIncreaseButton.addEventListener('click', onIncreaseClick);
  resizeDecreaseButton.addEventListener('click', onDecreaseClick);
})();
