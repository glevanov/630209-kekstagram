'use strict';

// #01# Переменные
var picturesArray = [];
var filterValue = 20;

// #02# Константы
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var PICTURES_QUANTITY = 25;
var PICTURES_LIKES_MIN = 15;
var PICTURES_LIKES_MAX = 250;
var PICTURES_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var PICTURES_DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];
// #03# DOM переменные
var bigPicture = document.querySelector('.big-picture');
var bigPictureCancelButton = bigPicture.querySelector('.big-picture__cancel');
var uploadSection = document.querySelector('.img-upload');
var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
var uploadFileInput = uploadSection.querySelector('#upload-file');
var uploadCancelButton = uploadSection.querySelector('#upload-cancel');
var uploadFiltersList = uploadSection.querySelector('.effects__list');
var uploadPicturePreview = uploadSection.querySelector('.img-upload__preview img');
var hashtagsInput = document.querySelector('.text__hashtags');

// #04# Объявление функций
function getRandomInteger(min, max) {
  return Math.floor(
      Math.random() * (max - min + 1) + min
  );
}

function getDescription() {
  return PICTURES_DESCRIPTION[getRandomInteger(0, PICTURES_DESCRIPTION.length - 1)];
}

function getComment() {
  return PICTURES_COMMENTS[getRandomInteger(0, PICTURES_COMMENTS.length - 1)];
}

function getCommentsArray() {
  var commentsArray = [];
  var commentsIndex = getRandomInteger(1, 2);

  for (var j = 0; j < commentsIndex; j++) {
    commentsArray.push(getComment());
  }

  return commentsArray;
}

// Наполняет массив тестовых данных
function populatePicturesArray() {
  for (var i = 1; i <= PICTURES_QUANTITY; i++) {
    var picElement = {
      url: 'photos/' + i + '.jpg',
      likes: getRandomInteger(PICTURES_LIKES_MIN, PICTURES_LIKES_MAX),
      comments: getCommentsArray(),
      description: getDescription()
    };

    picturesArray.push(picElement);
  }
}

// Отрисовыват случайные картинки с использованием тестовых данных
function outputPictures() {

  var pictureTemplate = document.querySelector('#picture').content;
  var picturesElement = document.querySelector('.pictures');

  for (var k = 0; k < PICTURES_QUANTITY; k++) {
    var pictureElement = pictureTemplate.cloneNode(true);

    // Вставляем контент в шаблон
    pictureElement.querySelector('.picture__img').src = picturesArray[k].url;
    pictureElement.querySelector('.picture__img').setAttribute('data-index', k);
    pictureElement.querySelector('.picture__stat--likes').textContent = picturesArray[k].likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picturesArray[k].comments.length;

    picturesElement.appendChild(pictureElement);
  }
}

function appendPicturesEventListeners() {
  var pictures = document.querySelectorAll('.picture__link');
  for (var i = 0; i < PICTURES_QUANTITY; i++) {
    pictures[i].addEventListener('click', onPictureClick);
  }
}

function appendFiltersEventListeners() {
  var filterControls = uploadFiltersList.querySelectorAll('.effects__preview');
  for (var i = 0; i < filterControls.length; i++) {
    filterControls[i].addEventListener('click', onFilterClick);
  }
}

function onPictureClick(evt) {
  outputBigPicture(evt);
  addEscListener();
}

function onFilterClick(evt) {
  var currentFilter = evt.currentTarget.classList[1];
  applyCurrentFilter(currentFilter);
}

function applyCurrentFilter(currentFilter) {
  var GRAYSCALE_MAX = 1;
  var SEPIA_MAX = 1;
  var INVERT_MAX = 100; // %
  var BLUR_MAX = 3; // px
  var BRIGHTNESS_MIN = 1;
  var BRIGHTNESS_MAX = 3;

  function getFilterValue(max, value, min) {
    // Аргумент min опционален и по умолчанию равен 0
    if (typeof min === 'undefined') {
      min = 0;
    }
    return (max - min) * (value / 100) + min;
  }

  var FILTERS_COLLECTION = {
    'effects__preview--none': '',
    'effects__preview--chrome': 'filter: grayscale(' + getFilterValue(GRAYSCALE_MAX, filterValue) + ')',
    'effects__preview--sepia': 'filter: sepia(' + getFilterValue(SEPIA_MAX, filterValue) + ')',
    'effects__preview--marvin': 'filter: invert(' + getFilterValue(INVERT_MAX, filterValue) + '%)',
    'effects__preview--phobos': 'filter: blur(' + getFilterValue(BLUR_MAX, filterValue) + 'px)',
    'effects__preview--heat': 'filter: brightness(' + getFilterValue(BRIGHTNESS_MAX, filterValue, BRIGHTNESS_MIN) + ')'
  };

  uploadPicturePreview.setAttribute('style', FILTERS_COLLECTION[currentFilter]);
}

function displayHiddenElement(hiddenElement) {
  hiddenElement.classList.remove('hidden');
}

function hideElement(visibleElement) {
  visibleElement.classList.add('hidden');
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
        '  <img class="social__picture" src="img/avatar-' + getRandomInteger(1, 6) + '.svg" \n' +
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
          picturesArray[CURRENT_COMMENTS_INDEX].comments[commentsIndex]);
    }
  }

  // Показывает большую картинку и вставляет данные
  displayHiddenElement(bigPicture);
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
  hideElement(uploadOverlay);
  uploadOverlay.value = '';
  removeEscListener();
}

function closeBigPicture() {
  hideElement(bigPicture);
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
  displayHiddenElement(uploadOverlay);
  addEscListener();
});

uploadFileInput.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    displayHiddenElement(uploadOverlay);
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
populatePicturesArray();
outputPictures();
appendPicturesEventListeners();
appendFiltersEventListeners();

// Временно для удобства работы
displayHiddenElement(uploadOverlay);

// slider.js
(function () {
  var sliderValue = 20;

  var sliderElement = document.querySelector('.scale');
  var sliderPin = sliderElement.querySelector('.scale__pin');
  var sliderLine = sliderElement.querySelector('.scale__line');

  var SLIDER_LINE_LEFT_COORDINATE = sliderLine.getBoundingClientRect().left;
  var SLIDER_LINE_RIGHT_COORDINATE = sliderLine.getBoundingClientRect().right;
  var SLIDER_LINE_WIDTH = SLIDER_LINE_RIGHT_COORDINATE - SLIDER_LINE_LEFT_COORDINATE;

  function onSliderClick(evt) {
    var sliderXPosition = evt.clientX;

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var sliderRelativePosition;

      function checkSliderBoundaries(sliderPosition) {
        var validPosition;
        if (sliderPosition < 0) {
          validPosition = 0;
        } else if (sliderPosition > SLIDER_LINE_WIDTH) {
          validPosition = SLIDER_LINE_WIDTH;
        } else {
          validPosition = sliderPosition;
        }
        return validPosition;
      }

      function calculateSliderPosition() {
        var horizontalShift = sliderXPosition - moveEvt.clientX;
        sliderRelativePosition = checkSliderBoundaries(sliderPin.offsetLeft - horizontalShift);
        sliderXPosition = moveEvt.clientX;
      }

      function renderSliderPin() {
        sliderPin.style.left = sliderRelativePosition + 'px';
      }

      calculateSliderPosition();
      renderSliderPin();
      console.log(sliderRelativePosition);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  sliderPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    onSliderClick(evt);
  });

  /* var sliderValue = Math.round(sliderRelativePosition / scaleWidth * 100) / 100; */

  window.slider = {sliderValue: sliderValue};
})();
