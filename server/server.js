import express from 'express';
import http from 'http';
import io from 'socket.io';
import Game from './game';

class Server {
    constructor () {
        this.expressApp = express();

        this.httpServer = http.Server(this.expressApp);

        this.webSocketServer = io.listen(this.httpServer);

        this.game = new Game(this.webSocketServer);
    }

    initExpressApp () {
        this.expressApp.use(express.static(__dirname + '/public'));

        this.expressApp.get('/', (req, res) => {
            res.send({
                message: ''
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
                if (this.connections[id].userName) {
                    Object.values(this.connections).forEach((c) => {
                        if (c.userName) {
                            c.socket.emit('serverReport', '[' + this.connections[id].userName + '] ' + message);
                        }
                    });
                }
                else {
                    socket.emit('serverReport', 'ERROR! You first need to login using /login');
                }
            });

            socket.on('doLogin', (userName) => {
                console.log('[' + id + '] doLogin: ' + userName);
                if (this.connections[id].userName) {
                    console.log('[' + this.connections[id].userName + '] Ignoring relogin attempt as ' + userName);
                    socket.emit('serverReport', 'You are already logged in as ' + this.connections[id].userName);
                }
                else {
                    let taken = 0;
                    Object.values(this.connections).forEach((c) => {
                        if (c.userName &&
                            c.userName == userName) {
                            taken = 1;
                        }
                    });
                    if (taken) {
                        socket.emit('serverReport', 'Sorry, that username is already taken');
                    }
                    else {
                        Object.values(this.connections).forEach((c) => {
                            if (c.userName) {
                                c.socket.emit('serverReport', userName + ' just logged in! Welcome!');
                            }
                        });
                        this.connections[id].userName = userName;
                        this.game.addPlayer(userName);
                        socket.emit('yourUserName', userName);
                        console.log('[' + id + '] LOGGED IN AS [' + userName + ']');
                    }
                }
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
