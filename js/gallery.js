'use strict';
(function () {
  var REQUEST_URL = 'https://js.dump.academy/kekstagram/data';

  function onSuccess(data) {
    var picturesArray = data;

    picturesArray = insertTrueDescription(picturesArray);
    outputPictures(picturesArray);
    appendPicturesEventListeners(picturesArray);

    window.gallery = {
      picturesArray: picturesArray
    };
  }

  function onError(message) {
    return message;
  }

  function insertTrueDescription(picturesArray) {
    for (var i = 0; i < picturesArray.length; i++) {
      // Выдергивает первый комментарий и записывает его в описание
      picturesArray[i].description = picturesArray[i].comments.shift();
    }
    return picturesArray;
  }

  window.backend.getData(REQUEST_URL, onSuccess, onError);

  var ENTER_KEYCODE = 13;


  var uploadSection = document.querySelector('.img-upload');
  var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
  var uploadFileInput = uploadSection.querySelector('#upload-file');
  var uploadCancelButton = uploadSection.querySelector('#upload-cancel');

  function outputPictures(picturesArray) {
    var PICTURES_QUANTITY = picturesArray.length;

    var pictureTemplate = document.querySelector('#picture').content;
    var picturesElement = document.querySelector('.pictures');

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

})();
