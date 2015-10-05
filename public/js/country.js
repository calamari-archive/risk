

/**
 * Represents a Country
 *
 */
var Country = function(id, options) {
  options = options || {};

  var owner       = null,
      continent   = null,
      armies      = 0,
      connections = options.connections,
      vectors     = options.vectors;

  if (connections) {
    connections = connections.constructor === Array ? connections : [ connections ];
  } else {
    connections = [];
  }

  /**
   * Determinse if this country is connected to given country
   * @param {Country|String} country Country object or id
   * @returns {Boolean}
   */
  function isConnectedTo(country) {
    if (country.constructor === Object) {
      // its an country object
      country = country.id;
    }

    return $.inArray(country, connections) !== -1;
  }
  
  /**
   * Returns the list of connected countries
   */
  function getConnectedCountries() {
    return connections;
  }

  function setArmy(count, user) {
    owner = user;
    armies = count;
  }

  function belongsTo(user) {
    return owner === user;
  }

  function setContinent(cont) {
    continent = cont;
  }

  /**
   * Determinse if we can attack the given country, considering
   * units and connection
   * @param {Country|String} country Country object or id
   * @returns {Boolean}
   */
  function canAttack(country) {
    return armies >= 2 && isConnectedTo(country);
  }

  return {
    id: id,
    getArmies: function() { return armies; },
    isConnectedTo: isConnectedTo,
    getConnectedCountries: getConnectedCountries,
    setArmy: setArmy,
    belongsTo: belongsTo,
    setContinent: setContinent,
    getOwner: function() { return owner; },
    canAttack: canAttack,
    getContinent: function() { return continent; },
    getVectors: function() { return vectors; }
  };
};
