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

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
draw();

// Log errors
connection.onerror = function (error) {
    window.alert('Coult not connect to server! ' + error.message);
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
};

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (n in participants) {
        if (participants.hasOwnProperty(n)) {
            var x = participants[n].x * canvas.width;
            var y = participants[n].y * canvas.height;
            context.fillRect(x - 5, y - 5, 10, 10);
            writeMessage(participants[n].id, x, y);

            context.strokeStyle = '#333';
            for (k in participants) {
                if (participants.hasOwnProperty(n)) {
                    context.beginPath();
                    context.moveTo(participants[n].x * canvas.width, participants[n].y * canvas.height);
                    context.lineTo(participants[k].x * canvas.width, participants[k].y * canvas.height);
                    context.stroke();
                }
            }
        }
    }

    if (me)
        writeMessage('My id is' + me.id);
    requestAnimationFrame(draw);
}

function writeMessage (message, x, y) {
    if (typeof x === 'undefined')
        x = 20;
    if (typeof y === 'undefined')
        y = 20;
    context.font = '12pt Monospace';
    context.fillStyle = '#888';
    context.fillText(message, x, y);
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