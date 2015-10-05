
function PlayerError(message) {
  this.message = message
  this.type = "PlayerError";
}
PlayerError.prototype = Error.prototype;

/**
 * Ryan Tenney's version at https://prototype.lighthouseapp.com/projects/8886/tickets/721-add-shuffle-method-to-arrays
 */
function shuffleArray(array) {
    var shuffled = [], rand;
    for (var index = 0; index < array.length; ++index) {
      var value = array[index];
      if (index == 0) {
        shuffled[0] = value;
      } else {
        rand = Math.floor(Math.random() * (index + 1));
        shuffled[index] = shuffled[rand];
        shuffled[rand] = value;
      }
    }
    return shuffled;
  }


var GAME_SETTINGS = {
  playerStartArmies: {
    3: 35,
    4: 30,
    5: 25,
    6: 20
  }
};

/**
 * Gamelogic for the risk game
 *
 * @param {Array[String|Player]}  options.players           List of players
 * @param {Array[Country]}        options.countries         List of countries
 * @param {Boolean}               [options.assignCountries] Shall we preassign all countries?
 * @param {Boolean}               [options.randomOrder]     Shall we randomize the order of players?
 */
var RiskGame = function(options) {
  options = $.extend({
    assignCountries: true
  }, options || {});

  var actualPlayer,
      actualPhase    = RiskGame.ASSIGNMENT_PHASE,
      actualStage    = RiskGame.ASSIGNMENT_STAGE,
      players        = [],
      playersHash    = {},
      startArmyCount = GAME_SETTINGS.playerStartArmies[options.players.length],
      countries      = options.countries,
      countryIndex   = {},
      element        = $('<b></b>');
  $.each(options.players, function(i, player) {
    player = player.constructor === String ? new Player(player) : player;
    player.armiesToDistribute = startArmyCount;
    playersHash[player.name] = player;
    players.push(player);
  });

  // randomise order of players
  if (options.randomOrder) {
    players = shuffleArray(players);
  }

  // give countries to players in random order
  if (options.assignCountries) {
    countries = shuffleArray(countries);
    var numPlayers = players.length;
    for (var i = countries.length, p=0; i--; ++p) {
      p = p % numPlayers;
      players[p].addCountry(countries[i]);
      countries[i].setArmy(1, players[p]);
    }
    actualStage = RiskGame.PLAY_STAGE;
  }

  $.each(players, function(i, player) {
  console.log(player);
    player.on('placedArmies', function() {
    console.log(1, player, player.getUnplacedArmies(), RiskGame.ASSIGNMENT_STAGE);
      // trigger canNextPlayer event if player has positioned all his armies for this turn
      if (actualStage === RiskGame.ASSIGNMENT_STAGE) {
      console.log(3);
        fire('canNextPlayer');
      }
    });
  });

  // index all countries for faster access
  $.each(countries, function(i, country) {
    countryIndex[country.id] = country;
  });

  actualPlayer = 0;

  function getPlayer(name) {
    return playersHash[name];
  }
  
  function givePlayerArmiesToPlace(player) {
    player.armies
  }

  function nextPlayer() {
    actualPlayer = ++actualPlayer % players.length;
    actualPhase = RiskGame.ASSIGNMENT_PHASE;
    // logic for assignment stage: if all users finished assigning, fire event
    if (actualStage === RiskGame.ASSIGNMENT_STAGE) {
      var unfinishedPlayers = $.grep(players, function(p) { return !p.getUnplacedArmies(); });
      if (!unfinishedPlayers.length) {
        $(this).trigger("nextStage", { stage: RiskGame.PLAY_STAGE });
      }
    }
  }

  function nextPhase() {
    if (actualPhase == RiskGame.MOVEMENT_PHASE) {
      throw new PlayerError('There is no phase after the movement phase');
    }
    ++actualPhase;
/* Schnappsidee? statt Error?
    if (actualPhase > 2) {
      nextPlayer();
      $(this).trigger("nextPlayer", { player: actualPlayer, phase: actualPhase });
    }*/
  }
  
  function getCountry(name) {
    return countryIndex[name];
  }
  
  function fire(type, params) {
    element.trigger(type, params);
  }

  return {
    on:           function(type, cb) {
      element.bind(type, cb);
    },
    fire:         fire,
    getPlayer:    getPlayer,
    getPlayers:   function() {
      return players;
    },
    actualPlayer: function() {
      return players[actualPlayer];
    },
    nextPlayer:   nextPlayer,
    nextPhase:    nextPhase,
    actualPhase:  function() {
      return actualPhase;
    },
    actualStage:  function() {
      return actualStage;
    },
    getCountry:   getCountry
  };
};
RiskGame.ASSIGNMENT_PHASE = 0;
RiskGame.ATTACK_PHASE = 1;
RiskGame.MOVEMENT_PHASE = 2;
RiskGame.ASSIGNMENT_STAGE = 0;
RiskGame.PLAY_STAGE = 0;
