var connection = new WebSocket('ws://localhost:8080', [
        'soap',
        'xmpp',
    ]),
    Participant = function (id) {
        if (typeof id === 'undefined')
            id = null;

        this.id = id;
        this.x = 0;
        this.y = 0;
    },
    participants = {},
    me = null,
    canvas = document.getElementById('canvas-main'),
    context = canvas.getContext('2d'),
    rect = canvas.getBoundingClientRect();

// Log errors
connection.onerror = function (error) {
    window.alert('Count not connect to server! ' + error.message);
};

// Receiving messages from the server
connection.onmessage = function (event) {
    var data = JSON.parse(event.data);

    // Adding myself
    if (data.type === 'welcome') {
        me = new Participant(data.id);
    }

    if (data.type === 'update') {
        if (typeof participants[data.id] === 'undefined') {
            participants[data.id] = new Participant(data.id);
        }

        participants[data.id].x = data.x;
        participants[data.id].y = data.y;
    }

    draw();
};

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (n in participants) {
        if (participants.hasOwnProperty(n)) {
            context.fillStyle = "#FF0000";
            var x = participants[n].x * canvas.width;
            var y = participants[n].y * canvas.height;
            context.fillRect(x, y, 10, 10);
            context.font = '18pt Calibri';
            context.fillStyle = 'black';
            context.fillText(participants[n].id, x, y);
        }
    }

    writeMessage();
}

function writeMessage () {
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText('My id is' + me.id, 20, 20);
}



// When the connection is open, send some data to the server
connection.onopen = function () {
    canvas.addEventListener('mousemove', function (evt) {
        connection.send(JSON.stringify({
            x: evt.clientX / rect.width,
            y: evt.clientY / rect.height,
        }));
    }, false);
};