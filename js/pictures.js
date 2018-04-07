'use strict';
// Здесь генерируем тестовые данные для случайных пользовательских картинок
var picturesArray = [];
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

// Наполняем массив тестовых данных
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

populatePicturesArray();

// Отрисовываем случайные картинки с использованием тестовых данных
function outputPictures() {

  var pictureTemplate = document.querySelector('#picture').content;
  var picturesElement = document.querySelector('.pictures');

  for (var k = 0; k < PICTURES_QUANTITY; k++) {
    var pictureElement = pictureTemplate.cloneNode(true);

    // Вставляем в контент в шаблон
    pictureElement.querySelector('.picture__img').src = picturesArray[k].url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picturesArray[k].likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picturesArray[k].comments.length;

    picturesElement.appendChild(pictureElement);
  }
}

outputPictures();

// Показывает большую картинку и заполняет её данными
var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');
bigPicture.querySelector('.big-picture__img img').src = picturesArray[0].url;
bigPicture.querySelector('.likes-count').textContent = picturesArray[0].likes;

// Генерирует от одного до двух случайных комментария для большой картинки
function getBigPictureComments() {
  var comments = '';
  var comment = '';

  for (var l = 0; l < getRandomInteger(1, 2); l++) {
    comment = '<li class="social__comment social__comment--text">\n' +
      '  <img class="social__picture" src="img/avatar-' + getRandomInteger(1, 6) + '.svg" \n' +
      '    alt="Аватар комментатора фотографии" \n' +
      '    width="35" height="35">' + getComment() + '\n' +
      '</li>';
    comments += comment;
  }

  return comments;
}

bigPicture.querySelector('.social__comments').innerHTML = getBigPictureComments();
bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
