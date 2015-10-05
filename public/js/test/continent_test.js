module('Continent');


test('countries adding', function() {
  var a = new Country('a');
  var b = new Country('b', {
    connections: 'c'
  });
  var c = new Country('c', {
    connections: ['d', 'b']
  });
  var d = new Country('d', {
    connections: 'c'
  });

  var conti = new Continent();
  equal(conti.countries().constructor, Array, 'countries() should always return an array');
  equal(conti.countries().length, 0, 'countries() should be empty initially');


  conti.add(a);
  equal(conti.countries().constructor, Array, 'countries() should always return an array');
  equal(conti.countries()[0], a, 'a should be in Continent');
  equal(conti.numberCountries(), 1, 'Continent should have one country');

  conti.add(b);
  equal(conti.countries()[0], a, 'a should be in Continent');
  equal(conti.countries()[1], b, 'b should be in Continent');
  equal(conti.numberCountries(), 2, 'Continent should have two countries');

  conti = new Continent({
    countries: [c, d]
  });
  equal(conti.countries()[0], c, 'c should be in second Continent');
  equal(conti.countries()[1], d, 'd should be in second Continent');
  equal(conti.numberCountries(), 2, 'second continent should have two countries');
});

test('countries adding', function() {
  var a = new Country('a');
  var b = new Country('b', {
    connections: 'c'
  });
  var c = new Country('c', {
    connections: ['d', 'b']
  });
  var d = new Country('d', {
    connections: 'c'
  });

  var conti = new Continent();

  ok(!a.getContinent(), 'a should not have a continent right now');
  ok(!b.getContinent(), 'b should not have a continent right now');

  conti.add(a);
  equal(a.getContinent(), conti, 'a should belong to conti');
  ok(!b.getContinent(), 'b should not have a continent right now');

  conti.add(b);
  equal(a.getContinent(), conti, 'a should belong to conti');
  equal(b.getContinent(), conti, 'b should belong to conti');

  var conti2 = new Continent({
    countries: [a, b]
  });
  equal(a.getContinent(), conti2, 'a should belong to conti2 now');
  equal(b.getContinent(), conti2, 'b should belong to conti2 now');
});

test('points', function() {
  var a = new Country('a');
  var b = new Country('b', {
    connections: 'c'
  });
  var c = new Country('c', {
    connections: ['d', 'b']
  });
  var d = new Country('d', {
    connections: 'c'
  });

  var conti = new Continent({
    countries: [a, b],
    points:    3
  });
  var conti2 = new Continent({
    countries: [c, d],
    points:    2
  });
  equal(conti.points, 3, 'first continent should have a value of three');
  equal(conti2.points, 2, 'second continent should have a value of two');
});

test('owned countries', function() {
  var a = new Country('a');
  var b = new Country('b', {
    connections: 'c'
  });
  var c = new Country('c', {
    connections: ['d', 'b']
  });
  var d = new Country('d', {
    connections: 'c'
  });

  var conti = new Continent({
    countries: [a, b],
    points:    3
  });
  var conti2 = new Continent({
    countries: [c, d],
    points:    2
  });
  var player = new Player('Bob');

  equal(conti.points, 3, 'first continent should have a value of three');
  equal(conti2.points, 2, 'second continent should have a value of two');
});
