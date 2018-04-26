'use strict';
(function () {
  var SLIDER_DEFAULT_VALUE = 20;
  window.slider = {sliderValue: SLIDER_DEFAULT_VALUE};

  var sliderElement = document.querySelector('.scale');
  var sliderPin = sliderElement.querySelector('.scale__pin');
  var sliderLine = sliderElement.querySelector('.scale__line');
  var sliderLevel = sliderElement.querySelector('.scale__level');


  function onSliderClick(evt) {
    var sliderXPosition = evt.clientX;

    var SLIDER_LINE_LEFT_COORDINATE = sliderLine.getBoundingClientRect().left;
    var SLIDER_LINE_RIGHT_COORDINATE = sliderLine.getBoundingClientRect().right;
    var SLIDER_LINE_WIDTH = SLIDER_LINE_RIGHT_COORDINATE - SLIDER_LINE_LEFT_COORDINATE;

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

      function renderSliderPosition() {
        sliderPin.style.left = sliderRelativePosition + 'px';
        sliderLevel.style.width = window.slider.sliderValue + '%';
      }

      function updateSliderValue() {
        window.slider.sliderValue = Math.round(sliderRelativePosition / SLIDER_LINE_WIDTH * 100);
      }

      calculateSliderPosition();
      renderSliderPosition();
      updateSliderValue();
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
})();
