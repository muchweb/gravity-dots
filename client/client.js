var connection = new WebSocket('ws://localhost:8080', ['soap', 'xmpp']);



// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
    window.console.log(e.data);
    var coords = e.data.split('x'),
        context = canvas.getContext('2d'),
        rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FF0000";
    var x = coords[0] * canvas.width;
    var y = coords[1] * canvas.height;
    context.fillRect(x, y, 2, 2);
};

function writeMessage(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
    // ctx.fillStyle = "#FF0000";
    // ctx.fillRect(0, 0, 150,75);
}

var canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d');


// When the connection is open, send some data to the server
connection.onopen = function () {

};

canvas.addEventListener('mousemove', function(evt) {
    var rect = canvas.getBoundingClientRect();
    connection.send((evt.clientX / rect.width) + 'x' + (evt.clientY / rect.height));
}, false);