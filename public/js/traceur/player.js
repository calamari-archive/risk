class Player {
  mixin EventEmitterTrait;
  
  new(name, options) {
    this.name = name;
    this.options = options || {};
    this._armies = this.options.armies || 0;
    this.countries = this.options.countries || [];
    $.each(this.countries, function(i, country) {
      this._countryHash[country.id] = country;
    }.bind(this));
  }

  var _countryHash = {},
      _armiesToDistribute = 0;

  function addCountry(country) {
    this.countries.push(country);
    this._countryHash[country.id] = country;
  }

  function removeCountry(country) {
    var index = this.countries.indexOf(country);
    if (index > -1) {
      this.countries.splice(index, 1);
      delete this.countryHash[country.id];
    } else {
      throw new Error('Country ' + (country.name || country) + ' does not to player ' + this.name);
    }
  }

  function calculateNewArmies() {
    var numberFromCountries = Math.max(3, Math.floor(this.countries.length / 3));

    // calculate all Continents
    var numberFromContinents = 0,
        continents = this.getOwnedContinents();
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
    for (var i=this.countries.length; i--;) {
      cont = this.countries[i].getContinent();
      if (cont && $.inArray(cont, continents) === -1) {
        continents.push(cont);
      }
    }

    // check in all continents if we have all its countries
    for (var i=continents.length; i--;) {
      var cons = continents[i].countries(),
          hasAll = true;
      for (var j=cons.length; j--;) {
        if ($.inArray(cons[j], this.countries) === -1) {
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
  
  function placeArmies(country, number) {
    number = number || 1;
    this._armies -= number;
    if (country.getOwner() == this) {
      number += country.armies();
    } else {
      this.addCountry(country);
    }
    country.setArmy(number, this);
    this.fire('placedArmies');
  }
  
  function fire() {}

  
  get countryHash() { return this._countryHash; }
  
  set armiesToDistribute(armies) { return this._armies = armies; }
  get armiesToDistribute() { return this._armies; }

  get unplacedArmies() { return this._armies; }
}