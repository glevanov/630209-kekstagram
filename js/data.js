'use strict';
(function () {
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

  function getDescription() {
    return PICTURES_DESCRIPTION[window.util.getRandomInteger(0, PICTURES_DESCRIPTION.length - 1)];
  }

  function getComment() {
    return PICTURES_COMMENTS[window.util.getRandomInteger(0, PICTURES_COMMENTS.length - 1)];
  }

  function getCommentsArray() {
    var commentsArray = [];
    var commentsIndex = window.util.getRandomInteger(1, 2);

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
        likes: window.util.getRandomInteger(PICTURES_LIKES_MIN, PICTURES_LIKES_MAX),
        comments: getCommentsArray(),
        description: getDescription()
      };

      picturesArray.push(picElement);
    }
  }

  populatePicturesArray();

  window.data = {
    picturesArray: picturesArray,
    PICTURES_QUANTITY: PICTURES_QUANTITY
  };
})();
