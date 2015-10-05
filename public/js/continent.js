

/**
 * A group of countries
 */
var Continent = function(options) {
  options = options || {};

  var countries = options.countries || [];

  var self = {
    add: function(country) {
      countries.push(country);
      country.setContinent(this);
    },
    countries: function() {
      return countries;
    },
    numberCountries: function() {
      return countries.length;
    },
    points: options.points || 0
  };

  // assign countries their continent
  if (countries) {
    for (var i=countries.length; i--;) {
      countries[i].setContinent(self);
    }
  }

  return self;
}
