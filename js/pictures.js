'use strict';

// #01# Переменные
var picturesArray = [];

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
// var uploadPicturePreview = uploadSection.querySelector('.img-upload__preview img');
var slider = document.querySelector('.scale');
var sliderPin = slider.querySelector('.scale__pin');
var sliderLine = slider.querySelector('.scale__line');

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

function onPictureClick(evt) {
  outputBigPicture(evt);
  addEscListener();
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

function getSliderValue(evt) {
  var sliderXPosition = evt.clientX;
  var scaleXLeftPosition = sliderLine.getBoundingClientRect().left;
  var scaleXRightPosition = sliderLine.getBoundingClientRect().right;
  var scaleWidth = scaleXRightPosition - scaleXLeftPosition;
  var sliderRelativePosition = sliderXPosition - scaleXLeftPosition;
  var sliderValue = Math.round(sliderRelativePosition / scaleWidth * 100) / 100;
  return sliderValue;
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

// Временно - выводит в консоль значение слайдера насыщенности эффекта
sliderPin.addEventListener('mouseup', function (evt) {
  console.log(getSliderValue(evt));
});

// #06# Вызовы функций
populatePicturesArray();
outputPictures();
appendPicturesEventListeners();
