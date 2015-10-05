module('FrontendController');


test('adding of event listeners', function() {
  $('body').append('<div id="canvas"></div>');
  var canvas = $('#canvas');

  var controller = new FrontendController('canvas', {});
  controller.addEventListener('countryClicked', function(event) {

  });
  canvas.trigger('click');
});
