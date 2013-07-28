var socket = io.connect('/'),
		roomID = Math.round(Math.random()*6969).toString(),  // create a random session ID 
		players = [];

$('#session_id').append(roomID);

socket.on('user disconnected', function(data) {
    // remove user from data.username
    $('#'+data.username).remove();
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

	$('#compete_id').text(roomID);

	// give the new user a panel
	$('.player-list').append('<div class=\"panel player\" id=\'' + data.username + '\'><span class="name"></span><span class="time"></span><\/div>');
	$('#' + data.username + ' .name').append(data.username);
	$('#' + data.username + ' .time').append("0");

});


function compare(a,b) {
  if (a.time < b.time)
     return 1;
  if (a.time > b.time)
    return -1;
  return 0;
}

socket.on('started', function(data) {
	var start = new Date(),
			timer = setInterval(function() {
				console.log()
				$('#' + data.username).find('.time').text(new Date() - start);    				

			}, 10);

	socket.on('elapsed', function(data) {
		clearInterval(timer);

		$('#' + data.username).find('.time').text(data.elapsedTime);    				

		var currentIndex;

		// iterate to find the current players index
		for(var i = 0; i < players.length; i++) {
			if (players[i].username === data.username) {
				players[i]['time'] = data.elapsedTime;
			}
		}

		players = players.sort(compare);
		$('#highscore').text(players[0].time)

		$('.panel.player').remove();

		for(var i = 0; i < players.length; i++) {
			$('.player-list').append('<div class=\"panel player\" id=\'' + players[i].username + '\'><span class="name"></span><span class="time"></span><\/div>');
			$('#' + players[i].username + ' .name').append(players[i].username);
			$('#' + players[i].username + ' .time').append(players[i].time);
		}
	   
	});

});

