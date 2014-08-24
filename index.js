var express = require('express'),
    app = express();

// Serving static client files
app.use(express.static(__dirname + '/client'));
app.listen(3000);

// Starting ws server
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 8080,
    });

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.dir(message);

        wss.broadcast(message);
    });
});