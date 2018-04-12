'use strict';

// #01# Переменные
var picturesArray = [];

// #02# Константы
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
    pictureElement.querySelector('.picture__stat--likes').textContent = picturesArray[k].likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picturesArray[k].comments.length;

    picturesElement.appendChild(pictureElement);
  }
}

function displayHiddenElement(hiddenElement) {
  hiddenElement.classList.remove('hidden');
}

function hideElement(visibleElement) {
  visibleElement.classList.add('hidden');
}

// Показывает большую картинку и заполняет её данными
function outputBigPicture() {
  var commentsIndex;

  var COMMENTS_QUANTITY = getRandomInteger(1, 2);

  var bigPicture = document.querySelector('.big-picture');
  var commentsSection = bigPicture.querySelector('.social__comments');

  // Генерирует от одного до двух случайных комментария для большой картинки
  // ...сначала разметку
  function getBigPictureCommentsMarkup() {
    var markup = '';
    var markupElement = '';

    for (commentsIndex = 0; commentsIndex < COMMENTS_QUANTITY; commentsIndex++) {
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
    for (commentsIndex = 0; commentsIndex < COMMENTS_QUANTITY; commentsIndex++) {
      commentsSection.childNodes.item(commentsIndex).insertAdjacentText('beforeend', getComment());
    }
  }

  // Показывает большую картинку и вставляет данные
  // displayHiddenElement(bigPicture);
  bigPicture.querySelector('.big-picture__img img').src = picturesArray[0].url;
  bigPicture.querySelector('.likes-count').textContent = picturesArray[0].likes;
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
  // Обнуляет блок комментариев и вставляет случайные комментарии
  commentsSection.textContent = '';
  commentsSection.insertAdjacentHTML('beforeend', getBigPictureCommentsMarkup());

  getBigPictureCommentsContent();
}

populatePicturesArray();
outputPictures();
outputBigPicture();

// Блок про загрузку фото
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var uploadSection = document.querySelector('.img-upload');
var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
var uploadFileInput = uploadSection.querySelector('#upload-file');
var uploadCancelButton = uploadSection.querySelector('#upload-cancel');

function closeUpload() {
  hideElement(uploadOverlay);
  uploadOverlay.value = '';
  document.removeEventListener('keydown', onEscPress);
}

function onEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUpload();
  }
}

uploadFileInput.addEventListener('change', function () {
  displayHiddenElement(uploadOverlay);
  document.addEventListener('keydown', onEscPress);
});

uploadFileInput.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    displayHiddenElement(uploadOverlay);
  }
});

uploadCancelButton.addEventListener('click', function () {
  closeUpload();
});
