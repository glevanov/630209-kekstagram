'use strict';
(function () {
  var ESC_KEYCODE = 27;

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
        window.gallery.closeBigPicture();
      }
    },
    closeUpload: function () {
      window.util.hideElement(window.gallery.uploadOverlay);
      window.gallery.uploadOverlay.value = '';
      window.util.removeEscListener();
    }
  };
})();
