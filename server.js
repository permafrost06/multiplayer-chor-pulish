const DEV_MODE = process.argv.indexOf('--dev') != -1;
const PORT = process.env.PORT || 5000;

// Dependencies.
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const Game = require('./lib/Game');

// Initialization.
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var game = Game.create();

app.set('port', PORT);

io.on('connection', (socket) => {
  console.log("server.js: new connection " + socket.id);
  socket.on('player-join', () => {
    game.addNewPlayer(socket);
    console.log("server.js: new player: "+ socket.id)
    game.sendState();
  });

  socket.on('name-change', (name) => {
    console.log('server.js: name change received');
    game.changeName(socket.id, name);
    game.sendState();
  })

  socket.on('new-round', () => {
    console.log('server.js: new round start');
    game.roll();
    game.sendHiddenState();
    io.emit('round-start');
  });

  socket.on('target', (target) => {
    console.log('server.js: target set: '+target);
    game.setTarget(target);
  })

  socket.on('targetid', (id) => {
    console.log('server.js: targeted id: '+id);
    game.checkTargetId(id);
  })

  socket.on('disconnect', () => {
    game.removePlayer(socket.id);
    game.sendState();
    console.log("server.js: disconnected player: " + socket.id);
  })
});

server.listen(PORT, function () {
  console.log(`STARTING SERVER ON PORT ${PORT}`);
  if (DEV_MODE) {
    console.log('DEVELOPMENT MODE ENABLED')
  }
});
