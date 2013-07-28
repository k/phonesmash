// create a random session ID and append it to the DOM
var sessionID = Math.round(Math.random()*6969).toString();
$('#session_id').append(sessionID);




var socket = io.connect('http://localhost');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});
