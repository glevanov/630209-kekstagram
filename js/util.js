'use strict';
(function () {
  window.util = {
    displayHiddenElement: function (hiddenElement) {
      hiddenElement.classList.remove('hidden');
    },
    hideElement: function (visibleElement) {
      visibleElement.classList.add('hidden');
    }
  };
})();
