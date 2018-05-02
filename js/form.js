'use strict';
(function () {
  var form = document.querySelector('.img-upload__form');
  var uploadOverlay = form.querySelector('.img-upload__overlay');
  var hashtagsInput = form.querySelector('.text__hashtags');
  var errorOverlay = form.querySelector('.img-upload__message--error');

  function validateHashTags(inputHashtagsString) {
    // Ошибки удобно собирать в объект с уникальными ключами, чтобы избежать проблемы их дублирования
    var errorMessageObject = {};
    var hashtagsArray = inputHashtagsString.split(' ');
    var HASHTAGS_MAX_NUMBER = 5;
    var HASHTAG_MAX_LENGTH = 20;

    function checkHashtagStart(hashString) {
      if (hashString[0] !== '#') {
        errorMessageObject['Хэш-тэг должен начинаться с решетки'] = true;
      }
    }

    function checkHashtagLength(hashString) {
      if (hashString.length === 1) {
        errorMessageObject['Хэш-тэг не может состояить из одного символа'] = true;
      } else if (hashString.length > HASHTAG_MAX_LENGTH) {
        errorMessageObject['Хэш-тэг длиннее ' + HASHTAG_MAX_LENGTH + ' символов'] = true;
      }
    }

    function checkHashtagNumber(hashArray) {
      if (hashArray.length > HASHTAGS_MAX_NUMBER) {
        errorMessageObject['Количество хэш-тэгов больше чем ' + HASHTAGS_MAX_NUMBER] = true;
      }
    }

    function checkHashtagDuplicates(hashArray) {
      // Если после сортировки элемент не находится после своего индекса, значит он уникальный
      var sortedArray = hashArray.slice();
      sortedArray = sortedArray.map(function (item) {
        return item.toLowerCase();
      });
      sortedArray.sort();

      for (var j = 0; j < sortedArray.length; j++) {
        var nextIndex = j + 1;
        if (sortedArray.indexOf(sortedArray[j], nextIndex) !== -1) {
          errorMessageObject['Хэш-тэг не может повторяться'] = true;
        }
      }
    }

    function parseErrors(errorObject) {
      // Если ошибок нет, возвращаем -1. Если есть, склеиваем в строку.
      var errorArray = Object.keys(errorObject);

      function manyErrors(arr) {
        var result = '';
        var separator = '; ';
        var lastElementIndex = arr.length - 1;

        for (var i = 0; i < lastElementIndex; i++) {
          result += arr[i] + separator;
        }
        result += arr[lastElementIndex];
        return result;

      }

      switch (errorArray.length) {
        case 0:
          return -1;
        case 1:
          return errorArray[0];
        default:
          return manyErrors(errorArray);
      }
    }

    // Проверяем не пустой ли у нас ввод
    if (inputHashtagsString === '') {
      return -1;
    }

    checkHashtagNumber(hashtagsArray);
    checkHashtagDuplicates(hashtagsArray);
    hashtagsArray.forEach(function (hashtag) {
      checkHashtagStart(hashtag);
      checkHashtagLength(hashtag);
    });

    return parseErrors(errorMessageObject);
  }

  function onHashtagsInput(evt) {
    var userInput = evt.currentTarget.value;
    if (validateHashTags(userInput) === -1) {
      hashtagsInput.setCustomValidity('');
    } else {
      hashtagsInput.setCustomValidity(validateHashTags(userInput));
    }
  }

  function onLoad() {
    window.util.hideElement(uploadOverlay);
    uploadOverlay.value = '';
  }

  function onError(errorMessage) {
    window.util.hideElement(uploadOverlay);
    window.util.displayHiddenElement(errorOverlay);
    errorMessage = '— ' + errorMessage;
    errorOverlay.querySelector('.error__links').insertAdjacentText('beforebegin', errorMessage);
  }

  hashtagsInput.addEventListener('input', function (evt) {
    onHashtagsInput(evt);
  });

  form.addEventListener('submit', function (evt) {
    window.backend.sendData(new FormData(form), onLoad, onError);
    evt.preventDefault();
  });

})();
