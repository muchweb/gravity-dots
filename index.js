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
    for (var i in this.clients)
        this.clients[i].send(data);
};

var counter = 0;
wss.on('connection', function (ws) {
    ws.id = counter;
    ws.send(JSON.stringify({
        type: 'welcome',
        id: ws.id,
    }));

    ws.on('message', function (message) {
        var data = JSON.parse(message);
        data.type = 'update';
        data.id = ws.id;
        wss.broadcast(JSON.stringify(data));
    });

    counter++;
});