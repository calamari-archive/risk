/**
 * Some more methods, to call on the country
 */
var CountryRepresentation = {
  highlight: function() {
    this.scale(1.2, 1.2);
  },
  removeHighlight: function() {
    this.scale(1, 1);
  },
  select: function(color) {
    this.attr({ fill: color || 'yellow' });
  },
  deselect: function() {
    this.attr({ fill: 'white' });
  }
};

/**
 * Draws the map and provides abstraction of all user interactions
 *
 * @param {String|jQuery} canvas Id or jQuery element of div container to draw in
 * @param {Object} options some options
 */
var FrontendController = function(canvas, options) {
  options = options || {};
  canvas = $(typeof canvas === 'object' ? canvas : '#' + canvas);
  var win = $(window),
      countries,
      paper, w, h,
      listeners = {};

  if (options.fullsize) {
    w = win.width();
    h = win.height();

    canvas.css({
      width: w + 'px',
      height: h + 'px'
    });
  } else {
    w = canvas.width();
    h = canvas.height();
  }

  var paper = Raphael(canvas[0], w, h);

  if (options.countries) {
    countries = options.countries;
    for (var i=countries.length; i--;) {
      countries[i].element = drawCountry(countries[i]);
    }
  }

  /**
   * Draws a country and returns the RaphaelElement
   * @param   {Country} country
   * @returns {RaphaelElement}
   */
  function drawCountry(country) {
    var drawPath,
        vectors = country.getVectors(),
        node;
    drawPath = 'M' + vectors[0].join(' ');
    for (var i=1,l=vectors.length; i<l; ++i) {
      drawPath += 'L' + vectors[i].join(' ');
    }

    var obj = paper.path(drawPath).attr({
      fill: '#fff',
      stroke: '#000'
    });

    // enhance countries with additional methods
    $.each(CountryRepresentation, function(key, method) {
      obj[key] = method;
    });

    function triggerListener(type) {
      if (listeners[type]) {
        for (var i=0, l=listeners[type].length; i<l; ++i) {
          listeners[type][i]({ target: obj, country: country });
        }
      }
    }

    obj.click(function() {
      triggerListener('countryClick');
    }).hover(function() {
      triggerListener('countryMouseOver');
    }, function() {
      triggerListener('countryMouseOut');
    });
    return obj
  }

  function addEventListener(event, callback) {
    if (!listeners[event]) {
      listeners[event] = [];
    }

    listeners[event].push(callback);
  }

  return {
    element: canvas,
    addEventListener: addEventListener
  };
};
