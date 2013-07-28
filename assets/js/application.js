var socket = io.connect('/');

// create a random session ID and append it to the DOM
var roomID = Math.round(Math.random()*6969).toString();
$('#session_id').append(roomID);

// tell server that we want to join
socket.emit('desktopConnect', roomID);

// if join successful, log the success
socket.on('desktopReady', function(msg){
	console.log(msg);
});

socket.on('started', function(time) {
    // update UI
});
socket.on('elapsed', function(time) {
    // update UI
});
