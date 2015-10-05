module('Country');


test('.isConnectedTo', function() {
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

  ok(!a.isConnectedTo('foo'), 'not existent country have no connections');
  ok(!a.isConnectedTo('b'));
  ok(!a.isConnectedTo(b));
  ok(b.isConnectedTo('c'));
  ok(b.isConnectedTo(c));
  ok(c.isConnectedTo('b'));
  ok(c.isConnectedTo(b));
  ok(c.isConnectedTo('d'));
  ok(c.isConnectedTo(d));
  ok(d.isConnectedTo('c'));
  ok(d.isConnectedTo(c));
});

test('army counts', function() {
  var a = new Country('a');
  var b = new Country('b');
  var c = new Country('c');
  a.setArmy(5, 'Arne');
  c.setArmy(1, 'Claus');

  ok(a.belongsTo('Arne'), 'country should belong to the user with army on it');
  ok(!a.belongsTo('Claus'), 'country should belong to the user with army on it');
  ok(!b.belongsTo('Arne'), 'country without armies belong to nobody');
  ok(!b.belongsTo('Claus'), 'country without armies belong to nobody');
  ok(!c.belongsTo('Arne'), 'country should belong to the user with army on it');
  ok(c.belongsTo('Claus'), 'country should belong to the user with army on it');
});

test('.canAttack', function() {
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
  b.setArmy(2, 'Bob');
  c.setArmy(1, 'Carl');

  equal(b.getArmies(), 2, 'b should have 2 armies');
  equal(c.getArmies(), 1, 'c should have 1 armies');

  ok(!a.canAttack('foo'), 'not existent country have no connections and cant attack anything');
  ok(!a.canAttack('b'), 'should be false due to no owner');
  ok(!a.canAttack(b), 'should be false due to no owner');
  ok(b.canAttack('c'), 'should be true, connection and enough army');
  ok(b.canAttack(c), 'should be true, connection and enough army');
  ok(!b.canAttack('d'), 'should be false due to no connection');
  ok(!b.canAttack(d), 'should be false due to no connection');
  ok(!c.canAttack('d'), 'should be false due to not enough armies');
  ok(!c.canAttack(d), 'should be false due to not enough armies');
  ok(!c.canAttack('b'), 'should be false due to not enough armies');
  ok(!c.canAttack(b), 'should be false due to not enough armies');

  c.setArmy(11, 'Carl');
  ok(c.canAttack('d'), 'should be true, now enough army and connection');
  ok(c.canAttack(d), 'should be true, now enough army and connection');
});

test('.canAttack', function() {
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
  b.setArmy(5, 'Bob');
  c.setArmy(3, 'Carl');

  equal(b.getArmies(), 5, 'b should have 5 armies');
  equal(c.getArmies(), 3, 'b should have 5 armies');
});

test('vectors', function() {
  var a = new Country('a', {
    vectors: [[0,0], [10, 23], [22, 0]]
  });

  equal(a.getVectors().constructor, Array, 'the vectors is a list of points');
  equal(a.getVectors()[0][0], 0, 'the vectors are not changed');
  equal(a.getVectors()[0][1], 0, 'the vectors are not changed');
  equal(a.getVectors()[1][0], 10, 'the vectors are not changed');
  equal(a.getVectors()[1][1], 23, 'the vectors are not changed');
  equal(a.getVectors()[2][0], 22, 'the vectors are not changed');
  equal(a.getVectors()[2][1], 0, 'the vectors are not changed');
});

test('.getConnectedCountries', function() {
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

  equal(a.getConnectedCountries().length, 0, 'should get an empty result');
  equal(b.getConnectedCountries()[0], 'c', 'should get one country');
  equal(c.getConnectedCountries().length, 2, 'should get two countries');
  equal(c.getConnectedCountries()[0], 'd', 'should get country d');
  equal(c.getConnectedCountries()[1], 'b', 'should get country b');
});
