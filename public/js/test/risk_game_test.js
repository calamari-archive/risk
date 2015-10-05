module('RiskGame', {
  setup: function() {
    this.countryA = new Country('a', {
      connections: 'b'
    });
    this.countryB = new Country('b', {
      connections: ['a', 'c']
    });
    this.countryC = new Country('c', {
      connections: ['d', 'b']
    });
    this.countryD = new Country('d', {
      connections: 'c'
    });
    this.countries = [this.countryA, this.countryB, this.countryC, this.countryD];
    
    this._origSettings = GAME_SETTINGS;
  },
  tearDown: function() {
    GAME_SETTINGS = this._origSettings;
  }
});


test('some getters', function() {
  var game = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: this.countries
  });
  equal(game.getPlayer('Amiga').name, 'Amiga', 'getPlayer should get the right Player object');
  equal(game.getPlayer('Bob').name, 'Bob', 'getPlayer should get the right Player object');
  equal(game.getPlayer('Bobby'), null, 'getPlayer of none existent player should return null');
});


test('initial game settings', function() {
  var game = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: this.countries
  });

  equal(game.getPlayer('Amiga').armiesToDistribute, 35);
  equal(game.getPlayer('Bob').armiesToDistribute, 35);
  equal(game.getPlayer('Charles').armiesToDistribute, 35);

  var game2 = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles', 'Dieter'],
    countries: this.countries
  });

  equal(game2.getPlayer('Amiga').armiesToDistribute, 30);
  equal(game2.getPlayer('Bob').armiesToDistribute, 30);
  equal(game2.getPlayer('Dieter').armiesToDistribute, 30);

  var game3 = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles', 'Dieter', 'Eric'],
    countries: this.countries
  });

  equal(game3.getPlayer('Amiga').armiesToDistribute, 25);
  equal(game3.getPlayer('Dieter').armiesToDistribute, 25);
  equal(game3.getPlayer('Eric').armiesToDistribute, 25);

  var game4 = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles', 'Dieter', 'Eric', 'Fred'],
    countries: this.countries
  });

  equal(game4.getPlayer('Amiga').armiesToDistribute, 20);
  equal(game4.getPlayer('Bob').armiesToDistribute, 20);
  equal(game4.getPlayer('Fred').armiesToDistribute, 20);
});

test('player turn controls', function() {
  var game = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: this.countries
  });
  equal(game.actualPlayer().name, 'Amiga', 'the actual Player should be the first one');
  game.nextPlayer();
  equal(game.actualPlayer().name, 'Bob', 'the second Player should be Bob');
  game.nextPlayer();
  equal(game.actualPlayer().name, 'Charles', 'the third Player should be Charles');
  game.nextPlayer();
  equal(game.actualPlayer().name, 'Amiga', 'the fourth Player should be the first one again');

  // test with randomised player order
  game = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: this.countries,
    randomOrder: true
  });
  var playedNames = {};
  ok(!playedNames[game.actualPlayer().name], 'the actual player should not have player');
  playedNames[game.actualPlayer().name] = true;
  game.nextPlayer();
  ok(!playedNames[game.actualPlayer().name], 'the actual player should not have player');
  playedNames[game.actualPlayer().name] = true;
  game.nextPlayer();
  ok(!playedNames[game.actualPlayer().name], 'the actual player should not have player');
  playedNames[game.actualPlayer().name] = true;
  game.nextPlayer();
  ok(playedNames[game.actualPlayer().name], 'the fourth actual player should have player already');
});

test('player phases', function() {
  var game = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: this.countries
  });
  equal(game.actualPlayer().name, 'Amiga', 'the actual Player should be the first one');
  equal(game.actualPhase(), RiskGame.ASSIGNMENT_PHASE, 'the first phase is always the assignment phase');
  game.nextPhase();
  equal(game.actualPlayer().name, 'Amiga', 'the actual Player should not have changed');
  equal(game.actualPhase(), RiskGame.ATTACK_PHASE, 'the second phase is always the attack phase');
  game.nextPhase();
  equal(game.actualPlayer().name, 'Amiga', 'the actual Player should not have changed');
  equal(game.actualPhase(), RiskGame.MOVEMENT_PHASE, 'the third and last phase is the movement phase');

  raises(function() {
    game.nextPhase();
  }, 'there is no fourth phase, so an error should be thrown');
  game.nextPlayer();
  equal(game.actualPlayer().name, 'Bob', 'the second Player should be Bob');
  equal(game.actualPhase(), RiskGame.ASSIGNMENT_PHASE, 'the first phase is always the assignment phase');
});

