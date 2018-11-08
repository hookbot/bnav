import express from 'express';
import http from 'http';
import io from 'socket.io';

class Server {
    constructor () {
        this.expressApp = express();

        this.httpServer = http.Server(this.expressApp);

        this.webSocketServer = io.listen(this.httpServer);
    }

    initExpressApp () {
        this.expressApp.use(express.static(__dirname + '/public'));
 
        this.expressApp.get('/', (req, res) => {
            res.send({
                message: 'I am a server route and can also be hot reloaded!'
            });
        });
    }

    initWebSocketServer () {
        this.connections = {};

        this.webSocketServer.on('connection', (socket) => {
            let id = socket.conn.id;
            console.log('[' + id + '] User connected!');

            this.connections[id] = { socket: socket };

            socket.on('disconnect', () => {
                console.log('[' + id + '] User disconnected!');
                delete this.connections[id];
            });

            socket.on('sendMessage', (message) => {
                console.log('[' + id + '] sendMessage: ' + message);
            });

            socket.emit('yourID', id);
        });
    }

    startHTTPServer () {
        this.httpServer.listen(8000, () => {
            console.log(`Listening on ${this.httpServer.address().port}`);
        });
    }

    start () {
        this.initExpressApp();

        this.initWebSocketServer();

        this.startHTTPServer();
    }
}

export default Server;