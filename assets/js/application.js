var socket = io.connect('/'),
		roomID = Math.round(Math.random()*6969).toString(),  // create a random session ID 
		players = [];

$('#session_id').append(roomID);

socket.on('user disconnected', function(data) {
    // remove user from data.username
    console.log(data);
});

// tell server that we want to join
socket.emit('desktopConnect', roomID);

// if join successful, log the success
socket.on('desktopReady', function(msg) {
	console.log(msg);
});

// once someone connects, change the page to the competition view
socket.on('mobileReady', function(data) {

	players.push(data);

	// change desktop view on first connection
	if (Object.keys(players).length === 1) {
		$('.homepage').hide();
		$('.compete').show();
	}

	// give the new user a panel
	$('.player-list').append('<div class=\"panel player\" id=\'' + data.username + '\'><span id="name"><span id="time"><\/div>');
	$('#' + data.username + ' #name').append(data.username);
	$('#' + data.username + ' #time').append("0");

});

function compare(a,b) {
  if (a.time < b.time)
     return -1;
  if (a.time > b.time)
    return 1;
  return 0;
}

socket.on('started', function(data) {
	var start = new Date(),
			timer = setTimeout(function() {
				$('#' + data.username).attr("#time", new Date() - start);    

			}, 100);

	socket.on('elapsed', function(data) {
		clearInterval(timer);

		var currentIndex;

		// iterate to find the current players index
		$.each(players, function(index, value) {		
			if (value.name === data.name) {
				currentIndex = index;
			}
		});

		// update the players index
		players[currentIndex].time = data.time

		players.sort(compare);

		$('.panel .player').remove();

		$.each(players, function(index, value) {		
			$('.player-list').append('<div class=\"panel player\" id=\'' + value.username + '\'><span id="name"><span id="time"><\/div>');
			$('#' + value.username + ' #name').append(value.username);
			$('#' + value.username + ' #time').append(value.time);
		});
	   
	});

});

