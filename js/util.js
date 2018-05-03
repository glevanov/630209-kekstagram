'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var bigPicture = document.querySelector('.big-picture');

  window.util = {
    displayHiddenElement: function (hiddenElement) {
      hiddenElement.classList.remove('hidden');
    },
    hideElement: function (visibleElement) {
      visibleElement.classList.add('hidden');
    },
    getRandomInteger: function (min, max) {
      return Math.floor(
          Math.random() * (max - min + 1) + min
      );
    },
    addEscListener: function () {
      document.addEventListener('keydown', window.util.onEscPress);
    },
    removeEscListener: function () {
      document.removeEventListener('keydown', window.util.onEscPress);
    },
    onEscPress: function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        window.util.closeUpload();
        window.util.closeBigPicture();
      }
    },
    closeUpload: function () {
      window.util.hideElement(uploadOverlay);
      uploadOverlay.value = '';
      window.util.removeEscListener();
    },
    closeBigPicture: function () {
      window.util.hideElement(bigPicture);
      window.util.removeEscListener();
    },
    debounce: function (fun) {
      var lastTimeout = null;

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          fun.apply(null, args);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
