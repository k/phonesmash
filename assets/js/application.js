var socket = io.connect('/');

// create a random session ID and append it to the DOM
var roomID = Math.round(Math.random()*6969).toString();
$('#session_id').append(roomID);

// tell server that we want to join
socket.emit('desktopConnect', roomID);

// if join successful, log the success
socket.on('desktopReady', function(msg) {
	console.log(msg);
});

var players = {}

// once someone connects, change the page to the competition view
socket.on('mobileReady', function(data) {

	players[data.username] = data;

	// change desktop view on first connection
	if (Object.keys(players).length === 1) {
		$('.homepage').hide();
		$('.compete').show();
	}

	// give the new user a panel
	$('.compete').append('<div class=\"panel\" id=\'' + data.username + '\' data=\'' + data + '\'><\/div>');

	$('#' + data.username).append(data.username);

	
	
});


socket.on('started', function(time) {
    // update UI
});
socket.on('elapsed', function(time) {
    // update UI
});
