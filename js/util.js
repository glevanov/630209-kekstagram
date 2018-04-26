'use strict';
(function () {
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
    }
  };
})();
