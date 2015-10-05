

/**
 * Player representation
 */
var Player = Backbone.Model.extend({
  initialize: function(attrs) {
    attrs = attrs || {};
    this.set({ armiesToDistribute: attrs.armies || 0 });
    this.countryHash = {};
    $.each(this.get('countries'), function(i, country) {
      this.countryHash[country.id] = country;
    }.bind(this));
  },
  defaults: {
//    numberCountries: 0,
    countries: []
  },
  
  set: function(attrs, options) {
    if (attrs.countries) {
      if (!_.isArray(attrs.countries)) {
        attrs.countries = [ attrs.countries ];
      }
//      attrs.numberCountries = attrs.countries.length;
    }
    Backbone.Model.prototype.set.call(this, attrs, options);
  },
  
  removeCountry: function(country) {
    var countries = this.get('countries'),
        index = countries.indexOf(country);
    if (index > -1) {
      countries.splice(index, 1);
      this.set({ 'countries': countries });
      delete this.countryHash[country.id];
    } else {
      throw new Error('Country ' + (country.name || country) + ' does not to player ' + name);
    }
  },
  
  addCountry: function(country) {
  console.log("add c", this.get('countries'));
    var c = this.get('countries')
    c.push(country);
    this.set({ countries: c });
    this.countryHash[country.id] = country;
  }
});

var PlayerOld = function(name, options) {
  options = options || {};

  var armies          = options.armies || 0,
      countries       = [],
      countryHash     = {},
      element         = $('<b></b>');

  function numberCountries() {
    return countries.length;
  }

  function addCountry(country) {
    countries.push(country);
    countryHash[country.id] = country;
  }

  function removeCountry(country) {
    var index = countries.indexOf(country);
    if (index > -1) {
      countries.splice(index, 1);
      delete countryHash[country.id];
    } else {
      throw new Error('Country ' + (country.name || country) + ' does not to player ' + name);
    }
  }
  
  function placeArmies(country, number) {
    number = number || 1;
    armies -= number;
    if (country.getOwner() == this) {
      number += country.armies();
    } else {
      this.addCountry(country);
    }
    country.setArmy(number, this);
    this.fire('placedArmies');
  }

  function calculateNewArmies() {
    var numberFromCountries = Math.max(3, Math.floor(countries.length / 3));

    // calculate all Continents
    var numberFromContinents = 0,
        continents = getOwnedContinents();
    for (var i=continents.length; i--;) {
      numberFromCountries += continents[i].points;
    }
    return numberFromCountries;
  }

  function getOwnedContinents() {
    var continents = [],
        ownedContinents = [],
        cont;

    // get all continents
    for (var i=countries.length; i--;) {
      cont = countries[i].getContinent();
      if (cont && $.inArray(cont, continents) === -1) {
        continents.push(cont);
      }
    }

    // check in all continents if we have all its countries
    for (var i=continents.length; i--;) {
      var cons = continents[i].countries(),
          hasAll = true;
      for (var j=cons.length; j--;) {
        if ($.inArray(cons[j], countries) === -1) {
          hasAll = false;
          break;
        }
      }
      if (hasAll) {
        ownedContinents.push(continents[i]);
      }
    }
    return ownedContinents;
  }

  return {
    name:               name,
    armiesToDistribute: armies,
    addCountry:         addCountry,
    removeCountry:      removeCountry,
    numberCountries:    numberCountries,
    placeArmies:        placeArmies,
    on:                 function(type, cb) {
      element.bind(type, cb);
    },
    fire:               function(type, params) {
      element.trigger(type, params);
    },
    countries:          function() {
      return countries;
    },
    getUnplacedArmies:  function() {
      return armies;
    },
    calculateNewArmies: calculateNewArmies
  };
};
