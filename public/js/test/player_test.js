module('Player', {
});


test('.armiesToDistribute', function() {
  var bob = new Player('Bob');
  equal(bob.armiesToDistribute, 0, 'if not set, there should be no army to distribute');

  var charles = new Player('Charles', {
    armies: 42
  });
  equal(charles.armiesToDistribute, 42, 'there should be 42 armies to distribute for charles');
});

test('belonging countries', function() {
  var bob = new Player('Bob');
//  equal(bob.get('numberCountries'), 0, 'If not set, player should have no countries');
  equal(bob.countries.constructor, Array, '.countries should always return an array');
  equal(bob.countries.length, 0, 'If not set, player should have no countries');

  var a = new Country('a', {
        connections: [ 'b', 'c' ]
      }),
      b = new Country('b', {
        connections: 'a'
      }),
      c = new Country('c', {
        connections: 'a'
      });

  bob.addCountry(a);
//  equal(bob.get('numberCountries'), 1, 'player should have one country now');
  equal(bob.countries.constructor, Array, '.countries should always return an array');
  equal(bob.countries.length, 1, 'player should have one country now');
  console.log(bob.countries);
  equal(bob.countries[0], a, 'player should have country a');

  bob.addCountry(b);
//  equal(bob.get('numberCountries'), 2, 'player should have two countries now');
  equal(bob.countries.length, 2, 'player should have two country now');
  equal(bob.countries[0], a, 'player should have country a, b');
  equal(bob.countries[1], b, 'player should have country a, b');

  bob.removeCountry(a);
//  equal(bob.get('numberCountries'), 1, 'player should again have only one country');
  equal(bob.countries.length, 1, 'player should have one country now');
  equal(bob.countries[0], b, 'player should have country b only');

  raises(function() {
      bob.removeCountry(a);
  }, 'If country does not belong to player, then it should throw up');
});

/**
 *x The logic to test is as follows:
 * - A player gets at least 3 armies
 * - A player gets number of the pre-decimal position of (number countries / 3)
 * - A player gets armies as much as the points of all continents he complete owns
 */
test('getting Army logic', function() {
  var a = new Country('a', {
        connections: [ 'b', 'c', 'd', 'e', 'f' ]
      }),
      b = new Country('b', {
        connections: 'a'
      }),
      c = new Country('c', {
        connections: 'a'
      }),
      d = new Country('d', {
        connections: 'a'
      }),
      e = new Country('e', {
        connections: 'a'
      }),
      f = new Country('f', {
        connections: 'a'
      }),
      c1 = new Continent({
        countries: [a, b],
        points: 5
      }),
      c2 = new Continent({
        countries: [c, d, e],
        points: 10
      }),
      c3 = new Continent({
        countries: [f],
        points: 2
      }),
      p1 = new Player('Black'),
      p2 = new Player('Brown');

  equal(p1.unplacedArmies, 0, 'Initially player should not have unplaced armies');
  equal(p1.calculateNewArmies(), 3, 'player without countries should get 3 armies');
  equal(p1.unplacedArmies, 0, 'calculateNewArmies should not add armies.');

  for (var i=1; i<=8; ++i) {
    p1.addCountry(new Country('a' + i));
  }
  equal(p1.calculateNewArmies(), 3, 'player with 8 countries should get 3 armies');

  for (var i=9; i<=11; ++i) {
    p1.addCountry(new Country('a' + i));
  }
  equal(p1.calculateNewArmies(), 3, 'player with 11 countries should get 3 armies');

  p1.addCountry(new Country('a12'));
  equal(p1.calculateNewArmies(), 4, 'player with 12 countries should get 4 armies');

  for (var i=13; i<=21; ++i) {
    p1.addCountry(new Country('a' + i));
  }
  equal(p1.calculateNewArmies(), 7, 'player with 21 countries should get 7 armies');

  p2.addCountry(a);
  p2.addCountry(b);
  equal(p2.calculateNewArmies(), 8, 'player with 2 countries and a continent should get 3 + continent value armies');
  p2.addCountry(c);
  equal(p2.calculateNewArmies(), 8, 'player with 3 countries and one full continent should get 3 + continent value armies');
  p2.addCountry(d);
  p2.addCountry(e);
  equal(p2.calculateNewArmies(), 18, 'player with 5 countries and two full continent should get 3 + continent values armies');

});

test('placing armies', function() {
  var a = new Country('a', {
        connections: [ 'b', 'c' ]
      }),
      b = new Country('b', {
        connections: 'a'
      }),
      c = new Country('c', {
        connections: 'a'
      }),
      p1 = new Player('Black', { armies: 2 }),
      p2 = new Player('Brown', { armies: 5 });
  equal(p1.unplacedArmies, 2, "player 1 should have 2 armies to place");
  p1.placeArmies(a);
  equal(p1.unplacedArmies, 1, "player 1 should have 1 army left to place now");
  equal(p1.countries.length, 1, "player 1 should have 1 country now");
  equal(p1.countries[0], a, "player 1 should have country 'a'");

  equal(p2.unplacedArmies, 5, "player 2 should have 5 armies to place");
  p2.placeArmies(c, 5);
  equal(p2.unplacedArmies, 0, "player 2 should have no army left to place");
  equal(p2.countries.length, 1, "player 2 should have 1 country now");
  equal(p2.countries[0], c, "player 2 should have country 'c'");
});
