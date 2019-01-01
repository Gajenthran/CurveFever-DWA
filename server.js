var socketIO = require("socket.io");
var express  = require('express');
var http     = require('http');

var app      = express();
var server   = http.Server(app);
var io       = socketIO(server);


app.set('port', 8080);
app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));

var Game = require('./lib/Game');
var World = require('./lib/World');

var game = new Game();
game.init();

app.get('/', function(request, response) {
  response.render('public/index.html');
});

io.on('connection', (socket) => {
  listen(socket, 'new-player',    game.addNewPlayer.bind(game));
  listen(socket, 'player-action', game.updatePlayerInput.bind(game));
  listen(socket, 'disconnect',    game.removePlayer.bind(game));
  // socket.on('new-player', () => { game.addNewPlayer(socket); });
  // socket.on('player-action', (data) => { game.updatePlayerInput(socket, data); });
  // socket.on('disconnect', () => { game.removePlayer(socket); })
});

function listen(socket, type, callback) {
  socket.on(type, function(data) {
    callback(socket, data)
  });
}

setInterval(function() {
  game.update();
}, 1000 / 15);

server.listen(8080, function() {
  console.log('Starting server on port ' + 8080);
});