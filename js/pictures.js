'use strict';

// #02# Константы
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// #03# DOM переменные
var bigPicture = document.querySelector('.big-picture');
var bigPictureCancelButton = bigPicture.querySelector('.big-picture__cancel');
var uploadSection = document.querySelector('.img-upload');
var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
var uploadFileInput = uploadSection.querySelector('#upload-file');
var uploadCancelButton = uploadSection.querySelector('#upload-cancel');
var hashtagsInput = document.querySelector('.text__hashtags');

// #04# Объявление функций


// Отрисовыват случайные картинки с использованием тестовых данных
function outputPictures() {

  var pictureTemplate = document.querySelector('#picture').content;
  var picturesElement = document.querySelector('.pictures');

  for (var k = 0; k < window.data.PICTURES_QUANTITY; k++) {
    var pictureElement = pictureTemplate.cloneNode(true);

    // Вставляем контент в шаблон
    pictureElement.querySelector('.picture__img').src = window.data.picturesArray[k].url;
    pictureElement.querySelector('.picture__img').setAttribute('data-index', k);
    pictureElement.querySelector('.picture__stat--likes').textContent = window.data.picturesArray[k].likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = window.data.picturesArray[k].comments.length;

    picturesElement.appendChild(pictureElement);
  }
}

function appendPicturesEventListeners() {
  var pictures = document.querySelectorAll('.picture__link');
  for (var i = 0; i < window.data.PICTURES_QUANTITY; i++) {
    pictures[i].addEventListener('click', onPictureClick);
  }
}

function onPictureClick(evt) {
  outputBigPicture(evt);
  addEscListener();
}

// Показывает большую картинку и заполняет её данными
function outputBigPicture(evt) {
  var commentsIndex;

  var commentsSection = bigPicture.querySelector('.social__comments');
  var currentElement = evt.currentTarget;
  var currentImage = currentElement.querySelector('img');
  var CURRENT_IMAGE_SRC = currentImage.attributes[1].value;
  var CURRENT_LIKES = currentElement.querySelector('.picture__stat--likes').firstChild.data;
  var CURRENT_COMMENTS = Number(currentElement.querySelector('.picture__stat--comments').firstChild.data);
  var CURRENT_COMMENTS_INDEX = currentImage.dataset.index;

  // Генерирует комментарии для большой картинки
  // ...сначала разметку
  function getBigPictureCommentsMarkup() {
    var markup = '';
    var markupElement = '';

    for (commentsIndex = 0; commentsIndex < CURRENT_COMMENTS; commentsIndex++) {
      markupElement = '<li class="social__comment social__comment--text">\n' +
        '  <img class="social__picture" src="img/avatar-' + window.util.getRandomInteger(1, 6) + '.svg" \n' +
        '    alt="Аватар комментатора фотографии" \n' +
        '    width="35" height="35">\n' +
        '</li>';
      markup += markupElement;
    }

    return markup;
  }

  // ...потом текст комментария
  function getBigPictureCommentsContent() {
    for (commentsIndex = 0; commentsIndex < CURRENT_COMMENTS; commentsIndex++) {
      commentsSection.childNodes.item(commentsIndex).insertAdjacentText('beforeend',
          window.data.picturesArray[CURRENT_COMMENTS_INDEX].comments[commentsIndex]);
    }
  }

  // Показывает большую картинку и вставляет данные
  window.util.displayHiddenElement(bigPicture);
  bigPicture.querySelector('.big-picture__img img').src = CURRENT_IMAGE_SRC;
  bigPicture.querySelector('.likes-count').textContent = CURRENT_LIKES;
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
  // Обнуляет блок комментариев и вставляет комментарии
  commentsSection.textContent = '';
  commentsSection.insertAdjacentHTML('beforeend', getBigPictureCommentsMarkup());

  getBigPictureCommentsContent();
}

function closeUpload() {
  window.util.hideElement(uploadOverlay);
  uploadOverlay.value = '';
  removeEscListener();
}

function closeBigPicture() {
  window.util.hideElement(bigPicture);
  removeEscListener();
}

function onEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUpload();
    closeBigPicture();
  }
}

function addEscListener() {
  document.addEventListener('keydown', onEscPress);
}

function removeEscListener() {
  document.removeEventListener('keydown', onEscPress);
}

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
  for (var i = 0; i < hashtagsArray.length; i++) {
    checkHashtagStart(hashtagsArray[i]);
    checkHashtagLength(hashtagsArray[i]);
  }

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

// #05# Разное
uploadFileInput.addEventListener('change', function () {
  window.util.displayHiddenElement(uploadOverlay);
  addEscListener();
});

uploadFileInput.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    window.util.displayHiddenElement(uploadOverlay);
  }
});

uploadCancelButton.addEventListener('click', function () {
  closeUpload();
});

bigPictureCancelButton.addEventListener('click', function () {
  closeBigPicture();
});

hashtagsInput.addEventListener('input', function (evt) {
  onHashtagsInput(evt);
});

// #06# Вызовы функций
outputPictures();
appendPicturesEventListeners();
