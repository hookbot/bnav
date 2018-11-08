import Server from './server';

let server = new Server();

server.start();

/*
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.connections = {};

io.on('connection', function (socket) {
    let id = socket.conn.id;
    console.log('[' + id + '] User connected!');
    app.connections[id] = { socket: socket };
    socket.on('disconnect', function () {
        console.log('[' + id + '] User disconnected!');
        delete app.connections[id];
    });
    socket.on('sendMessage', function (message) {
        console.log('[' + id + '] sendMessage: ' + message);
    });
    socket.emit('yourID', id);
});

server.listen(8000, function () {
    console.log(`Listening on ${server.address().port}`);
});
*/