'use strict';
(function () {
  var picturesArrayAsReceived;

  var ENTER_KEYCODE = 13;

  var uploadSection = document.querySelector('.img-upload');
  var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
  var uploadFileInput = uploadSection.querySelector('#upload-file');
  var uploadCancelButton = uploadSection.querySelector('#upload-cancel');
  var filtersSection = document.querySelector('.img-filters');
  var filtersButtons = filtersSection.querySelectorAll('.img-filters__button');

  function getPicturesArray() {
    var REQUEST_URL = 'https://js.dump.academy/kekstagram/data';

    function onSuccess(data) {
      var picturesArray = data;
      picturesArray = setFirstCommentAsDescription(picturesArray);
      picturesArrayAsReceived = picturesArray.slice();

      window.gallery = {
        picturesArray: picturesArray
      };

      renderPictures();
      filtersSection.classList.remove('img-filters--inactive');
    }

    function onError(message) {
      return message;
    }

    function setFirstCommentAsDescription(picturesArray) {
      for (var i = 0; i < picturesArray.length; i++) {
        // Выдергивает первый комментарий и записывает его в описание
        picturesArray[i].description = picturesArray[i].comments.shift();
      }
      return picturesArray;
    }

    window.backend.getData(REQUEST_URL, onSuccess, onError);
  }

  function drawPictures(picturesArray) {
    var PICTURES_QUANTITY = picturesArray.length;

    var pictureTemplate = document.querySelector('#picture').content;
    var picturesElement = document.querySelector('.pictures');

    // Если изображения уже есть, удалим их
    if (picturesElement.querySelector('.picture__link') !== null) {
      var pictures = picturesElement.querySelectorAll('.picture__link');
      pictures.forEach(function (it) {
        picturesElement.removeChild(it);
      });
    }

    for (var k = 0; k < PICTURES_QUANTITY; k++) {
      var pictureElement = pictureTemplate.cloneNode(true);

      pictureElement.querySelector('.picture__img').src = picturesArray[k].url;
      pictureElement.querySelector('.picture__img').setAttribute('data-index', k);
      pictureElement.querySelector('.picture__stat--likes').textContent = picturesArray[k].likes;
      pictureElement.querySelector('.picture__stat--comments').textContent = picturesArray[k].comments.length;

      picturesElement.appendChild(pictureElement);
    }
  }

  function appendPicturesEventListeners(picturesArray) {
    var PICTURES_QUANTITY = picturesArray.length;

    var pictures = document.querySelectorAll('.picture__link');
    for (var i = 0; i < PICTURES_QUANTITY; i++) {
      pictures[i].addEventListener('click', onPictureClick);
    }
  }

  function onPictureClick(evt) {
    window.bigPicture.outputBigPicture(evt);
    window.util.addEscListener();
  }

  function renderPictures() {
    drawPictures(window.gallery.picturesArray);
    appendPicturesEventListeners(window.gallery.picturesArray);
  }

  function onFilterClick(evt) {
    var FILTERS_DICTIONARY = {
      'filter-popular': 'byLikes',
      'filter-new': 'byComments',
      'filter-discussed': 'asRecieved',
      'filter-random': 'atRandom'
    };

    var sortPictures = {
      byLikes: function () {
        window.gallery.picturesArray.sort(function (a, b) {
          return b.likes - a.likes;
        });
      },
      byComments: function () {
        window.gallery.picturesArray.sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
      },
      atRandom: function () {
        window.gallery.picturesArray.sort(function () {
          return Math.random() - 0.5;
        });
      },
      asRecieved: function () {
        window.gallery.picturesArray = picturesArrayAsReceived.slice();
      }
    };

    function toggleActiveButton() {
      var activeButton = filtersSection.querySelector('.img-filters__button--active');
      activeButton.classList.remove('img-filters__button--active');
      evt.target.classList.add('img-filters__button--active');
    }

    function applySorting() {
      // Хватает id текущего элемента и мэтчит соответствующую сортировку
      sortPictures[FILTERS_DICTIONARY[evt.target.id]]();
      renderPictures();
    }

    toggleActiveButton();
    applySorting();
  }

  getPicturesArray();

  uploadFileInput.addEventListener('change', function () {
    window.util.displayHiddenElement(uploadOverlay);
    window.util.addEscListener();
  });
  uploadFileInput.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      window.util.displayHiddenElement(uploadOverlay);
    }
  });
  uploadCancelButton.addEventListener('click', function () {
    window.util.closeUpload();
  });

  filtersButtons.forEach(function (it) {
    it.addEventListener('click', window.util.debounce(onFilterClick));
  });
})();
