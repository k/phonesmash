var socket = io.connect('http://localhost');

// create a random session ID and append it to the DOM
var roomID = Math.round(Math.random()*6969).toString();
$('#session_id').append(roomID);

// tell server that we want to join
socket.emit('desktopConnect', roomID)

// if join successful, log the success
socket.on('desktopReady', function(msg){
	console.log(msg);
})