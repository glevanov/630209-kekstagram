'use strict';
(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancelButton = bigPicture.querySelector('.big-picture__cancel');

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

  function closeBigPicture() {
    window.util.hideElement(bigPicture);
    window.util.removeEscListener();
  }

  bigPictureCancelButton.addEventListener('click', function () {
    closeBigPicture();
  });

  window.bigPicture = {
    outputBigPicture: outputBigPicture(),
    closeBigPicture: closeBigPicture()
  };
})();

