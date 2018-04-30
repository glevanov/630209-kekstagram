'use strict';
(function () {
  var ENTER_KEYCODE = 13;
  var PICTURES_QUANTITY = window.data.picturesArray.length;

  var uploadSection = document.querySelector('.img-upload');
  var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
  var uploadFileInput = uploadSection.querySelector('#upload-file');
  var uploadCancelButton = uploadSection.querySelector('#upload-cancel');

  function outputPictures() {
    var pictureTemplate = document.querySelector('#picture').content;
    var picturesElement = document.querySelector('.pictures');

    for (var k = 0; k < PICTURES_QUANTITY; k++) {
      var pictureElement = pictureTemplate.cloneNode(true);

      pictureElement.querySelector('.picture__img').src = window.data.picturesArray[k].url;
      pictureElement.querySelector('.picture__img').setAttribute('data-index', k);
      pictureElement.querySelector('.picture__stat--likes').textContent = window.data.picturesArray[k].likes;
      pictureElement.querySelector('.picture__stat--comments').textContent = window.data.picturesArray[k].comments.length;

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

  outputPictures();
  appendPicturesEventListeners();
})();