test('game stages', function() {
  expect(4);
  GAME_SETTINGS.playerStartArmies[3] = 1;
  var game = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: this.countries,
    assignCountries: true
  });
  equal(game.actualStage(), RiskGame.PLAY_STAGE, "if countries are assigned automatically, we should go directly to playing stage");
  game2 = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: this.countries,
    assignCountries: false
  });
  game2.foo = 32;
  equal(game2.actualStage(), RiskGame.ASSIGNMENT_STAGE, "if countries are not assigned automatically, we should go to country assignment stage");
  $(game2).bind("nextStage", function(event, data) {
    equal(data.stage, RiskGame.PLAY_STAGE, "we should enter the playing stage after every player has placed his armies.");
    equal(game2.actualPlayer().name, 'Amiga', "the first player should be on then");
  })
  game2.actualPlayer().placeArmies(this.countryA);
  game2.nextPlayer();
  game2.actualPlayer().placeArmies(this.countryB);
  game2.nextPlayer();
  game2.actualPlayer().placeArmies(this.countryC);
  game2.nextPlayer();
});

test('randomly assigned countries', function() {
  var a = new Country('a', {
        connections: [ 'b', 'c', 'd', 'e', 'f' ]
      }),
      b = new Country('b', {
        connections: 'a'
      }),
      c = new Country('c', {
        connections: 'a'
      }),
      d = new Country('c', {
        connections: 'a'
      }),
      e = new Country('c', {
        connections: 'a'
      }),
      f = new Country('c', {
        connections: 'a'
      });
  var game = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: [a, b, c, d, e, f]
  });

  equal(game.getPlayer('Amiga').numberCountries(), 2, 'Every player should have two countries');
  equal(game.getPlayer('Bob').numberCountries(), 2, 'Every player should have two countries');
  equal(game.getPlayer('Charles').numberCountries(), 2, 'Every player should have two countries');

  equal(a.getArmies(), 1 ,'Every country should have one army placed');
  equal(b.getArmies(), 1 ,'Every country should have one army placed');
  equal(c.getArmies(), 1 ,'Every country should have one army placed');
  equal(d.getArmies(), 1 ,'Every country should have one army placed');
  equal(e.getArmies(), 1 ,'Every country should have one army placed');
  equal(f.getArmies(), 1 ,'Every country should have one army placed');

  ok(a.getOwner() ,'Every country should have an owner');
  ok(b.getOwner() ,'Every country should have an owner');
  ok(c.getOwner() ,'Every country should have an owner');
  ok(d.getOwner() ,'Every country should have an owner');
  ok(e.getOwner() ,'Every country should have an owner');
  ok(f.getOwner() ,'Every country should have an owner');
});

test('.getCountry', function() {
  var game = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: this.countries
  });
  equal(game.getCountry('a'), this.countryA, "valid id should get the right country");
  equal(game.getCountry('z'), null, "invalid id should get nothing");
});

test('if player is allowed to get to the next player', function() {
  expect(3);
  GAME_SETTINGS.playerStartArmies[3] = 1;
  var game = new RiskGame({
    players: ['Amiga', 'Bob', 'Charles'],
    countries: this.countries,
    assignCountries: false
  });
  var count = 0;

  game.on("canNextPlayer", function(event) {
    ++count;
  });
  game.actualPlayer().placeArmies(this.countryA);
  equal(count, 1, "the event should have been fired one time by now");
  game.nextPlayer();
  game.actualPlayer().placeArmies(this.countryB);
  equal(count, 2, "the event should have been fired twice by now");
  game.nextPlayer();
  game.actualPlayer().placeArmies(this.countryC);
  equal(count, 3, "the event should have been fired three times by now");
  game.nextPlayer();
});