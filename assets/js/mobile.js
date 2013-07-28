var socket = io.connect('http://phonesmash.herokuapp.com');

// gets called on mobile form submit
function joinSession(roomID) {
	if (roomID === "") {
			location.reload();
	} else {
			// tell the server we want to connect
			socket.emit('mobileConnect', roomID);
	}
};

// if join successful, log the success
socket.on('mobileReady', function(msg) {
	console.log(msg);
});