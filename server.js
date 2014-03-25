var express = require('express');
var http = require('http');
var path = require('path');
var ws = require('ws');

var WEB_ROOT = 'public';
var STREAM_PORT = 8080;
var WEBSOCKET_PORT = 8081;

var socketServer = new (ws.Server)({ port: WEBSOCKET_PORT });
socketServer.on('connection', function (socket) {
  console.log('New WebSocket Connection (' + socketServer.clients.length + ' total)');

  socket.on('close', function (code, message) {
    console.log('Disconnected WebSocket (' + socketServer.clients.length + ' total)');
  });
});

socketServer.broadcast = function (data, opts) {
  for (var i in this.clients) {
    this.clients[i].send(data, opts);
  }
};

var app = express();
app.use(express.static(path.join(__dirname, WEB_ROOT)));

app.post('/', function (req, res) {
  var width = req.query['width'];
  var height = req.query['height'];

  console.log(
    'Stream Connected: ' + req.socket.remoteAddress +
    ':' + req.socket.remotePort + ' size: ' + width + 'x' + height
  );

  req.on('data', function (data) {
    console.log(data.length);
    socketServer.broadcast(data, { binary: true });
  });
});

http.createServer(app).listen(STREAM_PORT);

console.log('Listening for H.264 Stream on ' + STREAM_PORT);
console.log('Awaiting WebSocket connections on ' + WEBSOCKET_PORT);
