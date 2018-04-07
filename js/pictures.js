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
  for (var i = 0; i < PICTURES_QUANTITY; i++) {
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
var pictureTemplate = document.querySelector('#picture').content;
var picturesElement = document.querySelector('.pictures');

for (var k = 0; k < PICTURES_QUANTITY; k++) {
  var pictureElement = pictureTemplate.cloneNode(true);

  picturesElement.appendChild(pictureElement);
}
