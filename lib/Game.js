const HashMap = require('hashmap');
const Player = require('./Player');

function Game() {
  this.clients = new HashMap();
  this.spectators = new HashMap();
  this.players = new HashMap();
  this.cards = new HashMap();
  this.target = '';
}

Game.create = function () {
  return new Game();
};

Game.prototype.getPlayers = function () {
  return this.players.values();
};

Game.prototype.addNewPlayer = function (socket) {
  var nPlayers = this.players.values().length;
  if (nPlayers < 4) {
    this.clients.set(socket.id, socket);
    this.players.set(socket.id, Player.create(socket.id));
  }
  else {
    this.spectators.set(socket.id, socket);
    socket.emit('game-full');
  }

  nPlayers = this.players.values().length;
  if (nPlayers == 4) {
    this.gameStart();
  }
};

Game.prototype.removePlayer = function (id) {
  this.clients.remove(id);
  this.players.remove(id);
  this.cards.remove(id);
  var nPlayers = this.players.values().length;
  if (nPlayers < 4 && nPlayers > 0) {
    this.gameInterrupt();
  }
}

Game.prototype.changeName = function (socket, name) {
  if (this.players.get(socket)) {
    this.players.get(socket).name = name;
    console.log(`game.js: ${this.players.get(socket).name}`);
  }
  else
    console.log('game.js: game full');
}

Game.prototype.gameStart = function () {
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    this.clients.get(ids[i]).emit('game-start');
  }
}

Game.prototype.gameInterrupt = function () {
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    this.clients.get(ids[i]).emit('game-interrupt');
  }
}

Game.prototype.sendHiddenState = function () {
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    var card = this.cards.get(ids[i]);
    if (card == 'babu' || card == 'pulish')
      this.hideRestrictedCards();
    else if (card == 'dakat' || card == 'chor')
      this.showRestrictedCards();
    this.clients.get(ids[i]).emit('update', {
      self: this.players.get(ids[i]),
      all: this.players.values()
    });
  }
};

Game.prototype.sendState = function () {
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    this.clients.get(ids[i]).emit('update', {
      self: this.players.get(ids[i]),
      all: this.players.values()
    });
  }
};

Game.prototype.roll = function () {
  var cards = generateRandom();
  var ids = this.players.keys();
  for (var i = 0; i < 4; ++i) {
    this.cards.set(ids[i], cards[i]);
    this.players.get(ids[i]).card = cards[i];
  }
}

Game.prototype.hideRestrictedCards = function () {
  this.players.get(this.cards.search('dakat')).card = "****";
  this.players.get(this.cards.search('chor')).card = "****";
}

Game.prototype.showRestrictedCards = function () {
  this.players.get(this.cards.search('dakat')).card = "dakat";
  this.players.get(this.cards.search('chor')).card = "chor";
}

Game.prototype.setTarget = function (target) {
  this.target = target.toLowerCase();
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    this.clients.get(ids[i]).emit('target-set', target);
  }
}

Game.prototype.checkTargetId = function (id) {
  var result;
  if (this.cards.get(id) == this.target)
    result = true;
  else
    result = false;

  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    this.clients.get(ids[i]).emit('targetid-callback', result);
  }

  this.updateScores(result);
  this.showRestrictedCards();
  this.sendState();
}

Game.prototype.updateScores = function (result) {
  var scores = new HashMap();
  scores.set('babu', 100);
  scores.set('pulish', 80);
  scores.set('dakat', 60);
  scores.set('chor', 40);

  if (result) {
    scores.set(this.target, 0);
  }
  else {
    scores.set('pulish', 0);
    scores.set(this.target, 80);
  }

  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    this.players.get(ids[i]).score += scores.get(this.cards.get(ids[i]));
  }
}

var generateRandom = function () {
  const cards = {
    1: 'babu',
    2: 'pulish',
    3: 'dakat',
    4: 'chor'
  }
  var arr = [];
  while (arr.length < 4) {
    var r = Math.floor(Math.random() * 4) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  var draw = arr.map(item => cards[item]);
  return draw;
}

module.exports = Game;
