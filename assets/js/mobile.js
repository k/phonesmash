// Insert some stuff

function joinSession(sessionID) {
	if (sessionID === "") {
		location.reload();
	} else {
		socket.emit('join', sessionID);
		console.log("here");
	}
};